/**
 * Module de gestion de l'agenda et des rendez-vous
 * Agenda.gs
 */

/**
 * Crée la feuille Agenda
 */
function createAgendaSheet() {
  const sheet = getOrCreateSheet('Agenda');
  const config = getConfig();

  // Effacer le contenu existant
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:I1').merge()
    .setValue('📅 AGENDA ET RENDEZ-VOUS')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'Date',
    'Heure',
    'Client/Contact',
    'Objet',
    'Type',
    'Lieu',
    'Responsable',
    'Statut',
    'Notes'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 110);  // Date
  sheet.setColumnWidth(2, 80);   // Heure
  sheet.setColumnWidth(3, 180);  // Client
  sheet.setColumnWidth(4, 250);  // Objet
  sheet.setColumnWidth(5, 120);  // Type
  sheet.setColumnWidth(6, 150);  // Lieu
  sheet.setColumnWidth(7, 130);  // Responsable
  sheet.setColumnWidth(8, 100);  // Statut
  sheet.setColumnWidth(9, 250);  // Notes

  // Geler les en-têtes
  sheet.setFrozenRows(2);

  // Ajouter validation pour le type
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Rendez-vous', 'Réunion', 'Appel', 'Visite', 'Autre'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E1000').setDataValidation(typeRule);

  // Ajouter validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Planifié', 'Confirmé', 'En cours', 'Terminé', 'Annulé', 'Reporté'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('H3:H1000').setDataValidation(statutRule);

  // Formatage conditionnel pour les statuts
  const rangeToConfigure = sheet.getRange('H3:H1000');

  // Statut Confirmé - vert
  const ruleConfirme = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Confirmé')
    .setBackground(config.colors.success)
    .setRanges([rangeToConfigure])
    .build();

  // Statut Annulé - rouge
  const ruleAnnule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Annulé')
    .setBackground(config.colors.danger)
    .setRanges([rangeToConfigure])
    .build();

  // Statut Reporté - orange
  const ruleReporte = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Reporté')
    .setBackground(config.colors.warning)
    .setRanges([rangeToConfigure])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleConfirme, ruleAnnule, ruleReporte);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Crée la feuille Tâches
 */
function createTachesSheet() {
  const sheet = getOrCreateSheet('Tâches');
  const config = getConfig();

  // Effacer le contenu existant
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:J1').merge()
    .setValue('✓ GESTION DES TÂCHES')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Tâche',
    'Date Création',
    'Titre',
    'Description',
    'Priorité',
    'Assigné à',
    'Date Échéance',
    'Statut',
    'Progression (%)',
    'Notes'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 100);  // N° Tâche
  sheet.setColumnWidth(2, 110);  // Date Création
  sheet.setColumnWidth(3, 200);  // Titre
  sheet.setColumnWidth(4, 300);  // Description
  sheet.setColumnWidth(5, 100);  // Priorité
  sheet.setColumnWidth(6, 130);  // Assigné à
  sheet.setColumnWidth(7, 110);  // Date Échéance
  sheet.setColumnWidth(8, 100);  // Statut
  sheet.setColumnWidth(9, 100);  // Progression
  sheet.setColumnWidth(10, 250); // Notes

  // Geler les en-têtes
  sheet.setFrozenRows(2);

  // Ajouter validation pour la priorité
  const prioriteRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Basse', 'Normale', 'Haute', 'Urgente'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E1000').setDataValidation(prioriteRule);

  // Ajouter validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['À faire', 'En cours', 'En attente', 'Terminée', 'Annulée'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('H3:H1000').setDataValidation(statutRule);

  // Formatage conditionnel pour les priorités
  const rangePriorite = sheet.getRange('E3:E1000');

  const ruleUrgente = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Urgente')
    .setBackground(config.colors.danger)
    .setFontColor('#FFFFFF')
    .setRanges([rangePriorite])
    .build();

  const ruleHaute = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Haute')
    .setBackground(config.colors.warning)
    .setRanges([rangePriorite])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleUrgente, ruleHaute);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Affiche le dialogue pour ajouter un rendez-vous
 */
function showAddRendezVousDialog() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input, select, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
          textarea { height: 60px; }
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
        </style>
      </head>
      <body>
        <h2>Ajouter un rendez-vous</h2>
        <form id="rdvForm">
          <div class="form-group">
            <label>Date *</label>
            <input type="date" id="date" required>
          </div>

          <div class="form-group">
            <label>Heure *</label>
            <input type="time" id="heure" required>
          </div>

          <div class="form-group">
            <label>Client/Contact *</label>
            <input type="text" id="contact" required>
          </div>

          <div class="form-group">
            <label>Objet *</label>
            <input type="text" id="objet" required>
          </div>

          <div class="form-group">
            <label>Type *</label>
            <select id="type" required>
              <option value="">Sélectionner...</option>
              <option value="Rendez-vous">Rendez-vous</option>
              <option value="Réunion">Réunion</option>
              <option value="Appel">Appel</option>
              <option value="Visite">Visite</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Lieu</label>
            <input type="text" id="lieu" value="Bureau">
          </div>

          <div class="form-group">
            <label>Responsable</label>
            <input type="text" id="responsable">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="Planifié" selected>Planifié</option>
              <option value="Confirmé">Confirmé</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
              <option value="Reporté">Reporté</option>
            </select>
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea id="notes"></textarea>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          // Initialiser avec la date actuelle
          document.getElementById('date').valueAsDate = new Date();

          document.getElementById('rdvForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const rdvData = {
              date: document.getElementById('date').value,
              heure: document.getElementById('heure').value,
              contact: document.getElementById('contact').value,
              objet: document.getElementById('objet').value,
              type: document.getElementById('type').value,
              lieu: document.getElementById('lieu').value,
              responsable: document.getElementById('responsable').value,
              statut: document.getElementById('statut').value,
              notes: document.getElementById('notes').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Rendez-vous ajouté avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addRendezVous(rdvData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Rendez-vous');
}

/**
 * Affiche le dialogue pour ajouter une tâche
 */
function showAddTacheDialog() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input, select, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
          textarea { height: 80px; }
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
        </style>
      </head>
      <body>
        <h2>Ajouter une tâche</h2>
        <form id="tacheForm">
          <div class="form-group">
            <label>Titre *</label>
            <input type="text" id="titre" required>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea id="description" required></textarea>
          </div>

          <div class="form-group">
            <label>Priorité *</label>
            <select id="priorite" required>
              <option value="Normale" selected>Normale</option>
              <option value="Basse">Basse</option>
              <option value="Haute">Haute</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          <div class="form-group">
            <label>Assigné à</label>
            <input type="text" id="assigne">
          </div>

          <div class="form-group">
            <label>Date d'échéance</label>
            <input type="date" id="echeance">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="À faire" selected>À faire</option>
              <option value="En cours">En cours</option>
              <option value="En attente">En attente</option>
              <option value="Terminée">Terminée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          <div class="form-group">
            <label>Progression (%)</label>
            <input type="number" id="progression" value="0" min="0" max="100">
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea id="notes"></textarea>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          document.getElementById('tacheForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const tacheData = {
              titre: document.getElementById('titre').value,
              description: document.getElementById('description').value,
              priorite: document.getElementById('priorite').value,
              assigne: document.getElementById('assigne').value,
              echeance: document.getElementById('echeance').value,
              statut: document.getElementById('statut').value,
              progression: document.getElementById('progression').value,
              notes: document.getElementById('notes').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Tâche ajoutée avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addTache(tacheData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouvelle Tâche');
}

/**
 * Ajoute un rendez-vous
 */
function addRendezVous(rdvData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agenda');

  if (!sheet) {
    throw new Error('La feuille Agenda n\'existe pas.');
  }

  const newRow = [
    rdvData.date,
    rdvData.heure,
    rdvData.contact,
    rdvData.objet,
    rdvData.type,
    rdvData.lieu,
    rdvData.responsable,
    rdvData.statut,
    rdvData.notes
  ];

  sheet.appendRow(newRow);

  // Formatter la nouvelle ligne
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 9)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return true;
}

/**
 * Ajoute une tâche
 */
function addTache(tacheData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tâches');

  if (!sheet) {
    throw new Error('La feuille Tâches n\'existe pas.');
  }

  const config = getConfig();
  const numeroTache = getNextNumber(config.prefixes.tache, 'Tâches');
  const dateCreation = formatDate(new Date());

  const newRow = [
    numeroTache,
    dateCreation,
    tacheData.titre,
    tacheData.description,
    tacheData.priorite,
    tacheData.assigne,
    tacheData.echeance,
    tacheData.statut,
    tacheData.progression + '%',
    tacheData.notes
  ];

  sheet.appendRow(newRow);

  // Formatter la nouvelle ligne
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 10)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroTache;
}

/**
 * Affiche l'agenda du jour
 */
function showAgendaToday() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agenda');

  if (!sheet || sheet.getLastRow() < 3) {
    SpreadsheetApp.getUi().alert('Aucun rendez-vous aujourd\'hui');
    return;
  }

  const today = formatDate(new Date());
  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 9).getValues();

  let rdvToday = [];
  for (let i = 0; i < data.length; i++) {
    const dateRdv = data[i][0];
    if (dateRdv && formatDate(new Date(dateRdv)) === today) {
      rdvToday.push(data[i]);
    }
  }

  if (rdvToday.length === 0) {
    SpreadsheetApp.getUi().alert('Aucun rendez-vous aujourd\'hui');
    return;
  }

  let message = 'RENDEZ-VOUS DU JOUR (' + today + '):\n\n';
  for (let rdv of rdvToday) {
    message += rdv[1] + ' - ' + rdv[2] + ' : ' + rdv[3] + '\n';
    message += 'Statut: ' + rdv[7] + '\n\n';
  }

  SpreadsheetApp.getUi().alert('Agenda du jour', message, SpreadsheetApp.getUi().ButtonSet.OK);
}
