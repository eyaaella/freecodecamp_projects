/**
 * Module de gestion de la facturation et des devis
 * Facturation.gs
 */

/**
 * Crée la feuille Devis
 */
function createDevisSheet() {
  const sheet = getOrCreateSheet('Devis');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:J1').merge()
    .setValue('📋 GESTION DES DEVIS')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Devis',
    'Date',
    'Client',
    'Description',
    'Montant HT',
    'TVA (' + config.tauxTVA + '%)',
    'Montant TTC',
    'Validité',
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
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 110);
  sheet.setColumnWidth(9, 120);
  sheet.setColumnWidth(10, 200);

  sheet.setFrozenRows(2);

  // Validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['En cours', 'Envoyé', 'Accepté', 'Refusé', 'Expiré'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('I3:I1000').setDataValidation(statutRule);

  // Formatage conditionnel
  const rangeStatut = sheet.getRange('I3:I1000');

  const ruleAccepte = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Accepté')
    .setBackground(config.colors.success)
    .setRanges([rangeStatut])
    .build();

  const ruleRefuse = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Refusé')
    .setBackground(config.colors.danger)
    .setRanges([rangeStatut])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleAccepte, ruleRefuse);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Crée la feuille Factures
 */
function createFacturesSheet() {
  const sheet = getOrCreateSheet('Factures');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:K1').merge()
    .setValue('🧾 GESTION DES FACTURES')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Facture',
    'Date',
    'Client',
    'Description',
    'Montant HT',
    'TVA (' + config.tauxTVA + '%)',
    'Montant TTC',
    'Payé',
    'Reste à payer',
    'Échéance',
    'Statut'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 110);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 120);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 120);
  sheet.setColumnWidth(10, 110);
  sheet.setColumnWidth(11, 120);

  sheet.setFrozenRows(2);

  // Validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Brouillon', 'Émise', 'Payée partiellement', 'Payée', 'En retard', 'Annulée'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('K3:K1000').setDataValidation(statutRule);

  // Formatage conditionnel
  const rangeStatut = sheet.getRange('K3:K1000');

  const rulePayee = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Payée')
    .setBackground(config.colors.success)
    .setRanges([rangeStatut])
    .build();

  const ruleRetard = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('En retard')
    .setBackground(config.colors.danger)
    .setRanges([rangeStatut])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(rulePayee, ruleRetard);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Crée la feuille Paiements
 */
function createPaiementsSheet() {
  const sheet = getOrCreateSheet('Paiements');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:H1').merge()
    .setValue('💳 REGISTRE DES PAIEMENTS')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'Date',
    'N° Facture',
    'Client',
    'Montant',
    'Mode de paiement',
    'Référence',
    'Reçu par',
    'Notes'
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
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 250);

  sheet.setFrozenRows(2);

  // Validation pour le mode de paiement
  const modeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Espèces', 'Chèque', 'Virement', 'Mobile Money', 'Carte bancaire', 'Autre'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E1000').setDataValidation(modeRule);

  return sheet;
}

/**
 * Affiche le dialogue pour créer un devis
 */
function showCreateDevisDialog() {
  const clients = getActiveClients();
  let clientOptions = '<option value="">Sélectionner un client...</option>';
  for (let client of clients) {
    clientOptions += `<option value="${client.nom}">${client.numero} - ${client.nom}</option>`;
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
          textarea { height: 80px; }
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
          .calculated { background-color: #f0f0f0; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Créer un devis</h2>
        <form id="devisForm">
          <div class="form-group">
            <label>Client *</label>
            <select id="client" required>
              ${clientOptions}
            </select>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea id="description" required></textarea>
          </div>

          <div class="form-group">
            <label>Montant HT (${getConfig().devise}) *</label>
            <input type="number" id="montantHT" step="0.01" required onchange="calculateTTC()">
          </div>

          <div class="form-group">
            <label>Montant TVA (${getConfig().devise})</label>
            <input type="number" id="montantTVA" step="0.01" readonly class="calculated">
          </div>

          <div class="form-group">
            <label>Montant TTC (${getConfig().devise})</label>
            <input type="number" id="montantTTC" step="0.01" readonly class="calculated">
          </div>

          <div class="form-group">
            <label>Validité (jours)</label>
            <input type="number" id="validite" value="30" min="1">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="En cours" selected>En cours</option>
              <option value="Envoyé">Envoyé</option>
              <option value="Accepté">Accepté</option>
              <option value="Refusé">Refusé</option>
              <option value="Expiré">Expiré</option>
            </select>
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea id="notes"></textarea>
          </div>

          <button type="submit">Créer le devis</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          const tauxTVA = ${getConfig().tauxTVA};

          function calculateTTC() {
            const montantHT = parseFloat(document.getElementById('montantHT').value) || 0;
            const montantTVA = montantHT * (tauxTVA / 100);
            const montantTTC = montantHT + montantTVA;

            document.getElementById('montantTVA').value = montantTVA.toFixed(2);
            document.getElementById('montantTTC').value = montantTTC.toFixed(2);
          }

          document.getElementById('devisForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const devisData = {
              client: document.getElementById('client').value,
              description: document.getElementById('description').value,
              montantHT: parseFloat(document.getElementById('montantHT').value),
              montantTVA: parseFloat(document.getElementById('montantTVA').value),
              montantTTC: parseFloat(document.getElementById('montantTTC').value),
              validite: parseInt(document.getElementById('validite').value),
              statut: document.getElementById('statut').value,
              notes: document.getElementById('notes').value
            };

            google.script.run
              .withSuccessHandler(function(numero) {
                alert('Devis ' + numero + ' créé avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .createDevis(devisData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(550)
  .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Devis');
}

/**
 * Affiche le dialogue pour créer une facture
 */
function showCreateFactureDialog() {
  const clients = getActiveClients();
  let clientOptions = '<option value="">Sélectionner un client...</option>';
  for (let client of clients) {
    clientOptions += `<option value="${client.nom}">${client.numero} - ${client.nom}</option>`;
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
          textarea { height: 80px; }
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
          .calculated { background-color: #f0f0f0; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Créer une facture</h2>
        <form id="factureForm">
          <div class="form-group">
            <label>Client *</label>
            <select id="client" required>
              ${clientOptions}
            </select>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea id="description" required></textarea>
          </div>

          <div class="form-group">
            <label>Montant HT (${getConfig().devise}) *</label>
            <input type="number" id="montantHT" step="0.01" required onchange="calculateTTC()">
          </div>

          <div class="form-group">
            <label>Montant TVA (${getConfig().devise})</label>
            <input type="number" id="montantTVA" step="0.01" readonly class="calculated">
          </div>

          <div class="form-group">
            <label>Montant TTC (${getConfig().devise})</label>
            <input type="number" id="montantTTC" step="0.01" readonly class="calculated">
          </div>

          <div class="form-group">
            <label>Date d'échéance</label>
            <input type="date" id="echeance">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="Brouillon">Brouillon</option>
              <option value="Émise" selected>Émise</option>
              <option value="Payée partiellement">Payée partiellement</option>
              <option value="Payée">Payée</option>
              <option value="En retard">En retard</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          <button type="submit">Créer la facture</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          const tauxTVA = ${getConfig().tauxTVA};

          // Initialiser date d'échéance à +30 jours
          const echeance = new Date();
          echeance.setDate(echeance.getDate() + 30);
          document.getElementById('echeance').valueAsDate = echeance;

          function calculateTTC() {
            const montantHT = parseFloat(document.getElementById('montantHT').value) || 0;
            const montantTVA = montantHT * (tauxTVA / 100);
            const montantTTC = montantHT + montantTVA;

            document.getElementById('montantTVA').value = montantTVA.toFixed(2);
            document.getElementById('montantTTC').value = montantTTC.toFixed(2);
          }

          document.getElementById('factureForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const factureData = {
              client: document.getElementById('client').value,
              description: document.getElementById('description').value,
              montantHT: parseFloat(document.getElementById('montantHT').value),
              montantTVA: parseFloat(document.getElementById('montantTVA').value),
              montantTTC: parseFloat(document.getElementById('montantTTC').value),
              echeance: document.getElementById('echeance').value,
              statut: document.getElementById('statut').value
            };

            google.script.run
              .withSuccessHandler(function(numero) {
                alert('Facture ' + numero + ' créée avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .createFacture(factureData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(550)
  .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouvelle Facture');
}

/**
 * Affiche le dialogue pour enregistrer un paiement
 */
function showPaiementDialog() {
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
        <h2>Enregistrer un paiement</h2>
        <form id="paiementForm">
          <div class="form-group">
            <label>Date *</label>
            <input type="date" id="date" required>
          </div>

          <div class="form-group">
            <label>N° Facture *</label>
            <input type="text" id="numeroFacture" required>
          </div>

          <div class="form-group">
            <label>Client *</label>
            <input type="text" id="client" required>
          </div>

          <div class="form-group">
            <label>Montant (${getConfig().devise}) *</label>
            <input type="number" id="montant" step="0.01" required>
          </div>

          <div class="form-group">
            <label>Mode de paiement *</label>
            <select id="mode" required>
              <option value="">Sélectionner...</option>
              <option value="Espèces">Espèces</option>
              <option value="Chèque">Chèque</option>
              <option value="Virement">Virement</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Carte bancaire">Carte bancaire</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Référence</label>
            <input type="text" id="reference">
          </div>

          <div class="form-group">
            <label>Reçu par</label>
            <input type="text" id="recuPar">
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

          document.getElementById('paiementForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const paiementData = {
              date: document.getElementById('date').value,
              numeroFacture: document.getElementById('numeroFacture').value,
              client: document.getElementById('client').value,
              montant: parseFloat(document.getElementById('montant').value),
              mode: document.getElementById('mode').value,
              reference: document.getElementById('reference').value,
              recuPar: document.getElementById('recuPar').value,
              notes: document.getElementById('notes').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Paiement enregistré avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addPaiement(paiementData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Paiement');
}

/**
 * Crée un devis
 */
function createDevis(devisData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devis');
  if (!sheet) throw new Error('La feuille Devis n\'existe pas.');

  const config = getConfig();
  const numeroDevis = getNextNumber(config.prefixes.devis, 'Devis');
  const date = formatDate(new Date());

  const validiteDate = new Date();
  validiteDate.setDate(validiteDate.getDate() + devisData.validite);

  const newRow = [
    numeroDevis,
    date,
    devisData.client,
    devisData.description,
    devisData.montantHT + ' ' + config.devise,
    devisData.montantTVA + ' ' + config.devise,
    devisData.montantTTC + ' ' + config.devise,
    formatDate(validiteDate),
    devisData.statut,
    devisData.notes
  ];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 10)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroDevis;
}

/**
 * Crée une facture
 */
function createFacture(factureData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
  if (!sheet) throw new Error('La feuille Factures n\'existe pas.');

  const config = getConfig();
  const numeroFacture = getNextNumber(config.prefixes.facture, 'Factures');
  const date = formatDate(new Date());

  const newRow = [
    numeroFacture,
    date,
    factureData.client,
    factureData.description,
    factureData.montantHT + ' ' + config.devise,
    factureData.montantTVA + ' ' + config.devise,
    factureData.montantTTC + ' ' + config.devise,
    '0 ' + config.devise,
    factureData.montantTTC + ' ' + config.devise,
    factureData.echeance,
    factureData.statut
  ];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 11)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroFacture;
}

/**
 * Ajoute un paiement
 */
function addPaiement(paiementData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Paiements');
  if (!sheet) throw new Error('La feuille Paiements n\'existe pas.');

  const config = getConfig();

  const newRow = [
    paiementData.date,
    paiementData.numeroFacture,
    paiementData.client,
    paiementData.montant + ' ' + config.devise,
    paiementData.mode,
    paiementData.reference,
    paiementData.recuPar,
    paiementData.notes
  ];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 8)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  // Mettre à jour le statut de la facture
  updateFactureStatus(paiementData.numeroFacture, paiementData.montant);

  return true;
}

/**
 * Met à jour le statut d'une facture après un paiement
 */
function updateFactureStatus(numeroFacture, montantPaye) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 2; i < data.length; i++) {
    if (data[i][0] === numeroFacture) {
      // Calculer le total payé
      const paiements = getPaiementsForFacture(numeroFacture);
      let totalPaye = 0;
      for (let p of paiements) {
        totalPaye += p;
      }

      // Récupérer le montant TTC
      const montantTTCStr = data[i][6].toString();
      const montantTTC = parseFloat(montantTTCStr.replace(/[^0-9.-]+/g, ''));

      const reste = montantTTC - totalPaye;

      // Mettre à jour les colonnes Payé et Reste à payer
      const config = getConfig();
      sheet.getRange(i + 1, 8).setValue(totalPaye + ' ' + config.devise);
      sheet.getRange(i + 1, 9).setValue(reste + ' ' + config.devise);

      // Mettre à jour le statut
      let nouveauStatut = 'Émise';
      if (reste <= 0) {
        nouveauStatut = 'Payée';
      } else if (totalPaye > 0) {
        nouveauStatut = 'Payée partiellement';
      }

      sheet.getRange(i + 1, 11).setValue(nouveauStatut);
      break;
    }
  }
}

/**
 * Récupère tous les paiements pour une facture
 */
function getPaiementsForFacture(numeroFacture) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Paiements');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const montants = [];

  for (let i = 2; i < data.length; i++) {
    if (data[i][1] === numeroFacture) {
      const montantStr = data[i][3].toString();
      const montant = parseFloat(montantStr.replace(/[^0-9.-]+/g, ''));
      montants.push(montant);
    }
  }

  return montants;
}
