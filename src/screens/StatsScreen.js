import React, { useMemo } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  PRIORITIES,
  getStats,
  getDetailedStats,
  isOverdue,
  formatDate,
  toDateString,
} from '../todoLogic';

// Palette sobre : bleu nuit + un seul accent + gris neutres
const COLORS = {
  navy: '#0f172a',
  navySoft: '#1e293b',
  accent: '#4f46e5',
  accentLight: '#818cf8',
  accentPale: '#c7d2fe',
  background: '#f1f5f9',
  card: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
  mutedLight: '#94a3b8',
  border: '#e2e8f0',
  alert: '#b91c1c',
};

// Trois nuances de la même couleur pour les priorités
const PRIORITY_SHADES = {
  high: COLORS.navy,
  medium: COLORS.accent,
  low: COLORS.accentLight,
};

const weightOf = t => (PRIORITIES[t.priority] || PRIORITIES.medium).weight;

// Logo : carré arrondi avec une coche, dessiné sans image
function Logo({ size = 36 }) {
  const check = size * 0.5;
  return (
    <View
      style={[
        styles.logoBox,
        { width: size, height: size, borderRadius: size * 0.3 },
      ]}
    >
      <View
        style={[
          styles.logoCheck,
          {
            width: check,
            height: check * 0.55,
            borderLeftWidth: size * 0.09,
            borderBottomWidth: size * 0.09,
            marginTop: -size * 0.06,
          },
        ]}
      />
    </View>
  );
}

// Titre de section
function Section({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

// Ligne avec une barre de progression
function BarRow({ label, value, max, color, right }) {
  const width = max > 0 ? `${(value / max) * 100}%` : '0%';
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>{right !== undefined ? right : value}</Text>
    </View>
  );
}

export default function StatsScreen({ todos = [], onBack }) {
  const today = toDateString();

  const stats = useMemo(() => getStats(todos, today), [todos, today]);
  const detail = useMemo(
    () => getDetailedStats(todos, today),
    [todos, today],
  );

  // Tâches à traiter en premier : retard, puis échéance proche, puis priorité
  const urgent = useMemo(() => {
    return todos
      .filter(t => !t.done)
      .sort((a, b) => {
        const oa = isOverdue(a, today);
        const ob = isOverdue(b, today);
        if (oa !== ob) {
          return oa ? -1 : 1;
        }
        if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
          return a.dueDate < b.dueDate ? -1 : 1;
        }
        if (a.dueDate !== b.dueDate) {
          return a.dueDate ? -1 : 1;
        }
        return weightOf(b) - weightOf(a);
      })
      .slice(0, 3);
  }, [todos, today]);

  const { total, done, active, overdue, dueToday, completionRate } = stats;
  const { deadlines } = detail;
  const inProgress = Math.max(active - overdue, 0);

  // Phrase de synthèse
  let insight = 'Avancez une tâche à la fois.';
  if (total === 0) {
    insight = 'Ajoutez des tâches pour voir vos statistiques.';
  } else if (overdue > 0) {
    insight = `${overdue} tâche(s) en retard : à traiter en priorité.`;
  } else if (dueToday > 0) {
    insight = `${dueToday} tâche(s) à terminer aujourd'hui.`;
  } else if (completionRate === 100) {
    insight = 'Toutes vos tâches sont terminées.';
  } else if (completionRate >= 50) {
    insight = 'Bon rythme, continuez ainsi.';
  }

  const tiles = [
    { label: 'Total', value: total, color: COLORS.navy },
    { label: 'Terminées', value: done, color: COLORS.navy },
    { label: 'À faire', value: active, color: COLORS.navy },
    { label: 'En retard', value: overdue, color: COLORS.alert },
    { label: "Pour aujourd'hui", value: dueToday, color: COLORS.navy },
    { label: 'Cette semaine', value: deadlines.week, color: COLORS.navy },
  ];

  const deadlineRows = [
    { label: 'En retard', value: deadlines.overdue, color: COLORS.alert },
    { label: "Aujourd'hui", value: deadlines.today, color: COLORS.navy },
    { label: '7 jours', value: deadlines.week, color: COLORS.accent },
    { label: 'Plus tard', value: deadlines.later, color: COLORS.accentLight },
    { label: 'Sans date', value: deadlines.none, color: COLORS.mutedLight },
  ];
  const maxDeadline = Math.max(1, ...deadlineRows.map(r => r.value));

  const dueLabel = t => {
    if (!t.dueDate) {
      return { text: 'Sans échéance', color: COLORS.muted };
    }
    if (isOverdue(t, today)) {
      return { text: `En retard · ${formatDate(t.dueDate)}`, color: COLORS.alert };
    }
    if (t.dueDate === today) {
      return { text: "Aujourd'hui", color: COLORS.navy };
    }
    return { text: formatDate(t.dueDate), color: COLORS.muted };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            testID="stats-back"
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backText}>‹ Retour</Text>
          </TouchableOpacity>
          <Logo />
        </View>
        <Text style={styles.title}>Statistiques</Text>
        <Text style={styles.subtitle}>Vue d'ensemble de vos tâches</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Carte de progression globale */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Taux de réalisation</Text>
          <Text style={styles.heroPercent}>{completionRate}%</Text>
          <View style={styles.heroTrack}>
            <View style={[styles.heroFill, { width: `${completionRate}%` }]} />
          </View>
          <Text style={styles.heroMessage}>{insight}</Text>
        </View>

        {/* Tuiles */}
        <View style={styles.grid}>
          {tiles.map(t => (
            <View key={t.label} style={styles.tile}>
              <Text style={styles.tileLabel}>{t.label}</Text>
              <Text style={[styles.tileValue, { color: t.color }]}>
                {t.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Répartition globale */}
        <Section title="État des tâches" subtitle="Vue globale">
          <View style={styles.stack}>
            {total === 0 ? null : (
              <>
                {done > 0 && (
                  <View
                    style={[
                      styles.stackPart,
                      { flex: done, backgroundColor: COLORS.navy },
                    ]}
                  />
                )}
                {inProgress > 0 && (
                  <View
                    style={[
                      styles.stackPart,
                      { flex: inProgress, backgroundColor: COLORS.accent },
                    ]}
                  />
                )}
                {overdue > 0 && (
                  <View
                    style={[
                      styles.stackPart,
                      { flex: overdue, backgroundColor: COLORS.alert },
                    ]}
                  />
                )}
              </>
            )}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: COLORS.navy }]} />
              <Text style={styles.legendText}>Terminées ({done})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
              <Text style={styles.legendText}>En cours ({inProgress})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: COLORS.alert }]} />
              <Text style={styles.legendText}>En retard ({overdue})</Text>
            </View>
          </View>
        </Section>

        {/* Échéances */}
        <Section
          title="Échéances"
          subtitle="Tâches non terminées, par date limite"
        >
          {deadlineRows.map(r => (
            <BarRow
              key={r.label}
              label={r.label}
              value={r.value}
              max={maxDeadline}
              color={r.color}
            />
          ))}
        </Section>

        {/* Réalisation par priorité */}
        <Section
          title="Réalisation par priorité"
          subtitle="Tâches terminées sur le total"
        >
          {Object.keys(PRIORITIES).map(key => {
            const p = detail.byPriority[key];
            const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
            return (
              <BarRow
                key={key}
                label={PRIORITIES[key].label}
                value={pct}
                max={100}
                color={PRIORITY_SHADES[key]}
                right={`${p.done}/${p.total}`}
              />
            );
          })}
        </Section>

        {/* À traiter en priorité */}
        <Section
          title="À traiter en priorité"
          subtitle="Les 3 tâches les plus urgentes"
        >
          {urgent.length === 0 ? (
            <Text style={styles.emptyText}>Aucune tâche en attente.</Text>
          ) : (
            urgent.map((t, index) => {
              const due = dueLabel(t);
              return (
                <View
                  key={t.id}
                  style={[
                    styles.urgentRow,
                    index === urgent.length - 1 && styles.urgentRowLast,
                  ]}
                >
                  <View
                    style={[
                      styles.urgentBar,
                      {
                        backgroundColor:
                          PRIORITY_SHADES[t.priority] || COLORS.accent,
                      },
                    ]}
                  />
                  <View style={styles.urgentTexts}>
                    <Text style={styles.urgentTitle} numberOfLines={1}>
                      {t.title}
                    </Text>
                    <Text style={[styles.urgentDue, { color: due.color }]}>
                      {due.text}
                    </Text>
                  </View>
                  <Text style={styles.urgentPriority}>
                    {(PRIORITIES[t.priority] || PRIORITIES.medium).label}
                  </Text>
                </View>
              );
            })
          )}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#0f172a',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

const styles = StyleSheet.create({
  logoBox: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCheck: {
    borderColor: COLORS.accent,
    transform: [{ rotate: '-45deg' }],
  },
  container: { flex: 1, backgroundColor: COLORS.navy },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  backText: { color: '#fff', fontWeight: '600' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: COLORS.mutedLight, marginTop: 4 },

  scroll: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },

  heroCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    ...shadow,
  },
  heroLabel: { color: COLORS.mutedLight, fontSize: 13 },
  heroPercent: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '800',
    marginVertical: 4,
  },
  heroTrack: {
    alignSelf: 'stretch',
    height: 10,
    backgroundColor: COLORS.navySoft,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 6,
  },
  heroFill: {
    height: '100%',
    backgroundColor: COLORS.accentLight,
    borderRadius: 5,
  },
  heroMessage: {
    color: COLORS.accentPale,
    marginTop: 14,
    fontSize: 14,
    textAlign: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    ...shadow,
  },
  tileLabel: { color: COLORS.muted, fontSize: 13 },
  tileValue: { fontSize: 30, fontWeight: '800', marginTop: 6 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginTop: 4,
    marginBottom: 12,
    ...shadow,
  },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  cardBody: { marginTop: 14 },

  // Barre empilée
  stack: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  stackPart: { height: '100%' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: COLORS.muted, fontSize: 12 },

  // Barres
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barLabel: { width: 84, color: COLORS.text, fontSize: 13, fontWeight: '600' },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: {
    width: 40,
    textAlign: 'right',
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 13,
  },

  // Tâches urgentes
  urgentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  urgentRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  urgentBar: { width: 4, height: 34, borderRadius: 2, marginRight: 12 },
  urgentTexts: { flex: 1 },
  urgentTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  urgentDue: { fontSize: 12, marginTop: 2 },
  urgentPriority: { color: COLORS.muted, fontSize: 12, marginLeft: 8 },
  emptyText: { color: COLORS.muted, fontSize: 13 },
});
