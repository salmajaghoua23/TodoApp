import React from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, shadow } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useNav } from '../NavContext';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Screen } from '../components/Screen';
import TaskItem from '../components/TaskItem';
import useTaskMenu from '../components/useTaskMenu';

const byPendingThenDate = (a, b) => {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  if (a.dueDate) return -1;
  if (b.dueDate) return 1;
  return b.createdAt - a.createdAt;
};

function Stat({ value, label, bg, circle, glyph }) {
  return (
    <View style={[styles.stat, { backgroundColor: bg }]}>
      <View style={[styles.statCircle, { backgroundColor: circle }]}>
        <Text style={{ color: '#fff', fontWeight: '900' }}>{glyph}</Text>
      </View>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLbl}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const nav = useNav();
  const { user } = useAuth();
  const { tasks, stats, toggleTask, loading, error, refresh } = useTasks();
  const [refreshing, setRefreshing] = React.useState(false);
  const openMenu = useTaskMenu();
  const first = (user.name || '').split(' ')[0] || 'there';
  const list = [...tasks].sort(byPendingThenDate).slice(0, 6);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refresh();
              setRefreshing(false);
            }}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.top}>
          <View style={styles.topRow}>
            <TouchableOpacity
              testID="open-drawer"
              onPress={nav.openDrawer}
              hitSlop={10}
            >
              <Icon name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={10}
              onPress={() =>
                Alert.alert(
                  'Notifications',
                  stats.pending
                    ? `You have ${stats.pending} pending task(s).`
                    : 'You are all caught up! 🎉',
                )
              }
            >
              <Icon name="bell" size={24} />
              {stats.pending > 0 ? <View style={styles.dot} /> : null}
            </TouchableOpacity>
          </View>
          <Text style={styles.hello}>Hello {first} 👋</Text>
          <Text style={styles.sub}>Let's get things done today!</Text>
          <View style={styles.stats}>
            <Stat
              value={stats.total}
              label="Total"
              bg="#E4DEFF"
              circle={colors.primary}
              glyph="✓"
            />
            <Stat
              value={stats.done}
              label="Done"
              bg="#DDF6EA"
              circle={colors.success}
              glyph="✓"
            />
            <Stat
              value={stats.pending}
              label="Pending"
              bg="#FFEBDD"
              circle={colors.warning}
              glyph="◔"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 18 }}>
          <Button
            testID="home-add-task"
            title="Add Task"
            left="＋"
            onPress={() => nav.navigate('AddTask')}
            style={{ marginTop: 14 }}
          />

          <View style={styles.listHead}>
            <Text style={styles.h2}>My Tasks</Text>
            <TouchableOpacity
              testID="home-see-all"
              onPress={() => nav.switchTab('Search', { filter: 'All' })}
            >
              <Text style={styles.link}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator
                style={{ padding: 28 }}
                color={colors.primary}
              />
            ) : error ? (
              <TouchableOpacity testID="home-retry" onPress={refresh}>
                <Text style={[styles.empty, { color: colors.danger }]}>
                  Could not load tasks: {error}
                  {'\n'}Tap to retry
                </Text>
              </TouchableOpacity>
            ) : list.length === 0 ? (
              <Text style={styles.empty}>
                No tasks yet. Tap "Add Task" to create your first one!
              </Text>
            ) : (
              list.map(t => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggle={() => toggleTask(t.id)}
                  onPress={() => nav.navigate('TaskDetail', { taskId: t.id })}
                  onMenu={() => openMenu(t)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    backgroundColor: '#E7E1FF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },
  hello: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 8 },
  sub: { fontSize: 14, color: colors.text, marginTop: 4 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 16 },
  stat: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
  },
  statLbl: { fontSize: 13, color: colors.text },
  listHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  h2: { fontSize: 20, fontWeight: '800', color: colors.text },
  link: { color: colors.primary, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    ...shadow,
  },
  empty: { padding: 24, textAlign: 'center', color: colors.muted },
});
