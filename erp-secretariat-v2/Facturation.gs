/**
 * Module Facturation v2.0 - Optimisé avec calculs automatiques
 */

function createDevisSheet() {
  const sheet = ERP.getOrCreateSheet('Devis');
  const config = ERP.config;

  sheet.clear();

  sheet.getRange('A1:K1').merge()
    .setValue('📋 GESTION DES DEVIS - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['N° Devis', 'Date', 'Client', 'Description', 'Montant HT', 'TVA', 'Montant TTC', 'Validité', 'Statut', 'Converti en Facture', 'Notes'];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [100, 110, 180, 250, 120, 120, 120, 110, 120, 150, 200].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('I3:I1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Brouillon', 'Envoyé', 'Accepté', 'Refusé', 'Expiré'], true)
      .build()
  );

  return sheet;
}

function createFacturesSheet() {
  const sheet = ERP.getOrCreateSheet('Factures');
  const config = ERP.config;

  sheet.clear();

  sheet.getRange('A1:M1').merge()
    .setValue('🧾 GESTION DES FACTURES - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['N° Facture', 'Date', 'Client', 'Description', 'Montant HT', 'TVA', 'Montant TTC', 'Payé', 'Reste à payer', 'Échéance', 'Statut', 'Relancé', 'Notes'];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [100, 110, 180, 250, 120, 120, 120, 120, 120, 110, 120, 80, 200].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('K3:K1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Brouillon', 'Émise', 'Payée partiellement', 'Payée', 'En retard', 'Annulée'], true)
      .build()
  );

  return sheet;
}

function createPaiementsSheet() {
  const sheet = ERP.getOrCreateSheet('Paiements');
  const config = ERP.config;

  sheet.clear();

  sheet.getRange('A1:I1').merge()
    .setValue('💳 REGISTRE DES PAIEMENTS - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  const headers = ['Date', 'N° Facture', 'Client', 'Montant', 'Mode de paiement', 'Référence', 'Reçu par', 'Banque/Opérateur', 'Notes'];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [110, 110, 180, 120, 130, 150, 130, 150, 250].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('E3:E1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Espèces', 'Chèque', 'Virement', 'Mobile Money (MTN)', 'Mobile Money (Orange)', 'Carte bancaire', 'Autre'], true)
      .build()
  );

  return sheet;
}

function showCreateFactureDialog() {
  const html = HtmlService.createHtmlOutputFromFile('FactureForm')
    .setWidth(650)
    .setHeight(750);

  SpreadsheetApp.getUi().showModalDialog(html, '🧾 Nouvelle Facture - v2.0');
}

function createFacture(factureData) {
  try {
    const validation = Validator.validateFacture(factureData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
    if (!sheet) throw new Error('La feuille Factures n\'existe pas.');

    const config = ERP.config;
    const numeroFacture = ERP.getNextNumber(config.prefixes.facture, 'Factures');
    const date = ERP.formatDate(new Date());

    const montantTVA = factureData.montantHT * (config.tauxTVA / 100);
    const montantTTC = factureData.montantHT + montantTVA;

    const newRow = [
      numeroFacture,
      date,
      factureData.client,
      Validator.sanitizeString(factureData.description),
      factureData.montantHT + ' ' + config.devise,
      montantTVA.toFixed(2) + ' ' + config.devise,
      montantTTC.toFixed(2) + ' ' + config.devise,
      '0 ' + config.devise,
      montantTTC.toFixed(2) + ' ' + config.devise,
      factureData.echeance || '',
      factureData.statut || 'Émise',
      'Non',
      factureData.notes || ''
    ];

    sheet.appendRow(newRow);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 13)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // Mettre à jour le CA client
    updateClientRevenue(factureData.client, montantTTC);

    DataManager.invalidateCache('Factures');

    AuditLog.log(AuditLog.Actions.CREATE, AuditLog.Entities.FACTURE, numeroFacture, `${factureData.client} - ${montantTTC} ${config.devise}`);

    // Créer une notification si échéance proche
    checkFactureEcheance(numeroFacture, factureData.echeance);

    return { success: true, numero: numeroFacture, montantTTC: montantTTC };
  } catch (error) {
    ERP.handleError(error, 'createFacture');
    return { success: false, error: error.toString() };
  }
}

function showPaiementDialog() {
  const html = HtmlService.createHtmlOutputFromFile('PaiementForm')
    .setWidth(600)
    .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(html, '💳 Enregistrer Paiement');
}

function addPaiement(paiementData) {
  try {
    const validation = Validator.validatePaiement(paiementData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Paiements');
    if (!sheet) throw new Error('La feuille Paiements n\'existe pas.');

    const config = ERP.config;

    const newRow = [
      paiementData.date || ERP.formatDate(new Date()),
      paiementData.numeroFacture,
      paiementData.client,
      paiementData.montant + ' ' + config.devise,
      paiementData.mode,
      paiementData.reference || '',
      paiementData.recuPar || Session.getActiveUser().getEmail(),
      paiementData.banque || '',
      paiementData.notes || ''
    ];

    sheet.appendRow(newRow);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 9)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // Mettre à jour le statut de la facture
    updateFactureStatusAfterPayment(paiementData.numeroFacture, paiementData.montant);

    DataManager.invalidateCache('Paiements');
    DataManager.invalidateCache('Factures');

    AuditLog.log(AuditLog.Actions.CREATE, AuditLog.Entities.PAIEMENT, paiementData.numeroFacture, `${paiementData.montant} ${config.devise} - ${paiementData.mode}`);

    return { success: true };
  } catch (error) {
    ERP.handleError(error, 'addPaiement');
    return { success: false, error: error.toString() };
  }
}

function updateFactureStatusAfterPayment(numeroFacture, montantPaye) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    const config = ERP.config;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === numeroFacture) {
        const paiements = getPaiementsForFacture(numeroFacture);
        let totalPaye = 0;
        for (let p of paiements) {
          totalPaye += p;
        }

        const montantTTCStr = data[i][6].toString();
        const montantTTC = parseFloat(montantTTCStr.replace(/[^0-9.-]+/g, ''));

        const reste = montantTTC - totalPaye;

        sheet.getRange(i + 1, 8).setValue(totalPaye.toFixed(2) + ' ' + config.devise);
        sheet.getRange(i + 1, 9).setValue(reste.toFixed(2) + ' ' + config.devise);

        let nouveauStatut = 'Émise';
        if (reste <= 0) {
          nouveauStatut = 'Payée';
        } else if (totalPaye > 0) {
          nouveauStatut = 'Payée partiellement';
        }

        sheet.getRange(i + 1, 11).setValue(nouveauStatut);

        ERP.log('INFO', `Facture ${numeroFacture} mise à jour: ${nouveauStatut}`);

        break;
      }
    }
  } catch (error) {
    ERP.log('ERROR', 'updateFactureStatusAfterPayment: ' + error);
  }
}

function getPaiementsForFacture(numeroFacture) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Paiements');
  if (!sheet || sheet.getLastRow() < 3) return [];

  const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 9).getValues();
  const montants = [];

  for (let row of data) {
    if (row[1] === numeroFacture) {
      const montantStr = row[3].toString();
      const montant = parseFloat(montantStr.replace(/[^0-9.-]+/g, ''));
      montants.push(montant);
    }
  }

  return montants;
}

function checkFactureEcheance(numeroFacture, echeance) {
  if (!echeance || !ERP.config.options.enableNotifications) return;

  const echeanceDate = new Date(echeance);
  const today = new Date();
  const daysUntilDue = Math.floor((echeanceDate - today) / (1000 * 60 * 60 * 24));

  if (daysUntilDue <= 7 && daysUntilDue >= 0) {
    addNotification(
      'warning',
      'Échéance proche',
      `La facture ${numeroFacture} échoit dans ${daysUntilDue} jour(s)`,
      'showUnpaidInvoices'
    );
  }
}

function showUnpaidInvoices() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Factures');
    if (!sheet || sheet.getLastRow() < 3) {
      SpreadsheetApp.getUi().alert('Aucune facture impayée');
      return;
    }

    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 13).getValues();
    const today = new Date();
    let unpaidList = [];

    for (let row of data) {
      const statut = row[10];
      const echeance = row[9] ? new Date(row[9]) : null;
      const reste = parseFloat(row[8].toString().replace(/[^0-9.-]+/g, ''));

      if (reste > 0 && (statut === 'Émise' || statut === 'Payée partiellement' || statut === 'En retard')) {
        const daysLate = echeance ? Math.floor((today - echeance) / (1000 * 60 * 60 * 24)) : 0;

        unpaidList.push({
          numero: row[0],
          client: row[2],
          montantTTC: row[6],
          reste: row[8],
          echeance: row[9] ? ERP.formatDate(echeance) : 'N/A',
          daysLate: daysLate,
          statut: statut
        });
      }
    }

    if (unpaidList.length === 0) {
      SpreadsheetApp.getUi().alert('Aucune facture impayée');
      return;
    }

    // Trier par jours de retard (plus urgent en premier)
    unpaidList.sort((a, b) => b.daysLate - a.daysLate);

    let message = `⚠️ FACTURES IMPAYÉES (${unpaidList.length})\n\n`;

    for (let invoice of unpaidList.slice(0, 10)) { // Top 10
      message += `${invoice.numero} - ${invoice.client}\n`;
      message += `Reste: ${invoice.reste}\n`;
      message += `Échéance: ${invoice.echeance}`;

      if (invoice.daysLate > 0) {
        message += ` (⚠️ ${invoice.daysLate} jours de retard)`;
      }

      message += `\n\n`;
    }

    if (unpaidList.length > 10) {
      message += `... et ${unpaidList.length - 10} autre(s)`;
    }

    SpreadsheetApp.getUi().alert('Factures Impayées', message, SpreadsheetApp.getUi().ButtonSet.OK);

  } catch (error) {
    ERP.handleError(error, 'showUnpaidInvoices');
  }
}

function showMonthlyRevenue() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalRevenue = DataManager.sum('Factures', 6, function(row) {
      const date = new Date(row[1]);
      const statut = row[10];
      return date.getMonth() === currentMonth &&
             date.getFullYear() === currentYear &&
             (statut === 'Payée' || statut === 'Payée partiellement' || statut === 'Émise');
    });

    const totalPaid = DataManager.sum('Paiements', 3, function(row) {
      const date = new Date(row[0]);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const monthName = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][currentMonth];

    const ui = SpreadsheetApp.getUi();
    const msg = `💰 CHIFFRE D'AFFAIRES - ${monthName} ${currentYear}\n\n` +
                `Facturé: ${totalRevenue.toLocaleString()} ${ERP.config.devise}\n` +
                `Encaissé: ${totalPaid.toLocaleString()} ${ERP.config.devise}\n` +
                `En attente: ${(totalRevenue - totalPaid).toLocaleString()} ${ERP.config.devise}`;

    ui.alert('CA du mois', msg, ui.ButtonSet.OK);

  } catch (error) {
    ERP.handleError(error, 'showMonthlyRevenue');
  }
}

function showFacturationStats() {
  try {
    const statsFactures = getFactureStats();
    const statsDevis = getDevisStats();

    const ui = SpreadsheetApp.getUi();
    const msg = `📊 STATISTIQUES FACTURATION\n\n` +
                `📋 DEVIS\n` +
                `Total ce mois: ${statsDevis.totalMois}\n` +
                `Acceptés: ${statsDevis.acceptes}\n` +
                `Taux acceptation: ${statsDevis.tauxAcceptation}%\n\n` +
                `🧾 FACTURES\n` +
                `Total ce mois: ${statsFactures.totalMois}\n` +
                `Payées: ${statsFactures.payees}\n` +
                `En retard: ${statsFactures.enRetard}\n\n` +
                `💰 MONTANTS\n` +
                `CA du mois: ${statsFactures.caMois.toLocaleString()} ${ERP.config.devise}\n` +
                `Encaissements: ${statsFactures.encaissements.toLocaleString()} ${ERP.config.devise}\n` +
                `En attente: ${statsFactures.enAttente.toLocaleString()} ${ERP.config.devise}`;

    ui.alert('Statistiques Facturation', msg, ui.ButtonSet.OK);

  } catch (error) {
    ERP.handleError(error, 'showFacturationStats');
  }
}

function getFactureStats() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const factures = DataManager.getData('Factures', false);

  let totalMois = 0, caMois = 0, payees = 0, enCours = 0, enRetard = 0;
  let encaissements = 0, enAttente = 0, retards = 0;

  for (let row of factures) {
    const date = new Date(row[1]);
    const montantTTC = parseFloat(row[6].toString().replace(/[^0-9.-]+/g, '')) || 0;
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
    totalMois, caMois: Math.round(caMois), payees, enCours, enRetard,
    encaissements: Math.round(encaissements),
    enAttente: Math.round(enAttente),
    retards: Math.round(retards)
  };
}

function getDevisStats() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const devis = DataManager.getData('Devis', false);

  let totalMois = 0, montantTotal = 0, acceptes = 0, enCours = 0, refuses = 0;

  for (let row of devis) {
    const date = new Date(row[1]);
    const montantTTC = parseFloat(row[6].toString().replace(/[^0-9.-]+/g, '')) || 0;

    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      totalMois++;
      montantTotal += montantTTC;
    }

    if (row[8] === 'Accepté') acceptes++;
    else if (row[8] === 'Envoyé' || row[8] === 'Brouillon') enCours++;
    else if (row[8] === 'Refusé') refuses++;
  }

  const tauxAcceptation = totalMois > 0 ? Math.round((acceptes / totalMois) * 100) : 0;

  return {
    totalMois, montantTotal: Math.round(montantTotal),
    acceptes, enCours, refuses, tauxAcceptation
  };
}
