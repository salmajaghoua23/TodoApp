import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { Screen } from '../components/Screen';

export default function SetupScreen() {
  return (
    <Screen bg="#fff">
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={{ fontSize: 54 }}>🔧</Text>
        <Text style={styles.title}>Configure Supabase</Text>
        <Text style={styles.p}>Ouvrez le fichier</Text>
        <View style={styles.code}><Text style={styles.codeTxt}>src/v2/config.js</Text></View>
        <Text style={styles.p}>
          et remplacez SUPABASE_URL et SUPABASE_KEY par les valeurs de votre projet (Dashboard → Project Settings → API).
          Utilisez la clé publique (publishable / anon), jamais la clé secrète.
        </Text>
        <Text style={styles.p}>Puis exécutez supabase/schema.sql dans le SQL Editor et rechargez l'app.</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginVertical: 12 },
  p: { fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22, marginTop: 6 },
  code: { backgroundColor: colors.primarySoft, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginVertical: 8 },
  codeTxt: { color: colors.primary, fontWeight: '700' },
});
