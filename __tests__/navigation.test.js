import { addDaysKey, todayKey } from '../src/v2/utils/date';
import {
  cleanup,
  has,
  launchSignedIn,
  press,
  resetAll,
  screenText,
  spyAlert,
  type,
} from '../test-utils/render';

const TASKS = [
  {
    title: 'Rapport important',
    priority: 'High',
    category: 'Work',
    due_date: todayKey(),
  },
  {
    title: 'Acheter du pain',
    priority: 'Low',
    category: 'Shopping',
    due_date: addDaysKey(1),
  },
  { title: 'Déjà fini', priority: 'High', completed: true },
];

beforeEach(async () => {
  await resetAll();
  spyAlert();
});
afterEach(cleanup);

describe('Recherche', () => {
  test('recherche par texte', async () => {
    const { r } = await launchSignedIn({ tasks: TASKS });
    await press(r, 'tab-Search');
    expect(screenText(r)).toContain('Acheter du pain');

    await type(r, 'search-input', 'rapport');
    expect(screenText(r)).toContain('Rapport important');
    expect(screenText(r)).not.toContain('Acheter du pain');

    await type(r, 'search-input', 'zzz');
    expect(screenText(r)).toContain('No tasks found.');
  });

  test('filtres Pending / Completed / Important', async () => {
    const { r } = await launchSignedIn({ tasks: TASKS });
    await press(r, 'tab-Search');

    await press(r, 'filter-Completed');
    expect(screenText(r)).toContain('Déjà fini');
    expect(screenText(r)).not.toContain('Acheter du pain');

    await press(r, 'filter-Pending');
    expect(screenText(r)).toContain('Acheter du pain');
    expect(screenText(r)).not.toContain('Déjà fini');

    await press(r, 'filter-Important');
    expect(screenText(r)).toContain('Rapport important');
    expect(screenText(r)).not.toContain('Acheter du pain');
    expect(screenText(r)).not.toContain('Déjà fini');

    await press(r, 'filter-All');
    expect(screenText(r)).toContain('Déjà fini');
  });
});

describe('Calendrier', () => {
  test('affiche les tâches du jour sélectionné', async () => {
    const { r } = await launchSignedIn({ tasks: TASKS });
    await press(r, 'tab-Calendar');
    expect(screenText(r)).toContain('Rapport important');
    expect(screenText(r)).not.toContain('Acheter du pain');

    await press(r, `day-${addDaysKey(1)}`);
    expect(screenText(r)).toContain('Acheter du pain');

    await press(r, `day-${addDaysKey(5)}`);
    expect(screenText(r)).toContain('Nothing planned for this day');
  });
});

describe("Barre d'onglets et menu latéral", () => {
  test("changer d'onglet puis revenir à Home", async () => {
    const { r } = await launchSignedIn({ tasks: TASKS });
    await press(r, 'tab-Profile');
    expect(screenText(r)).toContain('salma@example.com');
    await press(r, 'tab-Home');
    expect(has(r, 'home-add-task')).toBe(true);
  });

  test('"See all" ouvre la recherche', async () => {
    const { r } = await launchSignedIn({ tasks: TASKS });
    await press(r, 'home-see-all');
    expect(has(r, 'search-input')).toBe(true);
  });

  test('le tiroir filtre les tâches terminées', async () => {
    const { r } = await launchSignedIn({ tasks: TASKS });
    await press(r, 'open-drawer');
    expect(screenText(r)).toContain('Stay productive!');
    await press(r, 'drawer-Completed');
    expect(screenText(r)).toContain('Déjà fini');
    expect(screenText(r)).not.toContain('Acheter du pain');
  });
});
