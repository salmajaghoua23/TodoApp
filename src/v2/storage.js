import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  users: '@todov2/users',
  session: '@todov2/session',
  onboarded: '@todov2/onboarded',
  tasks: id => `@todov2/tasks/${id}`,
  prefs: id => `@todov2/prefs/${id}`,
};

export async function load(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function save(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
}
