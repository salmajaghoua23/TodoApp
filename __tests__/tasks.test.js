import { addDaysKey } from '../src/v2/utils/date';
import {
  cleanup,
  has,
  launchSignedIn,
  lastAlert,
  press,
  pressAlertButton,
  resetAll,
  screenText,
  spyAlert,
  type,
} from '../test-utils/render';
import * as db from '../test-utils/mockSupabase';

beforeEach(async () => {
  await resetAll();
  spyAlert();
});
afterEach(cleanup);

describe('Accueil et tâches (table Supabase "tasks")', () => {
  test('état vide', async () => {
    const { r } = await launchSignedIn();
    expect(screenText(r)).toContain('No tasks yet');
  });

  test("affiche les tâches de l'utilisateur seulement (RLS)", async () => {
    const other = db.__seedUser({ email: 'autre@example.com', name: 'Autre' });
    db.__seedTasks(other, [{ title: 'Tâche privée' }]);
    const { r } = await launchSignedIn({ tasks: [{ title: 'Ma tâche' }] });
    expect(screenText(r)).toContain('Ma tâche');
    expect(screenText(r)).not.toContain('Tâche privée');
  });

  test('erreur de chargement puis réessai', async () => {
    db.__failNext('boom');
    const { r } = await launchSignedIn({ tasks: [{ title: 'Ma tâche' }] });
    expect(screenText(r)).toContain('Could not load tasks: boom');

    await press(r, 'home-retry');
    expect(screenText(r)).toContain('Ma tâche');
  });

  test('ajouter une tâche avec priorité, date et catégorie', async () => {
    const { r } = await launchSignedIn();
    await press(r, 'home-add-task');
    expect(screenText(r)).toContain('Create a New Task');

    await press(r, 'task-save'); // titre vide
    expect(lastAlert()[0]).toBe('Missing title');

    await type(r, 'task-title', 'Réviser le cours');
    await type(r, 'task-description', 'Chapitre 3');
    await press(r, 'select-priority');
    await press(r, 'option-High');
    await press(r, 'select-category');
    await press(r, 'option-Study');
    await press(r, 'select-date');
    await press(r, 'date-Tomorrow');
    await press(r, 'task-save');

    expect(screenText(r)).toContain('Réviser le cours');
    const [row] = db.__tasks();
    expect(row).toMatchObject({
      title: 'Réviser le cours',
      description: 'Chapitre 3',
      priority: 'High',
      category: 'Study',
      due_date: addDaysKey(1),
      completed: false,
    });
  });

  test('ajout : une erreur serveur affiche une alerte et garde le formulaire', async () => {
    const { r } = await launchSignedIn();
    await press(r, 'home-add-task');
    await type(r, 'task-title', 'Ne passera pas');
    db.__failNext('boom');
    await press(r, 'task-save');

    expect(lastAlert()).toEqual(['Error', 'boom']);
    expect(screenText(r)).toContain('Create a New Task');
    expect(db.__tasks()).toHaveLength(0);
  });

  test('sélecteur de date : saisie manuelle', async () => {
    const { r } = await launchSignedIn();
    await press(r, 'home-add-task');
    await type(r, 'task-title', 'Avec date');
    await press(r, 'select-date');
    await type(r, 'date-input', '2031-03-07');
    await press(r, 'date-confirm');
    await press(r, 'task-save');
    expect(db.__tasks()[0].due_date).toBe('2031-03-07');
  });

  test('sélecteur de date : "No due date"', async () => {
    const { r } = await launchSignedIn();
    await press(r, 'home-add-task');
    await type(r, 'task-title', 'Sans date');
    await press(r, 'select-date');
    await press(r, 'date-Tomorrow');
    await press(r, 'select-date');
    await press(r, 'date-none');
    await press(r, 'task-save');
    expect(db.__tasks()[0].due_date).toBeNull();
  });

  test('cocher / décocher une tâche', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'À cocher' }] });
    await press(r, 'task-toggle-À cocher');
    expect(db.__tasks()[0].completed).toBe(true);

    await press(r, 'task-toggle-À cocher');
    expect(db.__tasks()[0].completed).toBe(false);
  });

  test('cocher : erreur serveur -> alerte et état inchangé', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'À cocher' }] });
    db.__failNext('boom');
    await press(r, 'task-toggle-À cocher');
    expect(lastAlert()).toEqual(['Error', 'boom']);
    expect(db.__tasks()[0].completed).toBe(false);
  });

  test('détail : terminer puis supprimer une tâche', async () => {
    const { r } = await launchSignedIn({
      tasks: [
        {
          title: 'Finir le projet',
          description: 'Corriger les bugs',
          priority: 'High',
          category: 'Work',
        },
      ],
    });
    await press(r, 'task-item-Finir le projet');
    expect(screenText(r)).toContain('Corriger les bugs');
    expect(screenText(r)).toContain('Work');

    await press(r, 'detail-toggle');
    expect(db.__tasks()[0].completed).toBe(true);
    expect(screenText(r)).toContain('Mark as Pending');

    await press(r, 'detail-delete');
    await pressAlertButton('Delete');
    expect(db.__tasks()).toHaveLength(0);
    expect(screenText(r)).toContain('No tasks yet');
  });

  test('modifier une tâche depuis le détail', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'Ancien titre' }] });
    await press(r, 'task-item-Ancien titre');
    await press(r, 'detail-edit');
    expect(screenText(r)).toContain('Update your task');

    await type(r, 'task-title', 'Nouveau titre');
    await press(r, 'task-save');
    expect(db.__tasks()[0].title).toBe('Nouveau titre');
    expect(screenText(r)).toContain('Nouveau titre');
  });

  test('menu ⋮ : modifier', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'Via menu' }] });
    await press(r, 'task-menu-Via menu');
    expect(lastAlert()[0]).toBe('Via menu');
    await pressAlertButton('Edit');
    expect(screenText(r)).toContain('Update your task');
  });

  test('menu ⋮ : supprimer avec confirmation', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'À supprimer' }] });
    await press(r, 'task-menu-À supprimer');
    await pressAlertButton('Delete');
    expect(lastAlert()[0]).toBe('Delete task');
    await pressAlertButton('Delete');
    expect(db.__tasks()).toHaveLength(0);
  });

  test('suppression : erreur serveur -> la tâche reste affichée', async () => {
    const { r } = await launchSignedIn({ tasks: [{ title: 'Résistante' }] });
    await press(r, 'task-menu-Résistante');
    await pressAlertButton('Delete');
    db.__failNext('boom');
    await pressAlertButton('Delete');
    expect(lastAlert()).toEqual(['Error', 'boom']);
    expect(screenText(r)).toContain('Résistante');
    expect(db.__tasks()).toHaveLength(1);
  });

  test('retour depuis le formulaire', async () => {
    const { r } = await launchSignedIn();
    await press(r, 'home-add-task');
    await press(r, 'header-back');
    expect(has(r, 'home-add-task')).toBe(true);
  });
});
