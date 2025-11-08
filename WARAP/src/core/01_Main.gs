/**
 * ============================================================================
 * MAIN.GS - Point d'entrée principal WARAP
 * ============================================================================
 *
 * Fonctions principales :
 * - onOpen() : Créé le menu WARAP au chargement du Sheet
 * - createWARAPMenu() : Construit le menu avec tous les modules
 * - Navigation vers les différents modules
 *
 * @version 1.0.0
 * @author WARAP Team
 * ============================================================================
 */

/**
 * Fonction déclenchée à l'ouverture du Google Sheet
 * Créé automatiquement le menu WARAP
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  try {
    createWARAPMenu(ui);

    // Message de bienvenue (première ouverture seulement)
    const firstOpen = PropertiesService.getDocumentProperties().getProperty('WARAP_FIRST_OPEN');
    if (!firstOpen) {
      showWelcomeMessage(ui);
      PropertiesService.getDocumentProperties().setProperty('WARAP_FIRST_OPEN', 'true');
    }

  } catch (error) {
    Logger.log('❌ Erreur onOpen: ' + error);
    ui.alert('❌ Erreur', 'Erreur lors du chargement de WARAP:\n' + error.message, ui.ButtonSet.OK);
  }
}

/**
 * Créé le menu WARAP complet
 */
function createWARAPMenu(ui) {
  const menu = ui.createMenu('🚀 WARAP');

  // Section Installation
  menu.addItem('⚙️ Installer WARAP', 'installWARAP');
  menu.addItem('🔧 Diagnostic Système', 'runCompleteDiagnostic');
  menu.addSeparator();

  // Section Modules Principaux
  menu.addSubMenu(ui.createMenu('👥 Clients')
    .addItem('📋 Voir les clients', 'openClientsSidebar')
    .addItem('➕ Nouveau client', 'createNewClient')
    .addItem('📊 Statistiques clients', 'showClientsStats')
    .addItem('📥 Exporter clients', 'exportClientsData'));

  menu.addSubMenu(ui.createMenu('🔧 Prestataires')
    .addItem('📋 Voir les prestataires', 'openPrestataires Sidebar')
    .addItem('➕ Nouveau prestataire', 'createNewPrestataire')
    .addItem('✅ Vérifier prestataires', 'verifyPrestataires')
    .addItem('📊 Performance', 'showPrestatairesPerformance'));

  menu.addSubMenu(ui.createMenu('📢 Annonces')
    .addItem('📋 Voir les annonces', 'openAnnoncesSidebar')
    .addItem('➕ Nouvelle annonce', 'createNewAnnonce')
    .addItem('🎯 Annonces sans matching', 'showUnmatchedAnnonces')
    .addItem('📊 Statistiques annonces', 'showAnnoncesStats'));

  menu.addSubMenu(ui.createMenu('🎯 Matching IA')
    .addItem('📋 Voir les matchings', 'openMatchingSidebar')
    .addItem('▶️ Lancer matching manuel', 'runMatchingAlgorithm')
    .addItem('📊 Performance IA', 'showMatchingPerformance')
    .addItem('⚙️ Configurer matching', 'configureMatching'));

  menu.addSubMenu(ui.createMenu('💰 Transactions')
    .addItem('📋 Voir les transactions', 'openTransactionsSidebar')
    .addItem('✅ Valider transactions', 'validatePendingTransactions')
    .addItem('📄 Générer factures', 'generateInvoices')
    .addItem('📊 Rapport financier', 'showFinancialReport'));

  menu.addSeparator();

  // Section Analytics
  menu.addSubMenu(ui.createMenu('📊 Analytics')
    .addItem('📈 Dashboard temps réel', 'openAnalyticsDashboard')
    .addItem('📊 Rapport mensuel', 'generateMonthlyReport')
    .addItem('🔮 Prévisions', 'showRevenueForecast')
    .addItem('🗺️ Analyse géographique', 'showGeoAnalysis'));

  // Section Marketplace
  menu.addSubMenu(ui.createMenu('🛒 Marketplace')
    .addItem('📦 Catalogue produits', 'openProduitsSidebar')
    .addItem('📋 Commandes', 'openCommandesSidebar')
    .addItem('🚚 Livraisons', 'openLivraisonsSidebar')
    .addItem('📦 Gestion stocks', 'openStockManagement'));

  // Section Support
  menu.addSubMenu(ui.createMenu('🛠️ Support')
    .addItem('📅 Rendez-vous', 'openRendezVousSidebar')
    .addItem('⚖️ Litiges', 'openLitigesSidebar')
    .addItem('🔧 SAV', 'openSAVSidebar')
    .addItem('📞 Contacter client', 'contactClient'));

  menu.addSeparator();

  // Section Administration
  menu.addSubMenu(ui.createMenu('⚙️ Administration')
    .addItem('👥 Utilisateurs', 'openUserManagement')
    .addItem('📝 Logs système', 'openLogsViewer')
    .addItem('💾 Sauvegardes', 'openBackupManager')
    .addItem('⚙️ Paramètres', 'openSettings'));

  menu.addSeparator();

  // Section Aide
  menu.addItem('❓ Aide', 'showHelp');
  menu.addItem('📖 Documentation', 'openDocumentation');
  menu.addItem('ℹ️ À propos', 'showAbout');

  menu.addToUi();
}

/**
 * Message de bienvenue
 */
function showWelcomeMessage(ui) {
  const message = `
🎉 BIENVENUE SUR WARAP !

Plateforme de mise en relation clients-prestataires
avec marketplace intégrée pour le Cameroun.

🚀 PREMIÈRE UTILISATION :
1. Cliquez sur "🚀 WARAP > ⚙️ Installer WARAP"
2. Autorisez les permissions
3. Attendez la fin de l'installation (2-3 min)
4. Actualisez la page

💡 BESOIN D'AIDE ?
Menu : 🚀 WARAP > ❓ Aide

Bon démarrage ! 🎯
  `.trim();

  ui.alert('🎉 Bienvenue sur WARAP', message, ui.ButtonSet.OK);
}

/**
 * Affiche l'aide
 */
function showHelp() {
  const ui = SpreadsheetApp.getUi();
  const help = `
📚 AIDE WARAP

🆘 SUPPORT
Email: warapservices@gmail.com
Tickets: Menu SAV

📖 GUIDES
• Installation: Menu > Documentation
• Utilisation: Menu > Documentation
• FAQ: Menu > Documentation

🔧 PROBLÈMES COURANTS
1. Menu WARAP absent → Actualiser la page (F5)
2. Erreur permissions → Autoriser dans Apps Script
3. Données manquantes → Exécuter Diagnostic

⚙️ DIAGNOSTIC
Menu > 🔧 Diagnostic Système
  `.trim();

  ui.alert('❓ Aide WARAP', help, ui.ButtonSet.OK);
}

/**
 * Ouvre la documentation
 */
function openDocumentation() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        line-height: 1.6;
      }
      h2 { color: #4f46e5; }
      .section {
        margin-bottom: 20px;
        padding: 15px;
        background: #f9fafb;
        border-radius: 8px;
      }
      a { color: #4f46e5; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>

    <h2>📖 Documentation WARAP</h2>

    <div class="section">
      <h3>🚀 Démarrage Rapide</h3>
      <ol>
        <li>Installer WARAP (Menu > Installer)</li>
        <li>Créer vos premiers utilisateurs</li>
        <li>Importer vos clients/prestataires</li>
        <li>Publier des annonces</li>
        <li>Laisser l'IA matcher automatiquement</li>
      </ol>
    </div>

    <div class="section">
      <h3>👥 Gestion Clients</h3>
      <p>Créez et gérez vos clients avec segmentation RFM automatique.</p>
      <p>Score RFM basé sur : Récence, Fréquence, Montant</p>
    </div>

    <div class="section">
      <h3>🎯 Matching IA</h3>
      <p>Le système analyse automatiquement toutes les 2 minutes :</p>
      <ul>
        <li>Compétences (30%)</li>
        <li>Localisation (25%)</li>
        <li>Disponibilité (20%)</li>
        <li>Expérience (15%)</li>
        <li>Réputation (10%)</li>
      </ul>
      <p>Score ≥ 85 → Auto-validé ✅</p>
    </div>

    <div class="section">
      <h3>💰 Commissions</h3>
      <ul>
        <li>Plateforme: 15%</li>
        <li>Franchise: 10%</li>
        <li>Prestataire: 75%</li>
      </ul>
    </div>

    <div class="section">
      <h3>🆘 Support</h3>
      <p>Email: <a href="mailto:warapservices@gmail.com">warapservices@gmail.com</a></p>
    </div>
  `)
    .setWidth(600)
    .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, '📖 Documentation WARAP');
}

/**
 * Affiche les informations À propos
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  const about = `
ℹ️ À PROPOS DE WARAP

📱 Plateforme de Services
Version: 1.0.0
Build: 2024

🏗️ Architecture
• 20 feuilles Google Sheets
• 49 fichiers Apps Script
• 48 interfaces HTML
• Matching IA intégré

🌍 Optimisé pour le Cameroun
• 358 communes
• Formats téléphone (+237)
• Devise: FCFA
• Langues: FR/EN

👥 Équipe
WARAP Services
Email: warapservices@gmail.com

📜 Licence
Propriétaire - Tous droits réservés © 2024
  `.trim();

  ui.alert('ℹ️ À propos de WARAP', about, ui.ButtonSet.OK);
}

/**
 * ============================================================================
 * FONCTIONS D'OUVERTURE DES SIDEBARS
 * ============================================================================
 */

function openClientsSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Clients')
    .setTitle('👥 Clients WARAP')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openPrestataireSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Prestataires')
    .setTitle('🔧 Prestataires WARAP')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openAnnoncesSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Annonces')
    .setTitle('📢 Annonces WARAP')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openMatchingSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Matching')
    .setTitle('🎯 Matching IA')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openTransactionsSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Transactions')
    .setTitle('💰 Transactions')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openAnalyticsDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Analytics')
    .setTitle('📊 Analytics WARAP')
    .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openProduitsSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Produits')
    .setTitle('📦 Catalogue Produits')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openCommandesSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Commandes')
    .setTitle('📋 Commandes')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openLivraisonsSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Livraisons')
    .setTitle('🚚 Livraisons')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openRendezVousSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_RendezVous')
    .setTitle('📅 Rendez-vous')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openLitigesSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Litiges')
    .setTitle('⚖️ Litiges')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openSAVSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_SAV')
    .setTitle('🔧 Service SAV')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openUserManagement() {
  requireAuth('SUPERADMIN', 'admin');
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Utilisateurs')
    .setTitle('👥 Gestion Utilisateurs')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openLogsViewer() {
  requireAuth('ADMIN_NATIONAL', 'admin');
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Logs')
    .setTitle('📝 Logs Système')
    .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openBackupManager() {
  requireAuth('SUPERADMIN', 'admin');
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Backup')
    .setTitle('💾 Sauvegardes')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function openSettings() {
  requireAuth('ADMIN_NATIONAL', 'admin');
  const html = HtmlService.createHtmlOutputFromFile('html/sidebars/Sidebar_Settings')
    .setTitle('⚙️ Paramètres WARAP')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * ============================================================================
 * FONCTIONS UTILITAIRES
 * ============================================================================
 */

/**
 * Obtient l'URL du Google Sheet actuel
 */
function getSheetUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

/**
 * Obtient le nom du Google Sheet actuel
 */
function getSheetName() {
  return SpreadsheetApp.getActiveSpreadsheet().getName();
}

/**
 * Obtient l'email de l'utilisateur connecté
 */
function getCurrentUserEmail() {
  return Session.getActiveUser().getEmail();
}

/**
 * Vérifie si WARAP est installé
 */
function isWARAPInstalled() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const installed = PropertiesService.getDocumentProperties().getProperty('WARAP_INSTALLED');
  const hasSheets = ss.getSheetByName('ClientsWARAP') !== null;

  return installed === 'true' && hasSheets;
}

/**
 * Obtient la version de WARAP
 */
function getWARAPVersion() {
  return PropertiesService.getDocumentProperties().getProperty('WARAP_VERSION') || '1.0.0';
}

Logger.log('✅ Main.gs chargé');
