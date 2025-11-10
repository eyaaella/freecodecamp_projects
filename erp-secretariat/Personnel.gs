/**
 * Module de gestion du personnel
 * Personnel.gs
 */

/**
 * Crée la feuille Personnel
 */
function createPersonnelSheet() {
  const sheet = getOrCreateSheet('Personnel');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:K1').merge()
    .setValue('👨‍💼 GESTION DU PERSONNEL')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Employé',
    'Nom Complet',
    'Poste',
    'Téléphone',
    'Email',
    'Date Embauche',
    'Type Contrat',
    'Salaire',
    'Adresse',
    'Date Naissance',
    'Statut'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 110);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 110);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 250);
  sheet.setColumnWidth(10, 110);
  sheet.setColumnWidth(11, 100);

  sheet.setFrozenRows(2);

  // Validation pour le type de contrat
  const contratRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['CDI', 'CDD', 'Stage', 'Freelance', 'Autre'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('G3:G1000').setDataValidation(contratRule);

  // Validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Actif', 'Congé', 'Suspendu', 'Démission', 'Licencié'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('K3:K1000').setDataValidation(statutRule);

  // Formatage conditionnel
  const rangeStatut = sheet.getRange('K3:K1000');

  const ruleActif = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Actif')
    .setBackground(config.colors.success)
    .setRanges([rangeStatut])
    .build();

  const ruleSuspendu = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Suspendu')
    .setBackground(config.colors.warning)
    .setRanges([rangeStatut])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleActif, ruleSuspendu);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Crée la feuille Présences
 */
function createPresencesSheet() {
  const sheet = getOrCreateSheet('Présences');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:G1').merge()
    .setValue('📋 REGISTRE DES PRÉSENCES')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'Date',
    'N° Employé',
    'Nom',
    'Heure Arrivée',
    'Heure Départ',
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
  sheet.setColumnWidth(1, 110);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 110);
  sheet.setColumnWidth(5, 110);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 250);

  sheet.setFrozenRows(2);

  // Validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Présent', 'Absent', 'Retard', 'Congé', 'Maladie'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('F3:F1000').setDataValidation(statutRule);

  // Formatage conditionnel
  const rangeStatut = sheet.getRange('F3:F1000');

  const rulePresent = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Présent')
    .setBackground(config.colors.success)
    .setRanges([rangeStatut])
    .build();

  const ruleAbsent = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Absent')
    .setBackground(config.colors.danger)
    .setRanges([rangeStatut])
    .build();

  const ruleRetard = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Retard')
    .setBackground(config.colors.warning)
    .setRanges([rangeStatut])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(rulePresent, ruleAbsent, ruleRetard);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Affiche le dialogue pour ajouter un employé
 */
function showAddEmployeDialog() {
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
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
        </style>
      </head>
      <body>
        <h2>Ajouter un employé</h2>
        <form id="employeForm">
          <div class="form-group">
            <label>Nom Complet *</label>
            <input type="text" id="nom" required>
          </div>

          <div class="form-group">
            <label>Poste *</label>
            <input type="text" id="poste" required>
          </div>

          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" id="telephone" placeholder="+237 XXX XXX XXX" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email">
          </div>

          <div class="form-group">
            <label>Date d'embauche *</label>
            <input type="date" id="dateEmbauche" required>
          </div>

          <div class="form-group">
            <label>Type de contrat *</label>
            <select id="typeContrat" required>
              <option value="">Sélectionner...</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Salaire (${getConfig().devise})</label>
            <input type="number" id="salaire" step="1000">
          </div>

          <div class="form-group">
            <label>Adresse</label>
            <textarea id="adresse"></textarea>
          </div>

          <div class="form-group">
            <label>Date de naissance</label>
            <input type="date" id="dateNaissance">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="Actif" selected>Actif</option>
              <option value="Congé">Congé</option>
              <option value="Suspendu">Suspendu</option>
              <option value="Démission">Démission</option>
              <option value="Licencié">Licencié</option>
            </select>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          // Initialiser avec la date actuelle
          document.getElementById('dateEmbauche').valueAsDate = new Date();

          document.getElementById('employeForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const employeData = {
              nom: document.getElementById('nom').value,
              poste: document.getElementById('poste').value,
              telephone: document.getElementById('telephone').value,
              email: document.getElementById('email').value,
              dateEmbauche: document.getElementById('dateEmbauche').value,
              typeContrat: document.getElementById('typeContrat').value,
              salaire: document.getElementById('salaire').value,
              adresse: document.getElementById('adresse').value,
              dateNaissance: document.getElementById('dateNaissance').value,
              statut: document.getElementById('statut').value
            };

            google.script.run
              .withSuccessHandler(function(numero) {
                alert('Employé ' + numero + ' ajouté avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addEmploye(employeData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouvel Employé');
}

/**
 * Affiche le dialogue pour enregistrer la présence
 */
function showPresenceDialog() {
  const employes = getActiveEmployes();
  let employeOptions = '<option value="">Sélectionner...</option>';
  for (let emp of employes) {
    employeOptions += `<option value="${emp.numero}" data-nom="${emp.nom}">${emp.numero} - ${emp.nom}</option>`;
  }

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
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
        </style>
      </head>
      <body>
        <h2>Enregistrer la présence</h2>
        <form id="presenceForm">
          <div class="form-group">
            <label>Date *</label>
            <input type="date" id="date" required>
          </div>

          <div class="form-group">
            <label>Employé *</label>
            <select id="employe" required onchange="updateNom()">
              ${employeOptions}
            </select>
            <input type="hidden" id="nom">
          </div>

          <div class="form-group">
            <label>Heure d'arrivée</label>
            <input type="time" id="heureArrivee">
          </div>

          <div class="form-group">
            <label>Heure de départ</label>
            <input type="time" id="heureDepart">
          </div>

          <div class="form-group">
            <label>Statut *</label>
            <select id="statut" required>
              <option value="Présent" selected>Présent</option>
              <option value="Absent">Absent</option>
              <option value="Retard">Retard</option>
              <option value="Congé">Congé</option>
              <option value="Maladie">Maladie</option>
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
          // Initialiser avec la date actuelle
          document.getElementById('date').valueAsDate = new Date();

          // Initialiser avec l'heure actuelle pour l'arrivée
          const now = new Date();
          document.getElementById('heureArrivee').value = now.toTimeString().slice(0,5);

          function updateNom() {
            const select = document.getElementById('employe');
            const option = select.options[select.selectedIndex];
            document.getElementById('nom').value = option.getAttribute('data-nom') || '';
          }

          document.getElementById('presenceForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const presenceData = {
              date: document.getElementById('date').value,
              numero: document.getElementById('employe').value,
              nom: document.getElementById('nom').value,
              heureArrivee: document.getElementById('heureArrivee').value,
              heureDepart: document.getElementById('heureDepart').value,
              statut: document.getElementById('statut').value,
              observations: document.getElementById('observations').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Présence enregistrée avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addPresence(presenceData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(550);

  SpreadsheetApp.getUi().showModalDialog(html, 'Enregistrer Présence');
}

/**
 * Ajoute un employé
 */
function addEmploye(employeData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Personnel');
  if (!sheet) throw new Error('La feuille Personnel n\'existe pas.');

  const config = getConfig();
  const numeroEmploye = getNextNumber(config.prefixes.employe, 'Personnel');

  const newRow = [
    numeroEmploye,
    employeData.nom,
    employeData.poste,
    employeData.telephone,
    employeData.email,
    employeData.dateEmbauche,
    employeData.typeContrat,
    employeData.salaire ? employeData.salaire + ' ' + config.devise : '',
    employeData.adresse,
    employeData.dateNaissance,
    employeData.statut
  ];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 11)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroEmploye;
}

/**
 * Enregistre une présence
 */
function addPresence(presenceData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Présences');
  if (!sheet) throw new Error('La feuille Présences n\'existe pas.');

  const newRow = [
    presenceData.date,
    presenceData.numero,
    presenceData.nom,
    presenceData.heureArrivee,
    presenceData.heureDepart,
    presenceData.statut,
    presenceData.observations
  ];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 7)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return true;
}

/**
 * Récupère la liste des employés actifs
 */
function getActiveEmployes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Personnel');

  if (!sheet || sheet.getLastRow() < 3) {
    return [];
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 11).getValues();
  const employes = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][10] === 'Actif') { // Statut
      employes.push({
        numero: data[i][0],
        nom: data[i][1]
      });
    }
  }

  return employes;
}

/**
 * Va à la feuille personnel
 */
function goToPersonnelSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Personnel');

  if (sheet) {
    ss.setActiveSheet(sheet);
  }
}
