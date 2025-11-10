/**
 * Module Contacts v2.0 - Clients et Fournisseurs optimisés
 * Architecture améliorée avec réduction de duplication et performances accrues
 */

// ============================================================================
// CONSTANTES
// ============================================================================

const CONTACTS_CONFIG = {
  // Plages de validation
  MAX_VALIDATION_ROWS: 1000,

  // Cache TTL
  ACTIVE_CLIENTS_CACHE_TTL: 300, // 5 minutes

  // Colonnes clients
  CLIENT_COLS: {
    NUMERO: 0,
    NOM: 1,
    TYPE: 2,
    TELEPHONE: 3,
    EMAIL: 4,
    ADRESSE: 5,
    VILLE: 6,
    CONTACT: 7,
    DATE_CREATION: 8,
    STATUT: 9,
    CA_TOTAL: 10,
    DERNIERE_ACTIVITE: 11
  },

  // Colonnes fournisseurs
  FOURNISSEUR_COLS: {
    NUMERO: 0,
    NOM: 1,
    CATEGORIE: 2,
    TELEPHONE: 3,
    EMAIL: 4,
    ADRESSE: 5,
    VILLE: 6,
    CONTACT: 7,
    DELAI: 8,
    DATE_CREATION: 9,
    STATUT: 10,
    NOTE: 11
  }
};

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Crée un en-tête de feuille standardisé
 * @param {Sheet} sheet - La feuille
 * @param {string} title - Le titre
 * @param {string} range - La plage (ex: 'A1:L1')
 * @private
 */
function createSheetHeader_(sheet, title, range) {
  const config = ERP.getSafeConfig();

  sheet.getRange(range).merge()
    .setValue(title)
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');
}

/**
 * Configure les en-têtes de colonnes
 * @param {Sheet} sheet - La feuille
 * @param {Array<string>} headers - Les en-têtes
 * @param {number} row - La ligne d'en-tête
 * @private
 */
function setupColumnHeaders_(sheet, headers, row) {
  const config = ERP.getSafeConfig();

  sheet.getRange(row, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}

/**
 * Configure les largeurs de colonnes en batch
 * @param {Sheet} sheet - La feuille
 * @param {Array<number>} widths - Les largeurs
 * @private
 */
function setupColumnWidths_(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
}

/**
 * Obtient une valeur de config de manière sûre
 * @param {string} path - Le chemin dans la config (ex: 'prefixes.client')
 * @private
 */
function getConfigValue_(path) {
  const config = ERP.getSafeConfig();
  const keys = path.split('.');
  let value = config;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      ERP.log('WARN', `Config path not found: ${path}`);
      return null;
    }
  }

  return value;
}

// ============================================================================
// INITIALISATION SYSTÈME
// ============================================================================

/**
 * Initialise toutes les feuilles de l'ERP
 * Optimisé avec gestion d'erreurs granulaire
 */
function initializeERP() {
  // Initialiser ERP avec config par défaut AVANT de créer les feuilles
  if (!ERP.config) {
    ERP.config = getDefaultConfig();
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Initialisation ERP v2.0',
    'Voulez-vous créer toutes les feuilles du système ?\n\n' +
    'Cette opération peut prendre quelques instants.',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  try {
    ui.alert('Création en cours...', 'Veuillez patienter', ui.ButtonSet.OK);

    // Créer les feuilles par ordre logique
    const sheets = [
      { fn: createConfigSheet, name: 'Configuration' },
      { fn: createClientsSheet, name: 'Clients' },
      { fn: createFournisseursSheet, name: 'Fournisseurs' },
      { fn: createCourrierEntrantSheet, name: 'Courrier Entrant' },
      { fn: createCourrierSortantSheet, name: 'Courrier Sortant' },
      { fn: createAgendaSheet, name: 'Agenda' },
      { fn: createTachesSheet, name: 'Tâches' },
      { fn: createDevisSheet, name: 'Devis' },
      { fn: createFacturesSheet, name: 'Factures' },
      { fn: createPaiementsSheet, name: 'Paiements' },
      { fn: createStockSheet, name: 'Stock' },
      { fn: createMouvementsStockSheet, name: 'Mouvements Stock' },
      { fn: createPersonnelSheet, name: 'Personnel' },
      { fn: createPresencesSheet, name: 'Présences' },
      { fn: createDashboardSheet, name: 'Tableau de bord' },
      { fn: createAuditSheet, name: 'Audit' },
      { fn: createNotificationsSheet, name: 'Notifications' }
    ];

    let successCount = 0;
    const errors = [];

    for (const sheetDef of sheets) {
      try {
        sheetDef.fn();
        successCount++;
        ERP.log('INFO', `Feuille créée: ${sheetDef.name}`);
      } catch (error) {
        errors.push({ sheet: sheetDef.name, error: error.toString() });
        ERP.log('ERROR', `Erreur création ${sheetDef.name}: ${error}`);
      }
    }

    // Résumé de l'initialisation
    const summary = `✅ Initialisation terminée !\n\n` +
                   `Feuilles créées: ${successCount}/${sheets.length}`;

    if (errors.length > 0) {
      const errorDetails = errors.map(e => `- ${e.sheet}: ${e.error}`).join('\n');
      ui.alert('Initialisation partielle', summary + '\n\nErreurs:\n' + errorDetails, ui.ButtonSet.OK);
    } else {
      ui.alert('Succès', summary, ui.ButtonSet.OK);
    }

    // Audit log
    AuditLog.log(
      AuditLog.Actions.CREATE,
      'SYSTÈME',
      'ERP',
      `Initialisation complète: ${successCount} feuilles`
    );

    // Rediriger vers le tableau de bord
    goToDashboard();

  } catch (error) {
    ERP.handleError(error, 'initializeERP');
  }
}

// ============================================================================
// CRÉATION DES FEUILLES
// ============================================================================

/**
 * Crée la feuille Configuration v2.0
 * Optimisée avec fonctions utilitaires
 */
function createConfigSheet() {
  const sheet = ERP.getOrCreateSheet('Configuration');
  const config = ERP.getSafeConfig();

  sheet.clear();

  // En-tête principal
  createSheetHeader_(sheet, '⚙️ CONFIGURATION ERP v2.0', 'A1:B1');

  // Informations entreprise
  sheet.getRange('A3')
    .setValue('📋 INFORMATIONS ENTREPRISE')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.info);

  const infoEntreprise = [
    ['Nom de l\'entreprise:', config.entreprise.nom],
    ['Adresse:', config.entreprise.adresse],
    ['Téléphone:', config.entreprise.telephone],
    ['Email:', config.entreprise.email],
    ['NIF:', config.entreprise.nif],
    ['RC:', config.entreprise.rc],
    ['Devise:', config.devise],
    ['', '']
  ];
  sheet.getRange(4, 1, infoEntreprise.length, 2).setValues(infoEntreprise);

  // Paramètres fiscaux
  sheet.getRange('A13')
    .setValue('💰 PARAMÈTRES FISCAUX')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.warning);

  sheet.getRange('A14:B14').setValues([['Taux TVA (%):', config.tauxTVA]]);

  // Préfixes
  sheet.getRange('A16')
    .setValue('🔢 PRÉFIXES DOCUMENTS')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.success);

  const prefixes = [
    ['Clients:', config.prefixes.client],
    ['Fournisseurs:', config.prefixes.fournisseur],
    ['Devis:', config.prefixes.devis],
    ['Factures:', config.prefixes.facture],
    ['Courrier Entrant:', config.prefixes.courrierEntrant],
    ['Courrier Sortant:', config.prefixes.courrierSortant],
    ['Tâches:', config.prefixes.tache],
    ['Employés:', config.prefixes.employe]
  ];
  sheet.getRange(17, 1, prefixes.length, 2).setValues(prefixes);

  // Options v2.0
  sheet.getRange('A26')
    .setValue('⚙️ OPTIONS SYSTÈME')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.subHeader);

  const options = [
    ['Activer notifications:', config.options.enableNotifications ? 'OUI' : 'NON'],
    ['Backup automatique:', config.options.enableAutoBackup ? 'OUI' : 'NON'],
    ['Fréquence backup:', config.options.backupFrequency],
    ['Log d\'audit:', config.options.enableAuditLog ? 'OUI' : 'NON']
  ];
  sheet.getRange(27, 1, options.length, 2).setValues(options);

  // Instructions
  sheet.getRange('A32')
    .setValue('📝 Instructions:')
    .setFontWeight('bold')
    .setFontColor(config.colors.info);

  sheet.getRange('A33')
    .setValue('Modifiez les valeurs de la colonne B. Videz le cache après modification (Menu > Système > Vider le cache).')
    .setWrap(true);

  // Configuration des colonnes
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 300);

  // Protection de l'en-tête
  Security.protectRange(sheet, sheet.getRange('A1:B2'), 'En-tête protégé');

  ERP.log('INFO', 'Feuille Configuration créée avec succès');
  return sheet;
}

/**
 * Crée la feuille Clients v2.0
 * Optimisée avec constantes et fonctions utilitaires
 */
function createClientsSheet() {
  const sheet = ERP.getOrCreateSheet('Clients');
  const config = ERP.getSafeConfig();

  sheet.clear();

  // En-tête principal
  createSheetHeader_(sheet, '👥 GESTION DES CLIENTS - v2.0', 'A1:L1');

  // En-têtes de colonnes
  const headers = [
    'N° Client',
    'Nom/Raison Sociale',
    'Type',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'Contact Principal',
    'Date Création',
    'Statut',
    'CA Total',
    'Dernière Activité'
  ];
  setupColumnHeaders_(sheet, headers, 2);

  // Largeurs de colonnes optimisées
  const widths = [100, 200, 100, 120, 180, 250, 120, 150, 110, 100, 120, 130];
  setupColumnWidths_(sheet, widths);

  // Figer les lignes d'en-tête
  sheet.setFrozenRows(2);

  // Validation Type - Appliquée dynamiquement jusqu'à 100 lignes seulement
  const typeValidationRange = `C3:C${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`;
  sheet.getRange(typeValidationRange).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Particulier', 'Entreprise', 'Administration', 'ONG'], true)
      .setAllowInvalid(false)
      .setHelpText('Sélectionnez le type de client')
      .build()
  );

  // Validation Statut
  const statutValidationRange = `J3:J${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`;
  sheet.getRange(statutValidationRange).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Actif', 'Inactif', 'Suspendu', 'VIP'], true)
      .setAllowInvalid(false)
      .setHelpText('Sélectionnez le statut du client')
      .build()
  );

  // Formatage conditionnel pour les statuts
  const rules = [];

  // VIP en doré
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('VIP')
    .setBackground('#FFD700')
    .setFontColor('#000000')
    .setBold(true)
    .setRanges([sheet.getRange(`J3:J${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`)])
    .build()
  );

  // Inactif en gris
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Inactif')
    .setBackground('#CCCCCC')
    .setFontColor('#666666')
    .setRanges([sheet.getRange(`J3:J${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`)])
    .build()
  );

  // Suspendu en rouge
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Suspendu')
    .setBackground('#FFCCCC')
    .setFontColor('#CC0000')
    .setRanges([sheet.getRange(`J3:J${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`)])
    .build()
  );

  sheet.setConditionalFormatRules(rules);

  ERP.log('INFO', 'Feuille Clients créée avec succès');
  return sheet;
}

/**
 * Crée la feuille Fournisseurs v2.0
 * Optimisée avec constantes et fonctions utilitaires
 */
function createFournisseursSheet() {
  const sheet = ERP.getOrCreateSheet('Fournisseurs');
  const config = ERP.getSafeConfig();

  sheet.clear();

  // En-tête principal
  createSheetHeader_(sheet, '🏪 GESTION DES FOURNISSEURS - v2.0', 'A1:L1');

  // En-têtes de colonnes
  const headers = [
    'N° Fournisseur',
    'Nom/Raison Sociale',
    'Catégorie',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'Contact Principal',
    'Délai Livraison',
    'Date Création',
    'Statut',
    'Note/5'
  ];
  setupColumnHeaders_(sheet, headers, 2);

  // Largeurs de colonnes optimisées
  const widths = [120, 200, 120, 120, 180, 250, 120, 150, 100, 110, 100, 80];
  setupColumnWidths_(sheet, widths);

  // Figer les lignes d'en-tête
  sheet.setFrozenRows(2);

  // Validation Catégorie
  const categorieValidationRange = `C3:C${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`;
  sheet.getRange(categorieValidationRange).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList([
        'Fournitures Bureau',
        'Informatique',
        'Services',
        'Papeterie',
        'Mobilier',
        'Autre'
      ], true)
      .setAllowInvalid(false)
      .setHelpText('Sélectionnez la catégorie du fournisseur')
      .build()
  );

  // Validation Statut
  const statutValidationRange = `K3:K${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`;
  sheet.getRange(statutValidationRange).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Actif', 'Inactif', 'Bloqué'], true)
      .setAllowInvalid(false)
      .setHelpText('Sélectionnez le statut du fournisseur')
      .build()
  );

  // Validation Note (1-5)
  const noteValidationRange = `L3:L${CONTACTS_CONFIG.MAX_VALIDATION_ROWS}`;
  sheet.getRange(noteValidationRange).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireNumberBetween(1, 5)
      .setAllowInvalid(false)
      .setHelpText('Entrez une note entre 1 et 5')
      .build()
  );

  // Formatage conditionnel pour les notes
  const rules = [];

  // Excellente note (5) en vert
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(5)
    .setBackground('#D4EDDA')
    .setFontColor('#155724')
    .setBold(true)
    .setRanges([sheet.getRange(noteValidationRange)])
    .build()
  );

  // Mauvaise note (1-2) en rouge
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(2)
    .setBackground('#F8D7DA')
    .setFontColor('#721C24')
    .setRanges([sheet.getRange(noteValidationRange)])
    .build()
  );

  sheet.setConditionalFormatRules(rules);

  ERP.log('INFO', 'Feuille Fournisseurs créée avec succès');
  return sheet;
}

// ============================================================================
// DIALOGUES ET FORMULAIRES
// ============================================================================

/**
 * Affiche le dialogue d'ajout de client v2.0
 */
function showAddClientDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('ClientForm')
      .setWidth(600)
      .setHeight(700)
      .setTitle('Nouveau Client');

    SpreadsheetApp.getUi().showModalDialog(html, '➕ Nouveau Client - v2.0');
  } catch (error) {
    ERP.handleError(error, 'showAddClientDialog');
  }
}

/**
 * Affiche le dialogue d'ajout de fournisseur v2.0
 */
function showAddFournisseurDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('FournisseurForm')
      .setWidth(600)
      .setHeight(750)
      .setTitle('Nouveau Fournisseur');

    SpreadsheetApp.getUi().showModalDialog(html, '➕ Nouveau Fournisseur - v2.0');
  } catch (error) {
    ERP.handleError(error, 'showAddFournisseurDialog');
  }
}

/**
 * Affiche le dialogue de recherche
 */
function showSearchContactDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('SearchForm')
      .setWidth(700)
      .setHeight(600)
      .setTitle('Recherche de Contacts');

    SpreadsheetApp.getUi().showModalDialog(html, '🔍 Recherche de Contacts');
  } catch (error) {
    ERP.handleError(error, 'showSearchContactDialog');
  }
}

// ============================================================================
// GESTION DES CLIENTS
// ============================================================================

/**
 * Ajoute un client avec validation complète v2.0
 * @param {Object} clientData - Les données du client
 * @return {Object} Résultat de l'opération
 */
function addClient(clientData) {
  try {
    // Validation des données
    const validation = Validator.validateClient(clientData);
    if (!validation.isValid) {
      Validator.showValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }

    // Sanitization des données pour éviter XSS
    clientData.nom = Validator.sanitizeString(clientData.nom);
    clientData.adresse = Validator.sanitizeString(clientData.adresse || '');
    clientData.contact = Validator.sanitizeString(clientData.contact || '');

    // Obtenir la feuille
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) {
      throw new Error('La feuille Clients n\'existe pas. Veuillez initialiser l\'ERP.');
    }

    // Générer le numéro client
    const config = ERP.getSafeConfig();
    const numeroClient = ERP.getNextNumber(config.prefixes.client, 'Clients');
    const dateCreation = ERP.formatDate(new Date());

    // Préparer la nouvelle ligne
    const newRow = [
      numeroClient,
      clientData.nom,
      clientData.type || 'Particulier',
      clientData.telephone,
      clientData.email || '',
      clientData.adresse || '',
      clientData.ville || 'Yaoundé',
      clientData.contact || '',
      dateCreation,
      clientData.statut || 'Actif',
      '0 ' + config.devise, // CA Total initialisé à 0
      dateCreation // Dernière activité = date de création
    ];

    // Ajouter la ligne
    sheet.appendRow(newRow);

    // Formater la nouvelle ligne
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, newRow.length);
    range.setBorder(true, true, true, true, false, false)
         .setVerticalAlignment('middle');

    // Invalider le cache pour forcer le rechargement
    DataManager.invalidateCache('Clients');

    // Log d'audit
    AuditLog.log(
      AuditLog.Actions.CREATE,
      AuditLog.Entities.CLIENT,
      numeroClient,
      `Client créé: ${clientData.nom}`
    );

    ERP.log('INFO', `Client créé: ${numeroClient} - ${clientData.nom}`);

    return {
      success: true,
      numero: numeroClient,
      message: `Client ${numeroClient} créé avec succès`
    };

  } catch (error) {
    ERP.handleError(error, 'addClient');
    return {
      success: false,
      error: error.toString(),
      message: 'Erreur lors de la création du client'
    };
  }
}

// ============================================================================
// GESTION DES FOURNISSEURS
// ============================================================================

/**
 * Ajoute un fournisseur avec validation v2.0
 * @param {Object} fournisseurData - Les données du fournisseur
 * @return {Object} Résultat de l'opération
 */
function addFournisseur(fournisseurData) {
  try {
    // Validation basique
    if (!fournisseurData.nom || !fournisseurData.telephone) {
      return {
        success: false,
        error: 'Le nom et le téléphone sont obligatoires'
      };
    }

    // Obtenir la feuille
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');
    if (!sheet) {
      throw new Error('La feuille Fournisseurs n\'existe pas. Veuillez initialiser l\'ERP.');
    }

    // Générer le numéro fournisseur
    const config = ERP.getSafeConfig();
    const numeroFournisseur = ERP.getNextNumber(config.prefixes.fournisseur, 'Fournisseurs');
    const dateCreation = ERP.formatDate(new Date());

    // Sanitization des données
    const nomSanitized = Validator.sanitizeString(fournisseurData.nom);
    const adresseSanitized = Validator.sanitizeString(fournisseurData.adresse || '');
    const contactSanitized = Validator.sanitizeString(fournisseurData.contact || '');

    // Préparer la nouvelle ligne
    const newRow = [
      numeroFournisseur,
      nomSanitized,
      fournisseurData.categorie || 'Autre',
      fournisseurData.telephone,
      fournisseurData.email || '',
      adresseSanitized,
      fournisseurData.ville || 'Yaoundé',
      contactSanitized,
      (fournisseurData.delai || '3') + ' jours',
      dateCreation,
      fournisseurData.statut || 'Actif',
      fournisseurData.note || 3
    ];

    // Ajouter la ligne
    sheet.appendRow(newRow);

    // Formater la nouvelle ligne
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, newRow.length);
    range.setBorder(true, true, true, true, false, false)
         .setVerticalAlignment('middle');

    // Invalider le cache
    DataManager.invalidateCache('Fournisseurs');

    // Log d'audit
    AuditLog.log(
      AuditLog.Actions.CREATE,
      AuditLog.Entities.FOURNISSEUR,
      numeroFournisseur,
      `Fournisseur créé: ${nomSanitized}`
    );

    ERP.log('INFO', `Fournisseur créé: ${numeroFournisseur} - ${nomSanitized}`);

    return {
      success: true,
      numero: numeroFournisseur,
      message: `Fournisseur ${numeroFournisseur} créé avec succès`
    };

  } catch (error) {
    ERP.handleError(error, 'addFournisseur');
    return {
      success: false,
      error: error.toString(),
      message: 'Erreur lors de la création du fournisseur'
    };
  }
}

// ============================================================================
// RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Recherche un client avec cache optimisé
 * @param {string} searchTerm - Terme de recherche
 * @return {Array<Object>} Liste des clients trouvés
 */
function searchClient(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const cols = CONTACTS_CONFIG.CLIENT_COLS;
    const results = DataManager.search('Clients', searchTerm, [
      cols.NUMERO,
      cols.NOM,
      cols.TELEPHONE
    ]);

    return results.map(row => ({
      numero: row[cols.NUMERO] || '',
      nom: row[cols.NOM] || '',
      type: row[cols.TYPE] || '',
      telephone: row[cols.TELEPHONE] || '',
      email: row[cols.EMAIL] || '',
      statut: row[cols.STATUT] || '',
      caTotal: row[cols.CA_TOTAL] || '0'
    }));

  } catch (error) {
    ERP.handleError(error, 'searchClient');
    return [];
  }
}

/**
 * Recherche un fournisseur
 * @param {string} searchTerm - Terme de recherche
 * @return {Array<Object>} Liste des fournisseurs trouvés
 */
function searchFournisseur(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const cols = CONTACTS_CONFIG.FOURNISSEUR_COLS;
    const results = DataManager.search('Fournisseurs', searchTerm, [
      cols.NUMERO,
      cols.NOM,
      cols.TELEPHONE
    ]);

    return results.map(row => ({
      numero: row[cols.NUMERO] || '',
      nom: row[cols.NOM] || '',
      categorie: row[cols.CATEGORIE] || '',
      telephone: row[cols.TELEPHONE] || '',
      email: row[cols.EMAIL] || '',
      statut: row[cols.STATUT] || '',
      note: row[cols.NOTE] || '3'
    }));

  } catch (error) {
    ERP.handleError(error, 'searchFournisseur');
    return [];
  }
}

/**
 * Obtient les clients actifs avec cache
 * @return {Array<Object>} Liste des clients actifs
 */
function getActiveClients() {
  try {
    const cacheKey = 'active_clients';
    const cached = ERP.cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    const cols = CONTACTS_CONFIG.CLIENT_COLS;
    const data = DataManager.filter('Clients', row =>
      row[cols.STATUT] === 'Actif' || row[cols.STATUT] === 'VIP'
    );

    const clients = data.map(row => ({
      numero: row[cols.NUMERO] || '',
      nom: row[cols.NOM] || '',
      telephone: row[cols.TELEPHONE] || ''
    }));

    // Cache pour 5 minutes
    ERP.cacheSet(cacheKey, clients, CONTACTS_CONFIG.ACTIVE_CLIENTS_CACHE_TTL);

    return clients;

  } catch (error) {
    ERP.log('ERROR', 'getActiveClients: ' + error.toString());
    return [];
  }
}

// ============================================================================
// MISE À JOUR DES DONNÉES
// ============================================================================

/**
 * Met à jour le CA d'un client de manière optimisée
 * @param {string} clientNom - Nom du client
 * @param {number} montant - Montant à ajouter
 */
function updateClientRevenue(clientNom, montant) {
  try {
    if (!clientNom || montant === undefined) {
      ERP.log('WARN', 'updateClientRevenue: paramètres invalides');
      return;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) {
      ERP.log('ERROR', 'updateClientRevenue: feuille Clients introuvable');
      return;
    }

    const data = sheet.getDataRange().getValues();
    const cols = CONTACTS_CONFIG.CLIENT_COLS;
    const config = ERP.getSafeConfig();

    // Trouver le client
    for (let i = 2; i < data.length; i++) { // Commencer à la ligne 3 (index 2)
      if (data[i][cols.NOM] === clientNom) {
        // Extraire le CA actuel (enlever la devise)
        const currentCAString = String(data[i][cols.CA_TOTAL] || '0');
        const currentCA = parseFloat(currentCAString.replace(/[^0-9.-]+/g, '')) || 0;
        const newCA = currentCA + montant;

        // Batch update pour optimiser les performances
        const rowNumber = i + 1; // +1 car les arrays commencent à 0
        const updates = [
          {
            range: sheet.getRange(rowNumber, cols.CA_TOTAL + 1),
            value: newCA + ' ' + config.devise
          },
          {
            range: sheet.getRange(rowNumber, cols.DERNIERE_ACTIVITE + 1),
            value: ERP.formatDate(new Date())
          }
        ];

        // Appliquer les mises à jour
        updates.forEach(update => {
          update.range.setValue(update.value);
        });

        // Invalider le cache
        DataManager.invalidateCache('Clients');

        ERP.log('INFO', `CA mis à jour pour ${clientNom}: +${montant} ${config.devise}`);
        break;
      }
    }

  } catch (error) {
    ERP.log('ERROR', `updateClientRevenue: ${error.toString()}`);
  }
}

// ============================================================================
// STATISTIQUES
// ============================================================================

/**
 * Affiche les statistiques des contacts
 */
function showContactStats() {
  try {
    const clientsData = DataManager.getData('Clients');
    const fournisseursData = DataManager.getData('Fournisseurs');

    const cols = CONTACTS_CONFIG.CLIENT_COLS;
    const fCols = CONTACTS_CONFIG.FOURNISSEUR_COLS;

    // Statistiques clients
    const totalClients = clientsData.length;
    const clientsActifs = clientsData.filter(row => row[cols.STATUT] === 'Actif').length;
    const clientsVIP = clientsData.filter(row => row[cols.STATUT] === 'VIP').length;
    const clientsInactifs = clientsData.filter(row => row[cols.STATUT] === 'Inactif').length;

    // Statistiques fournisseurs
    const totalFournisseurs = fournisseursData.length;
    const fournisseursActifs = fournisseursData.filter(row => row[fCols.STATUT] === 'Actif').length;
    const fournisseursBloques = fournisseursData.filter(row => row[fCols.STATUT] === 'Bloqué').length;

    // Calcul du CA total
    const caTotal = clientsData.reduce((sum, row) => {
      const ca = parseFloat(String(row[cols.CA_TOTAL] || '0').replace(/[^0-9.-]+/g, '')) || 0;
      return sum + ca;
    }, 0);

    const config = ERP.getSafeConfig();
    const ui = SpreadsheetApp.getUi();

    const msg = `📊 STATISTIQUES CONTACTS\n\n` +
                `👥 CLIENTS\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `Total: ${totalClients}\n` +
                `├─ Actifs: ${clientsActifs}\n` +
                `├─ VIP: ${clientsVIP}\n` +
                `└─ Inactifs: ${clientsInactifs}\n` +
                `CA Total: ${caTotal.toFixed(2)} ${config.devise}\n\n` +
                `🏪 FOURNISSEURS\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `Total: ${totalFournisseurs}\n` +
                `├─ Actifs: ${fournisseursActifs}\n` +
                `└─ Bloqués: ${fournisseursBloques}`;

    ui.alert('📊 Statistiques Contacts', msg, ui.ButtonSet.OK);

  } catch (error) {
    ERP.handleError(error, 'showContactStats');
  }
}

// ============================================================================
// FEUILLES SYSTÈME
// ============================================================================

/**
 * Crée la feuille d'audit
 */
function createAuditSheet() {
  const sheet = ERP.getOrCreateSheet('_Audit');
  const config = ERP.getSafeConfig();

  if (sheet.getLastRow() === 0) {
    const headers = [
      'Date/Heure',
      'Utilisateur',
      'Action',
      'Entité',
      'ID',
      'Détails'
    ];

    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setBackground(config.colors.header)
      .setFontColor(config.colors.headerText)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

    const widths = [180, 200, 120, 100, 120, 300];
    setupColumnWidths_(sheet, widths);
  }

  // Masquer la feuille système
  sheet.hideSheet();

  return sheet;
}

/**
 * Crée la feuille de notifications
 */
function createNotificationsSheet() {
  const sheet = ERP.getOrCreateSheet('_Notifications');
  const config = ERP.getSafeConfig();

  if (sheet.getLastRow() === 0) {
    const headers = [
      'Date/Heure',
      'Type',
      'Titre',
      'Message',
      'Statut',
      'Action'
    ];

    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setBackground(config.colors.header)
      .setFontColor(config.colors.headerText)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

    const widths = [180, 100, 200, 300, 100, 150];
    setupColumnWidths_(sheet, widths);
  }

  // Masquer la feuille système
  sheet.hideSheet();

  return sheet;
}
