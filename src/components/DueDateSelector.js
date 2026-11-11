import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addDays, isValidDateString } from '../todoLogic';

const QUICK = [
  { key: 'none', label: 'Aucune', get: () => '' },
  { key: 'today', label: "Aujourd'hui", get: () => addDays(0) },
  { key: 'tomorrow', label: 'Demain', get: () => addDays(1) },
  { key: 'week', label: '+7 jours', get: () => addDays(7) },
];

export default function DueDateSelector({ value, onChange }) {
  const invalid = value.length > 0 && !isValidDateString(value);
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>Échéance :</Text>
        {QUICK.map(q => {
          const selected = q.get() === value;
          return (
            <TouchableOpacity
              key={q.key}
              testID={`due-${q.key}`}
              style={[styles.chip, selected && styles.chipOn]}
              onPress={() => onChange(q.get())}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {q.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TextInput
        testID="due-input"
        style={[styles.input, invalid && styles.inputInvalid]}
        placeholder="ou saisir une date : AAAA-MM-JJ"
        value={value}
        onChangeText={onChange}
        maxLength={10}
        keyboardType="numbers-and-punctuation"
      />
      {invalid && (
        <Text style={styles.error}>Date invalide (format AAAA-MM-JJ)</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  label: { color: '#374151', marginRight: 8, fontWeight: '600' },
  chip: {
    borderWidth: 1.5,
    borderColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  chipOn: { backgroundColor: '#4f46e5' },
  chipText: { color: '#374151' },
  chipTextOn: { color: '#fff', fontWeight: 'bold' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 4,
  },
  inputInvalid: { borderColor: '#dc2626' },
  error: { color: '#dc2626', fontSize: 12, marginTop: 2 },
});
