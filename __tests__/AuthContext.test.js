import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AuthProvider, useAuth } from '../src/v2/context/AuthContext';
import { supabase } from '../src/v2/supabase';

jest.mock('../src/v2/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

let auth;
let renderer;
const Probe = () => {
  auth = useAuth();
  return null;
};

const mount = async (session = null) => {
  supabase.auth.getSession.mockResolvedValue({ data: { session } });
  supabase.auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
  });
};

afterEach(async () => {
  await ReactTestRenderer.act(async () => renderer?.unmount());
  jest.clearAllMocks();
});

describe('AuthContext', () => {
  test('démarre sans utilisateur et devient prêt', async () => {
    await mount();
    expect(auth.ready).toBe(true);
    expect(auth.user).toBeNull();
  });

  test('restaure la session Supabase existante', async () => {
    await mount({
      user: {
        id: 'u1',
        email: 'salma@test.com',
        user_metadata: { full_name: 'Salma' },
      },
    });
    expect(auth.user).toEqual({
      id: 'u1',
      email: 'salma@test.com',
      name: 'Salma',
    });
  });

  test('le nom par défaut vient de l’email', async () => {
    await mount({ user: { id: 'u1', email: 'salma@test.com' } });
    expect(auth.user.name).toBe('salma');
  });

  test('signIn refuse un email invalide ou un mot de passe vide', async () => {
    await mount();
    await expect(auth.signIn({ email: 'abc', password: 'x' })).rejects.toThrow(
      'valid email',
    );
    await expect(
      auth.signIn({ email: 'a@b.co', password: '' }),
    ).rejects.toThrow('password');
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  test('signIn normalise l’email et appelle Supabase', async () => {
    await mount();
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
    await auth.signIn({ email: '  Salma@Test.COM ', password: 'secret1' });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'salma@test.com',
      password: 'secret1',
    });
  });

  test('signIn traduit les erreurs Supabase en message lisible', async () => {
    await mount();
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });
    await expect(
      auth.signIn({ email: 'a@b.co', password: 'bad' }),
    ).rejects.toThrow('Incorrect email or password.');
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Email not confirmed' },
    });
    await expect(
      auth.signIn({ email: 'a@b.co', password: 'bad' }),
    ).rejects.toThrow('confirm your email');
  });

  test('signUp valide le nom, l’email et la longueur du mot de passe', async () => {
    await mount();
    await expect(
      auth.signUp({ name: '', email: 'a@b.co', password: '123456' }),
    ).rejects.toThrow('name');
    await expect(
      auth.signUp({ name: 'S', email: 'nope', password: '123456' }),
    ).rejects.toThrow('valid email');
    await expect(
      auth.signUp({ name: 'S', email: 'a@b.co', password: '123' }),
    ).rejects.toThrow('6 characters');
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  test('signUp indique needsConfirmation quand il n’y a pas de session', async () => {
    await mount();
    supabase.auth.signUp.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    await expect(
      auth.signUp({ name: 'S', email: 'a@b.co', password: '123456' }),
    ).resolves.toEqual({
      needsConfirmation: true,
    });
    supabase.auth.signUp.mockResolvedValue({
      data: { session: {} },
      error: null,
    });
    await expect(
      auth.signUp({ name: 'S', email: 'a@b.co', password: '123456' }),
    ).resolves.toEqual({
      needsConfirmation: false,
    });
  });

  test('signOut vide l’utilisateur', async () => {
    await mount({ user: { id: 'u1', email: 'a@b.co' } });
    supabase.auth.signOut.mockResolvedValue({});
    await ReactTestRenderer.act(async () => auth.signOut());
    expect(auth.user).toBeNull();
  });

  test('finishOnboarding marque l’onboarding comme terminé', async () => {
    await mount();
    expect(auth.onboarded).toBe(false);
    await ReactTestRenderer.act(async () => auth.finishOnboarding());
    expect(auth.onboarded).toBe(true);
  });

  test('updateName met à jour le profil', async () => {
    await mount({ user: { id: 'u1', email: 'a@b.co' } });
    supabase.auth.updateUser.mockResolvedValue({
      data: {
        user: {
          id: 'u1',
          email: 'a@b.co',
          user_metadata: { full_name: 'Nouveau' },
        },
      },
      error: null,
    });
    await ReactTestRenderer.act(async () => auth.updateName('Nouveau'));
    expect(auth.user.name).toBe('Nouveau');
  });
});
