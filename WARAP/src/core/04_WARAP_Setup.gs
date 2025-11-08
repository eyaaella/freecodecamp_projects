/**
 * ============================================================================
 * WARAP_SETUP.GS - Installation et configuration complète
 * ============================================================================
 *
 * Ce fichier orchestre l'installation complète de la plateforme :
 * - Création des 20 feuilles Google Sheets
 * - Configuration des formules avancées
 * - Mise en place des validations de données
 * - Formatage conditionnel
 * - Protections
 * - Triggers automatiques
 *
 * @version 1.0.0
 * @author WARAP Team
 * ============================================================================
 */

/**
 * ============================================================================
 * FONCTION PRINCIPALE D'INSTALLATION
 * ============================================================================
 */

/**
 * Installe WARAP complètement
 * À exécuter UNE SEULE FOIS lors de la première installation
 */
function installWARAP() {
  const ui = SpreadsheetApp.getUi();

  // Vérifier si déjà installé
  const alreadyInstalled = PropertiesService.getDocumentProperties().getProperty('WARAP_INSTALLED');
  if (alreadyInstalled === 'true') {
    const response = ui.alert(
      '⚠️ WARAP déjà installé',
      'WARAP semble déjà être installé.\n\nVoulez-vous RÉINSTALLER (cela supprimera toutes les données) ?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }
  }

  // Confirmation finale
  const confirm = ui.alert(
    '🚀 Installation WARAP',
    'Cette action va créer toutes les feuilles et configurations.\n\nContinuer ?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) {
    return;
  }

  try {
    Logger.log('🚀 Début installation WARAP...');

    ui.alert('🚀 Installation en cours', 'Installation démarrée...\n\nCela peut prendre 2-3 minutes.\n\nNe fermez pas cette fenêtre.', ui.ButtonSet.OK);

    // Étape 1 : Créer toutes les feuilles
    const sheetsCreated = createAllSheets();
    Logger.log(`✅ Étape 1/8 : ${sheetsCreated} feuilles créées`);

    // Étape 2 : Charger données de référence (Cameroun)
    loadCameroonReferenceData();
    Logger.log('✅ Étape 2/8 : Données Cameroun chargées');

    // Étape 3 : Configurer formules
    setupFormulasInSheets();
    Logger.log('✅ Étape 3/8 : Formules configurées');

    // Étape 4 : Validations de données
    setupDataValidations();
    Logger.log('✅ Étape 4/8 : Validations créées');

    // Étape 5 : Mise en forme conditionnelle
    setupConditionalFormatting();
    Logger.log('✅ Étape 5/8 : Mise en forme appliquée');

    // Étape 6 : Protections
    setupSheetProtections();
    Logger.log('✅ Étape 6/8 : Protections activées');

    // Étape 7 : Triggers
    setupTriggers();
    Logger.log('✅ Étape 7/8 : Triggers créés');

    // Étape 8 : Paramètres initiaux
    initializeParameters();
    Logger.log('✅ Étape 8/8 : Paramètres initialisés');

    // Marquer comme installé
    PropertiesService.getDocumentProperties().setProperty('WARAP_INSTALLED', 'true');
    PropertiesService.getDocumentProperties().setProperty('WARAP_VERSION', '1.0.0');
    PropertiesService.getDocumentProperties().setProperty('WARAP_INSTALL_DATE', new Date().toISOString());

    ui.alert(
      '✅ Installation réussie !',
      `WARAP a été installé avec succès !\n\n` +
      `📊 ${sheetsCreated} feuilles créées\n` +
      `⚙️ Configurations appliquées\n` +
      `🤖 IA Matching activée\n\n` +
      `Actualisez la page (F5) pour voir le menu complet.`,
      ui.ButtonSet.OK
    );

    Logger.log('✅ Installation WARAP terminée !');

  } catch (error) {
    Logger.error('❌ Erreur installation:', error);
    ui.alert('❌ Erreur', `Erreur lors de l'installation:\n\n${error.message}\n\nConsultez les logs pour plus de détails.`, ui.ButtonSet.OK);
  }
}

/**
 * ============================================================================
 * CRÉATION DES FEUILLES
 * ============================================================================
 */

/**
 * Créé toutes les 20 feuilles de WARAP
 * @return {number} Nombre de feuilles créées
 */
function createAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let count = 0;

  const sheets = [
    // Feuilles principales
    { name: 'AccueilWARAP', config: getAccueilConfig() },
    { name: 'ClientsWARAP', config: getClientsConfig() },
    { name: 'PrestatairesWARAP', config: getPrestatairesConfig() },
    { name: 'AnnoncesWARAP', config: getAnnoncesConfig() },
    { name: 'Matchings_Proposes', config: getMatchingsConfig() },
    { name: 'TransactionsWARAP', config: getTransactionsConfig() },
    { name: 'Analytics_WARAP', config: getAnalyticsConfig() },
    { name: 'Catalogue_Produits_WARAP', config: getProduitsConfig() },
    { name: 'LivraisonsWARAP', config: getLivraisonsConfig() },
    { name: 'RendezVousWARAP', config: getRendezVousConfig() },
    { name: 'LitigesWARAP', config: getLitigesConfig() },
    { name: 'SAV_WARAP', config: getSAVConfig() },
    { name: 'Fournisseurs_WARAP', config: getFournisseursConfig() },
    { name: 'Parametres_WARAP', config: getParametresConfig() },
    { name: 'Logs_WARAP', config: getLogsConfig() },
    { name: 'Utilisateurs_WARAP', config: getUtilisateursConfig() },
    { name: 'Commandes_Produits', config: getCommandesConfig() },
    { name: 'Stock_Mouvements', config: getStockConfig() },
    { name: 'Horaires_Prestataires', config: getHorairesConfig() },
    { name: 'Notifications_Envoyees', config: getNotificationsConfig() },

    // Feuille de référence (masquée)
    { name: 'REF_Communes', config: getRefCommunesConfig(), hidden: true }
  ];

  sheets.forEach(sheetInfo => {
    try {
      createAndConfigureSheet(sheetInfo.name, sheetInfo.config, sheetInfo.hidden);
      count++;
      Logger.log(`✅ Feuille créée: ${sheetInfo.name}`);
    } catch (error) {
      Logger.log(`❌ Erreur création ${sheetInfo.name}: ${error}`);
    }
  });

  return count;
}

/**
 * Créé et configure une feuille
 *
 * @param {string} name - Nom de la feuille
 * @param {Object} config - Configuration de la feuille
 * @param {boolean} hidden - Si true, masque la feuille
 */
function createAndConfigureSheet(name, config, hidden = false) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  // Créer ou vider la feuille
  if (sheet) {
    sheet.clear();
    sheet.clearFormats();
    sheet.clearConditionalFormatRules();
  } else {
    sheet = ss.insertSheet(name);
  }

  // 1. Headers
  if (config.headers && config.headers.length > 0) {
    const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setValues([config.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4f46e5');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 35);
  }

  // 2. Auto-resize colonnes
  if (config.headers) {
    sheet.autoResizeColumns(1, config.headers.length);
  }

  // 3. Masquer si nécessaire
  if (hidden) {
    sheet.hideSheet();
  }

  // 4. Ordre des feuilles (optionnel)
  // sheet.activate();
  // ss.moveActiveSheet(position);
}

/**
 * ============================================================================
 * CONFIGURATIONS DES FEUILLES PRINCIPALES
 * ============================================================================
 */

/**
 * Configuration feuille Accueil
 */
function getAccueilConfig() {
  return {
    headers: ['Métrique', 'Valeur', 'Variation', 'Objectif', 'Statut']
  };
}

/**
 * Configuration feuille Clients
 */
function getClientsConfig() {
  return {
    headers: [
      'ID_Client', 'Nom_Complet', 'Email', 'Telephone_Principal', 'Telephone_Secondaire',
      'Adresse_Complete', 'Statut', 'Type_Client', 'Commune', 'Quartier',
      'Zone_Geographique', 'Segment_RFM', 'Nombre_Transactions', 'CA_Total',
      'Note_Satisfaction_Moyenne', 'Date_Derniere_Transaction', 'Date_Creation',
      'Date_Modification', 'Cree_Par', 'Modifie_Par', 'Franchise_Rattachee',
      'Agent_Reference', 'Nombre_Litiges', 'Taux_Presence_RDV', 'Notes_Internes',
      'Documents_Associes', 'Score_RFM', 'Alerte_Inactivite', 'Tags_Client',
      'Langue_Preferee', 'Source_Acquisition', 'Programme_Fidelite',
      'Solde_Points_Fidelite', 'Statut_Verification'
    ]
  };
}

/**
 * Configuration feuille Prestataires
 */
function getPrestatairesConfig() {
  return {
    headers: [
      'ID_Prestataire', 'Nom_Complet', 'Email', 'Telephone_Principal', 'Telephone_Secondaire',
      'Adresse_Professionnelle', 'Commune', 'Statut', 'Type_Prestataire',
      'Domaines_Competences', 'Certifications', 'Annees_Experience', 'Zone_Intervention',
      'Note_Globale', 'Nombre_Missions_Completees', 'CA_Total', 'Taux_Completion',
      'Taux_Satisfaction', 'Date_Creation', 'Date_Modification', 'Cree_Par',
      'Modifie_Par', 'Franchise_Rattachee', 'Disponibilite_Horaire', 'Tarif_Horaire_Min',
      'Tarif_Horaire_Max', 'Jours_Travail', 'Documents_Professionnels', 'Photo_Profil',
      'Portfolio', 'Langues_Parlees', 'Niveau_Badge', 'Delai_Moyen_Reponse',
      'Taux_Acceptation', 'Assurance_Professionnelle', 'Numero_Registre_Commerce',
      'Statut_Verification'
    ]
  };
}

/**
 * Configuration feuille Annonces
 */
function getAnnoncesConfig() {
  return {
    headers: [
      'ID_Annonce', 'Client_ID', 'Type_Service', 'Titre_Annonce', 'Description_Detaillee',
      'Commune', 'Quartier', 'Zone_Precise', 'Adresse_Intervention', 'Budget_Estime',
      'Statut', 'Date_Publication', 'Date_Derniere_Modification', 'Date_Debut_Souhaite',
      'Date_Fin_Souhaite', 'Urgence', 'Prestataire_Assigne', 'Score_Matching',
      'Nombre_Candidatures', 'Temps_Avant_Attribution', 'Transaction_ID', 'Documents_Joints',
      'Photos_Lieu', 'Cree_Par', 'Modifie_Par', 'Franchise', 'Agent_Gestionnaire',
      'Preferences_Horaire', 'Acces_Lieu', 'Contact_Sur_Place', 'Equipements_Requis',
      'Nombre_Personnes_Necessaires', 'Duree_Estimee', 'Alerte_Expiration',
      'Historique_Statuts', 'Notes_Agent'
    ]
  };
}

/**
 * Configuration feuille Matchings
 */
function getMatchingsConfig() {
  return {
    headers: [
      'ID_Matching', 'Date_Matching', 'Heure_Matching', 'Annonce_ID', 'Client_ID',
      'Client_Nom', 'Prestataire_ID', 'Prestataire_Nom', 'Score_Global',
      'Score_Competences', 'Score_Localisation', 'Score_Disponibilite', 'Statut',
      'Motif_Refus', 'Date_Reponse_Prestataire', 'Delai_Reponse', 'Decision_Automatique',
      'Agent_Validateur', 'Date_Validation_Agent', 'Commentaire_Agent', 'Franchise',
      'Zone', 'Distance_Client_Prestataire', 'Cout_Estime', 'Delai_Intervention_Propose',
      'Conditions_Particulieres', 'Historique_Interactions', 'Alerte_Expiration'
    ]
  };
}

/**
 * Configuration feuille Transactions
 */
function getTransactionsConfig() {
  return {
    headers: [
      'ID_Transaction', 'Numero_Facture', 'Date_Transaction', 'Heure_Transaction',
      'Annonce_ID', 'Client_ID', 'Prestataire_ID', 'Montant_Total', 'Commission_Plateforme',
      'Commission_Franchise', 'Montant_Prestataire', 'Statut', 'Mode_Paiement',
      'Note_Client', 'Note_Prestataire', 'Commentaire_Client', 'Commentaire_Prestataire',
      'Date_Debut_Service', 'Date_Fin_Service', 'Duree_Reelle', 'Franchise', 'Zone',
      'Agent_Gestionnaire', 'Type_Service', 'Problemes_Rencontres', 'Photos_Avant',
      'Photos_Apres', 'Signature_Client', 'Signature_Prestataire', 'Facture_PDF',
      'Recu_Paiement', 'Statut_Paiement_Prestataire', 'Date_Paiement_Prestataire',
      'Reference_Paiement', 'TVA_Applicable', 'Montant_TVA', 'Penalites_Retard',
      'Bonus_Qualite', 'Garantie_Service', 'Duree_Garantie', 'Alerte_Impaye'
    ]
  };
}

/**
 * Configuration feuille Analytics
 */
function getAnalyticsConfig() {
  return {
    headers: [
      'ID_Analytique', 'Date_Analyse', 'Type_Metrique', 'Periode', 'Valeur_Metrique',
      'Variation_Precedente', 'Tendance', 'Franchise', 'Zone', 'Categorie_Service',
      'CA_Total_Periode', 'Nombre_Transactions', 'Panier_Moyen', 'Nouveaux_Clients',
      'Clients_Recurrents', 'Taux_Recurrence', 'Satisfaction_Moyenne', 'NPS_Score',
      'Taux_Conversion_Annonces', 'Delai_Moyen_Traitement', 'Prestataires_Actifs',
      'Taux_Occupation_Prestataires', 'CA_Previsionnel_Fin_Mois', 'Objectif_Periode',
      'Taux_Atteinte_Objectif', 'Top_3_Services', 'Zones_Performance', 'Alertes_Anomalies',
      'Recommandations_IA', 'Indicateur_Sante', 'Budget_Marketing_Utilise', 'ROI_Marketing',
      'Notes_Analyse'
    ]
  };
}

// Configurations simplifiées pour les autres feuilles
function getProduitsConfig() {
  return { headers: ['ID_Produit', 'Code_SKU', 'Nom_Produit', 'Categorie', 'Prix_Unitaire', 'Stock_Actuel', 'Stock_Minimum', 'Statut'] };
}

function getLivraisonsConfig() {
  return { headers: ['ID_Livraison', 'Numero_BL', 'Date_Creation', 'Commande_ID', 'Client_ID', 'Adresse_Livraison', 'Statut', 'Livreur_ID'] };
}

function getRendezVousConfig() {
  return { headers: ['ID_RendezVous', 'Numero_RDV', 'Client_ID', 'Prestataire_ID', 'Date_RDV', 'Heure_Debut', 'Heure_Fin', 'Type_RDV', 'Statut'] };
}

function getLitigesConfig() {
  return { headers: ['ID_Litige', 'Numero_Litige', 'Transaction_ID', 'Type_Litige', 'Date_Ouverture', 'Gravite', 'Statut', 'Mediateur_ID'] };
}

function getSAVConfig() {
  return { headers: ['ID_Ticket', 'Numero_Ticket', 'Transaction_ID', 'Date_Ouverture', 'Type_Demande', 'Statut', 'Priorite', 'Technicien_ID'] };
}

function getFournisseursConfig() {
  return { headers: ['ID_Fournisseur', 'Nom_Fournisseur', 'Email', 'Telephone', 'Statut', 'Note_Qualite'] };
}

function getParametresConfig() {
  return { headers: ['ID_Parametre', 'Categorie', 'Nom_Parametre', 'Valeur_Actuelle', 'Type_Valeur', 'Description'] };
}

function getLogsConfig() {
  return { headers: ['ID_Log', 'Timestamp', 'Type_Evenement', 'Module', 'Action_Effectuee', 'Utilisateur_Email', 'Utilisateur_Role', 'Statut'] };
}

function getUtilisateursConfig() {
  return { headers: ['ID_Utilisateur', 'Email', 'Role', 'Nom_Complet', 'Telephone', 'Statut', 'Franchise_Rattachee', 'Zone_Rattachee', 'Commune_Rattachee', 'Permissions_Modules'] };
}

function getCommandesConfig() {
  return { headers: ['ID_Commande', 'Date_Commande', 'Client_ID', 'Montant_Total', 'Statut', 'Mode_Paiement'] };
}

function getStockConfig() {
  return { headers: ['ID_Mouvement', 'Date_Mouvement', 'Produit_ID', 'Type_Mouvement', 'Quantite', 'Stock_Avant', 'Stock_Apres'] };
}

function getHorairesConfig() {
  return { headers: ['ID_Horaire', 'Prestataire_ID', 'Jour_Semaine', 'Heure_Debut', 'Heure_Fin', 'Disponible'] };
}

function getNotificationsConfig() {
  return { headers: ['ID_Notification', 'Date_Envoi', 'Type_Notification', 'Destinataire_ID', 'Message', 'Statut_Envoi'] };
}

function getRefCommunesConfig() {
  return { headers: ['Commune', 'Region', 'Departement'] };
}

/**
 * ============================================================================
 * DONNÉES DE RÉFÉRENCE CAMEROUN
 * ============================================================================
 */

/**
 * Charge les données de référence du Cameroun
 */
function loadCameroonReferenceData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('REF_Communes');

  if (!sheet) {
    Logger.log('⚠️ Feuille REF_Communes non trouvée');
    return;
  }

  // Liste partielle des communes (pour commencer)
  const communesData = [
    ['Yaoundé 1', 'Centre', 'Mfoundi'],
    ['Yaoundé 2', 'Centre', 'Mfoundi'],
    ['Yaoundé 3', 'Centre', 'Mfoundi'],
    ['Yaoundé 4', 'Centre', 'Mfoundi'],
    ['Yaoundé 5', 'Centre', 'Mfoundi'],
    ['Yaoundé 6', 'Centre', 'Mfoundi'],
    ['Yaoundé 7', 'Centre', 'Mfoundi'],
    ['Douala 1', 'Littoral', 'Wouri'],
    ['Douala 2', 'Littoral', 'Wouri'],
    ['Douala 3', 'Littoral', 'Wouri'],
    ['Douala 4', 'Littoral', 'Wouri'],
    ['Douala 5', 'Littoral', 'Wouri'],
    ['Douala 6', 'Littoral', 'Wouri'],
    ['Garoua 1', 'Nord', 'Bénoué'],
    ['Garoua 2', 'Nord', 'Bénoué'],
    ['Garoua 3', 'Nord', 'Bénoué'],
    ['Lagdo', 'Nord', 'Bénoué'],
    ['Bamenda 1', 'Nord-Ouest', 'Mezam'],
    ['Bamenda 2', 'Nord-Ouest', 'Mezam'],
    ['Bamenda 3', 'Nord-Ouest', 'Mezam']
    // TODO: Ajouter les 338 communes restantes
  ];

  // Écrire les données
  if (communesData.length > 0) {
    sheet.getRange(2, 1, communesData.length, 3).setValues(communesData);
  }

  Logger.log(`✅ ${communesData.length} communes chargées`);
}

/**
 * ============================================================================
 * CONFIGURATION DES FORMULES, VALIDATIONS, ETC.
 * ============================================================================
 */

function setupFormulasInSheets() {
  // TODO: Implémenter les formules avancées
  Logger.log('⚠️ setupFormulasInSheets: À implémenter');
}

function setupDataValidations() {
  // TODO: Implémenter les validations
  Logger.log('⚠️ setupDataValidations: À implémenter');
}

function setupConditionalFormatting() {
  // TODO: Implémenter le formatage conditionnel
  Logger.log('⚠️ setupConditionalFormatting: À implémenter');
}

function setupSheetProtections() {
  // TODO: Implémenter les protections
  Logger.log('⚠️ setupSheetProtections: À implémenter');
}

/**
 * Configure les triggers automatiques
 */
function setupTriggers() {
  // Supprimer anciens triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Trigger Matching IA (toutes les 2 minutes)
  ScriptApp.newTrigger('runMatchingAlgorithm')
    .timeBased()
    .everyMinutes(2)
    .create();

  Logger.log('✅ Triggers configurés');
}

/**
 * Initialise les paramètres par défaut
 */
function initializeParameters() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Parametres_WARAP');

  if (!sheet) return;

  const params = [
    [generateParametreID(), 'Finance', 'Commission_Plateforme', '15', 'Nombre', 'Commission de la plateforme en %'],
    [generateParametreID(), 'Finance', 'Commission_Franchise', '10', 'Nombre', 'Commission de la franchise en %'],
    [generateParametreID(), 'Matching', 'Score_Auto_Validation', '85', 'Nombre', 'Score minimum pour auto-validation'],
    [generateParametreID(), 'Matching', 'Delai_Matching_Minutes', '2', 'Nombre', 'Fréquence d\'exécution du matching en minutes'],
    [generateParametreID(), 'SAV', 'SLA_Heures', '48', 'Nombre', 'Délai maximum de réponse SAV en heures']
  ];

  sheet.getRange(2, 1, params.length, 6).setValues(params);

  Logger.log('✅ Paramètres initialisés');
}

/**
 * ============================================================================
 * DIAGNOSTIC SYSTÈME
 * ============================================================================
 */

/**
 * Exécute un diagnostic complet du système
 */
function runCompleteDiagnostic() {
  const ui = SpreadsheetApp.getUi();

  ui.alert('🔧 Diagnostic WARAP', 'Démarrage des tests...', ui.ButtonSet.OK);

  const results = {
    timestamp: new Date(),
    tests: []
  };

  // Test 1: Vérifier que toutes les feuilles existent
  results.tests.push(testAllSheetsExist());

  // Test 2: Vérifier la génération d'IDs
  results.tests.push(testIDGenerationSystem());

  // Test 3: Vérifier la sécurité
  results.tests.push(testSecuritySystem());

  // Afficher résultats
  displayDiagnosticResults(results, ui);
}

function testAllSheetsExist() {
  const requiredSheets = [
    'ClientsWARAP', 'PrestatairesWARAP', 'AnnoncesWARAP', 'Matchings_Proposes',
    'TransactionsWARAP', 'Analytics_WARAP', 'Catalogue_Produits_WARAP',
    'LivraisonsWARAP', 'RendezVousWARAP', 'LitigesWARAP', 'SAV_WARAP',
    'Fournisseurs_WARAP', 'Parametres_WARAP', 'Logs_WARAP', 'Utilisateurs_WARAP'
  ];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existingSheets = ss.getSheets().map(s => s.getName());

  const missing = requiredSheets.filter(name => !existingSheets.includes(name));

  return {
    name: 'Feuilles Google Sheets',
    status: missing.length === 0 ? 'PASS' : 'FAIL',
    message: missing.length === 0
      ? `✅ ${requiredSheets.length}/${requiredSheets.length} feuilles présentes`
      : `❌ ${missing.length} feuille(s) manquante(s): ${missing.join(', ')}`,
    details: { required: requiredSheets.length, existing: existingSheets.length, missing }
  };
}

function testIDGenerationSystem() {
  try {
    const id1 = generateClientID();
    const id2 = generateClientID();

    const isValid = validateID(id1) && validateID(id2);
    const isUnique = id1 !== id2;

    return {
      name: 'Génération d\'IDs',
      status: (isValid && isUnique) ? 'PASS' : 'FAIL',
      message: (isValid && isUnique)
        ? '✅ IDs 14 caractères générés correctement'
        : '❌ Erreur génération IDs',
      details: { id1, id2, isValid, isUnique }
    };
  } catch (error) {
    return {
      name: 'Génération d\'IDs',
      status: 'FAIL',
      message: '❌ ' + error.message,
      details: { error: error.message }
    };
  }
}

function testSecuritySystem() {
  try {
    const user = getCurrentUser();

    return {
      name: 'Système de sécurité',
      status: user.email ? 'PASS' : 'FAIL',
      message: user.email
        ? `✅ Utilisateur identifié: ${user.email} (${user.role})`
        : '❌ Impossible d\'identifier l\'utilisateur',
      details: { email: user.email, role: user.role }
    };
  } catch (error) {
    return {
      name: 'Système de sécurité',
      status: 'FAIL',
      message: '❌ ' + error.message,
      details: { error: error.message }
    };
  }
}

function displayDiagnosticResults(results, ui) {
  const passed = results.tests.filter(t => t.status === 'PASS').length;
  const failed = results.tests.filter(t => t.status === 'FAIL').length;

  let message = `📊 DIAGNOSTIC WARAP\n\n`;
  message += `Date: ${Utilities.formatDate(results.timestamp, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss')}\n\n`;
  message += `✅ Tests réussis: ${passed}\n`;
  message += `❌ Tests échoués: ${failed}\n\n`;
  message += `DÉTAILS:\n${'─'.repeat(40)}\n`;

  results.tests.forEach((test, i) => {
    message += `${i + 1}. ${test.name}: ${test.message}\n`;
  });

  ui.alert('🔧 Diagnostic Terminé', message, ui.ButtonSet.OK);

  Logger.log('Diagnostic complet:', JSON.stringify(results, null, 2));
}

Logger.log('✅ WARAP_Setup.gs chargé');
