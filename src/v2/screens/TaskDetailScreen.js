import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { useTasks } from '../context/TasksContext';
import { useNav } from '../NavContext';
import { formatLong } from '../utils/date';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Header, Screen } from '../components/Screen';
import { PriorityChip } from '../components/TaskItem';

export default function TaskDetailScreen({ params }) {
  const nav = useNav();
  const { tasks, toggleTask, deleteTask } = useTasks();
  const task = tasks.find(t => t.id === params.taskId);

  if (!task) {
    return (
      <Screen bg="#fff">
        <Header title="Task" onBack={nav.goBack} />
        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.muted }}>This task no longer exists.</Text>
      </Screen>
    );
  }

  const remove = () =>
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteTask(task.id); nav.goBack(); } },
    ]);

  return (
    <Screen bg="#fff">
      <Header title="" onBack={nav.goBack} right="dots" onRight={() => nav.navigate('AddTask', { taskId: task.id })} />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={styles.rocket}><Text style={{ fontSize: 44 }}>🚀</Text></View>
          <Text style={[styles.title, task.completed && { textDecorationLine: 'line-through', color: colors.muted }]}>{task.title}</Text>
          <View style={{ marginTop: 10 }}><PriorityChip priority={task.priority} large /></View>
          {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}
        </View>

        <View style={styles.rows}>
          <View style={styles.row}>
            <Icon name="calendar" size={16} style={{ width: 28 }} />
            <Text style={styles.lbl}>Due Date</Text>
            <Text style={styles.val}>{formatLong(task.dueDate)}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="folder" size={16} style={{ width: 28 }} />
            <Text style={styles.lbl}>Category</Text>
            <Text style={[styles.val, { color: colors.primary }]}>{task.category}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="clock" size={16} style={{ width: 28 }} />
            <Text style={styles.lbl}>Status</Text>
            <Text style={[styles.val, { color: task.completed ? colors.success : colors.warning }]}>{task.completed ? 'Completed' : 'Pending'}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 8 }}>
          <Button
            title={task.completed ? 'Mark as Pending' : 'Mark as Completed'}
            right={task.completed ? undefined : '✓'}
            onPress={() => toggleTask(task.id)}
          />
          <Button variant="outline" title="Edit Task" left="✏️" onPress={() => nav.navigate('AddTask', { taskId: task.id })} />
          <Button variant="danger" title="Delete Task" left="🗑" onPress={remove} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rocket: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 12 },
  desc: { fontSize: 15, color: colors.muted, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  rows: { marginTop: 22, marginBottom: 18, borderTopWidth: 1, borderTopColor: '#EEEAFB' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: '#EEEAFB' },
  lbl: { flex: 1, color: colors.text, fontSize: 15 },
  val: { fontWeight: '700', color: colors.text, fontSize: 15 },
});
