/**
 * Module de gestion des fournisseurs
 * Fournisseurs.gs
 */

/**
 * Crée la feuille Fournisseurs
 */
function createFournisseursSheet() {
  const sheet = getOrCreateSheet('Fournisseurs');
  const config = getConfig();

  // Effacer le contenu existant
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:K1').merge()
    .setValue('🏪 GESTION DES FOURNISSEURS')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'N° Fournisseur',
    'Nom/Raison Sociale',
    'Catégorie',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'Contact Principal',
    'Délai Livraison',
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
  sheet.setColumnWidth(1, 120);  // N° Fournisseur
  sheet.setColumnWidth(2, 200);  // Nom
  sheet.setColumnWidth(3, 120);  // Catégorie
  sheet.setColumnWidth(4, 120);  // Téléphone
  sheet.setColumnWidth(5, 180);  // Email
  sheet.setColumnWidth(6, 250);  // Adresse
  sheet.setColumnWidth(7, 120);  // Ville
  sheet.setColumnWidth(8, 150);  // Contact
  sheet.setColumnWidth(9, 100);  // Délai
  sheet.setColumnWidth(10, 110); // Date
  sheet.setColumnWidth(11, 100); // Statut

  // Geler les en-têtes
  sheet.setFrozenRows(2);

  // Ajouter validation pour la catégorie
  const categorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Fournitures Bureau', 'Informatique', 'Services', 'Papeterie', 'Mobilier', 'Autre'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C3:C1000').setDataValidation(categorieRule);

  // Ajouter validation pour le statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Actif', 'Inactif', 'Bloqué'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('K3:K1000').setDataValidation(statutRule);

  return sheet;
}

/**
 * Affiche le dialogue pour ajouter un fournisseur
 */
function showAddFournisseurDialog() {
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
        <h2>Ajouter un nouveau fournisseur</h2>
        <form id="fournisseurForm">
          <div class="form-group">
            <label>Catégorie *</label>
            <select id="categorie" required>
              <option value="">Sélectionner...</option>
              <option value="Fournitures Bureau">Fournitures Bureau</option>
              <option value="Informatique">Informatique</option>
              <option value="Services">Services</option>
              <option value="Papeterie">Papeterie</option>
              <option value="Mobilier">Mobilier</option>
              <option value="Autre">Autre</option>
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
            <label>Délai de livraison (jours)</label>
            <input type="number" id="delai" value="3" min="0">
          </div>

          <div class="form-group">
            <label>Statut</label>
            <select id="statut">
              <option value="Actif" selected>Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Bloqué">Bloqué</option>
            </select>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          document.getElementById('fournisseurForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const fournisseurData = {
              categorie: document.getElementById('categorie').value,
              nom: document.getElementById('nom').value,
              telephone: document.getElementById('telephone').value,
              email: document.getElementById('email').value,
              adresse: document.getElementById('adresse').value,
              ville: document.getElementById('ville').value,
              contact: document.getElementById('contact').value,
              delai: document.getElementById('delai').value,
              statut: document.getElementById('statut').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Fournisseur ajouté avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addFournisseur(fournisseurData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouveau Fournisseur');
}

/**
 * Ajoute un fournisseur dans la feuille
 */
function addFournisseur(fournisseurData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');

  if (!sheet) {
    throw new Error('La feuille Fournisseurs n\'existe pas. Veuillez l\'initialiser.');
  }

  const config = getConfig();
  const numeroFournisseur = getNextNumber(config.prefixes.fournisseur, 'Fournisseurs');
  const dateCreation = formatDate(new Date());

  const newRow = [
    numeroFournisseur,
    fournisseurData.nom,
    fournisseurData.categorie,
    fournisseurData.telephone,
    fournisseurData.email,
    fournisseurData.adresse,
    fournisseurData.ville,
    fournisseurData.contact,
    fournisseurData.delai + ' jours',
    dateCreation,
    fournisseurData.statut
  ];

  sheet.appendRow(newRow);

  // Formatter la nouvelle ligne
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 11)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return numeroFournisseur;
}

/**
 * Recherche un fournisseur
 */
function searchFournisseur(searchTerm) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');

  if (!sheet) {
    return [];
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 11).getValues();
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
        categorie: row[2],
        telephone: row[3],
        email: row[4],
        adresse: row[5],
        ville: row[6],
        contact: row[7],
        delai: row[8],
        dateCreation: row[9],
        statut: row[10]
      });
    }
  }

  return results;
}

/**
 * Affiche le dialogue de recherche de contacts
 */
function showSearchContactDialog() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          input { width: 100%; padding: 10px; font-size: 14px; margin-bottom: 15px; }
          .tabs { display: flex; margin-bottom: 20px; }
          .tab { flex: 1; padding: 10px; text-align: center; cursor: pointer; background: #eee; }
          .tab.active { background: #4A86E8; color: white; }
          .results { max-height: 400px; overflow-y: auto; }
          .result-item { padding: 10px; border: 1px solid #ddd; margin-bottom: 10px; }
          .result-item:hover { background: #f5f5f5; }
          .no-results { text-align: center; color: #999; padding: 20px; }
        </style>
      </head>
      <body>
        <h2>Rechercher un contact</h2>

        <div class="tabs">
          <div class="tab active" onclick="switchTab('clients')">Clients</div>
          <div class="tab" onclick="switchTab('fournisseurs')">Fournisseurs</div>
        </div>

        <input type="text" id="searchInput" placeholder="Rechercher par nom, numéro ou téléphone..." onkeyup="search()">

        <div class="results" id="results">
          <div class="no-results">Saisissez un terme de recherche</div>
        </div>

        <script>
          let currentTab = 'clients';

          function switchTab(tab) {
            currentTab = tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            search();
          }

          function search() {
            const term = document.getElementById('searchInput').value;
            if (term.length < 2) {
              document.getElementById('results').innerHTML = '<div class="no-results">Saisissez au moins 2 caractères</div>';
              return;
            }

            const functionName = currentTab === 'clients' ? 'searchClient' : 'searchFournisseur';

            google.script.run
              .withSuccessHandler(displayResults)
              .withFailureHandler(function(error) {
                document.getElementById('results').innerHTML = '<div class="no-results">Erreur: ' + error + '</div>';
              })
              [functionName](term);
          }

          function displayResults(results) {
            const container = document.getElementById('results');

            if (results.length === 0) {
              container.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
              return;
            }

            let html = '';
            results.forEach(function(item) {
              html += '<div class="result-item">';
              html += '<strong>' + item.nom + '</strong><br>';
              html += 'N°: ' + item.numero + '<br>';
              html += 'Tél: ' + item.telephone + '<br>';
              if (item.email) html += 'Email: ' + item.email + '<br>';
              html += 'Statut: ' + item.statut;
              html += '</div>';
            });

            container.innerHTML = html;
          }
        </script>
      </body>
    </html>
  `)
  .setWidth(600)
  .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, 'Recherche de contacts');
}
