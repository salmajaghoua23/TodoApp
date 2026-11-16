import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../theme';
import { useNav } from '../NavContext';
import { Header, Screen } from '../components/Screen';

export default function AboutScreen() {
  const nav = useNav();
  return (
    <Screen bg="#fff">
      <Header title="About App" onBack={nav.goBack} />
      <View style={{ alignItems: 'center', padding: 30 }}>
        <View style={{ width: 84, height: 84, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 46, fontWeight: '900' }}>✓</Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 16 }}>TodoApp</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Version 2.0.0</Text>
        <Text style={{ textAlign: 'center', color: colors.text, marginTop: 20, lineHeight: 22 }}>
          Plan • Organize • Achieve.{'\n'}Une application React Native pour gérer vos tâches avec priorités, catégories, dates d'échéance et profil utilisateur.
        </Text>
      </View>
    </Screen>
  );
}
