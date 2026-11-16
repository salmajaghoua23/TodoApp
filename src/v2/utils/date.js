const pad = n => String(n).padStart(2, '0');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const toKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => toKey(new Date());
export const addDaysKey = n => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toKey(d);
};
export const parseKey = k => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const isValidKey = k => /^\d{4}-\d{2}-\d{2}$/.test(k) && toKey(parseKey(k)) === k;

export const formatShort = k => {
  if (!k) return 'No date';
  if (k === todayKey()) return 'Today';
  if (k === addDaysKey(1)) return 'Tomorrow';
  const d = parseKey(k);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

export const formatLong = k => {
  if (!k) return 'No date';
  const d = parseKey(k);
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return k === todayKey() ? `Today, ${base}` : base;
};
