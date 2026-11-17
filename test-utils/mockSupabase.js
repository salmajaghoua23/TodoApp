/* eslint-env jest */
// Faux Supabase en mémoire : auth (email/mot de passe) + table "tasks".
// Aucun réseau, aucune clé. Utilisé via test-utils/setupMocks.js.

const fresh = () => ({
  users: [],
  session: null,
  tasks: [],
  seq: 0,
  confirmEmail: false,
  failNext: null,
});

let state = fresh();
const listeners = new Set();

const emit = event => listeners.forEach(cb => cb(event, state.session));
const publicUser = u => ({
  id: u.id,
  email: u.email,
  user_metadata: { ...u.user_metadata },
});
const isoFor = seq => new Date(2026, 10, 16, 12, 0, seq).toISOString();

const auth = {
  getSession: async () => ({ data: { session: state.session } }),

  onAuthStateChange: cb => {
    listeners.add(cb);
    return {
      data: { subscription: { unsubscribe: () => listeners.delete(cb) } },
    };
  },

  signUp: async ({ email, password, options }) => {
    if (state.users.some(u => u.email === email)) {
      return {
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      };
    }
    state.seq += 1;
    const user = {
      id: `u${state.seq}`,
      email,
      password,
      user_metadata: { ...(options && options.data) },
    };
    state.users.push(user);
    if (state.confirmEmail) {
      return { data: { user: publicUser(user), session: null }, error: null };
    }
    state.session = { user: publicUser(user) };
    emit('SIGNED_IN');
    return {
      data: { user: publicUser(user), session: state.session },
      error: null,
    };
  },

  signInWithPassword: async ({ email, password }) => {
    const user = state.users.find(
      u => u.email === email && u.password === password,
    );
    if (!user) {
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      };
    }
    state.session = { user: publicUser(user) };
    emit('SIGNED_IN');
    return {
      data: { user: publicUser(user), session: state.session },
      error: null,
    };
  },

  signOut: async () => {
    state.session = null;
    emit('SIGNED_OUT');
    return { error: null };
  },

  updateUser: async ({ data }) => {
    if (!state.session)
      return { data: { user: null }, error: { message: 'not authenticated' } };
    const user = state.users.find(u => u.id === state.session.user.id);
    user.user_metadata = { ...user.user_metadata, ...data };
    state.session = { user: publicUser(user) };
    emit('USER_UPDATED');
    return { data: { user: state.session.user }, error: null };
  },
};

const guard = () => {
  if (state.failNext) {
    const message = state.failNext;
    state.failNext = null;
    return { message };
  }
  if (!state.session) return { message: 'not authenticated' };
  return null;
};

function from(table) {
  if (table !== 'tasks') throw new Error(`Table inconnue: ${table}`);
  const q = {
    op: 'select',
    filters: [],
    payload: null,
    single: false,
    order: null,
  };

  const run = () => {
    const err = guard();
    if (err) return { data: null, error: err };
    const uid = state.session.user.id; // simule la règle RLS
    const matches = row => q.filters.every(([c, v]) => row[c] === v);

    if (q.op === 'insert') {
      state.seq += 1;
      const row = {
        id: `t${state.seq}`,
        user_id: uid,
        description: '',
        priority: 'Medium',
        due_date: null,
        category: 'Personal',
        completed: false,
        created_at: isoFor(state.seq),
        ...q.payload,
      };
      state.tasks.push(row);
      return { data: q.single ? { ...row } : [{ ...row }], error: null };
    }
    if (q.op === 'update') {
      state.tasks
        .filter(r => r.user_id === uid && matches(r))
        .forEach(r => Object.assign(r, q.payload));
      return { data: null, error: null };
    }
    if (q.op === 'delete') {
      state.tasks = state.tasks.filter(r => !(r.user_id === uid && matches(r)));
      return { data: null, error: null };
    }
    const rows = state.tasks
      .filter(r => r.user_id === uid && matches(r))
      .map(r => ({ ...r }));
    if (q.order) {
      const dir = q.order[1] && q.order[1].ascending === false ? -1 : 1;
      const col = q.order[0];
      rows.sort((a, b) => {
        if (a[col] === b[col]) return 0;
        return a[col] > b[col] ? dir : -dir;
      });
    }
    return { data: rows, error: null };
  };

  const builder = {
    select: () => builder,
    insert: p => {
      q.op = 'insert';
      q.payload = p;
      return builder;
    },
    update: p => {
      q.op = 'update';
      q.payload = p;
      return builder;
    },
    delete: () => {
      q.op = 'delete';
      return builder;
    },
    eq: (c, v) => {
      q.filters.push([c, v]);
      return builder;
    },
    order: (c, o) => {
      q.order = [c, o];
      return builder;
    },
    single: () => {
      q.single = true;
      return builder;
    },
    then: (resolve, reject) => Promise.resolve(run()).then(resolve, reject),
  };
  return builder;
}

module.exports = {
  supabase: { auth, from },
  // --- aides pour les tests ---
  __reset: () => {
    state = fresh();
    listeners.clear();
  },
  __confirmEmail: v => {
    state.confirmEmail = v;
  },
  __failNext: message => {
    state.failNext = message;
  },
  __seedUser: ({ email, password = 'secret12', name }) => {
    state.seq += 1;
    const user = {
      id: `u${state.seq}`,
      email,
      password,
      user_metadata: name ? { full_name: name } : {},
    };
    state.users.push(user);
    return user.id;
  },
  __setSession: id => {
    const user = state.users.find(u => u.id === id);
    state.session = { user: publicUser(user) };
  },
  __seedTasks: (userId, list) => {
    list.forEach(t => {
      state.seq += 1;
      state.tasks.push({
        id: `t${state.seq}`,
        user_id: userId,
        description: '',
        priority: 'Medium',
        due_date: null,
        category: 'Personal',
        completed: false,
        created_at: isoFor(state.seq),
        ...t,
      });
    });
  },
  __tasks: () => state.tasks.map(t => ({ ...t })),
  __users: () =>
    state.users.map(u => ({ ...u, user_metadata: { ...u.user_metadata } })),
  __session: () => state.session,
};
