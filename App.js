import React, {useState, useMemo} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TodoItem from './src/components/TodoItem';
import {
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  filterTodos,
} from './src/todoLogic';
const FILTERS = [
  {key: 'all', label: 'Toutes'},
  {key: 'active', label: 'À faire'},
  {key: 'done', label: 'Terminées'},
];

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  const visibleTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);
  const remaining = todos.filter(t => !t.done).length;

  const handleAdd = () => {
    setTodos(current => addTodo(current, text));
    setText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <View style={styles.header}>
        <Text style={styles.title}>Ma Todo List</Text>
        <Text style={styles.subtitle} testID="counter">
          {remaining} tâche(s) restante(s)
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          testID="todo-input"
          style={styles.input}
          placeholder="Nouvelle tâche..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          testID="add-button"
          style={styles.addButton}
          onPress={handleAdd}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            testID={`filter-${f.key}`}
            style={[styles.filterBtn, filter === f.key && styles.filterActive]}
            onPress={() => setFilter(f.key)}>
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={visibleTodos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune tâche pour le moment.</Text>
        }
        renderItem={({item}) => (
          <TodoItem
            todo={item}
            onToggle={() => setTodos(c => toggleTodo(c, item.id))}
            onEdit={newTitle => setTodos(c => editTodo(c, item.id, newTitle))}
            onDelete={() => setTodos(c => deleteTodo(c, item.id))}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f3f4f6'},
  header: {backgroundColor: '#4f46e5', padding: 20, paddingTop: 28},
  title: {color: '#fff', fontSize: 26, fontWeight: 'bold'},
  subtitle: {color: '#c7d2fe', marginTop: 4},
  inputRow: {flexDirection: 'row', padding: 16},
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    marginLeft: 10,
  },
  addButtonText: {color: '#fff', fontWeight: 'bold'},
  filters: {flexDirection: 'row', justifyContent: 'center', marginBottom: 8},
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: '#e5e7eb',
  },
  filterActive: {backgroundColor: '#4f46e5'},
  filterText: {color: '#374151'},
  filterTextActive: {color: '#fff', fontWeight: 'bold'},
  list: {paddingHorizontal: 16, paddingBottom: 24},
  empty: {textAlign: 'center', color: '#9ca3af', marginTop: 40},
});
