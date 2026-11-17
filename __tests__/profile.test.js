import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactTestRenderer from 'react-test-renderer';
import {
  byId,
  cleanup,
  launchSignedIn,
  lastAlert,
  press,
  pressAlertButton,
  resetAll,
  screenText,
  spyAlert,
  type,
} from '../test-utils/render';
import * as db from '../test-utils/mockSupabase';

beforeEach(async () => {
  await resetAll();
  spyAlert();
});
afterEach(cleanup);

describe('Profil et paramètres', () => {
  test("affiche le nom, les initiales et l'email", async () => {
    const { r } = await launchSignedIn({ name: 'Salma Jaghoua' });
    await press(r, 'tab-Profile');
    expect(screenText(r)).toContain('Salma Jaghoua');
    expect(screenText(r)).toContain('SJ');
    expect(screenText(r)).toContain('salma@example.com');
  });

  test('modifier le nom dans Settings', async () => {
    const { r } = await launchSignedIn({ name: 'Salma Jaghoua' });
    await press(r, 'tab-Profile');
    await press(r, 'profile-settings');
    await type(r, 'settings-name', 'Salma J.');
    await press(r, 'settings-save');

    expect(lastAlert()[0]).toBe('Saved');
    expect(db.__users()[0].user_metadata.full_name).toBe('Salma J.');
    await press(r, 'header-back');
    await press(r, 'tab-Profile');
    expect(screenText(r)).toContain('Salma J.');
  });

  test('interrupteur Notifications sauvegardé', async () => {
    const { r, id } = await launchSignedIn();
    await press(r, 'tab-Profile');
    await ReactTestRenderer.act(async () => {
      byId(r, 'profile-notifications').props.onValueChange(false);
    });
    expect(await AsyncStorage.getItem(`@todov2/prefs/${id}`)).toBe(
      '{"notifications":false}',
    );
  });

  test('About App', async () => {
    const { r } = await launchSignedIn();
    await press(r, 'tab-Profile');
    await press(r, 'profile-about');
    expect(screenText(r)).toContain('Version 2.0.0');
  });

  test('My Tasks ouvre la liste complète', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'Une tâche' }] });
    await press(r, 'tab-Profile');
    await press(r, 'profile-tasks');
    expect(screenText(r)).toContain('Une tâche');
  });

  test('Settings : supprimer les tâches terminées', async () => {
    const { r } = await launchSignedIn({
      tasks: [{ title: 'Faite', completed: true }, { title: 'À faire' }],
    });
    await press(r, 'tab-Profile');
    await press(r, 'profile-settings');
    expect(screenText(r)).toContain('Clear completed tasks (1)');

    await press(r, 'settings-clear');
    await pressAlertButton('Delete');
    expect(db.__tasks().map(t => t.title)).toEqual(['À faire']);
  });
});
