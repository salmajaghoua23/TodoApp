/* eslint-env jest */
import './setupMocks';
import React from 'react';
import { Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import * as db from './mockSupabase';

const { act } = ReactTestRenderer;
let mounted = [];

export const textOf = n => {
  if (n === null || n === undefined || n === false) return '';
  if (typeof n === 'string' || typeof n === 'number') return String(n);
  if (Array.isArray(n)) {
    const parts = n.map(textOf);
    const simple = n.every(x => typeof x === 'string' || typeof x === 'number');
    return parts.join(simple ? '' : ' ');
  }
  return textOf(n.children);
};

export const screenText = r => textOf(r.toJSON());

export const flush = async () => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};

export const mount = async element => {
  jest.useRealTimers();
  let r;
  await act(async () => {
    r = ReactTestRenderer.create(element);
  });
  mounted.push(r);
  await flush();
  return r;
};

export const cleanup = async () => {
  for (const r of mounted) {
    await act(async () => {
      r.unmount();
    });
  }
  mounted = [];
};

export const has = (r, id) => r.root.findAllByProps({ testID: id }).length > 0;

export const byId = (r, id) => {
  const found = r.root.findAllByProps({ testID: id });
  if (found.length === 0) {
    throw new Error(
      `testID introuvable: "${id}"\nTexte affiché: ${screenText(r)}`,
    );
  }
  return found[0];
};

export const press = async (r, id) => {
  const node = byId(r, id);
  await act(async () => {
    node.props.onPress();
  });
  await flush();
};

export const type = async (r, id, text) => {
  const node = byId(r, id);
  await act(async () => {
    node.props.onChangeText(text);
  });
};

// --- Alert.alert ---
export const spyAlert = () =>
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
export const lastAlert = () => {
  const calls = Alert.alert.mock.calls;
  return calls[calls.length - 1];
};
export const pressAlertButton = async label => {
  const buttons = lastAlert()[2] || [];
  const btn = buttons.find(b => b.text === label);
  if (!btn) throw new Error(`Bouton d'alerte "${label}" introuvable`);
  await act(async () => {
    await btn.onPress();
  });
  await flush();
};

// --- scénarios ---
export const resetAll = async () => {
  db.__reset();
  await AsyncStorage.clear();
};

export const launchSignedIn = async ({
  name = 'Salma Jaghoua',
  email = 'salma@example.com',
  tasks = [],
} = {}) => {
  const id = db.__seedUser({ email, name });
  db.__setSession(id);
  db.__seedTasks(id, tasks);
  await AsyncStorage.setItem('@todov2/onboarded', 'true');
  const r = await mount(<App />);
  return { r, id };
};

export const launchSignedOut = async () => {
  await AsyncStorage.setItem('@todov2/onboarded', 'true');
  return mount(<App />);
};

export const launchFirstRun = async () => mount(<App />);
