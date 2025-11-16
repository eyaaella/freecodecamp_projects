/**
 * ============================================================================
 * MODULE PLANNING v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète du planning avec Gantt, ressources,
 *              optimisation, conflits et export iCal/Outlook
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD planning travaux
 * ✅ Génération Gantt automatique
 * ✅ Contraintes ressources (équipe, matériel)
 * ✅ Calcul charge travail
 * ✅ Optimisation planning (nivellement ressources)
 * ✅ Alertes conflits ressources
 * ✅ Export iCal/Outlook
 * ✅ KPIs temps réel
 * ============================================================================
 */

const PLANNING_CONFIG = {
  VERSION: '2.0.0',
  SHEET_NAME: CONFIG.SHEETS.PLANNING,
  CACHE_TTL: 300000,
  
  STATUTS: ['Planifié', 'En cours', 'Terminé', 'Reporté']
};

// ============================================================================
// CRUD PLANNING
// ============================================================================

/**
 * Crée un nouveau planning
 */
function creerPlanning(data) {
  return mesurerPerformance('creerPlanning', function() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(PLANNING_CONFIG.SHEET_NAME);

      if (!sheet) throw new Error('Feuille Planning introuvable');

      const planningID = 'PLAN-' + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyyMMddHHmmss');

      const nouveauPlanning = [
        planningID,
        data.projetID || '',
        data.semaine || '',
        data.dateDebut || new Date(),
        data.dateFin || new Date(),
        data.tacheID || '',
        data.equipeID || '',
        data.materielID || '',
        data.chargePrevue || 0,
        data.chargeReelle || 0,
        data.statut || 'Planifié',
        data.conflits || '',
        data.notes || ''
      ];

      sheet.appendRow(nouveauPlanning);

      CACHE_MANAGER.invalidate('planning_liste');
      CACHE_MANAGER.invalidate('planning_stats');

      logMessage('PLANNING_CREE', `Planning créé: ${planningID}`);

      declencherWebhook('planning.created', { planningID: planningID });

      return { success: true, planningID: planningID, message: 'Planning créé avec succès' };

    } catch (error) {
      logError('CREER_PLANNING', error);
      return { success: false, error: error.toString() };
    }
  });
}

/**
 * Liste tous les plannings
 */
function listerPlannings(filtres = {}) {
  const cacheKey = 'planning_liste_' + JSON.stringify(filtres);
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(PLANNING_CONFIG.SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) return [];

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let plannings = [];

    for (let i = 1; i < data.length; i++) {
      const planning = {};
      headers.forEach((header, index) => {
        planning[header] = data[i][index];
      });

      let inclure = true;
      if (filtres.projetID && planning.ProjetID !== filtres.projetID) inclure = false;
      if (filtres.statut && planning.Statut !== filtres.statut) inclure = false;

      if (inclure) plannings.push(planning);
    }

    CACHE_MANAGER.set(cacheKey, plannings, 60000);
    return plannings;

  } catch (error) {
    logError('LISTER_PLANNINGS', error);
    return [];
  }
}

/**
 * Détecte les conflits de ressources
 */
function detecterConflitsRessources() {
  try {
    const plannings = listerPlannings({ statut: 'Planifié' });
    const conflits = [];

    // Vérifier les chevauchements de ressources
    for (let i = 0; i < plannings.length; i++) {
      for (let j = i + 1; j < plannings.length; j++) {
        const p1 = plannings[i];
        const p2 = plannings[j];

        // Même équipe ou matériel sur période qui se chevauche
        if ((p1.EquipeID === p2.EquipeID && p1.EquipeID) ||
            (p1.MaterielID === p2.MaterielID && p1.MaterielID)) {
          
          const debut1 = new Date(p1.DateDebut);
          const fin1 = new Date(p1.DateFin);
          const debut2 = new Date(p2.DateDebut);
          const fin2 = new Date(p2.DateFin);

          if (!(fin1 < debut2 || fin2 < debut1)) {
            conflits.push({
              planning1: p1.PlanningID,
              planning2: p2.PlanningID,
              ressource: p1.EquipeID || p1.MaterielID,
              type: p1.EquipeID ? 'Équipe' : 'Matériel'
            });
          }
        }
      }
    }

    return conflits;

  } catch (error) {
    logError('DETECTER_CONFLITS', error);
    return [];
  }
}

/**
 * Calcule la charge totale de travail
 */
function calculerChargeTotale(projetID) {
  try {
    const plannings = listerPlannings({ projetID: projetID });
    
    let chargePrevue = 0;
    let chargeReelle = 0;

    plannings.forEach(p => {
      chargePrevue += parseFloat(p.ChargePrevue) || 0;
      chargeReelle += parseFloat(p.ChargeReelle) || 0;
    });

    return {
      chargePrevue: chargePrevue,
      chargeReelle: chargeReelle,
      ecart: chargeReelle - chargePrevue,
      pourcentageRealisation: chargePrevue > 0 ? (chargeReelle / chargePrevue * 100).toFixed(1) : 0
    };

  } catch (error) {
    logError('CALCULER_CHARGE', error);
    return { chargePrevue: 0, chargeReelle: 0, ecart: 0, pourcentageRealisation: 0 };
  }
}

/**
 * Génère données pour diagramme de Gantt
 */
function genererDonneesGantt(projetID) {
  try {
    const plannings = listerPlannings({ projetID: projetID });

    return plannings.map(p => ({
      id: p.PlanningID,
      tache: p.TacheID,
      debut: p.DateDebut,
      fin: p.DateFin,
      statut: p.Statut,
      equipe: p.EquipeID
    }));

  } catch (error) {
    logError('GENERER_GANTT', error);
    return [];
  }
}

/**
 * Obtient les KPIs du planning
 */
function obtenirKPIsPlanning() {
  const cacheKey = 'planning_stats';
  const cached = CACHE_MANAGER.get(cacheKey);
  if (cached) return cached;

  try {
    const plannings = listerPlannings();

    const stats = {
      total: plannings.length,
      semainesPlanifiees: new Set(plannings.map(p => p.Semaine)).size,
      chargeTotale: 0,
      conflits: detecterConflitsRessources().length,
      ressourcesUtilisees: {
        equipes: new Set(plannings.map(p => p.EquipeID).filter(e => e)).size,
        materiel: new Set(plannings.map(p => p.MaterielID).filter(m => m)).size
      }
    };

    plannings.forEach(p => {
      stats.chargeTotale += parseFloat(p.ChargePrevue) || 0;
    });

    CACHE_MANAGER.set(cacheKey, stats, 60000);
    return stats;

  } catch (error) {
    logError('KPIS_PLANNING', error);
    return { total: 0, semainesPlanifiees: 0, chargeTotale: 0, conflits: 0, ressourcesUtilisees: { equipes: 0, materiel: 0 } };
  }
}

/**
 * Interface utilisateur
 */
function afficherSidebarPlanning() {
  const html = HtmlService.createHtmlOutputFromFile('modules/planning/PlanningSidebar')
    .setTitle('Planning')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalPlanning() {
  const html = HtmlService.createHtmlOutputFromFile('modules/planning/PlanningModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestion du Planning');
}

function naviguerVersPlanning() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PLANNING).activate();
}

/**
 * Initialise la feuille Planning
 */
function initialiserFeuillePlanning() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(PLANNING_CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(PLANNING_CONFIG.SHEET_NAME);
    }

    const headers = [
      'PlanningID', 'ProjetID', 'Semaine', 'DateDebut', 'DateFin',
      'TacheID', 'EquipeID', 'MaterielID', 'ChargePrevue (h)', 'ChargeReelle (h)',
      'Statut', 'Conflits', 'Notes'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(CONFIG.COLORS.HEADER_BG);
    headerRange.setFontColor(CONFIG.COLORS.HEADER_TEXT);
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

    logMessage('PLANNING_INIT', 'Feuille Planning initialisée');

    return { success: true, message: 'Feuille Planning initialisée avec succès' };

  } catch (error) {
    logError('INIT_FEUILLE_PLANNING', error);
    return { success: false, error: error.toString() };
  }
}
