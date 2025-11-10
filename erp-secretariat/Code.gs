/**
 * ERP Secrétariat Bureautique - Cameroun
 * Fichier principal - Code.gs
 *
 * Ce système gère l'ensemble des opérations d'un secrétariat bureautique :
 * - Clients et Fournisseurs
 * - Courrier entrant/sortant
 * - Agenda et rendez-vous
 * - Tâches et suivi
 * - Facturation et devis
 * - Stock de fournitures
 * - Personnel
 * - Reporting et statistiques
 */

/**
 * Fonction exécutée à l'ouverture du document
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  // Menu principal ERP
  ui.createMenu('🏢 ERP Secrétariat')
    .addSubMenu(ui.createMenu('📊 Initialisation')
      .addItem('Créer toutes les feuilles', 'initializeAllSheets')
      .addItem('Réinitialiser l\'ERP', 'resetERP'))
    .addSeparator()
    .addSubMenu(ui.createMenu('👥 Clients & Fournisseurs')
      .addItem('Ajouter un client', 'showAddClientDialog')
      .addItem('Ajouter un fournisseur', 'showAddFournisseurDialog')
      .addItem('Rechercher contact', 'showSearchContactDialog'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📨 Courrier')
      .addItem('Enregistrer courrier entrant', 'showCourrierEntrantDialog')
      .addItem('Enregistrer courrier sortant', 'showCourrierSortantDialog')
      .addItem('Consulter registre', 'goToCourrierSheet'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📅 Agenda & Tâches')
      .addItem('Ajouter un rendez-vous', 'showAddRendezVousDialog')
      .addItem('Ajouter une tâche', 'showAddTacheDialog')
      .addItem('Voir agenda du jour', 'showAgendaToday'))
    .addSeparator()
    .addSubMenu(ui.createMenu('💰 Facturation')
      .addItem('Créer un devis', 'showCreateDevisDialog')
      .addItem('Créer une facture', 'showCreateFactureDialog')
      .addItem('Enregistrer un paiement', 'showPaiementDialog'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📦 Stock & Fournitures')
      .addItem('Ajouter un article', 'showAddArticleDialog')
      .addItem('Mouvement de stock', 'showMouvementStockDialog')
      .addItem('Inventaire', 'goToStockSheet'))
    .addSeparator()
    .addSubMenu(ui.createMenu('👨‍💼 Personnel')
      .addItem('Ajouter un employé', 'showAddEmployeDialog')
      .addItem('Enregistrer présence', 'showPresenceDialog')
      .addItem('Consulter fiches', 'goToPersonnelSheet'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📈 Reporting')
      .addItem('Tableau de bord', 'goToDashboard')
      .addItem('Rapport mensuel', 'generateMonthlyReport')
      .addItem('Statistiques', 'showStatistics'))
    .addToUi();
}

/**
 * Initialise toutes les feuilles de l'ERP
 */
function initializeAllSheets() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Initialisation de l\'ERP',
    'Voulez-vous créer toutes les feuilles du système ERP ?',
    ui.ButtonSet.YES_NO
  );

  if (response == ui.Button.YES) {
    try {
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
      createConfigSheet();

      ui.alert('Succès', 'Toutes les feuilles ont été créées avec succès !', ui.ButtonSet.OK);

      // Rediriger vers le tableau de bord
      goToDashboard();
    } catch (error) {
      ui.alert('Erreur', 'Une erreur est survenue : ' + error.toString(), ui.ButtonSet.OK);
    }
  }
}

/**
 * Réinitialise complètement l'ERP (attention : supprime toutes les données)
 */
function resetERP() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ ATTENTION',
    'Cette action va supprimer TOUTES les données de l\'ERP. Êtes-vous sûr ?',
    ui.ButtonSet.YES_NO
  );

  if (response == ui.Button.YES) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();

    // Supprimer toutes les feuilles sauf la première
    for (let i = sheets.length - 1; i > 0; i--) {
      ss.deleteSheet(sheets[i]);
    }

    // Renommer et vider la première feuille
    sheets[0].setName('Accueil');
    sheets[0].clear();

    // Réinitialiser
    initializeAllSheets();
  }
}

/**
 * Fonction utilitaire pour obtenir ou créer une feuille
 */
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  return sheet;
}

/**
 * Fonction utilitaire pour formater une date
 */
function formatDate(date) {
  if (!date) date = new Date();
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}

/**
 * Fonction utilitaire pour formater une date et heure
 */
function formatDateTime(date) {
  if (!date) date = new Date();
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
}

/**
 * Obtient le prochain numéro de séquence pour un type de document
 */
function getNextNumber(prefix, sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return prefix + '001';

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return prefix + '001';

  const lastNumber = sheet.getRange(lastRow, 1).getValue();
  if (!lastNumber) return prefix + '001';

  const numberPart = parseInt(lastNumber.toString().replace(prefix, '')) || 0;
  const nextNumber = (numberPart + 1).toString().padStart(3, '0');

  return prefix + nextNumber;
}
