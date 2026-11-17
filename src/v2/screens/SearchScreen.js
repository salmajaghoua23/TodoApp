import React, { useMemo, useState } from 'react';
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
import Field from '../components/Field';
import { Screen } from '../components/Screen';
import TaskItem from '../components/TaskItem';
import useTaskMenu from '../components/useTaskMenu';

const FILTERS = ['All', 'Pending', 'Completed', 'Important'];

export default function SearchScreen({ params }) {
  const nav = useNav();
  const { tasks, toggleTask } = useTasks();
  const openMenu = useTaskMenu();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(
    FILTERS.includes(params.filter) ? params.filter : 'All',
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(t => {
      if (filter === 'Pending' && t.completed) return false;
      if (filter === 'Completed' && !t.completed) return false;
      if (filter === 'Important' && (t.priority !== 'High' || t.completed))
        return false;
      if (
        q &&
        !`${t.title} ${t.description} ${t.category}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [tasks, query, filter]);

  return (
    <Screen>
      <View style={{ padding: 16, paddingBottom: 6 }}>
        <Field
          testID="search-input"
          icon="search"
          placeholder="Search tasks..."
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 8,
          }}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              testID={`filter-${f}`}
              onPress={() => setFilter(f)}
              style={[styles.chip, filter === f && styles.chipOn]}
            >
              <Text style={[styles.chipTxt, filter === f && { color: '#fff' }]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {list.length === 0 ? (
            <Text style={styles.empty}>No tasks found.</Text>
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
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { color: colors.text, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    ...shadow,
  },
  empty: { padding: 28, textAlign: 'center', color: colors.muted },
});
