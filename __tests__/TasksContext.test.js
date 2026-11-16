import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TasksProvider, useTasks } from '../src/v2/context/TasksContext';
import { supabase } from '../src/v2/supabase';

jest.mock('../src/v2/supabase', () => ({ supabase: { from: jest.fn() } }));
jest.mock('../src/v2/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

const row = (over = {}) => ({
  id: 't1',
  title: 'Acheter du lait',
  description: null,
  priority: 'High',
  due_date: '2026-11-20',
  category: 'Personal',
  completed: false,
  created_at: '2026-11-16T10:00:00Z',
  ...over,
});

let api;
let renderer;
const Probe = () => {
  api = useTasks();
  return null;
};

const mount = async rows => {
  supabase.from.mockImplementation(() => ({
    select: () => ({
      order: () => Promise.resolve({ data: rows, error: null }),
    }),
    insert: p => ({
      select: () => ({
        single: () =>
          Promise.resolve({ data: row({ ...p, id: 'new' }), error: null }),
      }),
    }),
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
  }));
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <TasksProvider>
        <Probe />
      </TasksProvider>,
    );
  });
};

afterEach(async () => {
  await ReactTestRenderer.act(async () => renderer?.unmount());
  jest.clearAllMocks();
});

describe('TasksContext', () => {
  test('charge les tâches et convertit snake_case -> camelCase', async () => {
    await mount([row()]);
    expect(api.loading).toBe(false);
    expect(api.tasks).toHaveLength(1);
    expect(api.tasks[0]).toMatchObject({
      id: 't1',
      title: 'Acheter du lait',
      description: '',
      dueDate: '2026-11-20',
      completed: false,
    });
  });

  test('calcule les statistiques', async () => {
    await mount([
      row({ id: 'a', completed: true }),
      row({ id: 'b', priority: 'High' }),
      row({ id: 'c', priority: 'Low' }),
    ]);
    expect(api.stats).toEqual({ total: 3, done: 1, pending: 2, important: 1 });
  });

  test('addTask ajoute la tâche en tête de liste', async () => {
    await mount([row()]);
    await ReactTestRenderer.act(async () => {
      await api.addTask({ title: '  Nouvelle  ' });
    });
    expect(api.tasks).toHaveLength(2);
    expect(api.tasks[0].id).toBe('new');
    expect(api.tasks[0].title).toBe('Nouvelle');
  });

  test('toggleTask inverse l’état terminé', async () => {
    await mount([row()]);
    await ReactTestRenderer.act(async () => api.toggleTask('t1'));
    expect(api.tasks[0].completed).toBe(true);
  });

  test('deleteTask retire la tâche', async () => {
    await mount([row()]);
    await ReactTestRenderer.act(async () => api.deleteTask('t1'));
    expect(api.tasks).toHaveLength(0);
  });

  test('clearCompleted ne garde que les tâches non terminées', async () => {
    await mount([row({ id: 'a', completed: true }), row({ id: 'b' })]);
    await ReactTestRenderer.act(async () => api.clearCompleted());
    expect(api.tasks.map(t => t.id)).toEqual(['b']);
  });

  test('updateTask revient en arrière si le serveur refuse', async () => {
    await mount([row()]);
    supabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => Promise.resolve({ error: { message: 'RLS' } }),
      }),
    }));
    await ReactTestRenderer.act(async () => {
      await expect(api.updateTask('t1', { title: 'X' })).rejects.toThrow('RLS');
    });
    expect(api.tasks[0].title).toBe('Acheter du lait');
  });
});
