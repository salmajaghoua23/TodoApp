import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CATEGORIES, PRIORITIES, colors } from '../theme';
import { useTasks } from '../context/TasksContext';
import { useNav } from '../NavContext';
import { formatShort } from '../utils/date';
import Button from '../components/Button';
import DateModal from '../components/DateModal';
import Field from '../components/Field';
import PickerModal from '../components/PickerModal';
import { Header, Screen } from '../components/Screen';
import SelectRow from '../components/SelectRow';

export default function AddTaskScreen({ params }) {
  const nav = useNav();
  const { tasks, addTask, updateTask } = useTasks();
  const editing = params.taskId
    ? tasks.find(t => t.id === params.taskId)
    : null;

  const [title, setTitle] = useState(editing ? editing.title : '');
  const [description, setDescription] = useState(
    editing ? editing.description : '',
  );
  const [priority, setPriority] = useState(editing ? editing.priority : null);
  const [dueDate, setDueDate] = useState(editing ? editing.dueDate : null);
  const [category, setCategory] = useState(editing ? editing.category : null);
  const [modal, setModal] = useState(null); // 'priority' | 'date' | 'category'

  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a task title.');
      return;
    }
    const data = {
      title,
      description,
      priority: priority || 'Medium',
      dueDate,
      category: category || 'Personal',
    };
    setSaving(true);
    try {
      if (editing) await updateTask(editing.id, data);
      else await addTask(data);
      nav.goBack();
    } catch (e) {
      setSaving(false);
      Alert.alert('Error', e.message);
    }
  };

  return (
    <Screen bg="#fff">
      <Header title={editing ? 'Edit Task' : 'Add Task'} onBack={nav.goBack} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 70 }}>📝</Text>
            <Text style={styles.h}>
              {editing ? 'Update your task' : 'Create a New Task'}
            </Text>
            <Text style={styles.sub}>
              {editing
                ? 'Make your changes below'
                : 'Add a task and stay productive!'}
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <Field
              testID="task-title"
              icon="pencil"
              placeholder="Task title..."
              value={title}
              onChangeText={setTitle}
            />
            <Field
              testID="task-description"
              icon="list"
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              inputStyle={{ minHeight: 60, textAlignVertical: 'top' }}
            />
            <SelectRow
              testID="select-priority"
              icon="flag"
              label={priority}
              placeholder="Select Priority"
              onPress={() => setModal('priority')}
            />
            <SelectRow
              testID="select-date"
              icon="calendar"
              label={dueDate ? formatShort(dueDate) : null}
              placeholder="Set Due Date"
              chevron={false}
              onPress={() => setModal('date')}
            />
            <SelectRow
              testID="select-category"
              icon="grid"
              label={category}
              placeholder="Select Category"
              onPress={() => setModal('category')}
            />
          </View>

          <Button
            testID="task-save"
            title={editing ? 'Save Changes' : 'Add Task'}
            onPress={save}
            loading={saving}
            style={{ marginTop: 22 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <PickerModal
        visible={modal === 'priority'}
        title="Select Priority"
        options={PRIORITIES}
        selected={priority}
        onClose={() => setModal(null)}
        onSelect={v => {
          setPriority(v);
          setModal(null);
        }}
      />
      <PickerModal
        visible={modal === 'category'}
        title="Select Category"
        options={CATEGORIES}
        selected={category}
        onClose={() => setModal(null)}
        onSelect={v => {
          setCategory(v);
          setModal(null);
        }}
      />
      <DateModal
        visible={modal === 'date'}
        value={dueDate}
        onClose={() => setModal(null)}
        onSelect={v => {
          setDueDate(v);
          setModal(null);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 6 },
  sub: { fontSize: 14, color: colors.muted, marginTop: 4 },
});
