import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';
import { addDaysKey, formatShort, isValidKey, todayKey } from '../utils/date';
import Button from './Button';
import Field from './Field';

// Sélecteur de date sans dépendance native : raccourcis + saisie AAAA-MM-JJ.
export default function DateModal({ visible, value, onSelect, onClose }) {
  const [text, setText] = useState(value || '');
  useEffect(() => {
    if (visible) setText(value || '');
  }, [visible, value]);

  const quick = [
    { label: 'Today', key: todayKey() },
    { label: 'Tomorrow', key: addDaysKey(1) },
    { label: 'In 3 days', key: addDaysKey(3) },
    { label: 'Next week', key: addDaysKey(7) },
  ];
  const valid = isValidKey(text);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>Set Due Date</Text>
          <View style={styles.chips}>
            {quick.map(q => (
              <TouchableOpacity key={q.label} style={[styles.chip, value === q.key && styles.chipActive]} onPress={() => onSelect(q.key)}>
                <Text style={[styles.chipTxt, value === q.key && { color: '#fff' }]}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Or type a date (YYYY-MM-DD)</Text>
          <Field value={text} onChangeText={setText} placeholder="2026-11-25" keyboardType="numbers-and-punctuation" maxLength={10} />
          <Button title="Confirm date" disabled={!valid} onPress={() => onSelect(text)} style={{ marginTop: 12 }} />
          <TouchableOpacity onPress={() => onSelect(null)} style={{ alignItems: 'center', marginTop: 14 }}>
            <Text style={{ color: colors.muted, fontWeight: '600' }}>No due date {value ? `(current: ${formatShort(value)})` : ''}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(20,12,60,0.45)', justifyContent: 'center', padding: 28 },
  sheet: { backgroundColor: '#fff', borderRadius: 20, padding: 18 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: colors.primarySoft },
  chipActive: { backgroundColor: colors.primary },
  chipTxt: { color: colors.primary, fontWeight: '700' },
  hint: { marginTop: 16, marginBottom: 8, color: colors.muted, fontSize: 13 },
});
