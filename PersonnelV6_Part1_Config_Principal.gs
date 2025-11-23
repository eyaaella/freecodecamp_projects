/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODULE GESTION DU PERSONNEL V6.0 ULTIMATE - PARTIE 1/3
 * CONFIGURATION, PERSONNEL PRINCIPAL & DASHBOARD
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @description Système ultra-complet de gestion du personnel avec dashboards
 * @version 6.0.0 - OPTIMISÉ
 * @date 2025-01-23
 * @author WARAP Education Team - Production Ready
 *
 * 🎯 CORRECTIONS V6.0:
 * ✅ Formules converties en ANGLAIS (IFERROR, COUNTIF, SUM, etc.)
 * ✅ Séparateurs corrigés (virgules au lieu de point-virgules)
 * ✅ Code optimisé et divisé en 3 parties
 * ✅ Toutes les feuilles secondaires configurées
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION GLOBALE V6.0
// ═══════════════════════════════════════════════════════════════════════════

var CONFIG_PERSONNEL_V6 = {
  version: '6.0.0',
  codeName: 'ULTIMATE-RH',

  // Noms des feuilles
  sheets: {
    personnel: '👨‍🏫_Personnel',
    dashboard: '📊_Dashboard_Personnel',
    affectations: '📌_Affectations_Cours',
    absences: '❌_Absences_Personnel',
    evaluations: '⭐_Evaluations_Personnel',
    salaires: '💵_Salaires_Personnel',
    contrats: '📋_Contrats_Personnel',
    formations: '🎓_Formations_Personnel',
    analytics: '📈_Analytics_RH'
  },

  // Index colonnes Personnel (1-based)
  col: {
    ID_Personnel: 1, Matricule: 2, Nom: 3, Prenom: 4, Nom_Complet: 5,
    Date_Naissance: 6, Lieu_Naissance: 7, Sexe: 8, Nationalite: 9, Numero_CNI: 10,
    Email: 11, Telephone: 12, Telephone_2: 13, Adresse: 14, Ville: 15, Quartier: 16,
    Type_Personnel: 17, Fonction: 18, Diplome_Superieur: 19, Niveau_Etudes: 20,
    Specialite_Enseignement: 21, Matieres_Enseignees: 22, Date_Embauche: 23,
    Date_Fin_Contrat: 24, Type_Contrat: 25, Statut_Emploi: 26, Grade: 27, Echelon: 28,
    Salaire_Base: 29, Primes_Mensuelles: 30, Indemnites: 31, Charges_Sociales: 32,
    Salaire_Net: 33, Numero_Compte_Bancaire: 34, Banque: 35, Personne_A_Contacter: 36,
    Telephone_Urgence: 37, Numero_CNPS: 38, Numero_Contribuable: 39, Photo_URL: 40,
    Badge_ID_URL: 41, Classes_En_Charge_IDs: 42, Classes_En_Charge: 43,
    Professeur_Principal_De_ID: 44, Professeur_Principal_De: 45, Nombre_Heures_Semaine: 46,
    Taux_Charge: 47, Note_Evaluation_Derniere: 48, Date_Derniere_Evaluation: 49,
    Distinctions: 50, Nombre_Absences: 51, Nombre_Retards: 52, Tags: 53,
    Notes_Internes: 54, Alertes: 55, Cree_Par: 56, Date_Creation: 57,
    Modifie_Par: 58, Date_Modification: 59, Hash_Integrite: 60
  },

  // Listes déroulantes
  dropdowns: {
    sexe: ['Masculin', 'Féminin'],
    typePersonnel: [
      '👨‍🏫 Enseignant',
      '👔 Directeur',
      '💼 Surveillant Général',
      '📚 Censeur',
      '💼 Secrétaire',
      '💰 Comptable',
      '🔧 Personnel Maintenance',
      '🍽️ Personnel Cantine',
      '🧹 Personnel Entretien',
      '🔬 Laborantin',
      '📚 Bibliothécaire',
      '🏥 Infirmier',
      '🚌 Chauffeur'
    ],
    typeContrat: ['📝 CDI', '⏰ CDD', '📋 Vacataire', '🎓 Stagiaire', '💼 Fonctionnaire', '🤝 Consultant'],
    statutEmploi: ['✅ Actif', '🏖️ En Congé', '🏥 Arrêt Maladie', '⏸️ Suspendu', '🔚 Démissionnaire', '❌ Licencié', '🎓 Retraité'],
    villes: ['Yaoundé', 'Douala', 'Garoua', 'Bafoussam', 'Bamenda', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Kribi', 'Limbé'],
    banques: ['Afriland First Bank', 'BICEC', 'Ecobank', 'SCB Cameroun', 'SGBC', 'UBA Cameroun', 'CCA Bank', 'CBC'],
    grades: ['Professeur Certifié', 'Professeur Contractuel', 'Professeur Vacataire', 'Maître Application', 'Instituteur', 'PLEG', 'PCEG'],
    niveauxEtudes: ['Baccalauréat', 'Licence/Bachelor', 'Master', 'Doctorat/PhD', 'DIPES I', 'DIPES II', 'Agrégation'],
    matieres: ['Mathématiques', 'Physique', 'Chimie', 'SVT', 'Français', 'Anglais', 'Histoire-Géo', 'Philosophie', 'EPS', 'Informatique', 'Économie']
  },

  // Couleurs Material Design 3.0
  colors: {
    primary: '#1e40af', primaryLight: '#3b82f6', primaryDark: '#1e3a8a',
    success: '#22c55e', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6',
    gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
            400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
            800: '#1f2937', 900: '#111827' }
  },

  // Configuration salaire
  salaire: {
    tauxCNPS: 0.0425,              // 4.25%
    tauxIRPP: [                     // Barème progressif Cameroun
      { min: 0, max: 2000000, taux: 0.10 },
      { min: 2000001, max: 3000000, taux: 0.15 },
      { min: 3000001, max: 5000000, taux: 0.25 },
      { min: 5000001, max: Infinity, taux: 0.35 }
    ],
    primeAnciennete: {              // Par année
      1: 0.02, 3: 0.05, 5: 0.08, 10: 0.12, 15: 0.15, 20: 0.20
    }
  },

  // Informations établissement
  etablissement: {
    nom: 'WARAP ÉCOLE',
    ville: 'Garoua',
    region: 'Nord',
    directeur: 'M. le Directeur'
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// 📊 INITIALISATION SYSTÈME PERSONNEL V6.0
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise le système complet Personnel V6.0
 */
function initPersonnelSystemV6() {
  try {
    Logger.log('🚀 Initialisation Système Personnel V6.0...');

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Créer/récupérer feuilles
    var sheetPersonnel = initPersonnelSheet(ss);
    var sheetDashboard = initPersonnelDashboard(ss);
    var sheetAffectations = initAffectationsSheet(ss);
    var sheetAbsences = initAbsencesPersonnelSheet(ss);
    var sheetEvaluations = initEvaluationsSheet(ss);
    var sheetSalaires = initSalairesSheet(ss);
    var sheetAnalytics = initAnalyticsRHSheet(ss);

    // 2. Configurer dashboards
    setupPersonnelDashboardFormulas(sheetDashboard);

    // 3. Créer graphiques
    createPersonnelCharts(sheetDashboard);

    Logger.log('✅ Système Personnel V6.0 initialisé avec succès !');

    SpreadsheetApp.getUi().alert(
      '✅ SUCCÈS',
      'Système Personnel V6.0 ULTIMATE initialisé avec succès !\n\n' +
      '📊 Feuilles créées:\n' +
      '• Personnel principal\n' +
      '• Dashboard temps réel\n' +
      '• Affectations cours\n' +
      '• Absences\n' +
      '• Évaluations\n' +
      '• Salaires\n' +
      '• Analytics RH',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

    return {
      success: true,
      message: '✅ Système Personnel V6.0 opérationnel !'
    };

  } catch (error) {
    Logger.log('❌ Erreur initialisation: ' + error);
    SpreadsheetApp.getUi().alert('❌ ERREUR', 'Erreur initialisation: ' + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
    return {
      success: false,
      message: '❌ Erreur: ' + error.message
    };
  }
}

/**
 * Initialise la feuille Personnel principale
 */
function initPersonnelSheet(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.personnel;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // Headers
    var headers = [
      '🆔 ID', '📋 Matricule', '👤 Nom', '👤 Prénom', '👤 Nom Complet',
      '📅 Date Naissance', '🏙️ Lieu Naissance', '⚧ Sexe', '🌍 Nationalité', '🆔 N° CNI',
      '📧 Email', '📞 Tél', '📞 Tél 2', '🏠 Adresse', '🏙️ Ville', '🏘️ Quartier',
      '💼 Type', '👔 Fonction', '🎓 Diplôme', '📚 Niveau Études',
      '📜 Spécialité', '📚 Matières', '📅 Date Embauche',
      '📅 Fin Contrat', '📋 Type Contrat', '✅ Statut', '🎯 Grade', '📊 Échelon',
      '💰 Salaire Base', '💰 Primes', '💰 Indemnités', '💰 Charges', '💰 Salaire Net',
      '🏦 N° Compte', '🏦 Banque', '📞 Contact Urgence', '📞 Tél Urgence',
      '🏥 N° CNPS', '📋 N° Contrib', '📸 Photo', '🎫 Badge',
      '🔗 Classes IDs', '📋 Classes', '🔗 Prof Principal ID', '🎓 Prof Principal',
      '📊 Heures/Sem', '📊 Taux Charge', '⭐ Éval', '📅 Date Éval',
      '🏆 Distinctions', '❌ Absences', '⏰ Retards', '🏷️ Tags',
      '📝 Notes', '⚠️ Alertes', '👤 Créé Par', '📅 Créé Le',
      '✏️ Modifié Par', '📅 Modifié Le', '🔐 Hash'
    ];

    sheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setBackground(CONFIG_PERSONNEL_V6.colors.primary)
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(9)
      .setHorizontalAlignment('center')
      .setWrap(true);

    sheet.setRowHeight(1, 60);

    // Largeurs colonnes optimales
    var widths = [
      150, 130, 130, 130, 180, 120, 120, 100, 120, 130,
      180, 120, 120, 200, 120, 120, 150, 150, 150, 150,
      150, 200, 120, 120, 130, 120, 150, 100, 140, 140,
      140, 140, 140, 200, 150, 180, 120, 130, 130, 150,
      150, 150, 200, 150, 200, 120, 120, 100, 120, 200,
      100, 100, 150, 300, 200, 150, 150, 150, 150, 150
    ];

    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }

    // Figer lignes/colonnes
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(3);

    // Appliquer validations
    applyPersonnelValidationsV6(sheet);

    // Appliquer formules
    applyPersonnelFormulasV6(sheet);

    // Couleur onglet
    sheet.setTabColor(CONFIG_PERSONNEL_V6.colors.primary);

    Logger.log('✅ Feuille Personnel créée');
  }

  return sheet;
}

/**
 * Applique les validations de données V6.0
 */
function applyPersonnelValidationsV6(sheet) {
  var lastRow = 2000;
  var col = CONFIG_PERSONNEL_V6.col;
  var dd = CONFIG_PERSONNEL_V6.dropdowns;

  // Validation Sexe
  sheet.getRange(2, col.Sexe, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.sexe, true).setAllowInvalid(false).build());

  // Validation Type Personnel
  sheet.getRange(2, col.Type_Personnel, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.typePersonnel, true).setAllowInvalid(false).build());

  // Validation Type Contrat
  sheet.getRange(2, col.Type_Contrat, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.typeContrat, true).setAllowInvalid(false).build());

  // Validation Statut Emploi
  sheet.getRange(2, col.Statut_Emploi, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.statutEmploi, true).setAllowInvalid(false).build());

  // Validation Ville
  sheet.getRange(2, col.Ville, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.villes, true).setAllowInvalid(true).build());

  // Validation Banque
  sheet.getRange(2, col.Banque, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.banques, true).setAllowInvalid(true).build());

  // Validation Grade
  sheet.getRange(2, col.Grade, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.grades, true).setAllowInvalid(true).build());

  // Validation Niveau Études
  sheet.getRange(2, col.Niveau_Etudes, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(dd.niveauxEtudes, true).setAllowInvalid(true).build());

  // Validation Email
  sheet.getRange(2, col.Email, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireTextIsEmail().setAllowInvalid(true).build());

  // Formats dates
  sheet.getRange(2, col.Date_Naissance, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(2, col.Date_Embauche, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(2, col.Date_Fin_Contrat, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(2, col.Date_Derniere_Evaluation, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(2, col.Date_Creation, lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange(2, col.Date_Modification, lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');

  // Formats montants XAF
  var formatXAF = '#,##0 "XAF"';
  sheet.getRange(2, col.Salaire_Base, lastRow, 1).setNumberFormat(formatXAF);
  sheet.getRange(2, col.Primes_Mensuelles, lastRow, 1).setNumberFormat(formatXAF);
  sheet.getRange(2, col.Indemnites, lastRow, 1).setNumberFormat(formatXAF);
  sheet.getRange(2, col.Charges_Sociales, lastRow, 1).setNumberFormat(formatXAF);
  sheet.getRange(2, col.Salaire_Net, lastRow, 1).setNumberFormat(formatXAF);

  // Format pourcentage
  sheet.getRange(2, col.Taux_Charge, lastRow, 1).setNumberFormat('0.00"%"');

  Logger.log('✅ Validations appliquées');
}

/**
 * Applique les formules automatiques V6.0 (FORMULES ANGLAISES)
 */
function applyPersonnelFormulasV6(sheet) {
  var col = CONFIG_PERSONNEL_V6.col;

  // ✅ FORMULE 1: Nom_Complet = CONCATENATE(Nom, " ", Prenom)
  var formulaNom = '=IF(AND(LEN(C2)>0,LEN(D2)>0),CONCATENATE(C2," ",D2),"")';
  sheet.getRange(2, col.Nom_Complet).setFormula(formulaNom);

  // ✅ FORMULE 2: Salaire_Net = Base + Primes + Indemnités - Charges
  var formulaSalaire = '=IF(AC2>0,AC2+AD2+AE2-AF2,0)';
  sheet.getRange(2, col.Salaire_Net).setFormula(formulaSalaire);

  // ✅ FORMULE 3: Taux_Charge = Heures_Semaine / 40
  var formulaTaux = '=IF(AT2>0,AT2/40,0)';
  sheet.getRange(2, col.Taux_Charge).setFormula(formulaTaux);

  Logger.log('✅ Formules appliquées');
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 DASHBOARD PERSONNEL DYNAMIQUE V6.0
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise le Dashboard Personnel
 */
function initPersonnelDashboard(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.dashboard;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // Header principal
    sheet.getRange('A1:T1')
      .merge()
      .setValue('📊 DASHBOARD GESTION DU PERSONNEL - TEMPS RÉEL')
      .setBackground(CONFIG_PERSONNEL_V6.colors.primaryDark)
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(20)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.setRowHeight(1, 80);

    // Date/Heure mise à jour
    sheet.getRange('A2:T2')
      .merge()
      .setFormula('="📅 Dernière mise à jour: "&TEXT(NOW(),"DD/MM/YYYY HH:MM:SS")')
      .setBackground(CONFIG_PERSONNEL_V6.colors.gray[100])
      .setFontSize(11)
      .setHorizontalAlignment('center')
      .setFontStyle('italic');

    sheet.setRowHeight(2, 35);

    // Couleur onglet
    sheet.setTabColor('#8b5cf6');

    Logger.log('✅ Dashboard créé');
  }

  return sheet;
}

/**
 * Configure les formules du dashboard (FORMULES ANGLAISES)
 */
function setupPersonnelDashboardFormulas(sheet) {
  var personnelSheet = CONFIG_PERSONNEL_V6.sheets.personnel;
  var colors = CONFIG_PERSONNEL_V6.colors;

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 1: KPIs PRINCIPAUX
  // ═══════════════════════════════════════════════════════════════════════

  sheet.getRange('A4:T4')
    .merge()
    .setValue('📈 INDICATEURS CLÉS')
    .setBackground(colors.gray[800])
    .setFontColor('#FFFFFF')
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.setRowHeight(4, 50);

  // KPI 1: Total Personnel
  sheet.getRange('A6:D6').merge().setValue('👥 TOTAL PERSONNEL')
    .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

  sheet.getRange('A7:D7').merge()
    .setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!A:A,">A1")-1,0)')
    .setBackground(colors.primary).setFontColor('#FFFFFF')
    .setFontWeight('bold').setFontSize(28).setHorizontalAlignment('center')
    .setNumberFormat('#,##0');

  sheet.setRowHeight(7, 70);

  // KPI 2: Personnel Actif
  sheet.getRange('E6:H6').merge().setValue('✅ ACTIFS')
    .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

  sheet.getRange('E7:H7').merge()
    .setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!Z:Z,"✅ Actif"),0)')
    .setBackground(colors.success).setFontColor('#FFFFFF')
    .setFontWeight('bold').setFontSize(28).setHorizontalAlignment('center')
    .setNumberFormat('#,##0');

  // KPI 3: Enseignants
  sheet.getRange('I6:L6').merge().setValue('👨‍🏫 ENSEIGNANTS')
    .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

  sheet.getRange('I7:L7').merge()
    .setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!Q:Q,"*Enseignant*"),0)')
    .setBackground(colors.info).setFontColor('#FFFFFF')
    .setFontWeight('bold').setFontSize(28).setHorizontalAlignment('center')
    .setNumberFormat('#,##0');

  // KPI 4: Masse Salariale
  sheet.getRange('M6:P6').merge().setValue('💰 MASSE SALARIALE')
    .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

  sheet.getRange('M7:P7').merge()
    .setFormula('=IFERROR(SUMIF(\'' + personnelSheet + '\'!Z:Z,"✅ Actif",\'' + personnelSheet + '\'!AG:AG),0)')
    .setBackground('#8b5cf6').setFontColor('#FFFFFF')
    .setFontWeight('bold').setFontSize(24).setHorizontalAlignment('center')
    .setNumberFormat('#,##0 "XAF"');

  // KPI 5: Salaire Moyen
  sheet.getRange('Q6:T6').merge().setValue('📊 SALAIRE MOYEN')
    .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

  sheet.getRange('Q7:T7').merge()
    .setFormula('=IFERROR(AVERAGEIF(\'' + personnelSheet + '\'!Z:Z,"✅ Actif",\'' + personnelSheet + '\'!AG:AG),0)')
    .setBackground(colors.warning).setFontColor('#FFFFFF')
    .setFontWeight('bold').setFontSize(24).setHorizontalAlignment('center')
    .setNumberFormat('#,##0 "XAF"');

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 2: RÉPARTITION PAR TYPE
  // ═══════════════════════════════════════════════════════════════════════

  sheet.getRange('A10:J10')
    .merge()
    .setValue('📊 RÉPARTITION PAR TYPE DE PERSONNEL')
    .setBackground(colors.gray[800])
    .setFontColor('#FFFFFF')
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.setRowHeight(10, 50);

  // Headers tableau
  var headersType = ['💼 Type Personnel', '👥 Nombre', '📊 Pourcentage', '💰 Masse Salariale'];
  sheet.getRange('A12:D12').setValues([headersType])
    .setBackground(colors.gray[200])
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Données
  var types = CONFIG_PERSONNEL_V6.dropdowns.typePersonnel;
  var row = 13;

  types.forEach(function(type) {
    sheet.getRange(row, 1).setValue(type);
    sheet.getRange(row, 2).setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!Q:Q,"' + type + '"),0)');
    sheet.getRange(row, 3).setFormula('=IFERROR(B' + row + '/SUM($B$13:$B$' + (12 + types.length) + ')*100,0)');
    sheet.getRange(row, 4).setFormula('=IFERROR(SUMIF(\'' + personnelSheet + '\'!Q:Q,"' + type + '",\'' + personnelSheet + '\'!AG:AG),0)');

    sheet.getRange(row, 3).setNumberFormat('0.00"%"');
    sheet.getRange(row, 4).setNumberFormat('#,##0 "XAF"');

    row++;
  });

  // Total
  sheet.getRange(row, 1).setValue('📊 TOTAL').setFontWeight('bold');
  sheet.getRange(row, 2).setFormula('=SUM(B13:B' + (row - 1) + ')').setFontWeight('bold').setNumberFormat('#,##0');
  sheet.getRange(row, 3).setFormula('=SUM(C13:C' + (row - 1) + ')').setFontWeight('bold').setNumberFormat('0.00"%"');
  sheet.getRange(row, 4).setFormula('=SUM(D13:D' + (row - 1) + ')').setFontWeight('bold').setNumberFormat('#,##0 "XAF"');

  sheet.getRange('A' + row + ':D' + row).setBackground(colors.gray[200]);

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 3: RÉPARTITION PAR STATUT
  // ═══════════════════════════════════════════════════════════════════════

  sheet.getRange('L10:T10')
    .merge()
    .setValue('✅ RÉPARTITION PAR STATUT')
    .setBackground(colors.gray[800])
    .setFontColor('#FFFFFF')
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Headers
  var headersStatut = ['✅ Statut', '👥 Nombre', '📊 %'];
  sheet.getRange('L12:N12').setValues([headersStatut])
    .setBackground(colors.gray[200])
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Données
  var statuts = CONFIG_PERSONNEL_V6.dropdowns.statutEmploi;
  var rowS = 13;

  statuts.forEach(function(statut) {
    sheet.getRange(rowS, 12).setValue(statut);
    sheet.getRange(rowS, 13).setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!Z:Z,"' + statut + '"),0)');
    sheet.getRange(rowS, 14).setFormula('=IFERROR(M' + rowS + '/SUM($M$13:$M$' + (12 + statuts.length) + ')*100,0)');

    sheet.getRange(rowS, 14).setNumberFormat('0.00"%"');

    // Couleurs conditionnelles
    var bgColor = colors.gray[100];
    if (statut.indexOf('Actif') > -1) bgColor = '#d1fae5';
    else if (statut.indexOf('Congé') > -1) bgColor = '#fef3c7';
    else if (statut.indexOf('Licencié') > -1 || statut.indexOf('Démissionnaire') > -1) bgColor = '#fee2e2';

    sheet.getRange('L' + rowS + ':N' + rowS).setBackground(bgColor);

    rowS++;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 4: ANCIENNETÉ
  // ═══════════════════════════════════════════════════════════════════════

  var rowAnc = row + 3;

  sheet.getRange('A' + rowAnc + ':J' + rowAnc)
    .merge()
    .setValue('📅 RÉPARTITION PAR ANCIENNETÉ')
    .setBackground(colors.gray[800])
    .setFontColor('#FFFFFF')
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.setRowHeight(rowAnc, 50);

  rowAnc += 2;

  // Headers
  var headersAnc = ['📅 Ancienneté', '👥 Nombre', '📊 %'];
  sheet.getRange('A' + rowAnc + ':C' + rowAnc).setValues([headersAnc])
    .setBackground(colors.gray[200])
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  rowAnc++;

  // Moins de 1 an
  sheet.getRange(rowAnc, 1).setValue('< 1 an');
  sheet.getRange(rowAnc, 2).setFormula('=IFERROR(COUNTIFS(\'' + personnelSheet + '\'!W:W,">="&TODAY()-365,\'' + personnelSheet + '\'!W:W,"<>"),0)');
  sheet.getRange(rowAnc, 3).setFormula('=IFERROR(B' + rowAnc + '/$B$7*100,0)').setNumberFormat('0.00"%"');
  rowAnc++;

  // 1 à 3 ans
  sheet.getRange(rowAnc, 1).setValue('1 - 3 ans');
  sheet.getRange(rowAnc, 2).setFormula('=IFERROR(COUNTIFS(\'' + personnelSheet + '\'!W:W,">="&TODAY()-1095,\'' + personnelSheet + '\'!W:W,"<"&TODAY()-365),0)');
  sheet.getRange(rowAnc, 3).setFormula('=IFERROR(B' + rowAnc + '/$B$7*100,0)').setNumberFormat('0.00"%"');
  rowAnc++;

  // 3 à 5 ans
  sheet.getRange(rowAnc, 1).setValue('3 - 5 ans');
  sheet.getRange(rowAnc, 2).setFormula('=IFERROR(COUNTIFS(\'' + personnelSheet + '\'!W:W,">="&TODAY()-1825,\'' + personnelSheet + '\'!W:W,"<"&TODAY()-1095),0)');
  sheet.getRange(rowAnc, 3).setFormula('=IFERROR(B' + rowAnc + '/$B$7*100,0)').setNumberFormat('0.00"%"');
  rowAnc++;

  // Plus de 5 ans
  sheet.getRange(rowAnc, 1).setValue('> 5 ans');
  sheet.getRange(rowAnc, 2).setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!W:W,"<"&TODAY()-1825),0)');
  sheet.getRange(rowAnc, 3).setFormula('=IFERROR(B' + rowAnc + '/$B$7*100,0)').setNumberFormat('0.00"%"');

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 5: ALERTES
  // ═══════════════════════════════════════════════════════════════════════

  var rowAlert = rowAnc + 3;

  sheet.getRange('A' + rowAlert + ':T' + rowAlert)
    .merge()
    .setValue('⚠️ ALERTES & NOTIFICATIONS')
    .setBackground(colors.error)
    .setFontColor('#FFFFFF')
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.setRowHeight(rowAlert, 50);

  rowAlert += 2;

  // Contrats à renouveler (< 30 jours)
  sheet.getRange('A' + rowAlert + ':H' + rowAlert)
    .merge()
    .setValue('📋 CONTRATS À RENOUVELER (< 30 JOURS)')
    .setBackground(colors.warning)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A' + (rowAlert + 1) + ':H' + (rowAlert + 1))
    .merge()
    .setFormula('=IFERROR(COUNTIFS(\'' + personnelSheet + '\'!X:X,">="&TODAY(),\'' + personnelSheet + '\'!X:X,"<="&TODAY()+30),0)')
    .setBackground('#fef3c7')
    .setFontWeight('bold')
    .setFontSize(24)
    .setHorizontalAlignment('center')
    .setNumberFormat('#,##0');

  sheet.setRowHeight(rowAlert + 1, 60);

  // Absences > 5
  sheet.getRange('I' + rowAlert + ':P' + rowAlert)
    .merge()
    .setValue('❌ PERSONNEL AVEC ABSENCES > 5')
    .setBackground(colors.error)
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('I' + (rowAlert + 1) + ':P' + (rowAlert + 1))
    .merge()
    .setFormula('=IFERROR(COUNTIF(\'' + personnelSheet + '\'!AY:AY,">5"),0)')
    .setBackground('#fee2e2')
    .setFontWeight('bold')
    .setFontSize(24)
    .setHorizontalAlignment('center')
    .setNumberFormat('#,##0');

  Logger.log('✅ Formules dashboard configurées');
}

/**
 * Crée les graphiques du dashboard
 */
function createPersonnelCharts(sheet) {
  try {
    // Supprimer graphiques existants
    var charts = sheet.getCharts();
    charts.forEach(function(chart) {
      sheet.removeChart(chart);
    });

    // Graphique 1: Répartition par type (Camembert)
    var chartType = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange('A12:B' + (12 + CONFIG_PERSONNEL_V6.dropdowns.typePersonnel.length)))
      .setPosition(5, 7, 0, 0)
      .setOption('title', 'Répartition par Type de Personnel')
      .setOption('pieHole', 0.4)
      .setOption('legend', { position: 'right' })
      .setOption('colors', ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6'])
      .build();

    sheet.insertChart(chartType);

    // Graphique 2: Masse salariale par type (Barres)
    var chartSalaire = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange('A12:A' + (12 + CONFIG_PERSONNEL_V6.dropdowns.typePersonnel.length)))
      .addRange(sheet.getRange('D12:D' + (12 + CONFIG_PERSONNEL_V6.dropdowns.typePersonnel.length)))
      .setPosition(5, 15, 0, 0)
      .setOption('title', 'Masse Salariale par Type')
      .setOption('vAxis', { title: 'Montant (XAF)' })
      .setOption('colors', ['#22c55e'])
      .setOption('bar', { groupWidth: '75%' })
      .build();

    sheet.insertChart(chartSalaire);

    Logger.log('✅ Graphiques créés');

  } catch (error) {
    Logger.log('⚠️ Erreur création graphiques: ' + error);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🛠️ UTILITAIRES DE BASE
// ═══════════════════════════════════════════════════════════════════════════

function generateUniqueID(prefix) {
  return (prefix || 'ID') + '-' + new Date().getTime().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function generateHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
}

function logActionV6(action, data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName('📝_Logs_Systeme');
    if (!logSheet) {
      logSheet = ss.insertSheet('📝_Logs_Systeme');
      logSheet.appendRow(['📅 Date', '⚡ Action', '👤 Utilisateur', '📊 Données']);
    }
    logSheet.appendRow([new Date(), action, Session.getActiveUser().getEmail(), JSON.stringify(data)]);
  } catch (e) {
    Logger.log('⚠️ Erreur log: ' + e);
  }
}

function rafraichirDashboardPersonnel() {
  SpreadsheetApp.flush();
}

function getPersonnelConfigV6() {
  return CONFIG_PERSONNEL_V6;
}
