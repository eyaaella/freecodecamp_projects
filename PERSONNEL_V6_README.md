# 📚 MODULE GESTION DU PERSONNEL V6.0 ULTIMATE - WARAP ÉCOLE

## 🎯 Version 6.0.0 - Production Ready

### ✅ CORRECTIONS MAJEURES V6.0

#### 🔧 Problème résolu: Erreur #NAME? sur formules

**Cause**: Les formules Google Sheets utilisaient la syntaxe française (SIERREUR, NB.SI, SOMME, etc.) alors que le système nécessite la syntaxe anglaise.

**Solution**: Toutes les formules ont été converties en anglais:
- `SIERREUR` → `IFERROR`
- `NB.SI` → `COUNTIF`
- `NB.SI.ENS` → `COUNTIFS`
- `SOMME` → `SUM`
- `SOMME.SI` → `SUMIF`
- `MOYENNE.SI` → `AVERAGEIF`
- `CONCATENER` → `CONCATENATE`
- `TEXTE` → `TEXT`
- `MAINTENANT` → `NOW`
- `AUJOURDHUI` → `TODAY`
- `SI` → `IF`
- `ET` → `AND`

---

## 📦 STRUCTURE DU PROJET

Le module est divisé en **3 fichiers** pour une meilleure organisation:

### 📄 Partie 1: `PersonnelV6_Part1_Config_Principal.gs`
- Configuration globale (CONFIG_PERSONNEL_V6)
- Initialisation système
- Feuille Personnel principale
- Dashboard temps réel
- Formules automatiques
- Validations données
- Graphiques

### 📄 Partie 2: `PersonnelV6_Part2_Feuilles_Secondaires.gs`
- Feuille Affectations Cours
- Feuille Absences Personnel
- Feuille Évaluations Personnel
- Statistiques secondaires
- Mise en forme conditionnelle

### 📄 Partie 3: `PersonnelV6_Part3_Salaires_Analytics_PDF.gs`
- Feuille Salaires Personnel
- Feuille Analytics RH
- CRUD complet (Create, Read, Update, Delete)
- Génération badges
- Interfaces utilisateur
- Menu personnalisé

---

## 🚀 INSTALLATION

### Étape 1: Ouvrir Google Sheets

1. Accédez à votre fichier Google Sheets WARAP ÉCOLE
2. Ouvrez l'éditeur de scripts:
   - Menu **Extensions** → **Apps Script**

### Étape 2: Importer les fichiers

1. Supprimez le fichier `Code.gs` par défaut (si présent)

2. Créez 3 nouveaux fichiers scripts:

   **Fichier 1**: `PersonnelV6_Part1_Config_Principal.gs`
   - Cliquez sur **+** → **Script**
   - Nommez: `PersonnelV6_Part1_Config_Principal`
   - Copiez tout le contenu de `PersonnelV6_Part1_Config_Principal.gs`

   **Fichier 2**: `PersonnelV6_Part2_Feuilles_Secondaires.gs`
   - Cliquez sur **+** → **Script**
   - Nommez: `PersonnelV6_Part2_Feuilles_Secondaires`
   - Copiez tout le contenu de `PersonnelV6_Part2_Feuilles_Secondaires.gs`

   **Fichier 3**: `PersonnelV6_Part3_Salaires_Analytics_PDF.gs`
   - Cliquez sur **+** → **Script**
   - Nommez: `PersonnelV6_Part3_Salaires_Analytics_PDF`
   - Copiez tout le contenu de `PersonnelV6_Part3_Salaires_Analytics_PDF.gs`

3. Cliquez sur **Enregistrer** (💾)

### Étape 3: Initialiser le système

1. Retournez à votre feuille Google Sheets
2. Rafraîchissez la page (F5)
3. Un nouveau menu **👨‍🏫 PERSONNEL V6.0** apparaît
4. Cliquez sur **👨‍🏫 PERSONNEL V6.0** → **🚀 Initialiser Système**
5. Autorisez les permissions si demandé
6. Attendez le message de confirmation

---

## 📊 FEUILLES CRÉÉES

| Feuille | Icône | Description |
|---------|-------|-------------|
| **Personnel** | 👨‍🏫 | Base de données principale (60 colonnes) |
| **Dashboard Personnel** | 📊 | Tableau de bord temps réel avec KPIs |
| **Affectations Cours** | 📌 | Gestion emplois du temps enseignants |
| **Absences Personnel** | ❌ | Suivi absences et retards |
| **Évaluations Personnel** | ⭐ | Évaluations performance |
| **Salaires Personnel** | 💵 | Gestion fiches de paie |
| **Analytics RH** | 📈 | Analyses RH avancées |

---

## 🎯 FONCTIONNALITÉS PRINCIPALES

### ✅ Gestion Personnel

#### Ajouter un personnel
```javascript
ajouterPersonnelV6({
  nom: "Dupont",
  prenom: "Jean",
  sexe: "Masculin",
  date_naissance: "1985-05-15",
  email: "jean.dupont@warap.cm",
  telephone: "+237690123456",
  type_personnel: "👨‍🏫 Enseignant",
  fonction: "Professeur Mathématiques",
  matieres_enseignees: "Mathématiques",
  salaire_base: 250000,
  primes_mensuelles: 50000,
  ville: "Garoua",
  type_contrat: "📝 CDI"
});
```

#### Rechercher du personnel
```javascript
var resultats = rechercherPersonnelV6({
  nom: "Dupont",
  type_personnel: "👨‍🏫 Enseignant",
  statut_emploi: "✅ Actif"
});
```

#### Modifier un personnel
```javascript
modifierPersonnelV6("PER-ID-12345", {
  telephone: "+237690999888",
  salaire_base: 300000,
  statut_emploi: "🏖️ En Congé"
});
```

### 📌 Affectations Cours

```javascript
ajouterAffectationCours({
  id_personnel: "PER-ID-12345",
  nom_personnel: "Jean Dupont",
  matiere: "Mathématiques",
  classe: "Terminale C",
  niveau: "Terminale",
  heures_semaine: 8,
  type: "📚 Cours Principal"
});
```

### ❌ Enregistrer Absence

```javascript
enregistrerAbsence({
  id_personnel: "PER-ID-12345",
  nom_personnel: "Jean Dupont",
  date: "2025-01-20",
  type: "❌ Absence",
  duree: 1,
  motif: "Maladie",
  justifiee: "⏳ En Attente"
});
```

### ⭐ Enregistrer Évaluation

```javascript
enregistrerEvaluation({
  id_personnel: "PER-ID-12345",
  nom_personnel: "Jean Dupont",
  date_evaluation: "2025-01-15",
  periode: "Trimestre 1",
  note_competences: 18,
  note_eleves: 17,
  note_collegues: 19,
  note_ponctualite: 20,
  note_reglement: 18,
  points_forts: "Excellente pédagogie",
  axes_amelioration: "Gestion du temps",
  objectifs: "Améliorer ponctualité"
});
```

### 💵 Générer Fiche de Paie

```javascript
genererFichePaie({
  id_personnel: "PER-ID-12345",
  mois: "Janvier",
  annee: 2025,
  heures_sup: 50000,
  autres_retenues: 0,
  commentaire: "Paie janvier 2025"
});
```

---

## 📊 DASHBOARD - INDICATEURS TEMPS RÉEL

Le dashboard affiche automatiquement:

### 📈 KPIs Principaux
- 👥 **Total Personnel**
- ✅ **Personnel Actif**
- 👨‍🏫 **Enseignants**
- 💰 **Masse Salariale Totale**
- 📊 **Salaire Moyen**

### 📊 Répartitions
- Par type de personnel
- Par statut (Actif, Congé, etc.)
- Par ancienneté
- Par ville

### ⚠️ Alertes
- Contrats à renouveler (< 30 jours)
- Personnel avec absences > 5

### 📈 Graphiques
- Camembert répartition par type
- Barres masse salariale par type

---

## 🎨 MENU PERSONNALISÉ

Après initialisation, le menu **👨‍🏫 PERSONNEL V6.0** propose:

- 🚀 **Initialiser Système**: Créer toutes les feuilles
- ➕ **Ajouter Personnel**: Ajouter nouveau membre
- 🔍 **Rechercher**: Rechercher personnel
- 📊 **Voir Dashboard**: Accéder au dashboard
- 📌 **Gérer Affectations**: Gérer cours
- ❌ **Enregistrer Absence**: Enregistrer absence
- ⭐ **Nouvelle Évaluation**: Évaluer personnel
- 💵 **Générer Fiche Paie**: Générer paie
- 📈 **Statistiques RH**: Voir stats globales

---

## 💰 CALCULS SALAIRES

### Formules automatiques:

1. **Salaire Net** = Base + Primes + Indemnités - Charges
2. **Charges Sociales (CNPS)** = Salaire Base × 4,25%
3. **Taux de Charge** = Heures/Semaine ÷ 40

### Barème IRPP Cameroun (intégré):
- 0 - 2 000 000 XAF: 10%
- 2 000 001 - 3 000 000 XAF: 15%
- 3 000 001 - 5 000 000 XAF: 25%
- 5 000 001+ XAF: 35%

---

## 🔒 SÉCURITÉ & VALIDATION

### Validations automatiques:
- ✅ Email valide requis
- ✅ Listes déroulantes (Sexe, Type, Statut, etc.)
- ✅ Formats dates (dd/mm/yyyy)
- ✅ Formats montants XAF
- ✅ Notes évaluations (0-20)

### Traçabilité:
- 👤 Créé par / Date création
- ✏️ Modifié par / Date modification
- 🔐 Hash d'intégrité

---

## 📱 STATISTIQUES DISPONIBLES

Fonction `getPersonnelStatisticsV6()` retourne:

```javascript
{
  total: 150,
  actifs: 142,
  enseignants: 98,
  administration: 44,
  parType: { ... },
  parStatut: { ... },
  parSexe: { masculin: 85, feminin: 57 },
  masseSalariale: 45000000,
  moyenneSalaire: 316901,
  anciennete: { ... },
  evaluations: { moyenne: 78.5, total: 120 }
}
```

---

## 🎨 PERSONNALISATION

### Modifier établissement:

Dans `PersonnelV6_Part1_Config_Principal.gs`, ligne ~85:

```javascript
etablissement: {
  nom: 'VOTRE ÉCOLE',
  ville: 'Votre Ville',
  region: 'Votre Région',
  directeur: 'Nom Directeur'
}
```

### Ajouter types de personnel:

Dans `CONFIG_PERSONNEL_V6.dropdowns.typePersonnel`:

```javascript
typePersonnel: [
  '👨‍🏫 Enseignant',
  '👔 Directeur',
  // Ajoutez vos types ici
  '🎯 Votre Nouveau Type'
]
```

---

## 🐛 DÉPANNAGE

### Les formules affichent #NAME?
✅ **RÉSOLU** dans V6.0 - Formules converties en anglais

### Le menu ne s'affiche pas
1. Rafraîchissez la page (F5)
2. Vérifiez que les 3 fichiers sont bien importés
3. Vérifiez la fonction `onOpen()` dans Part 3

### Erreur d'autorisation
1. Menu **Extensions** → **Apps Script**
2. Cliquez sur ▶️ **Exécuter** sur `initPersonnelSystemV6`
3. Autorisez les permissions Google

### Dashboard vide
1. Ajoutez du personnel via `ajouterPersonnelV6()`
2. Les statistiques se calculent automatiquement

---

## 📞 SUPPORT

Pour toute question:
- 📧 Email: support@warap.cm
- 📚 Documentation: Voir commentaires dans le code
- 🐛 Issues: Contactez l'équipe WARAP

---

## 📝 CHANGELOG

### Version 6.0.0 (2025-01-23)
- ✅ **FIX MAJEUR**: Conversion formules françaises → anglaises
- ✅ Code divisé en 3 parties pour meilleure organisation
- ✅ Toutes les feuilles secondaires configurées
- ✅ Validations complètes
- ✅ Formules automatiques optimisées
- ✅ Dashboard avec graphiques
- ✅ CRUD complet
- ✅ Système de logs
- ✅ Menu personnalisé

---

## 📜 LICENCE

© 2025 WARAP École - Tous droits réservés

---

## 🎉 FÉLICITATIONS !

Votre système de gestion du personnel V6.0 ULTIMATE est prêt ! 🚀

**Prochaines étapes**:
1. ✅ Initialiser le système
2. ✅ Ajouter votre premier personnel
3. ✅ Explorer le dashboard
4. ✅ Tester les fonctionnalités

Bon courage ! 💪
