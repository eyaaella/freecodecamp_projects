/**
 * ========================================================================
 * FONCTIONS UTILITAIRES COMMUNES
 * ========================================================================
 */

/**
 * Formater un nombre comme devise
 */
function formatCurrency(value) {
  if (!value || isNaN(value)) return "0 FCFA";
  return parseFloat(value).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) + " FCFA";
}

/**
 * Formater un pourcentage
 */
function formatPercent(value) {
  if (!value || isNaN(value)) return "0%";
  return (parseFloat(value) * 100).toFixed(2) + "%";
}

/**
 * Formater une date
 */
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), "dd/MM/yyyy");
}

/**
 * Appliquer un style d'en-tête moderne
 */
function applyHeaderStyle(range, color) {
  color = color || CONFIG.COLORS.PRIMARY;
  range
    .setBackground(color)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
}

/**
 * Appliquer des bandes alternées
 */
function applyAlternatingRows(sheet, startRow, numRows) {
  const lastColumn = sheet.getLastColumn();
  const range = sheet.getRange(startRow, 1, numRows, lastColumn);

  const banding = range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  banding.setHeaderRowColor(CONFIG.COLORS.PRIMARY);
  banding.setFirstRowColor(CONFIG.COLORS.LIGHT);
  banding.setSecondRowColor('#ffffff');
}

/**
 * Créer une règle de validation de liste
 */
function createListValidation(values, helpText) {
  return SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .setHelpText(helpText || 'Sélectionnez une valeur dans la liste')
    .build();
}

/**
 * Créer une règle de mise en forme conditionnelle pour statut
 */
function createStatusRules(sheet, range, statusConfig) {
  const rules = [];

  for (const [status, color] of Object.entries(statusConfig)) {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(status)
        .setBackground(color.bg)
        .setFontColor(color.text)
        .setRanges([range])
        .build()
    );
  }

  return rules;
}

/**
 * Protéger une plage avec avertissement
 */
function protectRange(range, description) {
  const protection = range.protect();
  protection.setDescription(description || 'Plage protégée');
  protection.setWarningOnly(true);
  return protection;
}

/**
 * Obtenir l'ID suivant pour une feuille
 */
function getNextId(sheetName) {
  const sheet = getOrCreateSheet(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow < 6) return 1;

  const lastId = sheet.getRange(lastRow, 1).getValue();
  return parseInt(lastId) + 1 || 1;
}

/**
 * Trouver une ligne par ID
 */
function findRowById(sheetName, id) {
  const sheet = getOrCreateSheet(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow < 6) return -1;

  const ids = sheet.getRange(6, 1, lastRow - 5, 1).getValues();
  const rowIndex = ids.findIndex(row => row[0] == id);

  return rowIndex >= 0 ? rowIndex + 6 : -1;
}

/**
 * Valider les dates (début < fin)
 */
function validateDates(dateDebut, dateFin) {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);

  if (fin < debut) {
    throw new Error("La date de fin doit être postérieure à la date de début");
  }

  return true;
}

/**
 * Calculer la durée en jours
 */
function calculateDuration(dateDebut, dateFin) {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const diff = fin - debut;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Exporter les données en CSV
 */
function exportToCSV(sheetName) {
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();

  let csv = '';
  data.forEach(row => {
    csv += row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',') + '\n';
  });

  return csv;
}

/**
 * Envoyer un email de notification
 */
function sendEmailNotification(to, subject, body) {
  if (!CONFIG.NOTIFICATION.SEND_EMAIL) return;

  try {
    MailApp.sendEmail({
      to: to,
      subject: CONFIG.APP_NAME + ' - ' + subject,
      body: body,
      noReply: true
    });
  } catch (e) {
    console.error("Erreur envoi email:", e);
  }
}

/**
 * Créer un menu déroulant de projets
 */
function getProjectsList() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.PROJET);
  const lastRow = sheet.getLastRow();

  if (lastRow < 6) return [];

  const data = sheet.getRange(6, 1, lastRow - 5, 2).getValues();
  return data.filter(row => row[0]).map(row => row[0] + ' - ' + row[1]);
}

/**
 * Créer un menu déroulant d'employés
 */
function getEmployeesList() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.EMPLOYE);
  const lastRow = sheet.getLastRow();

  if (lastRow < 6) return [];

  const data = sheet.getRange(6, 1, lastRow - 5, 3).getValues();
  return data.filter(row => row[0]).map(row => row[1] + ' ' + row[2]);
}

/**
 * Créer un menu déroulant d'équipes
 */
function getTeamsList() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.EQUIPE);
  const lastRow = sheet.getLastRow();

  if (lastRow < 6) return [];

  const data = sheet.getRange(6, 1, lastRow - 5, 2).getValues();
  return data.filter(row => row[0]).map(row => row[0] + ' - ' + row[1]);
}

/**
 * Nettoyer les données (supprimer les lignes vides)
 */
function cleanEmptyRows(sheetName) {
  const sheet = getOrCreateSheet(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow < 6) return;

  const data = sheet.getRange(6, 1, lastRow - 5, 1).getValues();

  for (let i = data.length - 1; i >= 0; i--) {
    if (!data[i][0] || data[i][0] === '') {
      sheet.deleteRow(i + 6);
    }
  }
}

/**
 * Recalculer toutes les formules
 */
function recalculateFormulas() {
  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().toast('Formules recalculées', 'Succès', 3);
  logAction("Système", "Recalcul des formules");
}

/**
 * Réappliquer les formats
 */
function reapplyFormats() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Réappliquer les formats',
    'Cette action va réappliquer les formats à toutes les feuilles. Continuer?',
    ui.ButtonSet.YES_NO
  );

  if (result === ui.Button.YES) {
    // Réinitialiser chaque feuille
    createDashboardSheet();
    createProjetSheet();
    createOuvrageSheet();
    createTacheSheet();
    createReleveSheet();
    createEmployeSheet();
    createEquipeSheet();
    createMaterielSheet();
    createPosteSheet();
    createUtilisateurSheet();
    createJournalSheet();
    createNotificationSheet();
    createDocumentSheet();
    createPlanningSheet();
    createBudgetSheet();
    createFactureSheet();
    createControleurSheet();
    createStatsSheet();

    ui.alert('Formats réappliqués avec succès!');
    logAction("Système", "Formats réappliqués");
  }
}

/**
 * Synchroniser les données
 */
function syncData() {
  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().toast('Données synchronisées', 'Succès', 3);
  logAction("Système", "Synchronisation des données");
}

/**
 * Nettoyer les données
 */
function cleanData() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Nettoyer les données',
    'Cette action va supprimer les lignes vides. Continuer?',
    ui.ButtonSet.YES_NO
  );

  if (result === ui.Button.YES) {
    const sheets = [
      CONFIG.SHEETS.PROJET,
      CONFIG.SHEETS.OUVRAGE,
      CONFIG.SHEETS.TACHE,
      CONFIG.SHEETS.RELEVE,
      CONFIG.SHEETS.EMPLOYE,
      CONFIG.SHEETS.EQUIPE,
      CONFIG.SHEETS.MATERIEL
    ];

    sheets.forEach(sheetName => cleanEmptyRows(sheetName));

    ui.alert('Données nettoyées avec succès!');
    logAction("Système", "Nettoyage des données");
  }
}

/**
 * Importer des données (placeholder)
 */
function importData() {
  SpreadsheetApp.getUi().alert(
    'Import de données',
    'Fonctionnalité d\'import en cours de développement',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Exporter toutes les données
 */
function exportAllData() {
  SpreadsheetApp.getUi().alert(
    'Export de données',
    'Fonctionnalité d\'export en cours de développement',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
