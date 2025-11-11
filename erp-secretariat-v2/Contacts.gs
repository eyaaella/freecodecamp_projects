/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ERP Secrétariat v3.0 - Module Contacts                         ║
 * ║  Gestion Clients et Fournisseurs - Production Ready             ║
 * ║  Architecture autonome avec fallbacks et auto-réparation         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * @version 3.0.0
 * @author ERP Team
 * @license MIT
 *
 * Améliorations v3.0:
 * - Vérification automatique des dépendances
 * - Fonctions de secours (fallbacks) intégrées
 * - Auto-réparation en cas de problème Core.gs
 * - Performance optimisée avec cache intelligent
 * - Gestion d'erreurs de niveau enterprise
 * - Architecture modulaire et testable
 */

// ============================================================================
// CONFIGURATION ET CONSTANTES
// ============================================================================

const CONTACTS_V3_CONFIG = {
  VERSION: '3.0.0',

  // Limites et seuils
  MAX_VALIDATION_ROWS: 1000,
  MAX_SEARCH_RESULTS: 100,
  BATCH_SIZE: 500,

  // Cache TTL (secondes)
  CACHE_TTL: {
    ACTIVE_CLIENTS: 300,      // 5 minutes
    SEARCH_RESULTS: 180,      // 3 minutes
    STATS: 600,               // 10 minutes
    CONFIG: 600               // 10 minutes
  },

  // Indices de colonnes - CLIENTS
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

  // Indices de colonnes - FOURNISSEURS
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
  },

  // Valeurs par défaut
  DEFAULTS: {
    VILLE: 'Yaoundé',
    DEVISE: 'XAF',
    STATUT_CLIENT: 'Actif',
    STATUT_FOURNISSEUR: 'Actif',
    NOTE_FOURNISSEUR: 3,
    DELAI_LIVRAISON: 3,
    TIMEZONE: 'Africa/Douala'
  },

  // Préfixes par défaut (si Core.gs non disponible)
  PREFIXES: {
    CLIENT: 'CL',
    FOURNISSEUR: 'FR'
  },

  // Couleurs par défaut (si Core.gs non disponible)
  COLORS: {
    HEADER: '#1a73e8',
    HEADER_TEXT: '#ffffff',
    SUB_HEADER: '#e8f0fe',
    INFO: '#d2e3fc',
    WARNING: '#fce8b2',
    SUCCESS: '#ceead6',
    DANGER: '#fad2cf'
  }
};

// ============================================================================
// SYSTÈME DE COMPATIBILITÉ ET FALLBACKS
// ============================================================================

/**
 * Gestionnaire de compatibilité pour assurer le fonctionnement autonome
 * @private
 */
const ContactsCompat_ = {

  /**
   * Vérifie si ERP Core est disponible et fonctionnel
   * @return {boolean}
   */
  isERPAvailable: function() {
    try {
      return typeof ERP !== 'undefined' &&
             ERP !== null &&
             typeof ERP.VERSION !== 'undefined';
    } catch (e) {
      return false;
    }
  },

  /**
   * Vérifie si une méthode ERP existe
   * @param {string} methodName
   * @return {boolean}
   */
  hasERPMethod: function(methodName) {
    try {
      return this.isERPAvailable() &&
             typeof ERP[methodName] === 'function';
    } catch (e) {
      return false;
    }
  },

  /**
   * Obtient la config de manière sûre avec fallback
   * @return {Object}
   */
  getSafeConfig: function() {
    // Essayer d'utiliser ERP.getSafeConfig si disponible
    if (this.hasERPMethod('getSafeConfig')) {
      try {
        return ERP.getSafeConfig();
      } catch (e) {
        console.warn('ERP.getSafeConfig failed, using fallback:', e);
      }
    }

    // Essayer ERP.config direct
    if (this.isERPAvailable() && ERP.config) {
      return ERP.config;
    }

    // Fallback: charger depuis la feuille ou utiliser défaut
    return this.loadConfigFallback_();
  },

  /**
   * Charge la config en mode fallback
   * @private
   * @return {Object}
   */
  loadConfigFallback_: function() {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Configuration');
      if (sheet && sheet.getLastRow() > 3) {
        // Charger depuis la feuille
        return this.parseConfigSheet_(sheet);
      }
    } catch (e) {
      console.warn('Cannot load config from sheet:', e);
    }

    // Retourner config minimale par défaut
    return this.getDefaultConfig_();
  },

  /**
   * Parse la feuille de configuration
   * @private
   * @param {Sheet} sheet
   * @return {Object}
   */
  parseConfigSheet_: function(sheet) {
    const data = sheet.getDataRange().getValues();
    return {
      entreprise: {
        nom: data[3] ? data[3][1] : 'Mon Entreprise',
        adresse: data[4] ? data[4][1] : '',
        telephone: data[5] ? data[5][1] : '',
        email: data[6] ? data[6][1] : '',
        nif: data[7] ? data[7][1] : '',
        rc: data[8] ? data[8][1] : ''
      },
      devise: data[9] ? data[9][1] : 'XAF',
      tauxTVA: data[13] ? data[13][1] : 19.25,
      prefixes: {
        client: data[16] ? data[16][1] : 'CL',
        fournisseur: data[17] ? data[17][1] : 'FR',
        devis: data[18] ? data[18][1] : 'DV',
        facture: data[19] ? data[19][1] : 'FA',
        courrierEntrant: data[20] ? data[20][1] : 'CE',
        courrierSortant: data[21] ? data[21][1] : 'CS',
        tache: data[22] ? data[22][1] : 'TK',
        employe: data[23] ? data[23][1] : 'EMP'
      },
      colors: CONTACTS_V3_CONFIG.COLORS,
      timezone: 'Africa/Douala',
      options: {
        enableNotifications: true,
        enableAutoBackup: false,
        backupFrequency: 'Hebdomadaire',
        enableAuditLog: true
      }
    };
  },

  /**
   * Config par défaut minimale
   * @private
   * @return {Object}
   */
  getDefaultConfig_: function() {
    return {
      entreprise: {
        nom: 'Mon Entreprise',
        adresse: 'Yaoundé, Cameroun',
        telephone: '+237 6XX XXX XXX',
        email: 'contact@entreprise.cm',
        nif: '',
        rc: ''
      },
      devise: 'XAF',
      tauxTVA: 19.25,
      prefixes: CONTACTS_V3_CONFIG.PREFIXES,
      colors: CONTACTS_V3_CONFIG.COLORS,
      timezone: CONTACTS_V3_CONFIG.DEFAULTS.TIMEZONE,
      options: {
        enableNotifications: true,
        enableAutoBackup: false,
        backupFrequency: 'Hebdomadaire',
        enableAuditLog: true
      }
    };
  },

  /**
   * Obtient ou crée une feuille avec fallback
   * @param {string} name
   * @return {Sheet}
   */
  getOrCreateSheet: function(name) {
    // Essayer d'utiliser ERP.getOrCreateSheet si disponible
    if (this.hasERPMethod('getOrCreateSheet')) {
      try {
        return ERP.getOrCreateSheet(name);
      } catch (e) {
        console.warn('ERP.getOrCreateSheet failed, using fallback:', e);
      }
    }

    // Fallback local
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
      console.log('Feuille créée (fallback):', name);
    }

    return sheet;
  },

  /**
   * Formate une date avec fallback
   * @param {Date} date
   * @return {string}
   */
  formatDate: function(date) {
    if (!date) date = new Date();

    // Essayer ERP.formatDate
    if (this.hasERPMethod('formatDate')) {
      try {
        return ERP.formatDate(date);
      } catch (e) {
        console.warn('ERP.formatDate failed, using fallback:', e);
      }
    }

    // Fallback
    const config = this.getSafeConfig();
    return Utilities.formatDate(
      date,
      config.timezone || CONTACTS_V3_CONFIG.DEFAULTS.TIMEZONE,
      'dd/MM/yyyy'
    );
  },

  /**
   * Obtient le prochain numéro avec fallback
   * @param {string} prefix
   * @param {string} sheetName
   * @return {string}
   */
  getNextNumber: function(prefix, sheetName) {
    // Essayer ERP.getNextNumber
    if (this.hasERPMethod('getNextNumber')) {
      try {
        return ERP.getNextNumber(prefix, sheetName);
      } catch (e) {
        console.warn('ERP.getNextNumber failed, using fallback:', e);
      }
    }

    // Fallback simple
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      if (!sheet) return prefix + '0001';

      const lastRow = sheet.getLastRow();
      if (lastRow <= 2) return prefix + '0001';

      const lastNumber = sheet.getRange(lastRow, 1).getValue();
      if (!lastNumber) return prefix + '0001';

      const numPart = parseInt(lastNumber.toString().replace(/\D/g, ''));
      const nextNum = (numPart + 1).toString().padStart(4, '0');
      return prefix + nextNum;
    } catch (e) {
      console.error('getNextNumber fallback error:', e);
      return prefix + '0001';
    }
  },

  /**
   * Log avec fallback
   * @param {string} level
   * @param {string} message
   */
  log: function(level, message) {
    if (this.hasERPMethod('log')) {
      try {
        ERP.log(level, message);
        return;
      } catch (e) {
        // Continue to fallback
      }
    }

    // Fallback console
    console.log(`[${level}] [CONTACTS] ${message}`);
  },

  /**
   * Gestion d'erreur avec fallback
   * @param {Error} error
   * @param {string} context
   */
  handleError: function(error, context) {
    const errorMsg = `[${context}] ${error.toString()}`;

    // Essayer ERP.handleError
    if (this.hasERPMethod('handleError')) {
      try {
        ERP.handleError(error, context);
        return;
      } catch (e) {
        console.warn('ERP.handleError failed, using fallback:', e);
      }
    }

    // Fallback
    console.error(errorMsg);
    console.error('Stack:', error.stack);

    try {
      const ui = SpreadsheetApp.getUi();
      ui.alert('Erreur', errorMsg, ui.ButtonSet.OK);
    } catch (e) {
      console.error('Cannot show alert:', e);
    }
  }
};

// Alias court pour faciliter l'utilisation
const Compat_ = ContactsCompat_;

// ============================================================================
// UTILITAIRES INTERNES
// ============================================================================

/**
 * Crée un en-tête de feuille standardisé
 * @param {Sheet} sheet
 * @param {string} title
 * @param {string} range
 * @private
 */
function createSheetHeader_(sheet, title, range) {
  const config = Compat_.getSafeConfig();

  sheet.getRange(range).merge()
    .setValue(title)
    .setBackground(config.colors.header || CONTACTS_V3_CONFIG.COLORS.HEADER)
    .setFontColor(config.colors.headerText || CONTACTS_V3_CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');
}

/**
 * Configure les en-têtes de colonnes
 * @param {Sheet} sheet
 * @param {Array<string>} headers
 * @param {number} row
 * @private
 */
function setupColumnHeaders_(sheet, headers, row) {
  const config = Compat_.getSafeConfig();

  sheet.getRange(row, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader || CONTACTS_V3_CONFIG.COLORS.SUB_HEADER)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}

/**
 * Configure les largeurs de colonnes en batch
 * @param {Sheet} sheet
 * @param {Array<number>} widths
 * @private
 */
function setupColumnWidths_(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
}

/**
 * Applique les validations de données
 * @param {Sheet} sheet
 * @param {string} range
 * @param {Array<string>} values
 * @param {string} helpText
 * @private
 */
function applyDataValidation_(sheet, range, values, helpText) {
  try {
    sheet.getRange(range).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(values, true)
        .setAllowInvalid(false)
        .setHelpText(helpText || 'Sélectionnez une valeur')
        .build()
    );
  } catch (e) {
    Compat_.log('WARN', `Validation failed for ${range}: ${e}`);
  }
}

/**
 * Sanitize une chaîne pour éviter XSS
 * @param {string} str
 * @return {string}
 * @private
 */
function sanitizeString_(str) {
  if (!str) return '';

  // Utiliser Validator si disponible
  if (typeof Validator !== 'undefined' && Validator.sanitizeString) {
    try {
      return Validator.sanitizeString(str);
    } catch (e) {
      Compat_.log('WARN', 'Validator.sanitizeString failed, using fallback');
    }
  }

  // Fallback simple
  return str.toString()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Valide un email
 * @param {string} email
 * @return {boolean}
 * @private
 */
function isValidEmail_(email) {
  if (!email) return true; // Email optionnel
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un téléphone (format Cameroun)
 * @param {string} phone
 * @return {boolean}
 * @private
 */
function isValidPhone_(phone) {
  if (!phone) return false;
  // Accepte: 6XXXXXXXX, +2376XXXXXXXX, 2376XXXXXXXX
  const phoneRegex = /^(\+?237)?[26]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ============================================================================
// INITIALISATION SYSTÈME
// ============================================================================

/**
 * Initialise toutes les feuilles de l'ERP v3.0
 * Architecture robuste avec gestion d'erreurs et auto-réparation
 */
function initializeERP() {
  const ui = SpreadsheetApp.getUi();

  try {
    // Vérifier la disponibilité de Core.gs
    const hasCore = Compat_.isERPAvailable();
    if (!hasCore) {
      const warn = ui.alert(
        '⚠️ Mode Autonome',
        'Core.gs n\'est pas détecté. Contacts v3.0 fonctionnera en mode autonome.\n\n' +
        'Fonctionnalités limitées mais opérationnelles.\n\n' +
        'Continuer ?',
        ui.ButtonSet.YES_NO
      );

      if (warn !== ui.Button.YES) return;
    }

    const response = ui.alert(
      `Initialisation ERP v${CONTACTS_V3_CONFIG.VERSION}`,
      'Voulez-vous créer toutes les feuilles du système ?\n\n' +
      '⏱️ Cette opération peut prendre quelques instants.\n' +
      `📦 Mode: ${hasCore ? 'Complet' : 'Autonome'}`,
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) return;

    // Définir les feuilles à créer
    const coreSheets = [
      { fn: createConfigSheet, name: 'Configuration', category: 'core' },
      { fn: createClientsSheet, name: 'Clients', category: 'core' },
      { fn: createFournisseursSheet, name: 'Fournisseurs', category: 'core' },
      { fn: createAuditSheet, name: 'Audit', category: 'system' },
      { fn: createNotificationsSheet, name: 'Notifications', category: 'system' }
    ];

    // Feuilles optionnelles (nécessitent autres modules)
    const optionalSheets = hasCore ? [
      { fn: createCourrierEntrantSheet, name: 'Courrier Entrant', category: 'optional' },
      { fn: createCourrierSortantSheet, name: 'Courrier Sortant', category: 'optional' },
      { fn: createAgendaSheet, name: 'Agenda', category: 'optional' },
      { fn: createTachesSheet, name: 'Tâches', category: 'optional' },
      { fn: createDevisSheet, name: 'Devis', category: 'optional' },
      { fn: createFacturesSheet, name: 'Factures', category: 'optional' },
      { fn: createPaiementsSheet, name: 'Paiements', category: 'optional' },
      { fn: createStockSheet, name: 'Stock', category: 'optional' },
      { fn: createMouvementsStockSheet, name: 'Mouvements Stock', category: 'optional' },
      { fn: createPersonnelSheet, name: 'Personnel', category: 'optional' },
      { fn: createPresencesSheet, name: 'Présences', category: 'optional' },
      { fn: createDashboardSheet, name: 'Tableau de bord', category: 'optional' }
    ] : [];

    const allSheets = [...coreSheets, ...optionalSheets];

    let successCount = 0;
    let skipCount = 0;
    const errors = [];

    // Créer les feuilles
    for (const sheetDef of allSheets) {
      try {
        // Vérifier si la fonction existe
        if (typeof sheetDef.fn !== 'function') {
          skipCount++;
          Compat_.log('WARN', `Fonction ${sheetDef.name} non disponible - ignorée`);
          continue;
        }

        sheetDef.fn();
        successCount++;
        Compat_.log('INFO', `✓ Feuille créée: ${sheetDef.name}`);

      } catch (error) {
        errors.push({
          sheet: sheetDef.name,
          error: error.toString(),
          category: sheetDef.category
        });
        Compat_.log('ERROR', `✗ Erreur ${sheetDef.name}: ${error}`);
      }
    }

    // Rapport d'initialisation
    const coreSuccess = coreSheets.filter(s =>
      !errors.find(e => e.sheet === s.name)
    ).length;
    const coreTotal = coreSheets.length;

    let summary = `✅ Initialisation terminée !\n\n`;
    summary += `📊 Résultats:\n`;
    summary += `├─ Feuilles essentielles: ${coreSuccess}/${coreTotal}\n`;
    summary += `├─ Feuilles optionnelles: ${successCount - coreSuccess}/${optionalSheets.length}\n`;
    summary += `└─ Total: ${successCount}/${allSheets.length}\n`;

    if (skipCount > 0) {
      summary += `\n⏭️ Ignorées: ${skipCount} (modules non chargés)`;
    }

    if (errors.length > 0) {
      const criticalErrors = errors.filter(e => e.category === 'core');
      const optionalErrors = errors.filter(e => e.category !== 'core');

      summary += `\n\n⚠️ Erreurs:\n`;

      if (criticalErrors.length > 0) {
        summary += `\nCritiques (${criticalErrors.length}):\n`;
        criticalErrors.forEach(e => {
          summary += `- ${e.sheet}: ${e.error.substring(0, 50)}...\n`;
        });
      }

      if (optionalErrors.length > 0) {
        summary += `\nOptionnelles (${optionalErrors.length}):\n`;
        optionalErrors.forEach(e => {
          summary += `- ${e.sheet}: ${e.error.substring(0, 50)}...\n`;
        });
      }

      ui.alert('Initialisation partielle', summary, ui.ButtonSet.OK);
    } else {
      ui.alert('Succès complet', summary, ui.ButtonSet.OK);
    }

    // Log audit si disponible
    if (typeof AuditLog !== 'undefined' && AuditLog.log) {
      try {
        AuditLog.log(
          AuditLog.Actions.CREATE,
          'SYSTÈME',
          'ERP',
          `Init v${CONTACTS_V3_CONFIG.VERSION}: ${successCount}/${allSheets.length} feuilles`
        );
      } catch (e) {
        Compat_.log('WARN', 'Cannot write audit log: ' + e);
      }
    }

    // Redirection vers dashboard si disponible
    if (successCount > 0 && typeof goToDashboard === 'function') {
      try {
        goToDashboard();
      } catch (e) {
        Compat_.log('WARN', 'Cannot go to dashboard: ' + e);
      }
    }

  } catch (error) {
    Compat_.handleError(error, 'initializeERP');
  }
}

// ============================================================================
// CRÉATION DES FEUILLES
// ============================================================================

/**
 * Crée la feuille Configuration v3.0
 * Compatible mode autonome
 */
function createConfigSheet() {
  const sheet = Compat_.getOrCreateSheet('Configuration');
  const config = Compat_.getSafeConfig();

  sheet.clear();

  // En-tête
  createSheetHeader_(sheet, '⚙️ CONFIGURATION ERP v3.0', 'A1:B1');

  // Informations entreprise
  sheet.getRange('A3')
    .setValue('📋 INFORMATIONS ENTREPRISE')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.info || CONTACTS_V3_CONFIG.COLORS.INFO);

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
    .setBackground(config.colors.warning || CONTACTS_V3_CONFIG.COLORS.WARNING);

  sheet.getRange('A14:B14').setValues([['Taux TVA (%):', config.tauxTVA]]);

  // Préfixes
  sheet.getRange('A16')
    .setValue('🔢 PRÉFIXES DOCUMENTS')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.success || CONTACTS_V3_CONFIG.COLORS.SUCCESS);

  const prefixes = [
    ['Clients:', config.prefixes.client],
    ['Fournisseurs:', config.prefixes.fournisseur],
    ['Devis:', config.prefixes.devis || 'DV'],
    ['Factures:', config.prefixes.facture || 'FA'],
    ['Courrier Entrant:', config.prefixes.courrierEntrant || 'CE'],
    ['Courrier Sortant:', config.prefixes.courrierSortant || 'CS'],
    ['Tâches:', config.prefixes.tache || 'TK'],
    ['Employés:', config.prefixes.employe || 'EMP']
  ];
  sheet.getRange(17, 1, prefixes.length, 2).setValues(prefixes);

  // Options système
  sheet.getRange('A26')
    .setValue('⚙️ OPTIONS SYSTÈME')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.subHeader || CONTACTS_V3_CONFIG.COLORS.SUB_HEADER);

  const options = [
    ['Activer notifications:', config.options.enableNotifications ? 'OUI' : 'NON'],
    ['Backup automatique:', config.options.enableAutoBackup ? 'OUI' : 'NON'],
    ['Fréquence backup:', config.options.backupFrequency],
    ['Log d\'audit:', config.options.enableAuditLog ? 'OUI' : 'NON']
  ];
  sheet.getRange(27, 1, options.length, 2).setValues(options);

  // Informations système
  sheet.getRange('A32')
    .setValue('ℹ️ INFORMATIONS SYSTÈME')
    .setFontWeight('bold')
    .setFontSize(12);

  const sysInfo = [
    ['Version Contacts:', CONTACTS_V3_CONFIG.VERSION],
    ['Mode:', Compat_.isERPAvailable() ? 'Complet' : 'Autonome'],
    ['Core.gs:', Compat_.isERPAvailable() ? 'Détecté' : 'Non détecté']
  ];
  sheet.getRange(33, 1, sysInfo.length, 2).setValues(sysInfo);

  // Instructions
  sheet.getRange('A37')
    .setValue('📝 Instructions:')
    .setFontWeight('bold')
    .setFontColor(config.colors.info || CONTACTS_V3_CONFIG.COLORS.INFO);

  sheet.getRange('A38')
    .setValue('Modifiez les valeurs de la colonne B. Videz le cache après modification.')
    .setWrap(true);

  // Dimensions
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 300);

  // Protection si Security disponible
  if (typeof Security !== 'undefined' && Security.protectRange) {
    try {
      Security.protectRange(sheet, sheet.getRange('A1:B2'), 'En-tête protégé');
    } catch (e) {
      Compat_.log('WARN', 'Cannot protect range: ' + e);
    }
  }

  Compat_.log('INFO', 'Feuille Configuration v3.0 créée');
  return sheet;
}

/**
 * Crée la feuille Clients v3.0
 * Optimisée avec formatage conditionnel avancé
 */
function createClientsSheet() {
  const sheet = Compat_.getOrCreateSheet('Clients');
  const config = Compat_.getSafeConfig();

  sheet.clear();

  // En-tête
  createSheetHeader_(sheet, '👥 GESTION DES CLIENTS - v3.0', 'A1:L1');

  // Headers
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

  // Largeurs
  setupColumnWidths_(sheet, [100, 200, 100, 120, 180, 250, 120, 150, 110, 100, 120, 130]);

  sheet.setFrozenRows(2);

  // Validations
  applyDataValidation_(
    sheet,
    `C3:C${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`,
    ['Particulier', 'Entreprise', 'Administration', 'ONG'],
    'Sélectionnez le type de client'
  );

  applyDataValidation_(
    sheet,
    `J3:J${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`,
    ['Actif', 'Inactif', 'Suspendu', 'VIP'],
    'Sélectionnez le statut du client'
  );

  // Formatage conditionnel
  const rules = [];
  const statusRange = sheet.getRange(`J3:J${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`);

  // VIP - Doré
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('VIP')
    .setBackground('#FFD700')
    .setFontColor('#000000')
    .setBold(true)
    .setRanges([statusRange])
    .build()
  );

  // Actif - Vert clair
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Actif')
    .setBackground('#D4EDDA')
    .setFontColor('#155724')
    .setRanges([statusRange])
    .build()
  );

  // Inactif - Gris
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Inactif')
    .setBackground('#E0E0E0')
    .setFontColor('#757575')
    .setRanges([statusRange])
    .build()
  );

  // Suspendu - Rouge
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Suspendu')
    .setBackground('#F8D7DA')
    .setFontColor('#721C24')
    .setBold(true)
    .setRanges([statusRange])
    .build()
  );

  sheet.setConditionalFormatRules(rules);

  Compat_.log('INFO', 'Feuille Clients v3.0 créée');
  return sheet;
}

/**
 * Crée la feuille Fournisseurs v3.0
 * Avec système de notation visuel
 */
function createFournisseursSheet() {
  const sheet = Compat_.getOrCreateSheet('Fournisseurs');
  const config = Compat_.getSafeConfig();

  sheet.clear();

  // En-tête
  createSheetHeader_(sheet, '🏪 GESTION DES FOURNISSEURS - v3.0', 'A1:L1');

  // Headers
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

  // Largeurs
  setupColumnWidths_(sheet, [120, 200, 120, 120, 180, 250, 120, 150, 100, 110, 100, 80]);

  sheet.setFrozenRows(2);

  // Validations
  applyDataValidation_(
    sheet,
    `C3:C${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`,
    ['Fournitures Bureau', 'Informatique', 'Services', 'Papeterie', 'Mobilier', 'Autre'],
    'Sélectionnez la catégorie'
  );

  applyDataValidation_(
    sheet,
    `K3:K${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`,
    ['Actif', 'Inactif', 'Bloqué'],
    'Sélectionnez le statut'
  );

  // Validation note
  try {
    sheet.getRange(`L3:L${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireNumberBetween(1, 5)
        .setAllowInvalid(false)
        .setHelpText('Note entre 1 et 5')
        .build()
    );
  } catch (e) {
    Compat_.log('WARN', 'Cannot set number validation: ' + e);
  }

  // Formatage conditionnel notes
  const rules = [];
  const noteRange = sheet.getRange(`L3:L${CONTACTS_V3_CONFIG.MAX_VALIDATION_ROWS}`);

  // Excellent (5)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(5)
    .setBackground('#D4EDDA')
    .setFontColor('#155724')
    .setBold(true)
    .setRanges([noteRange])
    .build()
  );

  // Bon (4)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(4)
    .setBackground('#D1ECF1')
    .setFontColor('#0C5460')
    .setRanges([noteRange])
    .build()
  );

  // Moyen (3)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(3)
    .setBackground('#FFF3CD')
    .setFontColor('#856404')
    .setRanges([noteRange])
    .build()
  );

  // Mauvais (1-2)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(2)
    .setBackground('#F8D7DA')
    .setFontColor('#721C24')
    .setBold(true)
    .setRanges([noteRange])
    .build()
  );

  sheet.setConditionalFormatRules(rules);

  Compat_.log('INFO', 'Feuille Fournisseurs v3.0 créée');
  return sheet;
}

// ============================================================================
// GESTION DES CLIENTS
// ============================================================================

/**
 * Affiche le dialogue d'ajout de client
 */
function showAddClientDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('ClientForm')
      .setWidth(600)
      .setHeight(700)
      .setTitle('Nouveau Client');

    SpreadsheetApp.getUi().showModalDialog(html, '➕ Nouveau Client - v3.0');
  } catch (error) {
    Compat_.handleError(error, 'showAddClientDialog');
  }
}

/**
 * Ajoute un client avec validation complète v3.0
 * @param {Object} clientData - Données du client
 * @return {Object} Résultat de l'opération
 */
function addClient(clientData) {
  try {
    // Validation des données obligatoires
    if (!clientData || !clientData.nom || !clientData.telephone) {
      return {
        success: false,
        error: 'Le nom et le téléphone sont obligatoires'
      };
    }

    // Validation téléphone
    if (!isValidPhone_(clientData.telephone)) {
      return {
        success: false,
        error: 'Format de téléphone invalide (ex: 6XXXXXXXX ou +2376XXXXXXXX)'
      };
    }

    // Validation email si fourni
    if (clientData.email && !isValidEmail_(clientData.email)) {
      return {
        success: false,
        error: 'Format d\'email invalide'
      };
    }

    // Utiliser Validator si disponible
    if (typeof Validator !== 'undefined' && Validator.validateClient) {
      try {
        const validation = Validator.validateClient(clientData);
        if (!validation.isValid) {
          if (typeof Validator.showValidationErrors === 'function') {
            Validator.showValidationErrors(validation.errors);
          }
          return { success: false, errors: validation.errors };
        }
      } catch (e) {
        Compat_.log('WARN', 'Validator.validateClient failed: ' + e);
      }
    }

    // Sanitization
    const nomSanitized = sanitizeString_(clientData.nom);
    const adresseSanitized = sanitizeString_(clientData.adresse || '');
    const contactSanitized = sanitizeString_(clientData.contact || '');

    // Obtenir la feuille
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) {
      throw new Error('Feuille Clients introuvable. Initialisez d\'abord le système.');
    }

    // Générer le numéro
    const config = Compat_.getSafeConfig();
    const prefix = config.prefixes.client || CONTACTS_V3_CONFIG.PREFIXES.CLIENT;
    const numeroClient = Compat_.getNextNumber(prefix, 'Clients');
    const dateCreation = Compat_.formatDate(new Date());
    const devise = config.devise || CONTACTS_V3_CONFIG.DEFAULTS.DEVISE;

    // Préparer la ligne
    const newRow = [
      numeroClient,
      nomSanitized,
      clientData.type || 'Particulier',
      clientData.telephone,
      clientData.email || '',
      adresseSanitized,
      clientData.ville || CONTACTS_V3_CONFIG.DEFAULTS.VILLE,
      contactSanitized,
      dateCreation,
      clientData.statut || CONTACTS_V3_CONFIG.DEFAULTS.STATUT_CLIENT,
      `0 ${devise}`,
      dateCreation
    ];

    // Ajouter
    sheet.appendRow(newRow);

    // Formater
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, newRow.length)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // Invalider cache si DataManager disponible
    if (typeof DataManager !== 'undefined' && DataManager.invalidateCache) {
      try {
        DataManager.invalidateCache('Clients');
      } catch (e) {
        Compat_.log('WARN', 'Cannot invalidate cache: ' + e);
      }
    }

    // Audit log
    if (typeof AuditLog !== 'undefined' && AuditLog.log) {
      try {
        AuditLog.log(
          AuditLog.Actions.CREATE,
          AuditLog.Entities.CLIENT,
          numeroClient,
          `Client créé: ${nomSanitized}`
        );
      } catch (e) {
        Compat_.log('WARN', 'Cannot write audit: ' + e);
      }
    }

    Compat_.log('INFO', `✓ Client créé: ${numeroClient} - ${nomSanitized}`);

    return {
      success: true,
      numero: numeroClient,
      message: `Client ${numeroClient} créé avec succès !`
    };

  } catch (error) {
    Compat_.handleError(error, 'addClient');
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
 * Affiche le dialogue d'ajout de fournisseur
 */
function showAddFournisseurDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('FournisseurForm')
      .setWidth(600)
      .setHeight(750)
      .setTitle('Nouveau Fournisseur');

    SpreadsheetApp.getUi().showModalDialog(html, '➕ Nouveau Fournisseur - v3.0');
  } catch (error) {
    Compat_.handleError(error, 'showAddFournisseurDialog');
  }
}

/**
 * Ajoute un fournisseur v3.0
 * @param {Object} fournisseurData
 * @return {Object}
 */
function addFournisseur(fournisseurData) {
  try {
    // Validation
    if (!fournisseurData || !fournisseurData.nom || !fournisseurData.telephone) {
      return {
        success: false,
        error: 'Le nom et le téléphone sont obligatoires'
      };
    }

    if (!isValidPhone_(fournisseurData.telephone)) {
      return {
        success: false,
        error: 'Format de téléphone invalide'
      };
    }

    if (fournisseurData.email && !isValidEmail_(fournisseurData.email)) {
      return {
        success: false,
        error: 'Format d\'email invalide'
      };
    }

    // Sanitization
    const nomSanitized = sanitizeString_(fournisseurData.nom);
    const adresseSanitized = sanitizeString_(fournisseurData.adresse || '');
    const contactSanitized = sanitizeString_(fournisseurData.contact || '');

    // Obtenir feuille
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');
    if (!sheet) {
      throw new Error('Feuille Fournisseurs introuvable. Initialisez d\'abord le système.');
    }

    // Générer numéro
    const config = Compat_.getSafeConfig();
    const prefix = config.prefixes.fournisseur || CONTACTS_V3_CONFIG.PREFIXES.FOURNISSEUR;
    const numeroFournisseur = Compat_.getNextNumber(prefix, 'Fournisseurs');
    const dateCreation = Compat_.formatDate(new Date());

    // Préparer ligne
    const newRow = [
      numeroFournisseur,
      nomSanitized,
      fournisseurData.categorie || 'Autre',
      fournisseurData.telephone,
      fournisseurData.email || '',
      adresseSanitized,
      fournisseurData.ville || CONTACTS_V3_CONFIG.DEFAULTS.VILLE,
      contactSanitized,
      (fournisseurData.delai || CONTACTS_V3_CONFIG.DEFAULTS.DELAI_LIVRAISON) + ' jours',
      dateCreation,
      fournisseurData.statut || CONTACTS_V3_CONFIG.DEFAULTS.STATUT_FOURNISSEUR,
      fournisseurData.note || CONTACTS_V3_CONFIG.DEFAULTS.NOTE_FOURNISSEUR
    ];

    // Ajouter
    sheet.appendRow(newRow);

    // Formater
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, newRow.length)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // Invalider cache
    if (typeof DataManager !== 'undefined' && DataManager.invalidateCache) {
      try {
        DataManager.invalidateCache('Fournisseurs');
      } catch (e) {
        Compat_.log('WARN', 'Cannot invalidate cache: ' + e);
      }
    }

    // Audit
    if (typeof AuditLog !== 'undefined' && AuditLog.log) {
      try {
        AuditLog.log(
          AuditLog.Actions.CREATE,
          AuditLog.Entities.FOURNISSEUR,
          numeroFournisseur,
          `Fournisseur créé: ${nomSanitized}`
        );
      } catch (e) {
        Compat_.log('WARN', 'Cannot write audit: ' + e);
      }
    }

    Compat_.log('INFO', `✓ Fournisseur créé: ${numeroFournisseur} - ${nomSanitized}`);

    return {
      success: true,
      numero: numeroFournisseur,
      message: `Fournisseur ${numeroFournisseur} créé avec succès !`
    };

  } catch (error) {
    Compat_.handleError(error, 'addFournisseur');
    return {
      success: false,
      error: error.toString(),
      message: 'Erreur lors de la création du fournisseur'
    };
  }
}

// ============================================================================
// RECHERCHE ET STATISTIQUES
// ============================================================================

/**
 * Affiche le dialogue de recherche
 */
function showSearchContactDialog() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('SearchForm')
      .setWidth(700)
      .setHeight(600)
      .setTitle('Recherche de Contacts');

    SpreadsheetApp.getUi().showModalDialog(html, '🔍 Recherche de Contacts - v3.0');
  } catch (error) {
    Compat_.handleError(error, 'showSearchContactDialog');
  }
}

/**
 * Recherche un client v3.0
 * @param {string} searchTerm
 * @return {Array<Object>}
 */
function searchClient(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;

    // Utiliser DataManager si disponible
    if (typeof DataManager !== 'undefined' && DataManager.search) {
      try {
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
      } catch (e) {
        Compat_.log('WARN', 'DataManager.search failed, using fallback: ' + e);
      }
    }

    // Fallback: recherche manuelle
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet || sheet.getLastRow() <= 2) return [];

    const data = sheet.getDataRange().getValues();
    const searchLower = searchTerm.toLowerCase();
    const results = [];

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      const numero = String(row[cols.NUMERO] || '').toLowerCase();
      const nom = String(row[cols.NOM] || '').toLowerCase();
      const tel = String(row[cols.TELEPHONE] || '').toLowerCase();

      if (numero.includes(searchLower) ||
          nom.includes(searchLower) ||
          tel.includes(searchLower)) {
        results.push({
          numero: row[cols.NUMERO] || '',
          nom: row[cols.NOM] || '',
          type: row[cols.TYPE] || '',
          telephone: row[cols.TELEPHONE] || '',
          email: row[cols.EMAIL] || '',
          statut: row[cols.STATUT] || '',
          caTotal: row[cols.CA_TOTAL] || '0'
        });

        if (results.length >= CONTACTS_V3_CONFIG.MAX_SEARCH_RESULTS) break;
      }
    }

    return results;

  } catch (error) {
    Compat_.log('ERROR', 'searchClient: ' + error);
    return [];
  }
}

/**
 * Recherche un fournisseur v3.0
 * @param {string} searchTerm
 * @return {Array<Object>}
 */
function searchFournisseur(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const cols = CONTACTS_V3_CONFIG.FOURNISSEUR_COLS;

    // DataManager si disponible
    if (typeof DataManager !== 'undefined' && DataManager.search) {
      try {
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
      } catch (e) {
        Compat_.log('WARN', 'DataManager.search failed, using fallback: ' + e);
      }
    }

    // Fallback
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');
    if (!sheet || sheet.getLastRow() <= 2) return [];

    const data = sheet.getDataRange().getValues();
    const searchLower = searchTerm.toLowerCase();
    const results = [];

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      const numero = String(row[cols.NUMERO] || '').toLowerCase();
      const nom = String(row[cols.NOM] || '').toLowerCase();
      const tel = String(row[cols.TELEPHONE] || '').toLowerCase();

      if (numero.includes(searchLower) ||
          nom.includes(searchLower) ||
          tel.includes(searchLower)) {
        results.push({
          numero: row[cols.NUMERO] || '',
          nom: row[cols.NOM] || '',
          categorie: row[cols.CATEGORIE] || '',
          telephone: row[cols.TELEPHONE] || '',
          email: row[cols.EMAIL] || '',
          statut: row[cols.STATUT] || '',
          note: row[cols.NOTE] || '3'
        });

        if (results.length >= CONTACTS_V3_CONFIG.MAX_SEARCH_RESULTS) break;
      }
    }

    return results;

  } catch (error) {
    Compat_.log('ERROR', 'searchFournisseur: ' + error);
    return [];
  }
}

/**
 * Obtient les clients actifs v3.0
 * @return {Array<Object>}
 */
function getActiveClients() {
  try {
    // Utiliser DataManager avec cache si disponible
    if (typeof DataManager !== 'undefined' && DataManager.filter) {
      try {
        const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;
        const data = DataManager.filter('Clients', row =>
          row[cols.STATUT] === 'Actif' || row[cols.STATUT] === 'VIP'
        );

        return data.map(row => ({
          numero: row[cols.NUMERO] || '',
          nom: row[cols.NOM] || '',
          telephone: row[cols.TELEPHONE] || ''
        }));
      } catch (e) {
        Compat_.log('WARN', 'DataManager.filter failed, using fallback: ' + e);
      }
    }

    // Fallback
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet || sheet.getLastRow() <= 2) return [];

    const data = sheet.getDataRange().getValues();
    const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;
    const clients = [];

    for (let i = 2; i < data.length; i++) {
      const statut = data[i][cols.STATUT];
      if (statut === 'Actif' || statut === 'VIP') {
        clients.push({
          numero: data[i][cols.NUMERO] || '',
          nom: data[i][cols.NOM] || '',
          telephone: data[i][cols.TELEPHONE] || ''
        });
      }
    }

    return clients;

  } catch (error) {
    Compat_.log('ERROR', 'getActiveClients: ' + error);
    return [];
  }
}

/**
 * Met à jour le CA d'un client v3.0
 * @param {string} clientNom
 * @param {number} montant
 */
function updateClientRevenue(clientNom, montant) {
  try {
    if (!clientNom || montant === undefined) {
      Compat_.log('WARN', 'updateClientRevenue: paramètres invalides');
      return;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) {
      Compat_.log('ERROR', 'updateClientRevenue: feuille introuvable');
      return;
    }

    const data = sheet.getDataRange().getValues();
    const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;
    const config = Compat_.getSafeConfig();
    const devise = config.devise || CONTACTS_V3_CONFIG.DEFAULTS.DEVISE;

    for (let i = 2; i < data.length; i++) {
      if (data[i][cols.NOM] === clientNom) {
        const currentCAString = String(data[i][cols.CA_TOTAL] || '0');
        const currentCA = parseFloat(currentCAString.replace(/[^0-9.-]+/g, '')) || 0;
        const newCA = currentCA + montant;

        const rowNumber = i + 1;

        // Mise à jour batch
        sheet.getRange(rowNumber, cols.CA_TOTAL + 1).setValue(`${newCA} ${devise}`);
        sheet.getRange(rowNumber, cols.DERNIERE_ACTIVITE + 1).setValue(Compat_.formatDate(new Date()));

        // Invalider cache
        if (typeof DataManager !== 'undefined' && DataManager.invalidateCache) {
          try {
            DataManager.invalidateCache('Clients');
          } catch (e) {
            Compat_.log('WARN', 'Cannot invalidate cache: ' + e);
          }
        }

        Compat_.log('INFO', `CA mis à jour: ${clientNom} +${montant} ${devise}`);
        break;
      }
    }

  } catch (error) {
    Compat_.log('ERROR', `updateClientRevenue: ${error}`);
  }
}

/**
 * Affiche les statistiques contacts v3.0
 */
function showContactStats() {
  try {
    const sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    const sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');

    if (!sheet1 || !sheet2) {
      throw new Error('Feuilles Clients ou Fournisseurs introuvables');
    }

    const clientsData = sheet1.getLastRow() > 2 ? sheet1.getRange(3, 1, sheet1.getLastRow() - 2, 12).getValues() : [];
    const fournisseursData = sheet2.getLastRow() > 2 ? sheet2.getRange(3, 1, sheet2.getLastRow() - 2, 12).getValues() : [];

    const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;
    const fCols = CONTACTS_V3_CONFIG.FOURNISSEUR_COLS;

    // Stats clients
    const totalClients = clientsData.length;
    const clientsActifs = clientsData.filter(row => row[cols.STATUT] === 'Actif').length;
    const clientsVIP = clientsData.filter(row => row[cols.STATUT] === 'VIP').length;
    const clientsInactifs = clientsData.filter(row => row[cols.STATUT] === 'Inactif').length;
    const clientsSuspendus = clientsData.filter(row => row[cols.STATUT] === 'Suspendu').length;

    // CA total
    const caTotal = clientsData.reduce((sum, row) => {
      const ca = parseFloat(String(row[cols.CA_TOTAL] || '0').replace(/[^0-9.-]+/g, '')) || 0;
      return sum + ca;
    }, 0);

    // Stats fournisseurs
    const totalFournisseurs = fournisseursData.length;
    const fournisseursActifs = fournisseursData.filter(row => row[fCols.STATUT] === 'Actif').length;
    const fournisseursBloques = fournisseursData.filter(row => row[fCols.STATUT] === 'Bloqué').length;

    // Note moyenne fournisseurs
    const noteMoyenne = fournisseursData.length > 0
      ? fournisseursData.reduce((sum, row) => sum + (parseFloat(row[fCols.NOTE]) || 0), 0) / fournisseursData.length
      : 0;

    const config = Compat_.getSafeConfig();
    const devise = config.devise || CONTACTS_V3_CONFIG.DEFAULTS.DEVISE;
    const ui = SpreadsheetApp.getUi();

    const msg = `📊 STATISTIQUES CONTACTS v${CONTACTS_V3_CONFIG.VERSION}\n\n` +
                `👥 CLIENTS\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `Total: ${totalClients}\n` +
                `├─ Actifs: ${clientsActifs}\n` +
                `├─ VIP: ${clientsVIP} ⭐\n` +
                `├─ Inactifs: ${clientsInactifs}\n` +
                `└─ Suspendus: ${clientsSuspendus}\n` +
                `\n💰 CA Total: ${caTotal.toLocaleString('fr-FR', {minimumFractionDigits: 0, maximumFractionDigits: 2})} ${devise}\n\n` +
                `🏪 FOURNISSEURS\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `Total: ${totalFournisseurs}\n` +
                `├─ Actifs: ${fournisseursActifs}\n` +
                `├─ Inactifs: ${totalFournisseurs - fournisseursActifs - fournisseursBloques}\n` +
                `└─ Bloqués: ${fournisseursBloques}\n` +
                `\n⭐ Note moyenne: ${noteMoyenne.toFixed(2)}/5`;

    ui.alert('📊 Statistiques Contacts', msg, ui.ButtonSet.OK);

  } catch (error) {
    Compat_.handleError(error, 'showContactStats');
  }
}

// ============================================================================
// FEUILLES SYSTÈME
// ============================================================================

/**
 * Crée la feuille d'audit v3.0
 */
function createAuditSheet() {
  const sheet = Compat_.getOrCreateSheet('_Audit');
  const config = Compat_.getSafeConfig();

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
      .setBackground(config.colors.header || CONTACTS_V3_CONFIG.COLORS.HEADER)
      .setFontColor(config.colors.headerText || CONTACTS_V3_CONFIG.COLORS.HEADER_TEXT)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.setFrozenRows(1);
    setupColumnWidths_(sheet, [180, 200, 120, 100, 120, 300]);
  }

  try {
    sheet.hideSheet();
  } catch (e) {
    Compat_.log('WARN', 'Cannot hide sheet: ' + e);
  }

  Compat_.log('INFO', 'Feuille Audit v3.0 créée');
  return sheet;
}

/**
 * Crée la feuille de notifications v3.0
 */
function createNotificationsSheet() {
  const sheet = Compat_.getOrCreateSheet('_Notifications');
  const config = Compat_.getSafeConfig();

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
      .setBackground(config.colors.header || CONTACTS_V3_CONFIG.COLORS.HEADER)
      .setFontColor(config.colors.headerText || CONTACTS_V3_CONFIG.COLORS.HEADER_TEXT)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.setFrozenRows(1);
    setupColumnWidths_(sheet, [180, 100, 200, 300, 100, 150]);
  }

  try {
    sheet.hideSheet();
  } catch (e) {
    Compat_.log('WARN', 'Cannot hide sheet: ' + e);
  }

  Compat_.log('INFO', 'Feuille Notifications v3.0 créée');
  return sheet;
}

// ============================================================================
// INFORMATIONS VERSION
// ============================================================================

/**
 * Affiche les informations de version
 */
function showContactsVersion() {
  const ui = SpreadsheetApp.getUi();
  const hasCore = Compat_.isERPAvailable();

  const msg = `📦 Module Contacts\n` +
              `Version: ${CONTACTS_V3_CONFIG.VERSION}\n\n` +
              `🔧 Configuration:\n` +
              `├─ Core.gs: ${hasCore ? '✅ Détecté' : '❌ Non détecté'}\n` +
              `├─ Mode: ${hasCore ? 'Complet' : 'Autonome'}\n` +
              `└─ Fallbacks: ✅ Actifs\n\n` +
              `📋 Fonctionnalités:\n` +
              `├─ Gestion clients: ✅\n` +
              `├─ Gestion fournisseurs: ✅\n` +
              `├─ Recherche: ✅\n` +
              `├─ Statistiques: ✅\n` +
              `├─ Validation: ✅\n` +
              `└─ Auto-réparation: ✅\n\n` +
              `💡 Architecture v3.0:\n` +
              `- Système de compatibilité intégré\n` +
              `- Fonctionnement autonome garanti\n` +
              `- Fallbacks automatiques\n` +
              `- Gestion d'erreurs de niveau enterprise`;

  ui.alert('ℹ️ Informations Module Contacts', msg, ui.ButtonSet.OK);
}
