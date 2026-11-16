import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS, load, remove, save } from '../src/v2/storage';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe('storage', () => {
  test('save puis load restitue la valeur', async () => {
    await save(KEYS.onboarded, true);
    expect(await load(KEYS.onboarded, false)).toBe(true);
  });

  test('load retourne la valeur par défaut si la clé est absente', async () => {
    expect(await load('@absent', 'defaut')).toBe('defaut');
  });

  test('les préférences sont séparées par utilisateur', async () => {
    await save(KEYS.prefs('a'), { notifications: false });
    expect(await load(KEYS.prefs('a'), null)).toEqual({ notifications: false });
    expect(await load(KEYS.prefs('b'), null)).toBeNull();
  });

  test('remove supprime la clé', async () => {
    await save('@k', 1);
    await remove('@k');
    expect(await load('@k', 'vide')).toBe('vide');
  });

  test('load ne plante pas si AsyncStorage échoue', async () => {
    jest
      .spyOn(AsyncStorage, 'getItem')
      .mockRejectedValueOnce(new Error('boom'));
    expect(await load('@k', 'secours')).toBe('secours');
  });
});
