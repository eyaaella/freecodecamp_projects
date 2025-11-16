/**
 * ========================================================================
 * MODULE PROJET - Gestion complète des projets topographiques
 * ========================================================================
 * Ce module gère la création, modification, suivi et analyse des projets
 * ========================================================================
 */

/**
 * Création de la feuille PROJET avec toutes les formules avancées
 */
function createProjetSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.PROJET);
  sheet.clear();

  // ==== EN-TÊTE PRINCIPAL ====
  sheet.getRange('A1:P1').merge();
  sheet.getRange('A1')
    .setValue('📁 GESTION DES PROJETS TOPOGRAPHIQUES')
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 50);

  // ==== INFORMATIONS GÉNÉRALES ====
  const infoData = [
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['📊 INDICATEURS CLÉS', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Total Projets:', '=COUNTA(A6:A)-1', 'Budget Global:', '=SOMME(G6:G)', 'Projets Actifs:', '=NB.SI(E6:E;"En Cours")', 'Taux Réussite:', '=SI(COUNTA(A6:A)>1;NB.SI(E6:E;"Terminé")/(COUNTA(A6:A)-1);0)']
  ];

  sheet.getRange(2, 1, infoData.length, 16).setValues(infoData);
  sheet.getRange('A3:P3').setBackground(CONFIG.COLORS.LIGHT).setFontWeight('bold');
  sheet.getRange('A4:B4').setFontWeight('bold');
  sheet.getRange('C4:D4').setFontWeight('bold');
  sheet.getRange('E4:F4').setFontWeight('bold');
  sheet.getRange('G4:H4').setFontWeight('bold');

  sheet.getRange('B4').setNumberFormat('#,##0');
  sheet.getRange('D4').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('F4').setNumberFormat('#,##0');
  sheet.getRange('H4').setNumberFormat('0.0%');

  // ==== EN-TÊTES DES COLONNES ====
  const headers = [
    'ID Projet',
    'Nom du Projet',
    'Date Début',
    'Date Fin Prévue',
    'Statut',
    'Chef de Projet',
    'Budget Total (FCFA)',
    'Budget Utilisé',
    'Budget Restant',
    '% Utilisation',
    'Description',
    'Localisation',
    'Client',
    'Nb Ouvrages',
    'Nb Tâches',
    '% Avancement'
  ];

  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(5, 1, 1, headers.length)
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sheet.setRowHeight(5, 40);

  // ==== FORMULES POUR LA PREMIÈRE LIGNE DE DONNÉES (ligne 6) ====
  // Ces formules seront copiées automatiquement vers le bas lors de la saisie

  // Colonne A: ID Projet (auto-incrémenté)
  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  // Colonne H: Budget Utilisé (depuis feuille BUDGET)
  sheet.getRange('H6').setFormula('=SI(COUNTA(A6:A6)=0;"";SOMME.SI(' + CONFIG.SHEETS.BUDGET + '!B:B;A6;' + CONFIG.SHEETS.BUDGET + '!C:C))');

  // Colonne I: Budget Restant
  sheet.getRange('I6').setFormula('=SI(COUNTA(G6:G6)=0;"";G6-H6)');

  // Colonne J: % Utilisation du budget
  sheet.getRange('J6').setFormula('=SI(ET(COUNTA(G6:G6)>0;G6>0);H6/G6;"")');

  // Colonne N: Nombre d\'ouvrages
  sheet.getRange('N6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.OUVRAGE + '!B:B;A6))');

  // Colonne O: Nombre de tâches
  sheet.getRange('O6').setFormula('=SI(COUNTA(A6:A6)=0;"";SOMMEPROD((' + CONFIG.SHEETS.OUVRAGE + '!B:B=A6)*1;NB.SI(' + CONFIG.SHEETS.TACHE + '!B:B;' + CONFIG.SHEETS.OUVRAGE + '!A:A)))');

  // Colonne P: % Avancement (basé sur les tâches terminées)
  sheet.getRange('P6').setFormula('=SI(O6>0;NB.SI.ENS(' + CONFIG.SHEETS.TACHE + '!G:G;"Terminée";' + CONFIG.SHEETS.TACHE + '!B:B;A6)/O6;"")');

  // ==== FORMATAGE DES COLONNES ====
  sheet.setColumnWidth(1, 80);   // ID
  sheet.setColumnWidth(2, 250);  // Nom
  sheet.setColumnWidth(3, 110);  // Date Début
  sheet.setColumnWidth(4, 110);  // Date Fin
  sheet.setColumnWidth(5, 130);  // Statut
  sheet.setColumnWidth(6, 180);  // Chef Projet
  sheet.setColumnWidth(7, 140);  // Budget Total
  sheet.setColumnWidth(8, 140);  // Budget Utilisé
  sheet.setColumnWidth(9, 140);  // Budget Restant
  sheet.setColumnWidth(10, 100); // % Utilisation
  sheet.setColumnWidth(11, 300); // Description
  sheet.setColumnWidth(12, 200); // Localisation
  sheet.setColumnWidth(13, 180); // Client
  sheet.setColumnWidth(14, 90);  // Nb Ouvrages
  sheet.setColumnWidth(15, 90);  // Nb Tâches
  sheet.setColumnWidth(16, 110); // % Avancement

  // Formats de nombres
  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('C6:D1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('G6:I1000').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('J6:J1000').setNumberFormat('0.0%');
  sheet.getRange('N6:O1000').setNumberFormat('#,##0');
  sheet.getRange('P6:P1000').setNumberFormat('0.0%');

  // ==== VALIDATION DES DONNÉES ====

  // Validation du statut
  const statutRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.STATUTS.PROJET, true)
    .setAllowInvalid(false)
    .setHelpText('Sélectionnez un statut valide')
    .build();
  sheet.getRange('E6:E1000').setDataValidation(statutRule);

  // ==== MISE EN FORME CONDITIONNELLE ====

  const rules = [];

  // Statut du projet
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Terminé')
    .setBackground('#d4edda')
    .setFontColor('#155724')
    .setRanges([sheet.getRange('E6:E1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('En Cours')
    .setBackground('#d1ecf1')
    .setFontColor('#0c5460')
    .setRanges([sheet.getRange('E6:E1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('En Pause')
    .setBackground('#fff3cd')
    .setFontColor('#856404')
    .setRanges([sheet.getRange('E6:E1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Annulé')
    .setBackground('#f8d7da')
    .setFontColor('#721c24')
    .setRanges([sheet.getRange('E6:E1000')])
    .build());

  // Budget restant (alerte si négatif ou faible)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground('#f8d7da')
    .setFontColor('#721c24')
    .setRanges([sheet.getRange('I6:I1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=ET(I6>0;I6<G6*0.1)')
    .setBackground('#fff3cd')
    .setFontColor('#856404')
    .setRanges([sheet.getRange('I6:I1000')])
    .build());

  // % Utilisation budget (échelle de couleurs)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0.9)
    .setBackground('#f8d7da')
    .setRanges([sheet.getRange('J6:J1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.7, 0.9)
    .setBackground('#fff3cd')
    .setRanges([sheet.getRange('J6:J1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.7)
    .setBackground('#d4edda')
    .setRanges([sheet.getRange('J6:J1000')])
    .build());

  // % Avancement (échelle de couleurs)
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0.8)
    .setBackground('#d4edda')
    .setRanges([sheet.getRange('P6:P1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.5, 0.79)
    .setBackground('#fff3cd')
    .setRanges([sheet.getRange('P6:P1000')])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.5)
    .setBackground('#f8d7da')
    .setRanges([sheet.getRange('P6:P1000')])
    .build());

  sheet.setConditionalFormatRules(rules);

  // ==== GRAPHIQUES ET ANALYSES ====
  createProjetCharts(sheet);

  // ==== PROTECTION ====
  // Protéger les colonnes calculées
  const protection = sheet.getRange('A6:A1000').protect();
  protection.setDescription('ID auto-généré');
  protection.setWarningOnly(true);

  const protection2 = sheet.getRange('H6:J1000').protect();
  protection2.setDescription('Colonnes calculées automatiquement');
  protection2.setWarningOnly(true);

  const protection3 = sheet.getRange('N6:P1000').protect();
  protection3.setDescription('Statistiques calculées automatiquement');
  protection3.setWarningOnly(true);

  // Figer les lignes d'en-tête
  sheet.setFrozenRows(5);
  sheet.setFrozenColumns(1);

  logAction("Création", "Feuille PROJET créée avec formules avancées");
}

/**
 * Créer les graphiques d'analyse pour les projets
 */
function createProjetCharts(sheet) {
  const ss = getActiveSpreadsheet();

  // Graphique 1: Répartition par statut (Camembert)
  const chartStatut = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange('E5:E1000'))
    .setPosition(2, 18, 0, 0)
    .setOption('title', '📊 Répartition des Projets par Statut')
    .setOption('pieHole', 0.4)
    .setOption('slices', {
      0: { color: '#d4edda' },
      1: { color: '#d1ecf1' },
      2: { color: '#fff3cd' },
      3: { color: '#f8d7da' }
    })
    .setOption('legend', { position: 'right' })
    .setOption('width', 500)
    .setOption('height', 300)
    .build();
  sheet.insertChart(chartStatut);

  // Graphique 2: Budget Total vs Budget Utilisé (Colonnes)
  const chartBudget = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange('B5:B1000'))
    .addRange(sheet.getRange('G5:H1000'))
    .setPosition(2, 24, 0, 0)
    .setOption('title', '💰 Budget: Total vs Utilisé par Projet')
    .setOption('series', {
      0: { color: '#1a73e8', targetAxisIndex: 0 },
      1: { color: '#ea4335', targetAxisIndex: 0 }
    })
    .setOption('legend', { position: 'bottom' })
    .setOption('width', 600)
    .setOption('height', 300)
    .setOption('vAxis', { title: 'Montant (FCFA)', format: '#,##0' })
    .setOption('hAxis', { title: 'Projets', slantedText: true, slantedTextAngle: 45 })
    .build();
  sheet.insertChart(chartBudget);

  // Graphique 3: Avancement des projets (Barres horizontales)
  const chartAvancement = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheet.getRange('B5:B1000'))
    .addRange(sheet.getRange('P5:P1000'))
    .setPosition(14, 18, 0, 0)
    .setOption('title', '📈 Avancement des Projets')
    .setOption('series', { 0: { color: '#34a853' } })
    .setOption('legend', { position: 'none' })
    .setOption('width', 600)
    .setOption('height', 400)
    .setOption('hAxis', { title: '% Avancement', format: '#%', minValue: 0, maxValue: 1 })
    .setOption('vAxis', { title: 'Projets' })
    .build();
  sheet.insertChart(chartAvancement);

  // Graphique 4: Timeline des projets (Diagramme de Gantt simplifié)
  const chartTimeline = sheet.newChart()
    .setChartType(Charts.ChartType.TIMELINE)
    .addRange(sheet.getRange('B5:D1000'))
    .setPosition(14, 24, 0, 0)
    .setOption('title', '📅 Timeline des Projets')
    .setOption('width', 700)
    .setOption('height', 400)
    .build();
  sheet.insertChart(chartTimeline);
}

/**
 * Ouvrir la sidebar de gestion des projets
 */
function openProjetSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('PROJET/ProjetSidebar')
    .setTitle('📁 Gestion Projets')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
  logAction("Interface", "Sidebar Projets ouverte");
}

/**
 * Ouvrir le modal de gestion des projets
 */
function openProjetModal() {
  const html = HtmlService.createHtmlOutputFromFile('PROJET/ProjetModal')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, '📁 Gestion des Projets');
  logAction("Interface", "Modal Projets ouvert");
}

/**
 * Afficher la feuille Projets
 */
function showProjetSheet() {
  const ss = getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.PROJET);
  if (sheet) {
    ss.setActiveSheet(sheet);
    logAction("Consultation", "Feuille Projets affichée");
  }
}

/**
 * Créer un nouveau projet
 */
function createProjet(data) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.PROJET);
    const lastRow = sheet.getLastRow();
    const newId = lastRow > 5 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;

    const newRow = [
      newId,
      data.nomProjet,
      new Date(data.dateDebut),
      new Date(data.dateFin),
      data.statut,
      data.chefProjet,
      parseFloat(data.budgetTotal),
      '', // Budget Utilisé (calculé)
      '', // Budget Restant (calculé)
      '', // % Utilisation (calculé)
      data.description,
      data.localisation,
      data.client,
      '', // Nb Ouvrages (calculé)
      '', // Nb Tâches (calculé)
      ''  // % Avancement (calculé)
    ];

    sheet.appendRow(newRow);

    // Copier les formules
    if (lastRow > 5) {
      sheet.getRange(lastRow, 8, 1, 3).copyTo(sheet.getRange(lastRow + 1, 8));
      sheet.getRange(lastRow, 14, 1, 3).copyTo(sheet.getRange(lastRow + 1, 14));
    }

    logAction("Création", "Nouveau projet créé: " + data.nomProjet);
    sendNotification(Session.getActiveUser().getEmail(), "Nouveau projet créé: " + data.nomProjet);

    return { success: true, message: "Projet créé avec succès!", id: newId };
  } catch (e) {
    console.error("Erreur création projet:", e);
    return { success: false, message: "Erreur: " + e.message };
  }
}

/**
 * Récupérer tous les projets
 */
function getAllProjets() {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.PROJET);
    const lastRow = sheet.getLastRow();

    if (lastRow <= 5) {
      return [];
    }

    const data = sheet.getRange(6, 1, lastRow - 5, 16).getValues();
    const projets = data.filter(row => row[0] !== '').map(row => ({
      id: row[0],
      nom: row[1],
      dateDebut: row[2],
      dateFin: row[3],
      statut: row[4],
      chefProjet: row[5],
      budgetTotal: row[6],
      budgetUtilise: row[7],
      budgetRestant: row[8],
      pctUtilisation: row[9],
      description: row[10],
      localisation: row[11],
      client: row[12],
      nbOuvrages: row[13],
      nbTaches: row[14],
      pctAvancement: row[15]
    }));

    return projets;
  } catch (e) {
    console.error("Erreur récupération projets:", e);
    return [];
  }
}

/**
 * Rechercher des projets
 */
function searchProjets(searchTerm) {
  const allProjets = getAllProjets();
  const term = searchTerm.toLowerCase();

  return allProjets.filter(projet =>
    projet.nom.toLowerCase().includes(term) ||
    projet.chefProjet.toLowerCase().includes(term) ||
    projet.client.toLowerCase().includes(term) ||
    projet.localisation.toLowerCase().includes(term)
  );
}

/**
 * Mettre à jour un projet
 */
function updateProjet(id, data) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.PROJET);
    const lastRow = sheet.getLastRow();
    const ids = sheet.getRange(6, 1, lastRow - 5, 1).getValues();

    const rowIndex = ids.findIndex(row => row[0] === id);
    if (rowIndex === -1) {
      return { success: false, message: "Projet non trouvé" };
    }

    const actualRow = rowIndex + 6;

    sheet.getRange(actualRow, 2).setValue(data.nomProjet);
    sheet.getRange(actualRow, 3).setValue(new Date(data.dateDebut));
    sheet.getRange(actualRow, 4).setValue(new Date(data.dateFin));
    sheet.getRange(actualRow, 5).setValue(data.statut);
    sheet.getRange(actualRow, 6).setValue(data.chefProjet);
    sheet.getRange(actualRow, 7).setValue(parseFloat(data.budgetTotal));
    sheet.getRange(actualRow, 11).setValue(data.description);
    sheet.getRange(actualRow, 12).setValue(data.localisation);
    sheet.getRange(actualRow, 13).setValue(data.client);

    logAction("Modification", "Projet modifié: " + data.nomProjet);
    return { success: true, message: "Projet mis à jour avec succès!" };
  } catch (e) {
    console.error("Erreur mise à jour projet:", e);
    return { success: false, message: "Erreur: " + e.message };
  }
}

/**
 * Supprimer un projet
 */
function deleteProjet(id) {
  try {
    const sheet = getOrCreateSheet(CONFIG.SHEETS.PROJET);
    const lastRow = sheet.getLastRow();
    const ids = sheet.getRange(6, 1, lastRow - 5, 1).getValues();

    const rowIndex = ids.findIndex(row => row[0] === id);
    if (rowIndex === -1) {
      return { success: false, message: "Projet non trouvé" };
    }

    const actualRow = rowIndex + 6;
    const nomProjet = sheet.getRange(actualRow, 2).getValue();

    sheet.deleteRow(actualRow);

    logAction("Suppression", "Projet supprimé: " + nomProjet);
    return { success: true, message: "Projet supprimé avec succès!" };
  } catch (e) {
    console.error("Erreur suppression projet:", e);
    return { success: false, message: "Erreur: " + e.message };
  }
}

/**
 * Obtenir les statistiques des projets
 */
function getProjetStats() {
  try {
    const projets = getAllProjets();

    const stats = {
      total: projets.length,
      parStatut: {},
      budgetTotal: 0,
      budgetUtilise: 0,
      avancementMoyen: 0
    };

    CONFIG.STATUTS.PROJET.forEach(statut => {
      stats.parStatut[statut] = projets.filter(p => p.statut === statut).length;
    });

    projets.forEach(projet => {
      stats.budgetTotal += parseFloat(projet.budgetTotal) || 0;
      stats.budgetUtilise += parseFloat(projet.budgetUtilise) || 0;
      stats.avancementMoyen += parseFloat(projet.pctAvancement) || 0;
    });

    if (projets.length > 0) {
      stats.avancementMoyen = stats.avancementMoyen / projets.length;
    }

    return stats;
  } catch (e) {
    console.error("Erreur stats projets:", e);
    return null;
  }
}

/**
 * Afficher les statistiques des projets
 */
function showProjetStats() {
  const stats = getProjetStats();
  if (!stats) {
    SpreadsheetApp.getUi().alert('Erreur lors du calcul des statistiques');
    return;
  }

  let message = '📊 STATISTIQUES DES PROJETS\n\n';
  message += 'Total de projets: ' + stats.total + '\n\n';
  message += 'Répartition par statut:\n';

  for (const statut in stats.parStatut) {
    message += '  • ' + statut + ': ' + stats.parStatut[statut] + '\n';
  }

  message += '\nBudget total: ' + stats.budgetTotal.toLocaleString('fr-FR') + ' FCFA\n';
  message += 'Budget utilisé: ' + stats.budgetUtilise.toLocaleString('fr-FR') + ' FCFA\n';
  message += 'Avancement moyen: ' + (stats.avancementMoyen * 100).toFixed(1) + '%\n';

  SpreadsheetApp.getUi().alert('Statistiques Projets', message, SpreadsheetApp.getUi().ButtonSet.OK);
}
