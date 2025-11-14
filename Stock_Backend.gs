/**
 * @file Stock_Backend.gs (V12.6.5 - PRODUCTION READY)
 * @description Module Stock V12.6.5 - Corrigé pour Contexte UI
 *
 * CORRECTIONS V12.6.5:
 * ✅ Fix: Cannot call SpreadsheetApp.getUi() from this context
 * ✅ Ajout fonction _isUiAvailable() pour détecter contexte UI
 * ✅ Gestion gracieuse des contextes sans UI (triggers, API)
 * ✅ Backup automatique sans confirmation si pas d'UI
 * ✅ Toutes les fonctionnalités V12.6.1 préservées
 */

// ============================================================================
// 1. CONFIGURATION V12.6 (Héritée du Noyau Central)
// ============================================================================

const S_SHEET_NAME = C_CONF.sheetName;
const S_DASHBOARD_SHEET_NAME = C_CONF.dashboard.sheetName;
const S_AUDIT_SHEET_NAME = 'Audit_Stock';
const S_ARCHIVE_SHEET_NAME = 'Archive_Stock';
const S_MOUVEMENTS_SHEET_NAME = 'Mouvements_Stock';
const S_SUPPLIERS_SHEET_NAME = 'BD_FOURNISSEURS';
const S_PO_SHEET_NAME = 'BD_COMMANDES_STOCK';
const S_PO_DETAILS_SHEET_NAME = 'BD_COMMANDES_DETAILS';

// ============================================================================
// 1.1 UI CONTEXT HELPER
// ============================================================================

/**
 * Vérifie si l'UI est disponible dans le contexte actuel
 * @returns {boolean} true si l'UI est disponible
 */
function _isUiAvailable() {
  try {
    SpreadsheetApp.getUi();
    return true;
  } catch (e) {
    return false;
  }
}

// ============================================================================
// 2. FORMULES V12.6
// ============================================================================

const _stock_FormulaService = {
  getIDFormula: () => S_FORMULAS.ID,
  getValeurStockFormula: () => S_FORMULAS.VALEUR_STOCK,
  getAlerteStockFormula: () => S_FORMULAS.STATUT_STOCK,

  getMargeFormula: () => {
    if (!S_COLS.MARGE || !S_COLS.PRIX_VENTE || !S_COLS.PRIX_ACHAT) return null;
    const paCol = _colA1_stock(S_COLS.PRIX_ACHAT);
    const pvCol = _colA1_stock(S_COLS.PRIX_VENTE);
    return `=ARRAYFORMULA(IF(ISBLANK(${paCol}2:${paCol});""; IF(${paCol}2:${paCol}>0;(${pvCol}2:${pvCol}-${paCol}2:${paCol})/${paCol}2:${paCol};0)))`;
  }
};

// ============================================================================
// 3. INITIALISATION V12.6.5 (CORRIGÉE)
// ============================================================================

function setupStockSheet() {
  return ErrorHandler.wrap(function() {
    Logger4.info('🚀 Lancement Initialisation V12.6.5 - Module Stock...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(S_SHEET_NAME);

    if (sheet) {
      const uiAvailable = _isUiAvailable();
      let shouldReinitialize = false;

      if (uiAvailable) {
        // Demander confirmation si UI disponible
        const ui = SpreadsheetApp.getUi();
        const response = ui.alert(
          '⚠️ Réinitialisation V12.6.5',
          `La feuille "${S_SHEET_NAME}" existe déjà.\n\nRéinitialiser?\n💾 Un backup sera créé.`,
          ui.ButtonSet.YES_NO
        );

        if (response !== ui.Button.YES) {
          Logger4.info('Initialisation annulée par l\'utilisateur.');
          return;
        }
        shouldReinitialize = true;
      } else {
        // Pas d'UI : backup automatique et réinitialisation
        Logger4.info('Contexte sans UI détecté - Backup automatique et réinitialisation...');
        shouldReinitialize = true;
      }

      if (shouldReinitialize) {
        _stock_createSheetBackup(sheet);
        sheet.clear();
        sheet.clearConditionalFormatRules();
        sheet.clearNotes();
        _stock_uninstallTriggers();
      }
    } else {
      sheet = ss.insertSheet(S_SHEET_NAME, 2);
    }

    ss.setActiveSheet(sheet);

    // Pipeline d'initialisation
    const pipeline = [
      { fn: _stock_setupHeaders, name: 'En-têtes' },
      { fn: _stock_setupFormulas, name: 'Formules' },
      { fn: setupStockSuppliersSheet, name: 'Fournisseurs' },
      { fn: _stock_setupValidation, name: 'Validation' },
      { fn: _stock_setupFormatting, name: 'Formatage' },
      { fn: _stock_setupConditionalFormatting, name: 'Mise en forme conditionnelle' },
      { fn: _stock_setupBorders, name: 'Bordures' },
      { fn: _stock_setupProtection, name: 'Protection' },
      { fn: _stock_setupDimensions, name: 'Dimensions' },
      { fn: _stock_setupNotes, name: 'Notes' },
      { fn: setupStockAuditSheet, name: 'Audit' },
      { fn: setupStockArchiveSheet, name: 'Archive' },
      { fn: setupStockMovementsSheet, name: 'Mouvements' },
      { fn: setupStockPurchaseOrdersSheet, name: 'Commandes' },
      { fn: setupStockPurchaseOrderDetailsSheet, name: 'Détails Commandes' },
      { fn: setupStockDashboard, name: 'Dashboard' },
      { fn: _stock_installTriggers, name: 'Triggers' }
    ];

    pipeline.forEach(({ fn, name }) => {
      try {
        fn(sheet);
        Logger4.debug(`✓ ${name}`);
      } catch (e) {
        Logger4.error(`✗ Échec: ${name}`, e);
        throw e;
      }
    });

    if (CONFIG_APP.app.environment === 'development') {
      _stock_insertDemoData(sheet);
    }

    stock_runDailyRecalculation();
    stock_runDailyEnrichment();

    EventManager.trigger('stock:sheet_initialized', {
      sheetName: S_SHEET_NAME,
      version: '12.6.5'
    });

    Logger4.info('✅ Module Stock V12.6.5 initialisé!');

    // Notification uniquement si UI disponible
    if (_isUiAvailable()) {
      notify(
        '✅ Module Stock V12.6.5 initialisé!\n\n' +
        '🎨 Design Material 3.0\n' +
        '⚡ Stock calculé (Mouvements)\n' +
        '🚚 Gestion Fournisseurs & PO\n' +
        '📊 Dashboard généré\n' +
        '🛡️ Audit activé',
        'Succès V12.6.5',
        'success'
      );
    }

  }, 'setupStockSheet', { showUI: false, severity: 'critical' })();
}

// ============================================================================
// 3.1 HELPERS D'INITIALISATION
// ============================================================================

function _stock_createSheetBackup(sheet) {
  try {
    const ss = sheet.getParent();
    const timestamp = Utilities.formatDate(new Date(), CONFIG_APP.app.timezone, 'yyyyMMdd_HHmmss');
    const backupName = `${sheet.getName()}_BACKUP_${timestamp}`;
    sheet.copyTo(ss).setName(backupName);
    Logger4.info('Backup créé', { name: backupName });
  } catch (e) {
    Logger4.warn('Backup impossible', e);
  }
}

function _stock_setupHeaders(sheet) {
  const headers = S_CONF.headers;
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers])
    .setFontWeight('bold').setFontSize(11).setFontFamily('Product Sans')
    .setBackground(C_COLORS.primary).setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrap(true);

  headerRange.setBorder(true, true, true, true, false, false, '#FFFFFF', SpreadsheetApp.BorderStyle.SOLID_THICK);
  sheet.setRowHeight(1, 50);

  // Griser colonnes calculées
  const serverCalculatedCols = [
    S_COLS.STOCK_ACTUEL, S_COLS.STATUT_STOCK, S_COLS.VALEUR_STOCK,
    S_COLS.DERNIERE_ENTREE, S_COLS.DERNIERE_SORTIE,
    S_COLS.TAUX_ROTATION, S_COLS.MARGE
  ];

  serverCalculatedCols.forEach(col => {
    if (col) {
      sheet.getRange(1, col).setBackground(C_COLORS.secondary);
      sheet.getRange(2, col, C_LIMITS.MAX_ROWS).setBackground(C_COLORS.surfaceVariant);
    }
  });
}

function _stock_setupFormulas(sheet) {
  const formulas = [
    [S_COLS.ID, _stock_FormulaService.getIDFormula()],
    [S_COLS.VALEUR_STOCK, _stock_FormulaService.getValeurStockFormula()],
    [S_COLS.STATUT_STOCK, _stock_FormulaService.getAlerteStockFormula()],
  ];

  if (S_COLS.MARGE) {
    const margeFormula = _stock_FormulaService.getMargeFormula();
    if (margeFormula) formulas.push([S_COLS.MARGE, margeFormula]);
  }

  formulas.forEach(([colNum, formula]) => {
    if (colNum && formula) sheet.getRange(2, colNum).setFormula(formula);
  });

  Logger4.debug('Formules Stock configurées');
}

function _stock_setupValidation(sheet) {
  const lastRow = C_LIMITS.MAX_ROWS;

  try {
    sheet.getRange(2, S_COLS.CATEGORIE, lastRow).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(S_LISTS.categorie, true)
        .setAllowInvalid(false).setHelpText('📦 Catégorie d\'article').build()
    );

    sheet.getRange(2, S_COLS.UNITE, lastRow).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(S_LISTS.unite, true)
        .setAllowInvalid(false).setHelpText('📏 Unité de mesure').build()
    );

    sheet.getRange(2, S_COLS.STOCK_MIN, lastRow).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireNumberGreaterThanOrEqualTo(0)
        .setAllowInvalid(true).setHelpText('Stock minimum >= 0').build()
    );

    const supplierSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SUPPLIERS_SHEET_NAME);
    if (supplierSheet && supplierSheet.getLastRow() > 1) {
      const supplierRange = supplierSheet.getRange(2, 2, supplierSheet.getLastRow() - 1);
      sheet.getRange(2, S_COLS.FOURNISSEUR, lastRow).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInRange(supplierRange, true)
          .setAllowInvalid(true).setHelpText('Fournisseur depuis BD_FOURNISSEURS').build()
      );
    }

  } catch (e) {
    Logger4.warn('Validations partielles', e);
  }
}

function _stock_setupFormatting(sheet) {
  const lastRow = C_LIMITS.MAX_ROWS;

  const formats = [
    { cols: [S_COLS.DERNIERE_ENTREE, S_COLS.DERNIERE_SORTIE], format: 'dd/mm/yyyy hh:mm' },
    { cols: [S_COLS.PRIX_UNITAIRE, S_COLS.VALEUR_STOCK, S_COLS.PRIX_ACHAT, S_COLS.PRIX_VENTE],
      format: '#,##0" FCFA";[Red]-#,##0" FCFA"' },
    { cols: [S_COLS.STOCK_ACTUEL, S_COLS.STOCK_MIN, S_COLS.STOCK_MAX], format: '#,##0' },
    { cols: [S_COLS.ID, S_COLS.ARTICLE, S_COLS.REFERENCE], format: '@' }
  ];

  if (S_COLS.TAUX_ROTATION) formats.push({ cols: [S_COLS.TAUX_ROTATION], format: '#,##0.0" j"' });
  if (S_COLS.MARGE) formats.push({ cols: [S_COLS.MARGE], format: '0.0"%"' });

  formats.forEach(({ cols, format }) => {
    cols.forEach(colNum => {
      if (colNum) sheet.getRange(2, colNum, lastRow).setNumberFormat(format);
    });
  });

  sheet.getRange(2, S_COLS.ID, lastRow).setHorizontalAlignment('center');
  sheet.getRange(2, S_COLS.CATEGORIE, lastRow).setHorizontalAlignment('center');
  sheet.getRange(2, S_COLS.UNITE, lastRow).setHorizontalAlignment('center');
}

function _stock_setupConditionalFormatting(sheet) {
  const lastRow = C_LIMITS.MAX_ROWS;
  const rules = [];

  const alerteColors = {
    'Rupture': { bg: C_COLORS.error, fg: '#FFFFFF', bold: true },
    'À Commander': { bg: C_COLORS.warning, fg: '#000000', bold: true },
    'OK': { bg: C_COLORS.successLight, fg: C_COLORS.success, bold: false }
  };

  Object.entries(alerteColors).forEach(([alerte, style]) => {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(alerte)
      .setBackground(style.bg).setFontColor(style.fg).setBold(style.bold)
      .setRanges([sheet.getRange(2, S_COLS.STATUT_STOCK, lastRow)]).build()
    );
  });

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(0)
    .setBackground(C_COLORS.errorLight).setFontColor(C_COLORS.error).setBold(true)
    .setRanges([sheet.getRange(2, S_COLS.STOCK_ACTUEL, lastRow)]).build()
  );

  if (S_COLS.MARGE) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue(C_COLORS.error, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue(C_COLORS.warning, SpreadsheetApp.InterpolationType.NUMBER, '20')
      .setGradientMaxpointWithValue(C_COLORS.success, SpreadsheetApp.InterpolationType.NUMBER, '50')
      .setRanges([sheet.getRange(2, S_COLS.MARGE, lastRow)]).build()
    );
  }

  sheet.setConditionalFormatRules(rules);
}

function _stock_setupBorders(sheet) {
  const lastRow = C_LIMITS.MAX_ROWS;

  const importantCols = [S_COLS.ARTICLE, S_COLS.STOCK_ACTUEL, S_COLS.STATUT_STOCK, S_COLS.VALEUR_STOCK];
  importantCols.forEach(colNum => {
    sheet.getRange(2, colNum, lastRow).setBorder(null, true, null, true, null, null,
      C_COLORS.outline, SpreadsheetApp.BorderStyle.SOLID);
  });

  const dataRange = sheet.getRange(2, 1, lastRow, S_CONF.headers.length);
  dataRange.setBorder(true, true, true, true, null, null,
    C_COLORS.outlineDark, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  const zebraRange = sheet.getRange(2, 1, lastRow, S_CONF.headers.length);
  zebraRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false)
    .setFirstRowColor(C_COLORS.surface)
    .setSecondRowColor(C_COLORS.surfaceVariant);

  sheet.setRowHeights(2, lastRow, 28);
}

function _stock_setupProtection(sheet) {
  const lastRow = C_LIMITS.MAX_ROWS;

  try {
    const protection = sheet.protect().setDescription('🔒 Protection V12.6.5');

    const editableRanges = [
      S_COLS.ARTICLE, S_COLS.CATEGORIE, S_COLS.STOCK_MIN, S_COLS.UNITE,
      S_COLS.PRIX_UNITAIRE, S_COLS.FOURNISSEUR, S_COLS.REFERENCE,
      S_COLS.STOCK_MAX, S_COLS.PRIX_VENTE, S_COLS.EMPLACEMENT,
      S_COLS.STATUT, S_COLS.NOTES, S_COLS.TAGS
    ]
    .filter(col => col)
    .map(col => sheet.getRange(2, col, lastRow));

    protection.setUnprotectedRanges(editableRanges);

    const editors = PermissionManager.getUsersWithRole('admin');
    const managers = PermissionManager.getUsersWithRole('manager');
    const stockManagers = PermissionManager.getUsersWithRole('stock_manager');
    const allEditors = [...new Set([Session.getEffectiveUser().getEmail(), ...editors, ...managers, ...stockManagers])];

    protection.removeEditors(protection.getEditors());
    protection.addEditors(allEditors);
    protection.setWarningOnly(allEditors.length === 1);

  } catch (e) {
    Logger4.warn('Protection non configurée', e);
  }
}

function _stock_setupDimensions(sheet) {
  const widths = {
    [S_COLS.ID]: 130, [S_COLS.ARTICLE]: 280, [S_COLS.CATEGORIE]: 150,
    [S_COLS.STOCK_ACTUEL]: 110, [S_COLS.STOCK_MIN]: 110, [S_COLS.STATUT_STOCK]: 140,
    [S_COLS.UNITE]: 80, [S_COLS.PRIX_UNITAIRE]: 140, [S_COLS.VALEUR_STOCK]: 160,
    [S_COLS.FOURNISSEUR]: 200, [S_COLS.DERNIERE_ENTREE]: 170, [S_COLS.DERNIERE_SORTIE]: 170,
    [S_COLS.REFERENCE]: 120, [S_COLS.STOCK_MAX]: 100, [S_COLS.PRIX_ACHAT]: 140,
    [S_COLS.PRIX_VENTE]: 140, [S_COLS.EMPLACEMENT]: 150, [S_COLS.STATUT]: 120,
    [S_COLS.TAUX_ROTATION]: 130, [S_COLS.MARGE]: 100, [S_COLS.NOTES]: 320,
    [S_COLS.TAGS]: 170, [S_COLS.DERNIERE_MODIFICATION]: 170, [S_COLS.MODIFIE_PAR]: 190
  };

  Object.entries(widths).forEach(([colNum, width]) => {
    if (colNum && colNum <= sheet.getMaxColumns()) {
      sheet.setColumnWidth(parseInt(colNum), width);
    }
  });
}

function _stock_setupNotes(sheet) {
  const notes = {
    [S_COLS.STOCK_ACTUEL]: '📦 Quantité calculée par le serveur.\nNe pas modifier manuellement.',
    [S_COLS.STOCK_MIN]: '⚠️ Seuil d\'alerte stock faible',
    [S_COLS.VALEUR_STOCK]: '💰 Valeur = Quantité × Prix Achat',
    [S_COLS.STATUT_STOCK]: '🚨 Alerte automatique',
  };

  if (S_COLS.TAUX_ROTATION) notes[S_COLS.TAUX_ROTATION] = '🔄 Taux de rotation';
  if (S_COLS.MARGE) notes[S_COLS.MARGE] = '📊 Marge brute';

  Object.entries(notes).forEach(([colNum, note]) => {
    if (colNum && colNum <= sheet.getMaxColumns()) {
      sheet.getRange(1, parseInt(colNum)).setNote(note);
    }
  });
}

function _stock_insertDemoData(sheet) {
  const now = new Date();
  const demoArticles = [
    ['', 'REF-001', 'Ramette Papier A4 (Démo)', 'Papeterie', 'Papeterie', 'Ramette', 0, 10, 100, 2500, 3000, '', 'Fournisseur Papeterie SARL', 'Magasin A1', 'Actif', null, null, '', '', '', 'papier, A4', now, 'System'],
    ['', 'REF-002', 'Agrafeuse Bureau (Démo)', 'Papeterie', 'Fournitures', 'Unité', 0, 5, 30, 1200, 1800, '', 'Fournitures Express', 'Bureau E1', 'Actif', null, null, '', '', '', 'agrafeuse', now, 'System'],
    ['', 'REF-003', 'Cartouche Encre HP 302XL (Démo)', 'Consommables', 'Informatique', 'Unité', 0, 3, 20, 15000, 18000, '', 'IT Solutions Cameroun', 'Stock Info', 'Actif', null, null, '', '', '', 'encre, hp', now, 'System']
  ];

  sheet.getRange(2, 1, demoArticles.length, S_CONF.headers.length).setValues(demoArticles);

  const mvtSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_MOUVEMENTS_SHEET_NAME);
  const ids = sheet.getRange(2, 1, 3, 1).getValues();
  const demoMouvements = [
    ['', now, 'System', ids[0][0], 'Ramette Papier A4 (Démo)', 'Entrée Initiale', 50, 2500, 'PO-DEMO-01', 'Stock initial'],
    ['', now, 'System', ids[1][0], 'Agrafeuse Bureau (Démo)', 'Entrée Initiale', 15, 1200, 'PO-DEMO-01', 'Stock initial'],
    ['', now, 'System', ids[2][0], 'Cartouche Encre HP 302XL (Démo)', 'Entrée Initiale', 8, 15000, 'PO-DEMO-02', 'Stock initial']
  ];

  if (mvtSheet) {
    mvtSheet.getRange(mvtSheet.getLastRow() + 1, 1, demoMouvements.length, demoMouvements[0].length).setValues(demoMouvements);
  }

  Logger4.info('Données démo insérées');
}

function _colA1_stock(colIndex) {
  let colName = '';
  let dividend = parseInt(colIndex);
  while (dividend > 0) {
    let modulo = (dividend - 1) % 26;
    colName = String.fromCharCode(65 + modulo) + colName;
    dividend = Math.floor((dividend - modulo) / 26);
  }
  return colName;
}

// ============================================================================
// 4. FEUILLES SECONDAIRES
// ============================================================================

function setupStockAuditSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(S_AUDIT_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(S_AUDIT_SHEET_NAME, ss.getNumSheets());

  sheet.hideSheet();
  const headers = ['Timestamp', 'Utilisateur', 'Action', 'ID Article', 'Nom Article', 'Champ Modifié', 'Ancienne Valeur', 'Nouvelle Valeur', 'Détails (JSON)'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(C_COLORS.secondary).setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setFrozenRows(1);

  Logger4.info(`Feuille "${S_AUDIT_SHEET_NAME}" créée`);
}

function setupStockArchiveSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(S_ARCHIVE_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(S_ARCHIVE_SHEET_NAME, ss.getNumSheets());

  sheet.hideSheet();
  const headers = [...S_CONF.headers, 'Date Archivage', 'Archivé Par'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(C_COLORS.error).setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.setFrozenRows(1);

  Logger4.info(`Feuille "${S_ARCHIVE_SHEET_NAME}" créée`);
}

function setupStockMovementsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(S_MOUVEMENTS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(S_MOUVEMENTS_SHEET_NAME, ss.getNumSheets());

  const headers = ['ID Mouvement', 'Timestamp', 'Utilisateur', 'ID Article', 'Nom Article', 'Type', 'Quantité', 'Coût Unitaire', 'ID Commande', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(C_COLORS.primaryLight).setFontColor('#000000').setFontWeight('bold');
  sheet.getRange(2, 1, C_LIMITS.MAX_ROWS).setFormula(`=ARRAYFORMULA(IF(ISBLANK(B2:B);"";"MVT-"&TEXT(B2:B;"YYMMDD")&"-"&TEXT(ROW(B2:B)-1;"0000")))`);

  const mvtTypes = ['Entrée', 'Sortie', 'Ajustement +', 'Ajustement -', 'Entrée Initiale'];
  sheet.getRange(2, 6, C_LIMITS.MAX_ROWS).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(mvtTypes).setAllowInvalid(false).build()
  );

  sheet.setFrozenRows(1);

  Logger4.info(`Feuille "${S_MOUVEMENTS_SHEET_NAME}" créée`);
}

function setupStockSuppliersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(S_SUPPLIERS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(S_SUPPLIERS_SHEET_NAME, ss.getNumSheets());

  const headers = ['ID Fournisseur', 'Nom / Raison Sociale', 'Contact', 'Téléphone', 'Email', 'Adresse', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(C_COLORS.success).setFontColor('#FFFFFF').setFontWeight('bold');
  sheet.getRange(2, 1, C_LIMITS.MAX_ROWS).setFormula(`=ARRAYFORMULA(IF(ISBLANK(B2:B);"";"FOUR-"&TEXT(ROW(B2:B)-1;"000")))`);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  Logger4.info(`Feuille "${S_SUPPLIERS_SHEET_NAME}" créée`);
}

function setupStockPurchaseOrdersSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(S_PO_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(S_PO_SHEET_NAME, ss.getNumSheets());

  const headers = ['ID Commande', 'Date Création', 'ID Fournisseur', 'Nom Fournisseur', 'Statut', 'Montant Total HT', 'Date Attendue', 'Date Réception', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(C_COLORS.warning).setFontColor('#000000').setFontWeight('bold');
  sheet.getRange(2, 1, C_LIMITS.MAX_ROWS).setFormula(`=ARRAYFORMULA(IF(ISBLANK(B2:B);"";"PO-"&TEXT(B2:B;"YYMMDD")&"-"&TEXT(ROW(B2:B)-1;"000")))`);

  const statutList = ['Brouillon', 'Commandé', 'Partiellement Reçu', 'Reçu', 'Annulé'];
  sheet.getRange(2, 5, C_LIMITS.MAX_ROWS).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(statutList).setAllowInvalid(false).build()
  );

  const supplierSheet = ss.getSheetByName(S_SUPPLIERS_SHEET_NAME);
  if (supplierSheet && supplierSheet.getLastRow() > 1) {
    const idRange = supplierSheet.getRange(2, 1, supplierSheet.getLastRow() - 1);
    sheet.getRange(2, 3, C_LIMITS.MAX_ROWS).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(idRange, true).setAllowInvalid(true).build()
    );
    sheet.getRange(2, 4, C_LIMITS.MAX_ROWS)
      .setFormula(`=ARRAYFORMULA(IF(ISBLANK(C2:C);"";IFERROR(VLOOKUP(C2:C;'${S_SUPPLIERS_SHEET_NAME}'!A2:B;2;FALSE);"")))`);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  Logger4.info(`Feuille "${S_PO_SHEET_NAME}" créée`);
}

function setupStockPurchaseOrderDetailsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(S_PO_DETAILS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(S_PO_DETAILS_SHEET_NAME, ss.getNumSheets());

  sheet.hideSheet();
  const headers = ['ID Ligne PO', 'ID Commande', 'ID Article', 'Nom Article', 'Quantité', 'Coût Unitaire', 'Total Ligne'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground(C_COLORS.warningLight).setFontColor('#000000').setFontWeight('bold');
  sheet.getRange(2, 1, C_LIMITS.MAX_ROWS).setFormula(`=ARRAYFORMULA(IF(ISBLANK(B2:B);"";"POL-"&ROW(B2:B)-1))`);
  sheet.getRange(2, 7, C_LIMITS.MAX_ROWS).setFormula(`=ARRAYFORMULA(IF(ISBLANK(E2:E);"";E2:E*F2:F))`);

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  Logger4.info(`Feuille "${S_PO_DETAILS_SHEET_NAME}" créée`);
}

// ============================================================================
// 5. CRUD ARTICLES V12.6.5
// ============================================================================

function stock_add(formData) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('stock_manager')) throw new Error('Accès refusé.');

    const validation = ValidationService.validate(formData, 'stock');
    if (!validation.valid) return { success: false, error: validation.errors.join('\n') };

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const newRow = sheet.getLastRow() + 1;
    const user = Session.getActiveUser().getEmail();

    const rowData = _stock_mapFormDataToRow(formData, user, new Date());

    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    SpreadsheetApp.flush();

    const articleId = sheet.getRange(newRow, S_COLS.ID).getValue();
    CacheService.invalidate('stock_');

    stock_addAuditLog(articleId, 'CREATE', { nom: formData.article, categorie: formData.categorie });

    const qteInitiale = parseFloat(formData.stockActuel) || 0;
    if (qteInitiale > 0) {
      stock_addMovement(articleId, 'Entrée Initiale', qteInitiale, parseFloat(formData.prixUnitaire) || 0, 'IMPORT', 'Création article');
      stock_runDailyRecalculation();
    }

    EventManager.trigger('stock:created', { id: articleId, nom: formData.article, row: newRow });

    Logger4.info('✅ Article ajouté', { id: articleId });
    return { success: true, message: `✅ Article "${formData.article}" ajouté!`, data: { id: articleId, row: newRow } };

  }, 'stock_add', { showUI: false })();
}

function _stock_mapFormDataToRow(formData, user, timestamp) {
  const rowData = new Array(S_CONF.headers.length).fill('');

  rowData[S_COLS.ARTICLE - 1] = formData.article;
  rowData[S_COLS.CATEGORIE - 1] = formData.categorie;
  rowData[S_COLS.STOCK_ACTUEL - 1] = 0;
  rowData[S_COLS.STOCK_MIN - 1] = parseFloat(formData.stockMini) || 0;
  rowData[S_COLS.UNITE - 1] = formData.unite;
  rowData[S_COLS.PRIX_UNITAIRE - 1] = parseFloat(formData.prixUnitaire) || 0;
  rowData[S_COLS.FOURNISSEUR - 1] = formData.fournisseur || '';

  if (S_COLS.REFERENCE) rowData[S_COLS.REFERENCE - 1] = formData.reference || '';
  if (S_COLS.STOCK_MAX) rowData[S_COLS.STOCK_MAX - 1] = parseFloat(formData.stockMax) || 0;
  if (S_COLS.PRIX_ACHAT) rowData[S_COLS.PRIX_ACHAT - 1] = parseFloat(formData.prixUnitaire) || 0;
  if (S_COLS.PRIX_VENTE) rowData[S_COLS.PRIX_VENTE - 1] = parseFloat(formData.prixVente) || 0;
  if (S_COLS.EMPLACEMENT) rowData[S_COLS.EMPLACEMENT - 1] = formData.emplacement || '';
  if (S_COLS.STATUT) rowData[S_COLS.STATUT - 1] = formData.statut || 'Actif';
  if (S_COLS.NOTES) rowData[S_COLS.NOTES - 1] = formData.notes || '';
  if (S_COLS.TAGS) rowData[S_COLS.TAGS - 1] = formData.tags || '';
  if (S_COLS.DERNIERE_MODIFICATION) rowData[S_COLS.DERNIERE_MODIFICATION - 1] = timestamp;
  if (S_COLS.MODIFIE_PAR) rowData[S_COLS.MODIFIE_PAR - 1] = user;

  return rowData;
}

function stock_getByRow(rowNum) {
  return ErrorHandler.wrap(function() {
    if (!rowNum || rowNum < 2) throw new Error('Numéro de ligne invalide');
    if (!PermissionManager.isAtLeast('user')) throw new Error('Accès refusé.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const data = sheet.getRange(rowNum, 1, 1, S_CONF.headers.length).getValues()[0];

    const finalData = {};
    Object.keys(S_COLS).forEach(key => {
      finalData[key.toLowerCase()] = data[S_COLS[key] - 1];
    });

    finalData.row = rowNum;
    finalData.derniere_entree = CameroonUtils.formatDateTime(finalData.derniere_entree);
    finalData.derniere_sortie = CameroonUtils.formatDateTime(finalData.derniere_sortie);
    if (S_COLS.DERNIERE_MODIFICATION) finalData.derniere_modification = CameroonUtils.formatDateTime(data[S_COLS.DERNIERE_MODIFICATION - 1]);

    return { success: true, data: finalData };

  }, 'stock_getByRow', { showUI: false })();
}

function stock_update(formData) {
  return ErrorHandler.wrap(function() {
    const row = parseInt(formData.row, 10);
    if (!row || row < 2) throw new Error('Ligne invalide');
    if (!PermissionManager.isAtLeast('stock_manager')) throw new Error('Accès refusé.');

    const validation = ValidationService.validate(formData, 'stock');
    if (!validation.valid) return { success: false, error: validation.errors.join('\n') };

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const user = Session.getActiveUser().getEmail();
    const now = new Date();

    const oldDataValues = sheet.getRange(row, 1, 1, S_CONF.headers.length).getValues()[0];
    const articleId = oldDataValues[S_COLS.ID - 1];

    const updates = [
      { col: S_COLS.ARTICLE, val: formData.article },
      { col: S_COLS.CATEGORIE, val: formData.categorie },
      { col: S_COLS.STOCK_MIN, val: parseFloat(formData.stockMini) || 0 },
      { col: S_COLS.UNITE, val: formData.unite },
      { col: S_COLS.PRIX_UNITAIRE, val: parseFloat(formData.prixUnitaire) || 0 },
      { col: S_COLS.FOURNISSEUR, val: formData.fournisseur || '' },
      { col: S_COLS.REFERENCE, val: formData.reference || '' },
      { col: S_COLS.STOCK_MAX, val: parseFloat(formData.stockMax) || 0 },
      { col: S_COLS.PRIX_ACHAT, val: parseFloat(formData.prixUnitaire) || 0 },
      { col: S_COLS.PRIX_VENTE, val: parseFloat(formData.prixVente) || 0 },
      { col: S_COLS.EMPLACEMENT, val: formData.emplacement || '' },
      { col: S_COLS.STATUT, val: formData.statut || 'Actif' },
      { col: S_COLS.NOTES, val: formData.notes || '' },
      { col: S_COLS.TAGS, val: formData.tags || '' },
      { col: S_COLS.DERNIERE_MODIFICATION, val: now },
      { col: S_COLS.MODIFIE_PAR, val: user }
    ];

    const valuesToUpdate = [];
    const rangesToUpdate = [];

    updates.forEach(upd => {
      if (!upd.col) return;
      const oldVal = oldDataValues[upd.col - 1];
      const newVal = upd.val;

      if (oldVal != newVal) {
        valuesToUpdate.push([newVal]);
        rangesToUpdate.push(sheet.getRange(row, upd.col));

        if (upd.col !== S_COLS.DERNIERE_MODIFICATION && upd.col !== S_COLS.MODIFIE_PAR) {
          const colName = S_CONF.headers[upd.col - 1];
          stock_addAuditLog(articleId, 'UPDATE', { champ: colName, old: oldVal, new: newVal });
        }
      }
    });

    // Batch update
    if (rangesToUpdate.length > 0) {
      rangesToUpdate.forEach((range, index) => {
        range.setValue(valuesToUpdate[index][0]);
      });
    }

    SpreadsheetApp.flush();
    CacheService.invalidate('stock_');
    EventManager.trigger('stock:updated', { id: articleId, nom: formData.article, row: row });

    Logger4.info('✅ Article mis à jour', { id: articleId });
    return { success: true, message: `✅ Article "${formData.article}" mis à jour!` };

  }, 'stock_update', { showUI: false })();
}

function stock_archiveOrDelete(rowNum, confirm = false) {
  return ErrorHandler.wrap(function() {
    if (!rowNum || rowNum < 2) throw new Error('Ligne invalide');
    if (!PermissionManager.isAtLeast('manager')) throw new Error('Accès refusé.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const articleId = sheet.getRange(rowNum, S_COLS.ID).getValue();
    const articleName = sheet.getRange(rowNum, S_COLS.ARTICLE).getValue();
    const qteStock = sheet.getRange(rowNum, S_COLS.STOCK_ACTUEL).getValue();

    if (qteStock > 0 && !confirm) {
      return {
        success: false,
        needsConfirmation: true,
        message: `⚠️ "${articleName}" a une quantité de ${qteStock} en stock.\n\nConfirmer l'ARCHIVAGE?`,
        data: { articleId, articleName, qteStock, rowNum }
      };
    }

    const rowData = sheet.getRange(rowNum, 1, 1, S_CONF.headers.length).getValues()[0];
    const user = Session.getActiveUser().getEmail();

    if (confirm && qteStock > 0) {
      Logger4.warn('Tentative suppression avec stock', {id: articleId, qte: qteStock});
      confirm = false;
    }

    if (confirm) {
      sheet.deleteRow(rowNum);
      stock_addAuditLog(articleId, 'DELETE (HARD)', { nom: articleName });
      Logger4.info('⛔ Article supprimé', { id: articleId });
    } else {
      const archiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_ARCHIVE_SHEET_NAME);
      if (!archiveSheet) throw new Error(`Feuille "${S_ARCHIVE_SHEET_NAME}" introuvable.`);
      const archiveData = [...rowData, new Date(), user];
      archiveSheet.appendRow(archiveData);
      sheet.deleteRow(rowNum);
      stock_addAuditLog(articleId, 'ARCHIVE', { nom: articleName });
      Logger4.info('🗑️ Article archivé', { id: articleId });
    }

    CacheService.invalidate('stock_');
    EventManager.trigger('stock:deleted', { id: articleId, nom: articleName, row: rowNum, hardDelete: confirm });

    const message = confirm ? `⛔ Article "${articleName}" supprimé!` : `🗑️ Article "${articleName}" archivé!`;
    return { success: true, message: message };

  }, 'stock_archiveOrDelete', { showUI: false })();
}

// ============================================================================
// 6. MOUVEMENTS DE STOCK
// ============================================================================

function stock_addMovement(articleId, type, quantite, coutUnitaire = 0, refDoc = '', notes = '') {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_MOUVEMENTS_SHEET_NAME);
    if (!sheet) return;

    const user = Session.getActiveUser() ? Session.getActiveUser().getEmail() : 'SYSTEM';
    const timestamp = new Date();
    const articleName = _stock_lookupNameById(articleId);

    sheet.appendRow([
      '', timestamp, user, articleId, articleName,
      type, quantite, coutUnitaire, refDoc, notes
    ]);

    Logger4.debug('Mouvement enregistré', { articleId, type, quantite });
  } catch (e) {
    Logger4.error('Échec mouvement', { error: e.message, articleId, type });
  }
}

function stock_stockAdjust(articleId, quantite, isPositive, notes) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('manager')) throw new Error('Accès refusé.');
    if (!articleId || !quantite || quantite <= 0) throw new Error('Données invalides.');

    const qte = parseFloat(quantite);
    const type = isPositive ? 'Ajustement +' : 'Ajustement -';
    const articleName = _stock_lookupNameById(articleId);

    stock_addMovement(articleId, type, qte, 0, 'AJUSTEMENT', notes);
    stock_addAuditLog(articleId, 'AJUSTEMENT_STOCK', { type, quantite: qte, notes });

    CacheService.invalidate('stock_');
    EventManager.trigger('stock:adjusted', { id: articleId, quantite: isPositive ? qte : -qte });

    Logger4.info('✅ Ajustement enregistré', { articleId, type, quantite: qte });
    return { success: true, message: `✅ Ajustement de ${qte} pour "${articleName}" enregistré.\nStock mis à jour à 2h.` };

  }, 'stock_stockAdjust', { showUI: false })();
}

// ============================================================================
// 7. COMMANDES (PO)
// ============================================================================

function stock_addPurchaseOrder(poData, itemsData) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('stock_manager')) throw new Error('Accès refusé.');
    if (!itemsData || itemsData.length === 0) throw new Error('Commande vide.');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const poSheet = ss.getSheetByName(S_PO_SHEET_NAME);
    const poDetailsSheet = ss.getSheetByName(S_PO_DETAILS_SHEET_NAME);

    let montantTotal = 0;
    itemsData.forEach(item => {
      montantTotal += (parseFloat(item.qte) || 0) * (parseFloat(item.cout) || 0);
    });

    const poRowData = [
      '', new Date(poData.date), poData.idFournisseur, '', 'Commandé',
      montantTotal, new Date(poData.dateAttendue), null, poData.notes
    ];

    poSheet.appendRow(poRowData);
    SpreadsheetApp.flush();
    const poId = poSheet.getRange(poSheet.getLastRow(), 1).getValue();

    const detailsRows = itemsData.map(item => [
      '', poId, item.idArticle, _stock_lookupNameById(item.idArticle),
      item.qte, item.cout, ''
    ]);

    poDetailsSheet.getRange(poDetailsSheet.getLastRow() + 1, 1, detailsRows.length, detailsRows[0].length).setValues(detailsRows);

    stock_addAuditLog(poId, 'PO_CREATE', { fournisseur: poData.idFournisseur, items: itemsData.length, total: montantTotal });
    Logger4.info('Commande créée', { poId, items: itemsData.length });

    return { success: true, message: `Commande ${poId} créée.` };

  }, 'stock_addPurchaseOrder', { showUI: false })();
}

function stock_receivePurchaseOrder(poId) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('stock_manager')) throw new Error('Accès refusé.');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const poSheet = ss.getSheetByName(S_PO_SHEET_NAME);
    const poDetailsSheet = ss.getSheetByName(S_PO_DETAILS_SHEET_NAME);

    const poRow = _stock_findRowById(poId, poSheet, 1);
    if (poRow === -1) throw new Error('Commande introuvable.');

    poSheet.getRange(poRow, 5).setValue('Reçu');
    poSheet.getRange(poRow, 8).setValue(new Date());

    const allDetails = poDetailsSheet.getRange(2, 1, poDetailsSheet.getLastRow() - 1, 7).getValues();
    const itemsToReceive = allDetails.filter(row => row[1] === poId);

    if (itemsToReceive.length === 0) throw new Error('Aucun article.');

    itemsToReceive.forEach(item => {
      stock_addMovement(item[2], 'Entrée', item[4], item[5], poId, 'Réception commande');
    });

    stock_runDailyRecalculation();

    stock_addAuditLog(poId, 'PO_RECEIVE', { items: itemsToReceive.length });
    Logger4.info('Commande reçue', { poId });

    return { success: true, message: `Commande ${poId} reçue.` };

  }, 'stock_receivePurchaseOrder', { showUI: false })();
}

// ============================================================================
// 8. CRUD FOURNISSEURS
// ============================================================================

function supplier_add(formData) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('stock_manager')) throw new Error('Accès refusé.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SUPPLIERS_SHEET_NAME);
    sheet.appendRow([
      '', formData.nom, formData.contact, formData.telephone,
      formData.email, formData.adresse, formData.notes
    ]);

    CacheService.invalidate('suppliers_');
    return { success: true, message: 'Fournisseur ajouté.' };

  }, 'supplier_add', { showUI: false })();
}

function supplier_update(formData) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('stock_manager')) throw new Error('Accès refusé.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SUPPLIERS_SHEET_NAME);
    const row = parseInt(formData.row, 10);

    const updates = [
      [2, formData.nom], [3, formData.contact], [4, formData.telephone],
      [5, formData.email], [6, formData.adresse], [7, formData.notes]
    ];

    updates.forEach(([col, val]) => {
      sheet.getRange(row, col).setValue(val);
    });

    CacheService.invalidate('suppliers_');
    return { success: true, message: 'Fournisseur mis à jour.' };

  }, 'supplier_update', { showUI: false })();
}

function supplier_get(rowNum) {
  return ErrorHandler.wrap(function() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SUPPLIERS_SHEET_NAME);
    const data = sheet.getRange(rowNum, 1, 1, 7).getValues()[0];

    return {
      success: true,
      data: {
        row: rowNum, id: data[0], nom: data[1], contact: data[2],
        telephone: data[3], email: data[4], adresse: data[5], notes: data[6]
      }
    };
  }, 'supplier_get', { showUI: false })();
}

function supplier_delete(rowNum) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('manager')) throw new Error('Accès refusé.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SUPPLIERS_SHEET_NAME);
    sheet.deleteRow(rowNum);

    CacheService.invalidate('suppliers_');
    return { success: true, message: 'Fournisseur supprimé.' };

  }, 'supplier_delete', { showUI: false })();
}

function supplier_getListForDropdown() {
  return ErrorHandler.wrap(function() {
    const cacheKey = 'suppliers_list_dropdown_v12';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SUPPLIERS_SHEET_NAME);
    if (sheet.getLastRow() < 2) return [];

    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    const results = data
      .filter(row => row[0] && row[1])
      .map(row => ({ id: row[0], nom: row[1] }))
      .sort((a, b) => a.nom.localeCompare(b.nom));

    CacheService.set(cacheKey, results, C_LIMITS.CACHE_TTL_LONG);
    return results;

  }, 'supplier_getListForDropdown', { showUI: false })();
}

// ============================================================================
// 9. ANALYTICS & GETTERS V12.6.5
// ============================================================================

function stock_search(filters = {}) {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('user')) throw new Error('Accès refusé.');

    const cacheKey = `stock_search_${JSON.stringify(filters)}`;
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return { success: true, data: [] };

    const data = sheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();
    let results = data.map((row, index) => {
      const obj = { row: index + 2 };
      Object.keys(S_COLS).forEach(key => {
        obj[key.toLowerCase()] = row[S_COLS[key] - 1];
      });
      return obj;
    });

    if (filters.categorie) {
      results = results.filter(item => item.categorie === filters.categorie);
    }

    if (filters.statut) {
      results = results.filter(item => item.statut_stock === filters.statut);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(item =>
        (item.article && item.article.toLowerCase().includes(searchLower)) ||
        (item.reference && item.reference.toLowerCase().includes(searchLower)) ||
        (item.tags && item.tags.toLowerCase().includes(searchLower))
      );
    }

    if (filters.fournisseur) {
      results = results.filter(item => item.fournisseur === filters.fournisseur);
    }

    if (filters.sortBy) {
      const sortKey = filters.sortBy.toLowerCase();
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

      results.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * sortOrder;
        }

        return String(valA).localeCompare(String(valB)) * sortOrder;
      });
    }

    if (filters.limit) {
      results = results.slice(0, parseInt(filters.limit));
    }

    const response = { success: true, data: results, count: results.length };
    CacheService.set(cacheKey, response, C_LIMITS.CACHE_TTL_SHORT);

    return response;

  }, 'stock_search', { showUI: false })();
}

function stock_getStats() {
  return ErrorHandler.wrap(function() {
    const cacheKey = 'stock_stats_global_v12';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return {
        success: true,
        data: {
          totalArticles: 0, valeurTotale: 0, ruptures: 0,
          aCommander: 0, ok: 0, categoriesCount: 0
        }
      };
    }

    const data = sheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();

    const stats = {
      totalArticles: data.length,
      valeurTotale: 0,
      ruptures: 0,
      aCommander: 0,
      ok: 0,
      categories: new Set(),
      fournisseurs: new Set()
    };

    data.forEach(row => {
      const valeur = parseFloat(row[S_COLS.VALEUR_STOCK - 1]) || 0;
      const statut = row[S_COLS.STATUT_STOCK - 1];
      const categorie = row[S_COLS.CATEGORIE - 1];
      const fournisseur = row[S_COLS.FOURNISSEUR - 1];

      stats.valeurTotale += valeur;

      if (statut === 'Rupture') stats.ruptures++;
      else if (statut === 'À Commander') stats.aCommander++;
      else if (statut === 'OK') stats.ok++;

      if (categorie) stats.categories.add(categorie);
      if (fournisseur) stats.fournisseurs.add(fournisseur);
    });

    const response = {
      success: true,
      data: {
        totalArticles: stats.totalArticles,
        valeurTotale: Math.round(stats.valeurTotale),
        ruptures: stats.ruptures,
        aCommander: stats.aCommander,
        ok: stats.ok,
        categoriesCount: stats.categories.size,
        fournisseursCount: stats.fournisseurs.size
      }
    };

    CacheService.set(cacheKey, response, C_LIMITS.CACHE_TTL_MEDIUM);
    return response;

  }, 'stock_getStats', { showUI: false })();
}

function stock_getLowStock(limit = 20) {
  return ErrorHandler.wrap(function() {
    const cacheKey = `stock_low_${limit}`;
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return { success: true, data: [] };

    const data = sheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();

    const lowStockItems = [];

    data.forEach((row, index) => {
      const statut = row[S_COLS.STATUT_STOCK - 1];

      if (statut === 'Rupture' || statut === 'À Commander') {
        lowStockItems.push({
          row: index + 2,
          id: row[S_COLS.ID - 1],
          article: row[S_COLS.ARTICLE - 1],
          categorie: row[S_COLS.CATEGORIE - 1],
          stockActuel: row[S_COLS.STOCK_ACTUEL - 1],
          stockMin: row[S_COLS.STOCK_MIN - 1],
          statut: statut,
          fournisseur: row[S_COLS.FOURNISSEUR - 1],
          priorite: statut === 'Rupture' ? 1 : 2
        });
      }
    });

    lowStockItems.sort((a, b) => {
      if (a.priorite !== b.priorite) return a.priorite - b.priorite;
      return a.stockActuel - b.stockActuel;
    });

    const results = lowStockItems.slice(0, limit);
    const response = { success: true, data: results, count: results.length };

    CacheService.set(cacheKey, response, C_LIMITS.CACHE_TTL_SHORT);
    return response;

  }, 'stock_getLowStock', { showUI: false })();
}

function stock_getTopValue(limit = 10) {
  return ErrorHandler.wrap(function() {
    const cacheKey = `stock_top_value_${limit}`;
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return { success: true, data: [] };

    const data = sheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();

    const items = data.map((row, index) => ({
      row: index + 2,
      id: row[S_COLS.ID - 1],
      article: row[S_COLS.ARTICLE - 1],
      categorie: row[S_COLS.CATEGORIE - 1],
      stockActuel: row[S_COLS.STOCK_ACTUEL - 1],
      valeur: parseFloat(row[S_COLS.VALEUR_STOCK - 1]) || 0
    }));

    items.sort((a, b) => b.valeur - a.valeur);

    const results = items.slice(0, limit);
    const response = { success: true, data: results, count: results.length };

    CacheService.set(cacheKey, response, C_LIMITS.CACHE_TTL_MEDIUM);
    return response;

  }, 'stock_getTopValue', { showUI: false })();
}

function stock_getRecentMovements(limit = 50) {
  return ErrorHandler.wrap(function() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_MOUVEMENTS_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return { success: true, data: [] };

    const startRow = Math.max(2, lastRow - limit + 1);
    const numRows = lastRow - startRow + 1;

    const data = sheet.getRange(startRow, 1, numRows, 10).getValues();

    const movements = data.map(row => ({
      id: row[0],
      timestamp: CameroonUtils.formatDateTime(row[1]),
      utilisateur: row[2],
      articleId: row[3],
      articleNom: row[4],
      type: row[5],
      quantite: row[6],
      coutUnitaire: row[7],
      idCommande: row[8],
      notes: row[9]
    })).reverse();

    return { success: true, data: movements, count: movements.length };

  }, 'stock_getRecentMovements', { showUI: false })();
}

function stock_getCategoryAnalysis() {
  return ErrorHandler.wrap(function() {
    const cacheKey = 'stock_category_analysis';
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return { success: true, data: [] };

    const data = sheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();

    const categoryMap = new Map();

    data.forEach(row => {
      const categorie = row[S_COLS.CATEGORIE - 1];
      const valeur = parseFloat(row[S_COLS.VALEUR_STOCK - 1]) || 0;
      const qte = parseFloat(row[S_COLS.STOCK_ACTUEL - 1]) || 0;

      if (!categorie) return;

      if (!categoryMap.has(categorie)) {
        categoryMap.set(categorie, {
          categorie: categorie,
          count: 0,
          valeurTotale: 0,
          qteTotale: 0
        });
      }

      const catData = categoryMap.get(categorie);
      catData.count++;
      catData.valeurTotale += valeur;
      catData.qteTotale += qte;
    });

    const results = Array.from(categoryMap.values()).sort((a, b) => b.valeurTotale - a.valeurTotale);
    const response = { success: true, data: results };

    CacheService.set(cacheKey, response, C_LIMITS.CACHE_TTL_MEDIUM);
    return response;

  }, 'stock_getCategoryAnalysis', { showUI: false })();
}

// ============================================================================
// 10. UI FUNCTIONS V12.6.5
// ============================================================================

function _stock_getHtmlConfig(moduleKey) {
  const module = CONFIG_APP.modules[moduleKey];
  if (!module) return {};

  return {
    app: {
      name: CONFIG_APP.app.name,
      version: CONFIG_APP.app.version,
      currency: CONFIG_APP.app.currency
    },
    module: {
      sheetName: module.sheetName,
      dashboardName: module.dashboard ? module.dashboard.sheetName : null,
      lists: module.lists
    }
  };
}

function showStockSidebar() {
  return ErrorHandler.wrap(function() {
    if (!_isUiAvailable()) {
      Logger4.warn('showStockSidebar appelé sans contexte UI');
      return;
    }

    if (!PermissionManager.hasPermission('stocks', 'user')) return notifyAccessDenied();

    const template = HtmlService.createTemplateFromFile(S_CONF.sidebar.file);
    template.config = _stock_getHtmlConfig('stocks');
    const html = template.evaluate().setTitle(S_CONF.sidebar.title).setWidth(320);

    SpreadsheetApp.getUi().showSidebar(html);
    Logger4.info('Sidebar Stock ouverte');

  }, 'showStockSidebar', { showUI: false })();
}

function showStockModal(mode = 'add', rowNum = null) {
  return ErrorHandler.wrap(function() {
    if (!_isUiAvailable()) {
      Logger4.warn('showStockModal appelé sans contexte UI');
      return;
    }

    if (!PermissionManager.hasPermission('stocks', 'user')) return notifyAccessDenied();

    const template = HtmlService.createTemplateFromFile(S_CONF.modal.file);
    template.mode = mode;
    template.rowNum = rowNum;
    template.config = _stock_getHtmlConfig('stocks');

    const titles = {
      add: '➕ Nouvel Article',
      edit: '✏️ Modifier Article',
      view: '👁️ Fiche Article'
    };

    const html = template.evaluate().setWidth(700).setHeight(750);
    SpreadsheetApp.getUi().showModalDialog(html, titles[mode] || S_CONF.modal.title);

    Logger4.info(`Modal Stock ouverte (mode: ${mode})`);

  }, 'showStockModal', { showUI: false })();
}

// ============================================================================
// 11. DASHBOARD V12.6.5
// ============================================================================

function setupStockDashboard() {
  return ErrorHandler.wrap(function() {
    Logger4.info('🚀 Initialisation Dashboard Stock...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(S_DASHBOARD_SHEET_NAME);

    if (sheet) {
      sheet.clear();
      sheet.clearConditionalFormatRules();
      sheet.getCharts().forEach(chart => sheet.removeChart(chart));
    } else {
      sheet = ss.insertSheet(S_DASHBOARD_SHEET_NAME, 3);
    }

    ss.setActiveSheet(sheet);

    sheet.setFrozenRows(3);
    sheet.getRange('A:K').setBackground(C_COLORS.surfaceVariant);
    sheet.setColumnWidths(1, 11, 150);

    sheet.getRange('A1:K1').merge()
      .setValue(`📦 Tableau de Bord Stock V12.6.5 (${CONFIG_APP.app.name})`)
      .setFontSize(24).setFontWeight('bold').setFontFamily('Product Sans')
      .setBackground(C_COLORS.primary).setFontColor('#FFFFFF')
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.setRowHeight(1, 70);

    sheet.getRange('A2:K2').merge()
      .setValue(`Données en direct de "${S_SHEET_NAME}" | Stock recalculé chaque nuit à 2h`)
      .setFontSize(10).setFontColor(C_COLORS.secondary)
      .setHorizontalAlignment('center').setBackground(C_COLORS.outline);
    sheet.setRowHeight(2, 30);
    sheet.setRowHeight(3, 20);

    const sourceSheet = ss.getSheetByName(S_SHEET_NAME);
    if (!sourceSheet) throw new Error(`Feuille "${S_SHEET_NAME}" introuvable.`);

    let lastRow = sourceSheet.getLastRow() < 2 ? 2 : sourceSheet.getLastRow();
    const sourceRange = `'${S_SHEET_NAME}'!A2:${_colA1_stock(S_CONF.headers.length)}${lastRow}`;

    const mvtSheet = ss.getSheetByName(S_MOUVEMENTS_SHEET_NAME);
    lastRow = mvtSheet.getLastRow() < 2 ? 2 : mvtSheet.getLastRow();
    const mvtSourceRange = `'${S_MOUVEMENTS_SHEET_NAME}'!A2:K${lastRow}`;

    const poSheet = ss.getSheetByName(S_PO_SHEET_NAME);
    lastRow = poSheet.getLastRow() < 2 ? 2 : poSheet.getLastRow();
    const poSourceRange = `'${S_PO_SHEET_NAME}'!A2:I${lastRow}`;

    sheet.getRange('A4').setValue('Indicateurs Clés').setFontSize(16).setFontWeight('bold').setFontColor(C_COLORS.primary);

    _stock_db_createScorecard(sheet, 'A5', 'Valeur Stock Total',
      `=SUM('${S_SHEET_NAME}'!${_colA1_stock(S_COLS.VALEUR_STOCK)}2:${_colA1_stock(S_COLS.VALEUR_STOCK)})`,
      C_COLORS.primary, '#,##0" FCFA"');

    _stock_db_createScorecard(sheet, 'C5', 'Ruptures',
      `=COUNTIF(${sourceRange}; "Rupture")`,
      C_COLORS.error, '#,##0');

    _stock_db_createScorecard(sheet, 'E5', 'À Commander',
      `=COUNTIF(${sourceRange}; "À Commander")`,
      C_COLORS.warning, '#,##0');

    _stock_db_createScorecard(sheet, 'G5', 'Commandes Attente',
      `=COUNTIF(${poSourceRange}; "Commandé")`,
      C_COLORS.primaryLight, '#,##0');

    _stock_db_createScorecard(sheet, 'I5', 'Valeur Commandée',
      `=SUMIF(${poSourceRange}; "Commandé"; 'BD_COMMANDES_STOCK'!F:F)`,
      C_COLORS.primaryLight, '#,##0" FCFA"');

    sheet.setRowHeight(5, 120);
    sheet.setRowHeight(7, 20);

    _stock_db_createChart(sheet, 'A8', 'Valeur Stock par Catégorie', 5,
      _stock_db_buildChart(sheet, 'PIE',
        `=QUERY(${sourceRange}; "SELECT ${_colA1_stock(S_COLS.CATEGORIE)}, SUM(${_colA1_stock(S_COLS.VALEUR_STOCK)}) WHERE ${_colA1_stock(S_COLS.CATEGORIE)} IS NOT NULL GROUP BY ${_colA1_stock(S_COLS.CATEGORIE)} LABEL SUM(${_colA1_stock(S_COLS.VALEUR_STOCK)}) ''"; 1)`,
        { title: 'Valeur Stock par Catégorie', pieHole: 0.4 }
      ));

    _stock_db_createChart(sheet, 'F8', 'Statut Commandes', 6,
      _stock_db_buildChart(sheet, 'PIE',
        `=QUERY(${poSourceRange}; "SELECT E, COUNT(E) WHERE E IS NOT NULL GROUP BY E LABEL COUNT(E) ''"; 1)`,
        { title: 'Statut Commandes', colors: [C_COLORS.primary, C_COLORS.warning, C_COLORS.success, C_COLORS.error] }
      ));

    sheet.setRowHeight(8, 300);
    sheet.setRowHeight(25, 20);

    _stock_db_createDynamicTable(sheet, 'A26', 'Articles en Rupture', 5,
      `=QUERY(${sourceRange}; "SELECT ${_colA1_stock(S_COLS.ID)}, ${_colA1_stock(S_COLS.ARTICLE)}, ${_colA1_stock(S_COLS.STOCK_MIN)}, ${_colA1_stock(S_COLS.FOURNISSEUR)} WHERE ${_colA1_stock(S_COLS.STATUT_STOCK)} = 'Rupture' LIMIT 10"; 1)`,
      [null, null, {format: '#,##0'}, null],
      C_COLORS.error
    );

    _stock_db_createDynamicTable(sheet, 'F26', 'Commandes en Attente', 6,
      `=QUERY(${poSourceRange}; "SELECT A, D, F, G WHERE E = 'Commandé' ORDER BY G ASC LIMIT 10"; 1)`,
      [null, null, {format: '#,##0" FCFA"'}, {format: 'dd/mm/yyyy'}],
      C_COLORS.warning
    );

    Logger4.info('✅ Dashboard créé');

    if (_isUiAvailable()) {
      notify('Dashboard généré!', 'Succès', 'success');
    }

  }, 'setupStockDashboard', { showUI: false, severity: 'critical' })();
}

function _stock_db_createScorecard(sheet, a1Notation, title, formula, color, numberFormat = '#,##0') {
  try {
    const range = sheet.getRange(a1Notation);
    const cellRow = range.getRow();
    const cellCol = range.getColumn();

    sheet.getRange(cellRow, cellCol, 1, 2).merge()
      .setValue(title).setBackground(color).setFontColor('#FFFFFF')
      .setFontWeight('bold').setFontSize(11)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');

    sheet.getRange(cellRow + 1, cellCol, 1, 2).merge()
      .setFormula(formula).setBackground(C_COLORS.surface)
      .setFontColor(color).setFontWeight('bold').setFontSize(24)
      .setNumberFormat(numberFormat)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');

    sheet.getRange(cellRow, cellCol, 2, 2).setBorder(true, true, true, true, null, null, color, SpreadsheetApp.BorderStyle.SOLID_THICK);
    sheet.setRowHeight(cellRow, 40);
    sheet.setRowHeight(cellRow + 1, 80);
  } catch (e) {
    Logger4.error(`Échec Scorecard: ${title}`, e);
    sheet.getRange(a1Notation).setValue(`ERREUR: ${title}`);
  }
}

function _stock_db_createChart(sheet, a1Notation, title, colSpan, chart) {
  try {
    const range = sheet.getRange(a1Notation);
    const cellRow = range.getRow();
    const cellCol = range.getColumn();

    sheet.getRange(cellRow, cellCol, 1, colSpan).merge()
      .setValue(`📊 ${title}`).setFontWeight('bold').setFontSize(14).setFontColor(C_COLORS.secondary)
      .setBackground(C_COLORS.surface).setVerticalAlignment('middle')
      .setBorder(true, true, true, true, null, null, C_COLORS.outline, SpreadsheetApp.BorderStyle.SOLID);

    sheet.getRange(cellRow + 1, cellCol, 1, colSpan).merge()
      .setBackground(C_COLORS.surface)
      .setBorder(null, true, true, true, null, null, C_COLORS.outline, SpreadsheetApp.BorderStyle.SOLID);

    sheet.insertChart(chart.setPosition(cellRow + 1, cellCol, 5, 5).build());
  } catch (e) {
    Logger4.error(`Échec Graphique: ${title}`, e);
    sheet.getRange(a1Notation).setValue(`ERREUR: ${title}`);
  }
}

function _stock_db_buildChart(sheet, type, formula, options = {}) {
  const dataZone = sheet.getRange('M1');
  const dataCell = sheet.getRange(dataZone.getRow() + sheet.getLastRow() + 2, dataZone.getColumn());
  dataCell.setFormula(formula);
  const dataRange = dataCell.getDataRegion();

  let chartBuilder;
  const chartTypes = {
    'PIE': Charts.ChartType.PIE,
    'BAR': Charts.ChartType.BAR,
    'COLUMN': Charts.ChartType.COLUMN,
    'LINE': Charts.ChartType.LINE
  };

  chartBuilder = sheet.newChart().setChartType(chartTypes[type] || Charts.ChartType.PIE);

  chartBuilder
    .addRange(dataRange)
    .setOption('title', options.title || 'Graphique')
    .setOption('legend', { position: 'right' })
    .setOption('pieHole', options.pieHole || 0)
    .setOption('colors', options.colors || [C_COLORS.primary, C_COLORS.success, C_COLORS.warning, C_COLORS.error])
    .setOption('vAxis', options.vAxis || {})
    .setOption('hAxis', options.hAxis || {})
    .setOption('isStacked', options.isStacked || false)
    .setOption('backgroundColor', C_COLORS.surface);

  return chartBuilder;
}

function _stock_db_createDynamicTable(sheet, a1Notation, title, colSpan, formula, formats = [], headerColor = C_COLORS.secondary) {
  try {
    const range = sheet.getRange(a1Notation);
    const cellRow = range.getRow();
    const cellCol = range.getColumn();

    sheet.getRange(cellRow, cellCol, 1, colSpan).merge()
      .setValue(`📋 ${title}`).setFontWeight('bold').setFontSize(14).setFontColor('#FFFFFF')
      .setBackground(headerColor).setVerticalAlignment('middle')
      .setBorder(true, true, true, true, null, null, C_COLORS.outline, SpreadsheetApp.BorderStyle.SOLID);

    const dataCell = sheet.getRange(cellRow + 1, cellCol);
    dataCell.setFormula(formula);

    formats.forEach((fmt, index) => {
      if (fmt && fmt.format) {
        sheet.getRange(cellRow + 2, cellCol + index, 10, 1).setNumberFormat(fmt.format);
      }
    });

    sheet.getRange(cellRow + 1, cellCol, 11, colSpan).setBackground(C_COLORS.surface);
    sheet.getRange(cellRow + 1, cellCol, 11, colSpan).setBorder(true, true, true, true, true, true, C_COLORS.outline, SpreadsheetApp.BorderStyle.SOLID);
  } catch (e) {
    Logger4.error(`Échec Table: ${title}`, e);
    sheet.getRange(a1Notation).setValue(`ERREUR: ${title}`);
  }
}

// ============================================================================
// 12. AUDIT & LOGGING
// ============================================================================

function stock_addAuditLog(articleId, action, details) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_AUDIT_SHEET_NAME);
    if (!sheet) return;

    const user = Session.getActiveUser() ? Session.getActiveUser().getEmail() : 'SYSTEM';
    const timestamp = new Date();
    let articleName = (action === 'CREATE') ? details.nom : _stock_lookupNameById(articleId);
    let champ = '', oldVal = '', newVal = '', detailsJson = '';

    if (action === 'UPDATE' || action === 'EDIT (SHEET)') {
      champ = details.champ || details.colonne;
      oldVal = details.old || details.ancienneValeur;
      newVal = details.new || details.nouvelleValeur;
    } else {
      detailsJson = JSON.stringify(details);
    }

    sheet.appendRow([
      timestamp, user, action.toUpperCase(), articleId, articleName,
      champ, oldVal, newVal, detailsJson
    ]);
  } catch (e) {
    Logger4.error('Échec audit', { error: e.message, articleId, action });
  }
}

const _stockNameCache = {};

function _stock_lookupNameById(articleId) {
  if (_stockNameCache[articleId]) return _stockNameCache[articleId];

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const ids = sheet.getRange(2, S_COLS.ID, sheet.getLastRow() - 1, 1).getValues();
    const names = sheet.getRange(2, S_COLS.ARTICLE, sheet.getLastRow() - 1, 1).getValues();

    for (let i = 0; i < ids.length; i++) {
      if (ids[i][0] === articleId) {
        const name = names[i][0];
        _stockNameCache[articleId] = name;
        return name;
      }
    }
  } catch(e) { /* Ignorer */ }

  return articleId;
}

function stock_getAuditLog(articleId) {
  return ErrorHandler.wrap(function() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_AUDIT_SHEET_NAME);
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    const results = [];

    for (let i = data.length - 1; i > 0; i--) {
      if (data[i][3] === articleId) {
        results.push({
          timestamp: CameroonUtils.formatDateTime(data[i][0]),
          user: data[i][1], action: data[i][2], champ: data[i][5],
          oldVal: data[i][6], newVal: data[i][7],
          details: data[i][8] ? JSON.parse(data[i][8]) : ''
        });
      }
      if (results.length >= 50) break;
    }

    return results;
  }, 'stock_getAuditLog', { showUI: false })();
}

// ============================================================================
// 13. TRIGGERS & AUTOMATION
// ============================================================================

function _stock_installTriggers() {
  _stock_uninstallTriggers();

  ScriptApp.newTrigger('stock_runDailyRecalculation')
    .timeBased()
    .atHour(2)
    .everyDays(1)
    .inTimezone(CONFIG_APP.app.timezone)
    .create();

  ScriptApp.newTrigger('stock_runDailyEnrichment')
    .timeBased()
    .atHour(3)
    .everyDays(1)
    .inTimezone(CONFIG_APP.app.timezone)
    .create();

  Logger4.info('Triggers Stock installés');
}

function _stock_uninstallTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const triggerNames = [
    'stock_onEdit', 'stock_runDailyEnrichment', 'stock_runDailyRecalculation',
    'inventory_onEdit', 'inventory_runDailyEnrichment'
  ];

  for (const trigger of triggers) {
    if (triggerNames.includes(trigger.getHandlerFunction())) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

function stock_onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();

    if (range.getRow() === 1) return;
    if (range.getNumRows() > 1 || range.getNumColumns() > 1) return;

    const protectedCols = [
      S_COLS.ID, S_COLS.STOCK_ACTUEL, S_COLS.VALEUR_STOCK, S_COLS.STATUT_STOCK,
      S_COLS.DERNIERE_ENTREE, S_COLS.DERNIERE_SORTIE
    ];

    const col = range.getColumn();

    if (col === S_COLS.STOCK_ACTUEL) {
      range.setValue(e.oldValue);
      if (_isUiAvailable()) {
        notify('Modification bloquée. Utilisez "Ajouter Mouvement".', 'Stock Protégé', 'error');
      }
      return;
    }

    if (protectedCols.includes(col)) return;

    const oldValue = e.oldValue;
    const newValue = e.value;
    if (oldValue == newValue) return;

    const row = range.getRow();
    const user = e.user ? e.user.getEmail() : 'SYSTEM';
    const now = new Date();

    if (S_COLS.DERNIERE_MODIFICATION) sheet.getRange(row, S_COLS.DERNIERE_MODIFICATION).setValue(now);
    if (S_COLS.MODIFIE_PAR) sheet.getRange(row, S_COLS.MODIFIE_PAR).setValue(user);

    CacheService.invalidate('stock_');

    const articleId = sheet.getRange(row, S_COLS.ID).getValue();
    const colName = S_CONF.headers[col - 1];

    stock_addAuditLog(articleId, 'EDIT (SHEET)', {
      champ: colName,
      old: oldValue,
      new: newValue
    });

  } catch (err) {
    Logger4.error('Erreur stock_onEdit', { error: err.message });
  }
}

// ============================================================================
// 14. RECALCUL NOCTURNE
// ============================================================================

function stock_runDailyRecalculation() {
  return ErrorHandler.wrap(function() {
    Logger4.info('Début recalcul nocturne...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const mvtSheet = ss.getSheetByName(S_MOUVEMENTS_SHEET_NAME);
    const stockSheet = ss.getSheetByName(S_SHEET_NAME);

    if (!mvtSheet || !stockSheet) {
      throw new Error('Feuilles introuvables.');
    }

    const mvtData = mvtSheet.getRange(2, 1, mvtSheet.getLastRow() - 1, 11).getValues();
    const stockMap = {};

    const COL_MVT = { ID_ARTICLE: 3, TYPE: 5, QTE: 6, DATE: 1 };

    mvtData.forEach(row => {
      const articleId = row[COL_MVT.ID_ARTICLE];
      if (!articleId) return;

      if (!stockMap[articleId]) {
        stockMap[articleId] = { qte: 0, lastIn: null, lastOut: null };
      }

      const quantite = parseFloat(row[COL_MVT.QTE]) || 0;
      const type = row[COL_MVT.TYPE];
      const date = new Date(row[COL_MVT.DATE]);

      if (type === 'Entrée' || type === 'Ajustement +' || type === 'Entrée Initiale') {
        stockMap[articleId].qte += quantite;
        if (!stockMap[articleId].lastIn || date > stockMap[articleId].lastIn) {
          stockMap[articleId].lastIn = date;
        }
      } else if (type === 'Sortie' || type === 'Ajustement -') {
        stockMap[articleId].qte -= quantite;
        if (!stockMap[articleId].lastOut || date > stockMap[articleId].lastOut) {
          stockMap[articleId].lastOut = date;
        }
      }
    });

    const lastRow = stockSheet.getLastRow();
    if (lastRow < 2) return;

    const stockRange = stockSheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length);
    const stockData = stockRange.getValues();

    const qteData = [];
    const lastInData = [];
    const lastOutData = [];

    stockData.forEach(row => {
      const articleId = row[S_COLS.ID - 1];
      const stockInfo = stockMap[articleId];

      qteData.push([stockInfo ? stockInfo.qte : 0]);
      lastInData.push([stockInfo ? stockInfo.lastIn : null]);
      lastOutData.push([stockInfo ? stockInfo.lastOut : null]);
    });

    stockSheet.getRange(2, S_COLS.STOCK_ACTUEL, qteData.length, 1).setValues(qteData);
    stockSheet.getRange(2, S_COLS.DERNIERE_ENTREE, lastInData.length, 1).setValues(lastInData);
    stockSheet.getRange(2, S_COLS.DERNIERE_SORTIE, lastOutData.length, 1).setValues(lastOutData);

    CacheService.invalidate('stock_');
    Logger4.info(`✅ Recalcul terminé: ${stockData.length} articles.`);

  }, 'stock_runDailyRecalculation', { showUI: false })();
}

// ============================================================================
// 15. ENRICHISSEMENT NOCTURNE
// ============================================================================

function stock_runDailyEnrichment() {
  return ErrorHandler.wrap(function() {
    Logger4.info('Début enrichissement...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const stockSheet = ss.getSheetByName(S_SHEET_NAME);
    const mvtSheet = ss.getSheetByName(S_MOUVEMENTS_SHEET_NAME);

    const lastRow = stockSheet.getLastRow();
    if (lastRow < 2) return;

    const mvtData = mvtSheet.getRange(2, 1, mvtSheet.getLastRow() - 1, 11).getValues();
    const salesMap = {};
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const COL_MVT = { ID_ARTICLE: 3, TYPE: 5, QTE: 6, DATE: 1 };

    mvtData.forEach(row => {
      const date = new Date(row[COL_MVT.DATE]);
      if (date >= thirtyDaysAgo) {
        const type = row[COL_MVT.TYPE];
        if (type === 'Sortie') {
          const articleId = row[COL_MVT.ID_ARTICLE];
          const quantite = parseFloat(row[COL_MVT.QTE]) || 0;
          salesMap[articleId] = (salesMap[articleId] || 0) + quantite;
        }
      }
    });

    const stockData = stockSheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();
    const rotationData = [];

    stockData.forEach(row => {
      const articleId = row[S_COLS.ID - 1];
      const stockActuel = parseFloat(row[S_COLS.STOCK_ACTUEL - 1]) || 0;
      const sales30j = salesMap[articleId] || 0;

      let rotationRate = null;

      if (sales30j > 0) {
        const stockMoyen = (stockActuel + (stockActuel + sales30j)) / 2;
        if (stockMoyen > 0) {
          rotationRate = sales30j / stockMoyen;
        }
      }

      rotationData.push([rotationRate]);
    });

    if (S_COLS.TAUX_ROTATION) {
      stockSheet.getRange(2, S_COLS.TAUX_ROTATION, rotationData.length, 1).setValues(rotationData);
    }

    Logger4.info(`✅ Enrichissement terminé: ${stockData.length} articles.`);

  }, 'stock_runDailyEnrichment', { showUI: false })();
}

// ============================================================================
// 16. HELPERS & UTILITIES
// ============================================================================

function _stock_findRowById(id, sheet, colNum = 1) {
  if (!id || !sheet) return -1;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const data = sheet.getRange(2, colNum, lastRow - 1, 1).getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === id) {
      return i + 2;
    }
  }

  return -1;
}

function _stock_validateArticleData(data) {
  const errors = [];

  if (!data.article || data.article.trim() === '') {
    errors.push('Le nom de l\'article est obligatoire');
  }

  if (!data.categorie) {
    errors.push('La catégorie est obligatoire');
  }

  if (!data.unite) {
    errors.push('L\'unité est obligatoire');
  }

  if (data.stockMini && isNaN(parseFloat(data.stockMini))) {
    errors.push('Le stock minimum doit être un nombre');
  }

  if (data.prixUnitaire && isNaN(parseFloat(data.prixUnitaire))) {
    errors.push('Le prix unitaire doit être un nombre');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function stock_clearCache() {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('admin')) throw new Error('Accès refusé.');

    CacheService.invalidate('stock_');
    CacheService.invalidate('suppliers_');

    Logger4.info('Cache Stock vidé');
    return { success: true, message: 'Cache vidé avec succès' };

  }, 'stock_clearCache', { showUI: false })();
}

function stock_exportToJSON() {
  return ErrorHandler.wrap(function() {
    if (!PermissionManager.isAtLeast('user')) throw new Error('Accès refusé.');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) return { success: true, data: [] };

    const data = sheet.getRange(2, 1, lastRow - 1, S_CONF.headers.length).getValues();

    const jsonData = data.map(row => {
      const obj = {};
      Object.keys(S_COLS).forEach(key => {
        obj[key.toLowerCase()] = row[S_COLS[key] - 1];
      });
      return obj;
    });

    return { success: true, data: jsonData, count: jsonData.length };

  }, 'stock_exportToJSON', { showUI: false })();
}

// ============================================================================
// FIN DU MODULE STOCK V12.6.5 - BUG UI CORRIGÉ
// ============================================================================
