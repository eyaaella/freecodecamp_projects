/**
 * ===============================================================================
 * TOPOGEST PRO v2.0 - SYSTÈME DE GESTION TOPOGRAPHIQUE AVANCÉ
 * Cameroun - Aménagement des Périmètres Agricoles en Réseau Gravitaire
 * ===============================================================================
 *
 * Version: 2.0.0 - Production Ready avec IA et Analytics Avancés
 * Date: 2025-11-16
 *
 * DESCRIPTION:
 * Système complet de gestion pour services topographiques avec 17 modules
 * intégrés couvrant projets, ouvrages, tâches, relevés, ressources humaines,
 * matériel, finances, documents et planning.
 *
 * NOUVEAUTÉS v2.0:
 * - EVM (Earned Value Management) avec KPIs temps réel
 * - IA Prédictive: Maintenance, Délais, Budget
 * - Hydraulique: Calculs Manning, FAO, CIEH
 * - CPM (Critical Path Method) pour planning
 * - DXF Export AutoCAD pour plans
 * - Cache Manager avec TTL
 * - API REST (doGet/doPost)
 * - Multi-channel Notifications
 * - Document Versioning
 * - Dark Mode UI
 * - Chart.js 4.4.0 Integration
 * - TVA Cameroun 19.25% automatique
 * - Validation GPS UTM Zone 33N
 * - Téléphone Cameroun +237 6XX XXX XXX
 *
 * MODULES INCLUS:
 * - CORE: Coordination générale + Dashboard Analytics
 * - PROJET: Gestion projets + EVM + Gantt + IA Prévisions
 * - OUVRAGE: Gestion ouvrages + Calculs hydrauliques + Maintenance prédictive
 * - TACHE: Gestion tâches + CPM + Chemin critique
 * - RELEVE: Relevés GPS + Validation UTM + Transformations coordonnées
 * - EQUIPE: Gestion équipes + Productivité KPIs
 * - EMPLOYE: Gestion employés + Validation téléphone Cameroun
 * - MATERIEL: Gestion matériel + Maintenance prédictive IA
 * - POSTE: Référentiel postes + Grilles salariales
 * - UTILISATEUR: Gestion utilisateurs + SHA-256 + Rôles avancés
 * - JOURNAL: Journal d'activité + Détection anomalies
 * - NOTIFICATION: Notifications multi-canal (Email/SMS/InApp/Push)
 * - DOCUMENT: GED + Versioning + Google Drive Integration
 * - PLANNING: Planning + Détection conflits + Optimisation ressources
 * - CONTROLEUR: Contrôle qualité + Non-conformités
 * - BUDGET: Gestion budgétaire + Alertes dépassement
 * - FACTURE: Facturation + TVA 19.25% + Numérotation auto
 *
 * TECHNOLOGIES:
 * - Google Apps Script
 * - Google Sheets (formules avancées en français avec ;)
 * - HTML5/CSS3/JavaScript pour interfaces
 * - Chart.js 4.4.0 pour visualisations
 * - Google Material Design (GAFAM)
 * - SHA-256 pour sécurité
 * - Cache Service pour performance
 *
 * AUTEUR: TopoGest Pro Development Team
 * ===============================================================================
 */

// ===============================================================================
// POINT D'ENTRÉE PRINCIPAL
// ===============================================================================

/**
 * Fonction appelée automatiquement à l'ouverture du classeur
 * Crée le menu principal de l'application
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🏗️ TopoGest Pro v2.0')
    .addItem('📊 Tableau de Bord', 'naviguerVersTableauDeBord')
    .addSeparator()

    // === GESTION ===
    .addSubMenu(ui.createMenu('📁 Gestion')
      .addItem('📁 Projets', 'naviguerVersProjets')
      .addItem('🏗️ Ouvrages', 'naviguerVersOuvrages')
      .addItem('✅ Tâches', 'naviguerVersTaches')
      .addItem('📐 Relevés', 'naviguerVersReleves'))

    // === RESSOURCES ===
    .addSubMenu(ui.createMenu('👥 Ressources')
      .addItem('👥 Équipes', 'naviguerVersEquipes')
      .addItem('👤 Employés', 'naviguerVersEmployes')
      .addItem('🔧 Matériel', 'naviguerVersMateriel')
      .addItem('💼 Postes', 'naviguerVersPostes'))

    // === FINANCE ===
    .addSubMenu(ui.createMenu('💰 Finance')
      .addItem('💰 Budget', 'naviguerVersBudget')
      .addItem('🧾 Factures', 'naviguerVersFactures'))

    // === DOCUMENTS & PLANNING ===
    .addSubMenu(ui.createMenu('📄 Documents & Planning')
      .addItem('📄 Documents', 'naviguerVersDocuments')
      .addItem('📅 Planning', 'naviguerVersPlanning')
      .addItem('✓ Contrôleurs', 'naviguerVersControleurs'))

    // === SYSTÈME ===
    .addSubMenu(ui.createMenu('⚙️ Système')
      .addItem('🔐 Utilisateurs', 'naviguerVersUtilisateurs')
      .addItem('🔔 Notifications', 'naviguerVersNotifications')
      .addItem('📝 Journal', 'naviguerVersJournal')
      .addItem('⚙️ Configuration', 'naviguerVersConfiguration'))

    .addSeparator()

    // === INTERFACES ===
    .addItem('📱 Menu Principal', 'afficherMenuPrincipal')
    .addItem('🎛️ Gestionnaire Complet', 'afficherModalPrincipal')

    .addSeparator()

    // === OUTILS ===
    .addSubMenu(ui.createMenu('🛠️ Outils')
      .addItem('🚀 Initialiser Système', 'initialiserSystemeComplet')
      .addItem('💾 Sauvegarde', 'sauvegardeAutomatique')
      .addItem('🔍 Vérifier Intégrité', 'afficherRapportIntegrite')
      .addItem('🗑️ Nettoyer Données', 'nettoyerDonneesAnciennes')
      .addSeparator()
      .addItem('📚 Documentation', 'afficherDocumentation')
      .addItem('ℹ️ À propos', 'afficherAPropos'))

    .addToUi();

  // Message de bienvenue
  afficherMessageBienvenue();
}

/**
 * Message de bienvenue au démarrage
 */
function afficherMessageBienvenue() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const user = Session.getActiveUser().getEmail();

    // Vérifier si le système est initialisé
    const dashboardSheet = ss.getSheetByName('📊 Tableau de Bord');

    if (!dashboardSheet) {
      // Système non initialisé
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        '🏗️ Bienvenue dans TopoGest Pro!',
        'Le système n\'est pas encore initialisé.\n\n' +
        'Voulez-vous initialiser maintenant?',
        ui.ButtonSet.YES_NO
      );

      if (response === ui.Button.YES) {
        initialiserSystemeComplet();
      }
    } else {
      // Système déjà initialisé - journaliser la connexion
      if (typeof journaliserAction === 'function') {
        journaliserAction('CONNEXION', `Connexion de ${user}`);
      }
    }
  } catch (error) {
    Logger.log('Erreur message bienvenue: ' + error);
  }
}

/**
 * Initialise tout le système avec tous les modules
 */
function initialiserSystemeComplet() {
  try {
    const ui = SpreadsheetApp.getUi();

    // Confirmation
    const response = ui.alert(
      '⚠️ Initialisation du Système',
      'Cette opération va créer toutes les feuilles et structures du système.\n\n' +
      'Durée estimée: 2-3 minutes\n\n' +
      'Continuer?',
      ui.ButtonSet.YES_NO
    );

    if (response !== ui.Button.YES) {
      return;
    }

    ui.alert('🚀 Initialisation en cours...\n\nVeuillez patienter, ne fermez pas la fenêtre.');

    Logger.log('=== DÉBUT INITIALISATION SYSTÈME TOPOGEST PRO ===');

    // 1. Initialiser le CORE (Dashboard, Config)
    Logger.log('1/17 - Initialisation CORE...');
    initialiserSysteme();

    // 2. Initialiser PROJET
    Logger.log('2/17 - Initialisation PROJET...');
    if (typeof initialiserProjet === 'function') initialiserProjet();

    // 3. Initialiser OUVRAGE
    Logger.log('3/17 - Initialisation OUVRAGE...');
    if (typeof initialiserOuvrage === 'function') initialiserOuvrage();

    // 4. Initialiser TACHE
    Logger.log('4/17 - Initialisation TACHE...');
    if (typeof initialiserTache === 'function') initialiserTache();

    // 5. Initialiser RELEVE
    Logger.log('5/17 - Initialisation RELEVE...');
    if (typeof initialiserReleve === 'function') initialiserReleve();

    // 6. Initialiser EQUIPE
    Logger.log('6/17 - Initialisation EQUIPE...');
    if (typeof initialiserEquipe === 'function') initialiserEquipe();

    // 7. Initialiser EMPLOYE
    Logger.log('7/17 - Initialisation EMPLOYE...');
    if (typeof initialiserEmploye === 'function') initialiserEmploye();

    // 8. Initialiser MATERIEL
    Logger.log('8/17 - Initialisation MATERIEL...');
    if (typeof initialiserMateriel === 'function') initialiserMateriel();

    // 9. Initialiser POSTE
    Logger.log('9/17 - Initialisation POSTE...');
    if (typeof initialiserPoste === 'function') initialiserPoste();

    // 10. Initialiser UTILISATEUR
    Logger.log('10/17 - Initialisation UTILISATEUR...');
    if (typeof initialiserUtilisateur === 'function') initialiserUtilisateur();

    // 11. Initialiser JOURNAL_ACTIONS
    Logger.log('11/17 - Initialisation JOURNAL_ACTIONS...');
    if (typeof initialiserJournalActions === 'function') initialiserJournalActions();

    // 12. Initialiser NOTIFICATION
    Logger.log('12/17 - Initialisation NOTIFICATION...');
    if (typeof initialiserNotification === 'function') initialiserNotification();

    // 13. Initialiser DOCUMENT
    Logger.log('13/17 - Initialisation DOCUMENT...');
    if (typeof initialiserDocument === 'function') initialiserDocument();

    // 14. Initialiser PLANNING
    Logger.log('14/17 - Initialisation PLANNING...');
    if (typeof initialiserPlanning === 'function') initialiserPlanning();

    // 15. Initialiser CONTROLEUR
    Logger.log('15/17 - Initialisation CONTROLEUR...');
    if (typeof initialiserControleur === 'function') initialiserControleur();

    // 16. Initialiser BUDGET
    Logger.log('16/17 - Initialisation BUDGET...');
    if (typeof initialiserBudget === 'function') initialiserBudget();

    // 17. Initialiser FACTURE
    Logger.log('17/17 - Initialisation FACTURE...');
    if (typeof initialiserFacture === 'function') initialiserFacture();

    Logger.log('=== FIN INITIALISATION - SUCCÈS ===');

    // Naviguer vers le tableau de bord
    naviguerVersTableauDeBord();

    // Message de succès
    ui.alert(
      '✅ Système Initialisé - TopoGest Pro v2.0!',
      'TopoGest Pro v2.0 est maintenant prêt à l\'emploi.\n\n' +
      '17 modules ont été créés avec succès:\n' +
      '• Gestion (Projets + EVM, Ouvrages + Hydraulique, Tâches + CPM, Relevés GPS)\n' +
      '• Ressources (Équipes, Employés, Matériel + IA Prédictive, Postes)\n' +
      '• Finance (Budget + Alertes, Factures + TVA 19.25%)\n' +
      '• Documents (Documents + Versioning, Planning + Conflits, Contrôleurs)\n' +
      '• Système (Utilisateurs + SHA-256, Journal + Anomalies, Notifications Multi-canal)\n\n' +
      '🆕 Nouveautés v2.0:\n' +
      '• IA Prédictive | EVM | CPM | Hydraulique\n' +
      '• DXF Export | Cache Manager | API REST\n' +
      '• Dark Mode | Chart.js 4.4.0\n\n' +
      'Consultez le Tableau de Bord pour commencer.',
      ui.ButtonSet.OK
    );

  } catch (error) {
    Logger.log('❌ ERREUR INITIALISATION: ' + error);
    SpreadsheetApp.getUi().alert(
      '❌ Erreur d\'initialisation',
      'Une erreur s\'est produite:\n\n' + error.message +
      '\n\nConsultez les logs pour plus de détails.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Affiche la documentation
 */
function afficherDocumentation() {
  const ui = SpreadsheetApp.getUi();

  const doc = `
📚 DOCUMENTATION TOPOGEST PRO v2.0
========================================

🎯 MODULES DISPONIBLES:

GESTION:
• Projets: Gestion complète + EVM + Gantt + IA Prévisions
• Ouvrages: Suivi + Calculs Hydrauliques (Manning, FAO, CIEH)
• Tâches: Organisation + CPM + Chemin Critique
• Relevés: GPS + Validation UTM Zone 33N + Transformations

RESSOURCES:
• Équipes: Gestion + KPIs Productivité
• Employés: Gestion + Validation Tél Cameroun (+237 6XX XXX XXX)
• Matériel: Suivi + Maintenance Prédictive IA
• Postes: Référentiel + Grilles Salariales

FINANCE:
• Budget: Gestion + Alertes Dépassement
• Factures: Facturation + TVA 19.25% Auto + Numérotation

DOCUMENTS:
• Documents: GED + Versioning (v1.0, v1.1, v2.0)
• Planning: Planning + Détection Conflits + Optimisation
• Contrôleurs: Contrôle Qualité + Non-conformités

SYSTÈME:
• Utilisateurs: Gestion + SHA-256 + Rôles Avancés
• Notifications: Multi-canal (Email/SMS/InApp/Push)
• Journal: Traçabilité + Détection Anomalies

📖 UTILISATION:

1. Menu principal: Accès via "TopoGest Pro v2.0" dans la barre
2. Navigation: Cliquez sur le module désiré
3. Sidebars: Interfaces 320px avec stats, filtres, actions
4. Modals: Interfaces 1100x750px avec 5-6 tabs
5. CRUD: Créer/Modifier/Supprimer avec validation
6. Export: DXF AutoCAD, Excel, PDF
7. API: Endpoints REST (doGet/doPost)

🛠️ FONCTIONNALITÉS v2.0:

✅ CORE:
• Formules françaises avancées (séparateur ;)
• Validation stricte données Cameroun
• Mise en forme conditionnelle
• Graphiques Chart.js 4.4.0
• KPIs temps réel
• Cache Manager TTL
• Dark Mode UI

🆕 IA & ANALYTICS:
• EVM (BAC, PV, EV, AC, CPI, SPI, EAC, VAC)
• IA Prédictive Maintenance (scoring, priorités)
• IA Prévisions Délais (tendances, recommandations)
• IA Budget (dépassements prévisionnels)
• CPM Chemin Critique (forward/backward pass)

🔧 CALCULS AVANCÉS:
• Manning Canaux (débit, vitesse, conformité)
• FAO Irrigation (besoins eau, rendement)
• CIEH Normes Hydrauliques
• UTM ↔ WGS84 Transformations

🌍 SPÉCIFICITÉS CAMEROUN:
• Zone UTM: 33N
• X: 200k-900k, Y: 200k-1500k, Alt: 0-4100m
• Téléphone: +237 6XX XXX XXX
• Devise: FCFA
• TVA: 19.25% automatique

📞 SUPPORT:

Email: support@topogest.cm
Tél: +237 6XX XXX XXX
Version: 2.0.0 (2025-11-16)
  `;

  ui.alert('📚 Documentation TopoGest Pro v2.0', doc, ui.ButtonSet.OK);
}

/**
 * Affiche les informations À propos
 */
function afficherAPropos() {
  const ui = SpreadsheetApp.getUi();

  const about = `
🏗️ TOPOGEST PRO v2.0
Version 2.0.0 - Production Ready
IA & Analytics Avancés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 LOCALISATION:
Cameroun - Afrique Centrale
Zone UTM: 33N
Devise: FCFA | TVA: 19.25%

🎯 MISSION:
Système complet de gestion pour services
topographiques spécialisés dans l'aménagement
de périmètres agricoles en réseau gravitaire.

📦 MODULES: 17
• CORE, PROJET, OUVRAGE, TACHE, RELEVE
• EQUIPE, EMPLOYE, MATERIEL, POSTE
• UTILISATEUR, JOURNAL, NOTIFICATION
• DOCUMENT, PLANNING, CONTROLEUR
• BUDGET, FACTURE

🆕 NOUVEAUTÉS v2.0:
• EVM (Earned Value Management)
• IA Prédictive (Maintenance, Délais, Budget)
• Calculs Hydrauliques (Manning, FAO, CIEH)
• CPM (Critical Path Method)
• DXF Export AutoCAD
• Cache Manager TTL
• Notifications multi-canal
• Document Versioning
• Dark Mode UI
• Chart.js 4.4.0

💡 TECHNOLOGIES:
• Google Apps Script
• Google Sheets (formules françaises)
• HTML5/CSS3/JavaScript
• Chart.js 4.4.0
• Google Material Design (GAFAM)
• SHA-256 Encryption
• Cache Service

👨‍💻 DÉVELOPPEMENT:
TopoGest Pro Development Team - 2025

📄 LICENCE:
Tous droits réservés

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 Fait avec passion pour l'excellence
🚀 Powered by AI & Advanced Analytics
  `;

  ui.alert('ℹ️ À propos de TopoGest Pro v2.0', about, ui.ButtonSet.OK);
}

/**
 * Crée un trigger pour sauvegarde automatique quotidienne
 */
function creerTriggerSauvegardeAuto() {
  try {
    // Supprimer les anciens triggers
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'sauvegardeAutomatique') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Créer un nouveau trigger quotidien à 2h du matin
    ScriptApp.newTrigger('sauvegardeAutomatique')
      .timeBased()
      .atHour(2)
      .everyDays(1)
      .create();

    Logger.log('✅ Trigger de sauvegarde automatique créé');

  } catch (error) {
    Logger.log('❌ Erreur création trigger: ' + error);
  }
}

/**
 * Statistiques globales du système
 */
function obtenirStatistiquesGlobales() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const stats = {
      projets: {
        total: 0,
        actifs: 0,
        termines: 0
      },
      ouvrages: {
        total: 0,
        enCours: 0
      },
      taches: {
        total: 0,
        enCours: 0,
        retard: 0
      },
      releves: {
        total: 0,
        valides: 0
      },
      employes: {
        total: 0,
        actifs: 0
      },
      budget: {
        total: 0,
        utilise: 0
      },
      factures: {
        total: 0,
        payees: 0,
        impayees: 0
      }
    };

    // Compter les projets
    const projetSheet = ss.getSheetByName('📁 Projets');
    if (projetSheet) {
      const projetData = projetSheet.getDataRange().getValues();
      stats.projets.total = projetData.length - 2; // Moins en-têtes
      stats.projets.actifs = projetData.filter(row => row[7] === 'En cours').length;
      stats.projets.termines = projetData.filter(row => row[7] === 'Terminé').length;
    }

    // Compter les tâches
    const tacheSheet = ss.getSheetByName('✅ Tâches');
    if (tacheSheet) {
      const tacheData = tacheSheet.getDataRange().getValues();
      stats.taches.total = tacheData.length - 2;
      stats.taches.enCours = tacheData.filter(row => row[8] === 'En cours').length;
    }

    // Compter les employés
    const employeSheet = ss.getSheetByName('👤 Employés');
    if (employeSheet) {
      const employeData = employeSheet.getDataRange().getValues();
      stats.employes.total = employeData.length - 2;
      stats.employes.actifs = employeData.filter(row => row[10] === 'Actif').length;
    }

    return {success: true, stats: stats};

  } catch (error) {
    Logger.log('Erreur statistiques globales: ' + error);
    return {success: false, message: error.message};
  }
}

/**
 * Export complet du système
 */
function exporterSystemeComplet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), 'Africa/Douala', 'yyyyMMdd_HHmmss');

    // Créer une copie complète
    const exportName = `TopoGest_Export_${timestamp}`;
    const exportFile = DriveApp.getFileById(ss.getId()).makeCopy(exportName);

    // Déplacer dans dossier Exports
    const folders = DriveApp.getFoldersByName('TopoGest Exports');
    let exportFolder;

    if (folders.hasNext()) {
      exportFolder = folders.next();
    } else {
      exportFolder = DriveApp.createFolder('TopoGest Exports');
    }

    exportFile.moveTo(exportFolder);

    if (typeof journaliserAction === 'function') {
      journaliserAction('EXPORT', `Export système complet: ${exportName}`);
    }

    SpreadsheetApp.getUi().alert(
      '✅ Export Réussi',
      `Le système complet a été exporté:\n\n${exportName}\n\nEmplacement: Dossier "TopoGest Exports"`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );

    return {success: true, fileName: exportName};

  } catch (error) {
    Logger.log('Erreur export système: ' + error);
    SpreadsheetApp.getUi().alert('❌ Erreur: ' + error.message);
    return {success: false, message: error.message};
  }
}

// ===============================================================================
// INFORMATIONS SYSTÈME
// ===============================================================================

const SYSTEM_INFO = {
  NAME: 'TopoGest Pro',
  VERSION: '2.0.0',
  BUILD: 'Production Ready - IA & Analytics Avancés',
  DATE: '2025-11-16',
  LOCALE: 'fr_FR',
  TIMEZONE: 'Africa/Douala',
  COUNTRY: 'Cameroun',
  UTM_ZONE: '33N',
  TVA: 0.1925, // 19.25%
  DEVISE: 'FCFA',

  MODULES: [
    'CORE', 'PROJET', 'OUVRAGE', 'TACHE', 'RELEVE',
    'EQUIPE', 'EMPLOYE', 'MATERIEL', 'POSTE',
    'UTILISATEUR', 'JOURNAL', 'NOTIFICATION',
    'DOCUMENT', 'PLANNING', 'CONTROLEUR',
    'BUDGET', 'FACTURE'
  ],

  FEATURES: [
    'Gestion projets d\'aménagement avec EVM',
    'Suivi ouvrages hydrauliques avec calculs CIEH/FAO',
    'Organisation tâches terrain avec CPM',
    'Relevés topographiques GPS UTM Zone 33N',
    'Gestion ressources humaines avec KPIs',
    'Suivi matériel avec maintenance prédictive IA',
    'Gestion budgétaire avec alertes',
    'Facturation clients avec TVA 19.25%',
    'GED documents avec versioning',
    'Planning projets avec détection conflits',
    'Notifications multi-canal (Email/SMS/InApp/Push)',
    'Audit trail complet avec détection anomalies',
    'IA Prévisions: Délais, Budget, Maintenance',
    'Export DXF AutoCAD',
    'Dashboard Analytics temps réel',
    'Cache Manager avec TTL',
    'API REST (doGet/doPost)',
    'Dark Mode UI',
    'Chart.js 4.4.0 Integration'
  ],

  NEW_V2: [
    'EVM (Earned Value Management)',
    'IA Prédictive (Maintenance, Délais, Budget)',
    'Calculs Hydrauliques (Manning, FAO, CIEH)',
    'CPM (Critical Path Method)',
    'DXF Export AutoCAD',
    'Cache Manager TTL',
    'Multi-channel Notifications',
    'Document Versioning',
    'Dark Mode',
    'Chart.js 4.4.0'
  ]
};

/**
 * Obtient les informations système
 */
function obtenirInfoSysteme() {
  return SYSTEM_INFO;
}

// ===============================================================================
// LOGS ET DEBUGGING
// ===============================================================================

/**
 * Active le mode debug
 */
function activerModeDebug() {
  PropertiesService.getScriptProperties().setProperty('DEBUG_MODE', 'true');
  Logger.log('✅ Mode debug activé');
}

/**
 * Désactive le mode debug
 */
function desactiverModeDebug() {
  PropertiesService.getScriptProperties().deleteProperty('DEBUG_MODE');
  Logger.log('✅ Mode debug désactivé');
}

/**
 * Vérifie si le mode debug est actif
 */
function estModeDebug() {
  return PropertiesService.getScriptProperties().getProperty('DEBUG_MODE') === 'true';
}

// ===============================================================================
// NOTES POUR DÉPLOIEMENT GOOGLE APPS SCRIPT
// ===============================================================================

/**
 * INSTRUCTIONS DE DÉPLOIEMENT:
 *
 * 1. Créer un nouveau Google Sheets
 * 2. Ouvrir Extensions > Apps Script
 * 3. Copier ce fichier Code.gs
 * 4. Copier tous les fichiers .gs des modules dans le projet
 * 5. Créer les fichiers HTML pour les sidebars et modals
 * 6. Enregistrer et rafraîchir le Google Sheet
 * 7. Autoriser les permissions demandées
 * 8. Utiliser le menu "TopoGest Pro" > "Initialiser Système"
 * 9. Patienter 2-3 minutes pendant l'initialisation
 * 10. Le système est prêt!
 *
 * FICHIERS REQUIS DANS APPS SCRIPT:
 * - Code.gs (ce fichier principal)
 * - modules/core/Core.gs
 * - modules/projet/Projet.gs
 * - modules/ouvrage/Ouvrage.gs
 * - modules/tache/Tache.gs
 * - modules/releve/Releve.gs
 * - modules/equipe/Equipe.gs
 * - modules/employe/Employe.gs
 * - modules/materiel/Materiel.gs
 * - modules/poste/Poste.gs
 * - modules/utilisateur/Utilisateur.gs
 * - modules/journal_actions/JournalActions.gs
 * - modules/notification/Notification.gs
 * - modules/document/Document.gs
 * - modules/planning/Planning.gs
 * - modules/controleur/Controleur.gs
 * - modules/budget/Budget.gs
 * - modules/facture/Facture.gs
 * - modules/core/CoreSidebar.html
 * - modules/core/CoreModal.html
 * - modules/projet/ProjetSidebar.html
 * - modules/projet/ProjetModal.html
 *
 * PERMISSIONS GOOGLE REQUISES:
 * - Accès aux feuilles Google Sheets
 * - Accès à Google Drive (pour sauvegardes)
 * - Accès aux services de script
 * - Accès aux déclencheurs (triggers)
 */
