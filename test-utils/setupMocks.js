/* eslint-env jest */
// Importé en premier par les tests : remplace AsyncStorage, safe-area, config et Supabase.

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  const api = {
    getItem: jest.fn(key => Promise.resolve(store[key] ?? null)),
    setItem: jest.fn((key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store = {};
      return Promise.resolve();
    }),
  };
  return { __esModule: true, default: api };
});

jest.mock('react-native-safe-area-context', () => {
  const R = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => R.createElement(View, null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('../src/v2/config', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_KEY: 'test-key',
  isConfigured: true,
}));

jest.mock('../src/v2/supabase', () => require('./mockSupabase'));
