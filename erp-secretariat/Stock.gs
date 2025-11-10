/**
 * Module de gestion des stocks de fournitures
 * Stock.gs
 */

/**
 * Crée la feuille Stock
 */
function createStockSheet() {
  const sheet = getOrCreateSheet('Stock');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:J1').merge()
    .setValue('📦 GESTION DU STOCK')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'Code Article',
    'Désignation',
    'Catégorie',
    'Unité',
    'Stock Initial',
    'Entrées',
    'Sorties',
    'Stock Actuel',
    'Stock Min',
    'Statut'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Formatage des colonnes
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 80);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 100);
  sheet.setColumnWidth(10, 120);

  sheet.setFrozenRows(2);

  // Validation pour la catégorie
  const categorieRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'Papeterie',
      'Fournitures bureau',
      'Consommables informatique',
      'Entretien',
      'Autre'
    ], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('C3:C1000').setDataValidation(categorieRule);

  // Validation pour l'unité
  const uniteRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pièce', 'Boîte', 'Paquet', 'Carton', 'Litre', 'Kg'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('D3:D1000').setDataValidation(uniteRule);

  // Formules pour Stock Actuel
  sheet.getRange('H3:H1000').setFormulaR1C1('=RC[-3]+RC[-2]-RC[-1]');

  // Formules pour Statut
  sheet.getRange('J3:J1000').setFormulaR1C1('=IF(RC[-2]<=RC[-1],"Stock faible","OK")');

  // Formatage conditionnel pour le statut
  const rangeStatut = sheet.getRange('J3:J1000');

  const ruleFaible = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Stock faible')
    .setBackground(config.colors.warning)
    .setRanges([rangeStatut])
    .build();

  const ruleOk = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('OK')
    .setBackground(config.colors.success)
    .setRanges([rangeStatut])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleFaible, ruleOk);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Crée la feuille Mouvements Stock
 */
function createMouvementsStockSheet() {
  const sheet = getOrCreateSheet('Mouvements Stock');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:H1').merge()
    .setValue('📊 MOUVEMENTS DE STOCK')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // En-têtes des colonnes
  const headers = [
    'Date',
    'Heure',
    'Code Article',
    'Désignation',
    'Type',
    'Quantité',
    'Responsable',
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
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 250);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 150);
  sheet.setColumnWidth(8, 250);

  sheet.setFrozenRows(2);

  // Validation pour le type
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Entrée', 'Sortie', 'Ajustement'], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E1000').setDataValidation(typeRule);

  // Formatage conditionnel
  const rangeType = sheet.getRange('E3:E1000');

  const ruleEntree = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Entrée')
    .setBackground(config.colors.success)
    .setRanges([rangeType])
    .build();

  const ruleSortie = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Sortie')
    .setBackground(config.colors.warning)
    .setRanges([rangeType])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(ruleEntree, ruleSortie);
  sheet.setConditionalFormatRules(rules);

  return sheet;
}

/**
 * Affiche le dialogue pour ajouter un article
 */
function showAddArticleDialog() {
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input, select { width: 100%; padding: 8px; box-sizing: border-box; }
          button { background-color: #4A86E8; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
          button:hover { background-color: #3367D6; }
          .cancel { background-color: #999; }
          .cancel:hover { background-color: #666; }
        </style>
      </head>
      <body>
        <h2>Ajouter un article au stock</h2>
        <form id="articleForm">
          <div class="form-group">
            <label>Code Article *</label>
            <input type="text" id="code" required placeholder="Ex: ART001">
          </div>

          <div class="form-group">
            <label>Désignation *</label>
            <input type="text" id="designation" required>
          </div>

          <div class="form-group">
            <label>Catégorie *</label>
            <select id="categorie" required>
              <option value="">Sélectionner...</option>
              <option value="Papeterie">Papeterie</option>
              <option value="Fournitures bureau">Fournitures bureau</option>
              <option value="Consommables informatique">Consommables informatique</option>
              <option value="Entretien">Entretien</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Unité *</label>
            <select id="unite" required>
              <option value="Pièce" selected>Pièce</option>
              <option value="Boîte">Boîte</option>
              <option value="Paquet">Paquet</option>
              <option value="Carton">Carton</option>
              <option value="Litre">Litre</option>
              <option value="Kg">Kg</option>
            </select>
          </div>

          <div class="form-group">
            <label>Stock Initial *</label>
            <input type="number" id="stockInitial" value="0" min="0" required>
          </div>

          <div class="form-group">
            <label>Stock Minimum *</label>
            <input type="number" id="stockMin" value="5" min="0" required>
          </div>

          <button type="submit">Ajouter</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          document.getElementById('articleForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const articleData = {
              code: document.getElementById('code').value,
              designation: document.getElementById('designation').value,
              categorie: document.getElementById('categorie').value,
              unite: document.getElementById('unite').value,
              stockInitial: parseInt(document.getElementById('stockInitial').value),
              stockMin: parseInt(document.getElementById('stockMin').value)
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Article ajouté avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addArticle(articleData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(550);

  SpreadsheetApp.getUi().showModalDialog(html, 'Nouvel Article');
}

/**
 * Affiche le dialogue pour un mouvement de stock
 */
function showMouvementStockDialog() {
  const articles = getArticles();
  let articleOptions = '<option value="">Sélectionner...</option>';
  for (let article of articles) {
    articleOptions += `<option value="${article.code}" data-designation="${article.designation}">${article.code} - ${article.designation}</option>`;
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
        <h2>Mouvement de stock</h2>
        <form id="mouvementForm">
          <div class="form-group">
            <label>Article *</label>
            <select id="article" required onchange="updateDesignation()">
              ${articleOptions}
            </select>
            <input type="hidden" id="designation">
          </div>

          <div class="form-group">
            <label>Type de mouvement *</label>
            <select id="type" required>
              <option value="">Sélectionner...</option>
              <option value="Entrée">Entrée</option>
              <option value="Sortie">Sortie</option>
              <option value="Ajustement">Ajustement</option>
            </select>
          </div>

          <div class="form-group">
            <label>Quantité *</label>
            <input type="number" id="quantite" min="1" required>
          </div>

          <div class="form-group">
            <label>Responsable</label>
            <input type="text" id="responsable">
          </div>

          <div class="form-group">
            <label>Observations</label>
            <textarea id="observations"></textarea>
          </div>

          <button type="submit">Enregistrer</button>
          <button type="button" class="cancel" onclick="google.script.host.close()">Annuler</button>
        </form>

        <script>
          function updateDesignation() {
            const select = document.getElementById('article');
            const option = select.options[select.selectedIndex];
            document.getElementById('designation').value = option.getAttribute('data-designation') || '';
          }

          document.getElementById('mouvementForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const mouvementData = {
              code: document.getElementById('article').value,
              designation: document.getElementById('designation').value,
              type: document.getElementById('type').value,
              quantite: parseInt(document.getElementById('quantite').value),
              responsable: document.getElementById('responsable').value,
              observations: document.getElementById('observations').value
            };

            google.script.run
              .withSuccessHandler(function() {
                alert('Mouvement enregistré avec succès !');
                google.script.host.close();
              })
              .withFailureHandler(function(error) {
                alert('Erreur : ' + error);
              })
              .addMouvementStock(mouvementData);
          });
        </script>
      </body>
    </html>
  `)
  .setWidth(500)
  .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'Mouvement de Stock');
}

/**
 * Ajoute un article au stock
 */
function addArticle(articleData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');
  if (!sheet) throw new Error('La feuille Stock n\'existe pas.');

  const newRow = [
    articleData.code,
    articleData.designation,
    articleData.categorie,
    articleData.unite,
    articleData.stockInitial,
    0, // Entrées
    0, // Sorties
    '', // Stock actuel (calculé par formule)
    articleData.stockMin,
    '' // Statut (calculé par formule)
  ];

  sheet.appendRow(newRow);

  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, 10)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  return true;
}

/**
 * Enregistre un mouvement de stock
 */
function addMouvementStock(mouvementData) {
  const mouvementsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Mouvements Stock');
  const stockSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');

  if (!mouvementsSheet || !stockSheet) {
    throw new Error('Les feuilles nécessaires n\'existent pas.');
  }

  const now = new Date();
  const date = formatDate(now);
  const heure = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm');

  // Ajouter le mouvement
  const newRow = [
    date,
    heure,
    mouvementData.code,
    mouvementData.designation,
    mouvementData.type,
    mouvementData.quantite,
    mouvementData.responsable,
    mouvementData.observations
  ];

  mouvementsSheet.appendRow(newRow);

  const lastRow = mouvementsSheet.getLastRow();
  mouvementsSheet.getRange(lastRow, 1, 1, 8)
    .setBorder(true, true, true, true, false, false)
    .setVerticalAlignment('middle');

  // Mettre à jour le stock
  updateStock(mouvementData.code, mouvementData.type, mouvementData.quantite);

  return true;
}

/**
 * Met à jour le stock après un mouvement
 */
function updateStock(code, type, quantite) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();

  for (let i = 2; i < data.length; i++) {
    if (data[i][0] === code) {
      let entrees = data[i][5] || 0;
      let sorties = data[i][6] || 0;

      if (type === 'Entrée') {
        entrees += quantite;
      } else if (type === 'Sortie') {
        sorties += quantite;
      } else if (type === 'Ajustement') {
        // Pour un ajustement, on modifie directement le stock initial
        const stockInitial = data[i][4] || 0;
        sheet.getRange(i + 1, 5).setValue(stockInitial + quantite);
      }

      if (type !== 'Ajustement') {
        sheet.getRange(i + 1, 6).setValue(entrees);
        sheet.getRange(i + 1, 7).setValue(sorties);
      }

      break;
    }
  }
}

/**
 * Récupère la liste des articles
 */
function getArticles() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');

  if (!sheet || sheet.getLastRow() < 3) {
    return [];
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 2).getValues();
  const articles = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][0]) {
      articles.push({
        code: data[i][0],
        designation: data[i][1]
      });
    }
  }

  return articles;
}

/**
 * Va à la feuille stock
 */
function goToStockSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Stock');

  if (sheet) {
    ss.setActiveSheet(sheet);
  }
}
