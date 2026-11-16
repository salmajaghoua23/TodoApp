import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, priorityStyle } from '../theme';
import { formatShort } from '../utils/date';
import Icon from './Icon';

export function PriorityChip({ priority, large }) {
  const p = priorityStyle[priority] || priorityStyle.Medium;
  return (
    <View style={[styles.chip, { backgroundColor: p.bg }, large && { paddingHorizontal: 14, paddingVertical: 4 }]}>
      <Text style={[styles.chipTxt, { color: p.fg }, large && { fontSize: 13 }]}>{priority}</Text>
    </View>
  );
}

export default function TaskItem({ task, onToggle, onPress, onMenu }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.row} onPress={onPress}>
      <TouchableOpacity onPress={onToggle} hitSlop={10} style={[styles.box, task.completed && styles.boxDone]}>
        {task.completed ? <Text style={styles.tick}>✓</Text> : null}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={2}>{task.title}</Text>
        <View style={styles.meta}>
          {!task.completed ? <PriorityChip priority={task.priority} /> : null}
          <Icon name="calendar" size={13} style={{ marginHorizontal: 6 }} />
          <Text style={styles.date}>{formatShort(task.dueDate)}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onMenu} hitSlop={10} style={{ paddingLeft: 10 }}>
        <Icon name="dots" size={22} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EEEAFB' },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: colors.border, marginRight: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  boxDone: { backgroundColor: colors.success, borderColor: colors.success },
  tick: { color: '#fff', fontWeight: '900', fontSize: 14 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  date: { fontSize: 12, color: colors.muted },
  chip: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  chipTxt: { fontSize: 11, fontWeight: '700' },
});
