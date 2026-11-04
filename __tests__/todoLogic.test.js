import {addTodo, toggleTodo,editTodo, deleteTodo, filterTodos} from '../src/todoLogic';

describe('todoLogic', () => {
  test('ajoute une tâche', () => {
    const r = addTodo([], 'Acheter du pain');
    expect(r).toHaveLength(1);
    expect(r[0].title).toBe('Acheter du pain');
    expect(r[0].done).toBe(false);
  });

  test('ignore une tâche vide', () => {
    expect(addTodo([], '   ')).toHaveLength(0);
    expect(addTodo([], undefined)).toHaveLength(0);
  });

  test('bascule une tâche en terminée', () => {
    const [t] = addTodo([], 'A');
    expect(toggleTodo([t], t.id)[0].done).toBe(true);
  });

  test('supprime une tâche', () => {
    const [t] = addTodo([], 'A');
    expect(deleteTodo([t], t.id)).toHaveLength(0);
  });

  test('filtre les tâches', () => {
    let todos = addTodo([], 'A');
    todos = addTodo(todos, 'B');
    todos = toggleTodo(todos, todos[0].id);
    expect(filterTodos(todos, 'all')).toHaveLength(2);
    expect(filterTodos(todos, 'done')).toHaveLength(1);
    expect(filterTodos(todos, 'active')).toHaveLength(1);
  });
    test('modifie le titre', () => {
      const [t] = addTodo([], 'Ancien');
      const r = editTodo([t], t.id, '  Nouveau  ');
      expect(r[0].title).toBe('Nouveau');
    });

    test('refuse un titre modifié vide', () => {
      const [t] = addTodo([], 'Ancien');
      expect(editTodo([t], t.id, '   ')[0].title).toBe('Ancien');
    });

});
