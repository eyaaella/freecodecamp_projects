/**
 * Module de gestion des clients
 * Clients.gs
 */

/**
 * Crée la feuille Clients
 */
function createClientsSheet() {
  const sheet = getOrCreateSheet('Clients');
  const config = getConfig();

  // Effacer le contenu existant
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:J1').merge()
    .setValue('👥 GESTION DES CLIENTS')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Client',
    'Nom/Raison Sociale',
    'Type',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'Contact Principal',
    'Date Création',
    'Statut'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 100);  // N° Client
  sheet.setColumnWidth(2, 200);  // Nom
  sheet.setColumnWidth(3, 100);  // Type
  sheet.setColumnWidth(4, 120);  // Téléphone
  sheet.setColumnWidth(5, 180);  // Email
  sheet.setColumnWidth(6, 250);  // Adresse
  sheet.setColumnWidth(7, 120);  // Ville
  sheet.setColumnWidth(8, 150);  // Contact
  sheet.setColumnWidth(9, 110);  // Date
  sheet.setColumnWidth(10, 100); // Statut

  // Geler les en-têtes
  sheet.setFrozenRows(2);

  // Ajouter validation pour le type
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Particulier', 'Entreprise', 'Administration', 'ONG'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C3:C1000').setDataValidation(typeRule);

  // Ajouter validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Actif', 'Inactif', 'Suspendu'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('J3:J1000').setDataValidation(statutRule);

  return sheet;
}

/**
 * Affiche le dialogue pour ajouter un client
 */
function showAddClientDialog() {
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
        <h2>Ajouter un nouveau client</h2>
        <form id="clientForm">
          <div class="form-group">
            <label>Type de client *</label>
            <select id="type" required>
              <option value="">Sélectionner...</option>
              <option value="Particulier">Particulier</option>
              <option value="Entreprise">Entreprise</option>
              <option value="Administration">Administration</option>
              <option value="ONG">ONG</option>
            </select>
          </div>

          <div class="form-group">
            <label>Nom / Raison Sociale *</label>
            <input type="text" id="nom" required>
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
            <label>Adresse</label>
            <textarea id="adresse"></textarea>
          </div>

          <div class="form-group">
            <label>Ville</label>
            <input type="text" id="ville" value="Yaoundé">
          </div>

          <div class="form-group">
            <label>Contact Principal</label>
            <input type="text" id="contact">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="Actif" selected>Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          document.getElementById('clientForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const clientData = {
              type: document.getElementById('type').value,
              nom: document.getElementById('nom').value,
              telephone: document.getElementById('telephone').value,
              email: document.getElementById('email').value,
              adresse: document.getElementById('adresse').value,
              ville: document.getElementById('ville').value,
              contact: document.getElementById('contact').value,
              statut: document.getElementById('statut').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Client ajouté avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addClient(clientData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Client');
}

/**
 * Ajoute un client dans la feuille
 */
function addClient(clientData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');

  if (!sheet) {
    throw new Error('La feuille Clients n\'existe pas. Veuillez l\'initialiser.');
  }

  const config = getConfig();
  const numeroClient = getNextNumber(config.prefixes.client, 'Clients');
  const dateCreation = formatDate(new Date());

  const newRow = [
    numeroClient,
    clientData.nom,
    clientData.type,
    clientData.telephone,
    clientData.email,
    clientData.adresse,
    clientData.ville,
    clientData.contact,
    dateCreation,
    clientData.statut
  ];

  sheet.appendRow(newRow);

  // Formatter la nouvelle ligne
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 10)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroClient;
}

/**
 * Recherche un client
 */
function searchClient(searchTerm) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');

  if (!sheet) {
    return [];
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
  const results = [];

  searchTerm = searchTerm.toLowerCase();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const numero = row[0].toString().toLowerCase();
    const nom = row[1].toString().toLowerCase();
    const telephone = row[3].toString().toLowerCase();

    if (numero.includes(searchTerm) || nom.includes(searchTerm) || telephone.includes(searchTerm)) {
      results.push({
        numero: row[0],
        nom: row[1],
        type: row[2],
        telephone: row[3],
        email: row[4],
        adresse: row[5],
        ville: row[6],
        contact: row[7],
        dateCreation: row[8],
        statut: row[9]
      });
    }
  }

  return results;
}

/**
 * Obtient la liste de tous les clients actifs
 */
function getActiveClients() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');

  if (!sheet || sheet.getLastRow() < 3) {
    return [];
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
  const clients = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row[9] === 'Actif') { // Statut
      clients.push({
        numero: row[0],
        nom: row[1],
        telephone: row[3]
      });
    }
  }

  return clients;
}
