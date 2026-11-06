import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

const allText = renderer =>
  renderer.root
    .findAllByType(Text)
    .map(node => [].concat(node.props.children).join(''))
    .join('|');

test("l'application s'affiche correctement", async () => {
  let renderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const text = allText(renderer);
  expect(text).toContain('Ma Todo List');
  expect(text).toContain('Aucune tâche pour le moment.');
});

test('ajoute une tâche via le champ de saisie', async () => {
  let renderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const input = renderer.root.findByProps({ testID: 'todo-input' });
  await ReactTestRenderer.act(() => {
    input.props.onChangeText('Ma première tâche');
  });
  const button = renderer.root.findByProps({ testID: 'add-button' });
  await ReactTestRenderer.act(() => {
    button.props.onPress();
  });
  expect(allText(renderer)).toContain('Ma première tâche');
});
