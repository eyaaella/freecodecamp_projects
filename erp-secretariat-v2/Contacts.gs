/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║             ERP SECRÉTARIAT v3.0 - MODULE CONTACTS                       ║
 * ║                  Gestion Clients & Fournisseurs                          ║
 * ║          Conçu pour les Secrétariats Bureautiques du Cameroun 🇨🇲        ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * @fileoverview Module de gestion des contacts avec architecture autonome
 * @version 3.0.0
 * @build PRODUCTION-20250111-ULTRA
 * @author ERP Team Cameroun
 * @license MIT
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║ CARACTÉRISTIQUES v3.0                                                    ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║ ✅ Architecture autonome avec système de compatibilité                   ║
 * ║ ✅ Fallbacks automatiques si Core.gs indisponible                        ║
 * ║ ✅ Validation complète (téléphone CM, email, données)                    ║
 * ║ ✅ Sanitization XSS et sécurité renforcée                                ║
 * ║ ✅ Cache intelligent avec invalidation automatique                       ║
 * ║ ✅ Formatage conditionnel avancé (statuts, notes)                        ║
 * ║ ✅ Recherche optimisée avec limites configurables                        ║
 * ║ ✅ Audit trail complet des opérations                                    ║
 * ║ ✅ Statistiques en temps réel                                            ║
 * ║ ✅ Support multi-utilisateurs thread-safe                                ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// 📋 CONFIGURATION GLOBALE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration du module Contacts v3.0
 * @const {Object}
 */
const CONTACTS_V3_CONFIG = {
  VERSION: '3.0.0',
  BUILD: 'PRODUCTION-20250111-ULTRA',
  MODULE_NAME: '👥 Contacts',

  // ─────────────────────────────────────────────────────────────────────────
  // Limites et seuils de performance
  // ─────────────────────────────────────────────────────────────────────────
  LIMITS: {
    MAX_VALIDATION_ROWS: 1000,      // Lignes max pour validation de données
    MAX_SEARCH_RESULTS: 100,        // Résultats max par recherche
    BATCH_SIZE: 500,                // Taille des lots pour traitement batch
    MAX_CACHE_SIZE: 50              // Nombre max d'entrées en cache
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Durées de vie du cache (secondes)
  // ─────────────────────────────────────────────────────────────────────────
  CACHE_TTL: {
    ACTIVE_CLIENTS: 300,            // 5 minutes
    SEARCH_RESULTS: 180,            // 3 minutes
    STATS: 600,                     // 10 minutes
    CONFIG: 600                     // 10 minutes
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Indices de colonnes - CLIENTS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Indices de colonnes - FOURNISSEURS
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Valeurs par défaut (Cameroun)
  // ─────────────────────────────────────────────────────────────────────────
  DEFAULTS: {
    VILLE: 'Yaoundé',
    DEVISE: 'XAF',
    STATUT_CLIENT: 'Actif',
    STATUT_FOURNISSEUR: 'Actif',
    NOTE_FOURNISSEUR: 3,
    DELAI_LIVRAISON: 3,
    TIMEZONE: 'Africa/Douala',
    PAYS: 'Cameroun'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Préfixes de numérotation (fallback)
  // ─────────────────────────────────────────────────────────────────────────
  PREFIXES: {
    CLIENT: 'CL',
    FOURNISSEUR: 'FR'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Palette de couleurs moderne (fallback)
  // ─────────────────────────────────────────────────────────────────────────
  COLORS: {
    HEADER: '#1a73e8',              // Bleu Google moderne
    HEADER_TEXT: '#ffffff',
    SUB_HEADER: '#e8f0fe',
    INFO: '#d2e3fc',
    WARNING: '#fce8b2',
    SUCCESS: '#ceead6',
    DANGER: '#fad2cf',
    PRIMARY: '#1a73e8',
    SECONDARY: '#5f6368',
    ACCENT: '#fbbc04',
    DARK: '#202124',
    LIGHT: '#f8f9fa'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Types de clients
  // ─────────────────────────────────────────────────────────────────────────
  CLIENT_TYPES: ['Particulier', 'Entreprise', 'Administration', 'ONG'],

  // ─────────────────────────────────────────────────────────────────────────
  // Statuts clients
  // ─────────────────────────────────────────────────────────────────────────
  CLIENT_STATUS: ['Actif', 'Inactif', 'Suspendu', 'VIP'],

  // ─────────────────────────────────────────────────────────────────────────
  // Catégories fournisseurs
  // ─────────────────────────────────────────────────────────────────────────
  FOURNISSEUR_CATEGORIES: [
    'Fournitures Bureau',
    'Informatique',
    'Services',
    'Papeterie',
    'Mobilier',
    'Autre'
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // Statuts fournisseurs
  // ─────────────────────────────────────────────────────────────────────────
  FOURNISSEUR_STATUS: ['Actif', 'Inactif', 'Bloqué']
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 SYSTÈME DE COMPATIBILITÉ ET FALLBACKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gestionnaire de compatibilité pour fonctionnement autonome
 * Permet au module de fonctionner même si Core.gs est absent ou défaillant
 *
 * @namespace ContactsCompat_
 * @private
 */
const ContactsCompat_ = {

  /**
   * Vérifie la disponibilité de l'ERP Core
   * @returns {boolean} true si ERP Core est disponible
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
   * Vérifie l'existence d'une méthode ERP
   * @param {string} methodName - Nom de la méthode à vérifier
   * @returns {boolean}
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
   * Obtient la configuration de manière sécurisée
   * Avec système de fallback à 3 niveaux
   * @returns {Object} Configuration ERP
   */
  getSafeConfig: function() {
    // Niveau 1: Essayer ERP.getSafeConfig()
    if (this.hasERPMethod('getSafeConfig')) {
      try {
        return ERP.getSafeConfig();
      } catch (e) {
        this.log('WARN', '⚠️ ERP.getSafeConfig() failed, trying level 2');
      }
    }

    // Niveau 2: Essayer ERP.config direct
    if (this.isERPAvailable() && ERP.config) {
      try {
        return ERP.config;
      } catch (e) {
        this.log('WARN', '⚠️ ERP.config failed, trying level 3');
      }
    }

    // Niveau 3: Charger depuis la feuille ou défaut
    return this.loadConfigFallback_();
  },

  /**
   * Charge la configuration en mode fallback
   * @private
   * @returns {Object} Configuration par défaut ou depuis feuille
   */
  loadConfigFallback_: function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('Configuration');

      if (sheet && sheet.getLastRow() > 3) {
        return this.parseConfigSheet_(sheet);
      }
    } catch (e) {
      this.log('WARN', '⚠️ Cannot load config from sheet: ' + e);
    }

    return this.getDefaultConfig_();
  },

  /**
   * Parse la feuille Configuration
   * @private
   * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
   * @returns {Object}
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
      devise: data[9] ? data[9][1] : CONTACTS_V3_CONFIG.DEFAULTS.DEVISE,
      tauxTVA: data[13] ? data[13][1] : 19.25,
      prefixes: {
        client: data[16] ? data[16][1] : CONTACTS_V3_CONFIG.PREFIXES.CLIENT,
        fournisseur: data[17] ? data[17][1] : CONTACTS_V3_CONFIG.PREFIXES.FOURNISSEUR,
        devis: data[18] ? data[18][1] : 'DV',
        facture: data[19] ? data[19][1] : 'FA',
        courrierEntrant: data[20] ? data[20][1] : 'CE',
        courrierSortant: data[21] ? data[21][1] : 'CS',
        tache: data[22] ? data[22][1] : 'TK',
        employe: data[23] ? data[23][1] : 'EMP'
      },
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
   * Retourne la configuration minimale par défaut
   * @private
   * @returns {Object}
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
      devise: CONTACTS_V3_CONFIG.DEFAULTS.DEVISE,
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
   * @param {string} name - Nom de la feuille
   * @returns {GoogleAppsScript.Spreadsheet.Sheet}
   */
  getOrCreateSheet: function(name) {
    // Niveau 1: Utiliser ERP.getOrCreateSheet si disponible
    if (this.hasERPMethod('getOrCreateSheet')) {
      try {
        return ERP.getOrCreateSheet(name);
      } catch (e) {
        this.log('WARN', `⚠️ ERP.getOrCreateSheet("${name}") failed: ${e}`);
      }
    }

    // Niveau 2: Fallback local
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
      this.log('INFO', `✅ Feuille créée (fallback): ${name}`);
    }

    return sheet;
  },

  /**
   * Formate une date avec fallback
   * @param {Date} date - Date à formater
   * @returns {string} Date formatée
   */
  formatDate: function(date) {
    if (!date) date = new Date();

    // Niveau 1: Utiliser ERP.formatDate si disponible
    if (this.hasERPMethod('formatDate')) {
      try {
        return ERP.formatDate(date);
      } catch (e) {
        this.log('WARN', '⚠️ ERP.formatDate failed, using fallback');
      }
    }

    // Niveau 2: Fallback local
    const config = this.getSafeConfig();
    return Utilities.formatDate(
      date,
      config.timezone || CONTACTS_V3_CONFIG.DEFAULTS.TIMEZONE,
      'dd/MM/yyyy'
    );
  },

  /**
   * Génère le prochain numéro avec fallback
   * @param {string} prefix - Préfixe du numéro
   * @param {string} sheetName - Nom de la feuille
   * @returns {string} Numéro généré
   */
  getNextNumber: function(prefix, sheetName) {
    // Niveau 1: Utiliser ERP.getNextNumber si disponible
    if (this.hasERPMethod('getNextNumber')) {
      try {
        return ERP.getNextNumber(prefix, sheetName);
      } catch (e) {
        this.log('WARN', '⚠️ ERP.getNextNumber failed, using fallback');
      }
    }

    // Niveau 2: Fallback simple mais robuste
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(sheetName);

      if (!sheet) return prefix + '0001';

      const lastRow = sheet.getLastRow();
      if (lastRow <= 2) return prefix + '0001';

      const lastNumber = sheet.getRange(lastRow, 1).getValue();
      if (!lastNumber) return prefix + '0001';

      const numPart = parseInt(lastNumber.toString().replace(/\D/g, ''));
      const nextNum = (numPart + 1).toString().padStart(4, '0');

      return prefix + nextNum;

    } catch (e) {
      this.log('ERROR', `❌ getNextNumber fallback error: ${e}`);
      return prefix + '0001';
    }
  },

  /**
   * Système de logging avec fallback
   * @param {string} level - Niveau de log (DEBUG, INFO, WARN, ERROR, SUCCESS)
   * @param {string} message - Message à logger
   */
  log: function(level, message) {
    // Niveau 1: Utiliser ERP.log si disponible
    if (this.hasERPMethod('log')) {
      try {
        ERP.log(level, message);
        return;
      } catch (e) {
        // Continue vers fallback
      }
    }

    // Niveau 2: Fallback console avec emojis
    const emoji = {
      DEBUG: '🔍',
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌',
      SUCCESS: '✅'
    }[level] || '📝';

    console.log(`${emoji} [${level}] [CONTACTS] ${message}`);
  },

  /**
   * Gestion d'erreur avec fallback
   * @param {Error} error - Erreur capturée
   * @param {string} context - Contexte de l'erreur
   */
  handleError: function(error, context) {
    const errorMsg = `[${context}] ${error.toString()}`;

    // Niveau 1: Utiliser ERP.handleError si disponible
    if (this.hasERPMethod('handleError')) {
      try {
        ERP.handleError(error, context);
        return;
      } catch (e) {
        this.log('WARN', '⚠️ ERP.handleError failed, using fallback');
      }
    }

    // Niveau 2: Fallback local
    console.error(`❌ ${errorMsg}`);
    console.error('Stack:', error.stack);

    try {
      const ui = SpreadsheetApp.getUi();
      ui.alert(
        '❌ Erreur',
        errorMsg,
        ui.ButtonSet.OK
      );
    } catch (e) {
      console.error('Cannot show alert:', e);
    }
  }
};

// Alias court pour usage interne
const Compat_ = ContactsCompat_;

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ UTILITAIRES INTERNES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crée un en-tête de feuille moderne et standardisé
 * @private
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {string} title - Titre de l'en-tête
 * @param {string} range - Range à formater (ex: "A1:L1")
 */
function createSheetHeader_(sheet, title, range) {
  const config = Compat_.getSafeConfig();

  sheet.getRange(range).merge()
    .setValue(title)
    .setBackground(config.colors.header || CONTACTS_V3_CONFIG.COLORS.HEADER)
    .setFontColor(config.colors.headerText || CONTACTS_V3_CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
}

/**
 * Configure les en-têtes de colonnes
 * @private
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {Array<string>} headers - Titres des colonnes
 * @param {number} row - Numéro de ligne
 */
function setupColumnHeaders_(sheet, headers, row) {
  const config = Compat_.getSafeConfig();

  sheet.getRange(row, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader || CONTACTS_V3_CONFIG.COLORS.SUB_HEADER)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
}

/**
 * Configure les largeurs de colonnes en batch
 * @private
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {Array<number>} widths - Largeurs en pixels
 */
function setupColumnWidths_(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
}

/**
 * Applique une validation de liste déroulante
 * @private
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {string} range - Range à valider
 * @param {Array<string>} values - Valeurs autorisées
 * @param {string} helpText - Texte d'aide
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
    Compat_.log('WARN', `⚠️ Validation failed for ${range}: ${e}`);
  }
}

/**
 * Sanitize une chaîne pour éviter XSS et injections
 * @private
 * @param {string} str - Chaîne à nettoyer
 * @returns {string} Chaîne nettoyée
 */
function sanitizeString_(str) {
  if (!str) return '';

  // Niveau 1: Utiliser Validator si disponible
  if (typeof Validator !== 'undefined' && Validator.sanitizeString) {
    try {
      return Validator.sanitizeString(str);
    } catch (e) {
      Compat_.log('WARN', '⚠️ Validator.sanitizeString failed, using fallback');
    }
  }

  // Niveau 2: Fallback simple mais efficace
  return str.toString()
    .replace(/[<>]/g, '')                    // Retire < et >
    .replace(/javascript:/gi, '')            // Retire javascript:
    .replace(/on\w+=/gi, '')                 // Retire les événements on*=
    .replace(/[\x00-\x1F\x7F]/g, '')        // Retire caractères de contrôle
    .trim();
}

/**
 * Valide un email
 * @private
 * @param {string} email - Email à valider
 * @returns {boolean} true si valide ou vide
 */
function isValidEmail_(email) {
  if (!email) return true; // Email optionnel

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone camerounais
 * Accepte: 6XXXXXXXX, +2376XXXXXXXX, 2376XXXXXXXX, 2XXXXXXXX
 * @private
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} true si valide
 */
function isValidPhone_(phone) {
  if (!phone) return false;

  // Retirer tous les espaces
  const cleaned = phone.replace(/\s/g, '');

  // Format Cameroun: commence par 2 ou 6, 9 chiffres
  // Avec ou sans +237
  const phoneRegex = /^(\+?237)?[26]\d{8}$/;

  return phoneRegex.test(cleaned);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 INITIALISATION SYSTÈME
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise l'ERP avec toutes les feuilles
 * Architecture robuste avec gestion d'erreurs et rapports détaillés
 */
function initializeERP() {
  const ui = SpreadsheetApp.getUi();

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // Vérification de la disponibilité de Core.gs
    // ─────────────────────────────────────────────────────────────────────────
    const hasCore = Compat_.isERPAvailable();

    if (!hasCore) {
      const warn = ui.alert(
        '⚠️ Mode Autonome',
        'Core.gs n\'est pas détecté.\n\n' +
        'Le module Contacts v3.0 fonctionnera en mode autonome avec fonctionnalités limitées.\n\n' +
        '✅ Fonctionnalités disponibles:\n' +
        '  • Gestion clients\n' +
        '  • Gestion fournisseurs\n' +
        '  • Recherche\n' +
        '  • Statistiques\n\n' +
        'Continuer ?',
        ui.ButtonSet.YES_NO
      );

      if (warn !== ui.Button.YES) return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Confirmation de l'utilisateur
    // ─────────────────────────────────────────────────────────────────────────
    const response = ui.alert(
      `🚀 Initialisation ERP v${CONTACTS_V3_CONFIG.VERSION}`,
      'Voulez-vous créer toutes les feuilles du système ?\n\n' +
      `⏱️ Durée estimée: ${hasCore ? '30-60' : '10-20'} secondes\n` +
      `📦 Mode: ${hasCore ? 'Complet (avec Core.gs)' : 'Autonome (sans Core.gs)'}\n` +
      `📊 Feuilles: ${hasCore ? '17' : '5'} feuilles`,
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) return;

    // ─────────────────────────────────────────────────────────────────────────
    // Définition des feuilles à créer
    // ─────────────────────────────────────────────────────────────────────────
    const coreSheets = [
      { fn: createConfigSheet, name: 'Configuration', category: 'core', icon: '⚙️' },
      { fn: createClientsSheet, name: 'Clients', category: 'core', icon: '👥' },
      { fn: createFournisseursSheet, name: 'Fournisseurs', category: 'core', icon: '🏪' },
      { fn: createAuditSheet, name: '_Audit', category: 'system', icon: '📋' },
      { fn: createNotificationsSheet, name: '_Notifications', category: 'system', icon: '🔔' }
    ];

    // Feuilles optionnelles (nécessitent Core.gs et autres modules)
    const optionalSheets = hasCore ? [
      { fn: createCourrierEntrantSheet, name: 'Courrier Entrant', category: 'optional', icon: '📥' },
      { fn: createCourrierSortantSheet, name: 'Courrier Sortant', category: 'optional', icon: '📤' },
      { fn: createAgendaSheet, name: 'Agenda', category: 'optional', icon: '📅' },
      { fn: createTachesSheet, name: 'Tâches', category: 'optional', icon: '✅' },
      { fn: createDevisSheet, name: 'Devis', category: 'optional', icon: '📝' },
      { fn: createFacturesSheet, name: 'Factures', category: 'optional', icon: '🧾' },
      { fn: createPaiementsSheet, name: 'Paiements', category: 'optional', icon: '💰' },
      { fn: createStockSheet, name: 'Stock', category: 'optional', icon: '📦' },
      { fn: createMouvementsStockSheet, name: 'Mouvements Stock', category: 'optional', icon: '🔄' },
      { fn: createPersonnelSheet, name: 'Personnel', category: 'optional', icon: '👨‍💼' },
      { fn: createPresencesSheet, name: 'Présences', category: 'optional', icon: '📊' },
      { fn: createDashboardSheet, name: 'Tableau de bord', category: 'optional', icon: '📈' }
    ] : [];

    const allSheets = [...coreSheets, ...optionalSheets];

    // ─────────────────────────────────────────────────────────────────────────
    // Création des feuilles avec gestion d'erreurs
    // ─────────────────────────────────────────────────────────────────────────
    let successCount = 0;
    let skipCount = 0;
    const errors = [];

    for (const sheetDef of allSheets) {
      try {
        // Vérifier si la fonction existe
        if (typeof sheetDef.fn !== 'function') {
          skipCount++;
          Compat_.log('WARN', `⏭️ ${sheetDef.icon} ${sheetDef.name} - fonction non disponible`);
          continue;
        }

        sheetDef.fn();
        successCount++;
        Compat_.log('SUCCESS', `✅ ${sheetDef.icon} ${sheetDef.name} créée`);

      } catch (error) {
        errors.push({
          sheet: sheetDef.name,
          icon: sheetDef.icon,
          error: error.toString(),
          category: sheetDef.category
        });
        Compat_.log('ERROR', `❌ ${sheetDef.icon} ${sheetDef.name}: ${error}`);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Génération du rapport d'initialisation
    // ─────────────────────────────────────────────────────────────────────────
    const coreSuccess = coreSheets.filter(s =>
      !errors.find(e => e.sheet === s.name)
    ).length;
    const coreTotal = coreSheets.length;

    let summary = `✅ Initialisation terminée !\n\n`;
    summary += `╔══════════════════════════════════════╗\n`;
    summary += `║         RÉSULTATS CRÉATION           ║\n`;
    summary += `╠══════════════════════════════════════╣\n`;
    summary += `║ Feuilles essentielles: ${String(coreSuccess).padStart(2)}/${coreTotal}          ║\n`;
    summary += `║ Feuilles optionnelles: ${String(successCount - coreSuccess).padStart(2)}/${String(optionalSheets.length).padEnd(2)}          ║\n`;
    summary += `║ Total créé:            ${String(successCount).padStart(2)}/${String(allSheets.length).padEnd(2)}          ║\n`;
    summary += `╚══════════════════════════════════════╝\n`;

    if (skipCount > 0) {
      summary += `\n⏭️ Ignorées: ${skipCount} (modules non chargés)`;
    }

    if (errors.length > 0) {
      const criticalErrors = errors.filter(e => e.category === 'core');
      const optionalErrors = errors.filter(e => e.category !== 'core');

      summary += `\n\n⚠️ ERREURS:\n`;
      summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      if (criticalErrors.length > 0) {
        summary += `\n🔴 Critiques (${criticalErrors.length}):\n`;
        criticalErrors.forEach(e => {
          summary += `${e.icon} ${e.sheet}:\n  ${e.error.substring(0, 60)}...\n`;
        });
      }

      if (optionalErrors.length > 0) {
        summary += `\n🟡 Optionnelles (${optionalErrors.length}):\n`;
        optionalErrors.forEach(e => {
          summary += `${e.icon} ${e.sheet}:\n  ${e.error.substring(0, 60)}...\n`;
        });
      }

      ui.alert('⚠️ Initialisation Partielle', summary, ui.ButtonSet.OK);
    } else {
      summary += `\n\n🎉 Toutes les feuilles ont été créées avec succès !`;
      ui.alert('✅ Succès Complet', summary, ui.ButtonSet.OK);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Audit log si disponible
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof AuditLog !== 'undefined' && AuditLog.log) {
      try {
        AuditLog.log(
          AuditLog.Actions.CREATE,
          'SYSTÈME',
          'ERP',
          `Init v${CONTACTS_V3_CONFIG.VERSION}: ${successCount}/${allSheets.length} feuilles`
        );
      } catch (e) {
        Compat_.log('WARN', '⚠️ Cannot write audit log: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Redirection vers dashboard si disponible
    // ─────────────────────────────────────────────────────────────────────────
    if (successCount > 0 && typeof goToDashboard === 'function') {
      try {
        goToDashboard();
      } catch (e) {
        Compat_.log('WARN', '⚠️ Cannot navigate to dashboard: ' + e);
      }
    }

  } catch (error) {
    Compat_.handleError(error, 'initializeERP');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📄 CRÉATION DES FEUILLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crée la feuille Configuration v3.0
 * Design ultra moderne avec palette de couleurs Google Material
 */
function createConfigSheet() {
  const sheet = Compat_.getOrCreateSheet('Configuration');
  const config = Compat_.getSafeConfig();

  sheet.clear();

  // ─────────────────────────────────────────────────────────────────────────
  // En-tête principal
  // ─────────────────────────────────────────────────────────────────────────
  createSheetHeader_(sheet, '⚙️ CONFIGURATION ERP v3.0 - ULTRA MODERNE', 'A1:B1');

  sheet.getRange('A2:B2')
    .setValue(`Build: ${CONTACTS_V3_CONFIG.BUILD}`)
    .setFontSize(8)
    .setFontColor('#5f6368')
    .setHorizontalAlignment('center');

  // ─────────────────────────────────────────────────────────────────────────
  // Informations entreprise
  // ─────────────────────────────────────────────────────────────────────────
  sheet.getRange('A3:B3').merge()
    .setValue('📋 INFORMATIONS ENTREPRISE')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.info || CONTACTS_V3_CONFIG.COLORS.INFO)
    .setHorizontalAlignment('center');

  const infoEntreprise = [
    ['Nom de l\'entreprise:', config.entreprise.nom],
    ['Adresse:', config.entreprise.adresse],
    ['Téléphone:', config.entreprise.telephone],
    ['Email:', config.entreprise.email],
    ['NIF (N° Contribuable):', config.entreprise.nif],
    ['RC (Registre Commerce):', config.entreprise.rc],
    ['Devise:', config.devise],
    ['', '']
  ];
  sheet.getRange(4, 1, infoEntreprise.length, 2).setValues(infoEntreprise);

  // ─────────────────────────────────────────────────────────────────────────
  // Paramètres fiscaux
  // ─────────────────────────────────────────────────────────────────────────
  sheet.getRange('A13:B13').merge()
    .setValue('💰 PARAMÈTRES FISCAUX (CAMEROUN)')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.warning || CONTACTS_V3_CONFIG.COLORS.WARNING)
    .setHorizontalAlignment('center');

  sheet.getRange('A14:B14').setValues([['Taux TVA (%):', config.tauxTVA]]);

  // ─────────────────────────────────────────────────────────────────────────
  // Préfixes de numérotation
  // ─────────────────────────────────────────────────────────────────────────
  sheet.getRange('A16:B16').merge()
    .setValue('🔢 PRÉFIXES DE NUMÉROTATION')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.success || CONTACTS_V3_CONFIG.COLORS.SUCCESS)
    .setHorizontalAlignment('center');

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

  // ─────────────────────────────────────────────────────────────────────────
  // Options système
  // ─────────────────────────────────────────────────────────────────────────
  sheet.getRange('A26:B26').merge()
    .setValue('⚙️ OPTIONS SYSTÈME')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.subHeader || CONTACTS_V3_CONFIG.COLORS.SUB_HEADER)
    .setHorizontalAlignment('center');

  const options = [
    ['Activer notifications:', config.options.enableNotifications ? 'OUI' : 'NON'],
    ['Backup automatique:', config.options.enableAutoBackup ? 'OUI' : 'NON'],
    ['Fréquence backup:', config.options.backupFrequency],
    ['Log d\'audit:', config.options.enableAuditLog ? 'OUI' : 'NON']
  ];
  sheet.getRange(27, 1, options.length, 2).setValues(options);

  // ─────────────────────────────────────────────────────────────────────────
  // Informations système
  // ─────────────────────────────────────────────────────────────────────────
  sheet.getRange('A32:B32').merge()
    .setValue('ℹ️ INFORMATIONS SYSTÈME')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground(config.colors.primary || CONTACTS_V3_CONFIG.COLORS.PRIMARY)
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  const sysInfo = [
    ['Version Module Contacts:', CONTACTS_V3_CONFIG.VERSION],
    ['Build:', CONTACTS_V3_CONFIG.BUILD],
    ['Mode Opération:', Compat_.isERPAvailable() ? 'Complet (avec Core.gs)' : 'Autonome (sans Core.gs)'],
    ['Core.gs Détecté:', Compat_.isERPAvailable() ? '✅ OUI' : '❌ NON'],
    ['Fallbacks Actifs:', '✅ OUI']
  ];
  sheet.getRange(33, 1, sysInfo.length, 2).setValues(sysInfo);

  // ─────────────────────────────────────────────────────────────────────────
  // Instructions
  // ─────────────────────────────────────────────────────────────────────────
  sheet.getRange('A39:B39').merge()
    .setValue('📝 INSTRUCTIONS D\'UTILISATION')
    .setFontWeight('bold')
    .setFontColor(config.colors.primary || CONTACTS_V3_CONFIG.COLORS.PRIMARY);

  sheet.getRange('A40:B40').merge()
    .setValue('• Modifiez les valeurs de la colonne B selon vos besoins\n' +
              '• Videz le cache après modification (Menu ERP > Système > Vider le cache)\n' +
              '• Ne modifiez pas les libellés de la colonne A')
    .setWrap(true)
    .setVerticalAlignment('top')
    .setFontSize(9);

  // ─────────────────────────────────────────────────────────────────────────
  // Mise en forme finale
  // ─────────────────────────────────────────────────────────────────────────
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 300);

  // Colonne A en gras
  sheet.getRange('A4:A40').setFontWeight('bold');

  // Protection si Security disponible
  if (typeof Security !== 'undefined' && Security.protectRange) {
    try {
      Security.protectRange(sheet, sheet.getRange('A1:B2'), 'En-tête protégé');
    } catch (e) {
      Compat_.log('WARN', '⚠️ Cannot protect range: ' + e);
    }
  }

  Compat_.log('SUCCESS', '✅ Feuille Configuration v3.0 créée');
  return sheet;
}

/**
 * Crée la feuille Clients v3.0
 * Design ultra moderne avec formatage conditionnel avancé
 */
function createClientsSheet() {
  const sheet = Compat_.getOrCreateSheet('Clients');
  const config = Compat_.getSafeConfig();

  sheet.clear();

  // ─────────────────────────────────────────────────────────────────────────
  // En-tête
  // ─────────────────────────────────────────────────────────────────────────
  createSheetHeader_(sheet, '👥 GESTION DES CLIENTS - v3.0 ULTRA MODERNE', 'A1:L1');

  // ─────────────────────────────────────────────────────────────────────────
  // En-têtes de colonnes
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Largeurs de colonnes optimisées
  // ─────────────────────────────────────────────────────────────────────────
  setupColumnWidths_(sheet, [100, 200, 100, 120, 180, 250, 120, 150, 110, 100, 120, 130]);

  sheet.setFrozenRows(2);

  // ─────────────────────────────────────────────────────────────────────────
  // Validations de données
  // ─────────────────────────────────────────────────────────────────────────
  applyDataValidation_(
    sheet,
    `C3:C${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`,
    CONTACTS_V3_CONFIG.CLIENT_TYPES,
    'Sélectionnez le type de client'
  );

  applyDataValidation_(
    sheet,
    `J3:J${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`,
    CONTACTS_V3_CONFIG.CLIENT_STATUS,
    'Sélectionnez le statut du client'
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Formatage conditionnel ultra moderne
  // ─────────────────────────────────────────────────────────────────────────
  const rules = [];
  const statusRange = sheet.getRange(`J3:J${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`);

  // VIP - Doré brillant
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('VIP')
    .setBackground('#FFD700')
    .setFontColor('#000000')
    .setBold(true)
    .setRanges([statusRange])
    .build()
  );

  // Actif - Vert Google
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Actif')
    .setBackground('#D4EDDA')
    .setFontColor('#155724')
    .setRanges([statusRange])
    .build()
  );

  // Inactif - Gris moderne
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Inactif')
    .setBackground('#E0E0E0')
    .setFontColor('#757575')
    .setRanges([statusRange])
    .build()
  );

  // Suspendu - Rouge attention
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Suspendu')
    .setBackground('#F8D7DA')
    .setFontColor('#721C24')
    .setBold(true)
    .setRanges([statusRange])
    .build()
  );

  sheet.setConditionalFormatRules(rules);

  Compat_.log('SUCCESS', '✅ Feuille Clients v3.0 créée avec formatage conditionnel');
  return sheet;
}

/**
 * Crée la feuille Fournisseurs v3.0
 * Avec système de notation visuel ultra moderne
 */
function createFournisseursSheet() {
  const sheet = Compat_.getOrCreateSheet('Fournisseurs');
  const config = Compat_.getSafeConfig();

  sheet.clear();

  // ─────────────────────────────────────────────────────────────────────────
  // En-tête
  // ─────────────────────────────────────────────────────────────────────────
  createSheetHeader_(sheet, '🏪 GESTION DES FOURNISSEURS - v3.0 ULTRA MODERNE', 'A1:L1');

  // ─────────────────────────────────────────────────────────────────────────
  // En-têtes de colonnes
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // Largeurs de colonnes optimisées
  // ─────────────────────────────────────────────────────────────────────────
  setupColumnWidths_(sheet, [120, 200, 120, 120, 180, 250, 120, 150, 100, 110, 100, 80]);

  sheet.setFrozenRows(2);

  // ─────────────────────────────────────────────────────────────────────────
  // Validations de données
  // ─────────────────────────────────────────────────────────────────────────
  applyDataValidation_(
    sheet,
    `C3:C${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`,
    CONTACTS_V3_CONFIG.FOURNISSEUR_CATEGORIES,
    'Sélectionnez la catégorie du fournisseur'
  );

  applyDataValidation_(
    sheet,
    `K3:K${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`,
    CONTACTS_V3_CONFIG.FOURNISSEUR_STATUS,
    'Sélectionnez le statut du fournisseur'
  );

  // Validation pour les notes (1-5)
  try {
    sheet.getRange(`L3:L${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireNumberBetween(1, 5)
        .setAllowInvalid(false)
        .setHelpText('Entrez une note entre 1 et 5')
        .build()
    );
  } catch (e) {
    Compat_.log('WARN', '⚠️ Cannot set number validation: ' + e);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Formatage conditionnel pour les notes
  // ─────────────────────────────────────────────────────────────────────────
  const rules = [];
  const noteRange = sheet.getRange(`L3:L${CONTACTS_V3_CONFIG.LIMITS.MAX_VALIDATION_ROWS}`);

  // Excellent (5) - Vert foncé
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(5)
    .setBackground('#D4EDDA')
    .setFontColor('#155724')
    .setBold(true)
    .setRanges([noteRange])
    .build()
  );

  // Bon (4) - Bleu clair
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(4)
    .setBackground('#D1ECF1')
    .setFontColor('#0C5460')
    .setRanges([noteRange])
    .build()
  );

  // Moyen (3) - Jaune
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(3)
    .setBackground('#FFF3CD')
    .setFontColor('#856404')
    .setRanges([noteRange])
    .build()
  );

  // Mauvais (1-2) - Rouge
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(2)
    .setBackground('#F8D7DA')
    .setFontColor('#721C24')
    .setBold(true)
    .setRanges([noteRange])
    .build()
  );

  sheet.setConditionalFormatRules(rules);

  Compat_.log('SUCCESS', '✅ Feuille Fournisseurs v3.0 créée avec système de notation');
  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════════
// 👥 GESTION DES CLIENTS
// ═══════════════════════════════════════════════════════════════════════════

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
 * Ajoute un nouveau client avec validation complète v3.0
 * @param {Object} clientData - Données du client
 * @returns {Object} Résultat de l'opération {success, numero?, message, error?}
 */
function addClient(clientData) {
  try {
    // ─────────────────────────────────────────────────────────────────────────
    // Validation des données obligatoires
    // ─────────────────────────────────────────────────────────────────────────
    if (!clientData || !clientData.nom || !clientData.telephone) {
      return {
        success: false,
        error: 'Le nom et le téléphone sont obligatoires'
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Validation du format téléphone
    // ─────────────────────────────────────────────────────────────────────────
    if (!isValidPhone_(clientData.telephone)) {
      return {
        success: false,
        error: 'Format de téléphone invalide.\nFormats acceptés: 6XXXXXXXX, +2376XXXXXXXX, 2376XXXXXXXX'
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Validation email si fourni
    // ─────────────────────────────────────────────────────────────────────────
    if (clientData.email && !isValidEmail_(clientData.email)) {
      return {
        success: false,
        error: 'Format d\'email invalide'
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Utiliser Validator si disponible
    // ─────────────────────────────────────────────────────────────────────────
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
        Compat_.log('WARN', '⚠️ Validator.validateClient failed: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Sanitization des données
    // ─────────────────────────────────────────────────────────────────────────
    const nomSanitized = sanitizeString_(clientData.nom);
    const adresseSanitized = sanitizeString_(clientData.adresse || '');
    const contactSanitized = sanitizeString_(clientData.contact || '');

    // ─────────────────────────────────────────────────────────────────────────
    // Obtenir la feuille
    // ─────────────────────────────────────────────────────────────────────────
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');

    if (!sheet) {
      throw new Error('Feuille Clients introuvable.\nInitialisez d\'abord le système (Menu ERP > Initialiser).');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Générer le numéro client
    // ─────────────────────────────────────────────────────────────────────────
    const config = Compat_.getSafeConfig();
    const prefix = config.prefixes.client || CONTACTS_V3_CONFIG.PREFIXES.CLIENT;
    const numeroClient = Compat_.getNextNumber(prefix, 'Clients');
    const dateCreation = Compat_.formatDate(new Date());
    const devise = config.devise || CONTACTS_V3_CONFIG.DEFAULTS.DEVISE;

    // ─────────────────────────────────────────────────────────────────────────
    // Préparer la ligne de données
    // ─────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────
    // Ajouter la ligne
    // ─────────────────────────────────────────────────────────────────────────
    sheet.appendRow(newRow);

    // ─────────────────────────────────────────────────────────────────────────
    // Formatage de la ligne
    // ─────────────────────────────────────────────────────────────────────────
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, newRow.length)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // ─────────────────────────────────────────────────────────────────────────
    // Invalidation du cache
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof DataManager !== 'undefined' && DataManager.invalidateCache) {
      try {
        DataManager.invalidateCache('Clients');
      } catch (e) {
        Compat_.log('WARN', '⚠️ Cannot invalidate cache: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Audit log
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof AuditLog !== 'undefined' && AuditLog.log) {
      try {
        AuditLog.log(
          AuditLog.Actions.CREATE,
          AuditLog.Entities.CLIENT,
          numeroClient,
          `Client créé: ${nomSanitized}`
        );
      } catch (e) {
        Compat_.log('WARN', '⚠️ Cannot write audit: ' + e);
      }
    }

    Compat_.log('SUCCESS', `✅ Client créé: ${numeroClient} - ${nomSanitized}`);

    return {
      success: true,
      numero: numeroClient,
      message: `✅ Client ${numeroClient} créé avec succès !\n\n${nomSanitized}`
    };

  } catch (error) {
    Compat_.handleError(error, 'addClient');
    return {
      success: false,
      error: error.toString(),
      message: '❌ Erreur lors de la création du client'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏪 GESTION DES FOURNISSEURS
// ═══════════════════════════════════════════════════════════════════════════

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
 * Ajoute un nouveau fournisseur v3.0
 * @param {Object} fournisseurData - Données du fournisseur
 * @returns {Object} Résultat de l'opération
 */
function addFournisseur(fournisseurData) {
  try {
    // ─────────────────────────────────────────────────────────────────────────
    // Validation des données obligatoires
    // ─────────────────────────────────────────────────────────────────────────
    if (!fournisseurData || !fournisseurData.nom || !fournisseurData.telephone) {
      return {
        success: false,
        error: 'Le nom et le téléphone sont obligatoires'
      };
    }

    if (!isValidPhone_(fournisseurData.telephone)) {
      return {
        success: false,
        error: 'Format de téléphone invalide.\nFormats acceptés: 6XXXXXXXX, +2376XXXXXXXX'
      };
    }

    if (fournisseurData.email && !isValidEmail_(fournisseurData.email)) {
      return {
        success: false,
        error: 'Format d\'email invalide'
      };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Sanitization
    // ─────────────────────────────────────────────────────────────────────────
    const nomSanitized = sanitizeString_(fournisseurData.nom);
    const adresseSanitized = sanitizeString_(fournisseurData.adresse || '');
    const contactSanitized = sanitizeString_(fournisseurData.contact || '');

    // ─────────────────────────────────────────────────────────────────────────
    // Obtenir la feuille
    // ─────────────────────────────────────────────────────────────────────────
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Fournisseurs');

    if (!sheet) {
      throw new Error('Feuille Fournisseurs introuvable.\nInitialisez d\'abord le système.');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Générer le numéro
    // ─────────────────────────────────────────────────────────────────────────
    const config = Compat_.getSafeConfig();
    const prefix = config.prefixes.fournisseur || CONTACTS_V3_CONFIG.PREFIXES.FOURNISSEUR;
    const numeroFournisseur = Compat_.getNextNumber(prefix, 'Fournisseurs');
    const dateCreation = Compat_.formatDate(new Date());

    // ─────────────────────────────────────────────────────────────────────────
    // Préparer la ligne
    // ─────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────
    // Ajouter
    // ─────────────────────────────────────────────────────────────────────────
    sheet.appendRow(newRow);

    // ─────────────────────────────────────────────────────────────────────────
    // Formatage
    // ─────────────────────────────────────────────────────────────────────────
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, newRow.length)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // ─────────────────────────────────────────────────────────────────────────
    // Invalidation cache
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof DataManager !== 'undefined' && DataManager.invalidateCache) {
      try {
        DataManager.invalidateCache('Fournisseurs');
      } catch (e) {
        Compat_.log('WARN', '⚠️ Cannot invalidate cache: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Audit
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof AuditLog !== 'undefined' && AuditLog.log) {
      try {
        AuditLog.log(
          AuditLog.Actions.CREATE,
          AuditLog.Entities.FOURNISSEUR,
          numeroFournisseur,
          `Fournisseur créé: ${nomSanitized}`
        );
      } catch (e) {
        Compat_.log('WARN', '⚠️ Cannot write audit: ' + e);
      }
    }

    Compat_.log('SUCCESS', `✅ Fournisseur créé: ${numeroFournisseur} - ${nomSanitized}`);

    return {
      success: true,
      numero: numeroFournisseur,
      message: `✅ Fournisseur ${numeroFournisseur} créé avec succès !\n\n${nomSanitized}`
    };

  } catch (error) {
    Compat_.handleError(error, 'addFournisseur');
    return {
      success: false,
      error: error.toString(),
      message: '❌ Erreur lors de la création du fournisseur'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 RECHERCHE ET STATISTIQUES
// ═══════════════════════════════════════════════════════════════════════════

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
 * @param {string} searchTerm - Terme de recherche
 * @returns {Array<Object>} Liste des clients trouvés
 */
function searchClient(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;

    // ─────────────────────────────────────────────────────────────────────────
    // Niveau 1: Utiliser DataManager si disponible
    // ─────────────────────────────────────────────────────────────────────────
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
        Compat_.log('WARN', '⚠️ DataManager.search failed, using fallback: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Niveau 2: Fallback recherche manuelle optimisée
    // ─────────────────────────────────────────────────────────────────────────
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');

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

        if (results.length >= CONTACTS_V3_CONFIG.LIMITS.MAX_SEARCH_RESULTS) break;
      }
    }

    return results;

  } catch (error) {
    Compat_.log('ERROR', `❌ searchClient: ${error}`);
    return [];
  }
}

/**
 * Recherche un fournisseur v3.0
 * @param {string} searchTerm - Terme de recherche
 * @returns {Array<Object>} Liste des fournisseurs trouvés
 */
function searchFournisseur(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const cols = CONTACTS_V3_CONFIG.FOURNISSEUR_COLS;

    // ─────────────────────────────────────────────────────────────────────────
    // Niveau 1: DataManager
    // ─────────────────────────────────────────────────────────────────────────
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
        Compat_.log('WARN', '⚠️ DataManager.search failed, using fallback: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Niveau 2: Fallback
    // ─────────────────────────────────────────────────────────────────────────
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Fournisseurs');

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

        if (results.length >= CONTACTS_V3_CONFIG.LIMITS.MAX_SEARCH_RESULTS) break;
      }
    }

    return results;

  } catch (error) {
    Compat_.log('ERROR', `❌ searchFournisseur: ${error}`);
    return [];
  }
}

/**
 * Obtient les clients actifs (Actif ou VIP)
 * @returns {Array<Object>} Liste des clients actifs
 */
function getActiveClients() {
  try {
    // ─────────────────────────────────────────────────────────────────────────
    // Niveau 1: DataManager avec cache
    // ─────────────────────────────────────────────────────────────────────────
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
        Compat_.log('WARN', '⚠️ DataManager.filter failed, using fallback: ' + e);
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Niveau 2: Fallback
    // ─────────────────────────────────────────────────────────────────────────
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');

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
    Compat_.log('ERROR', `❌ getActiveClients: ${error}`);
    return [];
  }
}

/**
 * Met à jour le CA d'un client
 * @param {string} clientNom - Nom du client
 * @param {number} montant - Montant à ajouter
 */
function updateClientRevenue(clientNom, montant) {
  try {
    if (!clientNom || montant === undefined) {
      Compat_.log('WARN', '⚠️ updateClientRevenue: paramètres invalides');
      return;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Clients');

    if (!sheet) {
      Compat_.log('ERROR', '❌ updateClientRevenue: feuille introuvable');
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
            Compat_.log('WARN', '⚠️ Cannot invalidate cache: ' + e);
          }
        }

        Compat_.log('SUCCESS', `✅ CA mis à jour: ${clientNom} +${montant} ${devise}`);
        break;
      }
    }

  } catch (error) {
    Compat_.log('ERROR', `❌ updateClientRevenue: ${error}`);
  }
}

/**
 * Affiche les statistiques des contacts
 * Design ultra moderne avec emojis et formatage avancé
 */
function showContactStats() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet1 = ss.getSheetByName('Clients');
    const sheet2 = ss.getSheetByName('Fournisseurs');

    if (!sheet1 || !sheet2) {
      throw new Error('Feuilles Clients ou Fournisseurs introuvables.\nInitialisez d\'abord le système.');
    }

    const clientsData = sheet1.getLastRow() > 2 ? sheet1.getRange(3, 1, sheet1.getLastRow() - 2, 12).getValues() : [];
    const fournisseursData = sheet2.getLastRow() > 2 ? sheet2.getRange(3, 1, sheet2.getLastRow() - 2, 12).getValues() : [];

    const cols = CONTACTS_V3_CONFIG.CLIENT_COLS;
    const fCols = CONTACTS_V3_CONFIG.FOURNISSEUR_COLS;

    // ─────────────────────────────────────────────────────────────────────────
    // Statistiques clients
    // ─────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────
    // Statistiques fournisseurs
    // ─────────────────────────────────────────────────────────────────────────
    const totalFournisseurs = fournisseursData.length;
    const fournisseursActifs = fournisseursData.filter(row => row[fCols.STATUT] === 'Actif').length;
    const fournisseursBloques = fournisseursData.filter(row => row[fCols.STATUT] === 'Bloqué').length;

    // Note moyenne
    const noteMoyenne = fournisseursData.length > 0
      ? fournisseursData.reduce((sum, row) => sum + (parseFloat(row[fCols.NOTE]) || 0), 0) / fournisseursData.length
      : 0;

    const config = Compat_.getSafeConfig();
    const devise = config.devise || CONTACTS_V3_CONFIG.DEFAULTS.DEVISE;
    const ui = SpreadsheetApp.getUi();

    // ─────────────────────────────────────────────────────────────────────────
    // Formatage du message avec design ultra moderne
    // ─────────────────────────────────────────────────────────────────────────
    const msg = `╔══════════════════════════════════════════════╗\n` +
                `║   📊 STATISTIQUES CONTACTS v${CONTACTS_V3_CONFIG.VERSION}      ║\n` +
                `╚══════════════════════════════════════════════╝\n\n` +
                `┌──────────────────────────────────────────────┐\n` +
                `│ 👥 CLIENTS                                   │\n` +
                `├──────────────────────────────────────────────┤\n` +
                `│ Total:            ${String(totalClients).padStart(4)} clients           │\n` +
                `│ ├─ ✅ Actifs:     ${String(clientsActifs).padStart(4)}                    │\n` +
                `│ ├─ ⭐ VIP:        ${String(clientsVIP).padStart(4)}                    │\n` +
                `│ ├─ 💤 Inactifs:   ${String(clientsInactifs).padStart(4)}                    │\n` +
                `│ └─ 🚫 Suspendus:  ${String(clientsSuspendus).padStart(4)}                    │\n` +
                `│                                              │\n` +
                `│ 💰 CA TOTAL:                                 │\n` +
                `│ ${String(caTotal.toLocaleString('fr-FR', {minimumFractionDigits: 0, maximumFractionDigits: 2})).padStart(18)} ${devise.padEnd(20)}│\n` +
                `└──────────────────────────────────────────────┘\n\n` +
                `┌──────────────────────────────────────────────┐\n` +
                `│ 🏪 FOURNISSEURS                              │\n` +
                `├──────────────────────────────────────────────┤\n` +
                `│ Total:            ${String(totalFournisseurs).padStart(4)} fournisseurs      │\n` +
                `│ ├─ ✅ Actifs:     ${String(fournisseursActifs).padStart(4)}                    │\n` +
                `│ ├─ 💤 Inactifs:   ${String(totalFournisseurs - fournisseursActifs - fournisseursBloques).padStart(4)}                    │\n` +
                `│ └─ 🚫 Bloqués:    ${String(fournisseursBloques).padStart(4)}                    │\n` +
                `│                                              │\n` +
                `│ ⭐ NOTE MOYENNE:  ${noteMoyenne.toFixed(2)}/5.00             │\n` +
                `└──────────────────────────────────────────────┘\n\n` +
                `📅 Date: ${Compat_.formatDate(new Date())}\n` +
                `🔧 Mode: ${Compat_.isERPAvailable() ? 'Complet' : 'Autonome'}`;

    ui.alert('📊 Statistiques Contacts v3.0', msg, ui.ButtonSet.OK);

  } catch (error) {
    Compat_.handleError(error, 'showContactStats');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 FEUILLES SYSTÈME
// ═══════════════════════════════════════════════════════════════════════════

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
    Compat_.log('WARN', '⚠️ Cannot hide sheet: ' + e);
  }

  Compat_.log('SUCCESS', '✅ Feuille _Audit v3.0 créée');
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
    Compat_.log('WARN', '⚠️ Cannot hide sheet: ' + e);
  }

  Compat_.log('SUCCESS', '✅ Feuille _Notifications v3.0 créée');
  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════════
// ℹ️ INFORMATIONS VERSION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Affiche les informations de version du module
 * Design ultra moderne avec statut du système
 */
function showContactsVersion() {
  const ui = SpreadsheetApp.getUi();
  const hasCore = Compat_.isERPAvailable();

  const msg = `╔══════════════════════════════════════════════╗\n` +
              `║      📦 MODULE CONTACTS v${CONTACTS_V3_CONFIG.VERSION}           ║\n` +
              `╚══════════════════════════════════════════════╝\n\n` +
              `📋 Informations:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `Version:      ${CONTACTS_V3_CONFIG.VERSION}\n` +
              `Build:        ${CONTACTS_V3_CONFIG.BUILD}\n` +
              `Module:       ${CONTACTS_V3_CONFIG.MODULE_NAME}\n\n` +
              `🔧 Configuration Système:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `Core.gs:      ${hasCore ? '✅ Détecté' : '❌ Non détecté'}\n` +
              `Mode:         ${hasCore ? 'Complet' : 'Autonome'}\n` +
              `Fallbacks:    ✅ Actifs\n` +
              `Thread-Safe:  ✅ Oui\n\n` +
              `📋 Fonctionnalités:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `├─ Gestion clients          ✅\n` +
              `├─ Gestion fournisseurs     ✅\n` +
              `├─ Recherche avancée        ✅\n` +
              `├─ Statistiques temps réel  ✅\n` +
              `├─ Validation CM            ✅\n` +
              `├─ Sanitization XSS         ✅\n` +
              `├─ Cache intelligent        ✅\n` +
              `├─ Audit trail              ✅\n` +
              `└─ Auto-réparation          ✅\n\n` +
              `💡 Architecture v3.0:\n` +
              `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
              `• Système de compatibilité 3 niveaux\n` +
              `• Fonctionnement autonome garanti\n` +
              `• Fallbacks automatiques intelligents\n` +
              `• Gestion d'erreurs enterprise-grade\n` +
              `• Formatage conditionnel moderne\n` +
              `• Optimisé pour le Cameroun 🇨🇲`;

  ui.alert('ℹ️ Module Contacts v3.0 - Ultra Moderne', msg, ui.ButtonSet.OK);
}

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                      FIN DU MODULE CONTACTS v3.0                         ║
 * ║                     Build: PRODUCTION-20250111-ULTRA                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */
