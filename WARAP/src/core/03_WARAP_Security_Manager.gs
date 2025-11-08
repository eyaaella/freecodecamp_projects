/**
 * ============================================================================
 * WARAP_SECURITY_MANAGER.GS - Gestion sécurité multi-niveaux
 * ============================================================================
 *
 * Système de sécurité basé sur l'authentification email Google
 * 5 niveaux hiérarchiques de rôles avec permissions granulaires
 *
 * Rôles disponibles :
 * - SUPERADMIN : Accès total
 * - ADMIN_NATIONAL : Toutes les franchises
 * - ADMIN_FRANCHISE : Une franchise spécifique
 * - SUPERVISEUR : Une zone géographique
 * - AGENT : Une commune
 *
 * @version 1.0.0
 * @author WARAP Team
 * ============================================================================
 */

/**
 * Définition des rôles
 */
const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN_NATIONAL: 'ADMIN_NATIONAL',
  ADMIN_FRANCHISE: 'ADMIN_FRANCHISE',
  SUPERVISEUR: 'SUPERVISEUR',
  AGENT: 'AGENT'
};

/**
 * Hiérarchie des rôles (pour comparaison)
 */
const ROLE_HIERARCHY = {
  'SUPERADMIN': 5,
  'ADMIN_NATIONAL': 4,
  'ADMIN_FRANCHISE': 3,
  'SUPERVISEUR': 2,
  'AGENT': 1
};

/**
 * Utilisateurs par défaut (hardcodés pour démarrage)
 * Ces utilisateurs sont toujours actifs même si la feuille Utilisateurs n'existe pas encore
 */
const DEFAULT_USERS = {
  'warapservices@gmail.com': {
    role: USER_ROLES.SUPERADMIN,
    franchise: 'ALL',
    zone: 'ALL',
    commune: 'ALL',
    modules: 'ALL',
    nom: 'WARAP Services',
    statut: 'Actif'
  },
  'noeabichaganna@gmail.com': {
    role: USER_ROLES.ADMIN_NATIONAL,
    franchise: 'ALL',
    zone: 'ALL',
    commune: 'ALL',
    modules: ['clients', 'prestataires', 'annonces', 'transactions', 'analytics', 'rapports', 'produits', 'livraisons'],
    nom: 'Noe Abichaga NNA',
    statut: 'Actif'
  },
  'eyaaellatheophile@gmail.com': {
    role: USER_ROLES.ADMIN_FRANCHISE,
    franchise: 'Lagdo',
    zone: 'Nord',
    commune: 'Lagdo',
    modules: ['clients', 'prestataires', 'annonces', 'transactions', 'livraisons', 'rdv', 'produits'],
    nom: 'Eyaa Ella Théophile',
    statut: 'Actif'
  },
  'eyaellatheophile@gmail.com': {
    role: USER_ROLES.AGENT,
    franchise: 'Lagdo',
    zone: 'Nord',
    commune: 'Lagdo',
    modules: ['clients', 'annonces', 'rdv'],
    nom: 'Eya Ella Théophile',
    statut: 'Actif'
  }
};

/**
 * Modules disponibles dans la plateforme
 */
const AVAILABLE_MODULES = [
  'clients',
  'prestataires',
  'annonces',
  'matching',
  'transactions',
  'analytics',
  'produits',
  'commandes',
  'livraisons',
  'rdv',
  'litiges',
  'sav',
  'fournisseurs',
  'utilisateurs',
  'logs',
  'backup',
  'parametres',
  'rapports',
  'notifications',
  'evaluations',
  'stock',
  'horaires',
  'admin'
];

/**
 * ============================================================================
 * FONCTIONS PRINCIPALES D'AUTHENTIFICATION
 * ============================================================================
 */

/**
 * Récupère l'utilisateur connecté avec ses permissions
 *
 * @return {Object} Objet utilisateur avec {email, role, franchise, zone, commune, modules, statut}
 *
 * @example
 * const user = getCurrentUser();
 * console.log(user.email); // "noeabichaganna@gmail.com"
 * console.log(user.role); // "ADMIN_NATIONAL"
 */
function getCurrentUser() {
  try {
    // Récupérer l'email de l'utilisateur connecté
    const email = Session.getActiveUser().getEmail();

    if (!email) {
      throw new Error('❌ Impossible de récupérer l\'email de l\'utilisateur. Vérifiez les permissions.');
    }

    // Vérifier d'abord dans la feuille Utilisateurs_WARAP
    const userFromSheet = getUserFromSheet(email);
    if (userFromSheet) {
      Logger.log(`✅ Utilisateur trouvé dans feuille: ${email}`);
      return userFromSheet;
    }

    // Sinon vérifier dans les utilisateurs par défaut
    if (DEFAULT_USERS[email]) {
      Logger.log(`✅ Utilisateur par défaut: ${email}`);
      return { email, ...DEFAULT_USERS[email] };
    }

    // Utilisateur non autorisé
    Logger.log(`⚠️ Utilisateur non autorisé: ${email}`);
    return {
      email,
      role: 'UNAUTHORIZED',
      franchise: null,
      zone: null,
      commune: null,
      modules: [],
      nom: 'Utilisateur non autorisé',
      statut: 'Non autorisé'
    };

  } catch (error) {
    Logger.log(`❌ Erreur getCurrentUser: ${error}`);
    throw new Error(`Erreur d'authentification: ${error.message}`);
  }
}

/**
 * Récupère un utilisateur depuis la feuille Utilisateurs_WARAP
 *
 * @param {string} email - Email de l'utilisateur
 * @return {Object|null} Objet utilisateur ou null si non trouvé
 */
function getUserFromSheet(email) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Utilisateurs_WARAP');

    if (!sheet) {
      Logger.log('⚠️ Feuille Utilisateurs_WARAP non trouvée');
      return null;
    }

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      Logger.log('⚠️ Feuille Utilisateurs_WARAP vide');
      return null;
    }

    const headers = data[0];
    const emailIndex = headers.indexOf('Email');
    const roleIndex = headers.indexOf('Role');
    const franchiseIndex = headers.indexOf('Franchise_Rattachee');
    const zoneIndex = headers.indexOf('Zone_Rattachee');
    const communeIndex = headers.indexOf('Commune_Rattachee');
    const modulesIndex = headers.indexOf('Permissions_Modules');
    const statutIndex = headers.indexOf('Statut');
    const nomIndex = headers.indexOf('Nom_Complet');

    // Chercher l'utilisateur
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailIndex] === email) {
        // Parser les modules (format JSON)
        let modules = [];
        try {
          const modulesStr = data[i][modulesIndex];
          modules = modulesStr === 'ALL' ? 'ALL' : JSON.parse(modulesStr || '[]');
        } catch (e) {
          Logger.log(`⚠️ Erreur parsing modules pour ${email}: ${e}`);
          modules = [];
        }

        return {
          email: email,
          role: data[i][roleIndex] || 'AGENT',
          franchise: data[i][franchiseIndex] || null,
          zone: data[i][zoneIndex] || null,
          commune: data[i][communeIndex] || null,
          modules: modules,
          statut: data[i][statutIndex] || 'Actif',
          nom: data[i][nomIndex] || email
        };
      }
    }

    return null;

  } catch (error) {
    Logger.log(`❌ Erreur getUserFromSheet: ${error}`);
    return null;
  }
}

/**
 * ============================================================================
 * VÉRIFICATIONS DE PERMISSIONS
 * ============================================================================
 */

/**
 * Vérifie si l'utilisateur a un rôle suffisant
 *
 * @param {string} requiredRole - Rôle minimum requis
 * @return {boolean} true si l'utilisateur a le rôle requis ou supérieur
 *
 * @example
 * if (hasAccess('ADMIN_NATIONAL')) {
 *   // Code réservé aux admins nationaux et superadmins
 * }
 */
function hasAccess(requiredRole) {
  const user = getCurrentUser();

  // Utilisateur non autorisé
  if (user.role === 'UNAUTHORIZED') {
    return false;
  }

  // Utilisateur inactif ou suspendu
  if (user.statut === 'Inactif' || user.statut === 'Suspendu') {
    return false;
  }

  // Comparer les niveaux hiérarchiques
  const userLevel = ROLE_HIERARCHY[user.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Vérifie si l'utilisateur a accès à un module spécifique
 *
 * @param {string} moduleName - Nom du module
 * @return {boolean} true si l'utilisateur a accès au module
 *
 * @example
 * if (hasModuleAccess('analytics')) {
 *   // Code du module analytics
 * }
 */
function hasModuleAccess(moduleName) {
  const user = getCurrentUser();

  // Superadmin a accès à tout
  if (user.role === USER_ROLES.SUPERADMIN) {
    return true;
  }

  // Vérifier si modules = 'ALL'
  if (user.modules === 'ALL') {
    return true;
  }

  // Vérifier si le module est dans la liste
  if (Array.isArray(user.modules) && user.modules.includes(moduleName)) {
    return true;
  }

  return false;
}

/**
 * Filtre les données selon le scope géographique de l'utilisateur
 *
 * @param {Array} data - Tableau d'objets à filtrer
 * @param {string} locationField - Nom du champ de localisation ('Commune', 'Zone', 'Franchise')
 * @return {Array} Données filtrées
 *
 * @example
 * const allClients = getClientsData();
 * const myClients = filterDataByUserScope(allClients, 'Commune');
 */
function filterDataByUserScope(data, locationField = 'Commune') {
  const user = getCurrentUser();

  // SUPERADMIN et ADMIN_NATIONAL voient tout
  if (user.role === USER_ROLES.SUPERADMIN || user.role === USER_ROLES.ADMIN_NATIONAL) {
    return data;
  }

  // Filtrage selon le rôle
  return data.filter(row => {
    // ADMIN_FRANCHISE : filtrer par franchise
    if (user.role === USER_ROLES.ADMIN_FRANCHISE) {
      return row.Franchise_Rattachee === user.franchise || row.Franchise === user.franchise;
    }

    // SUPERVISEUR : filtrer par zone
    if (user.role === USER_ROLES.SUPERVISEUR) {
      return row.Zone_Geographique === user.zone || row.Zone === user.zone;
    }

    // AGENT : filtrer par commune
    if (user.role === USER_ROLES.AGENT) {
      return row[locationField] === user.commune;
    }

    return false;
  });
}

/**
 * Vérifie les permissions ET lève une erreur si insuffisantes
 * Utilisé dans les fonctions qui nécessitent une authentification obligatoire
 *
 * @param {string} requiredRole - Rôle minimum requis
 * @param {string} moduleName - Nom du module
 * @return {Object} Objet utilisateur si autorisé
 * @throws {Error} Si permissions insuffisantes
 *
 * @example
 * function deleteClient(clientId) {
 *   const user = requireAuth('ADMIN_FRANCHISE', 'clients');
 *   // Code de suppression...
 * }
 */
function requireAuth(requiredRole, moduleName) {
  const user = getCurrentUser();

  // Vérifier si utilisateur est autorisé
  if (user.role === 'UNAUTHORIZED') {
    logSecurityEvent('ACCES_REFUSE', {
      action: `Tentative accès ${moduleName}`,
      success: false,
      error: 'Utilisateur non autorisé'
    });

    throw new Error(`❌ Accès refusé.\n\nVotre email (${user.email}) n'est pas autorisé à accéder à WARAP.\n\nContactez l'administrateur: warapservices@gmail.com`);
  }

  // Vérifier statut utilisateur
  if (user.statut === 'Inactif') {
    throw new Error(`❌ Accès refusé.\n\nVotre compte est inactif.\n\nContactez l'administrateur.`);
  }

  if (user.statut === 'Suspendu') {
    throw new Error(`❌ Accès refusé.\n\nVotre compte a été suspendu.\n\nContactez l'administrateur.`);
  }

  // Vérifier le rôle
  if (!hasAccess(requiredRole)) {
    logSecurityEvent('ACCES_REFUSE', {
      action: `Tentative accès ${moduleName}`,
      success: false,
      error: `Rôle insuffisant (requis: ${requiredRole}, actuel: ${user.role})`
    });

    throw new Error(`❌ Accès refusé.\n\nVous devez être au moins ${requiredRole} pour accéder à cette fonctionnalité.\n\nVotre rôle actuel: ${user.role}`);
  }

  // Vérifier l'accès au module
  if (moduleName && !hasModuleAccess(moduleName)) {
    logSecurityEvent('ACCES_REFUSE', {
      action: `Tentative accès module ${moduleName}`,
      success: false,
      error: 'Module non autorisé pour cet utilisateur'
    });

    throw new Error(`❌ Accès refusé au module "${moduleName}".\n\nContactez l'administrateur pour obtenir les permissions nécessaires.`);
  }

  // Log de l'accès réussi
  logSecurityEvent('ACCES_AUTORISE', {
    action: `Accès ${moduleName}`,
    success: true
  });

  return user;
}

/**
 * ============================================================================
 * LOGGING DES ÉVÉNEMENTS DE SÉCURITÉ
 * ============================================================================
 */

/**
 * Enregistre un événement de sécurité dans la feuille Logs
 *
 * @param {string} eventType - Type d'événement
 * @param {Object} details - Détails de l'événement
 */
function logSecurityEvent(eventType, details) {
  try {
    const user = getCurrentUser();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs_WARAP');

    if (!sheet) {
      Logger.log('⚠️ Feuille Logs_WARAP non trouvée, impossible de logger');
      return;
    }

    const logData = [
      generateLogID(), // ID_Log
      new Date(), // Timestamp
      eventType, // Type_Evenement
      'SECURITY', // Module
      details.action || '', // Action_Effectuee
      user.email, // Utilisateur_Email
      user.role, // Utilisateur_Role
      'SECURITY', // Entite_Type
      '-', // Entite_ID
      '', // Anciennes_Valeurs
      JSON.stringify(details), // Nouvelles_Valeurs
      details.ip || 'N/A', // IP_Adresse
      '', // Navigateur_Agent
      details.success ? 'Succès' : 'Échec', // Statut
      details.error || '', // Message_Erreur
      'Critique' // Niveau_Securite
    ];

    sheet.appendRow(logData);

  } catch (error) {
    Logger.log(`❌ Erreur logSecurityEvent: ${error}`);
  }
}

/**
 * ============================================================================
 * GESTION DES UTILISATEURS
 * ============================================================================
 */

/**
 * Ajoute un nouvel utilisateur
 *
 * @param {Object} userData - Données utilisateur
 * @return {string} ID utilisateur créé
 */
function createUser(userData) {
  requireAuth('ADMIN_NATIONAL', 'utilisateurs');

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Utilisateurs_WARAP');

    if (!sheet) {
      throw new Error('Feuille Utilisateurs_WARAP non trouvée');
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = getUserFromSheet(userData.email);
    if (existingUser) {
      throw new Error(`Un utilisateur avec l'email ${userData.email} existe déjà`);
    }

    const userId = generateUtilisateurID();
    const now = new Date();

    const newUser = [
      userId,
      userData.email,
      userData.role || 'AGENT',
      userData.nom_complet,
      userData.telephone || '',
      'Actif',
      userData.franchise || '',
      userData.zone || '',
      userData.commune || '',
      JSON.stringify(userData.modules || []),
      now,
      null, // Date_Derniere_Connexion
      0, // Nombre_Connexions
      0, // Nombre_Actions_Jour
      '', // IP_Derniere_Connexion
      'Les deux', // Dispositif_Autorise
      '', // Photo_Profil
      userData.langue || 'Français',
      'Oui', // Notifications_Actives
      'Oui', // Email_Notifications
      'Non', // SMS_Notifications
      Session.getActiveUser().getEmail(), // Cree_Par
      '', // Modifie_Par
      now, // Date_Modification
      JSON.stringify({}), // Objectifs_Mensuels
      0, // Performance_Mois
      '', // Taux_Atteinte_Objectif
      '', // Badge_Performance
      '' // Notes_RH
    ];

    sheet.appendRow(newUser);

    logSecurityEvent('CREATION_UTILISATEUR', {
      action: `Création utilisateur ${userData.email}`,
      success: true,
      userId: userId
    });

    Logger.log(`✅ Utilisateur créé: ${userId} - ${userData.email}`);
    return userId;

  } catch (error) {
    Logger.log(`❌ Erreur createUser: ${error}`);
    throw error;
  }
}

/**
 * ============================================================================
 * FONCTIONS UTILITAIRES
 * ============================================================================
 */

/**
 * Obtient la liste de tous les utilisateurs (admin uniquement)
 *
 * @return {Array} Liste des utilisateurs
 */
function getAllUsers() {
  requireAuth('ADMIN_NATIONAL', 'utilisateurs');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Utilisateurs_WARAP');

  if (!sheet) {
    return [];
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0];

  return data.slice(1).map(row => {
    const user = {};
    headers.forEach((header, index) => {
      user[header] = row[index];
    });
    return user;
  });
}

/**
 * Obtient les statistiques utilisateurs par rôle
 *
 * @return {Object} Statistiques
 */
function getUserStatistics() {
  requireAuth('ADMIN_NATIONAL', 'admin');

  const users = getAllUsers();

  const stats = {
    total: users.length,
    actifs: users.filter(u => u.Statut === 'Actif').length,
    inactifs: users.filter(u => u.Statut === 'Inactif').length,
    suspendus: users.filter(u => u.Statut === 'Suspendu').length,
    byRole: {}
  };

  // Compter par rôle
  Object.keys(USER_ROLES).forEach(role => {
    stats.byRole[role] = users.filter(u => u.Role === role).length;
  });

  return stats;
}

/**
 * Vérifie si un email est un email WARAP autorisé
 *
 * @param {string} email - Email à vérifier
 * @return {boolean} true si autorisé
 */
function isAuthorizedEmail(email) {
  if (DEFAULT_USERS[email]) {
    return true;
  }

  const user = getUserFromSheet(email);
  return user !== null && user.statut === 'Actif';
}

Logger.log('✅ WARAP_Security_Manager.gs chargé');
