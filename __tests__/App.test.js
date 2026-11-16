import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
        return Promise.resolve();
      }),
    },
  };
});

const allText = r =>
  r.root
    .findAllByType(Text)
    .map(node => [].concat(node.props.children).join(''))
    .join('|');

let renderer;

const renderApp = async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
};

afterEach(async () => {
  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
});

test("l'application s'affiche correctement", async () => {
  await renderApp();
  const text = allText(renderer);
  expect(text).toContain('Ma Todo List');
  expect(text).toContain('Aucune tâche pour le moment.');
});

test('ajoute une tâche via le champ de saisie', async () => {
  await renderApp();

  const input = renderer.root.findAllByProps({ testID: 'todo-input' })[0];
  await ReactTestRenderer.act(async () => {
    input.props.onChangeText('Ma première tâche');
  });

  const button = renderer.root.findAllByProps({ testID: 'add-button' })[0];
  await ReactTestRenderer.act(async () => {
    button.props.onPress();
  });

  expect(allText(renderer)).toContain('Ma première tâche');
});