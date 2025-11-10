/**
 * Module de gestion du courrier (entrant et sortant)
 * Courrier.gs
 */

/**
 * Crée la feuille Courrier Entrant
 */
function createCourrierEntrantSheet() {
  const sheet = getOrCreateSheet('Courrier Entrant');
  const config = getConfig();

  // Effacer le contenu existant
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:J1').merge()
    .setValue('📨 REGISTRE COURRIER ENTRANT')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Enregistrement',
    'Date Réception',
    'Heure',
    'Expéditeur',
    'Type',
    'Objet',
    'N° Courrier',
    'Traité Par',
    'Statut',
    'Observations'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 130);  // N° Enregistrement
  sheet.setColumnWidth(2, 110);  // Date
  sheet.setColumnWidth(3, 80);   // Heure
  sheet.setColumnWidth(4, 200);  // Expéditeur
  sheet.setColumnWidth(5, 120);  // Type
  sheet.setColumnWidth(6, 300);  // Objet
  sheet.setColumnWidth(7, 130);  // N° Courrier
  sheet.setColumnWidth(8, 150);  // Traité par
  sheet.setColumnWidth(9, 100);  // Statut
  sheet.setColumnWidth(10, 250); // Observations

  // Geler les en-têtes
  sheet.setFrozenRows(2);

  // Ajouter validation pour le type
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Lettre', 'Colis', 'Recommandé', 'Express', 'Fax', 'Email', 'Autre'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E1000').setDataValidation(typeRule);

  // Ajouter validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['En attente', 'En cours', 'Traité', 'Archivé'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I3:I1000').setDataValidation(statutRule);

  return sheet;
}

/**
 * Crée la feuille Courrier Sortant
 */
function createCourrierSortantSheet() {
  const sheet = getOrCreateSheet('Courrier Sortant');
  const config = getConfig();

  // Effacer le contenu existant
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:J1').merge()
    .setValue('📤 REGISTRE COURRIER SORTANT')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Enregistrement',
    'Date Envoi',
    'Heure',
    'Destinataire',
    'Type',
    'Objet',
    'N° Courrier',
    'Envoyé Par',
    'Statut',
    'Observations'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 130);  // N° Enregistrement
  sheet.setColumnWidth(2, 110);  // Date
  sheet.setColumnWidth(3, 80);   // Heure
  sheet.setColumnWidth(4, 200);  // Destinataire
  sheet.setColumnWidth(5, 120);  // Type
  sheet.setColumnWidth(6, 300);  // Objet
  sheet.setColumnWidth(7, 130);  // N° Courrier
  sheet.setColumnWidth(8, 150);  // Envoyé par
  sheet.setColumnWidth(9, 100);  // Statut
  sheet.setColumnWidth(10, 250); // Observations

  // Geler les en-têtes
  sheet.setFrozenRows(2);

  // Ajouter validation pour le type
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Lettre', 'Colis', 'Recommandé', 'Express', 'Fax', 'Email', 'Autre'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E1000').setDataValidation(typeRule);

  // Ajouter validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['À envoyer', 'Envoyé', 'Reçu', 'Retourné'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I3:I1000').setDataValidation(statutRule);

  return sheet;
}

/**
 * Affiche le dialogue pour enregistrer un courrier entrant
 */
function showCourrierEntrantDialog() {
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
        <h2>Enregistrer courrier entrant</h2>
        <form id="courrierForm">
          <div class="form-group">
            <label>Date de réception *</label>
            <input type="date" id="dateReception" required>
          </div>

          <div class="form-group">
            <label>Heure de réception *</label>
            <input type="time" id="heureReception" required>
          </div>

          <div class="form-group">
            <label>Expéditeur *</label>
            <input type="text" id="expediteur" required>
          </div>

          <div class="form-group">
            <label>Type de courrier *</label>
            <select id="type" required>
              <option value="">Sélectionner...</option>
              <option value="Lettre">Lettre</option>
              <option value="Colis">Colis</option>
              <option value="Recommandé">Recommandé</option>
              <option value="Express">Express</option>
              <option value="Fax">Fax</option>
              <option value="Email">Email</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Objet *</label>
            <textarea id="objet" required></textarea>
          </div>

          <div class="form-group">
            <label>N° du courrier (référence)</label>
            <input type="text" id="numeroCourrier">
          </div>

          <div class="form-group">
            <label>Traité par</label>
            <input type="text" id="traitePar">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="En attente" selected>En attente</option>
              <option value="En cours">En cours</option>
              <option value="Traité">Traité</option>
              <option value="Archivé">Archivé</option>
            </select>
          </div>

          <div class="form-group">
            <label>Observations</label>
            <textarea id="observations"></textarea>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          // Initialiser avec la date et heure actuelles
          const now = new Date();
          document.getElementById('dateReception').valueAsDate = now;
          document.getElementById('heureReception').value = now.toTimeString().slice(0,5);

          document.getElementById('courrierForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const courrierData = {
              dateReception: document.getElementById('dateReception').value,
              heureReception: document.getElementById('heureReception').value,
              expediteur: document.getElementById('expediteur').value,
              type: document.getElementById('type').value,
              objet: document.getElementById('objet').value,
              numeroCourrier: document.getElementById('numeroCourrier').value,
              traitePar: document.getElementById('traitePar').value,
              statut: document.getElementById('statut').value,
              observations: document.getElementById('observations').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Courrier entrant enregistré avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addCourrierEntrant(courrierData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(550)
  .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Courrier Entrant');
}

/**
 * Affiche le dialogue pour enregistrer un courrier sortant
 */
function showCourrierSortantDialog() {
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
        <h2>Enregistrer courrier sortant</h2>
        <form id="courrierForm">
          <div class="form-group">
            <label>Date d'envoi *</label>
            <input type="date" id="dateEnvoi" required>
          </div>

          <div class="form-group">
            <label>Heure d'envoi *</label>
            <input type="time" id="heureEnvoi" required>
          </div>

          <div class="form-group">
            <label>Destinataire *</label>
            <input type="text" id="destinataire" required>
          </div>

          <div class="form-group">
            <label>Type de courrier *</label>
            <select id="type" required>
              <option value="">Sélectionner...</option>
              <option value="Lettre">Lettre</option>
              <option value="Colis">Colis</option>
              <option value="Recommandé">Recommandé</option>
              <option value="Express">Express</option>
              <option value="Fax">Fax</option>
              <option value="Email">Email</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Objet *</label>
            <textarea id="objet" required></textarea>
          </div>

          <div class="form-group">
            <label>N° du courrier (référence)</label>
            <input type="text" id="numeroCourrier">
          </div>

          <div class="form-group">
            <label>Envoyé par</label>
            <input type="text" id="envoyePar">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="À envoyer">À envoyer</option>
              <option value="Envoyé" selected>Envoyé</option>
              <option value="Reçu">Reçu</option>
              <option value="Retourné">Retourné</option>
            </select>
          </div>

          <div class="form-group">
            <label>Observations</label>
            <textarea id="observations"></textarea>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          // Initialiser avec la date et heure actuelles
          const now = new Date();
          document.getElementById('dateEnvoi').valueAsDate = now;
          document.getElementById('heureEnvoi').value = now.toTimeString().slice(0,5);

          document.getElementById('courrierForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const courrierData = {
              dateEnvoi: document.getElementById('dateEnvoi').value,
              heureEnvoi: document.getElementById('heureEnvoi').value,
              destinataire: document.getElementById('destinataire').value,
              type: document.getElementById('type').value,
              objet: document.getElementById('objet').value,
              numeroCourrier: document.getElementById('numeroCourrier').value,
              envoyePar: document.getElementById('envoyePar').value,
              statut: document.getElementById('statut').value,
              observations: document.getElementById('observations').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Courrier sortant enregistré avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addCourrierSortant(courrierData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(550)
  .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Courrier Sortant');
}

/**
 * Ajoute un courrier entrant
 */
function addCourrierEntrant(courrierData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Courrier Entrant');

  if (!sheet) {
    throw new Error('La feuille Courrier Entrant n\'existe pas.');
  }

  const config = getConfig();
  const numeroEnregistrement = getNextNumber(config.prefixes.courrierEntrant, 'Courrier Entrant');

  const newRow = [
    numeroEnregistrement,
    courrierData.dateReception,
    courrierData.heureReception,
    courrierData.expediteur,
    courrierData.type,
    courrierData.objet,
    courrierData.numeroCourrier,
    courrierData.traitePar,
    courrierData.statut,
    courrierData.observations
  ];

  sheet.appendRow(newRow);

  // Formatter la nouvelle ligne
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 10)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroEnregistrement;
}

/**
 * Ajoute un courrier sortant
 */
function addCourrierSortant(courrierData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Courrier Sortant');

  if (!sheet) {
    throw new Error('La feuille Courrier Sortant n\'existe pas.');
  }

  const config = getConfig();
  const numeroEnregistrement = getNextNumber(config.prefixes.courrierSortant, 'Courrier Sortant');

  const newRow = [
    numeroEnregistrement,
    courrierData.dateEnvoi,
    courrierData.heureEnvoi,
    courrierData.destinataire,
    courrierData.type,
    courrierData.objet,
    courrierData.numeroCourrier,
    courrierData.envoyePar,
    courrierData.statut,
    courrierData.observations
  ];

  sheet.appendRow(newRow);

  // Formatter la nouvelle ligne
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 10)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroEnregistrement;
}

/**
 * Va à la feuille courrier
 */
function goToCourrierSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Courrier Entrant');

  if (sheet) {
    ss.setActiveSheet(sheet);
  }
}
