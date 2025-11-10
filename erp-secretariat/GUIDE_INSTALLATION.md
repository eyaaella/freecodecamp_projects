# 📘 Guide d'Installation Détaillé - ERP Secrétariat

## 🎯 Objectif
Ce guide vous accompagne pas à pas pour installer et configurer votre ERP de secrétariat bureautique.

## ⏱️ Temps d'installation
Environ 15-20 minutes

## 📋 Prérequis

- Un compte Google (Gmail)
- Accès à Internet
- Navigateur web (Chrome, Firefox, Safari, Edge)

## 🚀 Installation Complète

### Méthode 1 : Installation Manuelle (Recommandée)

#### Étape 1 : Création du Google Sheet

1. Ouvrez votre navigateur
2. Allez sur [https://sheets.google.com](https://sheets.google.com)
3. Connectez-vous avec votre compte Google
4. Cliquez sur **+ Vierge** pour créer un nouveau classeur
5. En haut à gauche, cliquez sur "Feuille de calcul sans titre"
6. Renommez en **"ERP Secrétariat - [Nom de votre entreprise]"**

#### Étape 2 : Accéder à l'éditeur de scripts

1. Dans le menu, cliquez sur **Extensions**
2. Sélectionnez **Apps Script**
3. Un nouvel onglet s'ouvre avec l'éditeur Apps Script
4. Vous verrez un fichier `Code.gs` avec du code par défaut

#### Étape 3 : Importer les fichiers du projet

**Pour chaque fichier .gs dans le dossier erp-secretariat :**

**Fichier 1 : Code.gs**
1. Sélectionnez et supprimez tout le code par défaut dans `Code.gs`
2. Ouvrez le fichier `Code.gs` de votre téléchargement
3. Copiez tout le contenu (Ctrl+A puis Ctrl+C)
4. Collez dans l'éditeur Apps Script (Ctrl+V)

**Fichier 2 : Config.gs**
1. Dans l'éditeur, cliquez sur le **+** à côté de "Fichiers"
2. Cliquez sur **Script**
3. Nommez le fichier : `Config`
4. Ouvrez le fichier `Config.gs` de votre téléchargement
5. Copiez et collez le contenu

**Répétez pour les fichiers suivants :**
- `Clients` (pour Clients.gs)
- `Fournisseurs` (pour Fournisseurs.gs)
- `Courrier` (pour Courrier.gs)
- `Agenda` (pour Agenda.gs)
- `Facturation` (pour Facturation.gs)
- `Stock` (pour Stock.gs)
- `Personnel` (pour Personnel.gs)
- `Reporting` (pour Reporting.gs)

#### Étape 4 : Enregistrer le projet

1. Cliquez sur l'icône **💾 Enregistrer le projet**
2. Si demandé, nommez le projet : `ERP Secrétariat`
3. Attendez que la sauvegarde soit terminée

#### Étape 5 : Retour à Google Sheets

1. Fermez l'onglet Apps Script
2. Retournez à l'onglet Google Sheets
3. **Actualisez la page** (F5 ou Ctrl+R)
4. Attendez quelques secondes

#### Étape 6 : Premier lancement et autorisations

1. Vous devriez voir un nouveau menu **🏢 ERP Secrétariat** apparaître
2. Cliquez sur **🏢 ERP Secrétariat** > **📊 Initialisation** > **Créer toutes les feuilles**

**Autorisations nécessaires :**

3. Une fenêtre "Autorisation requise" apparaît
4. Cliquez sur **Continuer**
5. Sélectionnez votre compte Google
6. Vous verrez "Cette application n'est pas validée"
   - Cliquez sur **Paramètres avancés** (en petit en bas)
   - Cliquez sur **Accéder à ERP Secrétariat (non sécurisé)**
   - C'est normal car c'est votre propre script
7. Cliquez sur **Autoriser**

#### Étape 7 : Création des feuilles

1. Après autorisation, cliquez à nouveau sur **Créer toutes les feuilles**
2. Une boîte de dialogue de confirmation apparaît
3. Cliquez sur **OUI**
4. Patientez pendant la création (environ 10-15 secondes)
5. Un message "Succès" apparaît
6. Vous êtes redirigé vers le **Tableau de Bord**

#### Étape 8 : Configuration initiale

1. Allez sur l'onglet **Configuration**
2. Modifiez les informations dans la colonne B :

   **Informations entreprise :**
   - Ligne 4 : Nom de votre entreprise
   - Ligne 5 : Adresse complète
   - Ligne 6 : Téléphone (+237 XXX XXX XXX)
   - Ligne 7 : Email professionnel
   - Ligne 8 : NIF (Numéro d'Identification Fiscale)
   - Ligne 9 : RC (Registre de Commerce)

   **Paramètres fiscaux :**
   - Ligne 13 : Taux TVA (19.25 par défaut pour le Cameroun)

3. Les préfixes peuvent être personnalisés si besoin

### Méthode 2 : Installation avec CLASP (Pour utilisateurs avancés)

Si vous êtes développeur et que vous utilisez CLASP :

```bash
# Installer clasp
npm install -g @google/clasp

# Se connecter
clasp login

# Créer un nouveau projet
clasp create --type sheets --title "ERP Secrétariat"

# Copier le scriptId dans .clasp.json

# Pousser le code
clasp push
```

## ✅ Vérification de l'installation

Votre installation est réussie si :

- ✅ Le menu **🏢 ERP Secrétariat** est visible
- ✅ Vous avez 15 onglets dans votre classeur :
  - Accueil
  - 📊 Tableau de Bord
  - Configuration
  - Clients
  - Fournisseurs
  - Courrier Entrant
  - Courrier Sortant
  - Agenda
  - Tâches
  - Devis
  - Factures
  - Paiements
  - Stock
  - Mouvements Stock
  - Personnel
  - Présences

- ✅ Le tableau de bord affiche des statistiques (même à zéro)

## 🎓 Premiers pas après l'installation

### Test 1 : Ajouter un client
1. Menu > Clients & Fournisseurs > Ajouter un client
2. Remplir le formulaire
3. Cliquer sur Enregistrer
4. Vérifier que le client apparaît dans l'onglet "Clients"

### Test 2 : Créer une facture
1. Menu > Facturation > Créer une facture
2. Sélectionner le client créé
3. Saisir un montant HT
4. Vérifier que la TVA est calculée automatiquement
5. Cliquer sur Créer la facture
6. Vérifier dans l'onglet "Factures"

### Test 3 : Consulter le tableau de bord
1. Menu > Reporting > Tableau de bord
2. Vérifier que vos données apparaissent

## 🔧 Résolution des problèmes

### Le menu n'apparaît pas
- Actualisez la page (F5)
- Videz le cache du navigateur
- Vérifiez que les scripts sont bien enregistrés

### Erreur "Script non autorisé"
- Recommencez l'étape 6 des autorisations
- Assurez-vous d'autoriser toutes les permissions

### Les feuilles ne se créent pas
- Vérifiez que tous les fichiers .gs sont bien ajoutés
- Vérifiez qu'il n'y a pas d'erreur de syntaxe
- Ouvrez Extensions > Apps Script et vérifiez les erreurs

### Les formules ne fonctionnent pas
- Les formules sont en anglais dans Google Sheets
- Vérifiez la localisation de votre compte

## 📞 Support

Si vous rencontrez des difficultés :
1. Relisez attentivement ce guide
2. Vérifiez que toutes les étapes ont été suivies
3. Consultez le README.md pour plus de détails

## 🎉 Félicitations !

Votre ERP est maintenant opérationnel ! Vous pouvez commencer à l'utiliser pour gérer votre secrétariat bureautique.

## 📚 Prochaines étapes

1. Personnalisez la configuration
2. Ajoutez vos premiers clients
3. Enregistrez vos employés
4. Commencez à utiliser les fonctionnalités

---

**Bonne utilisation de votre ERP Secrétariat !** 🎊
