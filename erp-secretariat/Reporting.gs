/**
 * Module de reporting et tableau de bord
 * Reporting.gs
 */

/**
 * Crée la feuille Dashboard (Tableau de bord)
 */
function createDashboardSheet() {
  const sheet = getOrCreateSheet('📊 Tableau de Bord');
  const config = getConfig();

  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:H1').merge()
    .setValue('📊 TABLEAU DE BORD - ERP SECRÉTARIAT')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');

  // Date du jour
  sheet.getRange('A2:H2').merge()
    .setValue('Dernière mise à jour : ' + formatDateTime(new Date()))
    .setHorizontalAlignment('center')
    .setFontStyle('italic');

  // Section Clients
  sheet.getRange('A4:D4').merge()
    .setValue('👥 CLIENTS & FOURNISSEURS')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A5:D8').setValues([
    ['Total Clients:', '', 'Total Fournisseurs:', ''],
    ['Clients Actifs:', '', 'Fournisseurs Actifs:', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  // Section Courrier
  sheet.getRange('E4:H4').merge()
    .setValue('📨 COURRIER')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('E5:H8').setValues([
    ['Courrier Entrant (mois):', '', 'Courrier Sortant (mois):', ''],
    ['En attente traitement:', '', 'À envoyer:', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  // Section Facturation
  sheet.getRange('A10:D10').merge()
    .setValue('💰 FACTURATION')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A11:D15').setValues([
    ['Total Factures (mois):', '', 'CA du mois:', ''],
    ['Factures Payées:', '', 'Encaissements:', ''],
    ['Factures En cours:', '', 'En attente:', ''],
    ['Factures En retard:', '', 'Retards:', ''],
    ['', '', '', '']
  ]);

  // Section Devis
  sheet.getRange('E10:H10').merge()
    .setValue('📋 DEVIS')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('E11:H15').setValues([
    ['Total Devis (mois):', '', 'Montant Total:', ''],
    ['Acceptés:', '', 'Taux acceptation:', ''],
    ['En cours:', '', '', ''],
    ['Refusés:', '', '', ''],
    ['', '', '', '']
  ]);

  // Section Stock
  sheet.getRange('A17:D17').merge()
    .setValue('📦 STOCK')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A18:D21').setValues([
    ['Articles en stock:', '', 'Alertes stock faible:', ''],
    ['Derniers mouvements:', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  // Section Personnel
  sheet.getRange('E17:H17').merge()
    .setValue('👨‍💼 PERSONNEL')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('E18:H21').setValues([
    ['Employés Actifs:', '', 'Présences aujourd\'hui:', ''],
    ['Total Personnel:', '', 'Absences:', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  // Section Tâches et Agenda
  sheet.getRange('A23:D23').merge()
    .setValue('✓ TÂCHES')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A24:D27').setValues([
    ['Tâches en cours:', '', 'Tâches urgentes:', ''],
    ['Tâches terminées (mois):', '', 'Taux complétion:', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  // Section Rendez-vous
  sheet.getRange('E23:H23').merge()
    .setValue('📅 AGENDA')
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('E24:H27').setValues([
    ['RDV aujourd\'hui:', '', 'RDV cette semaine:', ''],
    ['RDV confirmés:', '', 'RDV en attente:', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ]);

  // Formatage des colonnes
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 120);

  // Mettre en gras les étiquettes
  const labels = ['A5', 'A6', 'C5', 'C6', 'E5', 'E6', 'G5', 'G6',
                  'A11', 'A12', 'A13', 'A14', 'C11', 'C12', 'C13', 'C14',
                  'E11', 'E12', 'E13', 'E14', 'G11', 'G12',
                  'A18', 'A19', 'C18',
                  'E18', 'E19', 'G18', 'G19',
                  'A24', 'A25', 'C24', 'C25',
                  'E24', 'E25', 'G24', 'G25'];

  for (let label of labels) {
    sheet.getRange(label).setFontWeight('bold');
  }

  // Bouton de rafraîchissement (instructions)
  sheet.getRange('A29:H29').merge()
    .setValue('💡 Utilisez le menu "ERP Secrétariat > Reporting > Tableau de bord" pour rafraîchir les données')
    .setBackground('#FFF4CC')
    .setHorizontalAlignment('center')
    .setFontStyle('italic');

  // Mettre à jour les données
  refreshDashboard();

  return sheet;
}

/**
 * Rafraîchit les données du tableau de bord
 */
function refreshDashboard() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📊 Tableau de Bord');
  if (!sheet) return;

  const config = getConfig();

  // Mettre à jour la date
  sheet.getRange('A2').setValue('Dernière mise à jour : ' + formatDateTime(new Date()));

  // Statistiques Clients
  const statsClients = getClientStats();
  sheet.getRange('B5').setValue(statsClients.total);
  sheet.getRange('B6').setValue(statsClients.actifs);

  // Statistiques Fournisseurs
  const statsFournisseurs = getFournisseurStats();
  sheet.getRange('D5').setValue(statsFournisseurs.total);
  sheet.getRange('D6').setValue(statsFournisseurs.actifs);

  // Statistiques Courrier
  const statsCourrier = getCourrierStats();
  sheet.getRange('F5').setValue(statsCourrier.entrantMois);
  sheet.getRange('F6').setValue(statsCourrier.enAttente);
  sheet.getRange('H5').setValue(statsCourrier.sortantMois);
  sheet.getRange('H6').setValue(statsCourrier.aEnvoyer);

  // Statistiques Facturation
  const statsFactures = getFactureStats();
  sheet.getRange('B11').setValue(statsFactures.totalMois);
  sheet.getRange('B12').setValue(statsFactures.payees);
  sheet.getRange('B13').setValue(statsFactures.enCours);
  sheet.getRange('B14').setValue(statsFactures.enRetard);
  sheet.getRange('D11').setValue(statsFactures.caMois + ' ' + config.devise);
  sheet.getRange('D12').setValue(statsFactures.encaissements + ' ' + config.devise);
  sheet.getRange('D13').setValue(statsFactures.enAttente + ' ' + config.devise);
  sheet.getRange('D14').setValue(statsFactures.retards + ' ' + config.devise);

  // Statistiques Devis
  const statsDevis = getDevisStats();
  sheet.getRange('F11').setValue(statsDevis.totalMois);
  sheet.getRange('F12').setValue(statsDevis.acceptes);
  sheet.getRange('F13').setValue(statsDevis.enCours);
  sheet.getRange('F14').setValue(statsDevis.refuses);
  sheet.getRange('H11').setValue(statsDevis.montantTotal + ' ' + config.devise);
  sheet.getRange('H12').setValue(statsDevis.tauxAcceptation + '%');

  // Statistiques Stock
  const statsStock = getStockStats();
  sheet.getRange('B18').setValue(statsStock.totalArticles);
  sheet.getRange('D18').setValue(statsStock.alertes);
  sheet.getRange('B19').setValue(statsStock.derniersMovements);

  // Statistiques Personnel
  const statsPersonnel = getPersonnelStats();
  sheet.getRange('F18').setValue(statsPersonnel.actifs);
  sheet.getRange('F19').setValue(statsPersonnel.total);
  sheet.getRange('H18').setValue(statsPersonnel.presencesAujourdhui);
  sheet.getRange('H19').setValue(statsPersonnel.absencesAujourdhui);

  // Statistiques Tâches
  const statsTaches = getTachesStats();
  sheet.getRange('B24').setValue(statsTaches.enCours);
  sheet.getRange('B25').setValue(statsTaches.termineesMois);
  sheet.getRange('D24').setValue(statsTaches.urgentes);
  sheet.getRange('D25').setValue(statsTaches.tauxCompletion + '%');

  // Statistiques Agenda
  const statsAgenda = getAgendaStats();
  sheet.getRange('F24').setValue(statsAgenda.aujourdhui);
  sheet.getRange('F25').setValue(statsAgenda.confirmes);
  sheet.getRange('H24').setValue(statsAgenda.semaine);
  sheet.getRange('H25').setValue(statsAgenda.enAttente);
}

/**
 * Récupère les statistiques clients
 */
function getClientStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  if (!sheet || sheet.getLastRow() < 3) {
    return { total: 0, actifs: 0 };
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
  let actifs = 0;

  for (let row of data) {
    if (row[9] === 'Actif') actifs++;
  }

  return { total: data.length, actifs: actifs };
}

/**
 * Récupère les statistiques fournisseurs
 */
function getFournisseurStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');
  if (!sheet || sheet.getLastRow() < 3) {
    return { total: 0, actifs: 0 };
  }

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 11).getValues();
  let actifs = 0;

  for (let row of data) {
    if (row[10] === 'Actif') actifs++;
  }

  return { total: data.length, actifs: actifs };
}

/**
 * Récupère les statistiques courrier
 */
function getCourrierStats() {
  const sheetEntrant = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Courrier Entrant');
  const sheetSortant = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Courrier Sortant');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let entrantMois = 0, enAttente = 0;
  if (sheetEntrant && sheetEntrant.getLastRow() >= 3) {
    const data = sheetEntrant.getRange(3, 1, sheetEntrant.getLastRow() - 2, 10).getValues();
    for (let row of data) {
      const date = new Date(row[1]);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        entrantMois++;
      }
      if (row[8] === 'En attente') enAttente++;
    }
  }

  let sortantMois = 0, aEnvoyer = 0;
  if (sheetSortant && sheetSortant.getLastRow() >= 3) {
    const data = sheetSortant.getRange(3, 1, sheetSortant.getLastRow() - 2, 10).getValues();
    for (let row of data) {
      const date = new Date(row[1]);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        sortantMois++;
      }
      if (row[8] === 'À envoyer') aEnvoyer++;
    }
  }

  return {
    entrantMois: entrantMois,
    enAttente: enAttente,
    sortantMois: sortantMois,
    aEnvoyer: aEnvoyer
  };
}

/**
 * Récupère les statistiques de facturation
 */
function getFactureStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');

  if (!sheet || sheet.getLastRow() < 3) {
    return {
      totalMois: 0, caMois: 0, payees: 0, enCours: 0, enRetard: 0,
      encaissements: 0, enAttente: 0, retards: 0
    };
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 11).getValues();
  let totalMois = 0, caMois = 0, payees = 0, enCours = 0, enRetard = 0;
  let encaissements = 0, enAttente = 0, retards = 0;

  for (let row of data) {
    const date = new Date(row[1]);
    const montantTTC = parseFloat(row[6].toString().replace(/[^0-9.-]+/g, '')) || 0;
    const montantPaye = parseFloat(row[7].toString().replace(/[^0-9.-]+/g, '')) || 0;
    const reste = parseFloat(row[8].toString().replace(/[^0-9.-]+/g, '')) || 0;

    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      totalMois++;
      caMois += montantTTC;
    }

    if (row[10] === 'Payée') {
      payees++;
      encaissements += montantTTC;
    } else if (row[10] === 'Émise' || row[10] === 'Payée partiellement') {
      enCours++;
      enAttente += reste;
    } else if (row[10] === 'En retard') {
      enRetard++;
      retards += reste;
    }
  }

  return {
    totalMois: totalMois,
    caMois: Math.round(caMois),
    payees: payees,
    enCours: enCours,
    enRetard: enRetard,
    encaissements: Math.round(encaissements),
    enAttente: Math.round(enAttente),
    retards: Math.round(retards)
  };
}

/**
 * Récupère les statistiques des devis
 */
function getDevisStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Devis');

  if (!sheet || sheet.getLastRow() < 3) {
    return {
      totalMois: 0, montantTotal: 0, acceptes: 0, enCours: 0, refuses: 0, tauxAcceptation: 0
    };
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
  let totalMois = 0, montantTotal = 0, acceptes = 0, enCours = 0, refuses = 0;

  for (let row of data) {
    const date = new Date(row[1]);
    const montantTTC = parseFloat(row[6].toString().replace(/[^0-9.-]+/g, '')) || 0;

    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      totalMois++;
      montantTotal += montantTTC;
    }

    if (row[8] === 'Accepté') acceptes++;
    else if (row[8] === 'En cours' || row[8] === 'Envoyé') enCours++;
    else if (row[8] === 'Refusé') refuses++;
  }

  const tauxAcceptation = totalMois > 0 ? Math.round((acceptes / totalMois) * 100) : 0;

  return {
    totalMois: totalMois,
    montantTotal: Math.round(montantTotal),
    acceptes: acceptes,
    enCours: enCours,
    refuses: refuses,
    tauxAcceptation: tauxAcceptation
  };
}

/**
 * Récupère les statistiques du stock
 */
function getStockStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stock');
  const mouvSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Mouvements Stock');

  let totalArticles = 0, alertes = 0;

  if (sheet && sheet.getLastRow() >= 3) {
    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
    totalArticles = data.length;

    for (let row of data) {
      if (row[9] === 'Stock faible') alertes++;
    }
  }

  let derniersMovements = 0;
  if (mouvSheet && mouvSheet.getLastRow() >= 3) {
    const now = new Date();
    const today = formatDate(now);
    const data = mouvSheet.getRange(3, 1, mouvSheet.getLastRow() - 2, 8).getValues();

    for (let row of data) {
      if (formatDate(new Date(row[0])) === today) {
        derniersMovements++;
      }
    }
  }

  return {
    totalArticles: totalArticles,
    alertes: alertes,
    derniersMovements: derniersMovements
  };
}

/**
 * Récupère les statistiques du personnel
 */
function getPersonnelStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Personnel');
  const presSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Présences');

  let total = 0, actifs = 0;

  if (sheet && sheet.getLastRow() >= 3) {
    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 11).getValues();
    total = data.length;

    for (let row of data) {
      if (row[10] === 'Actif') actifs++;
    }
  }

  let presencesAujourdhui = 0, absencesAujourdhui = 0;

  if (presSheet && presSheet.getLastRow() >= 3) {
    const now = new Date();
    const today = formatDate(now);
    const data = presSheet.getRange(3, 1, presSheet.getLastRow() - 2, 7).getValues();

    for (let row of data) {
      if (formatDate(new Date(row[0])) === today) {
        if (row[5] === 'Présent' || row[5] === 'Retard') {
          presencesAujourdhui++;
        } else if (row[5] === 'Absent') {
          absencesAujourdhui++;
        }
      }
    }
  }

  return {
    total: total,
    actifs: actifs,
    presencesAujourdhui: presencesAujourdhui,
    absencesAujourdhui: absencesAujourdhui
  };
}

/**
 * Récupère les statistiques des tâches
 */
function getTachesStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tâches');

  if (!sheet || sheet.getLastRow() < 3) {
    return {
      enCours: 0, termineesMois: 0, urgentes: 0, tauxCompletion: 0
    };
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 10).getValues();
  let enCours = 0, termineesMois = 0, urgentes = 0, totalMois = 0;

  for (let row of data) {
    const date = new Date(row[1]);

    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      totalMois++;
      if (row[7] === 'Terminée') termineesMois++;
    }

    if (row[7] === 'En cours' || row[7] === 'À faire') enCours++;
    if (row[4] === 'Urgente') urgentes++;
  }

  const tauxCompletion = totalMois > 0 ? Math.round((termineesMois / totalMois) * 100) : 0;

  return {
    enCours: enCours,
    termineesMois: termineesMois,
    urgentes: urgentes,
    tauxCompletion: tauxCompletion
  };
}

/**
 * Récupère les statistiques de l'agenda
 */
function getAgendaStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agenda');

  if (!sheet || sheet.getLastRow() < 3) {
    return {
      aujourdhui: 0, semaine: 0, confirmes: 0, enAttente: 0
    };
  }

  const now = new Date();
  const today = formatDate(now);
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 9).getValues();
  let aujourdhui = 0, semaine = 0, confirmes = 0, enAttente = 0;

  for (let row of data) {
    const date = new Date(row[0]);

    if (formatDate(date) === today) {
      aujourdhui++;
    }

    if (date >= now && date <= weekEnd) {
      semaine++;
    }

    if (row[7] === 'Confirmé') confirmes++;
    if (row[7] === 'Planifié') enAttente++;
  }

  return {
    aujourdhui: aujourdhui,
    semaine: semaine,
    confirmes: confirmes,
    enAttente: enAttente
  };
}

/**
 * Va au tableau de bord
 */
function goToDashboard() {
  refreshDashboard();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('📊 Tableau de Bord');

  if (sheet) {
    ss.setActiveSheet(sheet);
  }
}

/**
 * Génère un rapport mensuel
 */
function generateMonthlyReport() {
  refreshDashboard();
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Rapport mensuel généré',
    'Le tableau de bord a été mis à jour avec les dernières données.',
    ui.ButtonSet.OK
  );
}

/**
 * Affiche les statistiques
 */
function showStatistics() {
  goToDashboard();
}
