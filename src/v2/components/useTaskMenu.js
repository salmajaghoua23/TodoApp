import { Alert } from 'react-native';
import { useNav } from '../NavContext';
import { useTasks } from '../context/TasksContext';

// Menu "⋮" : Edit / Delete.
export default function useTaskMenu() {
  const nav = useNav();
  const { deleteTask } = useTasks();
  return task =>
    Alert.alert(task.title, 'Choose an action', [
      {
        text: 'Edit',
        onPress: () => nav.navigate('AddTask', { taskId: task.id }),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete task', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => deleteTask(task.id),
            },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
}
