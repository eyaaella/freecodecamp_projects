# 🏢 ERP Secrétariat Bureautique - Cameroun

Système complet de gestion pour secrétariat bureautique développé avec Google Sheets et Apps Script.

## 📋 Description

Cet ERP (Enterprise Resource Planning) offre une solution complète et gratuite pour la gestion d'un secrétariat bureautique au Cameroun. Il gère l'ensemble des opérations quotidiennes de manière centralisée et efficace.

## ✨ Fonctionnalités

### 👥 Gestion des Clients et Fournisseurs
- Enregistrement et suivi des clients (particuliers, entreprises, administrations)
- Gestion des fournisseurs par catégorie
- Recherche et consultation rapide des contacts
- Historique complet des interactions

### 📨 Gestion du Courrier
- Registre du courrier entrant avec traçabilité
- Registre du courrier sortant
- Suivi du statut de traitement
- Archivage numérique

### 📅 Agenda et Tâches
- Planification des rendez-vous
- Gestion des réunions et visites
- Suivi des tâches avec priorités
- Alertes pour les rendez-vous du jour

### 💰 Facturation et Devis
- Création de devis professionnels
- Émission de factures avec TVA (19,25% Cameroun)
- Suivi des paiements (espèces, mobile money, chèque, virement)
- Tableau de bord financier
- Relance automatique des impayés

### 📦 Gestion des Stocks
- Inventaire des fournitures de bureau
- Suivi des mouvements (entrées/sorties)
- Alertes de stock minimum
- Historique des mouvements

### 👨‍💼 Gestion du Personnel
- Fiches employés complètes
- Enregistrement des présences
- Suivi des absences et congés
- Types de contrats (CDI, CDD, Stage, Freelance)

### 📊 Reporting et Statistiques
- Tableau de bord en temps réel
- Statistiques par module
- Rapports mensuels
- Indicateurs de performance (KPI)

## 🚀 Installation

### Étape 1 : Créer un nouveau Google Sheets

1. Connectez-vous à votre compte Google
2. Accédez à [Google Sheets](https://sheets.google.com)
3. Créez un nouveau classeur vierge
4. Nommez-le "ERP Secrétariat"

### Étape 2 : Ouvrir l'éditeur Apps Script

1. Dans Google Sheets, cliquez sur **Extensions** > **Apps Script**
2. Un nouvel onglet s'ouvrira avec l'éditeur Apps Script
3. Supprimez le code par défaut dans `Code.gs`

### Étape 3 : Ajouter les fichiers du projet

Pour chaque fichier `.gs` du dossier `erp-secretariat` :

1. Dans l'éditeur Apps Script, cliquez sur le **+** à côté de "Fichiers"
2. Sélectionnez "Script"
3. Nommez le fichier (sans l'extension .gs) :
   - `Code` pour Code.gs
   - `Config` pour Config.gs
   - `Clients` pour Clients.gs
   - etc.
4. Copiez le contenu du fichier correspondant
5. Collez-le dans l'éditeur

**Liste des fichiers à ajouter :**
- Code.gs
- Config.gs
- Clients.gs
- Fournisseurs.gs
- Courrier.gs
- Agenda.gs
- Facturation.gs
- Stock.gs
- Personnel.gs
- Reporting.gs

### Étape 4 : Enregistrer et autoriser

1. Cliquez sur l'icône **💾 Enregistrer**
2. Nommez votre projet "ERP Secrétariat"
3. Fermez l'éditeur Apps Script
4. Actualisez la page Google Sheets
5. Un nouveau menu **🏢 ERP Secrétariat** apparaîtra dans la barre de menu

### Étape 5 : Initialiser l'ERP

1. Cliquez sur **🏢 ERP Secrétariat** > **📊 Initialisation** > **Créer toutes les feuilles**
2. Lors de la première exécution, Google demandera des autorisations :
   - Cliquez sur **Continuer**
   - Sélectionnez votre compte Google
   - Cliquez sur **Paramètres avancés**
   - Cliquez sur **Accéder à [nom du projet] (non sécurisé)**
   - Cliquez sur **Autoriser**
3. L'ERP créera automatiquement toutes les feuilles nécessaires

### Étape 6 : Configuration

1. Allez sur la feuille **Configuration**
2. Modifiez les informations de votre entreprise :
   - Nom
   - Adresse
   - Téléphone
   - Email
   - NIF (Numéro d'Identification Fiscale)
   - RC (Registre de Commerce)
3. Les autres paramètres peuvent être personnalisés si nécessaire

## 📖 Guide d'utilisation

### Démarrage rapide

1. **Consulter le tableau de bord** : Menu > Reporting > Tableau de bord
2. **Ajouter un client** : Menu > Clients & Fournisseurs > Ajouter un client
3. **Enregistrer du courrier** : Menu > Courrier > Enregistrer courrier entrant/sortant
4. **Créer une facture** : Menu > Facturation > Créer une facture

### Modules principaux

#### 👥 Clients et Fournisseurs

**Ajouter un client :**
1. Menu > Clients & Fournisseurs > Ajouter un client
2. Remplir le formulaire
3. Le système génère automatiquement un numéro client (CLT001, CLT002, etc.)

**Rechercher un contact :**
1. Menu > Clients & Fournisseurs > Rechercher contact
2. Saisir le nom, numéro ou téléphone
3. Consulter les résultats

#### 📨 Courrier

**Enregistrer un courrier entrant :**
1. Menu > Courrier > Enregistrer courrier entrant
2. Saisir les informations (expéditeur, objet, type)
3. Un numéro d'enregistrement est généré automatiquement

**Consulter le registre :**
- Menu > Courrier > Consulter registre

#### 📅 Agenda et Tâches

**Ajouter un rendez-vous :**
1. Menu > Agenda & Tâches > Ajouter un rendez-vous
2. Définir la date, l'heure et le contact
3. Choisir le statut (Planifié, Confirmé, etc.)

**Voir l'agenda du jour :**
- Menu > Agenda & Tâches > Voir agenda du jour

#### 💰 Facturation

**Créer un devis :**
1. Menu > Facturation > Créer un devis
2. Sélectionner le client
3. Saisir le montant HT (la TVA est calculée automatiquement)
4. Le système génère le numéro de devis

**Créer une facture :**
1. Menu > Facturation > Créer une facture
2. Suivre les mêmes étapes que pour un devis
3. Définir la date d'échéance

**Enregistrer un paiement :**
1. Menu > Facturation > Enregistrer un paiement
2. Saisir le numéro de facture
3. Indiquer le montant et le mode de paiement
4. Le statut de la facture est mis à jour automatiquement

#### 📦 Stock

**Ajouter un article :**
1. Menu > Stock & Fournitures > Ajouter un article
2. Définir le code article et la désignation
3. Fixer le stock minimum pour les alertes

**Mouvement de stock :**
1. Menu > Stock & Fournitures > Mouvement de stock
2. Choisir l'article
3. Indiquer le type (Entrée, Sortie, Ajustement)
4. Le stock est mis à jour automatiquement

#### 👨‍💼 Personnel

**Ajouter un employé :**
1. Menu > Personnel > Ajouter un employé
2. Remplir les informations
3. Un numéro d'employé est généré

**Enregistrer une présence :**
1. Menu > Personnel > Enregistrer présence
2. Sélectionner l'employé et la date
3. Indiquer le statut (Présent, Absent, Retard, etc.)

#### 📊 Reporting

**Consulter le tableau de bord :**
- Menu > Reporting > Tableau de bord
- Toutes les statistiques sont mises à jour en temps réel

**Générer un rapport mensuel :**
- Menu > Reporting > Rapport mensuel

## 🎨 Personnalisation

### Modifier les couleurs
Éditez le fichier `Config.gs` et modifiez l'objet `CONFIG.colors`

### Ajouter des catégories
Modifiez les validations de données dans les fonctions `create...Sheet()` de chaque module

### Personnaliser les préfixes
Modifiez `CONFIG.prefixes` dans `Config.gs`

## 🔧 Maintenance

### Sauvegarde
- Google Sheets sauvegarde automatiquement
- Pour une sauvegarde manuelle : Fichier > Télécharger > Microsoft Excel (.xlsx)

### Réinitialisation
- Menu > Initialisation > Réinitialiser l'ERP
- ⚠️ **ATTENTION** : Cette action supprime toutes les données !

## 📱 Accès mobile

L'ERP fonctionne parfaitement sur mobile via l'application Google Sheets :
1. Installez l'application Google Sheets sur votre smartphone
2. Ouvrez le fichier "ERP Secrétariat"
3. Toutes les fonctionnalités sont accessibles

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez que tous les fichiers .gs ont été correctement ajoutés
2. Assurez-vous d'avoir autorisé les scripts
3. Consultez la feuille Configuration pour les paramètres

## 📄 Licence

Ce projet est libre d'utilisation pour tout secrétariat bureautique.

## 🌍 Spécificités Cameroun

- TVA à 19,25% (paramétrable)
- Devise : FCFA
- Modes de paiement adaptés (Mobile Money, etc.)
- Numérotation compatible avec les normes locales

## 🔄 Mises à jour

Pour mettre à jour l'ERP :
1. Ouvrez Extensions > Apps Script
2. Remplacez le code des fichiers modifiés
3. Enregistrez et actualisez Google Sheets

---

**Développé pour les secrétariats bureautiques du Cameroun** 🇨🇲

**Version 1.0 - 2025**
