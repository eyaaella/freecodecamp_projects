// ============================================================================
// WARAP_Logs_Manager.gs
// Gestion centralisée des logs pour la plateforme WARAP
// ============================================================================

/**
 * Constantes pour la gestion des logs
 */
const LOGS_CONFIG = {
  SHEET_NAME: 'Logs_WARAP',
  COLUMNS: {
    ID_LOG: 0,
    TIMESTAMP: 1,
    TYPE_EVENEMENT: 2,
    MODULE: 3,
    ACTION_EFFECTUEE: 4,
    UTILISATEUR_EMAIL: 5,
    UTILISATEUR_ROLE: 6,
    ENTITE_TYPE: 7,
    ENTITE_ID: 8,
    ANCIENNES_VALEURS: 9,
    NOUVELLES_VALEURS: 10,
    IP_ADRESSE: 11,
    NAVIGATEUR_AGENT: 12,
    STATUT: 13,
    MESSAGE_ERREUR: 14,
    NIVEAU_SECURITE: 15
  },
  TYPES_EVENEMENT: ['Création', 'Modification', 'Suppression', 'Connexion', 'Erreur', 'Alerte'],
  STATUTS: ['Succès', 'Erreur', 'Avertissement'],
  NIVEAUX_SECURITE: ['Public', 'Privé', 'Confidentiel', 'Critique']
};

/**
 * Crée la feuille Logs_WARAP si elle n'existe pas
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} La feuille créée ou existante
 */
function createLogsSheetIfNotExists() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(LOGS_CONFIG.SHEET_NAME);

  if (!sheet) {
    // Créer la feuille
    sheet = ss.insertSheet(LOGS_CONFIG.SHEET_NAME);

    // Définir les en-têtes
    const headers = [
      'ID_Log',
      'Timestamp',
      'Type_Evenement',
      'Module',
      'Action_Effectuee',
      'Utilisateur_Email',
      'Utilisateur_Role',
      'Entite_Type',
      'Entite_ID',
      'Anciennes_Valeurs',
      'Nouvelles_Valeurs',
      'IP_Adresse',
      'Navigateur_Agent',
      'Statut',
      'Message_Erreur',
      'Niveau_Securite'
    ];

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);

    // Formater les en-têtes
    headerRange.setBackground('#1a237e')
              .setFontColor('#ffffff')
              .setFontWeight('bold')
              .setHorizontalAlignment('center')
              .setWrap(true);

    // Définir les largeurs de colonnes
    const columnWidths = [140, 150, 130, 120, 200, 200, 120, 120, 120, 250, 250, 120, 200, 100, 250, 130];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // Figer la ligne d'en-tête
    sheet.setFrozenRows(1);

    // Ajouter les validations de données
    addDataValidations(sheet);

    // Ajouter les formules de surveillance
    addSurveillanceFormulas(sheet);

    Logger.log('Feuille Logs_WARAP créée avec succès');
  }

  return sheet;
}

/**
 * Ajoute les validations de données aux colonnes appropriées
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La feuille des logs
 */
function addDataValidations(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), 2);

  // Validation pour Type_Evenement (colonne C)
  const typeEventRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LOGS_CONFIG.TYPES_EVENEMENT, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 3, lastRow, 1).setDataValidation(typeEventRule);

  // Validation pour Statut (colonne N)
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LOGS_CONFIG.STATUTS, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 14, lastRow, 1).setDataValidation(statutRule);

  // Validation pour Niveau_Securite (colonne P)
  const niveauSecuriteRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LOGS_CONFIG.NIVEAUX_SECURITE, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 16, lastRow, 1).setDataValidation(niveauSecuriteRule);
}

/**
 * Ajoute les formules de surveillance dans une zone dédiée
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La feuille des logs
 */
function addSurveillanceFormulas(sheet) {
  // Ajouter les formules de surveillance dans les colonnes S-V (zone d'analyse)
  const startRow = 2;

  // En-têtes de surveillance
  sheet.getRange('S1').setValue('SURVEILLANCE - Connexions Échouées Aujourd\'hui');
  sheet.getRange('T1').setValue('SURVEILLANCE - Modifications Sensibles Aujourd\'hui');
  sheet.getRange('U1').setValue('SURVEILLANCE - Total Événements Aujourd\'hui');

  // Formules
  sheet.getRange('S2').setFormula('=COUNTIFS(C:C,"Connexion",N:N,"Erreur",B:B,">="&TODAY())');
  sheet.getRange('T2').setFormula('=COUNTIFS(D:D,"Transactions",C:C,"Modification",B:B,">="&TODAY())');
  sheet.getRange('U2').setFormula('=COUNTIF(B:B,">="&TODAY())');

  // Formater la zone de surveillance
  sheet.getRange('S1:U1').setBackground('#ff6f00').setFontColor('#ffffff').setFontWeight('bold');
  sheet.getRange('S2:U2').setBackground('#fff3e0').setNumberFormat('0');
}

/**
 * Enregistre une action dans les logs
 * @param {string} module Le module concerné (Clients/Transactions/Matching/etc.)
 * @param {string} action L'action effectuée
 * @param {Object} data Les données de l'action
 * @returns {string} L'ID du log créé
 */
function logAction(module, action, data = {}) {
  try {
    const sheet = createLogsSheetIfNotExists();
    const user = Session.getActiveUser().getEmail();

    const logEntry = {
      typeEvenement: data.typeEvenement || 'Modification',
      module: module,
      action: action,
      utilisateurEmail: user,
      entiteType: data.entiteType || '',
      entiteId: data.entiteId || '',
      anciennesValeurs: data.anciennesValeurs ? JSON.stringify(data.anciennesValeurs) : '',
      nouvellesValeurs: data.nouvellesValeurs ? JSON.stringify(data.nouvellesValeurs) : '',
      ipAdresse: data.ipAdresse || getClientIP(),
      navigateurAgent: data.navigateurAgent || getNavigateurAgent(),
      statut: 'Succès',
      messageErreur: '',
      niveauSecurite: data.niveauSecurite || 'Privé'
    };

    return writeLogEntry(sheet, logEntry);
  } catch (error) {
    Logger.log('Erreur lors de l\'enregistrement de l\'action: ' + error.toString());
    return null;
  }
}

/**
 * Enregistre une erreur dans les logs
 * @param {string} module Le module où l'erreur s'est produite
 * @param {Error|string} error L'erreur à enregistrer
 * @param {Object} data Données supplémentaires
 * @returns {string} L'ID du log créé
 */
function logError(module, error, data = {}) {
  try {
    const sheet = createLogsSheetIfNotExists();
    const user = Session.getActiveUser().getEmail();
    const errorMessage = error instanceof Error ? error.toString() : error;

    const logEntry = {
      typeEvenement: 'Erreur',
      module: module,
      action: data.action || 'Erreur système',
      utilisateurEmail: user,
      entiteType: data.entiteType || '',
      entiteId: data.entiteId || '',
      anciennesValeurs: '',
      nouvellesValeurs: data.errorDetails ? JSON.stringify(data.errorDetails) : '',
      ipAdresse: data.ipAdresse || getClientIP(),
      navigateurAgent: data.navigateurAgent || getNavigateurAgent(),
      statut: 'Erreur',
      messageErreur: errorMessage,
      niveauSecurite: data.niveauSecurite || 'Critique'
    };

    return writeLogEntry(sheet, logEntry);
  } catch (e) {
    Logger.log('Erreur critique lors de l\'enregistrement de l\'erreur: ' + e.toString());
    return null;
  }
}

/**
 * Enregistre un événement de sécurité
 * @param {string} event Description de l'événement
 * @param {string} severity Sévérité (Public/Privé/Confidentiel/Critique)
 * @param {Object} data Données supplémentaires
 * @returns {string} L'ID du log créé
 */
function logSecurityEvent(event, severity = 'Critique', data = {}) {
  try {
    const sheet = createLogsSheetIfNotExists();
    const user = Session.getActiveUser().getEmail();

    const logEntry = {
      typeEvenement: 'Alerte',
      module: data.module || 'Sécurité',
      action: event,
      utilisateurEmail: user,
      entiteType: data.entiteType || 'Système',
      entiteId: data.entiteId || '',
      anciennesValeurs: '',
      nouvellesValeurs: data.details ? JSON.stringify(data.details) : '',
      ipAdresse: data.ipAdresse || getClientIP(),
      navigateurAgent: data.navigateurAgent || getNavigateurAgent(),
      statut: data.statut || 'Avertissement',
      messageErreur: data.message || '',
      niveauSecurite: severity
    };

    return writeLogEntry(sheet, logEntry);
  } catch (error) {
    Logger.log('Erreur lors de l\'enregistrement de l\'événement de sécurité: ' + error.toString());
    return null;
  }
}

/**
 * Écrit une entrée de log dans la feuille
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La feuille des logs
 * @param {Object} logEntry L'entrée à enregistrer
 * @returns {string} L'ID du log créé
 */
function writeLogEntry(sheet, logEntry) {
  const nextRow = sheet.getLastRow() + 1;
  const logId = 'LOG' + Utilities.formatString('%011d', nextRow - 1);
  const timestamp = new Date();

  // Obtenir le rôle de l'utilisateur (formule VLOOKUP sera ajoutée)
  const role = ''; // Sera calculé par formule

  const rowData = [
    logId,
    timestamp,
    logEntry.typeEvenement,
    logEntry.module,
    logEntry.action,
    logEntry.utilisateurEmail,
    '', // Role - formule ajoutée ci-dessous
    logEntry.entiteType,
    logEntry.entiteId,
    logEntry.anciennesValeurs,
    logEntry.nouvellesValeurs,
    logEntry.ipAdresse,
    logEntry.navigateurAgent,
    logEntry.statut,
    logEntry.messageErreur,
    logEntry.niveauSecurite
  ];

  sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);

  // Ajouter la formule VLOOKUP pour le rôle (colonne G)
  const roleFormula = `=IFERROR(VLOOKUP(F${nextRow},Utilisateurs!$A:$C,3,FALSE),"")`;
  sheet.getRange(nextRow, 7).setFormula(roleFormula);

  // Formater la ligne
  formatLogRow(sheet, nextRow, logEntry.statut, logEntry.niveauSecurite);

  return logId;
}

/**
 * Formate une ligne de log selon son statut et son niveau de sécurité
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La feuille des logs
 * @param {number} row Le numéro de ligne
 * @param {string} statut Le statut du log
 * @param {string} niveauSecurite Le niveau de sécurité
 */
function formatLogRow(sheet, row, statut, niveauSecurite) {
  const range = sheet.getRange(row, 1, 1, 16);

  // Couleur selon le statut
  if (statut === 'Erreur') {
    range.setBackground('#ffebee');
  } else if (statut === 'Avertissement') {
    range.setBackground('#fff3e0');
  }

  // Mettre en gras si niveau critique
  if (niveauSecurite === 'Critique') {
    range.setFontWeight('bold');
  }

  // Formater la date
  sheet.getRange(row, 2).setNumberFormat('dd/mm/yyyy hh:mm:ss');
}

/**
 * Récupère les logs d'un utilisateur pour une période donnée
 * @param {string} email L'email de l'utilisateur
 * @param {number} period Nombre de jours à récupérer (par défaut 30)
 * @returns {Array} Les logs de l'utilisateur
 */
function getLogsByUser(email, period = 30) {
  const sheet = createLogsSheetIfNotExists();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - period);

  const logs = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[LOGS_CONFIG.COLUMNS.TIMESTAMP]);
    const userEmail = row[LOGS_CONFIG.COLUMNS.UTILISATEUR_EMAIL];

    if (userEmail === email && timestamp >= dateLimit) {
      logs.push({
        idLog: row[LOGS_CONFIG.COLUMNS.ID_LOG],
        timestamp: timestamp,
        typeEvenement: row[LOGS_CONFIG.COLUMNS.TYPE_EVENEMENT],
        module: row[LOGS_CONFIG.COLUMNS.MODULE],
        action: row[LOGS_CONFIG.COLUMNS.ACTION_EFFECTUEE],
        utilisateurEmail: userEmail,
        utilisateurRole: row[LOGS_CONFIG.COLUMNS.UTILISATEUR_ROLE],
        entiteType: row[LOGS_CONFIG.COLUMNS.ENTITE_TYPE],
        entiteId: row[LOGS_CONFIG.COLUMNS.ENTITE_ID],
        anciennesValeurs: row[LOGS_CONFIG.COLUMNS.ANCIENNES_VALEURS],
        nouvellesValeurs: row[LOGS_CONFIG.COLUMNS.NOUVELLES_VALEURS],
        ipAdresse: row[LOGS_CONFIG.COLUMNS.IP_ADRESSE],
        navigateurAgent: row[LOGS_CONFIG.COLUMNS.NAVIGATEUR_AGENT],
        statut: row[LOGS_CONFIG.COLUMNS.STATUT],
        messageErreur: row[LOGS_CONFIG.COLUMNS.MESSAGE_ERREUR],
        niveauSecurite: row[LOGS_CONFIG.COLUMNS.NIVEAU_SECURITE]
      });
    }
  }

  return logs;
}

/**
 * Récupère les logs d'un module pour une période donnée
 * @param {string} module Le nom du module
 * @param {number} period Nombre de jours à récupérer (par défaut 30)
 * @returns {Array} Les logs du module
 */
function getLogsByModule(module, period = 30) {
  const sheet = createLogsSheetIfNotExists();
  const data = sheet.getDataRange().getValues();
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - period);

  const logs = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[LOGS_CONFIG.COLUMNS.TIMESTAMP]);
    const moduleLog = row[LOGS_CONFIG.COLUMNS.MODULE];

    if (moduleLog === module && timestamp >= dateLimit) {
      logs.push({
        idLog: row[LOGS_CONFIG.COLUMNS.ID_LOG],
        timestamp: timestamp,
        typeEvenement: row[LOGS_CONFIG.COLUMNS.TYPE_EVENEMENT],
        module: moduleLog,
        action: row[LOGS_CONFIG.COLUMNS.ACTION_EFFECTUEE],
        utilisateurEmail: row[LOGS_CONFIG.COLUMNS.UTILISATEUR_EMAIL],
        utilisateurRole: row[LOGS_CONFIG.COLUMNS.UTILISATEUR_ROLE],
        entiteType: row[LOGS_CONFIG.COLUMNS.ENTITE_TYPE],
        entiteId: row[LOGS_CONFIG.COLUMNS.ENTITE_ID],
        statut: row[LOGS_CONFIG.COLUMNS.STATUT],
        niveauSecurite: row[LOGS_CONFIG.COLUMNS.NIVEAU_SECURITE]
      });
    }
  }

  return logs;
}

/**
 * Analyse l'activité d'un utilisateur
 * @param {string} email L'email de l'utilisateur
 * @returns {Object} Les statistiques d'activité
 */
function analyzeUserActivity(email) {
  const logs = getLogsByUser(email, 30);

  const stats = {
    totalActions: logs.length,
    actionsByType: {},
    actionsByModule: {},
    errors: 0,
    warnings: 0,
    lastActivity: null,
    mostActiveModule: '',
    activityByDay: {}
  };

  logs.forEach(log => {
    // Par type
    stats.actionsByType[log.typeEvenement] = (stats.actionsByType[log.typeEvenement] || 0) + 1;

    // Par module
    stats.actionsByModule[log.module] = (stats.actionsByModule[log.module] || 0) + 1;

    // Erreurs et avertissements
    if (log.statut === 'Erreur') stats.errors++;
    if (log.statut === 'Avertissement') stats.warnings++;

    // Dernière activité
    if (!stats.lastActivity || log.timestamp > stats.lastActivity) {
      stats.lastActivity = log.timestamp;
    }

    // Activité par jour
    const day = Utilities.formatDate(log.timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    stats.activityByDay[day] = (stats.activityByDay[day] || 0) + 1;
  });

  // Module le plus actif
  let maxActions = 0;
  for (const [module, count] of Object.entries(stats.actionsByModule)) {
    if (count > maxActions) {
      maxActions = count;
      stats.mostActiveModule = module;
    }
  }

  return stats;
}

/**
 * Recherche dans les logs avec filtres multiples
 * @param {Object} filters Les filtres à appliquer
 * @returns {Array} Les logs correspondants
 */
function searchLogs(filters = {}) {
  const sheet = createLogsSheetIfNotExists();
  const data = sheet.getDataRange().getValues();

  const logs = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let match = true;

    // Filtre par date
    if (filters.dateDebut || filters.dateFin) {
      const timestamp = new Date(row[LOGS_CONFIG.COLUMNS.TIMESTAMP]);
      if (filters.dateDebut && timestamp < new Date(filters.dateDebut)) match = false;
      if (filters.dateFin && timestamp > new Date(filters.dateFin)) match = false;
    }

    // Filtre par type d'événement
    if (filters.typeEvenement && row[LOGS_CONFIG.COLUMNS.TYPE_EVENEMENT] !== filters.typeEvenement) {
      match = false;
    }

    // Filtre par module
    if (filters.module && row[LOGS_CONFIG.COLUMNS.MODULE] !== filters.module) {
      match = false;
    }

    // Filtre par utilisateur
    if (filters.utilisateur && row[LOGS_CONFIG.COLUMNS.UTILISATEUR_EMAIL] !== filters.utilisateur) {
      match = false;
    }

    // Filtre par statut
    if (filters.statut && row[LOGS_CONFIG.COLUMNS.STATUT] !== filters.statut) {
      match = false;
    }

    // Filtre par niveau de sécurité
    if (filters.niveauSecurite && row[LOGS_CONFIG.COLUMNS.NIVEAU_SECURITE] !== filters.niveauSecurite) {
      match = false;
    }

    // Recherche textuelle
    if (filters.searchText) {
      const searchableFields = [
        row[LOGS_CONFIG.COLUMNS.ACTION_EFFECTUEE],
        row[LOGS_CONFIG.COLUMNS.MESSAGE_ERREUR],
        row[LOGS_CONFIG.COLUMNS.ANCIENNES_VALEURS],
        row[LOGS_CONFIG.COLUMNS.NOUVELLES_VALEURS]
      ].join(' ').toLowerCase();

      if (!searchableFields.includes(filters.searchText.toLowerCase())) {
        match = false;
      }
    }

    if (match) {
      logs.push({
        idLog: row[LOGS_CONFIG.COLUMNS.ID_LOG],
        timestamp: row[LOGS_CONFIG.COLUMNS.TIMESTAMP],
        typeEvenement: row[LOGS_CONFIG.COLUMNS.TYPE_EVENEMENT],
        module: row[LOGS_CONFIG.COLUMNS.MODULE],
        action: row[LOGS_CONFIG.COLUMNS.ACTION_EFFECTUEE],
        utilisateurEmail: row[LOGS_CONFIG.COLUMNS.UTILISATEUR_EMAIL],
        utilisateurRole: row[LOGS_CONFIG.COLUMNS.UTILISATEUR_ROLE],
        entiteType: row[LOGS_CONFIG.COLUMNS.ENTITE_TYPE],
        entiteId: row[LOGS_CONFIG.COLUMNS.ENTITE_ID],
        anciennesValeurs: row[LOGS_CONFIG.COLUMNS.ANCIENNES_VALEURS],
        nouvellesValeurs: row[LOGS_CONFIG.COLUMNS.NOUVELLES_VALEURS],
        ipAdresse: row[LOGS_CONFIG.COLUMNS.IP_ADRESSE],
        navigateurAgent: row[LOGS_CONFIG.COLUMNS.NAVIGATEUR_AGENT],
        statut: row[LOGS_CONFIG.COLUMNS.STATUT],
        messageErreur: row[LOGS_CONFIG.COLUMNS.MESSAGE_ERREUR],
        niveauSecurite: row[LOGS_CONFIG.COLUMNS.NIVEAU_SECURITE]
      });
    }
  }

  return logs;
}

/**
 * Obtient l'IP du client (simulation car non disponible dans Apps Script)
 * @returns {string} L'adresse IP simulée
 */
function getClientIP() {
  // Apps Script ne peut pas obtenir l'IP réelle du client
  // On retourne une valeur par défaut
  return 'N/A';
}

/**
 * Obtient le user agent du navigateur (simulation)
 * @returns {string} Le user agent
 */
function getNavigateurAgent() {
  // Apps Script ne peut pas obtenir le user agent réel
  // On retourne une valeur par défaut avec des infos sur le contexte
  return 'Google Apps Script';
}

/**
 * Exporte les logs au format CSV
 * @param {Object} filters Les filtres à appliquer
 * @returns {string} Le contenu CSV
 */
function exportLogsToCSV(filters = {}) {
  const logs = searchLogs(filters);

  const csvLines = [];
  // En-tête
  csvLines.push('ID_Log,Timestamp,Type_Evenement,Module,Action,Utilisateur_Email,Utilisateur_Role,Entite_Type,Entite_ID,Statut,Niveau_Securite,Message_Erreur');

  // Données
  logs.forEach(log => {
    const line = [
      log.idLog,
      Utilities.formatDate(new Date(log.timestamp), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss'),
      log.typeEvenement,
      log.module,
      log.action,
      log.utilisateurEmail,
      log.utilisateurRole,
      log.entiteType,
      log.entiteId,
      log.statut,
      log.niveauSecurite,
      `"${(log.messageErreur || '').replace(/"/g, '""')}"`
    ].join(',');
    csvLines.push(line);
  });

  return csvLines.join('\n');
}

/**
 * Détecte les activités suspectes
 * @returns {Array} Les activités suspectes détectées
 */
function detectSuspiciousActivity() {
  const sheet = createLogsSheetIfNotExists();
  const data = sheet.getDataRange().getValues();
  const suspicious = [];
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Compter les actions par utilisateur dans les dernières 24h
  const userActions = {};
  const userErrors = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[LOGS_CONFIG.COLUMNS.TIMESTAMP]);

    if (timestamp >= last24Hours) {
      const email = row[LOGS_CONFIG.COLUMNS.UTILISATEUR_EMAIL];
      const statut = row[LOGS_CONFIG.COLUMNS.STATUT];

      userActions[email] = (userActions[email] || 0) + 1;

      if (statut === 'Erreur') {
        userErrors[email] = (userErrors[email] || 0) + 1;
      }
    }
  }

  // Détecter les anomalies
  for (const [email, count] of Object.entries(userActions)) {
    // Plus de 100 actions en 24h
    if (count > 100) {
      suspicious.push({
        type: 'Activité anormalement élevée',
        email: email,
        details: `${count} actions dans les dernières 24 heures`,
        severity: 'Critique'
      });
    }

    // Plus de 10 erreurs en 24h
    if (userErrors[email] > 10) {
      suspicious.push({
        type: 'Erreurs répétées',
        email: email,
        details: `${userErrors[email]} erreurs dans les dernières 24 heures`,
        severity: 'Critique'
      });
    }
  }

  return suspicious;
}

/**
 * Obtient les statistiques globales des logs
 * @returns {Object} Les statistiques
 */
function getLogsStatistics() {
  const sheet = createLogsSheetIfNotExists();
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = {
    total: data.length - 1,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    byType: {},
    byModule: {},
    byStatus: {},
    topUsers: {}
  };

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const timestamp = new Date(row[LOGS_CONFIG.COLUMNS.TIMESTAMP]);
    const type = row[LOGS_CONFIG.COLUMNS.TYPE_EVENEMENT];
    const module = row[LOGS_CONFIG.COLUMNS.MODULE];
    const statut = row[LOGS_CONFIG.COLUMNS.STATUT];
    const email = row[LOGS_CONFIG.COLUMNS.UTILISATEUR_EMAIL];

    // Compteurs temporels
    if (timestamp >= today) stats.today++;
    if (timestamp >= thisWeek) stats.thisWeek++;
    if (timestamp >= thisMonth) stats.thisMonth++;

    // Par type
    stats.byType[type] = (stats.byType[type] || 0) + 1;

    // Par module
    stats.byModule[module] = (stats.byModule[module] || 0) + 1;

    // Par statut
    stats.byStatus[statut] = (stats.byStatus[statut] || 0) + 1;

    // Top utilisateurs
    stats.topUsers[email] = (stats.topUsers[email] || 0) + 1;
  }

  return stats;
}
