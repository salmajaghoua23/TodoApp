import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useNav } from '../NavContext';
import Button from '../components/Button';
import Field from '../components/Field';
import { Header, Screen } from '../components/Screen';

export default function SettingsScreen() {
  const nav = useNav();
  const { user, updateName } = useAuth();
  const { stats, clearCompleted } = useTasks();
  const [name, setName] = useState(user.name);

  return (
    <Screen bg="#fff">
      <Header title="Settings" onBack={nav.goBack} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>Profile</Text>
        <Field icon="user" value={name} onChangeText={setName} placeholder="Full name" />
        <Field icon="mail" value={user.email} editable={false} style={{ opacity: 0.6 }} />
        <Button
          title="Save name"
          onPress={async () => {
            try {
              await updateName(name);
              Alert.alert('Saved', 'Your profile has been updated.');
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          }}
        />
        <View style={{ height: 10 }} />
        <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>Data</Text>
        <Button
          variant="danger"
          title={`Clear completed tasks (${stats.done})`}
          disabled={stats.done === 0}
          onPress={() =>
            Alert.alert('Clear completed', 'Delete all completed tasks?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: clearCompleted },
            ])
          }
        />
      </ScrollView>
    </Screen>
  );
}
