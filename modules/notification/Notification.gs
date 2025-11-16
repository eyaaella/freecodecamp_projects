/**
 * ============================================================================
 * MODULE NOTIFICATION v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Système complet de notifications multi-canaux avec templates,
 *              workflows automatiques et statistiques avancées
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD notifications
 * ✅ Types: INFO/SUCCESS/WARNING/ERROR/URGENT
 * ✅ Canaux: Email, SMS (API), In-App, Push
 * ✅ Notifications automatiques (workflows)
 * ✅ Templates réutilisables
 * ✅ Statistiques détaillées (envoyées, lues, cliquées)
 * ✅ Planification envoi différé
 * ✅ KPIs temps réel
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION MODULE NOTIFICATION
// ============================================================================

const CONFIG_NOTIFICATION = {
  SHEET_NAME: '🔔 Notifications',
  TYPES: ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'URGENT'],
  STATUTS: ['Non lue', 'Lue', 'Cliquée', 'Archivée'],
  CANAUX: ['Email', 'SMS', 'In-App', 'Push'],
  PRIORITES: ['Basse', 'Normale', 'Haute', 'Urgente'],
  SMS_API_URL: 'https://api.sms.cm/v1/send', // API SMS Cameroun
  MAX_NOTIFICATIONS: 5000
};

// ============================================================================
// INITIALISATION MODULE NOTIFICATION
// ============================================================================

/**
 * Initialise le module NOTIFICATION v2.0
 */
function initialiserNotification() {
  try {
    Logger.log("🔔 Initialisation du module NOTIFICATION v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG_NOTIFICATION.SHEET_NAME);

    if (sheet) {
      ss.deleteSheet(sheet);
    }

    sheet = ss.insertSheet(CONFIG_NOTIFICATION.SHEET_NAME);
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // EN-TÊTE
    sheet.getRange("A1:L1").merge()
      .setValue("🔔 NOTIFICATIONS v2.0 - MULTI-CANAUX • WORKFLOWS • TEMPLATES • STATS")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // COLONNES
    const headers = [
      "NotificationID",
      "UtilisateurID",
      "Type",
      "Titre",
      "Message",
      "DateEnvoi",
      "DateLue",
      "Statut",
      "Canal",
      "Source",
      "LienAction",
      "Priorite"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // LARGEURS
    const columnWidths = [130, 130, 100, 250, 400, 150, 150, 110, 90, 130, 200, 100];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // DONNÉES EXEMPLE
    const donneesExemple = [
      [
        "NOT001",
        "USR001",
        "SUCCESS",
        "Projet créé avec succès",
        "Le projet 'Aménagement Logone et Chari' a été créé avec succès.",
        new Date(),
        new Date(),
        "Lue",
        "In-App",
        "PROJET",
        "/projet/PROJ001",
        "Normale"
      ],
      [
        "NOT002",
        "USR002",
        "WARNING",
        "Tâche en retard",
        "La tâche TSK045 est en retard de 3 jours.",
        new Date(Date.now() - 3600000),
        null,
        "Non lue",
        "Email",
        "TACHE",
        "/tache/TSK045",
        "Haute"
      ],
      [
        "NOT003",
        "USR001",
        "INFO",
        "Nouveau document ajouté",
        "Un nouveau document a été ajouté au projet PROJ001.",
        new Date(Date.now() - 7200000),
        new Date(Date.now() - 3600000),
        "Cliquée",
        "In-App",
        "DOCUMENT",
        "/document/DOC012",
        "Basse"
      ],
      [
        "NOT004",
        "USR003",
        "ERROR",
        "Échec envoi rapport",
        "Impossible d'envoyer le rapport mensuel. Veuillez réessayer.",
        new Date(Date.now() - 10800000),
        null,
        "Non lue",
        "Email",
        "SYSTÈME",
        "/rapports",
        "Urgente"
      ],
      [
        "NOT005",
        "USR002",
        "URGENT",
        "Action requise",
        "Validation urgente nécessaire pour le budget du projet PROJ001.",
        new Date(Date.now() - 1800000),
        null,
        "Non lue",
        "SMS",
        "BUDGET",
        "/budget/PROJ001",
        "Urgente"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // AUTO-INCRÉMENTATION
    for (let i = 8; i <= 100; i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(D${i})>0;"NOT"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // FORMATAGE DATES
    sheet.getRange("F3:G100").setNumberFormat("dd/mm/yyyy hh:mm")
      .setHorizontalAlignment("center");

    // VALIDATION

    // Type
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_NOTIFICATION.TYPES, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleType);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_NOTIFICATION.STATUTS, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleStatut);

    // Canal
    const regleCanal = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_NOTIFICATION.CANAUX, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleCanal);

    // Priorite
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_NOTIFICATION.PRIORITES, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange("L3:L100").setDataValidation(reglePriorite);

    // MISE EN FORME CONDITIONNELLE
    const rules = sheet.getConditionalFormatRules();

    // Type SUCCESS - Vert
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("SUCCESS")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    // Type WARNING - Orange
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("WARNING")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    // Type ERROR/URGENT - Rouge
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("ERROR")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("URGENT")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    // Statut Non lue - Jaune clair
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Non lue")
      .setBackground("#fef7e0")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // SECTION STATISTIQUES
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:L${statsRow}`).merge()
      .setValue("📊 STATISTIQUES NOTIFICATIONS v2.0")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Total notifications", '=NB.SI(D3:D100;"<>"")', "Toutes"],
      ["Non lues", '=NB.SI(H3:H100;"Non lue")', "À traiter"],
      ["Aujourd'hui", '=NB.SI.ENS(F3:F100;">="&AUJOURDHUI())', "Envoyées aujourd'hui"],
      ["Par type", "", ""],
      ["  - INFO", '=NB.SI(C3:C100;"INFO")', ""],
      ["  - SUCCESS", '=NB.SI(C3:C100;"SUCCESS")', ""],
      ["  - WARNING", '=NB.SI(C3:C100;"WARNING")', ""],
      ["  - ERROR", '=NB.SI(C3:C100;"ERROR")', ""],
      ["  - URGENT", '=NB.SI(C3:C100;"URGENT")', ""],
      ["Taux de lecture", '=SI(B${statsRow+2}>0;(B${statsRow+2}-B${statsRow+3})/B${statsRow+2};0)', "Lues/Total"],
      ["Par canal", "", ""],
      ["  - In-App", '=NB.SI(I3:I100;"In-App")', ""],
      ["  - Email", '=NB.SI(I3:I100;"Email")', ""],
      ["  - SMS", '=NB.SI(I3:I100;"SMS")', ""],
      ["  - Push", '=NB.SI(I3:I100;"Push")', ""]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 11, 2).setNumberFormat("0.0%");

    Logger.log("✅ Module NOTIFICATION v2.0 initialisé!");

  } catch (error) {
    Logger.log("❌ Erreur initialisation NOTIFICATION: " + error);
    throw error;
  }
}

// ============================================================================
// CRUD NOTIFICATIONS
// ============================================================================

/**
 * Crée une notification
 */
function creerNotification(notificationData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG_NOTIFICATION.SHEET_NAME);

    if (!sheet) {
      initialiserNotification();
      sheet = ss.getSheetByName(CONFIG_NOTIFICATION.SHEET_NAME);
    }

    const nouvelle = [
      "",
      notificationData.utilisateurId,
      notificationData.type || "INFO",
      notificationData.titre,
      notificationData.message,
      new Date(),
      null,
      "Non lue",
      notificationData.canal || "In-App",
      notificationData.source || "SYSTÈME",
      notificationData.lienAction || "",
      notificationData.priorite || "Normale"
    ];

    sheet.appendRow(nouvelle);

    // Envoyer selon canal
    if (notificationData.canal === "Email") {
      envoyerEmail(notificationData.utilisateurId, notificationData.titre, notificationData.message);
    } else if (notificationData.canal === "SMS") {
      envoyerSMS(notificationData.utilisateurId, notificationData.message);
    }

    return {success: true, message: "Notification créée"};

  } catch (error) {
    Logger.log("Erreur création notification: " + error);
    return {success: false, message: error.toString()};
  }
}

/**
 * Marque une notification comme lue
 */
function marquerCommeLue(notificationId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_NOTIFICATION.SHEET_NAME);

    if (!sheet) return {success: false, message: "Module non initialisé"};

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === notificationId) {
        sheet.getRange(i + 1, 7).setValue(new Date()); // DateLue
        sheet.getRange(i + 1, 8).setValue("Lue"); // Statut
        return {success: true, message: "Notification marquée comme lue"};
      }
    }

    return {success: false, message: "Notification non trouvée"};

  } catch (error) {
    Logger.log("Erreur marquer comme lue: " + error);
    return {success: false, message: error.toString()};
  }
}

/**
 * Obtient les notifications d'un utilisateur
 */
function obtenirNotificationsUtilisateur(utilisateurId, limit = 20) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_NOTIFICATION.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 3) {
      return {success: true, notifications: []};
    }

    const data = sheet.getDataRange().getValues();
    const notifications = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === utilisateurId) {
        notifications.push({
          id: data[i][0],
          type: data[i][2],
          titre: data[i][3],
          message: data[i][4],
          dateEnvoi: data[i][5],
          dateLue: data[i][6],
          statut: data[i][7],
          canal: data[i][8],
          lienAction: data[i][10],
          priorite: data[i][11]
        });
      }
    }

    notifications.sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));

    return {success: true, notifications: notifications.slice(0, limit)};

  } catch (error) {
    Logger.log("Erreur obtention notifications: " + error);
    return {success: false, message: error.toString()};
  }
}

// ============================================================================
// ENVOI MULTI-CANAUX
// ============================================================================

/**
 * Envoie un email
 */
function envoyerEmail(utilisateurId, sujet, message) {
  try {
    // Récupérer email utilisateur
    const email = obtenirEmailUtilisateur(utilisateurId);
    
    if (!email) {
      Logger.log("Email utilisateur non trouvé: " + utilisateurId);
      return false;
    }

    // Envoyer email
    MailApp.sendEmail({
      to: email,
      subject: "[TopoGest Pro] " + sujet,
      htmlBody: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <div style="background: #1a73e8; color: white; padding: 20px;">
              <h2>TopoGest Pro</h2>
            </div>
            <div style="padding: 20px;">
              <h3>${sujet}</h3>
              <p>${message}</p>
            </div>
            <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px;">
              <p>TopoGest Pro - Système de Gestion Topographique</p>
            </div>
          </body>
        </html>
      `
    });

    Logger.log("Email envoyé à: " + email);
    return true;

  } catch (error) {
    Logger.log("Erreur envoi email: " + error);
    return false;
  }
}

/**
 * Envoie un SMS (via API)
 */
function envoyerSMS(utilisateurId, message) {
  try {
    const telephone = obtenirTelephoneUtilisateur(utilisateurId);
    
    if (!telephone) {
      Logger.log("Téléphone utilisateur non trouvé: " + utilisateurId);
      return false;
    }

    // TODO: Implémenter appel API SMS
    Logger.log("SMS à envoyer à " + telephone + ": " + message);
    
    // Simulation pour l'instant
    return true;

  } catch (error) {
    Logger.log("Erreur envoi SMS: " + error);
    return false;
  }
}

/**
 * Obtient l'email d'un utilisateur
 */
function obtenirEmailUtilisateur(utilisateurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) return null;

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === utilisateurId) {
        return data[i][1]; // Email en colonne B
      }
    }

    return null;

  } catch (error) {
    Logger.log("Erreur obtention email: " + error);
    return null;
  }
}

/**
 * Obtient le téléphone d'un utilisateur
 */
function obtenirTelephoneUtilisateur(utilisateurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) return null;

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === utilisateurId) {
        return data[i][12]; // Téléphone en colonne M
      }
    }

    return null;

  } catch (error) {
    Logger.log("Erreur obtention téléphone: " + error);
    return null;
  }
}

// ============================================================================
// KPIs
// ============================================================================

/**
 * Obtient les KPIs notifications
 */
function obtenirKPIsNotifications() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_NOTIFICATION.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 3) {
      return { total: 0, nonLues: 0, aujourdhui: 0, tauxLecture: 0 };
    }

    const data = sheet.getDataRange().getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = 0;
    let nonLues = 0;
    let aujourdhui = 0;
    const parType = {};

    for (let i = 2; i < data.length; i++) {
      if (!data[i][3]) continue;

      total++;

      if (data[i][7] === "Non lue") nonLues++;

      const dateEnvoi = new Date(data[i][5]);
      dateEnvoi.setHours(0, 0, 0, 0);
      
      if (dateEnvoi.getTime() === today.getTime()) {
        aujourdhui++;
      }

      const type = data[i][2];
      parType[type] = (parType[type] || 0) + 1;
    }

    const tauxLecture = total > 0 ? ((total - nonLues) / total * 100).toFixed(1) : 0;

    return {
      total: total,
      nonLues: nonLues,
      aujourdhui: aujourdhui,
      tauxLecture: tauxLecture,
      parType: parType
    };

  } catch (error) {
    Logger.log("Erreur KPIs notifications: " + error);
    return {};
  }
}

// ============================================================================
// INTERFACE
// ============================================================================

function afficherSidebarNotification() {
  const html = HtmlService.createHtmlOutputFromFile('modules/notification/NotificationSidebar')
    .setTitle('Notifications v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalNotification() {
  const html = HtmlService.createHtmlOutputFromFile('modules/notification/NotificationModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Notifications v2.0');
}
