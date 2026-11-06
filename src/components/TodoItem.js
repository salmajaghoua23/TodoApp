import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TodoItem({todo, onToggle, onEdit, onDelete}) {
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

  if (isEditing) {
    return (
      <View style={styles.row}>
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
          onPress={() => setIsEditing(false)}>
          <Text style={styles.cancel}>Annuler</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        testID={`toggle-${todo.id}`}
        style={styles.left}
        onPress={onToggle}>
        <View style={[styles.checkbox, todo.done && styles.checked]}>
          {todo.done && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={[styles.title, todo.done && styles.titleDone]}>
          {todo.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity testID={`edit-${todo.id}`} onPress={startEdit}>
        <Text style={styles.edit}>Modifier</Text>
      </TouchableOpacity>
      <TouchableOpacity testID={`delete-${todo.id}`} onPress={onDelete}>
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
    padding: 14,
    marginBottom: 8,
  },
  left: {flexDirection: 'row', alignItems: 'center', flex: 1},
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
  checked: {backgroundColor: '#4f46e5'},
  checkMark: {color: '#fff', fontWeight: 'bold'},
  title: {fontSize: 16, color: '#111827', flexShrink: 1},
  titleDone: {textDecorationLine: 'line-through', color: '#9ca3af'},
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#4f46e5',
    fontSize: 16,
    paddingVertical: 2,
  },
  edit: {color: '#4f46e5', fontWeight: '600', marginLeft: 10},
  delete: {color: '#dc2626', fontWeight: '600', marginLeft: 10},
  save: {color: '#16a34a', fontWeight: '600', marginLeft: 10},
  cancel: {color: '#6b7280', fontWeight: '600', marginLeft: 10},
});