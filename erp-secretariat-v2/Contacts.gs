/**
 * Module Contacts v2.0 - Clients et Fournisseurs optimisés
 */

/**
 * Initialise toutes les feuilles
 */
function initializeERP() {
  // Initialiser ERP avec config par défaut AVANT de créer les feuilles
  if (!ERP.config) {
    ERP.config = getDefaultConfig();
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Initialisation ERP v2.0',
    'Voulez-vous créer toutes les feuilles du système ?',
    ui.ButtonSet.YES_NO
  );

  if (response == ui.Button.YES) {
    try {
      createConfigSheet();
      createClientsSheet();
      createFournisseursSheet();
      createCourrierEntrantSheet();
      createCourrierSortantSheet();
      createAgendaSheet();
      createTachesSheet();
      createDevisSheet();
      createFacturesSheet();
      createPaiementsSheet();
      createStockSheet();
      createMouvementsStockSheet();
      createPersonnelSheet();
      createPresencesSheet();
      createDashboardSheet();

      // Feuilles système
      createAuditSheet();
      createNotificationsSheet();

      ui.alert('Succès', 'ERP v2.0 initialisé avec succès !', ui.ButtonSet.OK);

      AuditLog.log(AuditLog.Actions.CREATE, 'SYSTÈME', 'ERP', 'Initialisation complète');

      goToDashboard();
    } catch (error) {
      ERP.handleError(error, 'initializeERP');
    }
  }
}

/**
 * Crée la feuille Configuration v2.0
 */
function createConfigSheet() {
  const sheet = ERP.getOrCreateSheet('Configuration');
  const config = ERP.getSafeConfig();

  sheet.clear();

  // En-tête
  sheet.getRange('A1:B1').merge()
    .setValue('⚙️ CONFIGURATION ERP v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // Informations entreprise
  sheet.getRange('A3').setValue('📋 INFORMATIONS ENTREPRISE').setFontWeight('bold').setFontSize(12);
  sheet.getRange('A4:B11').setValues([
    ['Nom de l\'entreprise:', config.entreprise.nom],
    ['Adresse:', config.entreprise.adresse],
    ['Téléphone:', config.entreprise.telephone],
    ['Email:', config.entreprise.email],
    ['NIF:', config.entreprise.nif],
    ['RC:', config.entreprise.rc],
    ['Devise:', config.devise],
    ['', '']
  ]);

  // Paramètres fiscaux
  sheet.getRange('A13').setValue('💰 PARAMÈTRES FISCAUX').setFontWeight('bold').setFontSize(12);
  sheet.getRange('A14:B14').setValues([['Taux TVA (%):', config.tauxTVA]]);

  // Préfixes
  sheet.getRange('A16').setValue('🔢 PRÉFIXES DOCUMENTS').setFontWeight('bold').setFontSize(12);
  sheet.getRange('A17:B24').setValues([
    ['Clients:', config.prefixes.client],
    ['Fournisseurs:', config.prefixes.fournisseur],
    ['Devis:', config.prefixes.devis],
    ['Factures:', config.prefixes.facture],
    ['Courrier Entrant:', config.prefixes.courrierEntrant],
    ['Courrier Sortant:', config.prefixes.courrierSortant],
    ['Tâches:', config.prefixes.tache],
    ['Employés:', config.prefixes.employe]
  ]);

  // Options v2.0
  sheet.getRange('A26').setValue('⚙️ OPTIONS SYSTÈME').setFontWeight('bold').setFontSize(12);
  sheet.getRange('A27:B30').setValues([
    ['Activer notifications:', config.options.enableNotifications],
    ['Backup automatique:', config.options.enableAutoBackup],
    ['Fréquence backup:', config.options.backupFrequency],
    ['Log d\'audit:', config.options.enableAuditLog]
  ]);

  // Instructions
  sheet.getRange('A32').setValue('📝 Instructions:').setFontWeight('bold').setFontColor(config.colors.info);
  sheet.getRange('A33').setValue('Modifiez les valeurs de la colonne B. Videz le cache après modification (Menu > Système > Vider le cache).');

  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 300);

  Security.protectRange(sheet, sheet.getRange('A1:B2'), 'En-tête protégé');

  return sheet;
}

/**
 * Crée la feuille Clients v2.0
 */
function createClientsSheet() {
  const sheet = ERP.getOrCreateSheet('Clients');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:L1').merge()
    .setValue('👥 GESTION DES CLIENTS - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

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
    'Statut',
    'CA Total',
    'Dernière Activité'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Largeurs de colonnes
  [100, 200, 100, 120, 180, 250, 120, 150, 110, 100, 120, 130].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  // Validations
  sheet.getRange('C3:C1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Particulier', 'Entreprise', 'Administration', 'ONG'], true)
      .build()
  );

  sheet.getRange('J3:J1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Actif', 'Inactif', 'Suspendu', 'VIP'], true)
      .build()
  );

  // Formatage conditionnel pour les VIP
  const ruleVIP = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('VIP')
    .setBackground('#FFD700')
    .setFontColor('#000000')
    .setRanges([sheet.getRange('J3:J1000')])
    .build();

  sheet.setConditionalFormatRules([ruleVIP]);

  return sheet;
}

/**
 * Crée la feuille Fournisseurs v2.0
 */
function createFournisseursSheet() {
  const sheet = ERP.getOrCreateSheet('Fournisseurs');
  const config = ERP.getSafeConfig();

  sheet.clear();

  sheet.getRange('A1:L1').merge()
    .setValue('🏪 GESTION DES FOURNISSEURS - v2.0')
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

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
    'Statut',
    'Note/5'
  ];

  sheet.getRange(2, 1, 1, headers.length)
    .setValues([headers])
    .setBackground(config.colors.subHeader)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 200, 120, 120, 180, 250, 120, 150, 100, 110, 100, 80].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(2);

  sheet.getRange('C3:C1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Fournitures Bureau', 'Informatique', 'Services', 'Papeterie', 'Mobilier', 'Autre'], true)
      .build()
  );

  sheet.getRange('K3:K1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Actif', 'Inactif', 'Bloqué'], true)
      .build()
  );

  return sheet;
}

/**
 * Affiche le dialogue d'ajout de client v2.0 optimisé
 */
function showAddClientDialog() {
  const html = HtmlService.createHtmlOutputFromFile('ClientForm')
    .setWidth(600)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html, '➕ Nouveau Client - v2.0');
}

/**
 * Ajoute un client avec validation v2.0
 */
function addClient(clientData) {
  try {
    // Validation
    const validation = Validator.validateClient(clientData);
    if (!validation.isValid) {
      Validator.showValidationErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }

    // Sanitize
    clientData.nom = Validator.sanitizeString(clientData.nom);
    clientData.adresse = Validator.sanitizeString(clientData.adresse);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) {
      throw new Error('La feuille Clients n\'existe pas.');
    }

    const config = ERP.getSafeConfig();
    const numeroClient = ERP.getNextNumber(config.prefixes.client, 'Clients');
    const dateCreation = ERP.formatDate(new Date());

    const newRow = [
      numeroClient,
      clientData.nom,
      clientData.type,
      clientData.telephone,
      clientData.email || '',
      clientData.adresse || '',
      clientData.ville || 'Yaoundé',
      clientData.contact || '',
      dateCreation,
      clientData.statut || 'Actif',
      '0 ' + config.devise, // CA Total
      dateCreation // Dernière activité
    ];

    sheet.appendRow(newRow);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 12)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    // Invalider le cache
    DataManager.invalidateCache('Clients');

    // Audit log
    AuditLog.log(AuditLog.Actions.CREATE, AuditLog.Entities.CLIENT, numeroClient, clientData.nom);

    ERP.log('INFO', `Client créé: ${numeroClient}`);

    return { success: true, numero: numeroClient };
  } catch (error) {
    ERP.handleError(error, 'addClient');
    return { success: false, error: error.toString() };
  }
}

/**
 * Affiche le dialogue d'ajout de fournisseur v2.0
 */
function showAddFournisseurDialog() {
  const html = HtmlService.createHtmlOutputFromFile('FournisseurForm')
    .setWidth(600)
    .setHeight(750);

  SpreadsheetApp.getUi().showModalDialog(html, '➕ Nouveau Fournisseur - v2.0');
}

/**
 * Ajoute un fournisseur v2.0
 */
function addFournisseur(fournisseurData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Fournisseurs');
    if (!sheet) {
      throw new Error('La feuille Fournisseurs n\'existe pas.');
    }

    const config = ERP.getSafeConfig();
    const numeroFournisseur = ERP.getNextNumber(config.prefixes.fournisseur, 'Fournisseurs');
    const dateCreation = ERP.formatDate(new Date());

    const newRow = [
      numeroFournisseur,
      Validator.sanitizeString(fournisseurData.nom),
      fournisseurData.categorie,
      fournisseurData.telephone,
      fournisseurData.email || '',
      Validator.sanitizeString(fournisseurData.adresse) || '',
      fournisseurData.ville || 'Yaoundé',
      fournisseurData.contact || '',
      (fournisseurData.delai || '3') + ' jours',
      dateCreation,
      fournisseurData.statut || 'Actif',
      fournisseurData.note || '3'
    ];

    sheet.appendRow(newRow);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 12)
      .setBorder(true, true, true, true, false, false)
      .setVerticalAlignment('middle');

    DataManager.invalidateCache('Fournisseurs');

    AuditLog.log(AuditLog.Actions.CREATE, AuditLog.Entities.FOURNISSEUR, numeroFournisseur, fournisseurData.nom);

    return { success: true, numero: numeroFournisseur };
  } catch (error) {
    ERP.handleError(error, 'addFournisseur');
    return { success: false, error: error.toString() };
  }
}

/**
 * Recherche de contacts optimisée v2.0
 */
function showSearchContactDialog() {
  const html = HtmlService.createHtmlOutputFromFile('SearchForm')
    .setWidth(700)
    .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, '🔍 Recherche de Contacts');
}

/**
 * Recherche un client (optimisé avec cache)
 */
function searchClient(searchTerm) {
  try {
    const results = DataManager.search('Clients', searchTerm, [0, 1, 3]); // N°, Nom, Téléphone
    return results.map(row => ({
      numero: row[0],
      nom: row[1],
      type: row[2],
      telephone: row[3],
      email: row[4],
      statut: row[9],
      caTotal: row[10]
    }));
  } catch (error) {
    ERP.handleError(error, 'searchClient');
    return [];
  }
}

/**
 * Recherche un fournisseur
 */
function searchFournisseur(searchTerm) {
  try {
    const results = DataManager.search('Fournisseurs', searchTerm, [0, 1, 3]);
    return results.map(row => ({
      numero: row[0],
      nom: row[1],
      categorie: row[2],
      telephone: row[3],
      email: row[4],
      statut: row[10],
      note: row[11]
    }));
  } catch (error) {
    ERP.handleError(error, 'searchFournisseur');
    return [];
  }
}

/**
 * Obtient les clients actifs (avec cache)
 */
function getActiveClients() {
  try {
    const cacheKey = 'active_clients';
    const cached = ERP.cacheGet(cacheKey);
    if (cached) return cached;

    const data = DataManager.filter('Clients', row => row[9] === 'Actif' || row[9] === 'VIP');

    const clients = data.map(row => ({
      numero: row[0],
      nom: row[1],
      telephone: row[3]
    }));

    ERP.cacheSet(cacheKey, clients, 300); // 5 minutes

    return clients;
  } catch (error) {
    ERP.log('ERROR', 'getActiveClients: ' + error);
    return [];
  }
}

/**
 * Met à jour le CA d'un client
 */
function updateClientRevenue(clientNom, montant) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === clientNom) { // Colonne Nom
        const currentCA = parseFloat(data[i][10].toString().replace(/[^0-9.-]+/g, '')) || 0;
        const newCA = currentCA + montant;

        sheet.getRange(i + 1, 11).setValue(newCA + ' ' + ERP.config.devise);
        sheet.getRange(i + 1, 12).setValue(ERP.formatDate(new Date())); // Dernière activité

        DataManager.invalidateCache('Clients');
        break;
      }
    }
  } catch (error) {
    ERP.log('WARN', 'updateClientRevenue: ' + error);
  }
}

/**
 * Affiche les statistiques contacts
 */
function showContactStats() {
  try {
    const clientsData = DataManager.getData('Clients');
    const fournisseursData = DataManager.getData('Fournisseurs');

    const totalClients = clientsData.length;
    const clientsActifs = DataManager.count('Clients', 9, 'Actif');
    const clientsVIP = DataManager.count('Clients', 9, 'VIP');

    const totalFournisseurs = fournisseursData.length;
    const fournisseursActifs = DataManager.count('Fournisseurs', 10, 'Actif');

    const ui = SpreadsheetApp.getUi();
    const msg = `📊 STATISTIQUES CONTACTS\n\n` +
                `👥 CLIENTS\n` +
                `Total: ${totalClients}\n` +
                `Actifs: ${clientsActifs}\n` +
                `VIP: ${clientsVIP}\n\n` +
                `🏪 FOURNISSEURS\n` +
                `Total: ${totalFournisseurs}\n` +
                `Actifs: ${fournisseursActifs}`;

    ui.alert('Statistiques Contacts', msg, ui.ButtonSet.OK);
  } catch (error) {
    ERP.handleError(error, 'showContactStats');
  }
}

/**
 * Crée la feuille d'audit
 */
function createAuditSheet() {
  const sheet = ERP.getOrCreateSheet('_Audit');
  const config = ERP.getSafeConfig();

  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:F1').setValues([[
      'Date/Heure',
      'Utilisateur',
      'Action',
      'Entité',
      'ID',
      'Détails'
    ]])
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold');

    sheet.setFrozenRows(1);
    [180, 200, 120, 100, 120, 300].forEach((width, i) => {
      sheet.setColumnWidth(i + 1, width);
    });
  }

  // Masquer la feuille
  sheet.hideSheet();

  return sheet;
}

/**
 * Crée la feuille de notifications
 */
function createNotificationsSheet() {
  const sheet = ERP.getOrCreateSheet('_Notifications');
  const config = ERP.getSafeConfig();

  if (sheet.getLastRow() === 0) {
    sheet.getRange('A1:F1').setValues([[
      'Date/Heure',
      'Type',
      'Titre',
      'Message',
      'Statut',
      'Action'
    ]])
    .setBackground(config.colors.header)
    .setFontColor(config.colors.headerText)
    .setFontWeight('bold');

    sheet.setFrozenRows(1);
  }

  sheet.hideSheet();

  return sheet;
}
