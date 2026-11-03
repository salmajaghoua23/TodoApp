# Guide de démarrage – TodoApp (React Native + JavaScript)

## 1. Installer les outils
1. Node.js 22.11 ou plus : https://nodejs.org  (vérifier : `node -v`)
2. JDK 17 (inclus dans Android Studio : "jbr"). Vérifier : `java -version`
3. Android Studio : https://developer.android.com/studio
   - SDK Manager : installer Android SDK Platform 36 (ou la dernière), Build-Tools, Platform-Tools
   - Device Manager : créer un émulateur (ex. Pixel 7, API 34+)
4. Variables d'environnement (Windows) :
   - ANDROID_HOME = C:\Users\<vous>\AppData\Local\Android\Sdk
   - Ajouter au PATH : %ANDROID_HOME%\platform-tools
   - JAVA_HOME = C:\Program Files\Android\Android Studio\jbr

## 2. Préparer le projet
1. Dézipper TodoApp.zip (chemin COURT, ex. C:\projets\TodoApp, sans espaces).
2. Ouvrir un terminal dans le dossier : `npm install`

## 3. Lancer l'application
1. Démarrer l'émulateur (Android Studio > Device Manager > Play) ou brancher un téléphone (débogage USB activé).
2. Terminal 1 : `npm start`
3. Terminal 2 : `npm run android`
   La première compilation Gradle prend 5 à 15 minutes (téléchargements).

### Option : depuis Android Studio
File > Open > sélectionner le dossier `android/` > attendre "Gradle Sync" > bouton Run.
Garder `npm start` lancé dans un terminal.

## 4. Tests et qualité
`npm test`  (Jest, 7 tests)    |   `npm run lint`  (ESLint)

## 5. Générer l'APK
```
cd android
gradlew assembleRelease        (Windows)   ./gradlew assembleRelease (Linux/Mac)
```
Résultat : android/app/build/outputs/apk/release/app-release.apk
(Signé avec la clé debug du template : suffisant pour la démo. Pour une vraie release, créer un keystore.)

## 6. Pipeline Azure DevOps
1. Pousser le projet dans Azure Repos (le dossier node_modules est ignoré par .gitignore).
2. Pipelines > New pipeline > Azure Repos Git > "Existing Azure Pipelines YAML file" > azure-pipelines.yml
3. Le pipeline : npm ci > lint > tests + couverture > build APK > publication de l'artefact.
4. Ensuite ajouter : SonarQube/SonarCloud, signature (Secure files), Firebase App Distribution.

## 7. Problèmes fréquents
- "SDK location not found" : créer android/local.properties avec `sdk.dir=C\:\\Users\\<vous>\\AppData\\Local\\Android\\Sdk`
- Écran rouge "Unable to load script" : lancer `npm start`, puis `adb reverse tcp:8081 tcp:8081`
- Port 8081 occupé : fermer l'ancien Metro ou `npm start -- --port 8082`
- Erreur Java : vérifier JDK 17 (JAVA_HOME)
- Build bloqué : `cd android && gradlew clean` puis relancer
- "No hosted parallelism" sur Azure : demander le parallélisme gratuit à Microsoft.
