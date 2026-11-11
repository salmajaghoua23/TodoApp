import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRIORITIES } from '../todoLogic';

export default function PrioritySelector({ value, onChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Priorité :</Text>
      {Object.values(PRIORITIES).map(p => {
        const selected = value === p.key;
        return (
          <TouchableOpacity
            key={p.key}
            testID={`priority-${p.key}`}
            style={[
              styles.chip,
              { borderColor: p.color },
              selected && { backgroundColor: p.color },
            ]}
            onPress={() => onChange(p.key)}
          >
            <Text style={[styles.chipText, selected && styles.chipTextOn]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  label: { color: '#374151', marginRight: 8, fontWeight: '600' },
  chip: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 6,
    backgroundColor: '#fff',
  },
  chipText: { color: '#374151' },
  chipTextOn: { color: '#fff', fontWeight: 'bold' },
});
