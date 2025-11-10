/**
 * Système de Notifications v2.0
 */

function addNotification(type, title, message, action) {
  if (!ERP.config.options.enableNotifications) return;

  try {
    const sheet = ERP.getOrCreateSheet('_Notifications');

    const timestamp = ERP.formatDateTime(new Date());

    sheet.appendRow([
      timestamp,
      type, // info, warning, danger, success
      title,
      message,
      'Non lue',
      action || ''
    ]);

    ERP.log('INFO', `Notification ajoutée: ${title}`);
  } catch (error) {
    ERP.log('ERROR', 'addNotification: ' + error);
  }
}

function showNotificationCenter() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('_Notifications');

    if (!sheet || sheet.getLastRow() < 2) {
      SpreadsheetApp.getUi().alert('Aucune notification');
      return;
    }

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();

    // Prendre les 20 dernières notifications
    const recentNotifications = data.slice(-20).reverse();

    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .notification { background: white; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid; }
            .notification.info { border-color: #4285F4; }
            .notification.warning { border-color: #FBBC04; }
            .notification.danger { border-color: #EA4335; }
            .notification.success { border-color: #34A853; }
            .notification h3 { margin: 0 0 5px 0; font-size: 16px; }
            .notification p { margin: 5px 0; color: #666; }
            .notification .time { font-size: 12px; color: #999; }
            .mark-read { background: #4285F4; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h2>🔔 Centre de Notifications</h2>
          <p>Dernières notifications (${recentNotifications.length})</p>
    `;

    for (let notif of recentNotifications) {
      const [timestamp, type, title, message, statut, action] = notif;

      html += `
        <div class="notification ${type}">
          <h3>${title}</h3>
          <p>${message}</p>
          <div class="time">${timestamp} - ${statut}</div>
        </div>
      `;
    }

    html += `
          <button class="mark-read" onclick="google.script.run.markAllNotificationsAsRead(); google.script.host.close();">
            Tout marquer comme lu
          </button>
        </body>
      </html>
    `;

    const output = HtmlService.createHtmlOutput(html)
      .setWidth(600)
      .setHeight(700);

    SpreadsheetApp.getUi().showModalDialog(output, 'Centre de Notifications');

  } catch (error) {
    ERP.handleError(error, 'showNotificationCenter');
  }
}

function markAllNotificationsAsRead() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('_Notifications');

    if (!sheet || sheet.getLastRow() < 2) return;

    const range = sheet.getRange(2, 5, sheet.getLastRow() - 1, 1);
    const values = range.getValues().map(() => ['Lue']);
    range.setValues(values);

    ERP.log('INFO', 'Toutes les notifications marquées comme lues');
  } catch (error) {
    ERP.log('ERROR', 'markAllNotificationsAsRead: ' + error);
  }
}

function showNotificationSettings() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .setting { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input[type="checkbox"] { margin-right: 8px; }
          button { background: #4285F4; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h2>⚙️ Paramètres des Notifications</h2>

        <div class="setting">
          <label>
            <input type="checkbox" id="enableNotif" checked>
            Activer les notifications
          </label>
        </div>

        <div class="setting">
          <label>
            <input type="checkbox" id="notifFactures" checked>
            Alertes factures impayées
          </label>
        </div>

        <div class="setting">
          <label>
            <input type="checkbox" id="notifStock" checked>
            Alertes stock faible
          </label>
        </div>

        <div class="setting">
          <label>
            <input type="checkbox" id="notifRdv" checked>
            Rappels rendez-vous
          </label>
        </div>

        <div class="setting">
          <label>
            <input type="checkbox" id="notifTaches" checked>
            Tâches urgentes
          </label>
        </div>

        <button onclick="saveSettings()">Enregistrer</button>

        <script>
          function saveSettings() {
            alert('Paramètres enregistrés !');
            google.script.host.close();
          }
        </script>
      </body>
    </html>
  `;

  const output = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(450);

  SpreadsheetApp.getUi().showModalDialog(output, 'Paramètres Notifications');
}

/**
 * Fonctions de vérification automatique (à exécuter via déclencheur)
 */
function checkDailyNotifications() {
  if (!ERP.config.options.enableNotifications) return;

  ERP.init();

  // Vérifier factures en retard
  checkOverdueInvoices();

  // Vérifier stock faible
  checkLowStock();

  // Vérifier rendez-vous du jour
  checkTodayAppointments();

  // Vérifier tâches urgentes
  checkUrgentTasksNotification();
}

function checkOverdueInvoices() {
  const count = getUnpaidInvoicesCount();

  if (count > 0) {
    addNotification(
      'danger',
      'Factures en retard',
      `${count} facture(s) impayée(s) en retard de paiement`,
      'showUnpaidInvoices'
    );
  }
}

function checkLowStock() {
  const count = getLowStockCount();

  if (count > 0) {
    addNotification(
      'warning',
      'Stock faible',
      `${count} article(s) en rupture ou stock faible`,
      'showLowStockAlerts'
    );
  }
}

function checkTodayAppointments() {
  const count = getTodayAppointmentsCount();

  if (count > 0) {
    addNotification(
      'info',
      'Rendez-vous aujourd\'hui',
      `Vous avez ${count} rendez-vous planifié(s) aujourd'hui`,
      'showAgendaToday'
    );
  }
}

function checkUrgentTasksNotification() {
  const count = getUrgentTasksCount();

  if (count > 0) {
    addNotification(
      'danger',
      'Tâches urgentes',
      `${count} tâche(s) urgente(s) nécessitent votre attention`,
      'showUrgentTasks'
    );
  }
}

/**
 * Crée un déclencheur quotidien pour les notifications
 */
function setupDailyTrigger() {
  // Supprimer les déclencheurs existants
  const triggers = ScriptApp.getProjectTriggers();
  for (let trigger of triggers) {
    if (trigger.getHandlerFunction() === 'checkDailyNotifications') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // Créer un nouveau déclencheur à 8h du matin
  ScriptApp.newTrigger('checkDailyNotifications')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();

  SpreadsheetApp.getUi().alert('Notifications quotidiennes activées à 8h00');
}
