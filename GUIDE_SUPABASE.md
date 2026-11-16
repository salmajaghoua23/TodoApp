# TodoApp v2 + Supabase (email / mot de passe)

## 1. Créer le projet Supabase
1. https://supabase.com → **New project** (notez le mot de passe de la base, il n'est pas utilisé dans l'app).
2. **SQL Editor → New query** : collez le contenu de `supabase/schema.sql` → **Run**.
   Cela crée la table `tasks` avec la sécurité RLS (chaque utilisateur ne voit que ses tâches).
3. **Authentication → Providers → Email** : activé par défaut.
   - Pour tester vite : *Authentication → Sign In / Providers → Email → désactivez "Confirm email"*.
   - Si vous le laissez activé, l'app affiche "Check your email" après l'inscription et l'utilisateur
     doit cliquer sur le lien reçu avant de se connecter.
4. **Project Settings → API** (ou bouton *Connect*) : copiez
   - **Project URL** (`https://xxxx.supabase.co`)
   - la clé **publishable** (ou **anon public**)

## 2. Configurer l'app
1. Décompressez ce zip à la racine du projet (là où est `package.json`). Il remplace `App.js` et `src/v2/`.
2. Ouvrez `src/v2/config.js` et collez l'URL et la clé publique.
   ⚠️ Jamais la clé `secret` / `service_role` dans l'app mobile.
3. Installez les 2 dépendances :
   ```
   npm install @supabase/supabase-js react-native-url-polyfill
   ```
4. Lancez :
   ```
   npm start -- --reset-cache     # terminal 1
   npm run android                # terminal 2
   ```
   (AsyncStorage et safe-area-context sont déjà dans votre projet.)

## 3. Ce qui est connecté à Supabase
| Fonction | Où |
|---|---|
| Inscription / connexion / déconnexion | `context/AuthContext.js` (Supabase Auth) |
| Session conservée après redémarrage | `supabase.js` (AsyncStorage) |
| Nom du profil | métadonnée `full_name` de l'utilisateur |
| Tâches : lire / ajouter / modifier / cocher / supprimer | `context/TasksContext.js` (table `tasks`) |
| Pull-to-refresh sur Home | `screens/HomeScreen.js` |

Vérifier les données : Dashboard → **Table Editor → tasks**, et **Authentication → Users**.

## 4. Problèmes fréquents
- **"Network error"** : vérifiez l'URL/clé dans `config.js` et la connexion de l'émulateur.
- **Inscription OK mais connexion refusée** : l'email n'est pas confirmé (voir étape 1.3).
- **"new row violates row-level security"** : `schema.sql` n'a pas été exécuté en entier.
- **Écran "Configure Supabase"** : `config.js` contient encore les valeurs par défaut.
- **Bouton Google** : non activé (nécessite le provider Google dans Supabase + deep link).
- Le test Jest `__tests__/App.test.js` devra être adapté (mock de Supabase / AsyncStorage).
