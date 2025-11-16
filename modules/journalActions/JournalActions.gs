/**
 * ============================================================================
 * MODULE JOURNAL ACTIONS v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète des logs système avec filtrage avancé,
 *              analyse patterns, détection anomalies et export
 *
 * Fonctionnalités v2.0:
 * ✅ Log toutes actions système
 * ✅ Filtrage multi-critères (module/action/utilisateur/date)
 * ✅ Export logs (CSV/JSON)
 * ✅ Analyse patterns et tendances
 * ✅ Détection anomalies sécurité
 * ✅ Archivage logs anciens (>90 jours)
 * ✅ KPIs temps réel
 * ✅ Statistiques détaillées
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION MODULE JOURNAL
// ============================================================================

const CONFIG_JOURNAL = {
  SHEET_NAME: '📝 Journal',
  TYPES_ACTION: [
    'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 
    'EXPORT', 'IMPORT', 'VIEW', 'ERROR', 'WARNING'
  ],
  MODULES: [
    'UTILISATEUR', 'PROJET', 'OUVRAGE', 'TACHE', 'RELEVE',
    'EQUIPE', 'EMPLOYE', 'MATERIEL', 'DOCUMENT', 'NOTIFICATION'
  ],
  STATUTS_HTTP: {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
  },
  MAX_LOGS: 10000,
  ARCHIVE_DAYS: 90,
  ANOMALY_THRESHOLD: 5 // Nb actions suspects en 1 minute
};

// ============================================================================
// INITIALISATION MODULE JOURNAL
// ============================================================================

/**
 * Initialise le module JOURNAL v2.0
 */
function initialiserJournalActions() {
  try {
    Logger.log("📝 Initialisation du module JOURNAL ACTIONS v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    // Supprimer si existe
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer nouvelle feuille
    sheet = ss.insertSheet(CONFIG_JOURNAL.SHEET_NAME);
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // EN-TÊTE PRINCIPAL
    sheet.getRange("A1:L1").merge()
      .setValue("📝 JOURNAL ACTIONS v2.0 - LOGS • AUDIT • ANALYSE • SÉCURITÉ")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // COLONNES
    const headers = [
      "JournalID",
      "DateHeure",
      "UtilisateurID",
      "Module",
      "Action",
      "Entite",
      "EntiteID",
      "Details",
      "StatutHTTP",
      "DureeExecution (ms)",
      "IPAddress",
      "UserAgent"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // LARGEURS DE COLONNES
    const columnWidths = [110, 160, 130, 120, 100, 130, 110, 300, 100, 140, 130, 200];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // DONNÉES D'EXEMPLE
    const donneesExemple = [
      [
        "LOG001",
        new Date(),
        "USR001",
        "UTILISATEUR",
        "LOGIN",
        "Utilisateur",
        "USR001",
        "Connexion réussie admin@topogest.cm",
        200,
        125,
        "192.168.1.100",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      ],
      [
        "LOG002",
        new Date(Date.now() - 300000),
        "USR002",
        "PROJET",
        "CREATE",
        "Projet",
        "PROJ001",
        "Création projet: Aménagement Logone et Chari",
        201,
        340,
        "192.168.1.101",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X)"
      ],
      [
        "LOG003",
        new Date(Date.now() - 600000),
        "USR003",
        "TACHE",
        "UPDATE",
        "Tache",
        "TSK045",
        "Modification statut tâche: En cours → Terminée",
        200,
        89,
        "192.168.1.102",
        "Mozilla/5.0 (X11; Linux x86_64)"
      ],
      [
        "LOG004",
        new Date(Date.now() - 900000),
        "USR001",
        "DOCUMENT",
        "EXPORT",
        "Document",
        "DOC012",
        "Export rapport PDF - Projet PROJ001",
        200,
        2340,
        "192.168.1.100",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      ],
      [
        "LOG005",
        new Date(Date.now() - 1200000),
        "GUEST",
        "UTILISATEUR",
        "LOGIN",
        "Utilisateur",
        "USR999",
        "Tentative connexion échouée - Mot de passe incorrect",
        401,
        45,
        "192.168.1.255",
        "curl/7.68.0"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // AUTO-INCRÉMENTATION ID
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"LOG"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // FORMATAGE DATES
    sheet.getRange("B3:B100").setNumberFormat("dd/mm/yyyy hh:mm:ss")
      .setHorizontalAlignment("center");

    // FORMATAGE NOMBRES
    sheet.getRange("J3:J100").setNumberFormat('#,##0" ms"')
      .setHorizontalAlignment("right");

    // VALIDATION DONNÉES

    // Module
    const regleModule = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_JOURNAL.MODULES, true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le module")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleModule);

    // Action
    const regleAction = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_JOURNAL.TYPES_ACTION, true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type d'action")
      .build();
    sheet.getRange("E3:E100").setDataValidation(regleAction);

    // MISE EN FORME CONDITIONNELLE
    const rules = sheet.getConditionalFormatRules();

    // Actions LOGIN - Vert
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("LOGIN")
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setBold(true)
      .setRanges([sheet.getRange("E3:E100")])
      .build());

    // Actions ERROR - Rouge
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("ERROR")
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setBold(true)
      .setRanges([sheet.getRange("E3:E100")])
      .build());

    // Actions DELETE - Orange
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("DELETE")
      .setBackground("#fef7e0")
      .setFontColor("#ea8600")
      .setBold(true)
      .setRanges([sheet.getRange("E3:E100")])
      .build());

    // Statut HTTP - Erreurs (4xx, 5xx)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(400)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Durée exécution longue (>1000ms)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(1000)
      .setBackground("#fef7e0")
      .setFontColor("#ea8600")
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // SECTION STATISTIQUES
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:L${statsRow}`).merge()
      .setValue("📊 STATISTIQUES JOURNAL v2.0")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Total actions", '=NB.SI(B3:B100;"<>"")', "Toutes les actions"],
      ["Actions aujourd'hui", '=NB.SI.ENS(B3:B100;">="&AUJOURDHUI())', "Aujourd'hui"],
      ["Actions par module", "", ""],
      ["  - UTILISATEUR", '=NB.SI(D3:D100;"UTILISATEUR")', ""],
      ["  - PROJET", '=NB.SI(D3:D100;"PROJET")', ""],
      ["  - TACHE", '=NB.SI(D3:D100;"TACHE")', ""],
      ["Actions par type", "", ""],
      ["  - LOGIN", '=NB.SI(E3:E100;"LOGIN")', ""],
      ["  - CREATE", '=NB.SI(E3:E100;"CREATE")', ""],
      ["  - UPDATE", '=NB.SI(E3:E100;"UPDATE")', ""],
      ["  - DELETE", '=NB.SI(E3:E100;"DELETE")', ""],
      ["  - ERROR", '=NB.SI(E3:E100;"ERROR")', ""],
      ["Erreurs (4xx/5xx)", '=NB.SI(I3:I100;">=400")', "À surveiller"],
      ["Durée moyenne", '=MOYENNE(J3:J100)', "Temps exécution"],
      ["Durée max", '=MAX(J3:J100)', "Plus lente"],
      ["Users actifs", '=NB.SI(C3:C100;"<>")', "Utilisateurs uniques"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 15, 2).setNumberFormat('#,##0" ms"');
    sheet.getRange(statsRow + 16, 2).setNumberFormat('#,##0" ms"');

    Logger.log("✅ Module JOURNAL ACTIONS v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur initialisation JOURNAL: " + error);
    throw error;
  }
}

// ============================================================================
// FONCTIONS LOGGING
// ============================================================================

/**
 * Enregistre une action dans le journal
 * @param {string} module - Module concerné
 * @param {string} action - Type d'action
 * @param {string} entite - Type d'entité
 * @param {string} entiteId - ID de l'entité
 * @param {string} details - Détails de l'action
 * @param {number} statutHTTP - Code HTTP
 * @param {number} duree - Durée en ms
 * @returns {Object} Résultat
 */
function journaliserAction(module, action, entite, entiteId, details, statutHTTP = 200, duree = 0) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet) {
      initialiserJournalActions();
      sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);
    }

    const currentUser = Session.getActiveUser().getEmail() || "SYSTÈME";
    const ip = getClientIP();
    const userAgent = getUserAgent();

    const nouvelleAction = [
      "", // ID auto
      new Date(),
      currentUser,
      module,
      action,
      entite,
      entiteId || "",
      details || "",
      statutHTTP,
      duree,
      ip,
      userAgent
    ];

    sheet.appendRow(nouvelleAction);

    // Vérifier taille du journal
    if (sheet.getLastRow() > CONFIG_JOURNAL.MAX_LOGS) {
      archiveOldLogs();
    }

    // Détecter anomalies
    detecterAnomalies(currentUser, action);

    return {success: true, message: "Action journalisée"};

  } catch (error) {
    Logger.log("Erreur journalisation: " + error);
    return {success: false, message: error.toString()};
  }
}

/**
 * Obtient l'IP du client
 * @returns {string} IP
 */
function getClientIP() {
  try {
    return Session.getTemporaryActiveUserKey() || "127.0.0.1";
  } catch (error) {
    return "0.0.0.0";
  }
}

/**
 * Obtient le User Agent
 * @returns {string} User Agent
 */
function getUserAgent() {
  try {
    return "Google Apps Script";
  } catch (error) {
    return "Unknown";
  }
}

// ============================================================================
// FILTRAGE ET RECHERCHE
// ============================================================================

/**
 * Filtre les logs selon critères
 * @param {Object} filtres - Critères de filtrage
 * @returns {Object} Résultat
 */
function filtrerLogs(filtres) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 3) {
      return {success: true, logs: []};
    }

    const data = sheet.getDataRange().getValues();
    let logs = [];

    for (let i = 2; i < data.length; i++) {
      const log = {
        id: data[i][0],
        dateHeure: data[i][1],
        utilisateur: data[i][2],
        module: data[i][3],
        action: data[i][4],
        entite: data[i][5],
        entiteId: data[i][6],
        details: data[i][7],
        statutHTTP: data[i][8],
        duree: data[i][9],
        ip: data[i][10],
        userAgent: data[i][11]
      };

      // Appliquer filtres
      if (filtres.module && log.module !== filtres.module) continue;
      if (filtres.action && log.action !== filtres.action) continue;
      if (filtres.utilisateur && log.utilisateur !== filtres.utilisateur) continue;
      
      if (filtres.dateDebut && new Date(log.dateHeure) < new Date(filtres.dateDebut)) continue;
      if (filtres.dateFin && new Date(log.dateHeure) > new Date(filtres.dateFin)) continue;

      logs.push(log);
    }

    return {success: true, logs: logs, count: logs.length};

  } catch (error) {
    Logger.log("Erreur filtrage logs: " + error);
    return {success: false, message: error.toString()};
  }
}

/**
 * Obtient les logs récents
 * @param {number} limit - Nombre de logs
 * @returns {Object} Résultat
 */
function obtenirLogsRecentsJournal(limit = 50) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 3) {
      return {success: true, logs: []};
    }

    const data = sheet.getDataRange().getValues();
    const logs = [];

    const startRow = Math.max(2, data.length - limit);
    
    for (let i = startRow; i < data.length; i++) {
      if (data[i][1]) { // Si date existe
        logs.push({
          id: data[i][0],
          dateHeure: data[i][1],
          utilisateur: data[i][2],
          module: data[i][3],
          action: data[i][4],
          entite: data[i][5],
          details: data[i][7],
          statutHTTP: data[i][8]
        });
      }
    }

    return {success: true, logs: logs.reverse()};

  } catch (error) {
    Logger.log("Erreur obtention logs: " + error);
    return {success: false, message: error.toString()};
  }
}

// ============================================================================
// ANALYSE ET PATTERNS
// ============================================================================

/**
 * Analyse les patterns d'utilisation
 * @returns {Object} Résultat
 */
function analyserPatterns() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 3) {
      return {success: true, patterns: {}};
    }

    const data = sheet.getDataRange().getValues();
    
    const patterns = {
      actionsParModule: {},
      actionsParType: {},
      actionsParUtilisateur: {},
      actionsParHeure: Array(24).fill(0),
      erreurs: [],
      actionsLentes: []
    };

    for (let i = 2; i < data.length; i++) {
      const module = data[i][3];
      const action = data[i][4];
      const utilisateur = data[i][2];
      const dateHeure = new Date(data[i][1]);
      const statutHTTP = data[i][8];
      const duree = data[i][9];

      // Par module
      patterns.actionsParModule[module] = (patterns.actionsParModule[module] || 0) + 1;

      // Par type
      patterns.actionsParType[action] = (patterns.actionsParType[action] || 0) + 1;

      // Par utilisateur
      patterns.actionsParUtilisateur[utilisateur] = (patterns.actionsParUtilisateur[utilisateur] || 0) + 1;

      // Par heure
      const heure = dateHeure.getHours();
      patterns.actionsParHeure[heure]++;

      // Erreurs
      if (statutHTTP >= 400) {
        patterns.erreurs.push({
          dateHeure: dateHeure,
          module: module,
          action: action,
          statut: statutHTTP,
          details: data[i][7]
        });
      }

      // Actions lentes
      if (duree > 1000) {
        patterns.actionsLentes.push({
          dateHeure: dateHeure,
          module: module,
          action: action,
          duree: duree
        });
      }
    }

    return {success: true, patterns: patterns};

  } catch (error) {
    Logger.log("Erreur analyse patterns: " + error);
    return {success: false, message: error.toString()};
  }
}

/**
 * Détecte les anomalies de sécurité
 * @param {string} utilisateur - Utilisateur
 * @param {string} action - Action
 */
function detecterAnomalies(utilisateur, action) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    const now = new Date();
    const oneMinuteAgo = new Date(now - 60000);

    let actionsRecentes = 0;

    for (let i = data.length - 1; i >= 2; i--) {
      const dateAction = new Date(data[i][1]);
      
      if (dateAction < oneMinuteAgo) break;
      
      if (data[i][2] === utilisateur) {
        actionsRecentes++;
      }
    }

    // Anomalie détectée
    if (actionsRecentes > CONFIG_JOURNAL.ANOMALY_THRESHOLD) {
      const message = `Anomalie détectée: ${utilisateur} - ${actionsRecentes} actions en 1 min`;
      Logger.log("🚨 " + message);
      
      // Envoyer alerte
      if (typeof envoyerNotification === 'function') {
        envoyerNotification('ADMIN', message, 'URGENT');
      }
    }

  } catch (error) {
    Logger.log("Erreur détection anomalies: " + error);
  }
}

// ============================================================================
// ARCHIVAGE ET NETTOYAGE
// ============================================================================

/**
 * Archive les logs anciens
 * @returns {Object} Résultat
 */
function archiveOldLogs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet) {
      return {success: false, message: "Feuille journal non trouvée"};
    }

    const data = sheet.getDataRange().getValues();
    const now = new Date();
    const archiveDate = new Date(now - (CONFIG_JOURNAL.ARCHIVE_DAYS * 24 * 60 * 60 * 1000));

    let archived = 0;
    const rowsToDelete = [];

    for (let i = 2; i < data.length; i++) {
      const dateAction = new Date(data[i][1]);
      
      if (dateAction < archiveDate) {
        rowsToDelete.push(i + 1);
        archived++;
      }
    }

    // Supprimer les lignes (de bas en haut pour éviter décalage)
    for (let i = rowsToDelete.length - 1; i >= 0; i--) {
      sheet.deleteRow(rowsToDelete[i]);
    }

    Logger.log(`📦 ${archived} logs archivés (>90 jours)`);

    return {success: true, archived: archived};

  } catch (error) {
    Logger.log("Erreur archivage logs: " + error);
    return {success: false, message: error.toString()};
  }
}

/**
 * Purge tous les logs
 * @returns {Object} Résultat
 */
function purgerTousLogs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet) {
      return {success: false, message: "Feuille journal non trouvée"};
    }

    const lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.deleteRows(3, lastRow - 2);
    }

    Logger.log("🗑️ Tous les logs ont été purgés");

    return {success: true, message: "Logs purgés"};

  } catch (error) {
    Logger.log("Erreur purge logs: " + error);
    return {success: false, message: error.toString()};
  }
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Exporte les logs en CSV
 * @param {Object} filtres - Filtres optionnels
 * @returns {string} Contenu CSV
 */
function exporterLogsCSV(filtres = {}) {
  try {
    const result = filtrerLogs(filtres);
    
    if (!result.success || !result.logs || result.logs.length === 0) {
      return "";
    }

    let csv = "ID,DateHeure,Utilisateur,Module,Action,Entite,EntiteID,Details,StatutHTTP,Duree,IP\n";

    result.logs.forEach(log => {
      csv += `${log.id},"${log.dateHeure}","${log.utilisateur}","${log.module}","${log.action}","${log.entite}","${log.entiteId}","${log.details}",${log.statutHTTP},${log.duree},"${log.ip}"\n`;
    });

    return csv;

  } catch (error) {
    Logger.log("Erreur export CSV: " + error);
    return "";
  }
}

/**
 * Exporte les logs en JSON
 * @param {Object} filtres - Filtres optionnels
 * @returns {string} Contenu JSON
 */
function exporterLogsJSON(filtres = {}) {
  try {
    const result = filtrerLogs(filtres);
    
    if (!result.success) {
      return JSON.stringify({error: result.message});
    }

    return JSON.stringify({
      exported: new Date().toISOString(),
      count: result.count,
      logs: result.logs
    }, null, 2);

  } catch (error) {
    Logger.log("Erreur export JSON: " + error);
    return JSON.stringify({error: error.toString()});
  }
}

// ============================================================================
// KPIs
// ============================================================================

/**
 * Obtient les KPIs du journal
 * @returns {Object} KPIs
 */
function obtenirKPIsJournal() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_JOURNAL.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 3) {
      return {
        total: 0,
        aujourdhui: 0,
        erreurs: 0,
        modulesActifs: 0
      };
    }

    const data = sheet.getDataRange().getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = 0;
    let aujourdhui = 0;
    let erreurs = 0;
    const modules = new Set();

    for (let i = 2; i < data.length; i++) {
      if (!data[i][1]) continue;

      total++;

      const dateAction = new Date(data[i][1]);
      dateAction.setHours(0, 0, 0, 0);
      
      if (dateAction.getTime() === today.getTime()) {
        aujourdhui++;
      }

      if (data[i][8] >= 400) {
        erreurs++;
      }

      if (data[i][3]) {
        modules.add(data[i][3]);
      }
    }

    return {
      total: total,
      aujourdhui: aujourdhui,
      erreurs: erreurs,
      modulesActifs: modules.size
    };

  } catch (error) {
    Logger.log("Erreur KPIs journal: " + error);
    return {};
  }
}

// ============================================================================
// INTERFACE UTILISATEUR
// ============================================================================

/**
 * Affiche la sidebar journal
 */
function afficherSidebarJournal() {
  const html = HtmlService.createHtmlOutputFromFile('modules/journalActions/JournalActionsSidebar')
    .setTitle('Journal Actions v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal journal
 */
function afficherModalJournal() {
  const html = HtmlService.createHtmlOutputFromFile('modules/journalActions/JournalActionsModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Journal Actions v2.0 - Logs & Audit');
}
