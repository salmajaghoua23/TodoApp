import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  onboarded: '@todov2/onboarded',
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
