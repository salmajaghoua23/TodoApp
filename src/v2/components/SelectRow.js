import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import Icon from './Icon';

// Ligne type "Select Priority  ⌄" utilisée dans l'écran Add Task.
export default function SelectRow({ icon, label, placeholder, onPress, chevron = true }) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.row} onPress={onPress}>
      <Icon name={icon} size={18} style={{ marginRight: 12 }} />
      <Text style={[styles.txt, !label && { color: colors.muted }]} numberOfLines={1}>
        {label || placeholder}
      </Text>
      {chevron ? <Icon name="down" size={18} color={colors.text} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  txt: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
});
