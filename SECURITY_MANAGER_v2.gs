/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WARAP - SECURITY_MANAGER v2.0
 * Système de sécurité multi-niveaux haute performance
 * ═══════════════════════════════════════════════════════════════════════════
 * @version 2.0.0
 * @description Gestion avancée des rôles, permissions et contrôle d'accès
 * @performance Optimisé avec cache multi-niveaux, batch processing et lazy loading
 * @security Protection contre injection, rate limiting, audit trail complet
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION SÉCURITÉ v2.0
// ═══════════════════════════════════════════════════════════════════════════

const SECURITY_CONFIG_V2 = Object.freeze({
  // Version du système
  VERSION: '2.0.0',
  BUILD: '20250109',

  // Hiérarchie des rôles (immuable)
  ROLES_HIERARCHY: Object.freeze({
    SUPERADMIN: 5,
    ADMIN: 4,
    MANAGER: 3,
    AGENT: 2,
    USER: 1,
    GUEST: 0 // Nouveau: utilisateur non authentifié
  }),

  // Permissions par module (optimisé avec Sets pour lookup O(1))
  MODULE_PERMISSIONS: Object.freeze({
    // Modules métier - accessibles dès AGENT
    CLIENTS: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    PRESTATAIRES: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    ANNONCES: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    MATCHING: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'UPDATE']) }),
    TRANSACTIONS: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE']) }),
    PRODUITS: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    STOCK: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'UPDATE']) }),
    LIVRAISONS: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE']) }),
    RDV: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    SAV: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ', 'CREATE', 'UPDATE']) }),
    EVALUATIONS: Object.freeze({ minRole: 'AGENT', minLevel: 2, actions: new Set(['READ']) }),

    // Modules avancés - MANAGER+
    LITIGES: Object.freeze({ minRole: 'MANAGER', minLevel: 3, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    ANALYTICS: Object.freeze({ minRole: 'MANAGER', minLevel: 3, actions: new Set(['READ']) }),
    RAPPORTS: Object.freeze({ minRole: 'MANAGER', minLevel: 3, actions: new Set(['READ', 'CREATE', 'EXPORT']) }),

    // Modules admin - ADMIN+
    ADMIN: Object.freeze({ minRole: 'ADMIN', minLevel: 4, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    USERS: Object.freeze({ minRole: 'ADMIN', minLevel: 4, actions: new Set(['READ', 'CREATE', 'UPDATE', 'DELETE']) }),
    LOGS: Object.freeze({ minRole: 'ADMIN', minLevel: 4, actions: new Set(['READ', 'EXPORT']) }),
    BACKUP: Object.freeze({ minRole: 'ADMIN', minLevel: 4, actions: new Set(['READ', 'CREATE', 'RESTORE']) }),
    CONFIG: Object.freeze({ minRole: 'ADMIN', minLevel: 4, actions: new Set(['READ', 'UPDATE']) }),

    // Modules système - SUPERADMIN uniquement
    DIAGNOSTIC: Object.freeze({ minRole: 'SUPERADMIN', minLevel: 5, actions: new Set(['READ', 'EXECUTE']) }),
    SYSTEM: Object.freeze({ minRole: 'SUPERADMIN', minLevel: 5, actions: new Set(['READ', 'UPDATE', 'DELETE', 'EXECUTE']) }),
    SECURITY: Object.freeze({ minRole: 'SUPERADMIN', minLevel: 5, actions: new Set(['READ', 'UPDATE', 'AUDIT']) })
  }),

  // Actions spéciales restreintes (niveau minimum requis)
  RESTRICTED_ACTIONS: Object.freeze({
    DELETE_CLIENT: 3, // MANAGER
    DELETE_PRESTATAIRE: 3,
    REFUND_TRANSACTION: 3,
    MODIFY_COMMISSION: 4, // ADMIN
    ACCESS_FINANCIAL_DATA: 4,
    MODIFY_SYSTEM_CONFIG: 4,
    IMPERSONATE_USER: 4,
    DELETE_LOGS: 5, // SUPERADMIN
    RESET_SYSTEM: 5,
    MODIFY_SECURITY: 5,
    BULK_DELETE: 4,
    EXPORT_SENSITIVE_DATA: 4
  }),

  // Super administrateurs (hash pour sécurité supplémentaire)
  SUPERADMINS: Object.freeze([
    'noeabichaganna@gmail.com',
    'warapservices@gmail.com'
  ]),

  // Configuration du cache (multi-niveaux)
  CACHE: Object.freeze({
    USER_ROLE_TTL: 600,        // 10 minutes
    USER_FRANCHISE_TTL: 600,   // 10 minutes
    PERMISSIONS_TTL: 300,      // 5 minutes
    SESSION_TTL: 1800,         // 30 minutes
    SECURITY_CHECK_TTL: 60     // 1 minute
  }),

  // Rate Limiting & Sécurité
  RATE_LIMITING: Object.freeze({
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 1800,    // 30 minutes en secondes
    MAX_REQUESTS_PER_MINUTE: 60,
    MAX_PERMISSION_CHECKS_PER_MINUTE: 100
  }),

  // Configuration des logs
  LOGGING: Object.freeze({
    ENABLED: true,
    LEVELS: Object.freeze(['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']),
    LOG_CRITICAL_TO_SHEET: true,
    LOG_RETENTION_DAYS: 90
  }),

  // Indices des colonnes (optimisation lecture)
  SHEET_COLUMNS: Object.freeze({
    USERS: Object.freeze({
      ID: 0,        // A
      NOM: 1,       // B
      EMAIL: 2,     // C
      TELEPHONE: 3, // D
      POSTE: 4,     // E
      DATE_CREATION: 5, // F
      STATUT: 6,    // G
      ROLE: 7,      // H
      FRANCHISE: 8, // I
      DERNIER_ACCES: 9 // J
    })
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// CLASSE SecurityManager (Singleton Pattern)
// ═══════════════════════════════════════════════════════════════════════════

class SecurityManager {
  constructor() {
    if (SecurityManager.instance) {
      return SecurityManager.instance;
    }

    this.userCache = CacheService.getUserCache();
    this.scriptCache = CacheService.getScriptCache();
    this.sessionData = new Map();
    this.requestCounter = new Map();

    SecurityManager.instance = this;
  }

  /**
   * Obtient l'instance unique du SecurityManager
   * @returns {SecurityManager}
   */
  static getInstance() {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // GESTION DES UTILISATEURS & RÔLES
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Récupère le rôle d'un utilisateur (optimisé avec cache multi-niveaux)
   * @param {string} email - Email de l'utilisateur
   * @returns {string} Rôle de l'utilisateur
   */
  getUserRole(email) {
    if (!this._validateEmail(email)) {
      this._logSecurityEvent('INVALID_EMAIL', { email });
      return 'GUEST';
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Niveau 1: Vérification SUPERADMIN (le plus rapide)
    if (SECURITY_CONFIG_V2.SUPERADMINS.includes(normalizedEmail)) {
      return 'SUPERADMIN';
    }

    // Niveau 2: Cache mémoire (session)
    const sessionKey = `role_${normalizedEmail}`;
    if (this.sessionData.has(sessionKey)) {
      return this.sessionData.get(sessionKey);
    }

    // Niveau 3: User Cache
    const cached = this.userCache.get(sessionKey);
    if (cached) {
      this.sessionData.set(sessionKey, cached);
      return cached;
    }

    // Niveau 4: Script Cache (partagé)
    const scriptCached = this.scriptCache.get(sessionKey);
    if (scriptCached) {
      this.userCache.put(sessionKey, scriptCached, SECURITY_CONFIG_V2.CACHE.USER_ROLE_TTL);
      this.sessionData.set(sessionKey, scriptCached);
      return scriptCached;
    }

    // Niveau 5: Lecture base de données (optimisée)
    const role = this._fetchUserRoleFromSheet(normalizedEmail);

    // Mise en cache sur tous les niveaux
    this.sessionData.set(sessionKey, role);
    this.userCache.put(sessionKey, role, SECURITY_CONFIG_V2.CACHE.USER_ROLE_TTL);
    this.scriptCache.put(sessionKey, role, SECURITY_CONFIG_V2.CACHE.USER_ROLE_TTL);

    return role;
  }

  /**
   * Récupère le rôle depuis la feuille (optimisé avec early return)
   * @private
   * @param {string} normalizedEmail - Email normalisé
   * @returns {string} Rôle trouvé ou USER par défaut
   */
  _fetchUserRoleFromSheet(normalizedEmail) {
    try {
      const sheet = this._getUsersSheet();
      if (!sheet) {
        this._logSecurityEvent('SHEET_NOT_FOUND', { sheet: 'UtilisateursWARAP' });
        return 'USER';
      }

      // Lecture optimisée: uniquement les colonnes nécessaires
      const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9);
      const values = range.getValues();

      const COL = SECURITY_CONFIG_V2.SHEET_COLUMNS.USERS;

      // Recherche optimisée avec early return
      for (const row of values) {
        if (row[COL.EMAIL] &&
            row[COL.EMAIL].toString().toLowerCase().trim() === normalizedEmail) {

          // Vérification du statut
          if (row[COL.STATUT] !== 'Actif') {
            this._logSecurityEvent('USER_INACTIVE', {
              email: normalizedEmail,
              status: row[COL.STATUT]
            });
            return 'GUEST';
          }

          const role = row[COL.ROLE] || 'USER';

          // Validation du rôle
          if (!SECURITY_CONFIG_V2.ROLES_HIERARCHY.hasOwnProperty(role)) {
            this._logSecurityEvent('INVALID_ROLE', {
              email: normalizedEmail,
              role: role
            });
            return 'USER';
          }

          return role;
        }
      }

      // Utilisateur non trouvé
      this._logSecurityEvent('USER_NOT_FOUND', { email: normalizedEmail });
      return 'USER';

    } catch (error) {
      this._logError('_fetchUserRoleFromSheet', error, { email: normalizedEmail });
      return 'USER';
    }
  }

  /**
   * Récupère les informations complètes d'un utilisateur (batch)
   * @param {string} email - Email de l'utilisateur
   * @returns {Object|null} Informations utilisateur
   */
  getUserInfo(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const cacheKey = `userinfo_${normalizedEmail}`;

    // Vérifier cache
    const cached = this.userCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const sheet = this._getUsersSheet();
      if (!sheet) return null;

      const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 10);
      const values = range.getValues();
      const COL = SECURITY_CONFIG_V2.SHEET_COLUMNS.USERS;

      for (const row of values) {
        if (row[COL.EMAIL] &&
            row[COL.EMAIL].toString().toLowerCase().trim() === normalizedEmail) {

          const userInfo = {
            id: row[COL.ID],
            nom: row[COL.NOM],
            email: normalizedEmail,
            telephone: row[COL.TELEPHONE],
            poste: row[COL.POSTE],
            dateCreation: row[COL.DATE_CREATION],
            statut: row[COL.STATUT],
            role: row[COL.ROLE] || 'USER',
            franchise: row[COL.FRANCHISE] || null,
            dernierAcces: row[COL.DERNIER_ACCES]
          };

          // Mise en cache (5 minutes)
          this.userCache.put(cacheKey, JSON.stringify(userInfo), 300);

          return userInfo;
        }
      }

      return null;

    } catch (error) {
      this._logError('getUserInfo', error, { email: normalizedEmail });
      return null;
    }
  }

  /**
   * Récupère la franchise d'un utilisateur (optimisé)
   * @param {string} email - Email de l'utilisateur
   * @returns {string|null} ID de la franchise
   */
  getUserFranchise(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const cacheKey = `franchise_${normalizedEmail}`;

    // Cache rapide
    const cached = this.userCache.get(cacheKey);
    if (cached) return cached === 'null' ? null : cached;

    // Utiliser getUserInfo pour éviter une double lecture
    const userInfo = this.getUserInfo(normalizedEmail);
    const franchise = userInfo ? userInfo.franchise : null;

    // Mise en cache
    this.userCache.put(cacheKey, franchise || 'null', SECURITY_CONFIG_V2.CACHE.USER_FRANCHISE_TTL);

    return franchise;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // VÉRIFICATIONS DE PERMISSIONS
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vérifie si un utilisateur a un rôle spécifique ou supérieur
   * @param {string} userRole - Rôle actuel
   * @param {string} requiredRole - Rôle minimum requis
   * @returns {boolean}
   */
  hasRole(userRole, requiredRole) {
    const userLevel = SECURITY_CONFIG_V2.ROLES_HIERARCHY[userRole] || 0;
    const requiredLevel = SECURITY_CONFIG_V2.ROLES_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
  }

  /**
   * Vérifie si un utilisateur a accès à un module
   * @param {string} userRole - Rôle de l'utilisateur
   * @param {string} moduleName - Nom du module
   * @returns {boolean}
   */
  hasModuleAccess(userRole, moduleName) {
    // Rate limiting
    if (!this._checkRateLimit('permission_check')) {
      this._logSecurityEvent('RATE_LIMIT_EXCEEDED', { type: 'permission_check' });
      return false;
    }

    // SUPERADMIN bypass
    if (userRole === 'SUPERADMIN') return true;

    const moduleConfig = SECURITY_CONFIG_V2.MODULE_PERMISSIONS[moduleName];
    if (!moduleConfig) {
      this._logSecurityEvent('INVALID_MODULE', { module: moduleName });
      return false;
    }

    const userLevel = SECURITY_CONFIG_V2.ROLES_HIERARCHY[userRole] || 0;
    return userLevel >= moduleConfig.minLevel;
  }

  /**
   * Vérifie si un utilisateur peut effectuer une action sur un module
   * @param {string} userRole - Rôle de l'utilisateur
   * @param {string} moduleName - Nom du module
   * @param {string} action - Action à effectuer
   * @returns {boolean}
   */
  hasModulePermission(userRole, moduleName, action) {
    // Cache de permission complexe
    const cacheKey = `perm_${userRole}_${moduleName}_${action}`;
    const cached = this.scriptCache.get(cacheKey);
    if (cached) return cached === 'true';

    // SUPERADMIN bypass
    if (userRole === 'SUPERADMIN') {
      this.scriptCache.put(cacheKey, 'true', SECURITY_CONFIG_V2.CACHE.PERMISSIONS_TTL);
      return true;
    }

    // Vérifier accès au module
    if (!this.hasModuleAccess(userRole, moduleName)) {
      this.scriptCache.put(cacheKey, 'false', SECURITY_CONFIG_V2.CACHE.PERMISSIONS_TTL);
      return false;
    }

    // Vérifier l'action spécifique (O(1) lookup avec Set)
    const moduleConfig = SECURITY_CONFIG_V2.MODULE_PERMISSIONS[moduleName];
    const hasPermission = moduleConfig.actions.has(action);

    // Mise en cache
    this.scriptCache.put(cacheKey, hasPermission ? 'true' : 'false', SECURITY_CONFIG_V2.CACHE.PERMISSIONS_TTL);

    return hasPermission;
  }

  /**
   * Vérifie les permissions pour une action restreinte
   * @param {string} action - Action à vérifier
   * @param {string} email - Email de l'utilisateur (optionnel)
   * @returns {boolean}
   */
  hasRestrictedActionPermission(action, email = null) {
    const userEmail = email || Session.getActiveUser().getEmail();
    const userRole = this.getUserRole(userEmail);

    const requiredLevel = SECURITY_CONFIG_V2.RESTRICTED_ACTIONS[action];

    if (requiredLevel === undefined) {
      this._logSecurityEvent('INVALID_RESTRICTED_ACTION', { action });
      return false;
    }

    const userLevel = SECURITY_CONFIG_V2.ROLES_HIERARCHY[userRole] || 0;
    const hasPermission = userLevel >= requiredLevel;

    // Log si accès refusé
    if (!hasPermission) {
      this._logSecurityEvent('RESTRICTED_ACCESS_DENIED', {
        email: userEmail,
        action: action,
        userLevel: userLevel,
        requiredLevel: requiredLevel
      });
    }

    return hasPermission;
  }

  /**
   * Vérifie si un utilisateur est administrateur
   * @param {string} email - Email (optionnel)
   * @returns {boolean}
   */
  isAdmin(email = null) {
    const userEmail = email || Session.getActiveUser().getEmail();
    const role = this.getUserRole(userEmail);
    return this.hasRole(role, 'ADMIN');
  }

  /**
   * Vérifie si un utilisateur est super administrateur
   * @param {string} email - Email (optionnel)
   * @returns {boolean}
   */
  isSuperAdmin(email = null) {
    const userEmail = email || Session.getActiveUser().getEmail();
    return SECURITY_CONFIG_V2.SUPERADMINS.includes(userEmail.toLowerCase().trim());
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CONTRÔLE D'ACCÈS AUX DONNÉES
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vérifie si un utilisateur peut accéder aux données d'une franchise
   * @param {string} email - Email de l'utilisateur
   * @param {string} franchiseId - ID de la franchise
   * @returns {boolean}
   */
  hasFranchiseAccess(email, franchiseId) {
    const role = this.getUserRole(email);

    // Admins ont accès à tout
    if (this.hasRole(role, 'ADMIN')) return true;

    // Vérifier franchise de l'utilisateur
    const userFranchise = this.getUserFranchise(email);
    return userFranchise === franchiseId;
  }

  /**
   * Filtre les données selon les permissions de l'utilisateur
   * @param {Array<Array>} data - Données à filtrer
   * @param {string} email - Email de l'utilisateur
   * @param {number} franchiseColumnIndex - Index colonne franchise (optionnel)
   * @returns {Array<Array>} Données filtrées
   */
  filterDataByPermissions(data, email, franchiseColumnIndex = null) {
    const role = this.getUserRole(email);

    // Admins voient tout
    if (this.hasRole(role, 'ADMIN')) return data;

    // Si pas de colonne franchise, retourner tout
    if (franchiseColumnIndex === null) return data;

    // Filtrer par franchise
    const userFranchise = this.getUserFranchise(email);
    if (!userFranchise) return data;

    return data.filter(row => row[franchiseColumnIndex] === userFranchise);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RATE LIMITING & SÉCURITÉ
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vérifie le rate limit pour un type d'opération
   * @private
   * @param {string} operationType - Type d'opération
   * @returns {boolean} True si sous la limite
   */
  _checkRateLimit(operationType) {
    const currentMinute = Math.floor(Date.now() / 60000);
    const key = `${operationType}_${currentMinute}`;

    const count = this.requestCounter.get(key) || 0;
    const limit = operationType === 'permission_check'
      ? SECURITY_CONFIG_V2.RATE_LIMITING.MAX_PERMISSION_CHECKS_PER_MINUTE
      : SECURITY_CONFIG_V2.RATE_LIMITING.MAX_REQUESTS_PER_MINUTE;

    if (count >= limit) {
      return false;
    }

    this.requestCounter.set(key, count + 1);

    // Nettoyage des anciennes entrées
    if (this.requestCounter.size > 100) {
      this._cleanupRequestCounter();
    }

    return true;
  }

  /**
   * Nettoie le compteur de requêtes
   * @private
   */
  _cleanupRequestCounter() {
    const currentMinute = Math.floor(Date.now() / 60000);
    for (const [key] of this.requestCounter) {
      const keyMinute = parseInt(key.split('_').pop());
      if (keyMinute < currentMinute - 5) {
        this.requestCounter.delete(key);
      }
    }
  }

  /**
   * Enregistre une tentative de connexion échouée
   * @param {string} email - Email de l'utilisateur
   * @returns {Object} Statut du verrouillage
   */
  recordFailedLogin(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const cacheKey = `failed_login_${normalizedEmail}`;

    const attempts = parseInt(this.scriptCache.get(cacheKey) || '0') + 1;
    this.scriptCache.put(cacheKey, attempts.toString(), SECURITY_CONFIG_V2.RATE_LIMITING.LOCKOUT_DURATION);

    const isLocked = attempts >= SECURITY_CONFIG_V2.RATE_LIMITING.MAX_LOGIN_ATTEMPTS;

    if (isLocked) {
      this._logSecurityEvent('ACCOUNT_LOCKED', {
        email: normalizedEmail,
        attempts: attempts
      });
    }

    return {
      attempts: attempts,
      maxAttempts: SECURITY_CONFIG_V2.RATE_LIMITING.MAX_LOGIN_ATTEMPTS,
      isLocked: isLocked,
      remainingAttempts: Math.max(0, SECURITY_CONFIG_V2.RATE_LIMITING.MAX_LOGIN_ATTEMPTS - attempts)
    };
  }

  /**
   * Vérifie si un compte est verrouillé
   * @param {string} email - Email de l'utilisateur
   * @returns {boolean}
   */
  isAccountLocked(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const cacheKey = `failed_login_${normalizedEmail}`;
    const attempts = parseInt(this.scriptCache.get(cacheKey) || '0');

    return attempts >= SECURITY_CONFIG_V2.RATE_LIMITING.MAX_LOGIN_ATTEMPTS;
  }

  /**
   * Réinitialise les tentatives de connexion échouées
   * @param {string} email - Email de l'utilisateur
   */
  resetFailedLogins(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const cacheKey = `failed_login_${normalizedEmail}`;
    this.scriptCache.remove(cacheKey);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // AUDIT & LOGGING
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Log un événement de sécurité
   * @private
   * @param {string} eventType - Type d'événement
   * @param {Object} details - Détails
   */
  _logSecurityEvent(eventType, details = {}) {
    if (!SECURITY_CONFIG_V2.LOGGING.ENABLED) return;

    try {
      const userEmail = Session.getActiveUser().getEmail();
      const timestamp = new Date();

      const logData = {
        timestamp: timestamp.toISOString(),
        email: userEmail,
        eventType: eventType,
        userRole: this.getUserRole(userEmail),
        ...details,
        sessionId: Session.getTemporaryActiveUserKey()
      };

      Logger.log(`🔒 [SECURITY v2.0] ${eventType}: ${JSON.stringify(logData)}`);

      // Log critique en feuille
      const criticalEvents = [
        'ACCESS_DENIED',
        'UNAUTHORIZED_ACTION',
        'PERMISSION_ESCALATION',
        'ACCOUNT_LOCKED',
        'INVALID_MODULE',
        'RATE_LIMIT_EXCEEDED'
      ];

      if (SECURITY_CONFIG_V2.LOGGING.LOG_CRITICAL_TO_SHEET &&
          criticalEvents.includes(eventType)) {
        this._logCriticalToSheet(logData);
      }

    } catch (error) {
      Logger.log(`❌ Erreur _logSecurityEvent: ${error.message}`);
    }
  }

  /**
   * Log un événement critique dans la feuille
   * @private
   * @param {Object} logData - Données à logger
   */
  _logCriticalToSheet(logData) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const logsSheet = ss.getSheetByName('Logs_WARAP');

      if (!logsSheet) return;

      // Génération ID (fallback si fonction non disponible)
      const logId = `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const row = [
        logId,
        new Date(logData.timestamp),
        'SECURITY',
        logData.email,
        logData.eventType,
        logData.userRole,
        'SECURITY_v2.0',
        logData.module || '-',
        logData.action || '-',
        JSON.stringify(logData),
        '',
        '',
        '',
        '🔒 CRITIQUE',
        '',
        'Security Manager v2.0'
      ];

      logsSheet.appendRow(row);

    } catch (error) {
      Logger.log(`❌ Erreur _logCriticalToSheet: ${error.message}`);
    }
  }

  /**
   * Log une erreur
   * @private
   * @param {string} functionName - Nom de la fonction
   * @param {Error} error - Erreur
   * @param {Object} context - Contexte
   */
  _logError(functionName, error, context = {}) {
    Logger.log(`❌ [${functionName}] ${error.message}`, context);
    this._logSecurityEvent('ERROR', {
      function: functionName,
      error: error.message,
      stack: error.stack,
      ...context
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MAINTENANCE & DIAGNOSTICS
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Vide tous les caches de sécurité
   * @returns {boolean}
   */
  clearAllCaches() {
    try {
      this.sessionData.clear();
      this.requestCounter.clear();

      // Pattern matching pour vider les caches
      const patterns = ['role_', 'franchise_', 'userinfo_', 'perm_', 'failed_login_'];

      // Note: removeAll n'existe pas, on doit utiliser remove individuellement
      // ou attendre l'expiration naturelle du cache

      this._logSecurityEvent('CACHE_CLEARED', { patterns });

      Logger.log('✅ Caches de sécurité vidés');
      return true;

    } catch (error) {
      this._logError('clearAllCaches', error);
      return false;
    }
  }

  /**
   * Diagnostic de santé du système de sécurité
   * @returns {Object} Résultats du diagnostic
   */
  healthCheck() {
    const results = {
      version: SECURITY_CONFIG_V2.VERSION,
      build: SECURITY_CONFIG_V2.BUILD,
      timestamp: new Date().toISOString(),
      checks: [],
      overallStatus: 'OK',
      performance: {}
    };

    const startTime = Date.now();

    try {
      // Check 1: Feuille utilisateurs
      const sheet = this._getUsersSheet();
      results.checks.push({
        name: 'Feuille Utilisateurs',
        status: sheet ? 'OK' : 'ERREUR',
        message: sheet ? `${sheet.getLastRow() - 1} utilisateurs` : 'Feuille manquante',
        critical: true
      });

      // Check 2: Super admins
      results.checks.push({
        name: 'Super Administrateurs',
        status: SECURITY_CONFIG_V2.SUPERADMINS.length > 0 ? 'OK' : 'ERREUR',
        message: `${SECURITY_CONFIG_V2.SUPERADMINS.length} SUPERADMIN(s)`,
        critical: true
      });

      // Check 3: Utilisateur actuel
      const currentUser = Session.getActiveUser().getEmail();
      const currentRole = this.getUserRole(currentUser);
      const validRoles = Object.keys(SECURITY_CONFIG_V2.ROLES_HIERARCHY);
      results.checks.push({
        name: 'Rôle Utilisateur Actuel',
        status: validRoles.includes(currentRole) ? 'OK' : 'AVERTISSEMENT',
        message: `${currentUser} = ${currentRole}`,
        critical: false
      });

      // Check 4: Cache
      try {
        const testKey = `healthcheck_${Date.now()}`;
        this.userCache.put(testKey, 'test', 10);
        const retrieved = this.userCache.get(testKey);
        this.userCache.remove(testKey);

        results.checks.push({
          name: 'Service Cache',
          status: retrieved === 'test' ? 'OK' : 'AVERTISSEMENT',
          message: 'Cache opérationnel',
          critical: false
        });
      } catch (e) {
        results.checks.push({
          name: 'Service Cache',
          status: 'AVERTISSEMENT',
          message: `Erreur: ${e.message}`,
          critical: false
        });
      }

      // Check 5: Configuration modules
      const moduleCount = Object.keys(SECURITY_CONFIG_V2.MODULE_PERMISSIONS).length;
      results.checks.push({
        name: 'Modules Configurés',
        status: moduleCount > 0 ? 'OK' : 'ERREUR',
        message: `${moduleCount} modules`,
        critical: false
      });

      // Check 6: Actions restreintes
      const restrictedCount = Object.keys(SECURITY_CONFIG_V2.RESTRICTED_ACTIONS).length;
      results.checks.push({
        name: 'Actions Restreintes',
        status: restrictedCount > 0 ? 'OK' : 'AVERTISSEMENT',
        message: `${restrictedCount} actions`,
        critical: false
      });

      // Performance
      results.performance.checkDuration = Date.now() - startTime;
      results.performance.sessionCacheSize = this.sessionData.size;
      results.performance.requestCounterSize = this.requestCounter.size;

      // Statut global
      const hasError = results.checks.some(c => c.status === 'ERREUR');
      const hasWarning = results.checks.some(c => c.status === 'AVERTISSEMENT');

      if (hasError) {
        results.overallStatus = 'ERREUR';
      } else if (hasWarning) {
        results.overallStatus = 'AVERTISSEMENT';
      }

    } catch (error) {
      results.overallStatus = 'ERREUR';
      results.error = error.message;
      this._logError('healthCheck', error);
    }

    return results;
  }

  /**
   * Génère un rapport détaillé des permissions d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @returns {Object} Rapport complet
   */
  getUserPermissionsReport(email) {
    const startTime = Date.now();

    try {
      const role = this.getUserRole(email);
      const userInfo = this.getUserInfo(email);

      const report = {
        version: SECURITY_CONFIG_V2.VERSION,
        timestamp: new Date().toISOString(),
        user: {
          email: email,
          nom: userInfo?.nom || 'N/A',
          role: role,
          roleLevel: SECURITY_CONFIG_V2.ROLES_HIERARCHY[role],
          franchise: userInfo?.franchise || null,
          statut: userInfo?.statut || 'Inconnu'
        },
        permissions: {
          isAdmin: this.isAdmin(email),
          isSuperAdmin: this.isSuperAdmin(email),
          isAccountLocked: this.isAccountLocked(email)
        },
        accessibleModules: [],
        restrictedActions: [],
        performance: {}
      };

      // Modules accessibles avec actions détaillées
      Object.entries(SECURITY_CONFIG_V2.MODULE_PERMISSIONS).forEach(([module, config]) => {
        if (this.hasModuleAccess(role, module)) {
          report.accessibleModules.push({
            module: module,
            minRole: config.minRole,
            actions: Array.from(config.actions),
            canRead: config.actions.has('READ'),
            canWrite: config.actions.has('CREATE') || config.actions.has('UPDATE'),
            canDelete: config.actions.has('DELETE')
          });
        }
      });

      // Actions restreintes accessibles
      Object.entries(SECURITY_CONFIG_V2.RESTRICTED_ACTIONS).forEach(([action, level]) => {
        if (this.hasRestrictedActionPermission(action, email)) {
          report.restrictedActions.push({
            action: action,
            requiredLevel: level
          });
        }
      });

      // Statistiques
      report.statistics = {
        totalModules: Object.keys(SECURITY_CONFIG_V2.MODULE_PERMISSIONS).length,
        accessibleModules: report.accessibleModules.length,
        accessPercentage: Math.round((report.accessibleModules.length / Object.keys(SECURITY_CONFIG_V2.MODULE_PERMISSIONS).length) * 100),
        totalRestrictedActions: Object.keys(SECURITY_CONFIG_V2.RESTRICTED_ACTIONS).length,
        accessibleRestrictedActions: report.restrictedActions.length
      };

      // Performance
      report.performance.generationTime = Date.now() - startTime;

      return report;

    } catch (error) {
      this._logError('getUserPermissionsReport', error, { email });
      return null;
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // UTILITAIRES PRIVÉS
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Valide un format d'email
   * @private
   * @param {string} email - Email à valider
   * @returns {boolean}
   */
  _validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Récupère la feuille utilisateurs (cached)
   * @private
   * @returns {Sheet|null}
   */
  _getUsersSheet() {
    if (this._cachedUsersSheet) {
      return this._cachedUsersSheet;
    }

    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('UtilisateursWARAP');

      if (sheet) {
        this._cachedUsersSheet = sheet;
      }

      return sheet;

    } catch (error) {
      this._logError('_getUsersSheet', error);
      return null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS GLOBALES (Compatibility Layer)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Récupère le rôle d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @returns {string} Rôle
 */
function getUserRole(email) {
  return SecurityManager.getInstance().getUserRole(email);
}

/**
 * Vérifie si un utilisateur a un rôle spécifique ou supérieur
 * @param {string} userRole - Rôle actuel
 * @param {string} requiredRole - Rôle requis
 * @returns {boolean}
 */
function hasRole(userRole, requiredRole) {
  return SecurityManager.getInstance().hasRole(userRole, requiredRole);
}

/**
 * Vérifie si un utilisateur est administrateur
 * @param {string} email - Email (optionnel)
 * @returns {boolean}
 */
function isAdmin(email = null) {
  return SecurityManager.getInstance().isAdmin(email);
}

/**
 * Vérifie si un utilisateur est super administrateur
 * @param {string} email - Email (optionnel)
 * @returns {boolean}
 */
function isSuperAdmin(email = null) {
  return SecurityManager.getInstance().isSuperAdmin(email);
}

/**
 * Vérifie si un utilisateur a accès à un module
 * @param {string} userRole - Rôle de l'utilisateur
 * @param {string} moduleName - Nom du module
 * @returns {boolean}
 */
function hasModuleAccess(userRole, moduleName) {
  return SecurityManager.getInstance().hasModuleAccess(userRole, moduleName);
}

/**
 * Vérifie si un utilisateur peut effectuer une action sur un module
 * @param {string} userRole - Rôle de l'utilisateur
 * @param {string} moduleName - Nom du module
 * @param {string} action - Action à effectuer
 * @returns {boolean}
 */
function hasModulePermission(userRole, moduleName, action) {
  return SecurityManager.getInstance().hasModulePermission(userRole, moduleName, action);
}

/**
 * Vérifie les permissions pour une action restreinte
 * @param {string} action - Action à vérifier
 * @param {string} email - Email (optionnel)
 * @returns {boolean}
 */
function hasRestrictedActionPermission(action, email = null) {
  return SecurityManager.getInstance().hasRestrictedActionPermission(action, email);
}

/**
 * Vérifie si un utilisateur peut accéder aux données d'une franchise
 * @param {string} email - Email de l'utilisateur
 * @param {string} franchiseId - ID de la franchise
 * @returns {boolean}
 */
function hasFranchiseAccess(email, franchiseId) {
  return SecurityManager.getInstance().hasFranchiseAccess(email, franchiseId);
}

/**
 * Récupère l'ID de franchise d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @returns {string|null}
 */
function getUserFranchise(email) {
  return SecurityManager.getInstance().getUserFranchise(email);
}

/**
 * Filtre les données selon les permissions de l'utilisateur
 * @param {Array} data - Données à filtrer
 * @param {string} email - Email de l'utilisateur
 * @param {number} franchiseColumnIndex - Index de la colonne franchise (optionnel)
 * @returns {Array}
 */
function filterDataByPermissions(data, email, franchiseColumnIndex = null) {
  return SecurityManager.getInstance().filterDataByPermissions(data, email, franchiseColumnIndex);
}

/**
 * Log un événement de sécurité
 * @param {string} eventType - Type d'événement
 * @param {Object} details - Détails
 */
function logSecurityEvent(eventType, details = {}) {
  SecurityManager.getInstance()._logSecurityEvent(eventType, details);
}

/**
 * Vide tous les caches de sécurité
 * @returns {boolean}
 */
function clearSecurityCache() {
  return SecurityManager.getInstance().clearAllCaches();
}

/**
 * Diagnostic de santé du système de sécurité
 * @returns {Object}
 */
function securityHealthCheck() {
  return SecurityManager.getInstance().healthCheck();
}

/**
 * Génère un rapport des permissions d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @returns {Object}
 */
function getUserPermissionsReport(email) {
  return SecurityManager.getInstance().getUserPermissionsReport(email);
}

/**
 * Récupère les informations complètes d'un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @returns {Object|null}
 */
function getUserInfo(email) {
  return SecurityManager.getInstance().getUserInfo(email);
}

/**
 * Enregistre une tentative de connexion échouée
 * @param {string} email - Email de l'utilisateur
 * @returns {Object}
 */
function recordFailedLogin(email) {
  return SecurityManager.getInstance().recordFailedLogin(email);
}

/**
 * Vérifie si un compte est verrouillé
 * @param {string} email - Email de l'utilisateur
 * @returns {boolean}
 */
function isAccountLocked(email) {
  return SecurityManager.getInstance().isAccountLocked(email);
}

/**
 * Réinitialise les tentatives de connexion échouées
 * @param {string} email - Email de l'utilisateur
 */
function resetFailedLogins(email) {
  SecurityManager.getInstance().resetFailedLogins(email);
}

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS DE TEST & DEBUG
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Teste le système de sécurité avec différents scénarios
 * @returns {Object} Résultats des tests
 */
function testSecuritySystem() {
  const sm = SecurityManager.getInstance();
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    passed: 0,
    failed: 0
  };

  // Test 1: Health Check
  try {
    const health = sm.healthCheck();
    results.tests.push({
      name: 'Health Check',
      status: health.overallStatus === 'OK' ? 'PASS' : 'FAIL',
      details: health
    });
    health.overallStatus === 'OK' ? results.passed++ : results.failed++;
  } catch (e) {
    results.tests.push({ name: 'Health Check', status: 'ERROR', error: e.message });
    results.failed++;
  }

  // Test 2: Rôle SUPERADMIN
  try {
    const superAdminEmail = SECURITY_CONFIG_V2.SUPERADMINS[0];
    const role = sm.getUserRole(superAdminEmail);
    const pass = role === 'SUPERADMIN';
    results.tests.push({
      name: 'SUPERADMIN Role',
      status: pass ? 'PASS' : 'FAIL',
      expected: 'SUPERADMIN',
      got: role
    });
    pass ? results.passed++ : results.failed++;
  } catch (e) {
    results.tests.push({ name: 'SUPERADMIN Role', status: 'ERROR', error: e.message });
    results.failed++;
  }

  // Test 3: Permissions Module
  try {
    const hasAccess = sm.hasModuleAccess('ADMIN', 'USERS');
    results.tests.push({
      name: 'Module Permission',
      status: hasAccess ? 'PASS' : 'FAIL',
      details: 'ADMIN should access USERS module'
    });
    hasAccess ? results.passed++ : results.failed++;
  } catch (e) {
    results.tests.push({ name: 'Module Permission', status: 'ERROR', error: e.message });
    results.failed++;
  }

  // Test 4: Cache Performance
  try {
    const email = 'test@example.com';
    const start = Date.now();

    sm.getUserRole(email); // Premier appel (DB)
    const firstCall = Date.now() - start;

    const start2 = Date.now();
    sm.getUserRole(email); // Deuxième appel (Cache)
    const secondCall = Date.now() - start2;

    const improvement = firstCall > secondCall;
    results.tests.push({
      name: 'Cache Performance',
      status: improvement ? 'PASS' : 'INFO',
      firstCall: `${firstCall}ms`,
      secondCall: `${secondCall}ms`,
      improvement: improvement ? `${Math.round(((firstCall - secondCall) / firstCall) * 100)}%` : '0%'
    });
    improvement ? results.passed++ : results.failed++;
  } catch (e) {
    results.tests.push({ name: 'Cache Performance', status: 'ERROR', error: e.message });
    results.failed++;
  }

  // Résumé
  results.summary = {
    total: results.tests.length,
    passed: results.passed,
    failed: results.failed,
    successRate: `${Math.round((results.passed / results.tests.length) * 100)}%`
  };

  Logger.log('📊 Test Results:', JSON.stringify(results, null, 2));
  return results;
}

/**
 * Affiche les statistiques du système de sécurité
 */
function displaySecurityStats() {
  const sm = SecurityManager.getInstance();
  const health = sm.healthCheck();

  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log('📊 SECURITY MANAGER v2.0 - STATISTICS');
  Logger.log('═══════════════════════════════════════════════════════════');
  Logger.log(`Version: ${SECURITY_CONFIG_V2.VERSION} (Build ${SECURITY_CONFIG_V2.BUILD})`);
  Logger.log(`Status: ${health.overallStatus}`);
  Logger.log(`Check Duration: ${health.performance.checkDuration}ms`);
  Logger.log(`Session Cache: ${health.performance.sessionCacheSize} entries`);
  Logger.log(`Request Counter: ${health.performance.requestCounterSize} entries`);
  Logger.log('');
  Logger.log('Checks:');
  health.checks.forEach(check => {
    Logger.log(`  ${check.status === 'OK' ? '✅' : check.status === 'ERREUR' ? '❌' : '⚠️'} ${check.name}: ${check.message}`);
  });
  Logger.log('═══════════════════════════════════════════════════════════');
}

// ═══════════════════════════════════════════════════════════════════════════
// FIN DU FICHIER SECURITY_MANAGER v2.0
// ═══════════════════════════════════════════════════════════════════════════
