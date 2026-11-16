import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Field from '../components/Field';
import { Screen } from '../components/Screen';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      if (isLogin) {
        await signIn({ email, password });
      } else {
        const res = await signUp({ name, email, password });
        if (res.needsConfirmation) {
          setBusy(false);
          setMode('login');
          setPassword('');
          Alert.alert('Check your email', 'We sent you a confirmation link. Confirm your email, then sign in.');
        }
      }
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const google = () =>
    Alert.alert(
      'Google Sign-In',
      'Pas encore activé. Il faudrait configurer le provider Google dans Supabase (Authentication > Providers) + un lien de retour (deep link) dans l\'app.',
    );

  return (
    <Screen bg="#fff">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}><Text style={styles.check}>✓</Text></View>
          <Text style={styles.title}>{isLogin ? 'Welcome Back 👋' : 'Create Account ✨'}</Text>
          <Text style={styles.sub}>{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</Text>

          <View style={{ width: '100%', marginTop: 28, gap: 14 }}>
            {!isLogin ? <Field icon="user" placeholder="Full name" value={name} onChangeText={setName} /> : null}
            <Field icon="mail" placeholder="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <Field
              icon="lock"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!show}
              autoCapitalize="none"
              right={show ? 'eyeOff' : 'eye'}
              onRightPress={() => setShow(!show)}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={submit} loading={busy} style={{ width: '100%', marginTop: 22 }} />

          <View style={styles.orRow}>
            <View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} />
          </View>

          <Button variant="light" title="Continue with Google" left="G" onPress={google} style={{ width: '100%' }} />

          <View style={{ flexDirection: 'row', marginTop: 26 }}>
            <Text style={{ color: colors.text }}>{isLogin ? "Don't have an account? " : 'Already have an account? '}</Text>
            <TouchableOpacity onPress={() => { setMode(isLogin ? 'signup' : 'login'); setError(''); }}>
              <Text style={{ color: colors.primary, fontWeight: '800' }}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logo: { width: 76, height: 76, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  check: { color: '#fff', fontSize: 42, fontWeight: '900' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 20 },
  sub: { fontSize: 15, color: colors.muted, marginTop: 6 },
  error: { color: colors.danger, marginTop: 14, fontWeight: '600', textAlign: 'center' },
  orRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 18 },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { marginHorizontal: 12, color: colors.muted },
});
