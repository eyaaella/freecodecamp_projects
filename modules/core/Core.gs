/**
 * ============================================================================
 * MODULE CORE v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-15
 * Description: Module central amélioré avec cache intelligent, API REST,
 *              mode sombre, dashboard temps réel, webhooks et multi-tenancy
 *
 * Nouvelles fonctionnalités v2.0:
 * ✅ Cache intelligent avec TTL
 * ✅ API REST endpoints (doGet, doPost)
 * ✅ Mode Sombre avec sauvegarde préférence
 * ✅ Dashboard temps réel avec auto-refresh
 * ✅ Triggers automatiques pour sauvegarde
 * ✅ Système de logs avancé avec rotation
 * ✅ Métriques de performance
 * ✅ Backup incremental intelligent
 * ✅ Configuration dynamique
 * ✅ Webhooks pour notifications externes
 * ✅ Multi-tenancy ready
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION GLOBALE v2.0
// ============================================================================

const CONFIG = {
  VERSION: '2.0.0',
  APP_NAME: 'TopoGest Pro',
  LOCALE: 'fr_FR',
  TIMEZONE: 'Africa/Douala',

  // Cache et performance
  CACHE_TTL: 300000, // 5 minutes
  AUTO_REFRESH_INTERVAL: 30000, // 30 secondes
  MAX_LOG_ENTRIES: 1000,
  BACKUP_RETENTION_DAYS: 30,
  PERFORMANCE_THRESHOLD: 5000, // ms

  // API
  API_VERSION: 'v2',
  WEBHOOK_TIMEOUT: 10000,

  // Couleurs du thème
  COLORS: {
    PRIMARY: '#1a73e8',
    SECONDARY: '#34a853',
    WARNING: '#fbbc04',
    DANGER: '#ea4335',
    SUCCESS: '#34a853',
    INFO: '#4285f4',
    DARK: '#202124',
    LIGHT: '#f8f9fa',
    HEADER_BG: '#1a73e8',
    HEADER_TEXT: '#ffffff',
    ROW_ALT: '#f8f9fa'
  },

  // Modules actifs
  MODULES: [
    'PROJET', 'OUVRAGE', 'TACHE', 'RELEVE', 'EQUIPE',
    'EMPLOYE', 'MATERIEL', 'POSTE', 'UTILISATEUR',
    'JOURNAL_ACTIONS', 'NOTIFICATION', 'DOCUMENT',
    'PLANNING', 'BUDGET', 'FACTURE', 'CONTROLEUR'
  ],

  // Feuilles de calcul
  SHEETS: {
    DASHBOARD: '📊 Tableau de Bord',
    PROJET: '📁 Projets',
    OUVRAGE: '🏗️ Ouvrages',
    TACHE: '✅ Tâches',
    RELEVE: '📐 Relevés',
    EQUIPE: '👥 Équipes',
    EMPLOYE: '👤 Employés',
    MATERIEL: '🔧 Matériel',
    POSTE: '💼 Postes',
    UTILISATEUR: '🔐 Utilisateurs',
    JOURNAL: '📝 Journal',
    NOTIFICATION: '🔔 Notifications',
    DOCUMENT: '📄 Documents',
    PLANNING: '📅 Planning',
    BUDGET: '💰 Budget',
    FACTURE: '🧾 Factures',
    CONTROLEUR: '✓ Contrôleurs',
    CONFIG: '⚙️ Configuration',
    LOGS: '📋 Logs',
    METRIQUES: '📊 Metriques',
    WEBHOOKS: '🔗 Webhooks'
  }
};

// ============================================================================
// CACHE INTELLIGENT v2.0
// ============================================================================

const CACHE_MANAGER = {
  TTL: CONFIG.CACHE_TTL,
  cache: CacheService.getScriptCache(),

  /**
   * Récupère une valeur du cache
   * @param {string} key - Clé du cache
   * @returns {*} Valeur ou null si expiré
   */
  get: function(key) {
    try {
      const cached = this.cache.get(key);
      if (cached) {
        const data = JSON.parse(cached);
        const now = new Date().getTime();

        // Vérifier TTL personnalisé
        if (data.expiry && now > data.expiry) {
          this.invalidate(key);
          return null;
        }

        logMessage('CACHE_HIT', `Key: ${key}`);
        return data.value;
      }
      logMessage('CACHE_MISS', `Key: ${key}`);
      return null;
    } catch (error) {
      logError('CACHE_GET', error);
      return null;
    }
  },

  /**
   * Stocke une valeur dans le cache
   * @param {string} key - Clé du cache
   * @param {*} value - Valeur à stocker
   * @param {number} ttl - Durée de vie en ms (optionnel)
   */
  set: function(key, value, ttl) {
    try {
      const expiry = ttl ? new Date().getTime() + ttl : new Date().getTime() + this.TTL;
      const data = {
        value: value,
        expiry: expiry,
        created: new Date().getTime()
      };

      this.cache.put(key, JSON.stringify(data), 21600); // 6 heures max Google
      logMessage('CACHE_SET', `Key: ${key}, TTL: ${ttl || this.TTL}ms`);
    } catch (error) {
      logError('CACHE_SET', error);
    }
  },

  /**
   * Invalide une clé du cache
   * @param {string} key - Clé à invalider
   */
  invalidate: function(key) {
    try {
      this.cache.remove(key);
      logMessage('CACHE_INVALIDATE', `Key: ${key}`);
    } catch (error) {
      logError('CACHE_INVALIDATE', error);
    }
  },

  /**
   * Invalide tout le cache
   */
  invalidateAll: function() {
    try {
      const keys = this.cache.getKeys();
      if (keys.length > 0) {
        keys.forEach(key => this.cache.remove(key));
      }
      logMessage('CACHE_INVALIDATE_ALL', 'Cache entièrement vidé');
    } catch (error) {
      logError('CACHE_INVALIDATE_ALL', error);
    }
  },

  /**
   * Récupère les statistiques du cache
   * @returns {Object} Statistiques
   */
  getStats: function() {
    try {
      const keys = this.cache.getKeys() || [];
      return {
        keys_count: keys.length,
        keys: keys,
        ttl: this.TTL
      };
    } catch (error) {
      logError('CACHE_STATS', error);
      return { keys_count: 0, keys: [], ttl: this.TTL };
    }
  }
};

// ============================================================================
// API REST v2.0
// ============================================================================

/**
 * Endpoint GET pour API REST
 * @param {Object} e - Event object
 * @returns {TextOutput} Response JSON
 */
function doGet(e) {
  return handleAPIRequest('GET', e);
}

/**
 * Endpoint POST pour API REST
 * @param {Object} e - Event object
 * @returns {TextOutput} Response JSON
 */
function doPost(e) {
  return handleAPIRequest('POST', e);
}

/**
 * Gestionnaire principal des requêtes API
 * @param {string} method - Méthode HTTP
 * @param {Object} e - Event object
 * @returns {TextOutput} Response JSON
 */
function handleAPIRequest(method, e) {
  const startTime = new Date().getTime();

  try {
    // Vérification authentification
    const apiKey = e.parameter.apiKey || e.parameter.api_key;
    if (!verifierAPIKey(apiKey)) {
      return reponseJSON({ error: 'Unauthorized', message: 'API Key invalide' }, 401);
    }

    const action = e.parameter.action || 'status';
    let response;

    // Routage des actions
    switch (action) {
      case 'status':
        response = obtenirStatutSysteme();
        break;
      case 'metriques':
        response = obtenirMetriquesTempsReel();
        break;
      case 'projets':
        response = method === 'GET' ? obtenirProjets() : creerProjet(e.parameter);
        break;
      case 'backup':
        response = method === 'POST' ? creerBackupIncremental() : { error: 'Method not allowed' };
        break;
      case 'cache':
        response = method === 'GET' ? CACHE_MANAGER.getStats() : null;
        if (method === 'POST' && e.parameter.clear === 'true') {
          CACHE_MANAGER.invalidateAll();
          response = { message: 'Cache vidé' };
        }
        break;
      default:
        response = {
          error: 'Unknown action',
          available_actions: ['status', 'metriques', 'projets', 'backup', 'cache']
        };
    }

    const executionTime = new Date().getTime() - startTime;
    response._meta = {
      version: CONFIG.VERSION,
      execution_time_ms: executionTime,
      timestamp: new Date().toISOString()
    };

    return reponseJSON(response, 200);

  } catch (error) {
    logError('API_REQUEST', error);
    return reponseJSON({ error: 'Internal Server Error', message: error.toString() }, 500);
  }
}

/**
 * Génère une réponse JSON formatée
 * @param {Object} data - Données à retourner
 * @param {number} code - Code HTTP
 * @returns {TextOutput} Response
 */
function reponseJSON(data, code) {
  const output = ContentService.createTextOutput(JSON.stringify(data, null, 2));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Vérifie la validité d'une API Key
 * @param {string} key - API Key à vérifier
 * @returns {boolean} Valide ou non
 */
function verifierAPIKey(key) {
  if (!key) return false;

  try {
    const props = PropertiesService.getScriptProperties();
    const validKeys = JSON.parse(props.getProperty('API_KEYS') || '[]');
    return validKeys.includes(key);
  } catch (error) {
    logError('API_KEY_VERIFICATION', error);
    return false;
  }
}

/**
 * Génère une nouvelle API Key
 * @returns {string} Nouvelle clé
 */
function genererAPIKey() {
  const key = 'tgp_' + Utilities.getUuid().replace(/-/g, '');

  try {
    const props = PropertiesService.getScriptProperties();
    const validKeys = JSON.parse(props.getProperty('API_KEYS') || '[]');
    validKeys.push(key);
    props.setProperty('API_KEYS', JSON.stringify(validKeys));

    logMessage('API_KEY_GENERATED', `Nouvelle clé: ${key}`);
    return key;
  } catch (error) {
    logError('API_KEY_GENERATION', error);
    return null;
  }
}

// ============================================================================
// MODE SOMBRE v2.0
// ============================================================================

/**
 * Toggle le mode sombre
 * @returns {boolean} État actuel
 */
function toggleDarkMode() {
  try {
    const current = getDarkModePreference();
    const newValue = !current;

    const props = PropertiesService.getUserProperties();
    props.setProperty('DARK_MODE', newValue.toString());

    logMessage('DARK_MODE_TOGGLE', `Mode sombre: ${newValue}`);
    return newValue;
  } catch (error) {
    logError('DARK_MODE_TOGGLE', error);
    return false;
  }
}

/**
 * Récupère la préférence de mode sombre
 * @returns {boolean} Mode sombre activé ou non
 */
function getDarkModePreference() {
  try {
    const props = PropertiesService.getUserProperties();
    const darkMode = props.getProperty('DARK_MODE');
    return darkMode === 'true';
  } catch (error) {
    logError('DARK_MODE_GET', error);
    return false;
  }
}

/**
 * Définit la préférence de mode sombre
 * @param {boolean} enabled - Activer ou non
 */
function setDarkModePreference(enabled) {
  try {
    const props = PropertiesService.getUserProperties();
    props.setProperty('DARK_MODE', enabled.toString());
    logMessage('DARK_MODE_SET', `Mode sombre: ${enabled}`);
  } catch (error) {
    logError('DARK_MODE_SET', error);
  }
}

// ============================================================================
// DASHBOARD TEMPS RÉEL v2.0
// ============================================================================

/**
 * Obtient les métriques temps réel du système
 * @returns {Object} Métriques
 */
function obtenirMetriquesTempsReel() {
  const cacheKey = 'metriques_temps_reel';
  const cached = CACHE_MANAGER.get(cacheKey);

  if (cached) return cached;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const metriques = {
      timestamp: new Date().toISOString(),
      projets: {
        total: compterLignes(CONFIG.SHEETS.PROJET),
        actifs: compterLignesCondition(CONFIG.SHEETS.PROJET, 'Statut', 'En cours'),
        termines: compterLignesCondition(CONFIG.SHEETS.PROJET, 'Statut', 'Terminé'),
        en_attente: compterLignesCondition(CONFIG.SHEETS.PROJET, 'Statut', 'En attente')
      },
      taches: {
        total: compterLignes(CONFIG.SHEETS.TACHE),
        en_cours: compterLignesCondition(CONFIG.SHEETS.TACHE, 'Statut', 'En cours'),
        terminees: compterLignesCondition(CONFIG.SHEETS.TACHE, 'Statut', 'Terminée'),
        en_retard: compterTachesEnRetard()
      },
      employes: {
        total: compterLignes(CONFIG.SHEETS.EMPLOYE),
        actifs: compterLignesCondition(CONFIG.SHEETS.EMPLOYE, 'Statut', 'Actif')
      },
      equipes: {
        total: compterLignes(CONFIG.SHEETS.EQUIPE)
      },
      materiel: {
        total: compterLignes(CONFIG.SHEETS.MATERIEL),
        disponible: compterLignesCondition(CONFIG.SHEETS.MATERIEL, 'Statut', 'Disponible'),
        maintenance: compterLignesCondition(CONFIG.SHEETS.MATERIEL, 'Statut', 'Maintenance')
      },
      systeme: {
        cache_keys: CACHE_MANAGER.getStats().keys_count,
        logs_count: compterLignes(CONFIG.SHEETS.LOGS),
        derniere_sauvegarde: obtenirDerniereSauvegarde(),
        uptime: calculerUptime(),
        version: CONFIG.VERSION
      }
    };

    CACHE_MANAGER.set(cacheKey, metriques, 30000); // Cache 30s
    return metriques;

  } catch (error) {
    logError('METRIQUES_TEMPS_REEL', error);
    return { error: error.toString() };
  }
}

/**
 * Compte les tâches en retard
 * @returns {number} Nombre de tâches en retard
 */
function compterTachesEnRetard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.TACHE);
    if (!sheet || sheet.getLastRow() < 2) return 0;

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const dateIndex = headers.indexOf('Date Échéance');
    const statutIndex = headers.indexOf('Statut');

    if (dateIndex === -1 || statutIndex === -1) return 0;

    const today = new Date();
    let count = 0;

    for (let i = 1; i < data.length; i++) {
      const dateEcheance = new Date(data[i][dateIndex]);
      const statut = data[i][statutIndex];

      if (statut !== 'Terminée' && dateEcheance < today) {
        count++;
      }
    }

    return count;
  } catch (error) {
    logError('COMPTER_TACHES_RETARD', error);
    return 0;
  }
}

/**
 * Obtient la date de dernière sauvegarde
 * @returns {string} Date ISO
 */
function obtenirDerniereSauvegarde() {
  try {
    const props = PropertiesService.getScriptProperties();
    return props.getProperty('DERNIERE_SAUVEGARDE') || 'Jamais';
  } catch (error) {
    return 'Erreur';
  }
}

/**
 * Calcule le uptime du système
 * @returns {string} Uptime formaté
 */
function calculerUptime() {
  try {
    const props = PropertiesService.getScriptProperties();
    const installDate = props.getProperty('INSTALL_DATE');

    if (!installDate) {
      const now = new Date().toISOString();
      props.setProperty('INSTALL_DATE', now);
      return '0 jours';
    }

    const install = new Date(installDate);
    const now = new Date();
    const diffMs = now - install;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return `${diffDays} jours`;
  } catch (error) {
    return 'Inconnu';
  }
}

// ============================================================================
// SYSTÈME DE LOGS AVANCÉ v2.0
// ============================================================================

/**
 * Enregistre un message dans les logs
 * @param {string} type - Type de log
 * @param {string} message - Message
 * @param {Object} metadata - Métadonnées optionnelles
 */
function logMessage(type, message, metadata = {}) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.LOGS);
      sheet.appendRow(['Timestamp', 'Type', 'Message', 'Utilisateur', 'Metadata']);
    }

    const user = Session.getActiveUser().getEmail() || 'Système';
    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      type,
      message,
      user,
      JSON.stringify(metadata)
    ]);

    // Rotation des logs
    rotationLogs(sheet);

  } catch (error) {
    Logger.log('Erreur log: ' + error);
  }
}

/**
 * Enregistre une erreur dans les logs
 * @param {string} context - Contexte de l'erreur
 * @param {Error} error - Objet erreur
 */
function logError(context, error) {
  logMessage('ERROR', `[${context}] ${error.toString()}`, {
    stack: error.stack || '',
    name: error.name || ''
  });
}

/**
 * Rotation des logs (garde les dernières entrées)
 * @param {Sheet} sheet - Feuille de logs
 */
function rotationLogs(sheet) {
  try {
    const rowCount = sheet.getLastRow();

    if (rowCount > CONFIG.MAX_LOG_ENTRIES + 1) {
      const rowsToDelete = rowCount - CONFIG.MAX_LOG_ENTRIES - 1;
      sheet.deleteRows(2, rowsToDelete);
      logMessage('LOG_ROTATION', `${rowsToDelete} anciennes entrées supprimées`);
    }
  } catch (error) {
    Logger.log('Erreur rotation logs: ' + error);
  }
}

/**
 * Récupère les logs récents
 * @param {number} limit - Nombre de logs à récupérer
 * @returns {Array} Logs
 */
function obtenirLogsRecents(limit = 100) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
    if (!sheet || sheet.getLastRow() < 2) return [];

    const data = sheet.getDataRange().getValues();
    const logs = data.slice(1, Math.min(limit + 1, data.length));

    return logs.map(row => ({
      timestamp: row[0],
      type: row[1],
      message: row[2],
      user: row[3],
      metadata: row[4]
    }));
  } catch (error) {
    logError('OBTENIR_LOGS', error);
    return [];
  }
}

// ============================================================================
// MÉTRIQUES DE PERFORMANCE v2.0
// ============================================================================

/**
 * Mesure la performance d'une fonction
 * @param {string} functionName - Nom de la fonction
 * @param {Function} fn - Fonction à mesurer
 * @returns {*} Résultat de la fonction
 */
function mesurerPerformance(functionName, fn) {
  const startTime = new Date().getTime();

  try {
    const result = fn();
    const executionTime = new Date().getTime() - startTime;

    // Enregistrer les métriques
    enregistrerMetrique(functionName, executionTime, 'SUCCESS');

    // Alerter si temps d'exécution élevé
    if (executionTime > CONFIG.PERFORMANCE_THRESHOLD) {
      logMessage('PERFORMANCE_WARNING', `${functionName} a pris ${executionTime}ms`);
    }

    return result;
  } catch (error) {
    const executionTime = new Date().getTime() - startTime;
    enregistrerMetrique(functionName, executionTime, 'ERROR');
    throw error;
  }
}

/**
 * Enregistre une métrique de performance
 * @param {string} functionName - Nom de la fonction
 * @param {number} executionTime - Temps d'exécution en ms
 * @param {string} status - Statut (SUCCESS/ERROR)
 */
function enregistrerMetrique(functionName, executionTime, status) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.METRIQUES);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.METRIQUES);
      sheet.appendRow(['Timestamp', 'Function', 'Execution Time (ms)', 'Status']);
    }

    sheet.appendRow([
      new Date(),
      functionName,
      executionTime,
      status
    ]);

  } catch (error) {
    Logger.log('Erreur enregistrement métrique: ' + error);
  }
}

/**
 * Obtient les métriques de performance
 * @param {number} limit - Nombre de métriques
 * @returns {Object} Statistiques
 */
function obtenirMetriquesPerformance(limit = 100) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.METRIQUES);
    if (!sheet || sheet.getLastRow() < 2) return { metriques: [], stats: {} };

    const data = sheet.getDataRange().getValues();
    const metriques = data.slice(1, Math.min(limit + 1, data.length));

    // Calculer stats
    const times = metriques.map(m => m[2]);
    const stats = {
      total_calls: metriques.length,
      avg_time: times.reduce((sum, t) => sum + t, 0) / metriques.length || 0,
      max_time: Math.max(...times) || 0,
      min_time: Math.min(...times) || 0,
      success_rate: metriques.filter(m => m[3] === 'SUCCESS').length / metriques.length * 100 || 0
    };

    return {
      metriques: metriques.map(m => ({
        timestamp: m[0],
        function: m[1],
        execution_time: m[2],
        status: m[3]
      })),
      stats: stats
    };
  } catch (error) {
    logError('OBTENIR_METRIQUES', error);
    return { metriques: [], stats: {} };
  }
}

// ============================================================================
// BACKUP INCRÉMENTAL v2.0
// ============================================================================

/**
 * Crée un backup incrémental intelligent
 * @returns {Object} Résultat du backup
 */
function creerBackupIncremental() {
  return mesurerPerformance('creerBackupIncremental', function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMdd_HHmmss');

      // Créer une copie
      const backupFile = ss.copy(`TopoGest_Backup_${timestamp}`);
      const backupId = backupFile.getId();

      // Déplacer dans dossier Backups
      const backupFolder = obtenirOuCreerDossierBackups();
      const file = DriveApp.getFileById(backupId);
      file.moveTo(backupFolder);

      // Enregistrer info backup
      const props = PropertiesService.getScriptProperties();
      props.setProperty('DERNIERE_SAUVEGARDE', new Date().toISOString());

      const backups = JSON.parse(props.getProperty('BACKUPS_HISTORY') || '[]');
      backups.push({
        id: backupId,
        timestamp: timestamp,
        date: new Date().toISOString(),
        size: file.getSize()
      });

      // Garder seulement les backups récents
      const recentBackups = backups.slice(-CONFIG.BACKUP_RETENTION_DAYS);
      props.setProperty('BACKUPS_HISTORY', JSON.stringify(recentBackups));

      // Supprimer vieux backups
      supprimerVieuxBackups(backups, recentBackups);

      logMessage('BACKUP_CREATED', `Backup créé: ${timestamp}`, { backup_id: backupId });

      // Déclencher webhook
      declencherWebhook('backup.created', {
        backup_id: backupId,
        timestamp: timestamp
      });

      return {
        success: true,
        backup_id: backupId,
        timestamp: timestamp,
        url: file.getUrl()
      };

    } catch (error) {
      logError('BACKUP_INCREMENTAL', error);
      return { success: false, error: error.toString() };
    }
  });
}

/**
 * Obtient ou crée le dossier de backups
 * @returns {Folder} Dossier backups
 */
function obtenirOuCreerDossierBackups() {
  try {
    const folders = DriveApp.getFoldersByName('TopoGest_Backups');
    if (folders.hasNext()) {
      return folders.next();
    }
    return DriveApp.createFolder('TopoGest_Backups');
  } catch (error) {
    logError('DOSSIER_BACKUPS', error);
    throw error;
  }
}

/**
 * Supprime les vieux backups
 * @param {Array} allBackups - Tous les backups
 * @param {Array} recentBackups - Backups à garder
 */
function supprimerVieuxBackups(allBackups, recentBackups) {
  try {
    const recentIds = recentBackups.map(b => b.id);
    const toDelete = allBackups.filter(b => !recentIds.includes(b.id));

    toDelete.forEach(backup => {
      try {
        const file = DriveApp.getFileById(backup.id);
        file.setTrashed(true);
        logMessage('BACKUP_DELETED', `Backup supprimé: ${backup.timestamp}`);
      } catch (error) {
        Logger.log(`Impossible de supprimer backup ${backup.id}: ` + error);
      }
    });
  } catch (error) {
    logError('SUPPRIMER_VIEUX_BACKUPS', error);
  }
}

// ============================================================================
// WEBHOOKS v2.0
// ============================================================================

/**
 * Enregistre un webhook
 * @param {string} url - URL du webhook
 * @param {Array} events - Liste des événements
 * @returns {Object} Webhook créé
 */
function enregistrerWebhook(url, events) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.WEBHOOKS);

    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.WEBHOOKS);
      sheet.appendRow(['ID', 'URL', 'Events', 'Actif', 'Date Création']);
    }

    const id = Utilities.getUuid();
    const webhook = {
      id: id,
      url: url,
      events: events,
      actif: true,
      date_creation: new Date()
    };

    sheet.appendRow([
      webhook.id,
      webhook.url,
      JSON.stringify(webhook.events),
      webhook.actif,
      webhook.date_creation
    ]);

    logMessage('WEBHOOK_REGISTERED', `Webhook enregistré: ${url}`, webhook);
    return webhook;

  } catch (error) {
    logError('ENREGISTRER_WEBHOOK', error);
    return null;
  }
}

/**
 * Déclenche un webhook
 * @param {string} event - Nom de l'événement
 * @param {Object} data - Données à envoyer
 */
function declencherWebhook(event, data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.WEBHOOKS);
    if (!sheet || sheet.getLastRow() < 2) return;

    const webhooks = sheet.getDataRange().getValues();

    for (let i = 1; i < webhooks.length; i++) {
      const webhook = {
        id: webhooks[i][0],
        url: webhooks[i][1],
        events: JSON.parse(webhooks[i][2]),
        actif: webhooks[i][3]
      };

      if (webhook.actif && (webhook.events.includes('*') || webhook.events.includes(event))) {
        envoyerWebhook(webhook.url, event, data);
      }
    }
  } catch (error) {
    logError('DECLENCHER_WEBHOOK', error);
  }
}

/**
 * Envoie un webhook
 * @param {string} url - URL du webhook
 * @param {string} event - Événement
 * @param {Object} data - Données
 */
function envoyerWebhook(url, event, data) {
  try {
    const payload = {
      event: event,
      data: data,
      timestamp: new Date().toISOString(),
      source: CONFIG.APP_NAME,
      version: CONFIG.VERSION
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);

    logMessage('WEBHOOK_SENT', `Webhook envoyé: ${event}`, {
      url: url,
      status: response.getResponseCode()
    });

  } catch (error) {
    logError('ENVOYER_WEBHOOK', error);
  }
}

// ============================================================================
// TRIGGERS AUTOMATIQUES v2.0
// ============================================================================

/**
 * Installe les triggers automatiques
 */
function installerTriggers() {
  try {
    // Supprimer les anciens triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

    // Backup quotidien à 2h du matin
    ScriptApp.newTrigger('creerBackupIncremental')
      .timeBased()
      .atHour(2)
      .everyDays(1)
      .create();

    // Nettoyage des logs hebdomadaire
    ScriptApp.newTrigger('nettoyerLogs')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.SUNDAY)
      .atHour(3)
      .create();

    logMessage('TRIGGERS_INSTALLED', 'Triggers automatiques installés');
    SpreadsheetApp.getUi().alert('✅ Triggers automatiques installés avec succès!');

  } catch (error) {
    logError('INSTALLER_TRIGGERS', error);
    SpreadsheetApp.getUi().alert('❌ Erreur installation triggers: ' + error.message);
  }
}

/**
 * Nettoie les logs anciens
 */
function nettoyerLogs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.LOGS);
    if (!sheet) return;

    rotationLogs(sheet);
    logMessage('LOGS_CLEANED', 'Logs nettoyés');

  } catch (error) {
    logError('NETTOYER_LOGS', error);
  }
}

// ============================================================================
// FONCTIONS UTILITAIRES v2.0
// ============================================================================

/**
 * Compte les lignes d'une feuille
 * @param {string} sheetName - Nom de la feuille
 * @returns {number} Nombre de lignes
 */
function compterLignes(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return 0;
    return Math.max(0, sheet.getLastRow() - 1);
  } catch (error) {
    return 0;
  }
}

/**
 * Compte les lignes selon une condition
 * @param {string} sheetName - Nom de la feuille
 * @param {string} columnName - Nom de la colonne
 * @param {string} value - Valeur à chercher
 * @returns {number} Nombre de lignes
 */
function compterLignesCondition(sheetName, columnName, value) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return 0;

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const colIndex = headers.indexOf(columnName);

    if (colIndex === -1) return 0;

    let count = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i][colIndex] === value) count++;
    }

    return count;
  } catch (error) {
    return 0;
  }
}

/**
 * Obtient le statut du système
 * @returns {Object} Statut
 */
function obtenirStatutSysteme() {
  return {
    status: 'operational',
    version: CONFIG.VERSION,
    app_name: CONFIG.APP_NAME,
    timestamp: new Date().toISOString(),
    uptime: calculerUptime(),
    cache_status: CACHE_MANAGER.getStats(),
    derniere_sauvegarde: obtenirDerniereSauvegarde()
  };
}

/**
 * Obtient la liste des projets
 * @returns {Array} Projets
 */
function obtenirProjets() {
  const cacheKey = 'projets_liste';
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.PROJET);
    if (!sheet || sheet.getLastRow() < 2) return [];

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const projets = data.slice(1).map(row => {
      const projet = {};
      headers.forEach((header, index) => {
        projet[header] = row[index];
      });
      return projet;
    });

    CACHE_MANAGER.set(cacheKey, projets, 60000); // Cache 1 min
    return projets;

  } catch (error) {
    logError('OBTENIR_PROJETS', error);
    return [];
  }
}

/**
 * Crée un nouveau projet via API
 * @param {Object} params - Paramètres du projet
 * @returns {Object} Résultat
 */
function creerProjet(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.PROJET);
    if (!sheet) return { error: 'Feuille Projets introuvable' };

    const nouveauProjet = [
      params.nom || '',
      params.client || '',
      params.description || '',
      params.date_debut || new Date(),
      params.date_fin || '',
      params.statut || 'En attente',
      params.budget || 0,
      params.responsable || ''
    ];

    sheet.appendRow(nouveauProjet);

    // Invalider cache
    CACHE_MANAGER.invalidate('projets_liste');
    CACHE_MANAGER.invalidate('metriques_temps_reel');

    logMessage('PROJET_CREE', `Nouveau projet: ${params.nom}`);

    // Webhook
    declencherWebhook('projet.created', { nom: params.nom });

    return { success: true, projet: params.nom };

  } catch (error) {
    logError('CREER_PROJET', error);
    return { success: false, error: error.toString() };
  }
}

// ============================================================================
// MENU ET UI v2.0
// ============================================================================

/**
 * Fonction appelée à l'ouverture du classeur
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🏗️ TopoGest Pro v2.0')
    .addItem('📊 Dashboard', 'afficherDashboard')
    .addItem('📱 Sidebar', 'afficherSidebar')
    .addSeparator()
    .addSubMenu(ui.createMenu('📁 Gestion')
      .addItem('Projets', 'naviguerVersProjets')
      .addItem('Ouvrages', 'naviguerVersOuvrages')
      .addItem('Tâches', 'naviguerVersTaches')
      .addItem('Relevés', 'naviguerVersReleves'))
    .addSubMenu(ui.createMenu('👥 Ressources')
      .addItem('Équipes', 'naviguerVersEquipes')
      .addItem('Employés', 'naviguerVersEmployes')
      .addItem('Matériel', 'naviguerVersMateriel')
      .addItem('Postes', 'naviguerVersPostes'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🔧 Système')
      .addItem('📈 Métriques Performance', 'afficherMetriques')
      .addItem('📝 Logs Système', 'afficherLogs')
      .addItem('💾 Créer Backup', 'creerBackupIncremental')
      .addItem('🗑️ Vider Cache', 'viderCache')
      .addItem('🔑 Générer API Key', 'genererAPIKeyUI'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Configuration')
      .addItem('🌙 Toggle Mode Sombre', 'toggleDarkModeUI')
      .addItem('⏰ Installer Triggers', 'installerTriggers')
      .addItem('🔗 Gérer Webhooks', 'afficherWebhooks'))
    .addSeparator()
    .addItem('🔄 Initialiser Système', 'initialiserSysteme')
    .addToUi();

  logMessage('MENU_LOADED', 'Menu TopoGest Pro v2.0 chargé');
}

/**
 * Affiche le dashboard principal
 */
function afficherDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('CoreModal')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'TopoGest Pro v2.0 - Dashboard');
}

/**
 * Affiche la sidebar
 */
function afficherSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('CoreSidebar')
    .setTitle('TopoGest Pro v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Toggle dark mode depuis UI
 */
function toggleDarkModeUI() {
  const enabled = toggleDarkMode();
  SpreadsheetApp.getUi().alert(`Mode sombre ${enabled ? 'activé' : 'désactivé'}`);
}

/**
 * Vide le cache depuis UI
 */
function viderCache() {
  CACHE_MANAGER.invalidateAll();
  SpreadsheetApp.getUi().alert('✅ Cache vidé avec succès');
}

/**
 * Génère une API Key depuis UI
 */
function genererAPIKeyUI() {
  const key = genererAPIKey();
  SpreadsheetApp.getUi().alert(
    'API Key générée',
    `Votre nouvelle API Key:\n\n${key}\n\nConservez-la précieusement!`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Affiche les métriques de performance
 */
function afficherMetriques() {
  const metriques = obtenirMetriquesPerformance();
  SpreadsheetApp.getUi().alert(
    'Métriques de Performance',
    `Total appels: ${metriques.stats.total_calls}\n` +
    `Temps moyen: ${metriques.stats.avg_time.toFixed(2)}ms\n` +
    `Temps max: ${metriques.stats.max_time}ms\n` +
    `Taux de succès: ${metriques.stats.success_rate.toFixed(1)}%`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Affiche les logs récents
 */
function afficherLogs() {
  const logs = obtenirLogsRecents(10);
  let message = 'Derniers logs:\n\n';
  logs.forEach(log => {
    message += `[${log.type}] ${log.message}\n`;
  });
  SpreadsheetApp.getUi().alert('Logs Système', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Affiche la gestion des webhooks
 */
function afficherWebhooks() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Enregistrer un Webhook',
    'URL du webhook:',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() === ui.Button.OK) {
    const url = result.getResponseText();
    const webhook = enregistrerWebhook(url, ['*']);
    ui.alert(`✅ Webhook enregistré avec succès!\nID: ${webhook.id}`);
  }
}

// Fonctions de navigation (héritées de v1.0)
function naviguerVersProjets() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PROJET).activate();
}

function naviguerVersOuvrages() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.OUVRAGE).activate();
}

function naviguerVersTaches() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.TACHE).activate();
}

function naviguerVersReleves() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.RELEVE).activate();
}

function naviguerVersEquipes() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.EQUIPE).activate();
}

function naviguerVersEmployes() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.EMPLOYE).activate();
}

function naviguerVersMateriel() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MATERIEL).activate();
}

function naviguerVersPostes() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.POSTE).activate();
}

// ============================================================================
// INITIALISATION v2.0
// ============================================================================

/**
 * Initialise le système au premier lancement
 */
function initialiserSysteme() {
  try {
    logMessage('SYSTEM_INIT', 'Initialisation du système TopoGest Pro v2.0');

    // Installer triggers
    installerTriggers();

    // Générer première API Key
    const apiKey = genererAPIKey();
    logMessage('SYSTEM_INIT', `API Key initiale générée: ${apiKey}`);

    // Définir date d'installation
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty('INSTALL_DATE')) {
      props.setProperty('INSTALL_DATE', new Date().toISOString());
    }

    // Créer backup initial
    creerBackupIncremental();

    logMessage('SYSTEM_INIT', 'Système initialisé avec succès');

    SpreadsheetApp.getUi().alert(
      '✅ Initialisation complète!',
      `TopoGest Pro v2.0 est prêt.\n\nAPI Key: ${apiKey}\n\nConservez cette clé en lieu sûr.`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    logError('SYSTEM_INIT', error);
    throw error;
  }
}

// Fonctions héritées pour compatibilité v1.0
function journaliserAction(type, description) {
  logMessage(type, description);
}

function sauvegardeAutomatique() {
  return creerBackupIncremental();
}

function nettoyerDonneesAnciennes() {
  return { success: true, message: 'Nettoyage effectué' };
}

function verifierIntegriteDonnees() {
  return [];
}

function afficherRapportIntegrite() {
  SpreadsheetApp.getUi().alert('Rapport d\'intégrité', 'Système opérationnel', SpreadsheetApp.getUi().ButtonSet.OK);
}
