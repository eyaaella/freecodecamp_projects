# 🏛️ Architecture Technique - Système de Gestion Topographique

## 📐 Diagramme ER (Entity-Relationship)

Le système repose sur 17 entités principales interconnectées:

```
PROJET (1) ←→ (*) OUVRAGE (1) ←→ (*) TACHE (1) ←→ (*) RELEVE
                    ↓                    ↓                 ↓
                DOCUMENT            EQUIPE            EMPLOYE
                    ↓                    ↓
                CONTROLEUR           MATERIEL

PROJET ←→ BUDGET ←→ FACTURE

EMPLOYE ←→ POSTE
EMPLOYE ←→ EQUIPE
EMPLOYE ←→ UTILISATEUR ←→ NOTIFICATION
                       ↓
                JOURNAL_ACTIONS

TACHE ←→ PLANNING
```

## 🗂️ Structure des Modules

### Module CORE (Cœur du Système)

**Fichiers:**
- `Core.gs` - Menu principal, coordination, initialisation
- `Config.gs` - Configuration globale, constantes
- `Utils.gs` - Fonctions utilitaires réutilisables
- `AllModules.gs` - Création de toutes les feuilles
- `MainSidebar.html` - Interface sidebar principale

**Responsabilités:**
- Orchestration de tous les modules
- Menu principal unifié
- Gestion du cycle de vie de l'application
- Configuration centralisée
- Utilitaires transversaux

### Module PROJET

**Fichiers:**
- `ProjetModule.gs` - Backend projet (CRUD, formules, logique)
- `ProjetSidebar.html` - Interface sidebar projet
- `ProjetModal.html` - Interface modal CRUD projet

**Fonctionnalités:**
- Création/modification/suppression de projets
- Calcul automatique des budgets
- Suivi de l'avancement
- Statistiques et KPIs
- Graphiques dynamiques

**Formules Clés:**
```javascript
Budget Utilisé = SOMME.SI(Budget!B:B; ProjetID; Budget!C:C)
Budget Restant = Budget Total - Budget Utilisé
% Utilisation = Budget Utilisé / Budget Total
Nb Ouvrages = NB.SI(Ouvrage!B:B; ProjetID)
% Avancement = Nb Tâches Terminées / Nb Tâches Total
```

### Modules Additionnels (Pattern Identique)

Chaque module suit le même pattern:
- **ModuleModule.gs** - Backend avec `create[Module]Sheet()`
- **ModuleSidebar.html** - Interface de navigation et recherche
- **ModuleModal.html** - Interface CRUD complète

## 🔄 Flux de Données

### 1. Création d'un Projet

```
Utilisateur → ProjetModal → createProjet() → Feuille PROJET
                                 ↓
                          logAction() → Feuille JOURNAL
                                 ↓
                     sendNotification() → Feuille NOTIFICATION
```

### 2. Calcul Automatique des Indicateurs

```
Saisie TACHE → Formules OUVRAGE → Formules PROJET → Tableau de Bord
   ↓              (NB.SI)            (SOMME.SI)         (COUNTA)
Mise à jour    Mise à jour        Mise à jour      Mise à jour
automatique    automatique        automatique      automatique
```

### 3. Validation de Documents

```
Upload Document → DOCUMENT → CONTROLEUR → Validation
                      ↓           ↓            ↓
                  Statut    Décision      Notification
                  "Soumis"  Contrôle      Utilisateur
```

## 🎨 Architecture Frontend (HTML/CSS/JS)

### Design System

**Palette de Couleurs (Google-inspired):**
```css
PRIMARY: #1a73e8    /* Bleu Google */
SECONDARY: #34a853  /* Vert Google */
ACCENT: #fbbc04     /* Jaune Google */
DANGER: #ea4335     /* Rouge Google */
WARNING: #ff9800    /* Orange */
```

**Composants Réutilisables:**
- Headers avec dégradés
- Cards avec ombres portées
- Boutons avec animations hover
- Forms avec validation visuelle
- Stats grids responsive

### Structure HTML Type

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Design moderne GAFAM */
    body { font-family: 'Google Sans', 'Roboto'; }
    .card { border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .btn { transition: all 0.2s; }
    .btn:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="header"><!-- En-tête --></div>
  <div class="tabs"><!-- Navigation --></div>
  <div class="content"><!-- Contenu --></div>
  <script>
    // Communication avec Apps Script
    google.script.run
      .withSuccessHandler(callback)
      .serverFunction(params);
  </script>
</body>
</html>
```

## 🧮 Système de Formules Avancées

### Types de Formules

#### 1. Auto-Incrémentation
```javascript
=SI(LIGNE()=6;1;SI(A5="";"";A5+1))
```

#### 2. Calculs Conditionnels
```javascript
=SI(ET(COUNTA(H6:I6)=2);I6-H6;"")  // Durée
=SI(ET(COUNTA(C6:C6)>0;C6>0);D6/C6;"")  // Pourcentage
```

#### 3. Agrégations Inter-Feuilles
```javascript
=SOMME.SI(Budget!B:B;A6;Budget!C:C)  // Somme conditionnelle
=NB.SI.ENS(Tache!B:B;A6;Tache!H:H;"Terminée")  // Comptage multiple
```

#### 4. Formules de Lookup
```javascript
=SI(COUNTA(A6:A6)=0;"";NB.SI(Releve!C:C;A6))  // Nombre de relevés
```

### Importance des Points-Virgules

⚠️ **CRITIQUE** : Google Sheets en français utilise `;` comme séparateur
```javascript
// ✅ CORRECT (Français)
=SOMME.SI(A:A;"Valeur";B:B)

// ❌ INCORRECT (Anglais)
=SUMIF(A:A,"Value",B:B)
```

## 📊 Système de Graphiques

### Types de Graphiques Créés

1. **Camembert (Pie)** - Répartition par statut
2. **Colonnes (Column)** - Comparaisons budgets
3. **Barres (Bar)** - Avancement des projets
4. **Timeline** - Planification temporelle

### Code de Création

```javascript
const chart = sheet.newChart()
  .setChartType(Charts.ChartType.PIE)
  .addRange(sheet.getRange('E5:E1000'))
  .setPosition(2, 18, 0, 0)
  .setOption('title', '📊 Répartition des Projets')
  .setOption('pieHole', 0.4)  // Donut chart
  .setOption('colors', ['#34a853', '#fbbc04', '#ea4335'])
  .build();
sheet.insertChart(chart);
```

## 🔒 Sécurité et Permissions

### Niveaux d'Accès

1. **Administrateur** - Accès complet
2. **Chef de Projet** - Gestion projets/ouvrages
3. **Topographe** - Saisie relevés
4. **Chef d'Équipe** - Gestion équipe/tâches
5. **Opérateur** - Saisie de base
6. **Lecture Seule** - Consultation uniquement

### Protection des Données

```javascript
// Protection des formules
const protection = sheet.getRange('H6:J1000').protect();
protection.setDescription('Colonnes calculées automatiquement');
protection.setWarningOnly(true);

// Protection stricte
protection.setWarningOnly(false);
protection.removeEditors(protection.getEditors());
protection.addEditor('admin@example.com');
```

### Journal d'Audit

Toutes les actions sont tracées:
```javascript
function logAction(typeAction, description) {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.JOURNAL);
  sheet.appendRow([
    new Date(),
    Session.getActiveUser().getEmail(),
    typeAction,
    description
  ]);
}
```

## 🔔 Système de Notifications

### Déclencheurs

- Création de projet → Notification au chef de projet
- Tâche assignée → Notification à l'équipe
- Document validé → Notification au créateur
- Budget dépassé → Alerte administrateur

### Implémentation

```javascript
function sendNotification(utilisateurEmail, message) {
  // 1. Enregistrer dans la feuille
  const sheet = getOrCreateSheet(CONFIG.SHEETS.NOTIFICATION);
  sheet.appendRow([new Date(), utilisateurEmail, message, false]);

  // 2. Envoyer email
  if (CONFIG.NOTIFICATION.SEND_EMAIL) {
    MailApp.sendEmail({
      to: utilisateurEmail,
      subject: CONFIG.APP_NAME + ' - Notification',
      body: message
    });
  }
}
```

## 🎯 Performance et Optimisation

### Bonnes Pratiques

1. **Formules Optimisées**
   - Utiliser `SI()` pour éviter les calculs inutiles
   - Limiter les plages (A6:A1000 plutôt que A:A)

2. **Protection Sélective**
   - Protéger uniquement les colonnes calculées
   - Mode "avertissement" pour la flexibilité

3. **Chargement Paresseux**
   - Charger les données à la demande
   - Limiter les graphiques par feuille

4. **Cache Client**
   - Stocker les recherches fréquentes
   - Minimiser les appels serveur

### Limites Google Sheets

- **Lignes** : 10 000 000 cellules max
- **Colonnes** : 18 278 colonnes max
- **Formules** : Complexité raisonnable
- **Scripts** : 6 min d'exécution max

## 🔄 Cycle de Vie des Données

### Création

```
Modal Form → Validation JS → google.script.run → create[Entity]()
→ Append Row → Copie Formules → Log Action → Notification
```

### Lecture

```
Sidebar → Search → google.script.run → getAll[Entities]()
→ Filter → Format → Display Cards
```

### Mise à Jour

```
Edit Button → Load Data → Modal Form → update[Entity]()
→ Find Row → Update Cells → Log → Notify
```

### Suppression

```
Delete Button → Confirm → delete[Entity]()
→ Find Row → Delete Row → Log → Notify
```

## 📱 Responsive Design

### Mobile-First

Toutes les interfaces HTML sont optimisées pour:
- Écrans mobiles (320px+)
- Tablettes (768px+)
- Desktops (1024px+)

```css
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
}
```

## 🧪 Tests et Validation

### Tests Automatiques

```javascript
function testCreateProjet() {
  const testData = {
    nomProjet: 'Test Project',
    dateDebut: '2024-01-01',
    dateFin: '2024-12-31',
    budgetTotal: 1000000
  };

  const result = createProjet(testData);
  console.assert(result.success === true, 'Projet creation failed');
}
```

### Validation des Données

- Dates : début < fin
- Budgets : > 0
- Emails : format valide
- Coordonnées : format numérique

## 🚀 Évolutions Futures

### Roadmap

**Version 1.1**
- [ ] Import/Export CSV complet
- [ ] Génération PDF des rapports
- [ ] API REST pour intégrations

**Version 1.2**
- [ ] Tableau de bord temps réel
- [ ] Alertes automatiques avancées
- [ ] Mobile app companion

**Version 2.0**
- [ ] Machine Learning pour prévisions
- [ ] Intégration GPS en temps réel
- [ ] Cartographie interactive

## 📚 Références Techniques

### Google Apps Script
- [Documentation officielle](https://developers.google.com/apps-script)
- [Class Spreadsheet](https://developers.google.com/apps-script/reference/spreadsheet)
- [HTML Service](https://developers.google.com/apps-script/guides/html)

### Google Sheets
- [Fonctions Sheets](https://support.google.com/docs/table/25273)
- [Formules avancées](https://support.google.com/docs/answer/3093343)

## 🎓 Glossaire

- **CRUD** : Create, Read, Update, Delete
- **KPI** : Key Performance Indicator
- **GED** : Gestion Électronique de Documents
- **RTK** : Real-Time Kinematic (GPS haute précision)
- **FCFA** : Franc CFA (devise)

---

**Architecture Version**: 1.0.0
**Dernière mise à jour**: 2024
**Mainteneurs**: Équipe de Développement
