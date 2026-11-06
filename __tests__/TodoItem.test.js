import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import TodoItem from '../src/components/TodoItem';

const todo = {id: '1', title: 'Réviser', done: false};

test('modifier une tâche appelle onEdit avec le nouveau titre', async () => {
  const onEdit = jest.fn();
  let renderer;

  await act(async () => {
    renderer = ReactTestRenderer.create(
      <TodoItem
        todo={todo}
        onToggle={() => {}}
        onEdit={onEdit}
        onDelete={() => {}}
      />,
    );
  });

  await act(async () => {
    renderer.root.findByProps({testID: 'edit-1'}).props.onPress();
  });

  await act(async () => {
    renderer.root
      .findByProps({testID: 'edit-input-1'})
      .props.onChangeText('Réviser le cours');
  });

  await act(async () => {
    renderer.root.findByProps({testID: 'save-1'}).props.onPress();
  });

  expect(onEdit).toHaveBeenCalledWith('Réviser le cours');

  await act(async () => {
    renderer.unmount();
  });
});