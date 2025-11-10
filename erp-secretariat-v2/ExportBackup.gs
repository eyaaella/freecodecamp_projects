/**
 * Module Export et Backup v2.0
 */

function showExportDialog() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .export-option { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .export-option h3 { margin: 0 0 10px 0; color: #1A73E8; }
          button { background: #4285F4; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 3px; margin: 5px; }
          button:hover { background: #3367D6; }
          .warning { background: #FFF4CC; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <h2>📤 Export de Données</h2>

        <div class="warning">
          ⚠️ Les exports se feront dans un nouveau Google Sheets
        </div>

        <div class="export-option">
          <h3>💾 Sauvegarde Complète</h3>
          <p>Crée une copie complète de toutes les données de l'ERP</p>
          <button onclick="google.script.run.withSuccessHandler(showSuccess).createFullBackup()">
            Créer sauvegarde
          </button>
        </div>

        <div class="export-option">
          <h3>📊 Export Clients</h3>
          <p>Exporte tous les clients vers un fichier CSV</p>
          <button onclick="google.script.run.withSuccessHandler(showSuccess).exportClients()">
            Exporter clients
          </button>
        </div>

        <div class="export-option">
          <h3>🧾 Export Factures</h3>
          <p>Exporte toutes les factures du mois en cours</p>
          <button onclick="google.script.run.withSuccessHandler(showSuccess).exportFacturesMonth()">
            Exporter factures
          </button>
        </div>

        <div class="export-option">
          <h3>📈 Rapport Complet</h3>
          <p>Génère un rapport complet avec statistiques</p>
          <button onclick="google.script.run.withSuccessHandler(showSuccess).exportFullReport()">
            Générer rapport
          </button>
        </div>

        <script>
          function showSuccess(message) {
            alert(message || 'Export réussi !');
            google.script.host.close();
          }
        </script>
      </body>
    </html>
  `;

  const output = HtmlService.createHtmlOutput(html)
    .setWidth(600)
    .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(output, 'Export de Données');
}

function createBackup() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const backupName = `ERP Backup - ${ERP.formatDateTime(new Date())}`;

    // Créer une copie
    const backup = ss.copy(backupName);

    AuditLog.log(AuditLog.Actions.EXPORT, 'BACKUP', backup.getId(), 'Sauvegarde complète');

    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Sauvegarde créée',
      `Une sauvegarde complète a été créée :\n${backupName}\n\nID: ${backup.getId()}`,
      ui.ButtonSet.OK
    );

    return backup.getId();
  } catch (error) {
    ERP.handleError(error, 'createBackup');
  }
}

function createFullBackup() {
  return createBackup();
}

function exportClients() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) throw new Error('Feuille Clients introuvable');

    // Créer un nouveau spreadsheet
    const exportSS = SpreadsheetApp.create(`Export Clients - ${ERP.formatDate(new Date())}`);
    const exportSheet = exportSS.getActiveSheet();
    exportSheet.setName('Clients');

    // Copier les données
    const data = sheet.getDataRange().getValues();
    exportSheet.getRange(1, 1, data.length, data[0].length).setValues(data);

    // Formater
    exportSheet.getRange(1, 1, 1, data[0].length)
      .setFontWeight('bold')
      .setBackground('#4285F4')
      .setFontColor('#FFFFFF');

    AuditLog.log(AuditLog.Actions.EXPORT, AuditLog.Entities.CLIENT, exportSS.getId(), 'Export clients');

    const url = exportSS.getUrl();
    return `Export réussi !\nOuvrir : ${url}`;
  } catch (error) {
    ERP.handleError(error, 'exportClients');
    return 'Erreur lors de l\'export';
  }
}

function exportFacturesMonth() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
    if (!sheet) throw new Error('Feuille Factures introuvable');

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrer les factures du mois
    const data = sheet.getDataRange().getValues();
    const headers = data[1];
    const facturesMois = [headers];

    for (let i = 2; i < data.length; i++) {
      const date = new Date(data[i][1]);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        facturesMois.push(data[i]);
      }
    }

    // Créer export
    const exportSS = SpreadsheetApp.create(`Export Factures - ${ERP.formatDate(now)}`);
    const exportSheet = exportSS.getActiveSheet();
    exportSheet.setName('Factures');

    exportSheet.getRange(1, 1, facturesMois.length, headers.length).setValues(facturesMois);

    exportSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#4285F4')
      .setFontColor('#FFFFFF');

    AuditLog.log(AuditLog.Actions.EXPORT, AuditLog.Entities.FACTURE, exportSS.getId(), 'Export factures mois');

    const url = exportSS.getUrl();
    return `Export réussi !\n${facturesMois.length - 1} facture(s) exportée(s)\nOuvrir : ${url}`;
  } catch (error) {
    ERP.handleError(error, 'exportFacturesMonth');
    return 'Erreur lors de l\'export';
  }
}

function exportFullReport() {
  try {
    // Créer un nouveau spreadsheet
    const exportSS = SpreadsheetApp.create(`Rapport ERP - ${ERP.formatDateTime(new Date())}`);

    // Créer les feuilles
    createReportSummary(exportSS);
    createReportClients(exportSS);
    createReportFactures(exportSS);
    createReportStock(exportSS);

    // Supprimer la feuille par défaut
    const defaultSheet = exportSS.getSheetByName('Feuille 1');
    if (defaultSheet) exportSS.deleteSheet(defaultSheet);

    AuditLog.log(AuditLog.Actions.EXPORT, 'RAPPORT', exportSS.getId(), 'Rapport complet');

    const url = exportSS.getUrl();
    return `Rapport généré avec succès !\nOuvrir : ${url}`;
  } catch (error) {
    ERP.handleError(error, 'exportFullReport');
    return 'Erreur lors de la génération du rapport';
  }
}

function createReportSummary(exportSS) {
  const sheet = exportSS.insertSheet('Résumé');
  const config = ERP.config;

  sheet.getRange('A1:B1').merge()
    .setValue('📊 RÉSUMÉ ERP')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');

  const now = new Date();

  const data = [
    ['Date du rapport:', ERP.formatDateTime(now)],
    ['Période:', `${now.getFullYear()}`],
    [''],
    ['📋 STATISTIQUES GLOBALES', ''],
    ['Total Clients:', DataManager.count('Clients', 9, 'Actif')],
    ['Total Fournisseurs:', DataManager.count('Fournisseurs', 10, 'Actif')],
    [''],
    ['💰 FACTURATION', ''],
    ['Factures émises ce mois:', getFactureStats().totalMois],
    ['CA du mois:', getFactureStats().caMois + ' ' + config.devise],
    ['Factures impayées:', getUnpaidInvoicesCount()],
    [''],
    ['📦 STOCK', ''],
    ['Articles en stock:', DataManager.getData('Stock').length],
    ['Alertes stock faible:', getLowStockCount()],
    [''],
    ['👨‍💼 PERSONNEL', ''],
    ['Employés actifs:', DataManager.count('Personnel', 10, 'Actif')]
  ];

  sheet.getRange(3, 1, data.length, 2).setValues(data);

  sheet.getRange('A1:B1').setFontSize(16);
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 200);

  return sheet;
}

function createReportClients(exportSS) {
  const sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  if (!sourceSheet) return;

  const sheet = exportSS.insertSheet('Clients');
  const data = sourceSheet.getDataRange().getValues();

  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  sheet.getRange(2, 1, 1, data[0].length)
    .setFontWeight('bold')
    .setBackground('#4285F4')
    .setFontColor('#FFFFFF');

  return sheet;
}

function createReportFactures(exportSS) {
  const sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
  if (!sourceSheet) return;

  const sheet = exportSS.insertSheet('Factures');
  const data = sourceSheet.getDataRange().getValues();

  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  sheet.getRange(2, 1, 1, data[0].length)
    .setFontWeight('bold')
    .setBackground('#4285F4')
    .setFontColor('#FFFFFF');

  return sheet;
}

function createReportStock(exportSS) {
  const sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');
  if (!sourceSheet) return;

  const sheet = exportSS.insertSheet('Stock');
  const data = sourceSheet.getDataRange().getValues();

  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);

  sheet.getRange(2, 1, 1, data[0].length)
    .setFontWeight('bold')
    .setBackground('#4285F4')
    .setFontColor('#FFFFFF');

  return sheet;
}

/**
 * Backup automatique (à exécuter via déclencheur)
 */
function autoBackup() {
  if (!ERP.config.options.enableAutoBackup) return;

  ERP.init();

  const frequency = ERP.config.options.backupFrequency || 'weekly';

  // Vérifier si c'est le moment
  const lastBackup = PropertiesService.getScriptProperties().getProperty('lastBackup');
  const now = new Date();

  if (lastBackup) {
    const lastBackupDate = new Date(lastBackup);
    const daysSinceBackup = (now - lastBackupDate) / (1000 * 60 * 60 * 24);

    if (frequency === 'daily' && daysSinceBackup < 1) return;
    if (frequency === 'weekly' && daysSinceBackup < 7) return;
    if (frequency === 'monthly' && daysSinceBackup < 30) return;
  }

  // Créer backup
  createBackup();

  // Enregistrer la date
  PropertiesService.getScriptProperties().setProperty('lastBackup', now.toISOString());

  addNotification('success', 'Backup automatique', 'Sauvegarde automatique créée avec succès', '');
}
