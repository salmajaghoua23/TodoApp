// Ajoute les testID necessaires aux tests DIRECTEMENT dans src/v2 (sans remplacer les fichiers).
// Usage, a la racine du projet :  node add-testids.js
// Peut etre relance sans danger. Relisez ensuite avec `git diff`.
const fs = require('fs');
const path = require('path');

const root = process.argv[2] || '.';
const EDITS = [
  ["components/Button.js", "loading, style, disabled }) {", "loading, style, disabled, testID }) {"],
  ["components/Button.js", "      activeOpacity={0.85}\n", "      activeOpacity={0.85}\n      testID={testID}\n"],
  ["components/SelectRow.js", "onPress, chevron = true })", "onPress, chevron = true, testID })"],
  ["components/SelectRow.js", "<TouchableOpacity activeOpacity={0.8} style={styles.row} onPress={onPress}>", "<TouchableOpacity testID={testID} activeOpacity={0.8} style={styles.row} onPress={onPress}>"],
  ["components/TaskItem.js", "<TouchableOpacity activeOpacity={0.85} style={styles.row} onPress={onPress}>", "<TouchableOpacity testID={`task-item-${task.title}`} activeOpacity={0.85} style={styles.row} onPress={onPress}>"],
  ["components/TaskItem.js", "<TouchableOpacity onPress={onToggle} hitSlop={10}", "<TouchableOpacity testID={`task-toggle-${task.title}`} onPress={onToggle} hitSlop={10}"],
  ["components/TaskItem.js", "<TouchableOpacity onPress={onMenu} hitSlop={10}", "<TouchableOpacity testID={`task-menu-${task.title}`} onPress={onMenu} hitSlop={10}"],
  ["components/TabBar.js", "<TouchableOpacity key={t.name} style={styles.item}", "<TouchableOpacity key={t.name} testID={`tab-${t.name}`} style={styles.item}"],
  ["components/Drawer.js", "<TouchableOpacity style={[styles.item, active && styles.itemActive]}", "<TouchableOpacity testID={`drawer-${label}`} style={[styles.item, active && styles.itemActive]}"],
  ["components/PickerModal.js", "<TouchableOpacity key={opt} style=", "<TouchableOpacity key={opt} testID={`option-${opt}`} style="],
  ["components/DateModal.js", "<TouchableOpacity key={q.label} style=", "<TouchableOpacity key={q.label} testID={`date-${q.label}`} style="],
  ["components/DateModal.js", "<Button title=\"Confirm date\"", "<Button testID=\"date-confirm\" title=\"Confirm date\""],
  ["components/DateModal.js", "<TouchableOpacity onPress={() => onSelect(null)} style=", "<TouchableOpacity testID=\"date-none\" onPress={() => onSelect(null)} style="],
  ["components/DateModal.js", "<Field value={text}", "<Field testID=\"date-input\" value={text}"],
  ["components/Screen.js", "<TouchableOpacity onPress={onBack} style={styles.side} hitSlop={10}>", "<TouchableOpacity testID=\"header-back\" onPress={onBack} style={styles.side} hitSlop={10}>"],
  ["screens/SplashScreen.js", "<Button title=\"Get Started\"", "<Button testID=\"get-started\" title=\"Get Started\""],
  ["screens/AuthScreen.js", "<Field icon=\"user\" placeholder=\"Full name\"", "<Field testID=\"auth-name\" icon=\"user\" placeholder=\"Full name\""],
  ["screens/AuthScreen.js", "<Field icon=\"mail\" placeholder=\"Email address\"", "<Field testID=\"auth-email\" icon=\"mail\" placeholder=\"Email address\""],
  ["screens/AuthScreen.js", "<Field\n              icon=\"lock\"", "<Field\n              testID=\"auth-password\"\n              icon=\"lock\""],
  ["screens/AuthScreen.js", "<Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={submit}", "<Button testID=\"auth-submit\" title={isLogin ? 'Sign In' : 'Sign Up'} onPress={submit}"],
  ["screens/AuthScreen.js", "<TouchableOpacity onPress={() => { setMode(", "<TouchableOpacity testID=\"auth-toggle\" onPress={() => { setMode("],
  ["screens/HomeScreen.js", "<TouchableOpacity onPress={nav.openDrawer} hitSlop={10}>", "<TouchableOpacity testID=\"open-drawer\" onPress={nav.openDrawer} hitSlop={10}>"],
  ["screens/HomeScreen.js", "<Button title=\"Add Task\"", "<Button testID=\"home-add-task\" title=\"Add Task\""],
  ["screens/HomeScreen.js", "<TouchableOpacity onPress={refresh}>", "<TouchableOpacity testID=\"home-retry\" onPress={refresh}>"],
  ["screens/HomeScreen.js", "<TouchableOpacity onPress={() => nav.switchTab('Search', { filter: 'All' })}>", "<TouchableOpacity testID=\"home-see-all\" onPress={() => nav.switchTab('Search', { filter: 'All' })}>"],
  ["screens/AddTaskScreen.js", "<Field icon=\"pencil\"", "<Field testID=\"task-title\" icon=\"pencil\""],
  ["screens/AddTaskScreen.js", "<Field\n              icon=\"list\"", "<Field\n              testID=\"task-description\"\n              icon=\"list\""],
  ["screens/AddTaskScreen.js", "<SelectRow icon=\"flag\"", "<SelectRow testID=\"select-priority\" icon=\"flag\""],
  ["screens/AddTaskScreen.js", "<SelectRow icon=\"calendar\"", "<SelectRow testID=\"select-date\" icon=\"calendar\""],
  ["screens/AddTaskScreen.js", "<SelectRow icon=\"grid\"", "<SelectRow testID=\"select-category\" icon=\"grid\""],
  ["screens/AddTaskScreen.js", "<Button title={editing ? 'Save Changes' : 'Add Task'}", "<Button testID=\"task-save\" title={editing ? 'Save Changes' : 'Add Task'}"],
  ["screens/TaskDetailScreen.js", "<Button\n            title={task.completed ? 'Mark as Pending'", "<Button\n            testID=\"detail-toggle\"\n            title={task.completed ? 'Mark as Pending'"],
  ["screens/TaskDetailScreen.js", "<Button variant=\"outline\" title=\"Edit Task\"", "<Button testID=\"detail-edit\" variant=\"outline\" title=\"Edit Task\""],
  ["screens/TaskDetailScreen.js", "<Button variant=\"danger\" title=\"Delete Task\"", "<Button testID=\"detail-delete\" variant=\"danger\" title=\"Delete Task\""],
  ["screens/SearchScreen.js", "<Field icon=\"search\"", "<Field testID=\"search-input\" icon=\"search\""],
  ["screens/SearchScreen.js", "<TouchableOpacity key={f} onPress={() => setFilter(f)}", "<TouchableOpacity key={f} testID={`filter-${f}`} onPress={() => setFilter(f)}"],
  ["screens/CalendarScreen.js", "<TouchableOpacity key={k} onPress={() => setSelected(k)}", "<TouchableOpacity key={k} testID={`day-${k}`} onPress={() => setSelected(k)}"],
  ["screens/ProfileScreen.js", "function Row({ icon, label, onPress, right, danger }) {", "function Row({ icon, label, onPress, right, danger, testID }) {"],
  ["screens/ProfileScreen.js", "<TouchableOpacity activeOpacity={0.7} style={styles.row}", "<TouchableOpacity testID={testID} activeOpacity={0.7} style={styles.row}"],
  ["screens/ProfileScreen.js", "<Row icon=\"list\"", "<Row testID=\"profile-tasks\" icon=\"list\""],
  ["screens/ProfileScreen.js", "<Row icon=\"settings\"", "<Row testID=\"profile-settings\" icon=\"settings\""],
  ["screens/ProfileScreen.js", "<Row\n            icon=\"bell\"", "<Row\n            testID=\"profile-notifications-row\"\n            icon=\"bell\""],
  ["screens/ProfileScreen.js", "right={<Switch value={notifications}", "right={<Switch testID=\"profile-notifications\" value={notifications}"],
  ["screens/ProfileScreen.js", "<Row icon=\"info\"", "<Row testID=\"profile-about\" icon=\"info\""],
  ["screens/ProfileScreen.js", "<Row icon=\"logout\"", "<Row testID=\"profile-logout\" icon=\"logout\""],
  ["screens/SettingsScreen.js", "<Field icon=\"user\" value={name}", "<Field testID=\"settings-name\" icon=\"user\" value={name}"],
  ["screens/SettingsScreen.js", "<Button\n          title=\"Save name\"", "<Button\n          testID=\"settings-save\"\n          title=\"Save name\""],
  ["screens/SettingsScreen.js", "<Button\n          variant=\"danger\"", "<Button\n          testID=\"settings-clear\"\n          variant=\"danger\""],
];

const byFile = {};
EDITS.forEach(([file, from, to]) => {
  (byFile[file] = byFile[file] || []).push([from, to]);
});

let applied = 0;
let skipped = 0;
let missing = 0;

Object.keys(byFile).forEach(file => {
  const full = path.join(root, 'src', 'v2', file);
  if (!fs.existsSync(full)) {
    console.log('INTROUVABLE (fichier) :', full);
    missing += byFile[file].length;
    return;
  }
  const raw = fs.readFileSync(full, 'utf8');
  const crlf = raw.includes('\r\n');
  let s = raw.replace(/\r\n/g, '\n');
  byFile[file].forEach(([from, to]) => {
    if (s.includes(to)) {
      skipped += 1;
    } else if (s.includes(from)) {
      s = s.replace(from, to);
      applied += 1;
    } else {
      missing += 1;
      console.log('A FAIRE A LA MAIN dans ' + file + ' -> chercher : ' + from.split('\n')[0].trim());
    }
  });
  fs.writeFileSync(full, crlf ? s.replace(/\n/g, '\r\n') : s, 'utf8');
});

console.log('Appliques : ' + applied + ' | deja presents : ' + skipped + ' | non trouves : ' + missing);