# 📘 Guide de Déploiement - Système de Gestion Topographique

## 🎯 Vue d'ensemble

Ce guide vous explique comment déployer le système complet de gestion topographique sur Google Sheets avec Apps Script.

## 📋 Prérequis

- Un compte Google
- Accès à Google Sheets
- Accès à Google Apps Script

## 🚀 Étapes de Déploiement

### Étape 1: Créer le Google Sheet

1. Aller sur [Google Sheets](https://sheets.google.com)
2. Créer un nouveau classeur
3. Le renommer: "Système de Gestion Topographique - [Nom du Projet]"

### Étape 2: Accéder à Apps Script

1. Dans le menu Google Sheets: **Extensions** > **Apps Script**
2. Un nouvel onglet s'ouvrira avec l'éditeur Apps Script
3. Supprimer le code par défaut (`function myFunction() {}`)

### Étape 3: Copier les fichiers .gs (Google Script)

Copier les fichiers dans l'ordre suivant:

#### 1. Configuration (Obligatoire en premier)
```
Fichier: CORE/Config.gs
```
- Cliquer sur **+** à côté de "Fichiers"
- Sélectionner "Script"
- Nommer: `Config`
- Coller le contenu de `CORE/Config.gs`

#### 2. Utilitaires
```
Fichier: CORE/Utils.gs
```
- Nouveau script nommé `Utils`
- Coller le contenu de `CORE/Utils.gs`

#### 3. Module Core Principal
```
Fichier: CORE/Core.gs
```
- Nouveau script nommé `Core`
- Coller le contenu de `CORE/Core.gs`

#### 4. Tous les Modules
```
Fichier: CORE/AllModules.gs
```
- Nouveau script nommé `AllModules`
- Coller le contenu de `CORE/AllModules.gs`

#### 5. Module Projet
```
Fichier: PROJET/ProjetModule.gs
```
- Nouveau script nommé `ProjetModule`
- Coller le contenu de `PROJET/ProjetModule.gs`

### Étape 4: Copier les fichiers HTML

#### 1. Sidebar Principale
- Cliquer sur **+** à côté de "Fichiers"
- Sélectionner "HTML"
- Nommer: `MainSidebar`
- Coller le contenu de `CORE/MainSidebar.html`

#### 2. Sidebar Projet
- Nouveau fichier HTML nommé `ProjetSidebar`
- Coller le contenu de `PROJET/ProjetSidebar.html`

#### 3. Modal Projet
- Nouveau fichier HTML nommé `ProjetModal`
- Coller le contenu de `PROJET/ProjetModal.html`

### Étape 5: Configurer le projet Apps Script

1. Cliquer sur l'icône ⚙️ (Paramètres du projet)
2. Copier le contenu de `appsscript.json` dans l'éditeur de manifest
3. Sauvegarder

### Étape 6: Première exécution

1. Dans l'éditeur Apps Script, sélectionner la fonction `onOpen` dans le menu déroulant
2. Cliquer sur **▶ Exécuter**
3. Autoriser les permissions demandées:
   - Lire et modifier les fichiers Google Sheets
   - Afficher et exécuter du contenu web tiers
   - Envoyer des emails (pour les notifications)

4. Retourner sur le Google Sheet
5. Actualiser la page (F5)
6. Le menu **🏗️ GESTION TOPO** devrait apparaître

### Étape 7: Initialisation du système

1. Dans le menu **🏗️ GESTION TOPO**, cliquer n'importe où
2. Le système s'initialisera automatiquement
3. Toutes les feuilles seront créées avec:
   - En-têtes formatés
   - Formules avancées
   - Validations de données
   - Mises en forme conditionnelles
   - Graphiques

## 📊 Structure des Feuilles Créées

Après initialisation, vous aurez les feuilles suivantes:

### Feuilles Principales
- 📊 **Tableau de Bord** - Vue d'ensemble avec KPIs
- 📁 **Projets** - Gestion des projets
- 🏗️ **Ouvrages** - Gestion des ouvrages
- ✓ **Tâches** - Gestion des tâches
- 📍 **Relevés** - Relevés topographiques

### Feuilles RH
- 👤 **Employés** - Base de données employés
- 👥 **Équipes** - Gestion des équipes
- 💼 **Postes** - Définition des postes

### Feuilles Gestion
- 🔧 **Matériel** - Inventaire matériel
- 💰 **Budget** - Suivi budgétaire
- 🧾 **Factures** - Gestion des factures

### Feuilles Support
- 🔐 **Utilisateurs** - Gestion des accès
- 🔔 **Notifications** - Centre de notifications
- 📄 **Documents** - GED
- 📅 **Planning** - Planification
- ✅ **Contrôleurs** - Contrôle qualité
- 📝 **Journal Actions** - Audit trail
- 📈 **Statistiques** - Analyses avancées

## 🎨 Personnalisation

### Modifier les Couleurs

Dans `CORE/Config.gs`, section `COLORS`:
```javascript
COLORS: {
  PRIMARY: "#1a73e8",    // Couleur principale
  SECONDARY: "#34a853",  // Couleur secondaire
  // ... etc
}
```

### Ajouter des Statuts

Dans `CORE/Config.gs`, section `STATUTS`:
```javascript
STATUTS: {
  PROJET: ["En Préparation", "En Cours", "En Pause", "Terminé", "Annulé"],
  // Ajouter vos propres statuts
}
```

### Modifier les Types d'Ouvrages

Dans `CORE/Config.gs`, section `TYPES_OUVRAGE`:
```javascript
TYPES_OUVRAGE: [
  "Levé Topographique",
  "Implantation",
  // Ajouter vos types
]
```

## 🔒 Sécurité et Permissions

### Partage du Classeur

1. Cliquer sur **Partager** en haut à droite
2. Ajouter les utilisateurs avec les rôles appropriés:
   - **Éditeur** : Peut modifier les données
   - **Lecteur** : Lecture seule
   - **Commentateur** : Peut commenter

### Protection des Feuilles

Les colonnes avec formules sont automatiquement protégées en "avertissement uniquement". Pour une protection stricte:

1. Clic droit sur une feuille > **Protéger la feuille**
2. Configurer les permissions
3. Définir les utilisateurs autorisés

## 📱 Utilisation

### Navigation Principale

Utiliser le menu **🏗️ GESTION TOPO** pour accéder à:
- Tableaux de bord
- Formulaires de saisie
- Rapports et analyses
- Paramètres

### Saisie des Données

Deux méthodes:

#### 1. Saisie Directe dans les Feuilles
- Aller sur la feuille concernée
- Saisir directement dans les cellules non protégées
- Les formules se calculent automatiquement

#### 2. Via les Modals (Recommandé)
- Menu > Module > "Nouveau [Entité]"
- Remplir le formulaire
- Valider
- Les données sont ajoutées automatiquement

### Recherche et Filtres

Utiliser les sidebars pour:
- Recherche rapide
- Filtres avancés
- Statistiques en temps réel

## 🔧 Maintenance

### Actualiser les Données

Menu > **🛠️ Outils** > **🔄 Synchroniser Données**

### Nettoyer les Données

Menu > **🛠️ Outils** > **🗑️ Nettoyer Données**
- Supprime les lignes vides
- Optimise les performances

### Recalculer les Formules

Menu > **🛠️ Outils** > **🔧 Recalculer Formules**

### Réappliquer les Formats

Menu > **🛠️ Outils** > **🎨 Réappliquer Formats**
- Réinitialise tous les formats
- Recrée tous les graphiques

## 📊 Rapports

### Générer un Rapport Global

Menu > **📊 Rapports & Analyses** > **📊 Rapport Global**

### Exporter les Données

Menu > **📊 Rapports & Analyses** > **📤 Exporter Données**
- Format CSV
- Toutes les feuilles

## 🐛 Dépannage

### Le menu n'apparaît pas

1. Actualiser la page (F5)
2. Vérifier que tous les scripts sont bien copiés
3. Réexécuter la fonction `onOpen`

### Erreur de permissions

1. Aller dans Apps Script
2. Réautoriser les permissions
3. Retourner sur le Sheet

### Formules #REF!

1. Vérifier que toutes les feuilles sont créées
2. Menu > **🛠️ Outils** > **🔧 Recalculer Formules**

### Données manquantes

1. Vérifier le **Journal des Actions** (feuille 📝)
2. Consulter les logs dans Apps Script (View > Logs)

## 📞 Support

Pour toute question:
1. Consulter le fichier `README.md`
2. Vérifier le **Journal des Actions**
3. Contacter l'administrateur système

## 🎓 Formation

### Pour les Utilisateurs

1. Consulter le guide utilisateur in-app: Menu > **❓ Aide** > **📖 Guide Utilisateur**
2. Visionner les tutoriels: Menu > **❓ Aide** > **🎥 Tutoriels Vidéo**

### Pour les Administrateurs

1. Maîtriser la configuration dans `Config.gs`
2. Comprendre le système de formules
3. Gérer les permissions et la sécurité

## 🚀 Mises à Jour Futures

Pour mettre à jour le système:

1. Sauvegarder le classeur actuel (Fichier > Créer une copie)
2. Copier les nouveaux fichiers .gs et .html
3. Tester sur la copie
4. Déployer sur le classeur de production

## ✅ Checklist de Déploiement

- [ ] Google Sheet créé
- [ ] Apps Script ouvert
- [ ] Fichiers .gs copiés (Config, Utils, Core, AllModules, ProjetModule)
- [ ] Fichiers .html copiés (MainSidebar, ProjetSidebar, ProjetModal)
- [ ] appsscript.json configuré
- [ ] Permissions autorisées
- [ ] Fonction onOpen exécutée
- [ ] Menu visible dans le Sheet
- [ ] Système initialisé
- [ ] Toutes les feuilles créées
- [ ] Formules fonctionnelles
- [ ] Graphiques affichés
- [ ] Tests de saisie effectués
- [ ] Utilisateurs ajoutés et formés

## 🎉 Félicitations !

Votre système de gestion topographique est maintenant opérationnel !

---

**Version**: 1.0.0
**Date**: 2024
**Auteur**: Système de Gestion Topographique
**Localisation**: Cameroun - Projets d'aménagement agricole en réseau gravitaire
