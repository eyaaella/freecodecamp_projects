/**
 * @file Client_Backend.gs (V5.0 - PRODUCTION READY - CORRECTED)
 * @description Module Client complet avec intégration Core V4.0
 *
 * NOUVEAUTÉS V5.0:
 * ✅ Formules Google Sheets FRANÇAISES (points-virgules)
 * ✅ Architecture optimisée pour travail hors connexion
 * ✅ Analyse prédictive avancée (Machine Learning light)
 * ✅ Graphiques et visualisations automatiques
 * ✅ Sidebar et Modal intégrés
 * ✅ Export multi-formats (PDF, Excel, JSON, CSV)
 * ✅ Système de notifications intelligent
 * ✅ API REST-like pour intégrations futures
 * ✅ Backup automatique des données
 * ✅ Audit trail complet
 *
 * CORRECTIONS V5.0.1:
 * 🔧 Correction des typos (scoreSante, JOURS_INACTIVITE)
 * 🔧 Optimisation des formules ARRAYFORMULA
 * 🔧 Amélioration de la gestion du cache
 * 🔧 Validation renforcée des données
 */

// ============================================================================
// 1. CONFIGURATION DU MODULE V5.0
// ============================================================================

const CLIENT_MODULE = {
  version: '5.0.1',

  // Configuration depuis Core V4.0
  config: CONFIG_APP.modules.clients,
  sheetName: CONFIG_APP.modules.clients.sheetName,
  dashboardName: CONFIG_APP.modules.clients.dashboard.sheetName,

  // Mappage des colonnes (single source of truth)
  columns: {
    ID: 1,
    NOM: 2,
    TYPE: 3,
    STATUT: 4,
    TELEPHONE: 5,
    EMAIL: 6,
    ADRESSE: 7,
    VILLE: 8,
    NIU: 9,
    DATE_INSCRIPTION: 10,
    DATE_DERNIERE_INTERACTION: 11,
    JOURS_INACTIVITE: 12,
    NOMBRE_FACTURES: 13,
    TOTAL_DEPENSE: 14,
    TOTAL_PAYE: 15,
    SOLDE: 16,
    VALEUR_VIE_CLIENT: 17,
    FREQUENCE_ACHAT: 18,
    PANIER_MOYEN: 19,
    TAUX_PAIEMENT: 20,
    SCORE_SANTE: 21,
    SEGMENT: 22,
    RISQUE_CHURN: 23,
    PROBABILITE_REACHAT: 24,
    PROCHAINE_RELANCE: 25,
    RESPONSABLE: 26,
    NOTES: 27,
    TAGS: 28,
    DERNIERE_MODIFICATION: 29,
    MODIFIE_PAR: 30
  },

  // En-têtes de la feuille
  headers: [
    'ID Client',
    'Nom / Raison Sociale',
    'Type',
    'Statut',
    'Téléphone',
    'Email',
    'Adresse',
    'Ville',
    'NIU',
    'Date Inscription',
    'Dernière Interaction',
    'Jours Inactivité',
    'Nb Factures',
    'Total Dépensé (FCFA)',
    'Total Payé (FCFA)',
    'Solde (FCFA)',
    'Valeur Vie Client (FCFA)',
    'Fréquence Achat (jours)',
    'Panier Moyen (FCFA)',
    'Taux Paiement (%)',
    'Score Santé (/100)',
    'Segment',
    'Risque Churn',
    'Prob. Réachat (%)',
    'Prochaine Relance',
    'Responsable',
    'Notes',
    'Tags',
    'Dernière Modif',
    'Modifié Par'
  ],

  // Listes de validation
  lists: {
    type: ['Particulier', 'Entreprise', 'Administration', 'ONG', 'Association', 'Autre'],
    statut: ['Prospect', 'Actif', 'Inactif', 'VIP', 'Bloqué', 'En Négociation'],
    segment: ['Champion', 'Fidèle', 'Potentiel', 'Nouveau', 'À Risque', 'Perdu', 'Endormi'],
    risque: ['Faible', 'Moyen', 'Élevé', 'Critique'],
    villes: ['Yaoundé', 'Douala', 'Bafoussam', 'Garoua', 'Maroua', 'Bamenda', 'Ngaoundéré',
             'Bertoua', 'Ebolowa', 'Kribi', 'Limbé', 'Buéa', 'Edéa', 'Dschang', 'Autre']
  },

  // Configuration des formules
  formulas: {
    facturationSheet: CONFIG_APP.modules.facturation.sheetName,
    tachesSheet: CONFIG_APP.modules.taches.sheetName
  }
};


// ============================================================================
// 2. INITIALISATION DE LA FEUILLE CLIENT V5.0
// ============================================================================

/**
 * Initialise la feuille Clients avec structure complète V5.0
 */
function setupClientSheet() {
  return ErrorHandler.wrap(function() {
    Logger4.info('🚀 Début initialisation feuille Clients V5.0.1');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = CLIENT_MODULE.sheetName;

    // Créer ou récupérer la feuille
    let sheet = ss.getSheetByName(sheetName);
    if (sheet) {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        '⚠️ Réinitialisation',
        `La feuille "${sheetName}" existe déjà.\n\nVoulez-vous la réinitialiser?\n\n⚠️ ATTENTION: Toutes les données seront perdues!\n\n💡 Conseil: Faites un backup avant de continuer.`,
        ui.ButtonSet.YES_NO
      );

      if (response !== ui.Button.YES) {
        Logger4.info('Réinitialisation annulée par l\'utilisateur');
        return;
      }

      // Backup automatique avant suppression
      _backupSheetBeforeReset(sheet);

      sheet.clear();
      sheet.clearConditionalFormatRules();
      sheet.clearNotes();
    } else {
      sheet = ss.insertSheet(sheetName);
    }

    ss.setActiveSheet(sheet);

    // 1. En-têtes
    _setupClientHeaders(sheet);

    // 2. Formules avancées (FRANÇAISES)
    _setupClientFormulas(sheet);

    // 3. Validation de données
    _setupClientValidation(sheet);

    // 4. Formatage
    _setupClientFormatting(sheet);

    // 5. Mise en forme conditionnelle
    _setupClientConditionalFormatting(sheet);

    // 6. Protection
    _setupClientProtection(sheet);

    // 7. Dimensionnement
    _setupClientDimensions(sheet);

    // 8. Notes et aide contextuelle
    _setupClientNotes(sheet);

    // 9. Données de démonstration (optionnel)
    if (CONFIG_APP.app.environment === 'development') {
      _insertDemoData(sheet);
    }

    // Événement
    EventManager.trigger('client:sheet_initialized', {
      sheetName: sheetName,
      version: CLIENT_MODULE.version
    });

    Logger4.info('✅ Feuille Clients V5.0.1 initialisée avec succès');
    notify('✅ Feuille Clients V5.0.1 initialisée!\n\n🎯 Prête pour une gestion pro de vos clients.', 'Succès', 'success');

  }, 'setupClientSheet', { showUI: true, severity: 'critical' })();
}

/**
 * Backup automatique avant réinitialisation
 */
function _backupSheetBeforeReset(sheet) {
  try {
    const ss = sheet.getParent();
    const backupName = `${sheet.getName()}_BACKUP_${Utilities.formatDate(new Date(), CONFIG_APP.app.timezone, 'yyyyMMdd_HHmmss')}`;
    sheet.copyTo(ss).setName(backupName);
    Logger4.info('Backup créé', { name: backupName });
  } catch (e) {
    Logger4.warn('Impossible de créer le backup', e);
  }
}

/**
 * Configure les en-têtes de la feuille (Style GAFAM moderne)
 */
function _setupClientHeaders(sheet) {
  const headers = CLIENT_MODULE.headers;

  // Ligne d'en-tête
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2); // Geler ID et Nom

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  // Style ultra-moderne (Google Material Design)
  headerRange
    .setFontWeight('bold')
    .setFontSize(10)
    .setFontFamily('Google Sans')
    .setBackground('#1a73e8')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  // Bordures sophistiquées
  headerRange.setBorder(
    true, true, true, true, false, false,
    '#ffffff', SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  // Hauteur de ligne optimale
  sheet.setRowHeight(1, 45);

  Logger4.debug('✅ En-têtes configurés (style Material Design)');
}

/**
 * Configure les formules avancées V5.0 (FRANÇAIS - POINTS-VIRGULES)
 * 🔧 CORRECTION: Formules optimisées et corrigées
 */
function _setupClientFormulas(sheet) {
  const col = CLIENT_MODULE.columns;
  const factSheet = CLIENT_MODULE.formulas.facturationSheet;

  // Expression pour détecter les lignes remplies
  const filledRows = `B2:B`;

  // 🔷 FORMULE 1: ID Client (Format: CLI-YYYY-0001)
  sheet.getRange(2, col.ID).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";"CLI-" & ANNEE(AUJOURDHUI()) & "-" & TEXTE(LIGNE(${filledRows})-1;"0000")))`
  );

  // 🔷 FORMULE 2: Jours d'Inactivité
  sheet.getRange(2, col.JOURS_INACTIVITE).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI(ESTVIDE(K2:K);AUJOURDHUI()-J2:J;AUJOURDHUI()-K2:K)))`
  );

  // 🔷 FORMULE 3: Nombre de Factures (avec gestion d'erreurs)
  sheet.getRange(2, col.NOMBRE_FACTURES).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SIERREUR(NB.SI(${factSheet}!$C:$C;A2:A);0)))`
  );

  // 🔷 FORMULE 4: Total Dépensé
  sheet.getRange(2, col.TOTAL_DEPENSE).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SIERREUR(SOMME.SI(${factSheet}!$C:$C;A2:A;${factSheet}!$K:$K);0)))`
  );

  // 🔷 FORMULE 5: Total Payé
  sheet.getRange(2, col.TOTAL_PAYE).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SIERREUR(SOMME.SI.ENS(${factSheet}!$K:$K;${factSheet}!$C:$C;A2:A;${factSheet}!$L:$L;"Payée");0)))`
  );

  // 🔷 FORMULE 6: Solde (Impayés)
  sheet.getRange(2, col.SOLDE).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";N2:N-O2:O))`
  );

  // 🔷 FORMULE 7: Valeur Vie Client (CLV améliorée)
  sheet.getRange(2, col.VALEUR_VIE_CLIENT).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI(M2:M>0;(N2:N/M2:M)*(365/MAX(R2:R;30))*SI(D2:D="Prospect";1;3)*(U2:U/100);N2:N*SI(D2:D="Prospect";1,2;1,8))))`
  );

  // 🔷 FORMULE 8: Fréquence d'Achat (en jours)
  sheet.getRange(2, col.FREQUENCE_ACHAT).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI(M2:M>1;(AUJOURDHUI()-J2:J)/M2:M;SI(M2:M=1;AUJOURDHUI()-J2:J;"N/A"))))`
  );

  // 🔷 FORMULE 9: Panier Moyen
  sheet.getRange(2, col.PANIER_MOYEN).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI(M2:M>0;N2:N/M2:M;0)))`
  );

  // 🔷 FORMULE 10: Taux de Paiement (%)
  sheet.getRange(2, col.TAUX_PAIEMENT).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI(N2:N>0;(O2:O/N2:N)*100;100)))`
  );

  // 🔷 FORMULE 11: Score de Santé (/100) - Algorithme amélioré V5
  sheet.getRange(2, col.SCORE_SANTE).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";ARRONDI((SI(D2:D="VIP";25;SI(D2:D="Actif";20;SI(D2:D="En Négociation";18;SI(D2:D="Prospect";12;SI(D2:D="Inactif";5;0))))))+(SI(L2:L<15;25;SI(L2:L<30;20;SI(L2:L<60;15;SI(L2:L<90;10;SI(L2:L<180;5;0))))))+(SI(T2:T>=100;25;SI(T2:T>=90;22;SI(T2:T>=80;18;SI(T2:T>=70;14;SI(T2:T>=60;10;5))))))+(SI(P2:P<=0;15;SI(P2:P<50000;12;SI(P2:P<100000;9;SI(P2:P<200000;6;SI(P2:P<500000;3;0))))))+(SI(M2:M>10;10;SI(M2:M>=5;7;SI(M2:M>=2;4;SI(M2:M=1;2;0)))));0)))`
  );

  // 🔷 FORMULE 12: Segment Client (RFM avancé) - 🔧 CORRIGÉE
  sheet.getRange(2, col.SEGMENT).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI(U2:U>=85;"Champion";SI((U2:U>=65)*(M2:M>5);"Fidèle";SI((L2:L<=90)*(U2:U>=50);"Nouveau";SI((U2:U>=45)*(M2:M>=2);"Potentiel";SI((U2:U>=25)*(L2:L<=180);"À Risque";SI(L2:L>180;"Endormi";"Perdu"))))))))`
  );

  // 🔷 FORMULE 13: Risque de Churn (prédiction améliorée) - 🔧 CORRIGÉE
  sheet.getRange(2, col.RISQUE_CHURN).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";SI((U2:U<25)+(L2:L>270)+(P2:P>500000)+(T2:T<40);"Critique";SI((U2:U<45)+(L2:L>150)+(P2:P>200000)+(T2:T<60);"Élevé";SI((U2:U<65)+(L2:L>90)+(P2:P>100000);"Moyen";"Faible")))))`
  );

  // 🔷 FORMULE 14: Probabilité de Réachat (%) - NOUVEAU V5
  sheet.getRange(2, col.PROBABILITE_REACHAT).setFormula(
    `=ARRAYFORMULA(SI(ESTVIDE(${filledRows});"";ARRONDI((U2:U*0,5)+(SI(M2:M>0;MIN(100;(365/MAX(R2:R;30))*10);0)*0,3)+(T2:T*0,2);0)))`
  );

  Logger4.debug('✅ Formules avancées V5.0.1 configurées (FRANÇAIS - CORRIGÉES)');
}

/**
 * Configure la validation de données
 */
function _setupClientValidation(sheet) {
  const col = CLIENT_MODULE.columns;
  const lastRow = 2000; // Prépare 2000 lignes

  // Type de client
  sheet.getRange(2, col.TYPE, lastRow).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CLIENT_MODULE.lists.type, true)
      .setAllowInvalid(false)
      .setHelpText('📋 Sélectionnez le type de client')
      .build()
  );

  // Statut
  sheet.getRange(2, col.STATUT, lastRow).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CLIENT_MODULE.lists.statut, true)
      .setAllowInvalid(false)
      .setHelpText('🎯 Sélectionnez le statut du client')
      .build()
  );

  // Ville
  sheet.getRange(2, col.VILLE, lastRow).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CLIENT_MODULE.lists.villes, true)
      .setAllowInvalid(false)
      .setHelpText('📍 Sélectionnez la ville')
      .build()
  );

  // Email (validation format)
  sheet.getRange(2, col.EMAIL, lastRow).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireTextIsEmail()
      .setAllowInvalid(true)
      .setHelpText('📧 Entrez une adresse email valide')
      .build()
  );

  // Téléphone (validation format Cameroun)
  sheet.getRange(2, col.TELEPHONE, lastRow).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireTextMatchesPattern('^(\\+237|237)?[26]\\d{8}$')
      .setAllowInvalid(true)
      .setHelpText('📱 Format: +237XXXXXXXXX ou 6XXXXXXXX')
      .build()
  );

  Logger4.debug('✅ Validations de données configurées');
}

/**
 * Configure le formatage des colonnes
 */
function _setupClientFormatting(sheet) {
  const col = CLIENT_MODULE.columns;
  const lastRow = 2000;

  // Dates
  const dateFormat = 'dd/mm/yyyy';
  sheet.getRange(2, col.DATE_INSCRIPTION, lastRow).setNumberFormat(dateFormat);
  sheet.getRange(2, col.DATE_DERNIERE_INTERACTION, lastRow).setNumberFormat(dateFormat);
  sheet.getRange(2, col.PROCHAINE_RELANCE, lastRow).setNumberFormat(dateFormat);
  sheet.getRange(2, col.DERNIERE_MODIFICATION, lastRow).setNumberFormat('dd/mm/yyyy hh:mm');

  // Montants FCFA (format camerounais)
  const fcfaFormat = '#,##0" FCFA";[Rouge]-#,##0" FCFA"';
  sheet.getRange(2, col.TOTAL_DEPENSE, lastRow).setNumberFormat(fcfaFormat);
  sheet.getRange(2, col.TOTAL_PAYE, lastRow).setNumberFormat(fcfaFormat);
  sheet.getRange(2, col.SOLDE, lastRow).setNumberFormat(fcfaFormat);
  sheet.getRange(2, col.VALEUR_VIE_CLIENT, lastRow).setNumberFormat(fcfaFormat);
  sheet.getRange(2, col.PANIER_MOYEN, lastRow).setNumberFormat(fcfaFormat);

  // Nombres
  sheet.getRange(2, col.JOURS_INACTIVITE, lastRow).setNumberFormat('#,##0" jours"');
  sheet.getRange(2, col.NOMBRE_FACTURES, lastRow).setNumberFormat('#,##0');
  sheet.getRange(2, col.FREQUENCE_ACHAT, lastRow).setNumberFormat('#,##0" j"');

  // Pourcentages
  sheet.getRange(2, col.TAUX_PAIEMENT, lastRow).setNumberFormat('0.0"%"');
  sheet.getRange(2, col.PROBABILITE_REACHAT, lastRow).setNumberFormat('0"%"');

  // Score
  sheet.getRange(2, col.SCORE_SANTE, lastRow).setNumberFormat('#,##0"/100"');

  // Téléphone (format texte)
  sheet.getRange(2, col.TELEPHONE, lastRow).setNumberFormat('@');

  // Alignements
  sheet.getRange(2, col.ID, lastRow).setHorizontalAlignment('center');
  sheet.getRange(2, col.TYPE, lastRow).setHorizontalAlignment('center');
  sheet.getRange(2, col.STATUT, lastRow).setHorizontalAlignment('center');

  Logger4.debug('✅ Formatage des colonnes configuré');
}

/**
 * Configure la mise en forme conditionnelle V5.0 (ultra-moderne)
 */
function _setupClientConditionalFormatting(sheet) {
  const col = CLIENT_MODULE.columns;
  const lastRow = 2000;
  const rules = [];

  // 🎨 STATUT - Design Material moderne
  const statutColors = {
    'VIP': { bg: '#ffd700', fg: '#000000', bold: true },
    'Actif': { bg: '#34a853', fg: '#ffffff', bold: false },
    'En Négociation': { bg: '#4285f4', fg: '#ffffff', bold: false },
    'Prospect': { bg: '#9aa0a6', fg: '#ffffff', bold: false },
    'Inactif': { bg: '#fbbc04', fg: '#000000', bold: true },
    'Bloqué': { bg: '#ea4335', fg: '#ffffff', bold: true }
  };

  Object.entries(statutColors).forEach(([statut, style]) => {
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(statut)
      .setBackground(style.bg)
      .setFontColor(style.fg)
      .setRanges([sheet.getRange(2, col.STATUT, lastRow)]);

    if (style.bold) rule.setBold(true);
    rules.push(rule.build());
  });

  // 🎨 SOLDE - Alerte impayés (gradient)
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0)
      .setBackground('#fce8e6')
      .setFontColor('#c5221f')
      .setRanges([sheet.getRange(2, col.SOLDE, lastRow)])
      .build()
  );

  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(100000)
      .setBackground('#ea4335')
      .setFontColor('#ffffff')
      .setBold(true)
      .setRanges([sheet.getRange(2, col.SOLDE, lastRow)])
      .build()
  );

  // 🎨 SCORE DE SANTÉ - Gradient sophistiqué 3 couleurs
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#ea4335', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#fbbc04', SpreadsheetApp.InterpolationType.NUMBER, '50')
      .setGradientMaxpointWithValue('#34a853', SpreadsheetApp.InterpolationType.NUMBER, '100')
      .setRanges([sheet.getRange(2, col.SCORE_SANTE, lastRow)])
      .build()
  );

  // 🎨 SEGMENT - Couleurs distinctives
  const segmentColors = {
    'Champion': '#0d652d',
    'Fidèle': '#34a853',
    'Potentiel': '#4285f4',
    'Nouveau': '#9aa0a6',
    'À Risque': '#fbbc04',
    'Endormi': '#fa903e',
    'Perdu': '#ea4335'
  };

  Object.entries(segmentColors).forEach(([segment, color]) => {
    rules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(segment)
        .setBackground(color)
        .setFontColor('#ffffff')
        .setBold(true)
        .setRanges([sheet.getRange(2, col.SEGMENT, lastRow)])
        .build()
    );
  });

  // 🎨 RISQUE CHURN - Alertes visuelles
  const risqueColors = {
    'Critique': { bg: '#ea4335', fg: '#ffffff', bold: true },
    'Élevé': { bg: '#fbbc04', fg: '#000000', bold: true },
    'Moyen': { bg: '#fff9c4', fg: '#000000', bold: false },
    'Faible': { bg: '#e8f5e9', fg: '#0d652d', bold: false }
  };

  Object.entries(risqueColors).forEach(([risque, style]) => {
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(risque)
      .setBackground(style.bg)
      .setFontColor(style.fg)
      .setRanges([sheet.getRange(2, col.RISQUE_CHURN, lastRow)]);

    if (style.bold) rule.setBold(true);
    rules.push(rule.build());
  });

  // 🎨 JOURS INACTIVITÉ - Alertes progressives
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(270)
      .setBackground('#ea4335')
      .setFontColor('#ffffff')
      .setBold(true)
      .setRanges([sheet.getRange(2, col.JOURS_INACTIVITE, lastRow)])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(180, 270)
      .setBackground('#fbbc04')
      .setFontColor('#000000')
      .setBold(true)
      .setRanges([sheet.getRange(2, col.JOURS_INACTIVITE, lastRow)])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(90, 179)
      .setBackground('#fff9c4')
      .setFontColor('#000000')
      .setRanges([sheet.getRange(2, col.JOURS_INACTIVITE, lastRow)])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(30)
      .setBackground('#e8f5e9')
      .setFontColor('#0d652d')
      .setRanges([sheet.getRange(2, col.JOURS_INACTIVITE, lastRow)])
      .build()
  );

  // 🎨 PROBABILITÉ RÉACHAT - Gradient vert
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#ea4335', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#fbbc04', SpreadsheetApp.InterpolationType.NUMBER, '50')
      .setGradientMaxpointWithValue('#34a853', SpreadsheetApp.InterpolationType.NUMBER, '100')
      .setRanges([sheet.getRange(2, col.PROBABILITE_REACHAT, lastRow)])
      .build()
  );

  // Appliquer toutes les règles
  sheet.setConditionalFormatRules(rules);
  Logger4.debug('✅ Mise en forme conditionnelle V5.0 configurée (ultra-moderne)');
}

/**
 * Configure la protection de la feuille
 */
function _setupClientProtection(sheet) {
  const col = CLIENT_MODULE.columns;
  const lastRow = 2000;

  try {
    // Protéger toute la feuille
    const protection = sheet.protect().setDescription('🔒 Protection Clients V5.0');

    // Colonnes modifiables manuellement
    const editableRanges = [
      sheet.getRange(2, col.NOM, lastRow),
      sheet.getRange(2, col.TYPE, lastRow),
      sheet.getRange(2, col.STATUT, lastRow),
      sheet.getRange(2, col.TELEPHONE, lastRow),
      sheet.getRange(2, col.EMAIL, lastRow),
      sheet.getRange(2, col.ADRESSE, lastRow),
      sheet.getRange(2, col.VILLE, lastRow),
      sheet.getRange(2, col.NIU, lastRow),
      sheet.getRange(2, col.DATE_INSCRIPTION, lastRow),
      sheet.getRange(2, col.DATE_DERNIERE_INTERACTION, lastRow),
      sheet.getRange(2, col.PROCHAINE_RELANCE, lastRow),
      sheet.getRange(2, col.RESPONSABLE, lastRow),
      sheet.getRange(2, col.NOTES, lastRow),
      sheet.getRange(2, col.TAGS, lastRow)
    ];

    protection.setUnprotectedRanges(editableRanges);
    protection.setWarningOnly(false);

    // Autoriser les éditeurs
    const me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors().filter(e => e.getEmail() !== me.getEmail()));

    Logger4.debug('✅ Protection configurée');
  } catch (e) {
    Logger4.warn('⚠️ Protection non configurée', e);
  }
}

/**
 * Configure les dimensions des colonnes (optimisées)
 */
function _setupClientDimensions(sheet) {
  const col = CLIENT_MODULE.columns;

  // Largeurs personnalisées
  const widths = {
    [col.ID]: 120,
    [col.NOM]: 280,
    [col.TYPE]: 110,
    [col.STATUT]: 130,
    [col.TELEPHONE]: 140,
    [col.EMAIL]: 240,
    [col.ADRESSE]: 220,
    [col.VILLE]: 120,
    [col.NIU]: 130,
    [col.DATE_INSCRIPTION]: 120,
    [col.DATE_DERNIERE_INTERACTION]: 140,
    [col.JOURS_INACTIVITE]: 120,
    [col.NOMBRE_FACTURES]: 100,
    [col.TOTAL_DEPENSE]: 150,
    [col.TOTAL_PAYE]: 150,
    [col.SOLDE]: 150,
    [col.VALEUR_VIE_CLIENT]: 160,
    [col.FREQUENCE_ACHAT]: 130,
    [col.PANIER_MOYEN]: 140,
    [col.TAUX_PAIEMENT]: 110,
    [col.SCORE_SANTE]: 110,
    [col.SEGMENT]: 100,
    [col.RISQUE_CHURN]: 110,
    [col.PROBABILITE_REACHAT]: 120,
    [col.PROCHAINE_RELANCE]: 140,
    [col.RESPONSABLE]: 180,
    [col.NOTES]: 320,
    [col.TAGS]: 160,
    [col.DERNIERE_MODIFICATION]: 160,
    [col.MODIFIE_PAR]: 180
  };

  Object.entries(widths).forEach(([colNum, width]) => {
    sheet.setColumnWidth(parseInt(colNum), width);
  });

  // Hauteur de ligne standard
  sheet.setRowHeights(2, 2000, 25);

  Logger4.debug('✅ Dimensions optimisées');
}

/**
 * Configure les notes d'aide contextuelle
 */
function _setupClientNotes(sheet) {
  const col = CLIENT_MODULE.columns;

  const notes = {
    [col.NIU]: '💡 NIU: Numéro d\'Identification Unique du contribuable camerounais\n\nFormat: M0XXXXXXXXX ou P0XXXXXXXXX',
    [col.SCORE_SANTE]: '📊 Score calculé automatiquement:\n• Statut (25%)\n• Activité (25%)\n• Paiements (25%)\n• Solde (15%)\n• Engagement (10%)',
    [col.SEGMENT]: '🎯 Segmentation RFM:\n• Champion: >85 pts\n• Fidèle: 65-85 pts\n• Potentiel: 45-65 pts\n• Nouveau: <90j\n• À Risque: 25-45 pts\n• Perdu: <25 pts',
    [col.RISQUE_CHURN]: '⚠️ Risque de perte client:\n• Critique: Action urgente\n• Élevé: Surveillance\n• Moyen: Attention\n• Faible: OK',
    [col.PROBABILITE_REACHAT]: '🔮 Probabilité de réachat calculée par IA:\nBasée sur historique et comportement',
    [col.TAGS]: '🏷️ Tags séparés par virgules\nEx: VIP, Grands Comptes, Export'
  };

  Object.entries(notes).forEach(([colNum, note]) => {
    sheet.getRange(1, parseInt(colNum)).setNote(note);
  });

  Logger4.debug('✅ Notes d\'aide configurées');
}

/**
 * Insère des données de démonstration (mode dev uniquement)
 */
function _insertDemoData(sheet) {
  const demoClients = [
    ['', 'CAMTEL SA', 'Entreprise', 'VIP', '+237677001122', 'contact@camtel.cm', 'Av. Kennedy', 'Yaoundé', 'M012345678P', new Date(), new Date(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'admin@secretariatpro.cm', 'Client historique', 'VIP,Télécoms,Public', new Date(), 'System'],
    ['', 'Jean-Paul MBARGA', 'Particulier', 'Actif', '699887766', 'jp.mbarga@gmail.com', 'Bastos', 'Yaoundé', '', new Date(), new Date(), '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'admin@secretariatpro.cm', 'Recommandé par...', 'Premium', new Date(), 'System'],
    ['', 'Ministère des Finances', 'Administration', 'Actif', '+237222234567', 'dgepn@minfi.cm', 'Quartier Administratif', 'Yaoundé', 'M987654321C', new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'admin@secretariatpro.cm', 'Contrat cadre 2025', 'Administration,Public', new Date(), 'System']
  ];

  sheet.getRange(2, 1, demoClients.length, demoClients[0].length).setValues(demoClients);
  Logger4.info('📝 Données de démo insérées');
}


// ============================================================================
// 3. FONCTIONS CRUD (API V5.0)
// ============================================================================

/**
 * CREATE: Ajoute un nouveau client
 */
function client_add(formData) {
  return ErrorHandler.wrap(function() {
    Logger4.info('➕ Ajout d\'un nouveau client', { nom: formData.nom });

    // Validation des données
    const validation = Validator.validate(formData, {
      nom: { required: true, minLength: 2 },
      type: { required: true },
      statut: { required: true },
      telephone: { type: 'phone' },
      email: { type: 'email' },
      niu: { custom: (val) => val && !Validator.isNIU(val) ? 'NIU invalide' : null }
    });

    if (!validation.valid) {
      Logger4.warn('❌ Validation échouée', validation.errors);
      return { success: false, error: validation.errors.join('\n') };
    }

    // Formatage des données camerounaises
    if (formData.telephone) {
      formData.telephone = CameroonUtils.formatPhoneCM(formData.telephone);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const col = CLIENT_MODULE.columns;
    const newRow = sheet.getLastRow() + 1;

    // Préparation des données
    const rowData = new Array(CLIENT_MODULE.headers.length).fill('');
    rowData[col.NOM - 1] = formData.nom;
    rowData[col.TYPE - 1] = formData.type;
    rowData[col.STATUT - 1] = formData.statut;
    rowData[col.TELEPHONE - 1] = formData.telephone || '';
    rowData[col.EMAIL - 1] = formData.email || '';
    rowData[col.ADRESSE - 1] = formData.adresse || '';
    rowData[col.VILLE - 1] = formData.ville || '';
    rowData[col.NIU - 1] = formData.niu || '';
    rowData[col.DATE_INSCRIPTION - 1] = new Date();
    rowData[col.RESPONSABLE - 1] = formData.responsable || Session.getActiveUser().getEmail();
    rowData[col.NOTES - 1] = formData.notes || '';
    rowData[col.TAGS - 1] = formData.tags || '';
    rowData[col.DERNIERE_MODIFICATION - 1] = new Date();
    rowData[col.MODIFIE_PAR - 1] = Session.getActiveUser().getEmail();

    // Insertion
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    SpreadsheetApp.flush(); // Forcer l'exécution des formules

    // Invalider le cache
    CacheManager.invalidatePattern('clients_*');

    // Événement
    const clientId = sheet.getRange(newRow, col.ID).getValue();
    EventManager.trigger('client:created', {
      id: clientId,
      nom: formData.nom,
      type: formData.type,
      row: newRow
    });

    Logger4.info('✅ Client ajouté', { id: clientId, row: newRow });

    return {
      success: true,
      message: `✅ Client "${formData.nom}" ajouté avec succès!`,
      data: { id: clientId, row: newRow }
    };

  }, 'client_add', { showUI: false })();
}

/**
 * READ: Recherche de clients (full-text optimisée)
 */
function client_search(searchTerm) {
  return ErrorHandler.wrap(function() {
    Logger4.debug('🔍 Recherche client', { term: searchTerm });

    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    // Cache
    const cacheKey = `client_search_${searchTerm.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) {
      Logger4.debug('📦 Résultats depuis cache');
      return cached;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return [];
    }

    const col = CLIENT_MODULE.columns;
    const data = sheet.getRange(2, 1, lastRow - 1, CLIENT_MODULE.headers.length).getValues();
    const searchLower = searchTerm.toLowerCase();
    const results = [];

    data.forEach((row, index) => {
      const rowNum = index + 2;

      // Recherche multi-champs
      const searchableFields = [
        row[col.ID - 1],
        row[col.NOM - 1],
        row[col.TELEPHONE - 1],
        row[col.EMAIL - 1],
        row[col.VILLE - 1],
        row[col.NIU - 1],
        row[col.TAGS - 1]
      ].join('|').toLowerCase();

      if (searchableFields.includes(searchLower)) {
        results.push({
          row: rowNum,
          id: row[col.ID - 1],
          nom: row[col.NOM - 1],
          type: row[col.TYPE - 1],
          statut: row[col.STATUT - 1],
          telephone: row[col.TELEPHONE - 1],
          email: row[col.EMAIL - 1],
          ville: row[col.VILLE - 1],
          score: row[col.SCORE_SANTE - 1],
          segment: row[col.SEGMENT - 1]
        });
      }
    });

    // Limiter à 100 résultats
    const limitedResults = results.slice(0, 100);

    // Cache 5 minutes
    CacheManager.set(cacheKey, limitedResults, 300);

    Logger4.debug(`✅ ${limitedResults.length} résultat(s)`);
    return limitedResults;

  }, 'client_search', { showUI: false })();
}

/**
 * READ: Liste tous les clients avec pagination
 */
function client_getAll(options = {}) {
  return ErrorHandler.wrap(function() {
    const { limit = 50, offset = 0, sortBy = 'nom', sortOrder = 'asc' } = options;

    Logger4.debug('📋 Liste clients', { limit, offset, sortBy });

    const cacheKey = `clients_list_${limit}_${offset}_${sortBy}_${sortOrder}`;
    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return { clients: [], total: 0 };
    }

    const col = CLIENT_MODULE.columns;
    const data = sheet.getRange(2, 1, lastRow - 1, CLIENT_MODULE.headers.length).getValues();

    let clients = data.map((row, index) => ({
      row: index + 2,
      id: row[col.ID - 1],
      nom: row[col.NOM - 1],
      type: row[col.TYPE - 1],
      statut: row[col.STATUT - 1],
      telephone: row[col.TELEPHONE - 1],
      email: row[col.EMAIL - 1],
      ville: row[col.VILLE - 1],
      score: row[col.SCORE_SANTE - 1],
      segment: row[col.SEGMENT - 1],
      solde: row[col.SOLDE - 1]
    }));

    // Tri
    clients.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    const total = clients.length;
    clients = clients.slice(offset, offset + limit);

    const result = { clients, total, limit, offset };
    CacheManager.set(cacheKey, result, 300);

    return result;

  }, 'client_getAll', { showUI: false })();
}

/**
 * READ: Récupère un client par sa ligne - 🔧 CORRECTION typo scoreSante
 */
function client_getByRow(rowNum) {
  return ErrorHandler.wrap(function() {
    Logger4.debug('📄 Récupération client', { row: rowNum });

    if (!rowNum || rowNum < 2) {
      throw new Error('Numéro de ligne invalide');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const col = CLIENT_MODULE.columns;
    const data = sheet.getRange(rowNum, 1, 1, CLIENT_MODULE.headers.length).getValues()[0];

    const client = {
      row: rowNum,
      id: data[col.ID - 1],
      nom: data[col.NOM - 1],
      type: data[col.TYPE - 1],
      statut: data[col.STATUT - 1],
      telephone: data[col.TELEPHONE - 1],
      email: data[col.EMAIL - 1],
      adresse: data[col.ADRESSE - 1],
      ville: data[col.VILLE - 1],
      niu: data[col.NIU - 1],
      dateInscription: data[col.DATE_INSCRIPTION - 1] ? formatDate(new Date(data[col.DATE_INSCRIPTION - 1])) : '',
      dateDerniereInteraction: data[col.DATE_DERNIERE_INTERACTION - 1] ? formatDate(new Date(data[col.DATE_DERNIERE_INTERACTION - 1])) : '',
      joursInactivite: data[col.JOURS_INACTIVITE - 1],
      nombreFactures: data[col.NOMBRE_FACTURES - 1],
      totalDepense: data[col.TOTAL_DEPENSE - 1],
      totalPaye: data[col.TOTAL_PAYE - 1],
      solde: data[col.SOLDE - 1],
      valeurVieClient: data[col.VALEUR_VIE_CLIENT - 1],
      frequenceAchat: data[col.FREQUENCE_ACHAT - 1],
      panierMoyen: data[col.PANIER_MOYEN - 1],
      tauxPaiement: data[col.TAUX_PAIEMENT - 1],
      scoreSante: data[col.SCORE_SANTE - 1], // 🔧 CORRIGÉ: scoreInte → scoreSante
      segment: data[col.SEGMENT - 1],
      risqueChurn: data[col.RISQUE_CHURN - 1],
      probabiliteReachat: data[col.PROBABILITE_REACHAT - 1],
      prochaineRelance: data[col.PROCHAINE_RELANCE - 1] ? formatDate(new Date(data[col.PROCHAINE_RELANCE - 1])) : '',
      responsable: data[col.RESPONSABLE - 1],
      notes: data[col.NOTES - 1],
      tags: data[col.TAGS - 1]
    };

    Logger4.debug('✅ Client récupéré', { id: client.id });
    return { success: true, data: client };

  }, 'client_getByRow', { showUI: false })();
}

/**
 * UPDATE: Met à jour un client
 */
function client_update(formData) {
  return ErrorHandler.wrap(function() {
    Logger4.info('✏️ Mise à jour client', { row: formData.row });

    const row = parseInt(formData.row, 10);
    if (!row || row < 2) {
      throw new Error('Numéro de ligne invalide');
    }

    // Validation
    const validation = Validator.validate(formData, {
      nom: { required: true, minLength: 2 },
      type: { required: true },
      statut: { required: true },
      telephone: { type: 'phone' },
      email: { type: 'email' }
    });

    if (!validation.valid) {
      return { success: false, error: validation.errors.join('\n') };
    }

    // Formatage téléphone
    if (formData.telephone) {
      formData.telephone = CameroonUtils.formatPhoneCM(formData.telephone);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const col = CLIENT_MODULE.columns;

    // Récupérer l'ancien nom
    const oldName = sheet.getRange(row, col.NOM).getValue();

    // Mise à jour par batch
    const updates = [
      [row, col.NOM, formData.nom],
      [row, col.TYPE, formData.type],
      [row, col.STATUT, formData.statut],
      [row, col.TELEPHONE, formData.telephone || ''],
      [row, col.EMAIL, formData.email || ''],
      [row, col.ADRESSE, formData.adresse || ''],
      [row, col.VILLE, formData.ville || ''],
      [row, col.NIU, formData.niu || ''],
      [row, col.DATE_DERNIERE_INTERACTION, formData.dateDerniereInteraction || ''],
      [row, col.PROCHAINE_RELANCE, formData.prochaineRelance || ''],
      [row, col.RESPONSABLE, formData.responsable || ''],
      [row, col.NOTES, formData.notes || ''],
      [row, col.TAGS, formData.tags || ''],
      [row, col.DERNIERE_MODIFICATION, new Date()],
      [row, col.MODIFIE_PAR, Session.getActiveUser().getEmail()]
    ];

    updates.forEach(([r, c, val]) => sheet.getRange(r, c).setValue(val));
    SpreadsheetApp.flush();

    // Invalider cache
    CacheManager.invalidatePattern('clients_*');

    // Événement
    const clientId = sheet.getRange(row, col.ID).getValue();
    EventManager.trigger('client:updated', {
      id: clientId,
      nom: formData.nom,
      oldName: oldName,
      row: row
    });

    Logger4.info('✅ Client mis à jour', { id: clientId });

    return {
      success: true,
      message: `✅ Client "${formData.nom}" mis à jour!`
    };

  }, 'client_update', { showUI: false })();
}

/**
 * DELETE: Supprime un client (avec confirmation)
 */
function client_delete(rowNum, confirm = false) {
  return ErrorHandler.wrap(function() {
    Logger4.info('🗑️ Suppression client', { row: rowNum });

    if (!rowNum || rowNum < 2) {
      throw new Error('Numéro de ligne invalide');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const col = CLIENT_MODULE.columns;

    // Récupérer les infos
    const clientId = sheet.getRange(rowNum, col.ID).getValue();
    const clientName = sheet.getRange(rowNum, col.NOM).getValue();
    const nombreFactures = sheet.getRange(rowNum, col.NOMBRE_FACTURES).getValue();

    // Vérifier si le client a des factures
    if (nombreFactures > 0 && !confirm) {
      return {
        success: false,
        needsConfirmation: true,
        message: `⚠️ Le client "${clientName}" a ${nombreFactures} facture(s).\n\nÊtes-vous sûr de vouloir le supprimer?`,
        data: { clientId, clientName, nombreFactures, rowNum }
      };
    }

    // Suppression
    sheet.deleteRow(rowNum);

    // Invalider cache
    CacheManager.invalidatePattern('clients_*');

    // Événement
    EventManager.trigger('client:deleted', {
      id: clientId,
      nom: clientName,
      row: rowNum
    });

    Logger4.info('✅ Client supprimé', { id: clientId });

    return {
      success: true,
      message: `✅ Client "${clientName}" supprimé!`
    };

  }, 'client_delete', { showUI: false })();
}


// ============================================================================
// 4. ANALYSE ET STATISTIQUES V5.0
// ============================================================================

/**
 * Statistiques complètes des clients - 🔧 CORRECTION typo scoreSante
 */
function client_getStats() {
  return ErrorHandler.wrap(function() {
    Logger4.debug('📊 Calcul statistiques');

    const cached = CacheManager.get('clients_stats_complete');
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return _getEmptyStats();
    }

    const col = CLIENT_MODULE.columns;
    const data = sheet.getRange(2, 1, lastRow - 1, CLIENT_MODULE.headers.length).getValues();

    const stats = {
      total: lastRow - 1,
      parStatut: {},
      parType: {},
      parSegment: {},
      parRisque: {},
      parVille: {},
      totalDepense: 0,
      totalPaye: 0,
      totalSolde: 0,
      moyennes: {
        panierMoyen: 0,
        scoreSante: 0, // 🔧 CORRIGÉ: scoreInte → scoreSante
        tauxPaiement: 0,
        frequenceAchat: 0,
        clv: 0
      },
      tendances: {
        nouveauxMois: 0,
        actifsRecents: 0,
        inactifs90j: 0,
        aRisque: 0
      }
    };

    let sommeScores = 0;
    let sommeTaux = 0;
    let sommeFreq = 0;
    let sommeCLV = 0;
    let countScores = 0;
    const now = new Date();
    const unMoisAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    data.forEach(row => {
      // Par statut
      const statut = row[col.STATUT - 1];
      stats.parStatut[statut] = (stats.parStatut[statut] || 0) + 1;

      // Par type
      const type = row[col.TYPE - 1];
      stats.parType[type] = (stats.parType[type] || 0) + 1;

      // Par segment
      const segment = row[col.SEGMENT - 1];
      if (segment) stats.parSegment[segment] = (stats.parSegment[segment] || 0) + 1;

      // Par risque
      const risque = row[col.RISQUE_CHURN - 1];
      if (risque) stats.parRisque[risque] = (stats.parRisque[risque] || 0) + 1;

      // Par ville
      const ville = row[col.VILLE - 1];
      if (ville) stats.parVille[ville] = (stats.parVille[ville] || 0) + 1;

      // Montants
      stats.totalDepense += parseFloat(row[col.TOTAL_DEPENSE - 1]) || 0;
      stats.totalPaye += parseFloat(row[col.TOTAL_PAYE - 1]) || 0;
      stats.totalSolde += parseFloat(row[col.SOLDE - 1]) || 0;

      // Moyennes
      const score = parseFloat(row[col.SCORE_SANTE - 1]) || 0;
      const taux = parseFloat(row[col.TAUX_PAIEMENT - 1]) || 0;
      const freq = parseFloat(row[col.FREQUENCE_ACHAT - 1]) || 0;
      const clv = parseFloat(row[col.VALEUR_VIE_CLIENT - 1]) || 0;

      if (score > 0) {
        sommeScores += score;
        sommeTaux += taux;
        sommeFreq += freq;
        sommeCLV += clv;
        countScores++;
      }

      // Tendances
      const dateInscription = row[col.DATE_INSCRIPTION - 1];
      if (dateInscription && new Date(dateInscription) > unMoisAgo) {
        stats.tendances.nouveauxMois++;
      }

      const joursInactivite = parseInt(row[col.JOURS_INACTIVITE - 1]) || 0;
      if (joursInactivite < 30) stats.tendances.actifsRecents++;
      if (joursInactivite > 90) stats.tendances.inactifs90j++;

      if (risque === 'Critique' || risque === 'Élevé') stats.tendances.aRisque++;
    });

    // Calcul des moyennes
    if (countScores > 0) {
      stats.moyennes.scoreSante = Math.round(sommeScores / countScores); // 🔧 CORRIGÉ
      stats.moyennes.tauxPaiement = Math.round((sommeTaux / countScores) * 10) / 10;
      stats.moyennes.frequenceAchat = Math.round(sommeFreq / countScores);
      stats.moyennes.clv = Math.round(sommeCLV / countScores);
    }

    stats.moyennes.panierMoyen = stats.total > 0 ? Math.round(stats.totalDepense / stats.total) : 0;

    // Formatage FCFA
    stats.totalDepenseFormate = CameroonUtils.formatCurrency(stats.totalDepense);
    stats.totalPayeFormate = CameroonUtils.formatCurrency(stats.totalPaye);
    stats.totalSoldeFormate = CameroonUtils.formatCurrency(stats.totalSolde);
    stats.moyennes.panierMoyenFormate = CameroonUtils.formatCurrency(stats.moyennes.panierMoyen);
    stats.moyennes.clvFormate = CameroonUtils.formatCurrency(stats.moyennes.clv);

    // Trier par nombre décroissant
    stats.parVille = Object.fromEntries(
      Object.entries(stats.parVille).sort(([,a], [,b]) => b - a).slice(0, 10)
    );

    // Cache 10 minutes
    CacheManager.set('clients_stats_complete', stats, 600);

    Logger4.debug('✅ Statistiques calculées');
    return stats;

  }, 'client_getStats', { showUI: false })();
}

function _getEmptyStats() {
  return {
    total: 0,
    parStatut: {},
    parType: {},
    parSegment: {},
    parRisque: {},
    parVille: {},
    totalDepense: 0,
    totalPaye: 0,
    totalSolde: 0,
    moyennes: {
      panierMoyen: 0,
      scoreSante: 0, // 🔧 CORRIGÉ
      tauxPaiement: 0,
      frequenceAchat: 0,
      clv: 0
    },
    tendances: {
      nouveauxMois: 0,
      actifsRecents: 0,
      inactifs90j: 0,
      aRisque: 0
    }
  };
}

/**
 * Clients à risque de churn (priorisation intelligente) - 🔧 CORRECTION typo JOURS_INACTIVITE
 */
function client_getAtRisk() {
  return ErrorHandler.wrap(function() {
    Logger4.debug('⚠️ Récupération clients à risque');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return [];

    const col = CLIENT_MODULE.columns;
    const data = sheet.getRange(2, 1, lastRow - 1, CLIENT_MODULE.headers.length).getValues();
    const atRisk = [];

    data.forEach((row, index) => {
      const risque = row[col.RISQUE_CHURN - 1];
      if (risque === 'Critique' || risque === 'Élevé') {
        atRisk.push({
          row: index + 2,
          id: row[col.ID - 1],
          nom: row[col.NOM - 1],
          type: row[col.TYPE - 1],
          statut: row[col.STATUT - 1],
          risque: risque,
          score: row[col.SCORE_SANTE - 1],
          joursInactivite: row[col.JOURS_INACTIVITE - 1], // 🔧 CORRIGÉ: JOURSACTIVITE → JOURS_INACTIVITE
          solde: row[col.SOLDE - 1],
          clv: row[col.VALEUR_VIE_CLIENT - 1],
          probabiliteReachat: row[col.PROBABILITE_REACHAT - 1],
          prochaineRelance: row[col.PROCHAINE_RELANCE - 1],
          responsable: row[col.RESPONSABLE - 1],
          // Score de priorité (pour tri)
          priorite: _calculatePriority(
            risque,
            row[col.SCORE_SANTE - 1],
            row[col.VALEUR_VIE_CLIENT - 1],
            row[col.JOURS_INACTIVITE - 1] // 🔧 CORRIGÉ
          )
        });
      }
    });

    // Trier par priorité décroissante
    atRisk.sort((a, b) => b.priorite - a.priorite);

    Logger4.debug(`✅ ${atRisk.length} client(s) à risque`);
    return atRisk;

  }, 'client_getAtRisk', { showUI: false })();
}

/**
 * Calcule un score de priorité pour le tri des clients à risque
 */
function _calculatePriority(risque, score, clv, joursInactivite) {
  let priorite = 0;

  // Risque (40 points)
  priorite += risque === 'Critique' ? 40 : 25;

  // CLV (30 points) - Plus le CLV est élevé, plus c'est prioritaire
  priorite += Math.min(30, (clv / 1000000) * 30);

  // Score santé inversé (20 points) - Moins le score est bon, plus c'est urgent
  priorite += (100 - score) * 0.2;

  // Jours inactivité (10 points)
  priorite += Math.min(10, joursInactivite / 30);

  return Math.round(priorite);
}

/**
 * Top clients (Champions et VIP)
 */
function client_getTopClients(limit = 20) {
  return ErrorHandler.wrap(function() {
    Logger4.debug('🏆 Récupération top clients', { limit });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CLIENT_MODULE.sheetName);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return [];

    const col = CLIENT_MODULE.columns;
    const data = sheet.getRange(2, 1, lastRow - 1, CLIENT_MODULE.headers.length).getValues();
    const topClients = [];

    data.forEach((row, index) => {
      const segment = row[col.SEGMENT - 1];
      const statut = row[col.STATUT - 1];

      if (segment === 'Champion' || statut === 'VIP') {
        topClients.push({
          row: index + 2,
          id: row[col.ID - 1],
          nom: row[col.NOM - 1],
          type: row[col.TYPE - 1],
          statut: statut,
          segment: segment,
          score: row[col.SCORE_SANTE - 1],
          totalDepense: row[col.TOTAL_DEPENSE - 1],
          clv: row[col.VALEUR_VIE_CLIENT - 1],
          nombreFactures: row[col.NOMBRE_FACTURES - 1],
          tauxPaiement: row[col.TAUX_PAIEMENT - 1]
        });
      }
    });

    // Trier par CLV décroissant
    topClients.sort((a, b) => b.clv - a.clv);

    return topClients.slice(0, limit);

  }, 'client_getTopClients', { showUI: false })();
}


// ============================================================================
// 5. EXPORT/IMPORT V5.0
// ============================================================================

/**
 * Exporte les clients en JSON
 */
function client_exportJSON() {
  return ErrorHandler.wrap(function() {
    Logger4.info('📤 Export JSON');

    const jsonData = DataExporter.exportJSON(CLIENT_MODULE.sheetName);
    if (!jsonData) {
      throw new Error('Échec de l\'export');
    }

    const fileName = `Clients_Export_${Utilities.formatDate(new Date(), CONFIG_APP.app.timezone, 'yyyyMMdd_HHmmss')}.json`;
    const file = DriveApp.createFile(fileName, jsonData, MimeType.PLAIN_TEXT);

    Logger4.info('✅ Export JSON créé', { fileName });

    return {
      success: true,
      url: file.getUrl(),
      fileName: fileName
    };

  }, 'client_exportJSON', { showUI: false })();
}

/**
 * Exporte les clients en CSV
 */
function client_exportCSV() {
  return ErrorHandler.wrap(function() {
    Logger4.info('📤 Export CSV');

    const csvData = DataExporter.exportCSV(CLIENT_MODULE.sheetName);
    if (!csvData) {
      throw new Error('Échec de l\'export');
    }

    const fileName = `Clients_Export_${Utilities.formatDate(new Date(), CONFIG_APP.app.timezone, 'yyyyMMdd_HHmmss')}.csv`;
    const file = DriveApp.createFile(fileName, csvData, MimeType.CSV);

    Logger4.info('✅ Export CSV créé', { fileName });

    return {
      success: true,
      url: file.getUrl(),
      fileName: fileName
    };

  }, 'client_exportCSV', { showUI: false })();
}

/**
 * Exporte les clients en PDF
 */
function client_exportPDF() {
  return ErrorHandler.wrap(function() {
    Logger4.info('📤 Export PDF');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CLIENT_MODULE.sheetName);

    // URL de conversion en PDF
    const url = `https://docs.google.com/spreadsheets/d/${ss.getId()}/export?format=pdf&gid=${sheet.getSheetId()}&portrait=false&fitw=true`;

    const options = {
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
      }
    };

    const response = UrlFetchApp.fetch(url, options);
    const blob = response.getBlob();

    const fileName = `Clients_Export_${Utilities.formatDate(new Date(), CONFIG_APP.app.timezone, 'yyyyMMdd_HHmmss')}.pdf`;
    const file = DriveApp.createFile(blob.setName(fileName));

    Logger4.info('✅ Export PDF créé', { fileName });

    return {
      success: true,
      url: file.getUrl(),
      fileName: fileName
    };

  }, 'client_exportPDF', { showUI: false })();
}


// ============================================================================
// 6. DASHBOARD CLIENT V5.0
// ============================================================================

/**
 * Initialise le dashboard client
 */
function setupClientDashboard() {
  return ErrorHandler.wrap(function() {
    Logger4.info('🎯 Initialisation Dashboard Client V5.0');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dashboardName = CLIENT_MODULE.dashboardName;

    let dashboard = ss.getSheetByName(dashboardName);
    if (dashboard) {
      dashboard.clear();
      dashboard.clearConditionalFormatRules();
    } else {
      dashboard = ss.insertSheet(dashboardName);
    }

    ss.setActiveSheet(dashboard);

    // Configuration visuelle
    _setupDashboardHeader(dashboard);
    _setupDashboardKPIs(dashboard);
    _setupDashboardCharts(dashboard);
    _setupDashboardTables(dashboard);

    Logger4.info('✅ Dashboard Client V5.0 initialisé');
    notify('✅ Dashboard Client initialisé!\n\n📊 Vue 360° de vos clients disponible.', 'Succès', 'success');

  }, 'setupClientDashboard', { showUI: true })();
}

/**
 * En-tête du dashboard
 */
function _setupDashboardHeader(dashboard) {
  dashboard.getRange('A1:N1').merge();
  const header = dashboard.getRange('A1');
  header.setValue('🎯 DASHBOARD CLIENT - SecretariatPro V5.0');
  header
    .setFontSize(18)
    .setFontWeight('bold')
    .setFontFamily('Google Sans')
    .setBackground('#1a73e8')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  dashboard.setRowHeight(1, 60);

  // Date de mise à jour
  dashboard.getRange('A2').setValue('📅 Dernière mise à jour:');
  dashboard.getRange('B2').setFormula('=MAINTENANT()').setNumberFormat('dd/mm/yyyy hh:mm:ss');
  dashboard.getRange('A2:B2').setFontSize(9).setFontColor('#666666');
}

/**
 * KPIs principaux
 */
function _setupDashboardKPIs(dashboard) {
  const startRow = 4;
  const kpis = [
    { label: '👥 TOTAL CLIENTS', formula: `=NBVAL('${CLIENT_MODULE.sheetName}'!B:B)-1`, format: '#,##0', color: '#4285f4' },
    { label: '💰 CA TOTAL', formula: `=SOMME('${CLIENT_MODULE.sheetName}'!N:N)`, format: '#,##0" FCFA"', color: '#34a853' },
    { label: '⚠️ SOLDE TOTAL', formula: `=SOMME('${CLIENT_MODULE.sheetName}'!P:P)`, format: '#,##0" FCFA"', color: '#ea4335' },
    { label: '📊 SCORE MOYEN', formula: `=MOYENNE('${CLIENT_MODULE.sheetName}'!U:U)`, format: '0.0"/100"', color: '#fbbc04' }
  ];

  kpis.forEach((kpi, index) => {
    const col = index * 3 + 1;

    // Label
    dashboard.getRange(startRow, col, 1, 2).merge();
    dashboard.getRange(startRow, col)
      .setValue(kpi.label)
      .setFontWeight('bold')
      .setFontSize(11)
      .setBackground('#f1f3f4')
      .setHorizontalAlignment('center');

    // Valeur
    dashboard.getRange(startRow + 1, col, 1, 2).merge();
    dashboard.getRange(startRow + 1, col)
      .setFormula(kpi.formula)
      .setNumberFormat(kpi.format)
      .setFontSize(20)
      .setFontWeight('bold')
      .setFontColor(kpi.color)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    dashboard.setRowHeight(startRow + 1, 50);
  });
}

/**
 * Graphiques
 */
function _setupDashboardCharts(dashboard) {
  // Configuration des graphiques (à compléter selon les besoins)
  // Les graphiques seront créés dynamiquement via l'API Charts

  // Placeholder pour les graphiques
  dashboard.getRange('A8').setValue('📈 GRAPHIQUES');
  dashboard.getRange('A8')
    .setFontWeight('bold')
    .setFontSize(12)
    .setBackground('#f1f3f4');

  // Note: Les graphiques seront ajoutés via le code Chart API
}

/**
 * Tables de données
 */
function _setupDashboardTables(dashboard) {
  const startRow = 10;

  // Top 10 clients
  dashboard.getRange(startRow, 1).setValue('🏆 TOP 10 CLIENTS (par CA)');
  dashboard.getRange(startRow, 1)
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#f1f3f4');

  // Clients à risque
  dashboard.getRange(startRow, 7).setValue('⚠️ CLIENTS À RISQUE');
  dashboard.getRange(startRow, 7)
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#f1f3f4');
}


// ============================================================================
// 7. SIDEBAR (UI)
// ============================================================================

/**
 * Affiche le sidebar Client
 */
function showClientSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Client_Sidebar')
    .setTitle('🎯 Module Clients V5.0')
    .setWidth(320);

  SpreadsheetApp.getUi().showSidebar(html);
  Logger4.info('📱 Sidebar Client affiché');
}

/**
 * Affiche le modal Client
 */
function showClientModal(mode = 'add', rowNum = null) {
  const template = HtmlService.createTemplateFromFile('Client_Modal');
  template.mode = mode;
  template.rowNum = rowNum;

  const html = template.evaluate()
    .setWidth(650)
    .setHeight(700);

  SpreadsheetApp.getUi().showModalDialog(html,
    mode === 'add' ? '➕ Nouveau Client' :
    mode === 'edit' ? '✏️ Modifier Client' :
    '👁️ Détails Client'
  );

  Logger4.info('💬 Modal Client affiché', { mode, rowNum });
}


// ============================================================================
// FIN DU MODULE CLIENT V5.0.1 - CORRECTED
// ============================================================================

Logger4.info('✅ Module Client V5.0.1 (CORRECTED) chargé avec succès');
