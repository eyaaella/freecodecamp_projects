/**
 * ========================================================================
 * MODULE CORE - COORDINATION GÉNÉRALE DU SYSTÈME
 * ========================================================================
 * Ce module gère le menu principal, la coordination entre modules
 * et les fonctionnalités transversales du système
 * ========================================================================
 */

/**
 * Fonction exécutée à l'ouverture du classeur
 */
function onOpen() {
  createMainMenu();
  initializeSystem();
}

/**
 * Création du menu principal de l'application
 */
function createMainMenu() {
  const ui = SpreadsheetApp.getUi();

  // Menu principal
  ui.createMenu('🏗️ GESTION TOPO')
    .addSubMenu(ui.createMenu('📊 Tableau de Bord')
      .addItem('📈 Afficher le Tableau de Bord', 'showDashboard')
      .addItem('🔄 Actualiser les Données', 'refreshDashboard')
      .addItem('📊 Générer Rapport Global', 'generateGlobalReport'))

    .addSeparator()

    .addSubMenu(ui.createMenu('📁 Projets')
      .addItem('➕ Nouveau Projet', 'openProjetModal')
      .addItem('📋 Liste des Projets', 'showProjetSheet')
      .addItem('🔧 Gestion des Projets', 'openProjetSidebar')
      .addItem('📊 Statistiques Projets', 'showProjetStats'))

    .addSubMenu(ui.createMenu('🏗️ Ouvrages')
      .addItem('➕ Nouvel Ouvrage', 'openOuvrageModal')
      .addItem('📋 Liste des Ouvrages', 'showOuvrageSheet')
      .addItem('🔧 Gestion des Ouvrages', 'openOuvrageSidebar')
      .addItem('📊 Statistiques Ouvrages', 'showOuvrageStats'))

    .addSubMenu(ui.createMenu('✓ Tâches')
      .addItem('➕ Nouvelle Tâche', 'openTacheModal')
      .addItem('📋 Liste des Tâches', 'showTacheSheet')
      .addItem('🔧 Gestion des Tâches', 'openTacheSidebar')
      .addItem('📅 Planning des Tâches', 'showTachePlanning'))

    .addSubMenu(ui.createMenu('📍 Relevés Topographiques')
      .addItem('➕ Nouveau Relevé', 'openReleveModal')
      .addItem('📋 Liste des Relevés', 'showReleveSheet')
      .addItem('🔧 Gestion des Relevés', 'openReleveSidebar')
      .addItem('🗺️ Carte des Relevés', 'showReleveMap')
      .addItem('📤 Exporter Coordonnées', 'exportCoordinates'))

    .addSeparator()

    .addSubMenu(ui.createMenu('👥 Ressources Humaines')
      .addItem('👤 Employés', 'openEmployeSidebar')
      .addItem('👥 Équipes', 'openEquipeSidebar')
      .addItem('💼 Postes', 'openPosteSidebar')
      .addItem('📊 Tableau des Effectifs', 'showHRDashboard'))

    .addSubMenu(ui.createMenu('💰 Finance & Budget')
      .addItem('💰 Gestion Budget', 'openBudgetSidebar')
      .addItem('🧾 Factures', 'openFactureSidebar')
      .addItem('📊 Analyse Financière', 'showFinanceDashboard')
      .addItem('📈 Rentabilité Projets', 'showProfitability'))

    .addSubMenu(ui.createMenu('🔧 Matériel')
      .addItem('➕ Nouveau Matériel', 'openMaterielModal')
      .addItem('📋 Inventaire', 'showMaterielSheet')
      .addItem('🔧 Gestion Matériel', 'openMaterielSidebar')
      .addItem('🔄 Planning Maintenance', 'showMaintenancePlanning'))

    .addSeparator()

    .addSubMenu(ui.createMenu('📄 Documents & Contrôle')
      .addItem('📄 Gestion Documents', 'openDocumentSidebar')
      .addItem('✅ Contrôleurs', 'openControleurSidebar')
      .addItem('📋 Circuit de Validation', 'showValidationCircuit')
      .addItem('📊 Tableau de Suivi', 'showDocumentTracking'))

    .addSubMenu(ui.createMenu('📅 Planning & Coordination')
      .addItem('📅 Planning Global', 'openPlanningSidebar')
      .addItem('🗓️ Calendrier Projets', 'showProjectCalendar')
      .addItem('⚠️ Alertes & Échéances', 'showAlerts')
      .addItem('📊 Diagramme de Gantt', 'showGanttChart'))

    .addSeparator()

    .addSubMenu(ui.createMenu('🔐 Administration')
      .addItem('🔐 Utilisateurs', 'openUtilisateurSidebar')
      .addItem('🔔 Notifications', 'openNotificationSidebar')
      .addItem('📝 Journal des Actions', 'showJournalSheet')
      .addItem('⚙️ Paramètres Système', 'openSettings'))

    .addSeparator()

    .addSubMenu(ui.createMenu('📊 Rapports & Analyses')
      .addItem('📊 Rapport Global', 'generateGlobalReport')
      .addItem('📈 Analyse de Performance', 'showPerformanceAnalysis')
      .addItem('💹 Analyse ROI', 'showROIAnalysis')
      .addItem('📉 Analyse des Retards', 'showDelayAnalysis')
      .addItem('📤 Exporter Données', 'exportAllData'))

    .addSubMenu(ui.createMenu('🛠️ Outils')
      .addItem('🔄 Synchroniser Données', 'syncData')
      .addItem('🗑️ Nettoyer Données', 'cleanData')
      .addItem('📥 Importer Données', 'importData')
      .addItem('🔧 Recalculer Formules', 'recalculateFormulas')
      .addItem('🎨 Réappliquer Formats', 'reapplyFormats'))

    .addSeparator()

    .addSubMenu(ui.createMenu('❓ Aide')
      .addItem('📖 Guide Utilisateur', 'showUserGuide')
      .addItem('🎥 Tutoriels Vidéo', 'showTutorials')
      .addItem('ℹ️ À Propos', 'showAbout')
      .addItem('🐛 Signaler un Bug', 'reportBug'))

    .addToUi();

  logAction("Système", "Menu principal créé");
}

/**
 * Initialisation du système au premier lancement
 */
function initializeSystem() {
  const ss = getActiveSpreadsheet();
  const properties = PropertiesService.getDocumentProperties();

  // Vérifier si le système est déjà initialisé
  if (properties.getProperty('SYSTEM_INITIALIZED') === 'true') {
    return;
  }

  try {
    // Créer le tableau de bord principal
    createDashboardSheet();

    // Initialiser tous les modules
    initializeAllModules();

    // Marquer le système comme initialisé
    properties.setProperty('SYSTEM_INITIALIZED', 'true');
    properties.setProperty('INIT_DATE', new Date().toISOString());

    SpreadsheetApp.getUi().alert(
      '✅ Système Initialisé',
      'Le système de gestion topographique a été initialisé avec succès !',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

    logAction("Système", "Initialisation complète du système");
  } catch (e) {
    SpreadsheetApp.getUi().alert(
      '❌ Erreur',
      'Erreur lors de l\'initialisation : ' + e.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    console.error("Erreur d'initialisation:", e);
  }
}

/**
 * Initialiser tous les modules
 */
function initializeAllModules() {
  // Créer toutes les feuilles nécessaires
  createProjetSheet();
  createOuvrageSheet();
  createTacheSheet();
  createReleveSheet();
  createEquipeSheet();
  createEmployeSheet();
  createMaterielSheet();
  createPosteSheet();
  createUtilisateurSheet();
  createJournalSheet();
  createNotificationSheet();
  createDocumentSheet();
  createPlanningSheet();
  createBudgetSheet();
  createFactureSheet();
  createControleurSheet();
  createStatsSheet();
}

/**
 * Création du tableau de bord principal
 */
function createDashboardSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.DASHBOARD);
  sheet.clear();

  // En-tête principal
  sheet.getRange('A1:M1').merge();
  sheet.getRange('A1')
    .setValue('🏗️ SYSTÈME DE GESTION TOPOGRAPHIQUE - TABLEAU DE BORD PRINCIPAL')
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 50);

  // Informations générales
  sheet.getRange('A3').setValue('📊 VUE D\'ENSEMBLE').setFontWeight('bold').setFontSize(14);
  sheet.getRange('A3:D3').setBackground(CONFIG.COLORS.LIGHT);

  const dashboardData = [
    ['', '', '', ''],
    ['📁 Total Projets:', '=COUNTA(' + CONFIG.SHEETS.PROJET + '!A:A)-1', '💰 Budget Total:', '=SOMME(' + CONFIG.SHEETS.BUDGET + '!B:B)'],
    ['🏗️ Ouvrages Actifs:', '=NB.SI(' + CONFIG.SHEETS.OUVRAGE + '!D:D;"En Cours")', '💵 Montant Utilisé:', '=SOMME(' + CONFIG.SHEETS.BUDGET + '!C:C)'],
    ['✓ Tâches en Cours:', '=NB.SI(' + CONFIG.SHEETS.TACHE + '!G:G;"En Cours")', '🧾 Factures Payées:', '=NB.SI(' + CONFIG.SHEETS.FACTURE + '!E:E;"Payée")'],
    ['📍 Relevés Effectués:', '=COUNTA(' + CONFIG.SHEETS.RELEVE + '!A:A)-1', '🔧 Matériel Disponible:', '=NB.SI(' + CONFIG.SHEETS.MATERIEL + '!G:G;"Disponible")'],
    ['👥 Effectif Total:', '=COUNTA(' + CONFIG.SHEETS.EMPLOYE + '!A:A)-1', '📄 Documents Validés:', '=NB.SI(' + CONFIG.SHEETS.DOCUMENT + '!H:H;"Validé")'],
    ['', '', '', ''],
  ];

  sheet.getRange(4, 1, dashboardData.length, 4).setValues(dashboardData);

  // Formatage des indicateurs
  sheet.getRange('A5:A9').setFontWeight('bold');
  sheet.getRange('C5:C9').setFontWeight('bold');
  sheet.getRange('B5:B9').setNumberFormat('#,##0').setHorizontalAlignment('right');
  sheet.getRange('D5:D9').setNumberFormat('#,##0.00 "FCFA"').setHorizontalAlignment('right');

  // Section statistiques par projet
  sheet.getRange('A12').setValue('📊 STATISTIQUES PAR PROJET').setFontWeight('bold').setFontSize(14);
  sheet.getRange('A12:M12').setBackground(CONFIG.COLORS.LIGHT);

  const statsHeaders = [
    'ID Projet',
    'Nom du Projet',
    'Statut',
    'Chef de Projet',
    '% Avancement',
    'Nb Ouvrages',
    'Nb Tâches',
    'Budget Total',
    'Dépensé',
    'Reste',
    'Date Début',
    'Date Fin',
    'Jours Restants'
  ];

  sheet.getRange(13, 1, 1, statsHeaders.length).setValues([statsHeaders]);
  sheet.getRange(13, 1, 1, statsHeaders.length)
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Formules pour les statistiques (pour la ligne 14, à copier vers le bas)
  const statsFormulas = [
    '=' + CONFIG.SHEETS.PROJET + '!A2',
    '=' + CONFIG.SHEETS.PROJET + '!B2',
    '=' + CONFIG.SHEETS.PROJET + '!E2',
    '=' + CONFIG.SHEETS.PROJET + '!F2',
    '=SI(COUNTA(' + CONFIG.SHEETS.PROJET + '!A2:A2)>0;NB.SI(' + CONFIG.SHEETS.TACHE + '!B:B;A14)/COUNTA(' + CONFIG.SHEETS.TACHE + '!B:B)*100;0)',
    '=NB.SI(' + CONFIG.SHEETS.OUVRAGE + '!B:B;A14)',
    '=NB.SI(' + CONFIG.SHEETS.TACHE + '!B:B;A14)',
    '=SI(COUNTA(A14:A14)>0;SOMME.SI(' + CONFIG.SHEETS.BUDGET + '!B:B;A14;' + CONFIG.SHEETS.BUDGET + '!C:C);"")',
    '=SI(COUNTA(A14:A14)>0;SOMME.SI(' + CONFIG.SHEETS.BUDGET + '!B:B;A14;' + CONFIG.SHEETS.BUDGET + '!D:D);"")',
    '=SI(COUNTA(H14:H14)>0;H14-I14;"")',
    '=' + CONFIG.SHEETS.PROJET + '!C2',
    '=' + CONFIG.SHEETS.PROJET + '!D2',
    '=SI(ET(COUNTA(L14:L14)>0;L14>AUJOURDHUI());L14-AUJOURDHUI();"")'
  ];

  sheet.getRange(14, 1, 1, statsFormulas.length).setFormulas([statsFormulas]);

  // Formatage des colonnes
  sheet.getRange('E14:E100').setNumberFormat('0.0"%"');
  sheet.getRange('F14:G100').setNumberFormat('#,##0');
  sheet.getRange('H14:J100').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('K14:L100').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('M14:M100').setNumberFormat('#,##0 "jours"');

  // Mise en forme conditionnelle pour le statut
  const statusRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Terminé')
    .setBackground(CONFIG.COLORS.SUCCESS)
    .setFontColor('#ffffff')
    .setRanges([sheet.getRange('C14:C100')])
    .build();

  const statusRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('En Cours')
    .setBackground(CONFIG.COLORS.INFO)
    .setFontColor('#ffffff')
    .setRanges([sheet.getRange('C14:C100')])
    .build();

  const statusRule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('En Pause')
    .setBackground(CONFIG.COLORS.WARNING)
    .setFontColor('#ffffff')
    .setRanges([sheet.getRange('C14:C100')])
    .build();

  const statusRule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Annulé')
    .setBackground(CONFIG.COLORS.DANGER)
    .setFontColor('#ffffff')
    .setRanges([sheet.getRange('C14:C100')])
    .build();

  // Mise en forme conditionnelle pour l'avancement
  const progressRule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(50)
    .setBackground('#fee')
    .setRanges([sheet.getRange('E14:E100')])
    .build();

  const progressRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(50, 80)
    .setBackground('#fff4e5')
    .setRanges([sheet.getRange('E14:E100')])
    .build();

  const progressRule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(80)
    .setBackground('#e8f5e9')
    .setRanges([sheet.getRange('E14:E100')])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(statusRule, statusRule2, statusRule3, statusRule4, progressRule1, progressRule2, progressRule3);
  sheet.setConditionalFormatRules(rules);

  // Largeurs des colonnes
  sheet.setColumnWidth(1, 80);   // ID
  sheet.setColumnWidth(2, 200);  // Nom
  sheet.setColumnWidth(3, 120);  // Statut
  sheet.setColumnWidth(4, 150);  // Chef
  sheet.setColumnWidth(5, 100);  // %
  sheet.setColumnWidth(6, 90);   // Ouvrages
  sheet.setColumnWidth(7, 90);   // Tâches
  sheet.setColumnWidth(8, 130);  // Budget
  sheet.setColumnWidth(9, 130);  // Dépensé
  sheet.setColumnWidth(10, 130); // Reste
  sheet.setColumnWidth(11, 100); // Date début
  sheet.setColumnWidth(12, 100); // Date fin
  sheet.setColumnWidth(13, 110); // Jours restants

  // Protection de la feuille
  sheet.protect()
    .setDescription('Tableau de bord protégé - Formules automatiques')
    .setWarningOnly(true);

  logAction("Création", "Tableau de bord principal créé");
}

/**
 * Afficher le tableau de bord
 */
function showDashboard() {
  const ss = getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  if (sheet) {
    ss.setActiveSheet(sheet);
    logAction("Consultation", "Tableau de bord affiché");
  }
}

/**
 * Actualiser le tableau de bord
 */
function refreshDashboard() {
  SpreadsheetApp.flush();
  showDashboard();
  SpreadsheetApp.getUi().alert('✅ Données actualisées avec succès !');
  logAction("Action", "Tableau de bord actualisé");
}

/**
 * Afficher la sidebar principale
 */
function showMainSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('CORE/MainSidebar')
    .setTitle('🏗️ Menu Principal')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
  logAction("Interface", "Sidebar principale ouverte");
}

/**
 * Générer un rapport global
 */
function generateGlobalReport() {
  SpreadsheetApp.getUi().alert(
    '📊 Rapport Global',
    'Génération du rapport en cours...\nCette fonctionnalité sera disponible prochainement.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Afficher les informations À propos
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'ℹ️ À Propos',
    CONFIG.APP_NAME + '\n' +
    'Version: ' + CONFIG.APP_VERSION + '\n\n' +
    'Système de gestion complet pour service topographique\n' +
    'Projet: Aménagement des périmètres agricoles en réseau gravitaire\n' +
    'Localisation: Cameroun\n\n' +
    '© 2024 - Tous droits réservés',
    ui.ButtonSet.OK
  );
}
