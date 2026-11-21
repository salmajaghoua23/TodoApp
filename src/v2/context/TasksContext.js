import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { KEYS, load, save } from '../storage';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

const TasksContext = createContext(null);
export const useTasks = () => useContext(TasksContext);

// Ligne SQL (snake_case) -> objet utilisé par les écrans (camelCase)
const toTask = r => ({
  id: r.id,
  title: r.title,
  description: r.description || '',
  priority: r.priority,
  dueDate: r.due_date || null,
  category: r.category,
  completed: !!r.completed,
  createdAt: new Date(r.created_at).getTime(),
});

const toRow = p => {
  const row = {};
  if ('title' in p) row.title = p.title.trim();
  if ('description' in p) row.description = (p.description || '').trim();
  if ('priority' in p) row.priority = p.priority;
  if ('dueDate' in p) row.due_date = p.dueDate || null;
  if ('category' in p) row.category = p.category;
  if ('completed' in p) row.completed = p.completed;
  return row;
};

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const prefsKey = KEYS.prefs(user.id);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotificationsState] = useState(true);
  const ref = useRef([]);

  const apply = useCallback(next => {
    ref.current = next;
    setTasks(next);
  }, []);


const refresh = useCallback(async () => {
  setError(null);

  try {
    const { data, error: err } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      throw new Error(err.message);
    }

    apply((data || []).map(toTask));
  } catch (err) {
    setError(err.message || 'Unable to load tasks.');
  } finally {
    setLoading(false);
  }
}, [apply]);



useEffect(() => {
  let active = true;

  const initialize = async () => {
    try {
      await refresh();

      const p = await load(prefsKey, { notifications: true });

      if (active) {
        setNotificationsState(p.notifications !== false);
      }
    } catch (err) {
      if (active) {
        setError(err.message || 'Unable to load preferences.');
      }
    }
  };

  initialize();

  return () => {
    active = false;
  };
}, [refresh, prefsKey]);


  const addTask = useCallback(
    async d => {
      const { data, error: err } = await supabase
        .from('tasks')
        .insert({
          title: d.title.trim(),
          description: (d.description || '').trim(),
          priority: d.priority || 'Medium',
          due_date: d.dueDate || null,
          category: d.category || 'Personal',
        })
        .select()
        .single();
      if (err) throw new Error(err.message);
      const t = toTask(data);
      apply([t, ...ref.current]);
      return t;
    },
    [apply],
  );

  // Mise à jour optimiste : l'écran change tout de suite, retour arrière si le serveur refuse.
  const updateTask = useCallback(
    async (id, patch) => {
      const prev = ref.current;
      apply(prev.map(t => (t.id === id ? { ...t, ...patch } : t)));
      const { error: err } = await supabase
        .from('tasks')
        .update(toRow(patch))
        .eq('id', id);
      if (err) {
        apply(prev);
        throw new Error(err.message);
      }
    },
    [apply],
  );

  const toggleTask = useCallback(
    async id => {
      const t = ref.current.find(x => x.id === id);
      if (!t) return;
      try {
        await updateTask(id, { completed: !t.completed });
      } catch (e) {
        Alert.alert('Error', e.message);
      }
    },
    [updateTask],
  );

  const deleteTask = useCallback(
    async id => {
      const prev = ref.current;
      apply(prev.filter(t => t.id !== id));
      const { error: err } = await supabase.from('tasks').delete().eq('id', id);
      if (err) {
        apply(prev);
        Alert.alert('Error', err.message);
      }
    },
    [apply],
  );

  const clearCompleted = useCallback(async () => {
    const prev = ref.current;
    apply(prev.filter(t => !t.completed));
    const { error: err } = await supabase
      .from('tasks')
      .delete()
      .eq('completed', true);
    if (err) {
      apply(prev);
      Alert.alert('Error', err.message);
    }
  }, [apply]);


const setNotifications = useCallback(
  v => {
    setNotificationsState(v);

    save(prefsKey, { notifications: v }).catch(saveError => {
      console.error('Saving notification preferences failed:', saveError);
    });
  },
  [prefsKey],
);


  const stats = useMemo(() => {
    const done = tasks.filter(t => t.completed).length;
    return {
      total: tasks.length,
      done,
      pending: tasks.length - done,
      important: tasks.filter(t => t.priority === 'High' && !t.completed)
        .length,
    };
  }, [tasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        refresh,
        stats,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        clearCompleted,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
