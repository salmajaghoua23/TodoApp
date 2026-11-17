import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useNav } from '../NavContext';
import Icon from '../components/Icon';
import { Screen } from '../components/Screen';

function Row({ icon, label, onPress, right, danger, testID }) {
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.7}
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
    >
      <Icon name={icon} size={20} style={{ width: 34 }} />
      <Text style={[styles.rowTxt, danger && { color: colors.danger }]}>
        {label}
      </Text>
      {right || (
        <Icon
          name="chevron"
          size={22}
          color={danger ? colors.danger : colors.muted}
        />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const nav = useNav();
  const { user, signOut } = useAuth();
  const { notifications, setNotifications } = useTasks();
  const initials = (user.name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  const logout = () =>
    Alert.alert('Log Out', 'Do you really want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);

  return (
    <Screen bg="#fff">
      <ScrollView>
        <View style={styles.head}>
          <TouchableOpacity
            style={styles.gear}
            onPress={() => nav.navigate('Settings')}
          >
            <Icon name="settings" size={22} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View
          style={{
            marginTop: 18,
            borderTopWidth: 1,
            borderTopColor: '#EEEAFB',
          }}
        >
          <Row
            testID="profile-tasks"
            icon="list"
            label="My Tasks"
            onPress={() => nav.switchTab('Search', { filter: 'All' })}
          />
          <Row
            testID="profile-settings"
            icon="settings"
            label="Settings"
            onPress={() => nav.navigate('Settings')}
          />
          <Row
            testID="profile-notifications-row"
            icon="bell"
            label="Notifications"
            right={
              <Switch
                testID="profile-notifications"
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: colors.primary, false: '#CFCBE6' }}
                thumbColor="#fff"
              />
            }
          />
          <Row
            testID="profile-about"
            icon="info"
            label="About App"
            onPress={() => nav.navigate('About')}
          />
          <Row
            testID="profile-logout"
            icon="logout"
            label="Log Out"
            danger
            onPress={logout}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    height: 150,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 46,
  },
  gear: { position: 'absolute', top: 14, right: 18 },
  avatar: {
    position: 'absolute',
    bottom: -46,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.primaryDark,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontSize: 32, fontWeight: '800' },
  name: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginTop: 14,
  },
  email: { textAlign: 'center', color: colors.muted, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEAFB',
  },
  rowTxt: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
});
