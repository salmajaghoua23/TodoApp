import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRIORITIES, formatDate, isOverdue } from '../todoLogic';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const priority = PRIORITIES[todo.priority] || PRIORITIES.medium;
  const overdue = isOverdue(todo);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const startEdit = () => {
    setDraft(todo.title);
    setIsEditing(true);
  };

  const save = () => {
    onEdit(draft);
    setIsEditing(false);
  };
  const confirmDelete = () => {
    Alert.alert(
      'Supprimer la tâche',
      `Voulez-vous vraiment supprimer « ${todo.title} » ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: onDelete },
      ],
    );
  };
  if (isEditing) {
    return (
      <View style={[styles.row, { borderLeftColor: priority.color }]}>
        <TextInput
          testID={`edit-input-${todo.id}`}
          style={styles.editInput}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={save}
          autoFocus
        />
        <TouchableOpacity testID={`save-${todo.id}`} onPress={save}>
          <Text style={styles.save}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID={`cancel-${todo.id}`}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.cancel}>Annuler</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.row, { borderLeftColor: priority.color }]}>
      <TouchableOpacity
        testID={`toggle-${todo.id}`}
        style={styles.left}
        onPress={onToggle}
      >
        <View style={[styles.checkbox, todo.done && styles.checked]}>
          {todo.done && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <View style={styles.texts}>
          <Text style={[styles.title, todo.done && styles.titleDone]}>
            {todo.title}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.badge, { backgroundColor: priority.color }]}>
              {priority.label}
            </Text>
            {!!todo.dueDate && (
              <Text style={[styles.date, overdue && styles.dateOverdue]}>
                {overdue ? 'En retard · ' : 'Avant le '}
                {formatDate(todo.dueDate)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity testID={`edit-${todo.id}`} onPress={startEdit}>
        <Text style={styles.edit}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity testID={`delete-${todo.id}`} onPress={confirmDelete}>
        <Text style={styles.delete}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderLeftWidth: 5,
    padding: 14,
    marginBottom: 8,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  texts: { flex: 1 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checked: { backgroundColor: '#4f46e5' },
  checkMark: { color: '#fff', fontWeight: 'bold' },
  title: { fontSize: 16, color: '#111827', flexShrink: 1 },
  titleDone: { textDecorationLine: 'line-through', color: '#9ca3af' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  badge: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  date: { fontSize: 12, color: '#6b7280' },
  dateOverdue: { color: '#dc2626', fontWeight: '600' },
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#4f46e5',
    fontSize: 16,
    paddingVertical: 2,
  },
  edit: { color: '#4f46e5', fontWeight: '600', marginLeft: 10 },
  delete: { color: '#dc2626', fontWeight: '600', marginLeft: 10 },
  save: { color: '#16a34a', fontWeight: '600', marginLeft: 10 },
  cancel: { color: '#6b7280', fontWeight: '600', marginLeft: 10 },
});
