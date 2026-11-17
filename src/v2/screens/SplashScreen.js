import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import Button from '../components/Button';
import { Screen } from '../components/Screen';

export default function SplashScreen({ onStart }) {
  return (
    <Screen bg="#fff">
      <View style={styles.top} />
      <View style={styles.center}>
        <View style={styles.logo}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.name}>TodoApp</Text>
        <Text style={styles.tag}>Plan • Organize • Achieve</Text>
        <View style={styles.clip}>
          <Text style={{ fontSize: 90 }}>📋</Text>
          <Text style={styles.clock}>🕒</Text>
        </View>
      </View>
      <View style={{ padding: 28 }}>
        <Button
          testID="get-started"
          title="Get Started"
          right="→"
          onPress={onStart}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: colors.primarySoft,
    borderBottomRightRadius: 160,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: '#fff', fontSize: 46, fontWeight: '900' },
  name: { fontSize: 38, fontWeight: '800', color: colors.text, marginTop: 18 },
  tag: { fontSize: 16, color: colors.muted, marginTop: 6, fontWeight: '600' },
  clip: {
    marginTop: 40,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: { position: 'absolute', right: 22, bottom: 26, fontSize: 44 },
});
