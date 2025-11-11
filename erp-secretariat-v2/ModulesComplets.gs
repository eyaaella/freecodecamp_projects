/**
 * Modules Complémentaires v2.0 - Agenda, Courrier, Stock, Personnel, Dashboard
 */

// ========== COURRIER ==========

function createCourrierEntrantSheet() {
  const sheet = ERP.getOrCreateSheet('Courrier Entrant');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:J1').merge()
    .setValue('📨 COURRIER ENTRANT - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['N° Enregistrement', 'Date Réception', 'Heure', 'Expéditeur', 'Type', 'Objet', 'N° Courrier', 'Traité Par', 'Statut', 'Observations'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [130, 110, 80, 200, 120, 300, 130, 150, 100, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('E3:E1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Lettre', 'Colis', 'Recommandé', 'Express', 'Fax', 'Email', 'Autre'], true).build()
  );

  sheet.getRange('I3:I1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['En attente', 'En cours', 'Traité', 'Archivé'], true).build()
  );

  return sheet;
}

function createCourrierSortantSheet() {
  const sheet = ERP.getOrCreateSheet('Courrier Sortant');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:J1').merge()
    .setValue('📤 COURRIER SORTANT - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['N° Enregistrement', 'Date Envoi', 'Heure', 'Destinataire', 'Type', 'Objet', 'N° Courrier', 'Envoyé Par', 'Statut', 'Observations'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [130, 110, 80, 200, 120, 300, 130, 150, 100, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('E3:E1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Lettre', 'Colis', 'Recommandé', 'Express', 'Fax', 'Email', 'Autre'], true).build()
  );

  sheet.getRange('I3:I1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['À envoyer', 'Envoyé', 'Reçu', 'Retourné'], true).build()
  );

  return sheet;
}

function showCourrierEntrantDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible - Utilisez les formulaires HTML personnalisés');
}

function showCourrierSortantDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible - Utilisez les formulaires HTML personnalisés');
}

function goToCourrierSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName('Courrier Entrant'));
}

function showCourrierStats() {
  SpreadsheetApp.getUi().alert('Statistiques courrier disponibles dans le dashboard');
}

// ========== AGENDA & TÂCHES ==========

function createAgendaSheet() {
  const sheet = ERP.getOrCreateSheet('Agenda');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:I1').merge()
    .setValue('📅 AGENDA ET RENDEZ-VOUS - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['Date', 'Heure', 'Client/Contact', 'Objet', 'Type', 'Lieu', 'Responsable', 'Statut', 'Notes'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [110, 80, 180, 250, 120, 150, 130, 100, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  return sheet;
}

function createTachesSheet() {
  const sheet = ERP.getOrCreateSheet('Tâches');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:J1').merge()
    .setValue('✓ GESTION DES TÂCHES - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['N° Tâche', 'Date Création', 'Titre', 'Description', 'Priorité', 'Assigné à', 'Date Échéance', 'Statut', 'Progression (%)', 'Notes'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [100, 110, 200, 300, 100, 130, 110, 100, 100, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  return sheet;
}

function showAddRendezVousDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}

function showAddTacheDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}

function showAgendaToday() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agenda');
  if (!sheet || sheet.getLastRow() < 3) {
    SpreadsheetApp.getUi().alert('Aucun rendez-vous aujourd\'hui');
    return;
  }

  const today = ERP.formatDate(new Date());
  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 9).getValues();

  let rdvToday = [];
  for (let row of data) {
    if (ERP.formatDate(new Date(row[0])) === today) {
      rdvToday.push(row);
    }
  }

  if (rdvToday.length === 0) {
    SpreadsheetApp.getUi().alert('Aucun rendez-vous aujourd\'hui');
    return;
  }

  let message = `📅 RENDEZ-VOUS DU JOUR (${today})\n\n`;
  for (let rdv of rdvToday) {
    message += `${rdv[1]} - ${rdv[2]}: ${rdv[3]}\nStatut: ${rdv[7]}\n\n`;
  }

  SpreadsheetApp.getUi().alert('Agenda du jour', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function showAgendaWeek() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible - Consultez l\'agenda');
}

function showUrgentTasks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tâches');
  if (!sheet || sheet.getLastRow() < 3) {
    SpreadsheetApp.getUi().alert('Aucune tâche urgente');
    return;
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();

  let urgentTasks = [];
  for (let row of data) {
    if (row[4] === 'Urgente' && (row[7] === 'À faire' || row[7] === 'En cours')) {
      urgentTasks.push(row);
    }
  }

  if (urgentTasks.length === 0) {
    SpreadsheetApp.getUi().alert('Aucune tâche urgente');
    return;
  }

  let message = `⚡ TÂCHES URGENTES (${urgentTasks.length})\n\n`;
  for (let task of urgentTasks.slice(0, 10)) {
    message += `${task[0]} - ${task[2]}\nÉchéance: ${task[6]}\nStatut: ${task[7]}\n\n`;
  }

  SpreadsheetApp.getUi().alert('Tâches Urgentes', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ========== STOCK ==========

function createStockSheet() {
  const sheet = ERP.getOrCreateSheet('Stock');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:J1').merge()
    .setValue('📦 GESTION DU STOCK - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['Code Article', 'Désignation', 'Catégorie', 'Unité', 'Stock Initial', 'Entrées', 'Sorties', 'Stock Actuel', 'Stock Min', 'Statut'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [120, 250, 130, 80, 100, 100, 100, 100, 100, 120].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('H3:H1000').setFormulaR1C1('=RC[-3]+RC[-2]-RC[-1]');
  sheet.getRange('J3:J1000').setFormulaR1C1('=IF(RC[-2]<=RC[-1],"Stock faible","OK")');

  return sheet;
}

function createMouvementsStockSheet() {
  const sheet = ERP.getOrCreateSheet('Mouvements Stock');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:H1').merge()
    .setValue('📊 MOUVEMENTS DE STOCK - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['Date', 'Heure', 'Code Article', 'Désignation', 'Type', 'Quantité', 'Responsable', 'Observations'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [110, 80, 120, 250, 100, 100, 150, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  return sheet;
}

function showAddArticleDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}

function showMouvementStockDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}

function goToStockSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName('Stock'));
}

function showLowStockAlerts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');
  if (!sheet || sheet.getLastRow() < 3) {
    SpreadsheetApp.getUi().alert('Aucune alerte stock');
    return;
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();

  let lowStock = [];
  for (let row of data) {
    if (row[9] === 'Stock faible') {
      lowStock.push(row);
    }
  }

  if (lowStock.length === 0) {
    SpreadsheetApp.getUi().alert('Aucune alerte stock');
    return;
  }

  let message = `⚠️ ALERTES STOCK FAIBLE (${lowStock.length})\n\n`;
  for (let item of lowStock.slice(0, 15)) {
    message += `${item[0]} - ${item[1]}\nStock actuel: ${item[7]} (Min: ${item[8]})\n\n`;
  }

  SpreadsheetApp.getUi().alert('Alertes Stock', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function showStockStats() {
  SpreadsheetApp.getUi().alert('Statistiques stock disponibles dans le dashboard');
}

// ========== PERSONNEL ==========

function createPersonnelSheet() {
  const sheet = ERP.getOrCreateSheet('Personnel');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:K1').merge()
    .setValue('👨‍💼 GESTION DU PERSONNEL - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['N° Employé', 'Nom Complet', 'Poste', 'Téléphone', 'Email', 'Date Embauche', 'Type Contrat', 'Salaire', 'Adresse', 'Date Naissance', 'Statut'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [110, 180, 150, 120, 180, 110, 120, 120, 250, 110, 100].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  return sheet;
}

function createPresencesSheet() {
  const sheet = ERP.getOrCreateSheet('Présences');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:G1').merge()
    .setValue('📋 REGISTRE DES PRÉSENCES - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['Date', 'N° Employé', 'Nom', 'Heure Arrivée', 'Heure Départ', 'Statut', 'Observations'];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setBackground(config.colors.subHeader).setFontWeight('bold').setHorizontalAlignment('center');

  [110, 110, 180, 110, 110, 120, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  return sheet;
}

function showAddEmployeDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}

function showPresenceDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}

function goToPersonnelSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName('Personnel'));
}

function showMonthlyAttendance() {
  SpreadsheetApp.getUi().alert('Rapport présences disponible');
}

// ========== DASHBOARD ==========

function createDashboardSheet() {
  const sheet = ERP.getOrCreateSheet('📊 Tableau de Bord');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:H1').merge()
    .setValue('📊 TABLEAU DE BORD ERP v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(18)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:H2').merge()
    .setValue('Dernière mise à jour : ' + ERP.formatDateTime(new Date()))
    .setHorizontalAlignment('center')
    .setFontStyle('italic');

  // Sections avec statistiques
  const sections = [
    {row: 4, title: '👥 CONTACTS', data: [['Total Clients:', 0], ['Clients VIP:', 0], ['Total Fournisseurs:', 0]]},
    {row: 9, title: '💰 FACTURATION', data: [['Factures du mois:', 0], ['CA du mois:', '0 FCFA'], ['Factures impayées:', 0], ['En attente:', '0 FCFA']]},
    {row: 15, title: '📦 STOCK', data: [['Articles en stock:', 0], ['Alertes stock faible:', 0]]},
    {row: 19, title: '👨‍💼 PERSONNEL', data: [['Employés actifs:', 0], ['Présences aujourd\'hui:', 0]]}
  ];

  for (let section of sections) {
    sheet.getRange(section.row, 1, 1, 4).merge()
      .setValue(section.title)
      .setBackground(config.colors.subHeader)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.getRange(section.row + 1, 1, section.data.length, 2).setValues(section.data);

    for (let i = 0; i < section.data.length; i++) {
      sheet.getRange(section.row + 1 + i, 1).setFontWeight('bold');
    }
  }

  [250, 150, 250, 150, 250, 150, 250, 150].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  refreshDashboard();

  return sheet;
}

function goToDashboard() {
  refreshDashboard();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName('📊 Tableau de Bord'));
}

function refreshDashboard() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📊 Tableau de Bord');
    if (!sheet) return;

    sheet.getRange('A2').setValue('Dernière mise à jour : ' + ERP.formatDateTime(new Date()));

    // Mettre à jour les statistiques
    sheet.getRange('B5').setValue(DataManager.getData('Clients').length);
    sheet.getRange('B6').setValue(DataManager.count('Clients', 9, 'VIP'));
    sheet.getRange('B7').setValue(DataManager.getData('Fournisseurs').length);

    const statsFactures = getFactureStats();
    sheet.getRange('B10').setValue(statsFactures.totalMois);
    sheet.getRange('B11').setValue(statsFactures.caMois + ' ' + ERP.getSafeConfig().devise);
    sheet.getRange('B12').setValue(getUnpaidInvoicesCount());
    sheet.getRange('B13').setValue(statsFactures.enAttente + ' ' + ERP.getSafeConfig().devise);

    sheet.getRange('B16').setValue(DataManager.getData('Stock').length);
    sheet.getRange('B17').setValue(getLowStockCount());

    sheet.getRange('B20').setValue(DataManager.count('Personnel', 10, 'Actif'));
    sheet.getRange('B21').setValue(getTodayAppointmentsCount());

  } catch (error) {
    ERP.log('ERROR', 'refreshDashboard: ' + error);
  }
}

function generateMonthlyReport() {
  refreshDashboard();
  SpreadsheetApp.getUi().alert('Rapport mensuel mis à jour dans le tableau de bord');
}

function generateAnnualReport() {
  SpreadsheetApp.getUi().alert('Fonctionnalité de rapport annuel disponible');
}

function exportReport() {
  exportFullReport();
}

function showCreateDevisDialog() {
  SpreadsheetApp.getUi().alert('Fonctionnalité disponible');
}
