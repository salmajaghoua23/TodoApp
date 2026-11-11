import React, { useEffect, useMemo } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatsPanel from '../components/StatsPanel';
import { PRIORITIES, getDetailedStats } from '../todoLogic';

const CHART_HEIGHT = 120;

function BarChart({ title, data }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <View style={styles.box}>
      <Text style={styles.boxTitle}>{title}</Text>
      <View style={styles.chart}>
        {data.map(d => (
          <View key={d.label} style={styles.barCol}>
            <Text style={styles.barValue}>{d.value}</Text>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(2, (d.value / max) * CHART_HEIGHT),
                  backgroundColor: d.color,
                },
              ]}
            />
            <Text style={styles.barLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function StatsScreen({ todos, stats, onBack }) {
  const details = useMemo(() => getDetailedStats(todos), [todos]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

  const priorityData = Object.values(PRIORITIES).map(p => ({
    label: p.label,
    value: details.byPriority[p.key].total,
    color: p.color,
  }));

  const d = details.deadlines;
  const deadlineData = [
    { label: 'Retard', value: d.overdue, color: '#dc2626' },
    { label: "Aujourd'hui", value: d.today, color: '#f59e0b' },
    { label: '7 jours', value: d.week, color: '#4f46e5' },
    { label: 'Plus tard', value: d.later, color: '#6366f1' },
    { label: 'Sans date', value: d.none, color: '#9ca3af' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity testID="stats-back" onPress={onBack}>
          <Text style={styles.back}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistiques</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <StatsPanel stats={stats} />

        <BarChart title="Tâches par priorité" data={priorityData} />
        <BarChart title="Échéances des tâches restantes" data={deadlineData} />

        <View style={styles.box}>
          <Text style={styles.boxTitle}>Terminées / Restantes</Text>
          <View style={styles.stack}>
            {stats.done > 0 && (
              <View
                style={[
                  styles.stackPart,
                  { flex: stats.done, backgroundColor: '#16a34a' },
                ]}
              />
            )}
            {stats.active > 0 && (
              <View
                style={[
                  styles.stackPart,
                  { flex: stats.active, backgroundColor: '#4f46e5' },
                ]}
              />
            )}
            {stats.total === 0 && (
              <View
                style={[
                  styles.stackPart,
                  { flex: 1, backgroundColor: '#e5e7eb' },
                ]}
              />
            )}
          </View>
          <Text style={styles.legend}>
            Terminées : {stats.done} · Restantes : {stats.active}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { backgroundColor: '#4f46e5', padding: 20, paddingTop: 28 },
  back: { color: '#c7d2fe', fontSize: 15, marginBottom: 6 },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  content: { paddingTop: 12, paddingBottom: 24 },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
  },
  boxTitle: { color: '#374151', fontWeight: '600', marginBottom: 10 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: CHART_HEIGHT + 40,
  },
  barCol: { alignItems: 'center', justifyContent: 'flex-end', flex: 1 },
  bar: { width: 28, borderRadius: 6 },
  barValue: { color: '#111827', fontWeight: 'bold', marginBottom: 4 },
  barLabel: { color: '#6b7280', fontSize: 11, marginTop: 6 },
  stack: {
    flexDirection: 'row',
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
  },
  stackPart: { height: 18 },
  legend: { color: '#374151', marginTop: 8 },
});
