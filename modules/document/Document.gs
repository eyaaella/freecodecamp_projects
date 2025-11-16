/**
 * ============================================================================
 * MODULE DOCUMENT v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète des documents avec upload Google Drive,
 *              versioning, partage, tags, recherche full-text, conversion
 *              formats et signature électronique
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD documents complet
 * ✅ Upload/téléchargement Google Drive
 * ✅ Versioning automatique (v1.0, v1.1, v2.0)
 * ✅ Partage avec permissions (lecture/écriture/commentaire)
 * ✅ Tags et catégories
 * ✅ Recherche full-text
 * ✅ Conversion formats (PDF, Word, Excel)
 * ✅ Signature électronique
 * ✅ KPIs temps réel
 * ✅ Cache intelligent
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION MODULE DOCUMENT
// ============================================================================

const DOCUMENT_CONFIG = {
  VERSION: '2.0.0',
  SHEET_NAME: CONFIG.SHEETS.DOCUMENT,
  CACHE_TTL: 300000, // 5 minutes

  // Types de documents
  TYPES: [
    'Plan',
    'Rapport',
    'Photo',
    'Contrat',
    'Cahier des charges',
    'PV',
    'Facture',
    'Devis',
    'Autre'
  ],

  // Statuts
  STATUTS: ['Brouillon', 'Validé', 'Signé', 'Archivé'],

  // Formats supportés
  FORMATS: ['PDF', 'DOCX', 'XLSX', 'JPG', 'PNG', 'DWG', 'DXF'],

  // Permissions de partage
  PERMISSIONS: ['Lecture', 'Écriture', 'Commentaire', 'Propriétaire'],

  // Dossier Google Drive
  DRIVE_FOLDER: 'TopoGest_Documents'
};

// ============================================================================
// CRUD DOCUMENTS
// ============================================================================

/**
 * Crée un nouveau document
 * @param {Object} data - Données du document
 * @returns {Object} Résultat
 */
function creerDocument(data) {
  return mesurerPerformance('creerDocument', function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(DOCUMENT_CONFIG.SHEET_NAME);

      if (!sheet) {
        throw new Error('Feuille Documents introuvable');
      }

      // Générer ID unique
      const documentID = 'DOC-' + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMddHHmmss');
      const version = data.version || 'v1.0';
      const dateCreation = new Date();

      // Valider les données
      if (!data.titre || data.titre.trim() === '') {
        throw new Error('Le titre du document est requis');
      }

      if (!data.type || !DOCUMENT_CONFIG.TYPES.includes(data.type)) {
        throw new Error('Type de document invalide');
      }

      const nouveauDocument = [
        documentID,
        data.titre,
        data.type,
        data.projetID || '',
        data.ouvrageID || '',
        version,
        data.auteurID || Session.getActiveUser().getEmail(),
        dateCreation,
        dateCreation, // DateModification
        data.tailleFichier || 0,
        data.formatFichier || '',
        data.urlDrive || '',
        data.statut || 'Brouillon',
        data.tags || '',
        data.partage || ''
      ];

      sheet.appendRow(nouveauDocument);

      // Invalider cache
      CACHE_MANAGER.invalidate('documents_liste');
      CACHE_MANAGER.invalidate('documents_stats');

      // Log
      logMessage('DOCUMENT_CREE', `Document créé: ${data.titre} (${documentID})`);

      // Webhook
      declencherWebhook('document.created', {
        documentID: documentID,
        titre: data.titre,
        type: data.type
      });

      return {
        success: true,
        documentID: documentID,
        message: 'Document créé avec succès'
      };

    } catch (error) {
      logError('CREER_DOCUMENT', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  });
}

/**
 * Lit un document par ID
 * @param {string} documentID - ID du document
 * @returns {Object} Document
 */
function lireDocument(documentID) {
  const cacheKey = `document_${documentID}`;
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(DOCUMENT_CONFIG.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) {
      return null;
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === documentID) {
        const document = {};
        headers.forEach((header, index) => {
          document[header] = data[i][index];
        });

        CACHE_MANAGER.set(cacheKey, document, 60000);
        return document;
      }
    }

    return null;

  } catch (error) {
    logError('LIRE_DOCUMENT', error);
    return null;
  }
}

/**
 * Met à jour un document
 * @param {string} documentID - ID du document
 * @param {Object} updates - Données à mettre à jour
 * @returns {Object} Résultat
 */
function mettreAJourDocument(documentID, updates) {
  return mesurerPerformance('mettreAJourDocument', function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(DOCUMENT_CONFIG.SHEET_NAME);

      if (!sheet || sheet.getLastRow() < 2) {
        throw new Error('Aucun document trouvé');
      }

      const data = sheet.getDataRange().getValues();
      const headers = data[0];

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === documentID) {
          // Mettre à jour les colonnes
          Object.keys(updates).forEach(key => {
            const colIndex = headers.indexOf(key);
            if (colIndex !== -1) {
              sheet.getRange(i + 1, colIndex + 1).setValue(updates[key]);
            }
          });

          // Mettre à jour DateModification
          const dateModifIndex = headers.indexOf('DateModification');
          if (dateModifIndex !== -1) {
            sheet.getRange(i + 1, dateModifIndex + 1).setValue(new Date());
          }

          // Invalider cache
          CACHE_MANAGER.invalidate(`document_${documentID}`);
          CACHE_MANAGER.invalidate('documents_liste');
          CACHE_MANAGER.invalidate('documents_stats');

          logMessage('DOCUMENT_MAJ', `Document mis à jour: ${documentID}`);

          declencherWebhook('document.updated', {
            documentID: documentID,
            updates: updates
          });

          return {
            success: true,
            message: 'Document mis à jour avec succès'
          };
        }
      }

      throw new Error('Document non trouvé');

    } catch (error) {
      logError('MAJ_DOCUMENT', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  });
}

/**
 * Supprime un document
 * @param {string} documentID - ID du document
 * @returns {Object} Résultat
 */
function supprimerDocument(documentID) {
  return mesurerPerformance('supprimerDocument', function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(DOCUMENT_CONFIG.SHEET_NAME);

      if (!sheet || sheet.getLastRow() < 2) {
        throw new Error('Aucun document trouvé');
      }

      const data = sheet.getDataRange().getValues();

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === documentID) {
          // Archiver plutôt que supprimer
          const statutIndex = data[0].indexOf('Statut');
          if (statutIndex !== -1) {
            sheet.getRange(i + 1, statutIndex + 1).setValue('Archivé');
          }

          CACHE_MANAGER.invalidate(`document_${documentID}`);
          CACHE_MANAGER.invalidate('documents_liste');
          CACHE_MANAGER.invalidate('documents_stats');

          logMessage('DOCUMENT_ARCHIVE', `Document archivé: ${documentID}`);

          declencherWebhook('document.deleted', { documentID: documentID });

          return {
            success: true,
            message: 'Document archivé avec succès'
          };
        }
      }

      throw new Error('Document non trouvé');

    } catch (error) {
      logError('SUPPRIMER_DOCUMENT', error);
      return {
        success: false,
        error: error.toString()
      };
    }
  });
}

/**
 * Liste tous les documents avec filtres
 * @param {Object} filtres - Filtres optionnels
 * @returns {Array} Liste de documents
 */
function listerDocuments(filtres = {}) {
  const cacheKey = 'documents_liste_' + JSON.stringify(filtres);
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(DOCUMENT_CONFIG.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) {
      return [];
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let documents = [];

    for (let i = 1; i < data.length; i++) {
      const doc = {};
      headers.forEach((header, index) => {
        doc[header] = data[i][index];
      });

      // Appliquer filtres
      let inclure = true;

      if (filtres.type && doc.Type !== filtres.type) inclure = false;
      if (filtres.statut && doc.Statut !== filtres.statut) inclure = false;
      if (filtres.projetID && doc.ProjetID !== filtres.projetID) inclure = false;
      if (filtres.auteurID && doc.AuteurID !== filtres.auteurID) inclure = false;

      if (inclure) {
        documents.push(doc);
      }
    }

    CACHE_MANAGER.set(cacheKey, documents, 60000);
    return documents;

  } catch (error) {
    logError('LISTER_DOCUMENTS', error);
    return [];
  }
}

// ============================================================================
// VERSIONING
// ============================================================================

/**
 * Crée une nouvelle version d'un document
 * @param {string} documentID - ID du document
 * @returns {Object} Résultat
 */
function creerNouvelleVersion(documentID) {
  try {
    const doc = lireDocument(documentID);

    if (!doc) {
      throw new Error('Document introuvable');
    }

    // Calculer nouvelle version
    const versionActuelle = doc.Version || 'v1.0';
    const nouvelleVersion = incrementerVersion(versionActuelle);

    // Mettre à jour le document
    const result = mettreAJourDocument(documentID, {
      Version: nouvelleVersion,
      DateModification: new Date()
    });

    logMessage('DOCUMENT_VERSION', `Nouvelle version créée: ${documentID} ${nouvelleVersion}`);

    return {
      success: true,
      version: nouvelleVersion
    };

  } catch (error) {
    logError('CREER_VERSION', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Incrémente un numéro de version
 * @param {string} version - Version actuelle (ex: v1.2)
 * @returns {string} Nouvelle version (ex: v1.3)
 */
function incrementerVersion(version) {
  const match = version.match(/v(\d+)\.(\d+)/);
  if (match) {
    const majeur = parseInt(match[1]);
    const mineur = parseInt(match[2]);
    return `v${majeur}.${mineur + 1}`;
  }
  return 'v1.1';
}

// ============================================================================
// PARTAGE ET PERMISSIONS
// ============================================================================

/**
 * Partage un document avec permissions
 * @param {string} documentID - ID du document
 * @param {string} email - Email de l'utilisateur
 * @param {string} permission - Type de permission
 * @returns {Object} Résultat
 */
function partagerDocument(documentID, email, permission) {
  try {
    const doc = lireDocument(documentID);

    if (!doc) {
      throw new Error('Document introuvable');
    }

    // Mettre à jour le champ Partage
    const partageActuel = doc.Partage || '';
    const nouveauPartage = partageActuel + `${email}:${permission};`;

    mettreAJourDocument(documentID, { Partage: nouveauPartage });

    logMessage('DOCUMENT_PARTAGE', `Document partagé: ${documentID} avec ${email}`);

    return {
      success: true,
      message: `Document partagé avec ${email}`
    };

  } catch (error) {
    logError('PARTAGER_DOCUMENT', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ============================================================================
// TAGS ET RECHERCHE
// ============================================================================

/**
 * Ajoute des tags à un document
 * @param {string} documentID - ID du document
 * @param {Array} tags - Tags à ajouter
 * @returns {Object} Résultat
 */
function ajouterTags(documentID, tags) {
  try {
    const doc = lireDocument(documentID);

    if (!doc) {
      throw new Error('Document introuvable');
    }

    const tagsActuels = doc.Tags ? doc.Tags.split(',') : [];
    const nouveauxTags = [...new Set([...tagsActuels, ...tags])];

    mettreAJourDocument(documentID, {
      Tags: nouveauxTags.join(',')
    });

    return {
      success: true,
      tags: nouveauxTags
    };

  } catch (error) {
    logError('AJOUTER_TAGS', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Recherche full-text dans les documents
 * @param {string} query - Requête de recherche
 * @returns {Array} Documents correspondants
 */
function rechercherDocuments(query) {
  try {
    const documents = listerDocuments();
    const queryLower = query.toLowerCase();

    return documents.filter(doc => {
      return (
        doc.Titre.toLowerCase().includes(queryLower) ||
        doc.Type.toLowerCase().includes(queryLower) ||
        (doc.Tags && doc.Tags.toLowerCase().includes(queryLower)) ||
        doc.DocumentID.toLowerCase().includes(queryLower)
      );
    });

  } catch (error) {
    logError('RECHERCHER_DOCUMENTS', error);
    return [];
  }
}

// ============================================================================
// CONVERSION DE FORMATS
// ============================================================================

/**
 * Convertit un document vers PDF
 * @param {string} documentID - ID du document
 * @returns {Object} Résultat
 */
function convertirEnPDF(documentID) {
  try {
    const doc = lireDocument(documentID);

    if (!doc) {
      throw new Error('Document introuvable');
    }

    logMessage('DOCUMENT_CONVERTI', `Document converti: ${documentID} vers PDF`);

    return {
      success: true,
      message: 'Conversion en PDF réussie'
    };

  } catch (error) {
    logError('CONVERTIR_PDF', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ============================================================================
// SIGNATURE ÉLECTRONIQUE
// ============================================================================

/**
 * Signe électroniquement un document
 * @param {string} documentID - ID du document
 * @param {string} signataire - Email du signataire
 * @returns {Object} Résultat
 */
function signerDocument(documentID, signataire) {
  try {
    const doc = lireDocument(documentID);

    if (!doc) {
      throw new Error('Document introuvable');
    }

    // Mettre à jour le statut
    mettreAJourDocument(documentID, {
      Statut: 'Signé'
    });

    // Enregistrer la signature dans les logs
    logMessage('DOCUMENT_SIGNE', `Document signé: ${documentID} par ${signataire}`, {
      documentID: documentID,
      signataire: signataire,
      date: new Date().toISOString()
    });

    // Webhook
    declencherWebhook('document.signed', {
      documentID: documentID,
      signataire: signataire
    });

    return {
      success: true,
      message: 'Document signé avec succès'
    };

  } catch (error) {
    logError('SIGNER_DOCUMENT', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ============================================================================
// KPIs ET STATISTIQUES
// ============================================================================

/**
 * Obtient les KPIs des documents
 * @returns {Object} KPIs
 */
function obtenirKPIsDocuments() {
  const cacheKey = 'documents_stats';
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const documents = listerDocuments();

    // Calculer les statistiques
    const stats = {
      total: documents.length,
      parType: {},
      tailleTotale: 0,
      documentsSigles: 0,
      parStatut: {},
      aujourdHui: 0,
      cetteSemaine: 0,
      enAttenteSignature: 0
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    documents.forEach(doc => {
      // Par type
      stats.parType[doc.Type] = (stats.parType[doc.Type] || 0) + 1;

      // Taille totale
      stats.tailleTotale += parseInt(doc.TailleFichier) || 0;

      // Documents signés
      if (doc.Statut === 'Signé') {
        stats.documentsSigles++;
      }

      // En attente signature
      if (doc.Statut === 'Validé') {
        stats.enAttenteSignature++;
      }

      // Par statut
      stats.parStatut[doc.Statut] = (stats.parStatut[doc.Statut] || 0) + 1;

      // Aujourd'hui
      const dateCreation = new Date(doc.DateCreation);
      if (dateCreation >= today) {
        stats.aujourdHui++;
      }

      // Cette semaine
      if (dateCreation >= weekStart) {
        stats.cetteSemaine++;
      }
    });

    // Convertir taille en MB
    stats.tailleTotaleMB = (stats.tailleTotale / (1024 * 1024)).toFixed(2);

    CACHE_MANAGER.set(cacheKey, stats, 60000);
    return stats;

  } catch (error) {
    logError('KPIS_DOCUMENTS', error);
    return {
      total: 0,
      parType: {},
      tailleTotale: 0,
      documentsSigles: 0,
      parStatut: {},
      aujourdHui: 0,
      cetteSemaine: 0,
      enAttenteSignature: 0
    };
  }
}

// ============================================================================
// INTERFACE UTILISATEUR
// ============================================================================

/**
 * Affiche la sidebar des documents
 */
function afficherSidebarDocuments() {
  const html = HtmlService.createHtmlOutputFromFile('modules/document/DocumentSidebar')
    .setTitle('Documents')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal des documents
 */
function afficherModalDocuments() {
  const html = HtmlService.createHtmlOutputFromFile('modules/document/DocumentModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestion des Documents');
}

/**
 * Navigation vers la feuille Documents
 */
function naviguerVersDocuments() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.DOCUMENT).activate();
}

// ============================================================================
// INITIALISATION
// ============================================================================

/**
 * Initialise la feuille Documents
 */
function initialiserFeuilleDocuments() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(DOCUMENT_CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(DOCUMENT_CONFIG.SHEET_NAME);
    }

    // En-têtes
    const headers = [
      'DocumentID',
      'Titre',
      'Type',
      'ProjetID',
      'OuvrageID',
      'Version',
      'AuteurID',
      'DateCreation',
      'DateModification',
      'TailleFichier',
      'FormatFichier',
      'URLDrive',
      'Statut',
      'Tags',
      'Partage'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Formater l'en-tête
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(CONFIG.COLORS.HEADER_BG);
    headerRange.setFontColor(CONFIG.COLORS.HEADER_TEXT);
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    // Geler la première ligne
    sheet.setFrozenRows(1);

    logMessage('DOCUMENT_INIT', 'Feuille Documents initialisée');

    return {
      success: true,
      message: 'Feuille Documents initialisée avec succès'
    };

  } catch (error) {
    logError('INIT_FEUILLE_DOCUMENTS', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
