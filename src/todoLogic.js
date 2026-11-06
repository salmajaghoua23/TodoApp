// Logique métier pure (facile à tester dans le pipeline CI)

let counter = 0;

const newId = () => `${Date.now()}-${counter++}`;

// ---------- Priorités ----------
export const PRIORITIES = {
  high: {
    key: 'high',
    label: 'Haute',
    weight: 3,
    color: '#dc2626',
  },
  medium: {
    key: 'medium',
    label: 'Moyenne',
    weight: 2,
    color: '#f59e0b',
  },
  low: {
    key: 'low',
    label: 'Basse',
    weight: 1,
    color: '#16a34a',
  },
};

// ---------- Dates (format interne : 'AAAA-MM-JJ') ----------
const pad = n => String(n).padStart(2, '0');

export function toDateString(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

export function addDays(n, from = new Date()) {
  return toDateString(
    new Date(from.getFullYear(), from.getMonth(), from.getDate() + n),
  );
}

export function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);

  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

export function formatDate(value) {
  if (!isValidDateString(value)) {
    return '';
  }

  const [y, m, d] = value.split('-');
  return `${d}/${m}/${y}`;
}

// ---------- Ajouter une tâche ----------
export function addTodo(todos, title, options = {}) {
  const clean = (title || '').trim();

  if (!clean) {
    return todos;
  }

  // Vérifier la priorité
  const priority = PRIORITIES[options.priority] ? options.priority : 'medium';

  // Vérifier la date limite
  const dueDate = isValidDateString(options.dueDate) ? options.dueDate : null;

  // Créer et retourner la nouvelle tâche
  return [
    {
      id: newId(),
      title: clean,
      done: false,
      priority,
      dueDate,
    },
    ...todos,
  ];
}

// ---------- Marquer une tâche comme terminée ----------
export function toggleTodo(todos, id) {
  return todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));
}

// ---------- Modifier une tâche ----------
export function editTodo(todos, id, newTitle) {
  const clean = (newTitle || '').trim();

  if (!clean) {
    return todos;
  }

  return todos.map(t => (t.id === id ? { ...t, title: clean } : t));
}

// ---------- Supprimer une tâche ----------
export function deleteTodo(todos, id) {
  return todos.filter(t => t.id !== id);
}

// ---------- Filtrer les tâches ----------
export function filterTodos(todos, filter) {
  if (filter === 'active') {
    return todos.filter(t => !t.done);
  }

  if (filter === 'done') {
    return todos.filter(t => t.done);
  }

  return todos;
}

// ---------- Vérifier si une tâche est en retard ----------
export function isOverdue(todo, today = toDateString()) {
  return !todo.done && !!todo.dueDate && todo.dueDate < today;
}

// ---------- Trier les tâches ----------
export function sortTodos(todos) {
  const weight = t => (PRIORITIES[t.priority] || PRIORITIES.medium).weight;

  return [...todos].sort((a, b) => {
    // Les tâches non terminées apparaissent en premier
    if (a.done !== b.done) {
      return a.done ? 1 : -1;
    }

    // Trier par priorité : haute, moyenne, basse
    if (weight(a) !== weight(b)) {
      return weight(b) - weight(a);
    }

    // Trier par date limite
    if (a.dueDate && b.dueDate) {
      return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
    }

    if (a.dueDate) {
      return -1;
    }

    if (b.dueDate) {
      return 1;
    }

    return 0;
  });
}

// ---------- Statistiques ----------
export function getStats(todos, today = toDateString()) {
  const total = todos.length;

  const done = todos.filter(t => t.done).length;

  const active = total - done;

  const overdue = todos.filter(t => isOverdue(t, today)).length;

  const dueToday = todos.filter(t => !t.done && t.dueDate === today).length;

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  const byPriority = {
    high: 0,
    medium: 0,
    low: 0,
  };

  todos.forEach(t => {
    if (!t.done && byPriority[t.priority] !== undefined) {
      byPriority[t.priority] += 1;
    }
  });

  return {
    total,
    done,
    active,
    overdue,
    dueToday,
    completionRate,
    byPriority,
  };
}

// ---------- Statistiques détaillées (écran Statistiques) ----------
export function getDetailedStats(todos, today = toDateString()) {
  const [y, m, d] = today.split('-').map(Number);
  const weekLimit = addDays(7, new Date(y, m - 1, d));

  const byPriority = {};
  Object.keys(PRIORITIES).forEach(k => {
    byPriority[k] = { total: 0, done: 0, active: 0 };
  });

  const deadlines = { overdue: 0, today: 0, week: 0, later: 0, none: 0 };

  todos.forEach(t => {
    const p = byPriority[t.priority];
    if (p) {
      p.total += 1;
      if (t.done) {
        p.done += 1;
      } else {
        p.active += 1;
      }
    }

    if (t.done) {
      return;
    }

    if (!t.dueDate) {
      deadlines.none += 1;
    } else if (t.dueDate < today) {
      deadlines.overdue += 1;
    } else if (t.dueDate === today) {
      deadlines.today += 1;
    } else if (t.dueDate <= weekLimit) {
      deadlines.week += 1;
    } else {
      deadlines.later += 1;
    }
  });

  return { byPriority, deadlines };
}
