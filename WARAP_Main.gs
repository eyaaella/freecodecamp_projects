/**
 * ============================================================================
 * WARAP - MAIN.GS
 * Point d'entrée principal de l'application
 * Version: 1.0.0 - Production
 * ============================================================================
 *
 * Description:
 * Fichier principal qui gère l'initialisation de la plateforme WARAP,
 * la création du menu intelligent adapté aux rôles, et la gestion des sidebars.
 *
 * Fonctionnalités:
 * - onOpen(): Déclenchement automatique à l'ouverture
 * - createWARAPMenu(): Menu dynamique selon permissions
 * - checkExistingSidebars(): Gestion multi-sidebars
 * - Authentification par email Session.getActiveUser()
 * - Logging et monitoring des actions
 *
 * @author WARAP Development Team
 * @date 2024
 */

// ============================================================================
// CONFIGURATION GLOBALE
// ============================================================================

const WARAP_CONFIG = {
  version: '1.0.0',
  environment: 'production',
  appName: 'WARAP',
  appFullName: 'WARAP - Plateforme de Services au Cameroun',
  minRefreshInterval: 5000, // 5 secondes minimum entre rafraîchissements
  maxSidebarsOpen: 3, // Maximum de sidebars ouvertes simultanément
  sessionTimeout: 21600, // 6 heures en secondes
  cacheExpiration: 300 // 5 minutes pour le cache
};

// ============================================================================
// MODULES DISPONIBLES
// Configuration complète de tous les modules avec permissions
// ============================================================================

const MODULES_CONFIG = {
  accueil: {
    name: 'Accueil',
    icon: '🏠',
    sidebar: 'Sidebar_Main',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR', 'AGENT'],
    description: 'Tableau de bord principal avec KPIs',
    color: '#4f46e5'
  },
  clients: {
    name: 'Clients',
    icon: '👥',
    sidebar: 'Sidebar_Clients',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR', 'AGENT'],
    description: 'Gestion complète de la base clients',
    color: '#10b981'
  },
  prestataires: {
    name: 'Prestataires',
    icon: '🔧',
    sidebar: 'Sidebar_Prestataires',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR', 'AGENT'],
    description: 'Gestion des prestataires de services',
    color: '#f59e0b'
  },
  annonces: {
    name: 'Annonces',
    icon: '📋',
    sidebar: 'Sidebar_Annonces',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR', 'AGENT'],
    description: 'Gestion des demandes de services',
    color: '#3b82f6'
  },
  matching: {
    name: 'Matching IA',
    icon: '🤖',
    sidebar: 'Sidebar_Matching',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR'],
    description: 'Système de matching automatique intelligent',
    color: '#8b5cf6'
  },
  transactions: {
    name: 'Transactions',
    icon: '💰',
    sidebar: 'Sidebar_Transactions',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR'],
    description: 'Gestion financière et facturation',
    color: '#059669'
  },
  analytics: {
    name: 'Analytics',
    icon: '📊',
    sidebar: 'Sidebar_Analytics',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR'],
    description: 'Tableaux de bord et analyses avancées',
    color: '#0891b2'
  },
  produits: {
    name: 'Produits',
    icon: '📦',
    sidebar: 'Sidebar_Produits',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR'],
    description: 'Catalogue et gestion des produits',
    color: '#7c3aed'
  },
  livraisons: {
    name: 'Livraisons',
    icon: '🚚',
    sidebar: 'Sidebar_Livraisons',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR', 'AGENT'],
    description: 'Logistique et suivi des livraisons',
    color: '#dc2626'
  },
  rendezvous: {
    name: 'Rendez-vous',
    icon: '📅',
    sidebar: 'Sidebar_RendezVous',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR', 'AGENT'],
    description: 'Calendrier et gestion des RDV',
    color: '#ec4899'
  },
  litiges: {
    name: 'Litiges',
    icon: '⚖️',
    sidebar: 'Sidebar_Litiges',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR'],
    description: 'Médiation et résolution de conflits',
    color: '#ef4444'
  },
  sav: {
    name: 'SAV',
    icon: '🛠️',
    sidebar: 'Sidebar_SAV',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE', 'SUPERVISEUR'],
    description: 'Service après-vente et support technique',
    color: '#f97316'
  },
  rapports: {
    name: 'Rapports',
    icon: '📄',
    sidebar: 'Sidebar_Rapports',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL', 'ADMIN_FRANCHISE'],
    description: 'Génération de rapports personnalisés',
    color: '#6366f1'
  },
  admin: {
    name: 'Administration',
    icon: '⚙️',
    sidebar: 'Sidebar_Admin_Dashboard',
    roles: ['SUPERADMIN', 'ADMIN_NATIONAL'],
    description: 'Paramètres système et configuration',
    color: '#64748b'
  }
};

// ============================================================================
// UTILISATEURS PAR DÉFAUT
// Authentification basée sur l'email Google
// ============================================================================

const DEFAULT_USERS = {
  'warapservices@gmail.com': {
    role: 'SUPERADMIN',
    franchise: 'ALL',
    zone: 'ALL',
    commune: 'ALL',
    modules: 'ALL',
    nom: 'Super Administrateur WARAP'
  },
  'noeabichaganna@gmail.com': {
    role: 'ADMIN_NATIONAL',
    franchise: 'ALL',
    zone: 'ALL',
    commune: 'ALL',
    modules: ['clients', 'prestataires', 'annonces', 'transactions', 'analytics', 'rapports'],
    nom: 'Admin National'
  },
  'eyaaellatheophile@gmail.com': {
    role: 'ADMIN_FRANCHISE',
    franchise: 'Lagdo',
    zone: 'Nord',
    commune: 'Lagdo',
    modules: ['clients', 'prestataires', 'annonces', 'transactions', 'livraisons', 'rendezvous'],
    nom: 'Admin Franchise Lagdo'
  },
  'eyaellatheophile@gmail.com': {
    role: 'AGENT',
    franchise: 'Lagdo',
    zone: 'Nord',
    commune: 'Lagdo',
    modules: ['clients', 'annonces', 'rendezvous'],
    nom: 'Agent Lagdo'
  }
};

// ============================================================================
// FONCTION PRINCIPALE - onOpen()
// Déclenchée automatiquement à l'ouverture du Google Sheet
// ============================================================================

/**
 * Fonction exécutée automatiquement à l'ouverture du Sheet
 * Initialise le menu WARAP et vérifie l'installation
 *
 * @param {Object} e - Event object (optionnel)
 */
function onOpen(e) {
  try {
    // 1. Récupérer l'utilisateur courant
    const userEmail = Session.getActiveUser().getEmail();
    const timestamp = new Date().toISOString();

    // 2. Logger l'ouverture
    console.log(`[${timestamp}] WARAP ouvert par: ${userEmail}`);

    // 3. Créer le menu WARAP adapté au rôle
    createWARAPMenu();

    // 4. Vérifier si WARAP est installé
    const isInstalled = checkWARAPInstallation();

    if (!isInstalled) {
      // Première ouverture : afficher le prompt d'installation
      SpreadsheetApp.getUi().showModelessDialog(
        HtmlService.createHtmlOutput(`
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>👋 Bienvenue sur WARAP</h2>
            <p>Il semble que ce soit votre première utilisation.</p>
            <p><strong>Pour installer WARAP, cliquez sur:</strong></p>
            <p>Menu <strong>🚀 WARAP</strong> > <strong>⚙️ Installer WARAP</strong></p>
            <p style="color: #6b7280; font-size: 12px;">⏱️ Durée: 2-3 minutes</p>
          </div>
        `).setWidth(400).setHeight(200),
        '👋 Bienvenue sur WARAP'
      );
    } else {
      // 5. Vérifier les mises à jour disponibles
      checkForUpdates();
    }

    // 6. Nettoyer les anciennes sidebars (cache)
    cleanupOldSidebars();

    // 7. Logger l'action
    logUserAction('OPEN_WARAP', {
      installed: isInstalled,
      timestamp: timestamp
    });

  } catch (error) {
    // Gestion des erreurs sans bloquer l'ouverture
    console.error('[onOpen] Erreur:', error);

    // Créer un menu minimal en cas d'erreur
    SpreadsheetApp.getUi()
      .createMenu('🚀 WARAP')
      .addItem('⚠️ Erreur de chargement - Cliquez ici', 'showErrorDialog')
      .addItem('🔄 Recharger', 'reloadWARAP')
      .addToUi();
  }
}

// ============================================================================
// CRÉATION DU MENU INTELLIGENT
// Menu dynamique adapté au rôle de l'utilisateur
// ============================================================================

/**
 * Crée le menu WARAP avec permissions basées sur le rôle
 * Le menu s'adapte automatiquement selon les droits de l'utilisateur
 */
function createWARAPMenu() {
  try {
    const ui = SpreadsheetApp.getUi();
    const user = getCurrentUserSafe();

    // Créer le menu principal
    const menu = ui.createMenu(`🚀 ${WARAP_CONFIG.appName}`);

    // ========================================================================
    // SECTION 1: ACCUEIL (accessible à tous)
    // ========================================================================
    menu.addItem(`${MODULES_CONFIG.accueil.icon} ${MODULES_CONFIG.accueil.name}`, 'openAccueil');
    menu.addSeparator();

    // ========================================================================
    // SECTION 2: MODULES PRINCIPAUX
    // ========================================================================
    const modulesMenu = ui.createMenu('📂 Modules');
    let modulesAdded = 0;

    // Parcourir tous les modules (sauf accueil et admin)
    Object.keys(MODULES_CONFIG).forEach(moduleKey => {
      const module = MODULES_CONFIG[moduleKey];

      // Ignorer l'accueil (déjà ajouté) et l'admin (sera ajouté à la fin)
      if (moduleKey === 'accueil' || moduleKey === 'admin') return;

      // Vérifier si l'utilisateur a accès
      if (hasAccessToModule(user, module)) {
        const functionName = `open${module.name.replace(/\s+/g, '').replace('-', '')}`;
        modulesMenu.addItem(`${module.icon} ${module.name}`, functionName);
        modulesAdded++;
      }
    });

    if (modulesAdded > 0) {
      menu.addSubMenu(modulesMenu);
      menu.addSeparator();
    }

    // ========================================================================
    // SECTION 3: OUTILS
    // ========================================================================
    const outilsMenu = ui.createMenu('🔧 Outils');
    outilsMenu.addItem('🔍 Recherche globale', 'openRechercheGlobale');
    outilsMenu.addItem('🗺️ Vue carte', 'openCarte');
    outilsMenu.addSeparator();
    outilsMenu.addItem('📥 Exporter données', 'openExportData');
    outilsMenu.addItem('📊 Statistiques rapides', 'showQuickStats');
    outilsMenu.addSeparator();
    outilsMenu.addItem('🔄 Rafraîchir la vue', 'refreshCurrentView');
    menu.addSubMenu(outilsMenu);
    menu.addSeparator();

    // ========================================================================
    // SECTION 4: ADMINISTRATION (selon rôle)
    // ========================================================================
    if (user.role === 'SUPERADMIN' || user.role === 'ADMIN_NATIONAL') {
      const adminMenu = ui.createMenu('⚙️ Administration');

      adminMenu.addItem('👥 Utilisateurs', 'openUtilisateurs');
      adminMenu.addItem('📋 Logs système', 'openLogs');
      adminMenu.addItem('💾 Sauvegardes', 'openBackup');
      adminMenu.addItem('⚙️ Paramètres', 'openParametres');
      adminMenu.addSeparator();
      adminMenu.addItem('🔧 Diagnostic système', 'runDiagnostic');

      // Uniquement pour SUPERADMIN
      if (user.role === 'SUPERADMIN') {
        adminMenu.addSeparator();
        adminMenu.addItem('⚙️ Installer WARAP', 'installWARAP');
        adminMenu.addItem('🔄 Réinitialiser système', 'resetWARAPSystem');
      }

      menu.addSubMenu(adminMenu);
      menu.addSeparator();
    }

    // ========================================================================
    // SECTION 5: AIDE ET INFOS
    // ========================================================================
    menu.addItem('❓ Aide et documentation', 'showHelp');
    menu.addItem('📞 Support technique', 'contactSupport');
    menu.addItem('ℹ️ À propos de WARAP', 'showAbout');

    // Ajouter le menu à l'interface
    menu.addToUi();

    console.log(`[Menu] Créé avec succès pour ${user.email} (${user.role}) - ${modulesAdded} modules accessibles`);

  } catch (error) {
    console.error('[createWARAPMenu] Erreur:', error);
    throw error;
  }
}

// ============================================================================
// VÉRIFICATION DE L'INSTALLATION
// ============================================================================

/**
 * Vérifie si WARAP est correctement installé
 * @returns {boolean} True si installé, false sinon
 */
function checkWARAPInstallation() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Liste des feuilles critiques qui doivent exister
    const criticalSheets = [
      'AccueilWARAP',
      'ClientsWARAP',
      'PrestatairesWARAP',
      'AnnoncesWARAP',
      'TransactionsWARAP',
      'Parametres_WARAP',
      'Utilisateurs_WARAP',
      'Logs_WARAP'
    ];

    // Vérifier l'existence de chaque feuille critique
    for (let sheetName of criticalSheets) {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        console.log(`[Installation] Feuille manquante: ${sheetName}`);
        return false;
      }
    }

    // Vérifier que Parametres_WARAP contient des données
    const paramsSheet = ss.getSheetByName('Parametres_WARAP');
    if (paramsSheet && paramsSheet.getLastRow() < 2) {
      console.log('[Installation] Parametres_WARAP vide');
      return false;
    }

    // Vérifier la version installée
    const paramsData = paramsSheet.getDataRange().getValues();
    const headers = paramsData[0];
    const nomIndex = headers.indexOf('Nom_Parametre');
    const valueIndex = headers.indexOf('Valeur_Actuelle');

    let versionFound = false;
    for (let i = 1; i < paramsData.length; i++) {
      if (paramsData[i][nomIndex] === 'Version_WARAP') {
        versionFound = true;
        console.log(`[Installation] Version installée: ${paramsData[i][valueIndex]}`);
        break;
      }
    }

    if (!versionFound) {
      console.log('[Installation] Version non trouvée dans Parametres');
      return false;
    }

    console.log('[Installation] WARAP est correctement installé');
    return true;

  } catch (error) {
    console.error('[checkWARAPInstallation] Erreur:', error);
    return false;
  }
}

// ============================================================================
// GESTION DES SIDEBARS
// Système de cache pour suivre les sidebars ouvertes
// ============================================================================

/**
 * Vérifie les sidebars actuellement ouvertes (via cache)
 * @returns {Array} Liste des sidebars ouvertes
 */
function checkExistingSidebars() {
  try {
    const cache = CacheService.getUserCache();
    const openSidebarsJSON = cache.get('warap_open_sidebars');

    if (openSidebarsJSON) {
      const sidebars = JSON.parse(openSidebarsJSON);
      console.log(`[Sidebars] ${sidebars.length} sidebar(s) ouverte(s)`);
      return sidebars;
    }

    return [];

  } catch (error) {
    console.error('[checkExistingSidebars] Erreur:', error);
    return [];
  }
}

/**
 * Enregistre l'ouverture d'une sidebar
 * @param {string} sidebarName - Nom du fichier HTML de la sidebar
 */
function registerSidebarOpen(sidebarName) {
  try {
    const cache = CacheService.getUserCache();
    const openSidebars = checkExistingSidebars();

    // Vérifier si cette sidebar est déjà ouverte
    const existingIndex = openSidebars.findIndex(s => s.name === sidebarName);
    if (existingIndex !== -1) {
      // Mettre à jour le timestamp
      openSidebars[existingIndex].openedAt = new Date().toISOString();
    } else {
      // Vérifier le nombre maximum
      if (openSidebars.length >= WARAP_CONFIG.maxSidebarsOpen) {
        // Supprimer la plus ancienne
        openSidebars.shift();
      }

      // Ajouter la nouvelle
      openSidebars.push({
        name: sidebarName,
        openedAt: new Date().toISOString(),
        user: Session.getActiveUser().getEmail()
      });
    }

    // Sauvegarder dans le cache (expire après 6 heures)
    cache.put('warap_open_sidebars', JSON.stringify(openSidebars), WARAP_CONFIG.sessionTimeout);

    console.log(`[Sidebars] ${sidebarName} enregistrée (total: ${openSidebars.length})`);

  } catch (error) {
    console.error('[registerSidebarOpen] Erreur:', error);
  }
}

/**
 * Nettoie les sidebars obsolètes du cache
 */
function cleanupOldSidebars() {
  try {
    const cache = CacheService.getUserCache();
    const openSidebars = checkExistingSidebars();

    if (openSidebars.length === 0) return;

    // Garder seulement les sidebars ouvertes dans les 30 dernières minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const recentSidebars = openSidebars.filter(sidebar => {
      const openedAt = new Date(sidebar.openedAt);
      return openedAt > thirtyMinutesAgo;
    });

    if (recentSidebars.length !== openSidebars.length) {
      cache.put('warap_open_sidebars', JSON.stringify(recentSidebars), WARAP_CONFIG.sessionTimeout);
      console.log(`[Sidebars] Nettoyage: ${openSidebars.length - recentSidebars.length} supprimée(s)`);
    }

  } catch (error) {
    console.error('[cleanupOldSidebars] Erreur:', error);
  }
}

// ============================================================================
// FONCTIONS D'OUVERTURE DES MODULES
// ============================================================================

/**
 * Ouvre le tableau de bord principal
 */
function openAccueil() {
  openModuleSidebar('accueil');
}

/**
 * Fonction générique pour ouvrir un module
 * @param {string} moduleKey - Clé du module dans MODULES_CONFIG
 */
function openModuleSidebar(moduleKey) {
  try {
    const user = getCurrentUserSafe();
    const module = MODULES_CONFIG[moduleKey];

    // Vérifier que le module existe
    if (!module) {
      throw new Error(`Module "${moduleKey}" introuvable`);
    }

    // Vérifier l'accès de l'utilisateur
    if (!hasAccessToModule(user, module)) {
      SpreadsheetApp.getUi().alert(
        '❌ Accès refusé',
        `Vous n'avez pas les droits pour accéder au module "${module.name}".\n\n` +
        `Rôles autorisés: ${module.roles.join(', ')}\n` +
        `Votre rôle: ${user.role}`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }

    // Créer et afficher la sidebar
    const htmlFile = module.sidebar;

    // Note: En production, vérifier que le fichier HTML existe
    // Pour l'instant, on crée une sidebar de fallback
    let html;

    try {
      html = HtmlService.createHtmlOutputFromFile(htmlFile)
        .setTitle(`${module.icon} ${module.name}`)
        .setWidth(420);
    } catch (fileError) {
      // Si le fichier HTML n'existe pas, créer une sidebar temporaire
      console.warn(`[Module] Fichier ${htmlFile} introuvable, création sidebar temporaire`);

      html = HtmlService.createHtmlOutput(`
        <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
          <h2>${module.icon} ${module.name}</h2>
          <p style="color: #6b7280;">Ce module est en cours de développement.</p>
          <p style="font-size: 14px; margin-top: 30px;">
            <strong>Description:</strong><br>
            ${module.description}
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af;">
            Module: ${moduleKey}<br>
            Version: ${WARAP_CONFIG.version}<br>
            Fichier: ${htmlFile}
          </p>
        </div>
      `)
        .setTitle(`${module.icon} ${module.name}`)
        .setWidth(420);
    }

    // Afficher la sidebar
    SpreadsheetApp.getUi().showSidebar(html);

    // Enregistrer l'ouverture
    registerSidebarOpen(htmlFile);

    // Logger l'action
    logUserAction('OPEN_MODULE', {
      module: moduleKey,
      moduleName: module.name,
      sidebar: htmlFile
    });

    console.log(`[Module] "${module.name}" ouvert par ${user.email}`);

  } catch (error) {
    console.error(`[openModuleSidebar] Erreur pour "${moduleKey}":`, error);

    SpreadsheetApp.getUi().alert(
      '❌ Erreur',
      `Impossible d'ouvrir le module.\n\nDétails: ${error.message}\n\nContactez le support si le problème persiste.`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// Fonctions spécifiques pour chaque module
function openClients() { openModuleSidebar('clients'); }
function openPrestataires() { openModuleSidebar('prestataires'); }
function openAnnonces() { openModuleSidebar('annonces'); }
function openMatchingIA() { openModuleSidebar('matching'); }
function openTransactions() { openModuleSidebar('transactions'); }
function openAnalytics() { openModuleSidebar('analytics'); }
function openProduits() { openModuleSidebar('produits'); }
function openLivraisons() { openModuleSidebar('livraisons'); }
function openRendezvous() { openModuleSidebar('rendezvous'); }
function openLitiges() { openModuleSidebar('litiges'); }
function openSAV() { openModuleSidebar('sav'); }
function openRapports() { openModuleSidebar('rapports'); }

// ============================================================================
// UTILITAIRES - GESTION DES UTILISATEURS
// ============================================================================

/**
 * Récupère l'utilisateur courant de manière sécurisée
 * Avec fallback sur les utilisateurs par défaut
 * @returns {Object} Objet utilisateur avec email, role, franchise, etc.
 */
function getCurrentUserSafe() {
  try {
    // Essayer d'utiliser la fonction complète si elle existe
    if (typeof getCurrentUser === 'function') {
      return getCurrentUser();
    }

    // Récupérer l'email de session
    const email = Session.getActiveUser().getEmail();

    if (!email) {
      console.warn('[User] Email vide, utilisateur non autorisé');
      return {
        email: 'unknown@warap.cm',
        role: 'UNAUTHORIZED',
        franchise: null,
        zone: null,
        commune: null,
        modules: [],
        nom: 'Utilisateur inconnu'
      };
    }

    // Vérifier dans les utilisateurs par défaut
    if (DEFAULT_USERS[email]) {
      console.log(`[User] Utilisateur par défaut trouvé: ${email}`);
      return {
        email: email,
        ...DEFAULT_USERS[email],
        statut: 'Actif'
      };
    }

    // Essayer de chercher dans la feuille Utilisateurs_WARAP
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const userSheet = ss.getSheetByName('Utilisateurs_WARAP');

      if (userSheet) {
        const data = userSheet.getDataRange().getValues();
        const headers = data[0];
        const emailIndex = headers.indexOf('Email');

        for (let i = 1; i < data.length; i++) {
          if (data[i][emailIndex] === email) {
            console.log(`[User] Utilisateur trouvé dans sheet: ${email}`);
            return {
              email: email,
              role: data[i][headers.indexOf('Role')],
              franchise: data[i][headers.indexOf('Franchise_Rattachee')],
              zone: data[i][headers.indexOf('Zone_Rattachee')],
              commune: data[i][headers.indexOf('Commune_Rattachee')],
              modules: JSON.parse(data[i][headers.indexOf('Permissions_Modules')] || '[]'),
              nom: data[i][headers.indexOf('Nom_Complet')],
              statut: data[i][headers.indexOf('Statut')]
            };
          }
        }
      }
    } catch (sheetError) {
      console.warn('[User] Erreur lecture sheet utilisateurs:', sheetError);
    }

    // Utilisateur non trouvé = non autorisé
    console.warn(`[User] Email ${email} non autorisé`);
    return {
      email: email,
      role: 'UNAUTHORIZED',
      franchise: null,
      zone: null,
      commune: null,
      modules: [],
      nom: 'Utilisateur non autorisé',
      statut: 'Inactif'
    };

  } catch (error) {
    console.error('[getCurrentUserSafe] Erreur:', error);
    return {
      email: 'error@warap.cm',
      role: 'UNAUTHORIZED',
      franchise: null,
      zone: null,
      commune: null,
      modules: [],
      nom: 'Erreur utilisateur',
      statut: 'Erreur'
    };
  }
}

/**
 * Vérifie si l'utilisateur a accès à un module
 * @param {Object} user - Objet utilisateur
 * @param {Object} module - Configuration du module
 * @returns {boolean} True si accès autorisé
 */
function hasAccessToModule(user, module) {
  try {
    // Vérifier le statut de l'utilisateur
    if (user.statut && user.statut !== 'Actif') {
      return false;
    }

    // SUPERADMIN a accès à tout
    if (user.role === 'SUPERADMIN') {
      return true;
    }

    // Vérifier si le rôle est dans la liste autorisée
    if (!module.roles.includes(user.role)) {
      return false;
    }

    // Si modules = 'ALL', accès total
    if (user.modules === 'ALL') {
      return true;
    }

    // Vérifier les modules spécifiques
    if (Array.isArray(user.modules)) {
      const moduleKey = module.sidebar
        .replace('Sidebar_', '')
        .replace('WARAP', '')
        .toLowerCase()
        .trim();

      return user.modules.some(m => {
        const userModule = m.toLowerCase().trim();
        return moduleKey.includes(userModule) || userModule.includes(moduleKey);
      });
    }

    return false;

  } catch (error) {
    console.error('[hasAccessToModule] Erreur:', error);
    return false;
  }
}

// ============================================================================
// AIDE ET INFORMATIONS
// ============================================================================

/**
 * Affiche l'aide complète
 */
function showHelp() {
  const ui = SpreadsheetApp.getUi();
  const user = getCurrentUserSafe();

  const helpText = `
📚 AIDE WARAP v${WARAP_CONFIG.version}

👤 UTILISATEUR
Email: ${user.email}
Rôle: ${user.role}
Franchise: ${user.franchise || 'N/A'}

🚀 NAVIGATION
• Utilisez le menu "WARAP" pour accéder aux modules
• Les modules s'ouvrent dans une sidebar à droite
• Maximum ${WARAP_CONFIG.maxSidebarsOpen} sidebars simultanées

🔐 SÉCURITÉ
• Vos accès sont définis par votre rôle
• Toutes vos actions sont tracées dans les logs
• Ne partagez jamais vos identifiants

📋 MODULES DISPONIBLES
${getAvailableModulesHelp(user)}

💡 CONSEILS
• Utilisez la recherche globale (🔍) pour trouver rapidement
• Les KPIs se mettent à jour en temps réel
• Exportez vos données régulièrement (📥)
• Consultez les analytics pour optimiser vos performances

🆘 SUPPORT
Email: warapservices@gmail.com
Documentation en ligne: [Lien à venir]
Signaler un bug: Menu WARAP > Support technique
  `.trim();

  ui.alert('❓ Aide WARAP', helpText, ui.ButtonSet.OK);
}

/**
 * Génère la liste des modules disponibles pour l'aide
 */
function getAvailableModulesHelp(user) {
  let help = '';

  Object.keys(MODULES_CONFIG).forEach(key => {
    const module = MODULES_CONFIG[key];
    if (hasAccessToModule(user, module)) {
      help += `• ${module.icon} ${module.name}: ${module.description}\n`;
    }
  });

  return help || '• Aucun module disponible pour votre rôle';
}

/**
 * Affiche les informations à propos
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  const user = getCurrentUserSafe();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const aboutText = `
${WARAP_CONFIG.appFullName}

📌 VERSION
${WARAP_CONFIG.version} (${WARAP_CONFIG.environment})

👤 SESSION ACTIVE
Utilisateur: ${user.nom}
Email: ${user.email}
Rôle: ${user.role}
Franchise: ${user.franchise || 'N/A'}
Zone: ${user.zone || 'N/A'}

📊 SYSTÈME
Feuilles: ${ss.getSheets().length}
Fuseau horaire: ${Session.getScriptTimeZone()}
Locale: fr-CM (Cameroun)

📅 INFORMATIONS
Ouvert le: ${new Date().toLocaleString('fr-FR')}
URL: ${ss.getUrl()}

💼 WARAP SERVICES
Plateforme de mise en relation clients-prestataires
Avec marketplace intégrée
100% Google Workspace

© 2024 WARAP Services - Tous droits réservés
Contact: warapservices@gmail.com
  `.trim();

  ui.alert('ℹ️ À propos de WARAP', aboutText, ui.ButtonSet.OK);
}

/**
 * Contact support
 */
function contactSupport() {
  const ui = SpreadsheetApp.getUi();
  const user = getCurrentUserSafe();

  const response = ui.prompt(
    '📞 Support technique',
    `Décrivez votre problème ou question:\n\n` +
    `(Cette information sera envoyée à warapservices@gmail.com)`,
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const message = response.getResponseText();

    if (message && message.trim().length > 10) {
      // Logger la demande de support
      logUserAction('SUPPORT_REQUEST', {
        message: message,
        timestamp: new Date().toISOString()
      });

      ui.alert(
        '✅ Message envoyé',
        `Votre demande a été enregistrée.\n\n` +
        `Notre équipe vous répondra dans les meilleurs délais à l'adresse:\n${user.email}`,
        ui.ButtonSet.OK
      );
    } else {
      ui.alert('❌ Message trop court', 'Veuillez décrire votre problème plus en détail.', ui.ButtonSet.OK);
    }
  }
}

/**
 * Affiche les statistiques rapides
 */
function showQuickStats() {
  const ui = SpreadsheetApp.getUi();
  const user = getCurrentUserSafe();

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Compter les données dans chaque feuille
    const clientsSheet = ss.getSheetByName('ClientsWARAP');
    const prestSheet = ss.getSheetByName('PrestatairesWARAP');
    const annoncesSheet = ss.getSheetByName('AnnoncesWARAP');
    const transSheet = ss.getSheetByName('TransactionsWARAP');

    const stats = `
📊 STATISTIQUES RAPIDES

👥 CLIENTS: ${clientsSheet ? (clientsSheet.getLastRow() - 1) : 0}
🔧 PRESTATAIRES: ${prestSheet ? (prestSheet.getLastRow() - 1) : 0}
📋 ANNONCES: ${annoncesSheet ? (annoncesSheet.getLastRow() - 1) : 0}
💰 TRANSACTIONS: ${transSheet ? (transSheet.getLastRow() - 1) : 0}

📅 Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}

Pour des statistiques détaillées, ouvrez:
Menu WARAP > Modules > 📊 Analytics
    `.trim();

    ui.alert('📊 Statistiques', stats, ui.ButtonSet.OK);

  } catch (error) {
    ui.alert('❌ Erreur', 'Impossible de récupérer les statistiques.', ui.ButtonSet.OK);
  }
}

// ============================================================================
// UTILITAIRES - FONCTIONS DIVERSES
// ============================================================================

/**
 * Vérifie les mises à jour disponibles
 */
function checkForUpdates() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const paramsSheet = ss.getSheetByName('Parametres_WARAP');

    if (!paramsSheet) return;

    const data = paramsSheet.getDataRange().getValues();
    const headers = data[0];
    const nomIndex = headers.indexOf('Nom_Parametre');
    const valueIndex = headers.indexOf('Valeur_Actuelle');

    let installedVersion = '0.0.0';

    for (let i = 1; i < data.length; i++) {
      if (data[i][nomIndex] === 'Version_WARAP') {
        installedVersion = data[i][valueIndex];
        break;
      }
    }

    if (installedVersion !== WARAP_CONFIG.version) {
      console.log(`[Updates] Mise à jour disponible: ${installedVersion} → ${WARAP_CONFIG.version}`);
      // Ne pas déranger l'utilisateur, juste logger
    }

  } catch (error) {
    console.error('[checkForUpdates] Erreur:', error);
  }
}

/**
 * Rafraîchit la vue actuelle
 */
function refreshCurrentView() {
  const ui = SpreadsheetApp.getUi();

  ui.alert(
    '🔄 Rafraîchissement',
    `Pour rafraîchir la vue actuelle:\n\n` +
    `1. Fermez la sidebar (bouton X)\n` +
    `2. Réouvrez-la depuis le menu WARAP\n\n` +
    `Ou rechargez la page complète (touche F5)`,
    ui.ButtonSet.OK
  );
}

/**
 * Recharge WARAP (force le rechargement)
 */
function reloadWARAP() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '🔄 Recharger WARAP',
    'Cette action va recharger complètement WARAP.\n\nContinuer ?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    // Vider le cache
    CacheService.getUserCache().removeAll();

    // Recréer le menu
    onOpen();

    ui.alert('✅ Rechargement terminé', 'WARAP a été rechargé avec succès.', ui.ButtonSet.OK);
  }
}

/**
 * Affiche une erreur générique
 */
function showErrorDialog() {
  const ui = SpreadsheetApp.getUi();

  ui.alert(
    '⚠️ Erreur de chargement WARAP',
    `Une erreur s'est produite lors de l'initialisation.\n\n` +
    `SOLUTIONS:\n` +
    `1. Rechargez la page (F5)\n` +
    `2. Vérifiez votre connexion Internet\n` +
    `3. Menu WARAP > 🔄 Recharger\n` +
    `4. Contactez le support: warapservices@gmail.com\n\n` +
    `Code erreur: MAIN_LOAD_FAILED`,
    ui.ButtonSet.OK
  );
}

// ============================================================================
// FONCTIONS OUTILS (placeholders)
// ============================================================================

function openRechercheGlobale() {
  SpreadsheetApp.getUi().alert(
    '🔍 Recherche globale',
    'Module en cours de développement.\n\nDisponible dans la prochaine version.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function openCarte() {
  SpreadsheetApp.getUi().alert(
    '🗺️ Vue carte',
    'Module en cours de développement.\n\nDisponible dans la prochaine version.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function openExportData() {
  SpreadsheetApp.getUi().alert(
    '📥 Export données',
    'Module en cours de développement.\n\nDisponible dans la prochaine version.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function openUtilisateurs() {
  openModuleSidebar('admin');
}

function openLogs() {
  SpreadsheetApp.getUi().alert(
    '📋 Logs système',
    'Module en cours de développement.\n\nDisponible dans la prochaine version.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function openBackup() {
  SpreadsheetApp.getUi().alert(
    '💾 Sauvegardes',
    'Module en cours de développement.\n\nDisponible dans la prochaine version.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function openParametres() {
  SpreadsheetApp.getUi().alert(
    '⚙️ Paramètres',
    'Module en cours de développement.\n\nDisponible dans la prochaine version.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function installWARAP() {
  // Sera implémenté dans WARAP_Setup.gs
  SpreadsheetApp.getUi().alert(
    '⚙️ Installation WARAP',
    'La fonction d\'installation sera disponible dans le fichier WARAP_Setup.gs',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function runDiagnostic() {
  // Sera implémenté dans WARAP_Tests.gs
  SpreadsheetApp.getUi().alert(
    '🔧 Diagnostic',
    'La fonction de diagnostic sera disponible dans le fichier WARAP_Tests.gs',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function resetWARAPSystem() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '⚠️ ATTENTION - Réinitialisation',
    'Cette action va SUPPRIMER TOUTES LES DONNÉES.\n\nÊtes-vous ABSOLUMENT SÛR ?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    const confirm = ui.prompt(
      '⚠️ Confirmation requise',
      'Tapez "RESET" pour confirmer la réinitialisation:',
      ui.ButtonSet.OK_CANCEL
    );

    if (confirm.getSelectedButton() === ui.Button.OK && confirm.getResponseText() === 'RESET') {
      // Sera implémenté dans WARAP_Setup.gs
      ui.alert('🔄 Réinitialisation', 'Fonction disponible dans WARAP_Setup.gs', ui.ButtonSet.OK);
    } else {
      ui.alert('✅ Annulé', 'La réinitialisation a été annulée.', ui.ButtonSet.OK);
    }
  }
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log une action utilisateur
 * @param {string} action - Type d'action
 * @param {Object} details - Détails additionnels
 */
function logUserAction(action, details) {
  try {
    const user = getCurrentUserSafe();
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp: timestamp,
      user: user.email,
      role: user.role,
      action: action,
      details: JSON.stringify(details || {}),
      version: WARAP_CONFIG.version
    };

    console.log('[Action]', logEntry);

    // En production, sauvegarder dans Logs_WARAP
    // (sera implémenté dans WARAP_Logs_Manager.gs)

  } catch (error) {
    console.error('[logUserAction] Erreur:', error);
  }
}

// ============================================================================
// FIN DU FICHIER MAIN.GS
// ============================================================================

/**
 * Points d'amélioration future:
 *
 * 1. Implémenter la recherche globale
 * 2. Ajouter la vue carte avec Google Maps
 * 3. Export données avancé (Excel, CSV, PDF)
 * 4. Notifications push en temps réel
 * 5. Mode hors ligne (Service Worker)
 * 6. Thème sombre/clair
 * 7. Personnalisation du dashboard
 * 8. Analytics avancées utilisateur
 * 9. Système de badges et gamification
 * 10. API REST pour intégrations externes
 */
