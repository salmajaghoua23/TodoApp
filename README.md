# TodoApp – React Native (JavaScript)

Application Todo List (ajouter, cocher, supprimer, filtrer) + pipeline Azure DevOps.

## Prérequis
- Node.js 22.11+ ; JDK 17 ; Android Studio (SDK + émulateur) ; variable ANDROID_HOME définie.

## Lancer
```
npm install
npm start            # terminal 1 (Metro)
npm run android      # terminal 2 (émulateur ou téléphone branché)
```
Dans Android Studio : File > Open > dossier `android/`, Sync Gradle, puis Run.
(Metro `npm start` doit tourner en mode debug.)

## Tests
```
npm test
npm run lint
```
