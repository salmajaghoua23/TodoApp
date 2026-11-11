import {
  addTodo,
  toggleTodo,
  editTodo,
  deleteTodo,
  filterTodos,
  sortTodos,
  isOverdue,
  getStats,
  getDetailedStats,
  isValidDateString,
  formatDate,
  addDays,
} from '../src/todoLogic';

describe('priorité, échéance et statistiques', () => {
  test('priorité moyenne et pas de date par défaut', () => {
    const [t] = addTodo([], 'A');
    expect(t.priority).toBe('medium');
    expect(t.dueDate).toBeNull();
  });

  test('enregistre la priorité et la date limite', () => {
    const [t] = addTodo([], 'A', { priority: 'high', dueDate: '2030-01-15' });
    expect(t.priority).toBe('high');
    expect(t.dueDate).toBe('2030-01-15');
  });

  test('ignore une priorité ou une date invalide', () => {
    const [t] = addTodo([], 'A', { priority: 'urgent', dueDate: '2030-02-31' });
    expect(t.priority).toBe('medium');
    expect(t.dueDate).toBeNull();
  });

  test('valide et formate les dates', () => {
    expect(isValidDateString('2030-01-15')).toBe(true);
    expect(isValidDateString('15/01/2030')).toBe(false);
    expect(formatDate('2030-01-15')).toBe('15/01/2030');
    expect(addDays(0, new Date(2030, 0, 31))).toBe('2030-01-31');
    expect(addDays(1, new Date(2030, 0, 31))).toBe('2030-02-01');
  });

  test('détecte une tâche en retard', () => {
    const late = { done: false, dueDate: '2020-01-01' };
    expect(isOverdue(late, '2020-01-02')).toBe(true);
    expect(isOverdue(late, '2020-01-01')).toBe(false);
    expect(isOverdue({ ...late, done: true }, '2020-01-02')).toBe(false);
    expect(isOverdue({ done: false, dueDate: null }, '2020-01-02')).toBe(false);
  });

  test('trie par statut, priorité puis échéance', () => {
    const todos = [
      { id: '1', done: false, priority: 'low', dueDate: null },
      { id: '2', done: false, priority: 'high', dueDate: '2030-05-01' },
      { id: '3', done: false, priority: 'high', dueDate: '2030-01-01' },
      { id: '4', done: true, priority: 'high', dueDate: null },
    ];
    expect(sortTodos(todos).map(t => t.id)).toEqual(['3', '2', '1', '4']);
  });

  test('calcule les statistiques', () => {
    const todos = [
      { done: true, priority: 'high', dueDate: null },
      { done: false, priority: 'high', dueDate: '2020-01-01' },
      { done: false, priority: 'low', dueDate: '2020-01-02' },
      { done: false, priority: 'medium', dueDate: null },
    ];
    const s = getStats(todos, '2020-01-02');
    expect(s.total).toBe(4);
    expect(s.done).toBe(1);
    expect(s.active).toBe(3);
    expect(s.overdue).toBe(1);
    expect(s.dueToday).toBe(1);
    expect(s.completionRate).toBe(25);
    expect(s.byPriority).toEqual({ high: 1, medium: 1, low: 1 });
  });

  test('statistiques sur liste vide', () => {
    expect(getStats([]).completionRate).toBe(0);
  });

  test('statistiques détaillées par priorité et échéance', () => {
    const todos = [
      { done: true, priority: 'high', dueDate: '2026-11-01' },
      { done: false, priority: 'high', dueDate: '2026-11-01' },
      { done: false, priority: 'high', dueDate: '2026-11-06' },
      { done: false, priority: 'medium', dueDate: '2026-11-13' },
      { done: false, priority: 'low', dueDate: '2026-11-14' },
      { done: false, priority: 'low', dueDate: null },
    ];
    const s = getDetailedStats(todos, '2026-11-06');
    expect(s.byPriority.high).toEqual({ total: 3, done: 1, active: 2 });
    expect(s.byPriority.low).toEqual({ total: 2, done: 0, active: 2 });
    expect(s.deadlines).toEqual({
      overdue: 1,
      today: 1,
      week: 1,
      later: 1,
      none: 1,
    });
  });

  test('statistiques détaillées sur liste vide', () => {
    const s = getDetailedStats([], '2026-11-06');
    expect(s.deadlines).toEqual({
      overdue: 0,
      today: 0,
      week: 0,
      later: 0,
      none: 0,
    });
    expect(s.byPriority.high).toEqual({ total: 0, done: 0, active: 0 });
  });
});
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
