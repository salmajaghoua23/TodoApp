import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { colors } from './theme';
import { NavContext } from './NavContext';
import { useAuth } from './context/AuthContext';
import { useTasks } from './context/TasksContext';
import TabBar from './components/TabBar';
import Drawer from './components/Drawer';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';

const TAB_SCREENS = {
  Home: HomeScreen,
  Search: SearchScreen,
  Calendar: CalendarScreen,
  Profile: ProfileScreen,
};
const STACK_SCREENS = {
  AddTask: AddTaskScreen,
  TaskDetail: TaskDetailScreen,
  Settings: SettingsScreen,
  About: AboutScreen,
};

// Navigation maison (pile d'écrans) : évite d'ajouter react-navigation + modules natifs.
export default function Navigator() {
  const { signOut } = useAuth();
  const { stats } = useTasks();
  const [stack, setStack] = useState([{ name: 'Home', params: {} }]);
  const [drawer, setDrawer] = useState(false);

  const navigate = useCallback(
    (name, params = {}) => setStack(s => [...s, { name, params }]),
    [],
  );
  const goBack = useCallback(
    () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s)),
    [],
  );
  const switchTab = useCallback(
    (name, params = {}) =>
      setStack([{ name, params: { ...params, ts: Date.now() } }]),
    [],
  );
  const openDrawer = useCallback(() => setDrawer(true), []);
  const closeDrawer = useCallback(() => setDrawer(false), []);

  const confirmLogout = useCallback(() => {
    setDrawer(false);
    Alert.alert('Log Out', 'Do you really want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (drawer) {
        setDrawer(false);
        return true;
      }
      if (stack.length > 1) {
        goBack();
        return true;
      }
      if (stack[0].name !== 'Home') {
        switchTab('Home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [drawer, stack, goBack, switchTab]);

  const current = stack[stack.length - 1];
  const isTab = !!TAB_SCREENS[current.name];
  const Current = TAB_SCREENS[current.name] || STACK_SCREENS[current.name];

  const onDrawerSelect = filter => {
    setDrawer(false);
    if (filter === '__settings') navigate('Settings');
    else switchTab('Search', { filter });
  };

  return (
    <NavContext.Provider
      value={{ navigate, goBack, switchTab, openDrawer, closeDrawer, current }}
    >
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ flex: 1 }}>
          <Current
            key={`${current.name}-${stack.length}-${current.params.ts || ''}`}
            params={current.params}
          />
        </View>
        {isTab ? (
          <TabBar active={current.name} onChange={n => switchTab(n)} />
        ) : null}
        <Drawer
          open={drawer}
          onClose={closeDrawer}
          counts={stats}
          onSelect={onDrawerSelect}
          onLogout={confirmLogout}
        />
      </View>
    </NavContext.Provider>
  );
}
