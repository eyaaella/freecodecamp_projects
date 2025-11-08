# Module de Logs WARAP

## 📋 Description

Le module de logs WARAP est un système complet de gestion et d'audit des événements pour la plateforme WARAP (marketplace inversée). Il permet de tracer toutes les actions effectuées sur la plateforme, de détecter les activités suspectes et d'analyser les comportements des utilisateurs.

## 🗂️ Structure des fichiers

```
WARAP/
├── backend/
│   └── WARAP_Logs_Manager.gs       # Gestionnaire backend des logs
└── frontend/
    ├── Sidebar_Logs.html           # Interface de consultation des logs
    └── Modal_Logs_Details.html     # Modal de détails d'un événement
```

## 📊 Structure de la feuille Logs_WARAP

### Colonnes (A-P)

| Colonne | Nom | Type | Description |
|---------|-----|------|-------------|
| A | ID_Log | Formule | Identifiant unique (LOG00000000001) |
| B | Timestamp | Date/Heure | Horodatage de l'événement |
| C | Type_Evenement | Liste | Création/Modification/Suppression/Connexion/Erreur/Alerte |
| D | Module | Texte | Clients/Transactions/Matching/etc. |
| E | Action_Effectuee | Texte | Description de l'action |
| F | Utilisateur_Email | Email | Email de l'utilisateur |
| G | Utilisateur_Role | Formule | Rôle (VLOOKUP depuis Utilisateurs) |
| H | Entite_Type | Texte | Type d'entité concernée |
| I | Entite_ID | Texte | ID de l'entité concernée |
| J | Anciennes_Valeurs | JSON | Valeurs avant modification |
| K | Nouvelles_Valeurs | JSON | Valeurs après modification |
| L | IP_Adresse | Texte | Adresse IP de l'utilisateur |
| M | Navigateur_Agent | Texte | User agent du navigateur |
| N | Statut | Liste | Succès/Erreur/Avertissement |
| O | Message_Erreur | Texte | Message d'erreur si applicable |
| P | Niveau_Securite | Liste | Public/Privé/Confidentiel/Critique |

### Formules de surveillance (Colonnes S-U)

- **S2**: Connexions échouées aujourd'hui
- **T2**: Modifications sensibles (transactions) aujourd'hui
- **U2**: Total événements aujourd'hui

## 🔧 Backend - WARAP_Logs_Manager.gs

### Fonctions principales

#### 1. Création de la feuille

```javascript
createLogsSheetIfNotExists()
```
Crée automatiquement la feuille Logs_WARAP avec :
- En-têtes formatés
- Validations de données
- Formules de surveillance
- Mise en forme conditionnelle

#### 2. Enregistrement d'actions

```javascript
logAction(module, action, data)
```

**Paramètres:**
- `module`: Nom du module (string)
- `action`: Description de l'action (string)
- `data`: Objet contenant les détails
  - `typeEvenement`: Type d'événement (optionnel, défaut: "Modification")
  - `entiteType`: Type d'entité concernée
  - `entiteId`: ID de l'entité
  - `anciennesValeurs`: Objet des anciennes valeurs
  - `nouvellesValeurs`: Objet des nouvelles valeurs
  - `niveauSecurite`: Niveau de sécurité (optionnel, défaut: "Privé")

**Exemple:**
```javascript
logAction('Clients', 'Mise à jour profil', {
  typeEvenement: 'Modification',
  entiteType: 'Client',
  entiteId: 'CLI00001',
  anciennesValeurs: { nom: 'Dupont', tel: '0123456789' },
  nouvellesValeurs: { nom: 'Dupont', tel: '0987654321' },
  niveauSecurite: 'Privé'
});
```

#### 3. Enregistrement d'erreurs

```javascript
logError(module, error, data)
```

**Paramètres:**
- `module`: Module où l'erreur s'est produite
- `error`: Objet Error ou string
- `data`: Données supplémentaires (optionnel)

**Exemple:**
```javascript
try {
  // Code susceptible de générer une erreur
} catch (error) {
  logError('Transactions', error, {
    action: 'Création transaction',
    entiteId: 'TRX00001'
  });
}
```

#### 4. Événements de sécurité

```javascript
logSecurityEvent(event, severity, data)
```

**Paramètres:**
- `event`: Description de l'événement
- `severity`: Niveau de sécurité (Public/Privé/Confidentiel/Critique)
- `data`: Données supplémentaires

**Exemple:**
```javascript
logSecurityEvent('Tentative accès non autorisé', 'Critique', {
  module: 'Sécurité',
  details: {
    section: 'Administration',
    tentatives: 3
  }
});
```

#### 5. Recherche de logs

```javascript
getLogsByUser(email, period)
```
Récupère les logs d'un utilisateur sur une période donnée.

```javascript
getLogsByModule(module, period)
```
Récupère les logs d'un module sur une période donnée.

```javascript
searchLogs(filters)
```
Recherche avancée avec filtres multiples.

**Filtres disponibles:**
- `dateDebut`: Date de début
- `dateFin`: Date de fin
- `typeEvenement`: Type d'événement
- `module`: Module
- `utilisateur`: Email utilisateur
- `statut`: Statut
- `niveauSecurite`: Niveau de sécurité
- `searchText`: Recherche textuelle

**Exemple:**
```javascript
const logs = searchLogs({
  module: 'Transactions',
  statut: 'Erreur',
  dateDebut: '2024-01-01',
  dateFin: '2024-01-31'
});
```

#### 6. Analyse d'activité

```javascript
analyzeUserActivity(email)
```
Analyse l'activité d'un utilisateur sur les 30 derniers jours.

**Retourne:**
```javascript
{
  totalActions: 150,
  actionsByType: {
    'Modification': 80,
    'Création': 50,
    'Suppression': 20
  },
  actionsByModule: {
    'Clients': 60,
    'Transactions': 90
  },
  errors: 5,
  warnings: 10,
  lastActivity: Date,
  mostActiveModule: 'Transactions',
  activityByDay: {
    '2024-01-15': 25,
    '2024-01-16': 30
  }
}
```

#### 7. Détection d'activités suspectes

```javascript
detectSuspiciousActivity()
```
Détecte automatiquement les comportements anormaux :
- Plus de 100 actions en 24h
- Plus de 10 erreurs en 24h

#### 8. Export

```javascript
exportLogsToCSV(filters)
```
Exporte les logs au format CSV avec les filtres appliqués.

#### 9. Statistiques globales

```javascript
getLogsStatistics()
```
Obtient les statistiques complètes de tous les logs.

## 🎨 Frontend - Sidebar_Logs.html

### Fonctionnalités

#### 1. Statistiques en temps réel
Affiche 4 cartes de statistiques :
- Événements aujourd'hui
- Événements cette semaine
- Total d'erreurs
- Total global

#### 2. Détection d'activités suspectes
Affiche automatiquement une alerte si des activités suspectes sont détectées.

#### 3. Filtres avancés
- **Période**: Date de début et fin
- **Type d'événement**: Checkboxes multiples
- **Module**: Liste déroulante
- **Utilisateur**: Champ email
- **Statut**: Liste déroulante
- **Niveau de sécurité**: Liste déroulante
- **Recherche textuelle**: Recherche dans tous les champs

#### 4. Affichage des résultats
Liste interactive des logs avec :
- Badge coloré par type d'événement
- Horodatage
- Module et action
- Email utilisateur
- Badge de niveau de sécurité

#### 5. Actions disponibles
- **Exporter (CSV)**: Export des résultats filtrés
- **Analyser activité**: Analyse d'un utilisateur spécifique
- **Actualiser**: Rafraîchissement des données

## 📱 Frontend - Modal_Logs_Details.html

### Sections

#### 1. Bannière de statut
Affichage visuel du statut (Succès/Erreur/Avertissement) avec icône et couleur.

#### 2. Informations générales
- ID du log
- Type d'événement (badge coloré)
- Module
- Niveau de sécurité (badge coloré)
- Action effectuée

#### 3. Chronologie
- Date et heure précises (format long)
- Temps écoulé depuis l'événement

#### 4. Utilisateur concerné
- Email
- Rôle

#### 5. Entité concernée
- Type d'entité
- ID de l'entité (lien cliquable)

#### 6. Modifications apportées (Diff)
Affichage côte à côte :
- Anciennes valeurs (JSON formaté)
- Nouvelles valeurs (JSON formaté)

#### 7. Contexte technique
- Adresse IP
- Navigateur/User agent
- Statut

#### 8. Détails de l'erreur
Message d'erreur détaillé (si applicable).

#### 9. Actions disponibles
- **Exporter ce log**: Export CSV du log unique
- **Logs liés**: Recherche de logs similaires
- **Copier ID**: Copie l'ID dans le presse-papier
- **Fermer**: Ferme le modal

## 🚀 Installation et utilisation

### 1. Installation dans Google Apps Script

1. Ouvrez votre Google Sheet WARAP
2. Aller dans **Extensions** > **Apps Script**
3. Créez un nouveau fichier `WARAP_Logs_Manager.gs`
4. Copiez le contenu du fichier backend
5. Créez les fichiers HTML pour la sidebar et le modal
6. Sauvegardez le projet

### 2. Initialisation de la feuille

```javascript
// Exécuter cette fonction une fois pour créer la feuille
createLogsSheetIfNotExists();
```

### 3. Utilisation dans votre code

```javascript
// Dans n'importe quelle fonction de votre application
function updateClient(clientId, newData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Clients');

  // Récupérer les anciennes valeurs
  const oldData = getClientData(clientId);

  // Effectuer la mise à jour
  // ... votre code de mise à jour ...

  // Logger l'action
  logAction('Clients', 'Mise à jour client', {
    typeEvenement: 'Modification',
    entiteType: 'Client',
    entiteId: clientId,
    anciennesValeurs: oldData,
    nouvellesValeurs: newData,
    niveauSecurite: 'Privé'
  });
}
```

### 4. Affichage de la sidebar

```javascript
function showLogsSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar_Logs')
    .setTitle('Audit et Logs')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}
```

### 5. Ajout au menu

```javascript
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('WARAP')
    .addItem('📊 Audit et Logs', 'showLogsSidebar')
    .addToUi();
}
```

## 📈 Bonnes pratiques

### 1. Utilisation des niveaux de sécurité

- **Public**: Événements publics (connexion réussie, consultation)
- **Privé**: Modifications de données utilisateur
- **Confidentiel**: Opérations financières, données sensibles
- **Critique**: Erreurs système, tentatives d'accès non autorisé

### 2. Logging systématique

Loggez toutes les opérations importantes :
- ✅ Créations (Création)
- ✅ Modifications (Modification)
- ✅ Suppressions (Suppression)
- ✅ Connexions/Déconnexions (Connexion)
- ✅ Erreurs (Erreur)
- ✅ Alertes de sécurité (Alerte)

### 3. Conservation des données

- Archivez régulièrement les anciens logs
- Gardez les logs critiques indéfiniment
- Nettoyez les logs de consultation après 90 jours

### 4. Surveillance

Vérifiez quotidiennement :
- Les activités suspectes
- Les erreurs répétées
- Les connexions échouées

## 🔒 Sécurité

### Protection des données

- Les logs contiennent des données sensibles
- Limitez l'accès à la feuille Logs_WARAP
- Ne loggez jamais les mots de passe
- Anonymisez les données personnelles si nécessaire

### Audit trail

Les logs créent une piste d'audit complète :
- Qui a fait quoi
- Quand
- Sur quelle entité
- Avec quels résultats

## 🐛 Dépannage

### La feuille ne se crée pas

Vérifiez que vous avez les permissions nécessaires :
```javascript
// Test des permissions
function testPermissions() {
  try {
    createLogsSheetIfNotExists();
    Logger.log('OK - Feuille créée');
  } catch (e) {
    Logger.log('ERREUR: ' + e.toString());
  }
}
```

### Les logs ne s'enregistrent pas

Vérifiez :
1. Que la fonction `createLogsSheetIfNotExists()` a été exécutée
2. Que l'utilisateur a une session active
3. Les logs du script (Ctrl+Entrée dans l'éditeur)

### La sidebar ne s'affiche pas

Vérifiez :
1. Que le fichier HTML existe
2. Que la fonction `showLogsSidebar()` est appelée
3. Les erreurs dans la console JavaScript (F12)

## 📝 Licence

Ce module fait partie de la plateforme WARAP.

## 🤝 Contribution

Pour toute amélioration ou bug, veuillez contacter l'équipe de développement WARAP.

---

**Version**: 1.0.0
**Dernière mise à jour**: 2024
**Auteur**: Équipe WARAP
