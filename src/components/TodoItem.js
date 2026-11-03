import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function TodoItem({todo, onToggle, onDelete}) {
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
    justifyContent: 'space-between',
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
  delete: {color: '#dc2626', fontWeight: '600', marginLeft: 10},
});
