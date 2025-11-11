/**
 * ERP Secrétariat v2.0 - Architecture Core
 * Optimisé pour la production avec cache, logs et gestion d'erreurs
 */

/**
 * Configuration globale v2.0
 */
const ERP = {
  VERSION: '2.0.0',
  BUILD: '20250110',

  // Cache pour améliorer les performances
  cache: CacheService.getScriptCache(),
  CACHE_TTL: 600, // 10 minutes

  // Configuration - Initialisée avec config par défaut
  config: null,

  // Logs
  logs: [],
  MAX_LOGS: 1000,

  /**
   * Initialise l'ERP
   */
  init: function() {
    try {
      this.log('INFO', 'Initialisation ERP v' + this.VERSION);
      // Initialiser avec config par défaut si null
      if (!this.config) {
        this.config = getDefaultConfig();
      }
      // Puis charger la config depuis la feuille si elle existe
      this.config = this.getConfig();
      return true;
    } catch (error) {
      // En cas d'erreur, s'assurer qu'on a au moins la config par défaut
      if (!this.config) {
        this.config = getDefaultConfig();
      }
      this.log('ERROR', 'Erreur init: ' + error.toString());
      return false;
    }
  },

  /**
   * Gestion des erreurs centralisée
   */
  handleError: function(error, context) {
    const errorMsg = `[${context}] ${error.toString()}`;
    this.log('ERROR', errorMsg);

    // Logger dans une feuille dédiée pour le débogage
    try {
      const logSheet = this.getOrCreateSheet('_Logs');
      logSheet.appendRow([
        new Date(),
        'ERROR',
        context,
        error.toString(),
        error.stack || 'N/A'
      ]);
    } catch (e) {
      console.error('Erreur lors du logging:', e);
    }

    // Afficher à l'utilisateur
    const ui = SpreadsheetApp.getUi();
    ui.alert('Erreur', errorMsg, ui.ButtonSet.OK);

    throw error;
  },

  /**
   * Système de logging
   */
  log: function(level, message) {
    const timestamp = new Date();
    const logEntry = {
      timestamp: timestamp,
      level: level,
      message: message
    };

    this.logs.push(logEntry);

    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Logger aussi dans la console
    console.log(`[${level}] ${message}`);
  },

  /**
   * Cache intelligent
   */
  cacheGet: function(key) {
    try {
      const cached = this.cache.get(key);
      if (cached) {
        this.log('DEBUG', `Cache HIT: ${key}`);
        return JSON.parse(cached);
      }
      this.log('DEBUG', `Cache MISS: ${key}`);
      return null;
    } catch (error) {
      this.log('WARN', `Cache error: ${error}`);
      return null;
    }
  },

  cacheSet: function(key, value, ttl) {
    try {
      ttl = ttl || this.CACHE_TTL;
      this.cache.put(key, JSON.stringify(value), ttl);
      this.log('DEBUG', `Cache SET: ${key}`);
    } catch (error) {
      this.log('WARN', `Cache set error: ${error}`);
    }
  },

  cacheClear: function(key) {
    if (key) {
      this.cache.remove(key);
    } else {
      this.cache.removeAll();
    }
  },

  /**
   * Obtient ou crée une feuille
   */
  getOrCreateSheet: function(name) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(name);

    if (!sheet) {
      sheet = ss.insertSheet(name);
      this.log('INFO', `Feuille créée: ${name}`);
    }

    return sheet;
  },

  /**
   * Obtient la configuration avec cache
   */
  getConfig: function() {
    // Essayer le cache d'abord
    const cached = this.cacheGet('config');
    if (cached) return cached;

    // Sinon charger depuis la feuille (ou config par défaut)
    const config = loadConfigFromSheet();
    this.cacheSet('config', config);
    return config;
  },

  /**
   * Obtient la configuration de manière sûre (toujours valide)
   */
  getSafeConfig: function() {
    if (!this.config) {
      this.config = getDefaultConfig();
    }
    return this.config;
  },

  /**
   * Formatte une date
   */
  formatDate: function(date) {
    if (!date) date = new Date();
    const config = this.getSafeConfig();
    return Utilities.formatDate(date, config.timezone || 'Africa/Douala', 'dd/MM/yyyy');
  },

  /**
   * Formatte une date avec heure
   */
  formatDateTime: function(date) {
    if (!date) date = new Date();
    const config = this.getSafeConfig();
    return Utilities.formatDate(date, config.timezone || 'Africa/Douala', 'dd/MM/yyyy HH:mm:ss');
  },

  /**
   * Obtient le prochain numéro avec gestion thread-safe
   */
  getNextNumber: function(prefix, sheetName) {
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000); // Attendre max 30 secondes

      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
      if (!sheet) return prefix + '0001';

      const lastRow = sheet.getLastRow();
      if (lastRow <= 2) return prefix + '0001';

      const lastNumber = sheet.getRange(lastRow, 1).getValue();
      if (!lastNumber) return prefix + '0001';

      const numberPart = parseInt(lastNumber.toString().replace(prefix, '')) || 0;
      const nextNumber = (numberPart + 1).toString().padStart(4, '0');

      return prefix + nextNumber;
    } finally {
      lock.releaseLock();
    }
  }
};

/**
 * Charge la configuration depuis la feuille
 */
function loadConfigFromSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Configuration');

  if (!sheet) {
    return getDefaultConfig();
  }

  try {
    return {
      version: '2.0.0',
      timezone: 'Africa/Douala',
      entreprise: {
        nom: sheet.getRange('B4').getValue() || 'SECRETARIAT BUREAUTIQUE',
        adresse: sheet.getRange('B5').getValue() || 'Yaoundé, Cameroun',
        telephone: sheet.getRange('B6').getValue() || '+237 XXX XXX XXX',
        email: sheet.getRange('B7').getValue() || 'contact@secretariat.cm',
        nif: sheet.getRange('B8').getValue() || '',
        rc: sheet.getRange('B9').getValue() || ''
      },
      devise: sheet.getRange('B10').getValue() || 'FCFA',
      tauxTVA: sheet.getRange('B13').getValue() || 19.25,
      prefixes: {
        client: sheet.getRange('B16').getValue() || 'CLT',
        fournisseur: sheet.getRange('B17').getValue() || 'FRS',
        devis: sheet.getRange('B18').getValue() || 'DEV',
        facture: sheet.getRange('B19').getValue() || 'FAC',
        courrierEntrant: sheet.getRange('B20').getValue() || 'CE',
        courrierSortant: sheet.getRange('B21').getValue() || 'CS',
        tache: sheet.getRange('B22').getValue() || 'TSK',
        employe: sheet.getRange('B23').getValue() || 'EMP'
      },
      colors: {
        header: '#1A73E8',
        headerText: '#FFFFFF',
        subHeader: '#4285F4',
        success: '#34A853',
        warning: '#FBBC04',
        danger: '#EA4335',
        info: '#4285F4'
      },
      options: {
        enableNotifications: sheet.getRange('B25').getValue() || true,
        enableAutoBackup: sheet.getRange('B26').getValue() || false,
        backupFrequency: sheet.getRange('B27').getValue() || 'weekly',
        enableAuditLog: sheet.getRange('B28').getValue() || true
      }
    };
  } catch (error) {
    ERP.log('WARN', 'Erreur lecture config, utilisation valeurs par défaut');
    return getDefaultConfig();
  }
}

/**
 * Configuration par défaut
 */
function getDefaultConfig() {
  return {
    version: '2.0.0',
    timezone: 'Africa/Douala',
    entreprise: {
      nom: 'SECRETARIAT BUREAUTIQUE',
      adresse: 'Yaoundé, Cameroun',
      telephone: '+237 XXX XXX XXX',
      email: 'contact@secretariat.cm',
      nif: '',
      rc: ''
    },
    devise: 'FCFA',
    tauxTVA: 19.25,
    prefixes: {
      client: 'CLT',
      fournisseur: 'FRS',
      devis: 'DEV',
      facture: 'FAC',
      courrierEntrant: 'CE',
      courrierSortant: 'CS',
      tache: 'TSK',
      employe: 'EMP'
    },
    colors: {
      header: '#1A73E8',
      headerText: '#FFFFFF',
      subHeader: '#4285F4',
      success: '#34A853',
      warning: '#FBBC04',
      danger: '#EA4335',
      info: '#4285F4'
    },
    options: {
      enableNotifications: true,
      enableAutoBackup: false,
      backupFrequency: 'weekly',
      enableAuditLog: true
    }
  };
}

/**
 * Fonction exécutée à l'ouverture
 */
function onOpen() {
  ERP.init();

  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🏢 ERP v2.0')
    .addSubMenu(ui.createMenu('⚙️ Système')
      .addItem('Initialiser l\'ERP', 'initializeERP')
      .addItem('Vider le cache', 'clearCache')
      .addItem('Exporter les données', 'showExportDialog')
      .addItem('Créer une sauvegarde', 'createBackup')
      .addSeparator()
      .addItem('À propos', 'showAbout'))
    .addSeparator()
    .addSubMenu(ui.createMenu('👥 Contacts')
      .addItem('➕ Nouveau client', 'showAddClientDialog')
      .addItem('➕ Nouveau fournisseur', 'showAddFournisseurDialog')
      .addItem('🔍 Rechercher', 'showSearchContactDialog')
      .addItem('📊 Statistiques contacts', 'showContactStats'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📨 Courrier')
      .addItem('📥 Courrier entrant', 'showCourrierEntrantDialog')
      .addItem('📤 Courrier sortant', 'showCourrierSortantDialog')
      .addItem('📋 Registre', 'goToCourrierSheet')
      .addItem('📊 Statistiques courrier', 'showCourrierStats'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📅 Agenda & Tâches')
      .addItem('➕ Nouveau RDV', 'showAddRendezVousDialog')
      .addItem('➕ Nouvelle tâche', 'showAddTacheDialog')
      .addItem('📅 Agenda du jour', 'showAgendaToday')
      .addItem('📋 Semaine en cours', 'showAgendaWeek')
      .addItem('⚡ Tâches urgentes', 'showUrgentTasks'))
    .addSeparator()
    .addSubMenu(ui.createMenu('💰 Facturation')
      .addItem('📋 Nouveau devis', 'showCreateDevisDialog')
      .addItem('🧾 Nouvelle facture', 'showCreateFactureDialog')
      .addItem('💳 Enregistrer paiement', 'showPaiementDialog')
      .addSeparator()
      .addItem('⚠️ Factures impayées', 'showUnpaidInvoices')
      .addItem('📊 CA du mois', 'showMonthlyRevenue')
      .addItem('📈 Statistiques', 'showFacturationStats'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📦 Stock')
      .addItem('➕ Nouvel article', 'showAddArticleDialog')
      .addItem('🔄 Mouvement', 'showMouvementStockDialog')
      .addItem('📋 Inventaire', 'goToStockSheet')
      .addItem('⚠️ Alertes stock', 'showLowStockAlerts')
      .addItem('📊 Statistiques stock', 'showStockStats'))
    .addSeparator()
    .addSubMenu(ui.createMenu('👨‍💼 Personnel')
      .addItem('➕ Nouvel employé', 'showAddEmployeDialog')
      .addItem('✓ Pointer présence', 'showPresenceDialog')
      .addItem('📋 Fiches personnel', 'goToPersonnelSheet')
      .addItem('📊 Présences du mois', 'showMonthlyAttendance'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Reporting')
      .addItem('📈 Tableau de bord', 'goToDashboard')
      .addItem('📑 Rapport mensuel', 'generateMonthlyReport')
      .addItem('📊 Rapport annuel', 'generateAnnualReport')
      .addItem('💾 Exporter rapport', 'exportReport'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔔 Notifications')
      .addItem('📬 Centre de notifications', 'showNotificationCenter')
      .addItem('⚙️ Paramètres alertes', 'showNotificationSettings'))
    .addToUi();

  // Afficher les notifications au démarrage
  checkAndShowNotifications();
}

/**
 * Vide le cache
 */
function clearCache() {
  ERP.cacheClear();
  SpreadsheetApp.getUi().alert('Cache vidé avec succès !');
}

/**
 * Affiche la fenêtre À propos
 */
function showAbout() {
  const html = HtmlService.createHtmlOutput(`
    <div style="font-family: Arial; padding: 20px;">
      <h2>🏢 ERP Secrétariat</h2>
      <p><strong>Version:</strong> ${ERP.VERSION}</p>
      <p><strong>Build:</strong> ${ERP.BUILD}</p>
      <p><strong>Développé pour:</strong> Secrétariats Bureautiques - Cameroun 🇨🇲</p>
      <hr>
      <h3>Nouveautés v2.0</h3>
      <ul>
        <li>✅ Système de cache pour meilleures performances</li>
        <li>✅ Gestion d'erreurs robuste</li>
        <li>✅ Notifications et alertes automatiques</li>
        <li>✅ Export et backup de données</li>
        <li>✅ Logs d'audit complets</li>
        <li>✅ Interface optimisée</li>
        <li>✅ Rapports avancés avec graphiques</li>
      </ul>
    </div>
  `)
  .setWidth(450)
  .setHeight(400);

  SpreadsheetApp.getUi().showModalDialog(html, 'À propos - ERP v2.0');
}

/**
 * Vérifie et affiche les notifications au démarrage
 */
function checkAndShowNotifications() {
  try {
    const config = ERP.getSafeConfig();
    if (!config.options.enableNotifications) return;

    const notifications = getActiveNotifications();

    if (notifications.length > 0) {
      // Afficher un badge ou une alerte discrète
      const ui = SpreadsheetApp.getUi();
      ui.alert(
        '🔔 Notifications',
        `Vous avez ${notifications.length} notification(s) en attente.\n\n` +
        'Accédez au Centre de notifications pour les consulter.',
        ui.ButtonSet.OK
      );
    }
  } catch (error) {
    // Ignorer les erreurs de notification au démarrage
    console.log('Erreur notifications: ' + error);
  }
}

/**
 * Obtient les notifications actives
 */
function getActiveNotifications() {
  const notifications = [];

  // Factures impayées en retard
  const unpaidInvoices = getUnpaidInvoicesCount();
  if (unpaidInvoices > 0) {
    notifications.push({
      type: 'warning',
      title: 'Factures impayées',
      message: `${unpaidInvoices} facture(s) en retard de paiement`,
      action: 'showUnpaidInvoices'
    });
  }

  // Alertes stock faible
  const lowStock = getLowStockCount();
  if (lowStock > 0) {
    notifications.push({
      type: 'warning',
      title: 'Stock faible',
      message: `${lowStock} article(s) en rupture ou stock faible`,
      action: 'showLowStockAlerts'
    });
  }

  // RDV du jour
  const todayRdv = getTodayAppointmentsCount();
  if (todayRdv > 0) {
    notifications.push({
      type: 'info',
      title: 'Agenda',
      message: `${todayRdv} rendez-vous aujourd'hui`,
      action: 'showAgendaToday'
    });
  }

  // Tâches urgentes
  const urgentTasks = getUrgentTasksCount();
  if (urgentTasks > 0) {
    notifications.push({
      type: 'danger',
      title: 'Tâches urgentes',
      message: `${urgentTasks} tâche(s) urgente(s) en attente`,
      action: 'showUrgentTasks'
    });
  }

  return notifications;
}

// ============================================================================
// FONCTIONS GLOBALES POUR COMPATIBILITÉ
// ============================================================================

/**
 * Fonction globale getOrCreateSheet pour compatibilité
 * @param {string} name
 * @return {Sheet}
 */
function getOrCreateSheet(name) {
  return ERP.getOrCreateSheet(name);
}

// ============================================================================
// FONCTIONS DE NOTIFICATION
// ============================================================================

/**
 * Fonctions de comptage pour notifications
 */
function getUnpaidInvoicesCount() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
    if (!sheet || sheet.getLastRow() < 3) return 0;

    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 11).getValues();
    let count = 0;
    const today = new Date();

    for (let row of data) {
      if (row[10] === 'En retard' || row[10] === 'Émise') {
        const echeance = new Date(row[9]);
        if (echeance < today) count++;
      }
    }

    return count;
  } catch (e) {
    return 0;
  }
}

function getLowStockCount() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');
    if (!sheet || sheet.getLastRow() < 3) return 0;

    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
    let count = 0;

    for (let row of data) {
      if (row[9] === 'Stock faible') count++;
    }

    return count;
  } catch (e) {
    return 0;
  }
}

function getTodayAppointmentsCount() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agenda');
    if (!sheet || sheet.getLastRow() < 3) return 0;

    const today = ERP.formatDate(new Date());
    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 9).getValues();
    let count = 0;

    for (let row of data) {
      if (ERP.formatDate(new Date(row[0])) === today) count++;
    }

    return count;
  } catch (e) {
    return 0;
  }
}

function getUrgentTasksCount() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tâches');
    if (!sheet || sheet.getLastRow() < 3) return 0;

    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
    let count = 0;

    for (let row of data) {
      if (row[4] === 'Urgente' && (row[7] === 'À faire' || row[7] === 'En cours')) {
        count++;
      }
    }

    return count;
  } catch (e) {
    return 0;
  }
}
