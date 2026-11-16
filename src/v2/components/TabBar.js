import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import Icon from './Icon';

const TABS = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'Search', label: 'Search', icon: 'search' },
  { name: 'Calendar', label: 'Calendar', icon: 'calendar' },
  { name: 'Profile', label: 'Profile', icon: 'profile' },
];

export default function TabBar({ active, onChange }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(t => {
        const on = t.name === active;
        return (
          <TouchableOpacity key={t.name} style={styles.item} onPress={() => onChange(t.name)}>
            <Icon name={t.icon} size={22} style={{ opacity: on ? 1 : 0.55 }} />
            <Text style={[styles.label, on && { color: colors.primary, fontWeight: '800' }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#EEEAFB', paddingTop: 8 },
  item: { flex: 1, alignItems: 'center' },
  label: { fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: '600' },
});
