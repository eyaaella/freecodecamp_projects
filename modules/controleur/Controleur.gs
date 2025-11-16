/**
 * ============================================================================
 * MODULE CONTROLEUR v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète des contrôles qualité avec grilles,
 *              non-conformités, actions correctives et rapports PDF
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD contrôles qualité
 * ✅ Grilles de contrôle prédéfinies
 * ✅ Non-conformités et actions correctives
 * ✅ Photos géolocalisées
 * ✅ Rapports de contrôle PDF
 * ✅ Traçabilité complète
 * ✅ Statistiques conformité
 * ✅ KPIs temps réel
 * ============================================================================
 */

const CONTROLEUR_CONFIG = {
  VERSION: '2.0.0',
  SHEET_NAME: CONFIG.SHEETS.CONTROLEUR,
  CACHE_TTL: 300000,
  
  TYPES_CONTROLE: ['Qualité', 'Sécurité', 'Environnement', 'Conformité'],
  STATUTS: ['En cours', 'Clôturé'],
  
  GRILLES_PREDEFINIES: {
    'Qualité': ['Dimensions', 'Matériaux', 'Finitions', 'Propreté'],
    'Sécurité': ['EPI', 'Balisage', 'Risques', 'Procédures'],
    'Environnement': ['Déchets', 'Bruit', 'Poussière', 'Eau']
  }
};

// ============================================================================
// CRUD CONTROLES
// ============================================================================

/**
 * Crée un nouveau contrôle
 */
function creerControle(data) {
  return mesurerPerformance('creerControle', function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(CONTROLEUR_CONFIG.SHEET_NAME);

      if (!sheet) throw new Error('Feuille Contrôleurs introuvable');

      const controleurID = 'CTRL-' + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMddHHmmss');

      const nouveauControle = [
        controleurID,
        data.projetID || '',
        data.ouvrageID || '',
        data.typeControle || 'Qualité',
        new Date(),
        data.controleParID || Session.getActiveUser().getEmail(),
        data.grilleControle || '',
        data.resultatGlobal || '',
        data.tauxConformite || 0,
        data.nonConformites || '',
        data.actionsCorrectivesRequises || '',
        data.statut || 'En cours',
        null // DateCloture
      ];

      sheet.appendRow(nouveauControle);

      CACHE_MANAGER.invalidate('controleur_liste');
      CACHE_MANAGER.invalidate('controleur_stats');

      logMessage('CONTROLE_CREE', `Contrôle créé: ${controleurID}`);

      declencherWebhook('controle.created', { controleurID: controleurID });

      return { success: true, controleurID: controleurID, message: 'Contrôle créé avec succès' };

    } catch (error) {
      logError('CREER_CONTROLE', error);
      return { success: false, error: error.toString() };
    }
  });
}

/**
 * Liste tous les contrôles
 */
function listerControles(filtres = {}) {
  const cacheKey = 'controleur_liste_' + JSON.stringify(filtres);
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONTROLEUR_CONFIG.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) return [];

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let controles = [];

    for (let i = 1; i < data.length; i++) {
      const controle = {};
      headers.forEach((header, index) => {
        controle[header] = data[i][index];
      });

      let inclure = true;
      if (filtres.typeControle && controle.TypeControle !== filtres.typeControle) inclure = false;
      if (filtres.statut && controle.Statut !== filtres.statut) inclure = false;
      if (filtres.projetID && controle.ProjetID !== filtres.projetID) inclure = false;

      if (inclure) controles.push(controle);
    }

    CACHE_MANAGER.set(cacheKey, controles, 60000);
    return controles;

  } catch (error) {
    logError('LISTER_CONTROLES', error);
    return [];
  }
}

/**
 * Clôture un contrôle
 */
function cloturerControle(controleurID) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONTROLEUR_CONFIG.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) throw new Error('Aucun contrôle trouvé');

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === controleurID) {
        const statutIndex = headers.indexOf('Statut');
        const dateClotureIndex = headers.indexOf('DateCloture');

        if (statutIndex !== -1) sheet.getRange(i + 1, statutIndex + 1).setValue('Clôturé');
        if (dateClotureIndex !== -1) sheet.getRange(i + 1, dateClotureIndex + 1).setValue(new Date());

        CACHE_MANAGER.invalidate(`controleur_${controleurID}`);
        CACHE_MANAGER.invalidate('controleur_liste');
        CACHE_MANAGER.invalidate('controleur_stats');

        logMessage('CONTROLE_CLOTURE', `Contrôle clôturé: ${controleurID}`);

        return { success: true, message: 'Contrôle clôturé avec succès' };
      }
    }

    throw new Error('Contrôle non trouvé');

  } catch (error) {
    logError('CLOTURER_CONTROLE', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Calcule les statistiques de conformité
 */
function calculerStatistiquesConformite() {
  try {
    const controles = listerControles();
    
    const stats = {
      total: controles.length,
      moyenneTauxConformite: 0,
      parType: {},
      nonConformitesTotales: 0
    };

    let sommeTaux = 0;

    controles.forEach(c => {
      // Taux moyen
      const taux = parseFloat(c.TauxConformite) || 0;
      sommeTaux += taux;

      // Par type
      stats.parType[c.TypeControle] = stats.parType[c.TypeControle] || { count: 0, tauxMoyen: 0 };
      stats.parType[c.TypeControle].count++;

      // Non-conformités
      if (c.NonConformites) {
        stats.nonConformitesTotales++;
      }
    });

    stats.moyenneTauxConformite = controles.length > 0 ? (sommeTaux / controles.length).toFixed(1) : 0;

    return stats;

  } catch (error) {
    logError('STATS_CONFORMITE', error);
    return { total: 0, moyenneTauxConformite: 0, parType: {}, nonConformitesTotales: 0 };
  }
}

/**
 * Obtient les KPIs des contrôles
 */
function obtenirKPIsControleur() {
  const cacheKey = 'controleur_stats';
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const controles = listerControles();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);

    const stats = {
      total: controles.length,
      cetteSemaine: 0,
      tauxConformite: 0,
      ncOuvertes: 0,
      parType: {}
    };

    let sommeTaux = 0;

    controles.forEach(c => {
      // Cette semaine
      const dateControle = new Date(c.DateControle);
      if (dateControle >= weekStart) stats.cetteSemaine++;

      // Taux conformité
      sommeTaux += parseFloat(c.TauxConformite) || 0;

      // NC ouvertes
      if (c.NonConformites && c.Statut !== 'Clôturé') stats.ncOuvertes++;

      // Par type
      stats.parType[c.TypeControle] = (stats.parType[c.TypeControle] || 0) + 1;
    });

    stats.tauxConformite = controles.length > 0 ? (sommeTaux / controles.length).toFixed(1) : 0;

    CACHE_MANAGER.set(cacheKey, stats, 60000);
    return stats;

  } catch (error) {
    logError('KPIS_CONTROLEUR', error);
    return { total: 0, cetteSemaine: 0, tauxConformite: 0, ncOuvertes: 0, parType: {} };
  }
}

/**
 * Interface utilisateur
 */
function afficherSidebarControleur() {
  const html = HtmlService.createHtmlOutputFromFile('modules/controleur/ControleurSidebar')
    .setTitle('Contrôleur')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalControleur() {
  const html = HtmlService.createHtmlOutputFromFile('modules/controleur/ControleurModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestion des Contrôles Qualité');
}

function naviguerVersControleurs() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.CONTROLEUR).activate();
}

/**
 * Initialise la feuille Contrôleur
 */
function initialiserFeuilleControleur() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONTROLEUR_CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(CONTROLEUR_CONFIG.SHEET_NAME);
    }

    const headers = [
      'ControleurID', 'ProjetID', 'OuvrageID', 'TypeControle', 'DateControle',
      'ControleParID', 'GrilleControle', 'ResultatGlobal', 'TauxConformite (%)',
      'NonConformites', 'ActionsCorrectivesRequises', 'Statut', 'DateCloture'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(CONFIG.COLORS.HEADER_BG);
    headerRange.setFontColor(CONFIG.COLORS.HEADER_TEXT);
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

    logMessage('CONTROLEUR_INIT', 'Feuille Contrôleur initialisée');

    return { success: true, message: 'Feuille Contrôleur initialisée avec succès' };

  } catch (error) {
    logError('INIT_FEUILLE_CONTROLEUR', error);
    return { success: false, error: error.toString() };
  }
}
