import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

export default function PickerModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {options.map(opt => {
            const active = opt === selected;
            return (
              <TouchableOpacity key={opt} style={[styles.opt, active && styles.optActive]} onPress={() => onSelect(opt)}>
                <Text style={[styles.optTxt, active && { color: colors.primary }]}>{opt}</Text>
                {active ? <Text style={{ color: colors.primary, fontWeight: '800' }}>✓</Text> : null}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(20,12,60,0.45)', justifyContent: 'center', padding: 28 },
  sheet: { backgroundColor: '#fff', borderRadius: 20, padding: 18 },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 10 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  optActive: { backgroundColor: colors.primarySoft },
  optTxt: { fontSize: 16, color: colors.text, fontWeight: '600' },
});
