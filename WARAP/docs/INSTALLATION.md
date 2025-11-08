# 🚀 GUIDE D'INSTALLATION WARAP

## Prérequis

- ✅ Compte Google (Gmail ou Workspace)
- ✅ Accès à Google Sheets
- ✅ Connexion Internet stable
- ✅ Navigateur moderne (Chrome, Firefox, Edge, Safari)

## Installation Complète (15 minutes)

### Étape 1 : Créer le Google Sheet

1. Allez sur [sheets.google.com](https://sheets.google.com)
2. Créez un nouveau tableur vierge
3. Nommez-le : **WARAP - Production**

### Étape 2 : Ouvrir l'Éditeur Apps Script

1. Dans le menu Google Sheets :
   - Cliquez sur **Extensions** > **Apps Script**

2. Une nouvelle fenêtre s'ouvre avec l'éditeur de code
   - Supprimez le code par défaut (`function myFunction() {...}`)

### Étape 3 : Copier les Fichiers Apps Script (.gs)

#### 3.1 Fichiers Core (OBLIGATOIRES)

Créez les fichiers suivants dans Apps Script :

**Pour chaque fichier :**
1. Cliquez sur ➕ à côté de "Fichiers"
2. Choisissez "Script"
3. Donnez le nom exact du fichier
4. Copiez le contenu depuis `/WARAP/src/`
5. Enregistrez (Ctrl+S ou Cmd+S)

**Liste des fichiers Core à créer :**

1. `01_Main.gs`
   - Source : `WARAP/src/core/01_Main.gs`

2. `02_WARAP_ID_Generator.gs`
   - Source : `WARAP/src/core/02_WARAP_ID_Generator.gs`

3. `03_WARAP_Security_Manager.gs`
   - Source : `WARAP/src/core/03_WARAP_Security_Manager.gs`

4. `04_WARAP_Setup.gs`
   - Source : `WARAP/src/core/04_WARAP_Setup.gs`

5. `WARAP_Clients_Manager.gs`
   - Source : `WARAP/src/business/WARAP_Clients_Manager.gs`

6. `WARAP_Cameroon_Utils.gs`
   - Source : `WARAP/src/utils/WARAP_Cameroon_Utils.gs`

### Étape 4 : Copier les Fichiers HTML

**Pour chaque fichier HTML :**
1. Cliquez sur ➕ à côté de "Fichiers"
2. Choisissez "HTML"
3. Donnez le nom exact du fichier
4. Copiez le contenu depuis `/WARAP/html/`
5. Enregistrez

**Fichier HTML à créer :**

1. `Sidebar_Clients`
   - Source : `WARAP/html/sidebars/Sidebar_Clients.html`

### Étape 5 : Exécuter l'Installation

1. Retournez dans le Google Sheet
2. **Actualisez la page** (F5 ou Ctrl+R)
3. Un nouveau menu "🚀 WARAP" devrait apparaître en haut
   - ⚠️ Si le menu n'apparaît pas, attendez 30 secondes et actualisez à nouveau

4. Cliquez sur : **🚀 WARAP** > **⚙️ Installer WARAP**

5. **Autorisation des permissions** :
   - Google va demander d'autoriser l'application
   - Cliquez sur "Autoriser"
   - Sélectionnez votre compte Google
   - Cliquez sur "Avancé" (si nécessaire)
   - Cliquez sur "Accéder à [nom du projet] (dangereux)"
   - Autorisez toutes les permissions

6. L'installation démarre :
   - ⏳ Durée : 2-3 minutes
   - Ne fermez pas la fenêtre !

7. Message de confirmation :
   ```
   ✅ Installation réussie !

   WARAP a été installé avec succès.

   📊 20 feuilles créées
   ⚙️ Configurations appliquées
   🤖 IA Matching activée

   Actualisez la page pour voir le menu complet.
   ```

8. **Actualisez à nouveau la page** (F5)

### Étape 6 : Vérifier l'Installation

1. Le menu **🚀 WARAP** doit être complet avec tous les modules

2. Vérifier les feuilles créées :
   - Dans le bas du Sheet, vous devez voir 20+ onglets :
     - ClientsWARAP
     - PrestatairesWARAP
     - AnnoncesWARAP
     - Matchings_Proposes
     - TransactionsWARAP
     - etc.

3. Tester l'accès :
   - Cliquez sur **🚀 WARAP** > **👥 Clients** > **📋 Voir les clients**
   - Une sidebar doit s'ouvrir à droite

4. Exécuter le diagnostic :
   - **🚀 WARAP** > **🔧 Diagnostic Système**
   - Tous les tests doivent être ✅ PASS

### Étape 7 : Configuration Initiale

#### 7.1 Ajouter des Utilisateurs

1. **🚀 WARAP** > **⚙️ Administration** > **👥 Utilisateurs**
2. Ajoutez vos collègues avec leurs rôles :
   - SUPERADMIN : Accès total
   - ADMIN_NATIONAL : Toutes franchises
   - ADMIN_FRANCHISE : Une franchise
   - SUPERVISEUR : Une zone
   - AGENT : Une commune

#### 7.2 Vérifier les Paramètres

1. **🚀 WARAP** > **⚙️ Administration** > **⚙️ Paramètres**
2. Vérifiez les paramètres par défaut :
   - Commission Plateforme : 15%
   - Commission Franchise : 10%
   - Score Auto-Validation Matching : 85/100

#### 7.3 Charger les Données Initiales (Optionnel)

Si vous avez des données existantes :

1. **Clients** : Importez vos clients via CSV
2. **Prestataires** : Importez vos prestataires
3. **Produits** : Chargez votre catalogue

## ✅ Installation Terminée !

Votre plateforme WARAP est maintenant opérationnelle.

### Prochaines Étapes

1. **Formation** :
   - Formez votre équipe à l'utilisation de WARAP
   - Consultez le [Guide Utilisateur](USER_GUIDE.md)

2. **Données** :
   - Commencez à créer vos premiers clients
   - Ajoutez vos prestataires
   - Publiez des annonces

3. **Matching IA** :
   - Le système match automatiquement toutes les 2 minutes
   - Surveillez les résultats dans **🎯 Matching IA**

## 🆘 Problèmes Courants

### Le menu WARAP n'apparaît pas

**Solutions :**
1. Actualisez la page (F5)
2. Attendez 30-60 secondes
3. Fermez et rouvrez le Google Sheet
4. Vérifiez que les fichiers .gs sont bien enregistrés

### Erreur "Impossible de récupérer l'email"

**Solution :**
1. Retournez dans Apps Script
2. Exécutez manuellement `installWARAP()`
3. Autorisez à nouveau les permissions

### Erreur "Feuille non trouvée"

**Solution :**
1. **🚀 WARAP** > **🔧 Diagnostic Système**
2. Vérifiez quelles feuilles manquent
3. Relancez l'installation : **🚀 WARAP** > **⚙️ Installer WARAP**

### Permissions refusées

**Solution :**
1. Apps Script > ⚙️ Paramètres du projet
2. Cochez "Afficher le fichier manifeste appsscript.json"
3. Vérifiez les autorisations OAuth

## 📞 Support

- **Email** : warapservices@gmail.com
- **Documentation** : Consultez les guides dans `/docs/`
- **Issues** : Contactez l'équipe WARAP

## 📝 Checklist Post-Installation

- [ ] Menu WARAP visible
- [ ] 20 feuilles créées
- [ ] Diagnostic système ✅ PASS
- [ ] Sidebar Clients accessible
- [ ] Utilisateurs configurés
- [ ] Paramètres vérifiés
- [ ] Premier client créé (test)
- [ ] Matching IA fonctionnel

---

**Félicitations ! WARAP est installé et prêt à l'emploi. 🎉**
