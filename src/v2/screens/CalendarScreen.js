import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, shadow } from '../theme';
import { useTasks } from '../context/TasksContext';
import { useNav } from '../NavContext';
import {
  DAYS,
  addDaysKey,
  formatLong,
  parseKey,
  todayKey,
} from '../utils/date';
import { Screen } from '../components/Screen';
import TaskItem from '../components/TaskItem';
import useTaskMenu from '../components/useTaskMenu';

export default function CalendarScreen() {
  const nav = useNav();
  const { tasks, toggleTask } = useTasks();
  const openMenu = useTaskMenu();
  const [selected, setSelected] = useState(todayKey());
  const days = Array.from({ length: 14 }, (_, i) => addDaysKey(i));
  const list = tasks.filter(t => t.dueDate === selected);

  return (
    <Screen>
      <Text style={styles.title}>Calendar</Text>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {days.map(k => {
            const d = parseKey(k);
            const on = k === selected;
            const count = tasks.filter(
              t => t.dueDate === k && !t.completed,
            ).length;
            return (
              <TouchableOpacity
                key={k}
                testID={`day-${k}`}
                onPress={() => setSelected(k)}
                style={[styles.day, on && styles.dayOn]}
              >
                <Text style={[styles.dow, on && { color: '#fff' }]}>
                  {DAYS[d.getDay()]}
                </Text>
                <Text style={[styles.num, on && { color: '#fff' }]}>
                  {d.getDate()}
                </Text>
                <View
                  style={[
                    styles.dot,
                    {
                      opacity: count ? 1 : 0,
                      backgroundColor: on ? '#fff' : colors.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sel}>{formatLong(selected)}</Text>
        <View style={styles.card}>
          {list.length === 0 ? (
            <Text style={styles.empty}>Nothing planned for this day 🎉</Text>
          ) : (
            list.map(t => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={() => toggleTask(t.id)}
                onPress={() => nav.navigate('TaskDetail', { taskId: t.id })}
                onMenu={() => openMenu(t)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    padding: 18,
    paddingBottom: 12,
  },
  day: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dow: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  num: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 2,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    ...shadow,
  },
  empty: { padding: 28, textAlign: 'center', color: colors.muted },
});
