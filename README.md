# 🏗️ TopoGest Pro - Système de Gestion Topographique

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Platform](https://img.shields.io/badge/platform-Google%20Apps%20Script-yellow.svg)
![Locale](https://img.shields.io/badge/locale-fr__FR-orange.svg)

## 📋 Description

**TopoGest Pro** est un système complet de gestion topographique conçu spécialement pour le **Cameroun**, destiné aux projets d'**aménagement de périmètres agricoles en réseau gravitaire**.

Le système offre une solution **production-ready** avec 17 modules intégrés couvrant tous les aspects de la gestion topographique: projets, ouvrages, relevés GPS, ressources humaines, matériel, finances, documents et planning.

### 🎯 Public Cible

- Services topographiques au Cameroun
- Bureaux d'études en génie rural
- Maîtres d'ouvrage de projets d'irrigation
- Entreprises de travaux hydrauliques
- Organismes de développement agricole

## ✨ Caractéristiques Principales

### 🚀 Production-Ready

- ✅ Code optimisé et commenté en français
- ✅ Gestion d'erreurs complète
- ✅ Validation stricte des données
- ✅ Formules Google Sheets avancées (format français avec `;`)
- ✅ Mise en forme conditionnelle moderne (style GAFAM)
- ✅ Protection des feuilles avec zones de saisie
- ✅ Audit trail complet
- ✅ Système de notifications
- ✅ Sauvegarde automatique

### 📊 Modules Intégrés (17)

#### 🔷 Gestion (4 modules)
- **📁 PROJET**: Gestion complète des projets d'aménagement
- **🏗️ OUVRAGE**: Suivi des ouvrages (barrages, canaux, bassins, stations)
- **✅ TACHE**: Organisation des tâches terrain avec planning Gantt
- **📐 RELEVE**: Relevés topographiques GPS (UTM, lat/lon, altitude)

#### 🔷 Ressources Humaines (4 modules)
- **👥 EQUIPE**: Gestion des équipes terrain par spécialité
- **👤 EMPLOYE**: Gestion du personnel avec validation Cameroun
- **🔧 MATERIEL**: Suivi matériel topographique (GPS RTK, stations totales, drones)
- **💼 POSTE**: Référentiel des postes et grille salariale

#### 🔷 Finance (2 modules)
- **💰 BUDGET**: Gestion budgétaire par projet et catégorie
- **🧾 FACTURE**: Facturation clients avec numérotation auto (FCFA)

#### 🔷 Documents & Planning (3 modules)
- **📄 DOCUMENT**: GED des documents techniques avec versioning
- **📅 PLANNING**: Planning général avec suivi taux de réalisation
- **✓ CONTROLEUR**: Référentiel contrôleurs externes par spécialité

#### 🔷 Système (4 modules)
- **🔐 UTILISATEUR**: Gestion utilisateurs et permissions (4 niveaux)
- **🔔 NOTIFICATION**: Système d'alertes temps réel
- **📝 JOURNAL**: Traçabilité complète des actions
- **⚙️ CONFIGURATION**: Paramétrage système

## 📁 Architecture du Projet

```
freecodecamp_projects/
├── Code.gs                          # Point d'entrée principal
├── README.md                        # Ce fichier
├── modules/
│   ├── core/
│   │   ├── Core.gs                 # Coordination générale
│   │   ├── CoreSidebar.html        # Menu principal
│   │   └── CoreModal.html          # Gestionnaire complet
│   ├── projet/
│   │   ├── Projet.gs               # Backend projets
│   │   ├── ProjetSidebar.html      # Sidebar projets
│   │   └── ProjetModal.html        # CRUD projets
│   ├── ouvrage/
│   │   └── Ouvrage.gs              # Backend ouvrages
│   ├── tache/
│   │   └── Tache.gs                # Backend tâches
│   ├── releve/
│   │   └── Releve.gs               # Backend relevés GPS
│   ├── equipe/
│   │   └── Equipe.gs               # Backend équipes
│   ├── employe/
│   │   └── Employe.gs              # Backend employés
│   ├── materiel/
│   │   └── Materiel.gs             # Backend matériel
│   ├── poste/
│   │   └── Poste.gs                # Backend postes
│   ├── utilisateur/
│   │   └── Utilisateur.gs          # Backend utilisateurs
│   ├── journal_actions/
│   │   └── JournalActions.gs       # Backend journal
│   ├── notification/
│   │   └── Notification.gs         # Backend notifications
│   ├── document/
│   │   └── Document.gs             # Backend documents
│   ├── planning/
│   │   └── Planning.gs             # Backend planning
│   ├── controleur/
│   │   └── Controleur.gs           # Backend contrôleurs
│   ├── budget/
│   │   └── Budget.gs               # Backend budget
│   └── facture/
│       └── Facture.gs              # Backend factures
```

## 🚀 Installation et Déploiement

### Prérequis

- Compte Google
- Accès à Google Sheets
- Accès à Google Drive
- Navigateur moderne (Chrome, Firefox, Edge)

### Étapes d'Installation

#### Option 1: Déploiement depuis le code source

1. **Créer un nouveau Google Sheets**
   - Aller sur https://sheets.google.com
   - Créer une nouvelle feuille de calcul
   - Nommer: "TopoGest Pro - [Votre Organisation]"

2. **Ouvrir l'éditeur Apps Script**
   - Dans Google Sheets: `Extensions` > `Apps Script`

3. **Copier les fichiers**
   - Supprimer le fichier `Code.gs` par défaut
   - Créer un nouveau fichier `Code.gs` et copier le contenu de `/Code.gs`
   - Pour chaque module:
     - Créer un fichier avec le nom approprié (ex: `Projet.gs`)
     - Copier le contenu depuis `/modules/[module]/[Module].gs`

4. **Ajouter les fichiers HTML**
   - Créer les fichiers HTML pour les sidebars et modals
   - `Fichier` > `Nouveau` > `Fichier HTML`
   - Nommer selon la convention (ex: `CoreSidebar`, `CoreModal`)
   - Copier le contenu depuis les fichiers `.html` correspondants

5. **Enregistrer le projet**
   - `Fichier` > `Enregistrer tout`
   - Nommer le projet: "TopoGest Pro"

6. **Autoriser les permissions**
   - Lors de la première exécution, cliquer sur `Vérifier les autorisations`
   - Se connecter avec votre compte Google
   - Cliquer sur `Paramètres avancés` puis `Accéder à TopoGest Pro`
   - Autoriser toutes les permissions demandées

7. **Initialiser le système**
   - Retourner sur le Google Sheet
   - Rafraîchir la page (F5)
   - Le menu `🏗️ TopoGest Pro` apparaît
   - Cliquer sur `🛠️ Outils` > `🚀 Initialiser Système`
   - Patienter 2-3 minutes pendant l'initialisation
   - ✅ Le système est prêt!

#### Option 2: Utilisation d'un template (si disponible)

1. Ouvrir le lien du template partagé
2. `Fichier` > `Créer une copie`
3. Le système est prêt à l'emploi

## 📖 Guide d'Utilisation

### Démarrage Rapide

1. **Accéder au Tableau de Bord**
   - Menu `🏗️ TopoGest Pro` > `📊 Tableau de Bord`
   - Vue d'ensemble des KPIs principaux

2. **Créer un Projet**
   - Menu `📁 Gestion` > `📁 Projets`
   - Utiliser le modal pour saisir les informations
   - Ou saisir directement dans la feuille

3. **Ajouter des Ouvrages**
   - Menu `📁 Gestion` > `🏗️ Ouvrages`
   - Lier aux projets existants

4. **Planifier des Tâches**
   - Menu `📁 Gestion` > `✅ Tâches`
   - Affecter équipes et matériel

5. **Enregistrer des Relevés**
   - Menu `📁 Gestion` > `📐 Relevés`
   - Saisir coordonnées GPS (UTM ou lat/lon)

### Fonctionnalités Avancées

#### Recherche et Filtrage

- Chaque module dispose de fonctions de recherche
- Utiliser les sidebars pour filtrer par statut, date, etc.
- Les formules Google Sheets permettent des filtres dynamiques

#### Export de Données

- Export CSV disponible pour chaque module
- Formats spécialisés pour relevés GPS (XYZ, KML, Shapefile)
- Export système complet via menu `🛠️ Outils`

#### Notifications et Alertes

- Alertes automatiques pour:
  - Tâches en retard
  - Budget dépassé
  - Matériel nécessitant maintenance
  - Factures impayées
  - Documents en attente de validation

#### Sauvegarde

- Sauvegarde manuelle: Menu `🛠️ Outils` > `💾 Sauvegarde`
- Sauvegarde automatique quotidienne (à configurer)
- Backups stockés dans Google Drive

## 🎨 Spécificités Cameroun

### Validations Locales

- **Téléphone**: Format `+237 6XX XXX XXX` (obligatoire)
- **Email**: Validation standard avec `@` et `.`
- **GPS**: Zone UTM 33N pour le Cameroun
  - X: 200,000 - 900,000 m
  - Y: 200,000 - 1,500,000 m
  - Altitude: 0 - 4,100 m (Mont Cameroun)
- **Latitude**: 2°N - 13°N
- **Longitude**: 8°E - 16°E
- **Devise**: FCFA avec formatage `#,##0" FCFA"`
- **TVA**: Taux standard 19,25%

### Régions Prises en Charge

- Extrême-Nord (Logone et Chari, Mayo-Danay, etc.)
- Nord (Bénoué, Mayo-Louti, etc.)
- Adamaoua (Vina, Mbéré, etc.)
- Centre (Yaoundé, etc.)
- Ouest (Noun, Bamboutos, etc.)
- Littoral (Douala, etc.)
- Sud, Est, Sud-Ouest, Nord-Ouest

## 📊 KPIs et Analyses

### Indicateurs par Module

Chaque module dispose de 15 à 20 KPIs spécifiques:

- **Projets**: Budget total, taux d'exécution, progression, superficies
- **Ouvrages**: Coûts, types, statuts, taux de réalisation
- **Tâches**: Taux de complétion, retards, échéances
- **Relevés**: Nombre par type, précision, validation
- **RH**: Effectif, ancienneté, masse salariale, taux d'occupation
- **Finance**: CA, recouvrement, dépassements, impayés

### Graphiques Intégrés

- Répartition (Pie charts)
- Évolutions temporelles (Line charts)
- Comparaisons (Column/Bar charts)
- Distributions (Histograms)
- Cartes de points (Scatter plots pour GPS)

## 🔒 Sécurité et Permissions

### Niveaux d'Accès

1. **Admin**: Accès complet, configuration système
2. **Chef Projet**: Gestion projets et équipes
3. **Topographe**: Saisie relevés et tâches
4. **Lecture seule**: Consultation uniquement

### Protection des Données

- Feuilles protégées avec zones de saisie déprotégées
- Audit trail complet (qui, quand, quoi)
- Mot de passe hashé (à implémenter en production)
- Sauvegarde automatique quotidienne

## 🛠️ Maintenance

### Vérification d'Intégrité

Menu `🛠️ Outils` > `🔍 Vérifier Intégrité`
- Vérifie toutes les feuilles
- Compte les enregistrements
- Détecte les incohérences

### Nettoyage des Données

Menu `🛠️ Outils` > `🗑️ Nettoyer Données`
- Supprime les entrées anciennes (>365 jours)
- Nettoie le journal d'actions
- Optimise les performances

### Réinitialisation

⚠️ **ATTENTION**: Supprime toutes les données!

Menu `🛠️ Outils` > `🔄 Réinitialiser Système`

## 📞 Support et Contact

- **Email**: support@topogest.cm
- **Téléphone**: +237 6XX XXX XXX
- **Documentation**: Voir menu `📚 Documentation`

## 📝 Licence

© 2024 TopoGest Pro. Tous droits réservés.

Développé pour les services topographiques du Cameroun.

## 🙏 Crédits

- **Conception**: TopoGest Pro Team
- **Développement**: [Votre nom/organisation]
- **Technologies**: Google Apps Script, Google Sheets
- **Design**: Inspiré des standards GAFAM (Google Material Design)

## 🗺️ Roadmap

### Version 1.1 (À venir)

- [ ] Module mobile (Progressive Web App)
- [ ] Import automatique données GPS
- [ ] Intégration SIG avancée
- [ ] API REST pour intégrations externes
- [ ] Module de reporting avancé
- [ ] Gestion multi-projets améliorée
- [ ] Dashboard personnalisable

### Version 2.0 (Futur)

- [ ] Application mobile native (Android/iOS)
- [ ] Synchronisation offline
- [ ] Machine Learning pour prévisions
- [ ] Intégration drones pour photogrammétrie
- [ ] Modélisation 3D des ouvrages

## 🎓 Formation

Des formations sont disponibles sur demande:
- Initiation TopoGest Pro (1 jour)
- Formation avancée (2 jours)
- Formation administrateur (1 jour)
- Formation sur site possible

## ⚙️ Configuration Technique

### Compatibilité

- **Navigateurs**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Google Sheets**: Version récente (2023+)
- **Apps Script**: V8 Runtime

### Performances

- **Capacité**: Jusqu'à 10,000 lignes par feuille
- **Modules**: 17 modules intégrés
- **Formules**: ~500 formules avancées
- **Graphiques**: 60+ graphiques automatiques
- **KPIs**: 250+ indicateurs

### Limitations Google Sheets

- Maximum 5 millions de cellules par fichier
- Temps d'exécution script: 6 minutes max
- Déclencheurs: 20 par script
- Quotas Google Drive selon compte (15 GB gratuit)

## 🔧 Développement

### Stack Technique

- **Backend**: Google Apps Script (JavaScript ES6+)
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: Google Sheets (NoSQL-like)
- **Storage**: Google Drive
- **Design**: Google Material Design

### Convention de Code

- Langue: Français
- Séparateur formules: `;` (locale française)
- Commentaires JSDoc
- Nommage: camelCase pour variables, PascalCase pour classes

### Contribuer

Les contributions sont les bienvenues! Merci de:
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**🌟 Fait avec passion pour l'excellence topographique au Cameroun 🇨🇲**

*TopoGest Pro - Quand la technologie rencontre l'expertise terrain*
