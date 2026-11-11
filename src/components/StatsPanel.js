import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PRIORITIES } from '../todoLogic';

function Card({ label, value, color }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.cardValue, color && { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function StatsPanel({ stats }) {
  return (
    <View style={styles.panel} testID="stats-panel">
      <View style={styles.cards}>
        <Card label="Total" value={stats.total} />
        <Card label="Terminées" value={stats.done} color="#16a34a" />
        <Card label="Restantes" value={stats.active} color="#4f46e5" />
        <Card label="En retard" value={stats.overdue} color="#dc2626" />
      </View>

      <Text style={styles.progressLabel}>
        Progression : {stats.completionRate}%
      </Text>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${stats.completionRate}%` }]}
        />
      </View>

      <Text style={styles.sectionTitle}>Tâches restantes par priorité</Text>
      <View style={styles.priorityRow}>
        {Object.values(PRIORITIES).map(p => (
          <View key={p.key} style={styles.priorityItem}>
            <View style={[styles.dot, { backgroundColor: p.color }]} />
            <Text style={styles.priorityText}>
              {p.label} : {stats.byPriority[p.key]}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.priorityText}>
        Échéance aujourd'hui : {stats.dueToday}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
  },
  cards: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { alignItems: 'center', flex: 1 },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  cardLabel: { fontSize: 12, color: '#6b7280' },
  progressLabel: { marginTop: 12, color: '#374151', fontWeight: '600' },
  progressTrack: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: { height: 10, backgroundColor: '#4f46e5' },
  sectionTitle: { marginTop: 12, color: '#374151', fontWeight: '600' },
  priorityRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 6 },
  priorityItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  priorityText: { color: '#374151' },
});
