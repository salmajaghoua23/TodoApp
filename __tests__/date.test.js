import {
  addDaysKey,
  formatLong,
  formatShort,
  isValidKey,
  parseKey,
  toKey,
  todayKey,
} from '../src/v2/utils/date';

describe('utils/date', () => {
  test('toKey formate en AAAA-MM-JJ avec zéros', () => {
    expect(toKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toKey(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  test('parseKey est l’inverse de toKey', () => {
    const d = parseKey('2026-03-09');
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 2, 9]);
    expect(toKey(d)).toBe('2026-03-09');
  });

  test('isValidKey accepte les vraies dates et refuse les autres', () => {
    expect(isValidKey('2026-02-28')).toBe(true);
    expect(isValidKey('2024-02-29')).toBe(true); // année bissextile
    expect(isValidKey('2026-02-30')).toBe(false);
    expect(isValidKey('2026-13-01')).toBe(false);
    expect(isValidKey('26-1-1')).toBe(false);
    expect(isValidKey('')).toBe(false);
  });

  test('addDaysKey avance et recule par rapport à aujourd’hui', () => {
    expect(addDaysKey(0)).toBe(todayKey());
    expect(parseKey(addDaysKey(1)) - parseKey(todayKey())).toBeGreaterThan(0);
    expect(parseKey(addDaysKey(-1)) - parseKey(todayKey())).toBeLessThan(0);
  });

  test('formatShort : No date / Today / Tomorrow / date courte', () => {
    expect(formatShort(null)).toBe('No date');
    expect(formatShort(todayKey())).toBe('Today');
    expect(formatShort(addDaysKey(1))).toBe('Tomorrow');
    expect(formatShort('2026-03-09')).toBe('Mar 9');
  });

  test('formatLong : date complète, préfixe Today pour aujourd’hui', () => {
    expect(formatLong(null)).toBe('No date');
    expect(formatLong('2026-03-09')).toBe('Mar 9, 2026');
    expect(formatLong(todayKey())).toMatch(/^Today, /);
  });
});
