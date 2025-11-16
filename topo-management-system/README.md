# 🏗️ Système de Gestion Topographique

## Description
Système complet de gestion de service topographique pour projets d'aménagement de périmètres agricoles en réseau gravitaire au Cameroun.

## Architecture du Système

### Modules Principaux
1. **CORE** - Module central de coordination
2. **PROJET** - Gestion des projets topographiques
3. **OUVRAGE** - Gestion des ouvrages
4. **TACHE** - Gestion des tâches
5. **RELEVE** - Gestion des relevés topographiques

### Modules RH
6. **EMPLOYE** - Gestion des employés
7. **EQUIPE** - Gestion des équipes
8. **POSTE** - Gestion des postes

### Modules Gestion
9. **MATERIEL** - Gestion du matériel
10. **BUDGET** - Gestion des budgets
11. **FACTURE** - Gestion des factures

### Modules Support
12. **UTILISATEUR** - Gestion des utilisateurs
13. **NOTIFICATION** - Système de notifications
14. **DOCUMENT** - Gestion documentaire
15. **PLANNING** - Planification et calendrier
16. **CONTROLEUR** - Contrôle qualité
17. **JOURNAL_ACTIONS** - Journal des actions

## Structure des Fichiers

```
topo-management-system/
├── appsscript.json
├── CORE/
│   ├── Core.gs              # Menu principal et coordination
│   ├── Config.gs            # Configuration globale
│   ├── Utils.gs             # Fonctions utilitaires
│   └── MainSidebar.html     # Interface sidebar principale
├── PROJET/
│   ├── ProjetModule.gs      # Backend module Projet
│   ├── ProjetSidebar.html   # Interface sidebar Projet
│   └── ProjetModal.html     # Interface modal Projet
├── [Autres modules...]
└── README.md
```

## Fonctionnalités Clés

### ✅ Implémentées
- ✅ Menu principal complet
- ✅ Tableau de bord avec indicateurs clés
- ✅ Module PROJET complet (CRUD, statistiques, graphiques)
- ✅ Système de journalisation des actions
- ✅ Système de notifications
- ✅ Formules avancées Google Sheets
- ✅ Mises en forme conditionnelles
- ✅ Graphiques et analyses automatiques

### 🔄 En Développement
- 🔄 Modules OUVRAGE, TACHE, RELEVE
- 🔄 Modules RH
- 🔄 Modules Gestion
- 🔄 Modules Support

## Installation

1. Créer un nouveau Google Sheets
2. Ouvrir l'éditeur Apps Script (Extensions > Apps Script)
3. Copier tous les fichiers .gs dans l'éditeur
4. Créer les fichiers HTML correspondants
5. Sauvegarder et actualiser le classeur
6. Le menu "🏗️ GESTION TOPO" apparaîtra automatiquement

## Utilisation

### Premier Lancement
1. Ouvrir le classeur
2. Le système s'initialise automatiquement
3. Toutes les feuilles sont créées avec leurs formules
4. Utiliser le menu pour naviguer entre les modules

### Navigation
- **Menu Principal** : Accès à tous les modules
- **Tableau de Bord** : Vue d'ensemble des KPIs
- **Sidebars** : Interfaces rapides pour chaque module
- **Modals** : Formulaires CRUD complets

## Caractéristiques Techniques

### Formules Avancées
- Formules de liaison entre feuilles
- Calculs automatiques (budgets, avancements, etc.)
- Fonctions SOMME.SI, NB.SI, NB.SI.ENS
- Formules conditionnelles avancées

### Mise en Forme
- Design moderne type GAFAM
- Couleurs cohérentes (Palette Google)
- Mises en forme conditionnelles
- Graphiques dynamiques

### Performance
- Formules optimisées
- Plages protégées pour éviter les erreurs
- Validation des données
- Indexation par ID

## Configuration

### Personnalisation
Modifier le fichier `CORE/Config.gs` pour personnaliser:
- Couleurs du thème
- Statuts disponibles
- Types d'ouvrages/relevés
- Formats de nombres et dates
- Paramètres de notification

### Localisation
- Système en français
- Format de date: dd/mm/yyyy
- Devise: FCFA
- Séparateur de formules: point-virgule (;)

## Sécurité

### Protection des Données
- Colonnes calculées protégées
- Validations des saisies
- Niveaux d'accès utilisateur
- Journal des actions complet

### Permissions
- Gestion fine des droits
- Protection contre les modifications accidentelles
- Alertes sur les actions sensibles

## Support

Pour toute question ou problème:
- Consulter la documentation in-app (Menu Aide)
- Vérifier les logs dans le Journal des Actions
- Contacter l'administrateur système

## Licence

© 2024 - Système de Gestion Topographique
Tous droits réservés

## Version

**v1.0.0** - Version initiale
- Menu principal complet
- Module PROJET production-ready
- Infrastructure de base pour tous les modules

---

*Développé pour les projets d'aménagement de périmètres agricoles en réseau gravitaire au Cameroun*
