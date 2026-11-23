import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { KEYS, load, save } from '../storage';
import { supabase } from '../supabase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;

  const email = value.trim();

  if (/\s/.test(email)) return false;

  const atIndex = email.indexOf('@');

  if (
    atIndex <= 0 ||
    atIndex !== email.lastIndexOf('@') ||
    atIndex === email.length - 1
  ) {
    return false;
  }

  const domain = email.slice(atIndex + 1);
  const labels = domain.split('.');

  return (
    labels.length >= 2 &&
    labels.every(label => label.length > 0) &&
    labels[labels.length - 1].length >= 2
  );
};

const mapUser = u =>
  u
    ? {
        id: u.id,
        email: u.email,
        name:
          (u.user_metadata && u.user_metadata.full_name) ||
          (u.email || '').split('@')[0],
      }
    : null;

function friendly(error) {
  const m = (error && error.message) || 'Something went wrong.';
  if (/invalid login credentials/i.test(m))
    return 'Incorrect email or password.';
  if (/email not confirmed/i.test(m))
    return 'Please confirm your email first (check your inbox).';
  if (/already registered/i.test(m))
    return 'An account with this email already exists.';
  if (/network request failed|failed to fetch/i.test(m))
    return 'Network error. Check your internet connection.';
  return m;
}

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [user, setUser] = useState(null);


 useEffect(() => {
  let alive = true;

  const initialize = async () => {
    try {
      const ob = await load(KEYS.onboarded, false);
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (!alive) return;

      setOnboarded(!!ob);
      setUser(mapUser(data.session && data.session.user));
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      if (alive) {
        setReady(true);
      }
    }
  };

  initialize().catch((err) => {
    console.error('Initialization failed:', err);
  });

  const { data: sub } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (alive) {
        setUser(mapUser(session && session.user));
      }
    },
  );

  return () => {
    alive = false;
    sub.subscription.unsubscribe();
  };
 }, []);


  const finishOnboarding = useCallback(async () => {
    setOnboarded(true);
    await save(KEYS.onboarded, true);
  }, []);

  // Retourne { needsConfirmation: true } si Supabase exige la confirmation par email.
  const signUp = useCallback(async ({ name, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!name || !name.trim()) throw new Error('Please enter your name.');
    if (!isValidEmail(cleanEmail))
      throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6)
      throw new Error('Password must be at least 6 characters.');
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { full_name: name.trim() } },
    });
    if (error) throw new Error(friendly(error));
    if (!data.session) return { needsConfirmation: true };
    return { needsConfirmation: false };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail))
      throw new Error('Please enter a valid email address.');
    if (!password) throw new Error('Please enter your password.');
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error) throw new Error(friendly(error));
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateName = useCallback(async name => {
    if (!name || !name.trim()) return;
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });
    if (error) throw new Error(friendly(error));
    setUser(mapUser(data.user));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ready,
        onboarded,
        user,
        finishOnboarding,
        signUp,
        signIn,
        signOut,
        updateName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
