// Logique métier pure (facile à tester dans le pipeline CI)

let counter = 0;
const newId = () => `${Date.now()}-${counter++}`;

export function addTodo(todos, title) {
  const clean = (title || '').trim();
  if (!clean) {
    return todos;
  }
  return [{id: newId(), title: clean, done: false}, ...todos];
}

export function toggleTodo(todos, id) {
  return todos.map(t => (t.id === id ? {...t, done: !t.done} : t));
}
export function editTodo(todos, id, newTitle) {
  const clean = (newTitle || '').trim();
  if (!clean) {
    return todos;
  }
  return todos.map(t => (t.id === id ? {...t, title: clean} : t));
}
export function deleteTodo(todos, id) {
  return todos.filter(t => t.id !== id);
}

export function filterTodos(todos, filter) {
  if (filter === 'active') {
    return todos.filter(t => !t.done);
  }
  if (filter === 'done') {
    return todos.filter(t => t.done);
  }
  return todos;
}
