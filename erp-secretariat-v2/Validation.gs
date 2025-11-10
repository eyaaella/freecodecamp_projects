/**
 * Système de validation et sécurité v2.0
 */

const Validator = {
  /**
   * Valide un email
   */
  isValidEmail: function(email) {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Valide un numéro de téléphone camerounais
   */
  isValidCameroonPhone: function(phone) {
    if (!phone) return false;
    // Format: +237XXXXXXXXX ou 237XXXXXXXXX ou 6XXXXXXXX ou 2XXXXXXXX
    const regex = /^(\+?237)?[62]\d{8}$/;
    return regex.test(phone.replace(/\s/g, ''));
  },

  /**
   * Valide un montant
   */
  isValidAmount: function(amount) {
    if (amount === null || amount === undefined) return false;
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 0;
  },

  /**
   * Valide une date
   */
  isValidDate: function(date) {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  },

  /**
   * Valide un NIF (Numéro d'Identification Fiscale Cameroun)
   */
  isValidNIF: function(nif) {
    if (!nif) return true; // Optionnel
    // Format: M + 9 chiffres ou P + 9 chiffres
    const regex = /^[MP]\d{9}$/;
    return regex.test(nif);
  },

  /**
   * Sanitize une chaîne (protection XSS)
   */
  sanitizeString: function(str) {
    if (!str) return '';
    return str.toString()
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000); // Limite de longueur
  },

  /**
   * Valide les données d'un client
   */
  validateClient: function(clientData) {
    const errors = [];

    if (!clientData.nom || clientData.nom.trim() === '') {
      errors.push('Le nom est obligatoire');
    }

    if (!clientData.type || clientData.type.trim() === '') {
      errors.push('Le type de client est obligatoire');
    }

    if (!clientData.telephone || clientData.telephone.trim() === '') {
      errors.push('Le téléphone est obligatoire');
    } else if (!this.isValidCameroonPhone(clientData.telephone)) {
      errors.push('Le numéro de téléphone est invalide');
    }

    if (clientData.email && !this.isValidEmail(clientData.email)) {
      errors.push('L\'email est invalide');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Valide les données d'une facture
   */
  validateFacture: function(factureData) {
    const errors = [];

    if (!factureData.client || factureData.client.trim() === '') {
      errors.push('Le client est obligatoire');
    }

    if (!factureData.description || factureData.description.trim() === '') {
      errors.push('La description est obligatoire');
    }

    if (!this.isValidAmount(factureData.montantHT)) {
      errors.push('Le montant HT est invalide');
    } else if (factureData.montantHT <= 0) {
      errors.push('Le montant HT doit être supérieur à 0');
    }

    if (factureData.echeance && !this.isValidDate(factureData.echeance)) {
      errors.push('La date d\'échéance est invalide');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Valide les données d'un paiement
   */
  validatePaiement: function(paiementData) {
    const errors = [];

    if (!paiementData.numeroFacture || paiementData.numeroFacture.trim() === '') {
      errors.push('Le numéro de facture est obligatoire');
    }

    if (!this.isValidAmount(paiementData.montant)) {
      errors.push('Le montant est invalide');
    } else if (paiementData.montant <= 0) {
      errors.push('Le montant doit être supérieur à 0');
    }

    if (!paiementData.mode || paiementData.mode.trim() === '') {
      errors.push('Le mode de paiement est obligatoire');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Valide les données d'un employé
   */
  validateEmploye: function(employeData) {
    const errors = [];

    if (!employeData.nom || employeData.nom.trim() === '') {
      errors.push('Le nom est obligatoire');
    }

    if (!employeData.poste || employeData.poste.trim() === '') {
      errors.push('Le poste est obligatoire');
    }

    if (!employeData.telephone || employeData.telephone.trim() === '') {
      errors.push('Le téléphone est obligatoire');
    } else if (!this.isValidCameroonPhone(employeData.telephone)) {
      errors.push('Le numéro de téléphone est invalide');
    }

    if (employeData.email && !this.isValidEmail(employeData.email)) {
      errors.push('L\'email est invalide');
    }

    if (!employeData.dateEmbauche || !this.isValidDate(employeData.dateEmbauche)) {
      errors.push('La date d\'embauche est invalide');
    }

    if (!employeData.typeContrat || employeData.typeContrat.trim() === '') {
      errors.push('Le type de contrat est obligatoire');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Affiche les erreurs de validation
   */
  showValidationErrors: function(errors) {
    const ui = SpreadsheetApp.getUi();
    const errorMessage = '❌ Erreurs de validation:\n\n' + errors.join('\n');
    ui.alert('Validation', errorMessage, ui.ButtonSet.OK);
  }
};

/**
 * Système d'audit et de logs
 */
const AuditLog = {
  /**
   * Enregistre une action dans le log d'audit
   */
  log: function(action, entity, entityId, details) {
    if (!ERP.config.options.enableAuditLog) return;

    try {
      const sheet = ERP.getOrCreateSheet('_Audit');

      // Créer les en-têtes si nécessaire
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Date/Heure',
          'Utilisateur',
          'Action',
          'Entité',
          'ID',
          'Détails'
        ]);
        sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
      }

      const user = Session.getActiveUser().getEmail();
      const timestamp = ERP.formatDateTime(new Date());

      sheet.appendRow([
        timestamp,
        user,
        action,
        entity,
        entityId || '',
        details || ''
      ]);

      ERP.log('AUDIT', `${action} - ${entity} - ${entityId}`);
    } catch (error) {
      ERP.log('ERROR', 'Erreur audit log: ' + error);
    }
  },

  /**
   * Actions d'audit
   */
  Actions: {
    CREATE: 'CRÉATION',
    UPDATE: 'MODIFICATION',
    DELETE: 'SUPPRESSION',
    VIEW: 'CONSULTATION',
    EXPORT: 'EXPORT',
    IMPORT: 'IMPORT',
    LOGIN: 'CONNEXION'
  },

  /**
   * Entités
   */
  Entities: {
    CLIENT: 'Client',
    FOURNISSEUR: 'Fournisseur',
    FACTURE: 'Facture',
    DEVIS: 'Devis',
    PAIEMENT: 'Paiement',
    COURRIER: 'Courrier',
    EMPLOYE: 'Employé',
    STOCK: 'Stock',
    TACHE: 'Tâche',
    RDV: 'Rendez-vous'
  }
};

/**
 * Système de permissions (basique)
 */
const Permissions = {
  /**
   * Vérifie si l'utilisateur a une permission
   */
  hasPermission: function(permission) {
    // Pour v2.0, tous les utilisateurs ont toutes les permissions
    // Dans une version future, on pourrait implémenter un système de rôles
    return true;
  },

  /**
   * Obtient l'utilisateur actuel
   */
  getCurrentUser: function() {
    return {
      email: Session.getActiveUser().getEmail(),
      role: 'ADMIN' // Pour l'instant, tous sont admin
    };
  },

  /**
   * Vérifie si l'utilisateur peut modifier des données
   */
  canEdit: function() {
    return this.hasPermission('EDIT');
  },

  /**
   * Vérifie si l'utilisateur peut supprimer des données
   */
  canDelete: function() {
    return this.hasPermission('DELETE');
  },

  /**
   * Vérifie si l'utilisateur peut exporter des données
   */
  canExport: function() {
    return this.hasPermission('EXPORT');
  }
};

/**
 * Utilitaires de sécurité
 */
const Security = {
  /**
   * Génère un ID unique
   */
  generateUUID: function() {
    return Utilities.getUuid();
  },

  /**
   * Hash simple (pour les tokens, pas pour les mots de passe)
   */
  simpleHash: function(str) {
    return Utilities.base64Encode(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      str
    ));
  },

  /**
   * Vérifie l'intégrité d'une feuille
   */
  checkSheetIntegrity: function(sheetName) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Feuille ${sheetName} introuvable`);
    }

    // Vérifier que les en-têtes sont présents
    if (sheet.getLastRow() < 2) {
      throw new Error(`Feuille ${sheetName} mal initialisée`);
    }

    return true;
  },

  /**
   * Protège une plage de cellules
   */
  protectRange: function(sheet, range, description) {
    try {
      const protection = range.protect().setDescription(description);

      // Option: autoriser uniquement certains utilisateurs
      // const me = Session.getEffectiveUser();
      // protection.addEditor(me);
      // protection.removeEditors(protection.getEditors());

      // Pour l'instant, juste un avertissement
      protection.setWarningOnly(true);
    } catch (error) {
      ERP.log('WARN', 'Impossible de protéger la plage: ' + error);
    }
  }
};

/**
 * Gestionnaire de données (Data Access Layer)
 */
const DataManager = {
  /**
   * Récupère des données avec cache
   */
  getData: function(sheetName, useCache) {
    useCache = useCache !== false; // Par défaut true

    if (useCache) {
      const cacheKey = `data_${sheetName}`;
      const cached = ERP.cacheGet(cacheKey);
      if (cached) return cached;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 3) return [];

    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn()).getValues();

    if (useCache) {
      ERP.cacheSet(`data_${sheetName}`, data);
    }

    return data;
  },

  /**
   * Invalide le cache d'une feuille
   */
  invalidateCache: function(sheetName) {
    ERP.cacheClear(`data_${sheetName}`);
  },

  /**
   * Recherche dans une feuille
   */
  search: function(sheetName, searchTerm, columns) {
    const data = this.getData(sheetName);
    const results = [];

    searchTerm = searchTerm.toLowerCase();

    for (let row of data) {
      let match = false;

      for (let colIndex of columns) {
        const value = row[colIndex] ? row[colIndex].toString().toLowerCase() : '';
        if (value.includes(searchTerm)) {
          match = true;
          break;
        }
      }

      if (match) {
        results.push(row);
      }
    }

    return results;
  },

  /**
   * Compte les lignes correspondant à un critère
   */
  count: function(sheetName, columnIndex, value) {
    const data = this.getData(sheetName);
    let count = 0;

    for (let row of data) {
      if (row[columnIndex] === value) {
        count++;
      }
    }

    return count;
  },

  /**
   * Filtre les données
   */
  filter: function(sheetName, filterFn) {
    const data = this.getData(sheetName);
    return data.filter(filterFn);
  },

  /**
   * Agrège les données
   */
  sum: function(sheetName, columnIndex, filterFn) {
    const data = this.getData(sheetName);
    let sum = 0;

    for (let row of data) {
      if (!filterFn || filterFn(row)) {
        const value = parseFloat(row[columnIndex].toString().replace(/[^0-9.-]+/g, '')) || 0;
        sum += value;
      }
    }

    return sum;
  }
};
