/**
 * MODULE CORE - Coordination Générale du Système de Gestion Topographique
 * Gestion complète d'un service topographique pour aménagement de périmètres agricoles
 * Version: Production Ready 1.0
 */

// ==================== CONFIGURATION GLOBALE ====================

const CONFIG = {
  APP_NAME: "TopoGest Pro - Cameroun",
  VERSION: "1.0.0",
  LOCALE: "fr_FR",
  TIMEZONE: "Africa/Douala",

  // Couleurs du thème (style GAFAM moderne)
  COLORS: {
    PRIMARY: "#1a73e8",
    SECONDARY: "#34a853",
    WARNING: "#fbbc04",
    DANGER: "#ea4335",
    SUCCESS: "#34a853",
    INFO: "#4285f4",
    DARK: "#202124",
    LIGHT: "#f8f9fa",
    HEADER_BG: "#1a73e8",
    HEADER_TEXT: "#ffffff",
    ROW_ALT: "#f8f9fa"
  },

  // Modules actifs
  MODULES: [
    "PROJET", "OUVRAGE", "TACHE", "RELEVE", "EQUIPE",
    "EMPLOYE", "MATERIEL", "POSTE", "UTILISATEUR",
    "JOURNAL_ACTIONS", "NOTIFICATION", "DOCUMENT",
    "PLANNING", "BUDGET", "FACTURE", "CONTROLEUR"
  ],

  // Configuration des feuilles
  SHEETS: {
    DASHBOARD: "📊 Tableau de Bord",
    PROJET: "📁 Projets",
    OUVRAGE: "🏗️ Ouvrages",
    TACHE: "✅ Tâches",
    RELEVE: "📐 Relevés",
    EQUIPE: "👥 Équipes",
    EMPLOYE: "👤 Employés",
    MATERIEL: "🔧 Matériel",
    POSTE: "💼 Postes",
    UTILISATEUR: "🔐 Utilisateurs",
    JOURNAL: "📝 Journal",
    NOTIFICATION: "🔔 Notifications",
    DOCUMENT: "📄 Documents",
    PLANNING: "📅 Planning",
    BUDGET: "💰 Budget",
    FACTURE: "🧾 Factures",
    CONTROLEUR: "✓ Contrôleurs",
    CONFIG: "⚙️ Configuration"
  }
};

// ==================== INITIALISATION DU SYSTÈME ====================

/**
 * Initialise le système complet
 */
function initialiserSysteme() {
  try {
    Logger.log("🚀 Initialisation du système TopoGest Pro...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Créer le Dashboard principal
    creerTableauDeBord();

    // Initialiser tous les modules
    CONFIG.MODULES.forEach(module => {
      Logger.log(`📦 Initialisation du module ${module}...`);
      const functionName = `initialiser${module.charAt(0) + module.slice(1).toLowerCase().replace(/_./g, match => match.charAt(1).toUpperCase())}`;

      if (typeof this[functionName] === 'function') {
        this[functionName]();
      }
    });

    // Créer la feuille de configuration
    creerFeuilleConfiguration();

    // Journaliser l'action
    journaliserAction("SYSTEME", "Initialisation complète du système");

    SpreadsheetApp.getUi().alert(
      "✅ Système initialisé avec succès!\n\n" +
      "TopoGest Pro est maintenant prêt à l'emploi.\n" +
      "Consultez le Tableau de Bord pour commencer."
    );

    Logger.log("✅ Système initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation: " + error);
    SpreadsheetApp.getUi().alert("❌ Erreur: " + error.message);
  }
}

/**
 * Crée le Tableau de Bord principal avec KPIs et analyses
 */
function creerTableauDeBord() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);

  if (sheet) {
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet(CONFIG.SHEETS.DASHBOARD, 0);

  // Configuration de la feuille
  sheet.setFrozenRows(3);
  sheet.setFrozenColumns(1);

  // ===== EN-TÊTE PRINCIPAL =====
  sheet.getRange("A1:P1").merge()
    .setValue(CONFIG.APP_NAME)
    .setFontSize(24)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT);

  sheet.setRowHeight(1, 50);

  // ===== SOUS-EN-TÊTE =====
  sheet.getRange("A2:P2").merge()
    .setValue("Système de Gestion Topographique - Aménagement des Périmètres Agricoles en Réseau Gravitaire")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setBackground(CONFIG.COLORS.DARK)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontStyle("italic");

  sheet.setRowHeight(2, 30);

  // ===== LIGNE D'INFORMATION =====
  const dateFormule = '=TEXTE(MAINTENANT();"jjjj jj mmmm aaaa à HH:mm")';
  sheet.getRange("A3").setValue("📅 Date:");
  sheet.getRange("B3:D3").merge().setFormula(dateFormule);

  sheet.getRange("E3").setValue("👤 Utilisateur:");
  sheet.getRange("F3:H3").merge().setFormula('=SI(NBVAL(Utilisateurs!B:B)>1;INDEX(Utilisateurs!B:B;2);"Admin")');

  sheet.getRange("I3").setValue("📊 Version:");
  sheet.getRange("J3:K3").merge().setValue(CONFIG.VERSION);

  sheet.getRange("L3").setValue("🌍 Localisation:");
  sheet.getRange("M3:P3").merge().setValue("Cameroun");

  sheet.getRange("A3:P3")
    .setBackground(CONFIG.COLORS.LIGHT)
    .setFontWeight("bold")
    .setFontSize(10);

  sheet.setRowHeight(3, 25);

  // ===== SECTION KPIs PRINCIPAUX =====
  sheet.getRange("A5:P5").merge()
    .setValue("📊 INDICATEURS CLÉS DE PERFORMANCE (KPIs)")
    .setFontSize(14)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.SECONDARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setHorizontalAlignment("center");

  sheet.setRowHeight(5, 35);

  // KPIs - Ligne 6
  const kpis = [
    {col: "A", label: "Projets Actifs", formula: '=NBSI(Projets!H:H;"En cours")', color: CONFIG.COLORS.PRIMARY},
    {col: "C", label: "Ouvrages Totaux", formula: '=NBVAL(Ouvrages!A:A)-1', color: CONFIG.COLORS.INFO},
    {col: "E", label: "Tâches en Cours", formula: '=NBSI(Tâches!I:I;"En cours")', color: CONFIG.COLORS.WARNING},
    {col: "G", label: "Relevés du Mois", formula: '=SOMME.SI(Relevés!D:D;">="&AUJOURDHUI()-30;Relevés!A:A)', color: CONFIG.COLORS.SUCCESS}
  ];

  let currentCol = 0;
  kpis.forEach(kpi => {
    const startCol = String.fromCharCode(65 + currentCol);
    const endCol = String.fromCharCode(65 + currentCol + 1);

    sheet.getRange(`${startCol}6:${endCol}6`).merge()
      .setValue(kpi.label)
      .setBackground(kpi.color)
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    sheet.getRange(`${startCol}7:${endCol}7`).merge()
      .setFormula(kpi.formula)
      .setFontSize(24)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f8f9fa")
      .setNumberFormat("0");

    currentCol += 2;
  });

  sheet.setRowHeight(6, 25);
  sheet.setRowHeight(7, 50);

  // KPIs Financiers - Ligne 8-9
  const kpisFinanciers = [
    {col: "A", label: "Budget Total", formula: '=SOMME(Budget!C:C)', color: CONFIG.COLORS.PRIMARY, format: '#,##0" FCFA"'},
    {col: "C", label: "Budget Utilisé", formula: '=SOMME(Budget!D:D)', color: CONFIG.COLORS.WARNING, format: '#,##0" FCFA"'},
    {col: "E", label: "Factures Émises", formula: '=SOMME(Factures!D:D)', color: CONFIG.COLORS.SUCCESS, format: '#,##0" FCFA"'},
    {col: "G", label: "Taux d\'Utilisation", formula: '=SI(SOMME(Budget!C:C)>0;SOMME(Budget!D:D)/SOMME(Budget!C:C);0)', color: CONFIG.COLORS.INFO, format: "0.0%"}
  ];

  currentCol = 0;
  kpisFinanciers.forEach(kpi => {
    const startCol = String.fromCharCode(65 + currentCol);
    const endCol = String.fromCharCode(65 + currentCol + 1);

    sheet.getRange(`${startCol}9:${endCol}9`).merge()
      .setValue(kpi.label)
      .setBackground(kpi.color)
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    sheet.getRange(`${startCol}10:${endCol}10`).merge()
      .setFormula(kpi.formula)
      .setFontSize(20)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f8f9fa")
      .setNumberFormat(kpi.format);

    currentCol += 2;
  });

  sheet.setRowHeight(9, 25);
  sheet.setRowHeight(10, 45);

  // ===== SECTION RESSOURCES HUMAINES =====
  sheet.getRange("A12:H12").merge()
    .setValue("👥 RESSOURCES HUMAINES")
    .setFontSize(14)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.SECONDARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setHorizontalAlignment("center");

  sheet.setRowHeight(12, 35);

  const kpisRH = [
    {col: "A", label: "Total Employés", formula: '=NBVAL(Employés!A:A)-1'},
    {col: "C", label: "Équipes Actives", formula: '=NBVAL(Équipes!A:A)-1'},
    {col: "E", label: "Matériel Disponible", formula: '=NBSI(Matériel!G:G;"Disponible")'},
    {col: "G", label: "Contrôleurs", formula: '=NBVAL(Contrôleurs!A:A)-1'}
  ];

  currentCol = 0;
  kpisRH.forEach(kpi => {
    const startCol = String.fromCharCode(65 + currentCol);
    const endCol = String.fromCharCode(65 + currentCol + 1);

    sheet.getRange(`${startCol}13:${endCol}13`).merge()
      .setValue(kpi.label)
      .setBackground(CONFIG.COLORS.INFO)
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    sheet.getRange(`${startCol}14:${endCol}14`).merge()
      .setFormula(kpi.formula)
      .setFontSize(18)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f8f9fa")
      .setNumberFormat("0");

    currentCol += 2;
  });

  sheet.setRowHeight(13, 25);
  sheet.setRowHeight(14, 40);

  // ===== SECTION ANALYSES AVANCÉES =====
  sheet.getRange("A16:P16").merge()
    .setValue("📈 ANALYSES ET STATISTIQUES")
    .setFontSize(14)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.SECONDARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setHorizontalAlignment("center");

  sheet.setRowHeight(16, 35);

  // Tableau des projets par statut
  sheet.getRange("A17").setValue("PROJETS PAR STATUT");
  sheet.getRange("A17:D17").merge()
    .setBackground(CONFIG.COLORS.DARK)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  const statutsProjets = ["En cours", "En attente", "Terminé", "Suspendu"];
  sheet.getRange("A18").setValue("Statut");
  sheet.getRange("B18").setValue("Nombre");
  sheet.getRange("C18").setValue("Budget Total");
  sheet.getRange("D18").setValue("Progression");

  sheet.getRange("A18:D18")
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  let row = 19;
  statutsProjets.forEach((statut, index) => {
    sheet.getRange(`A${row}`).setValue(statut);
    sheet.getRange(`B${row}`).setFormula(`=NBSI(Projets!H:H;"${statut}")`);
    sheet.getRange(`C${row}`).setFormula(`=SOMME.SI(Projets!H:H;"${statut}";Projets!I:I)`)
      .setNumberFormat('#,##0" FCFA"');
    sheet.getRange(`D${row}`).setFormula(`=SI(NBVAL(Projets!A:A)>1;B${row}/(NBVAL(Projets!A:A)-1);0)`)
      .setNumberFormat("0.0%");

    // Couleur alternée
    if (index % 2 === 0) {
      sheet.getRange(`A${row}:D${row}`).setBackground(CONFIG.COLORS.ROW_ALT);
    }
    row++;
  });

  // Tableau des tâches par priorité
  sheet.getRange("F17").setValue("TÂCHES PAR PRIORITÉ");
  sheet.getRange("F17:I17").merge()
    .setBackground(CONFIG.COLORS.DARK)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheet.getRange("F18").setValue("Priorité");
  sheet.getRange("G18").setValue("Nombre");
  sheet.getRange("H18").setValue("En cours");
  sheet.getRange("I18").setValue("Terminées");

  sheet.getRange("F18:I18")
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  const priorites = ["Haute", "Moyenne", "Basse"];
  row = 19;
  priorites.forEach((priorite, index) => {
    sheet.getRange(`F${row}`).setValue(priorite);
    sheet.getRange(`G${row}`).setFormula(`=NBSI(Tâches!J:J;"${priorite}")`);
    sheet.getRange(`H${row}`).setFormula(`=NB.SI.ENS(Tâches!J:J;"${priorite}";Tâches!I:I;"En cours")`);
    sheet.getRange(`I${row}`).setFormula(`=NB.SI.ENS(Tâches!J:J;"${priorite}";Tâches!I:I;"Terminé")`);

    if (index % 2 === 0) {
      sheet.getRange(`F${row}:I${row}`).setBackground(CONFIG.COLORS.ROW_ALT);
    }
    row++;
  });

  // ===== NOTIFICATIONS ET ALERTES =====
  sheet.getRange("A24:P24").merge()
    .setValue("🔔 NOTIFICATIONS ET ALERTES")
    .setFontSize(14)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.WARNING)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setHorizontalAlignment("center");

  sheet.setRowHeight(24, 35);

  // Alertes importantes
  const alertes = [
    {label: "⚠️ Tâches en retard", formule: '=NB.SI.ENS(Tâches!H:H;"<"&AUJOURDHUI();Tâches!I:I;"En cours")'},
    {label: "🔧 Matériel en maintenance", formule: '=NBSI(Matériel!G:G;"Maintenance")'},
    {label: "📄 Documents en attente", formule: '=NBSI(Documents!G:G;"En attente")'},
    {label: "💰 Factures impayées", formule: '=NBSI(Factures!E:E;"Impayé")'}
  ];

  sheet.getRange("A25:D25")
    .merge()
    .setValue("Type d'Alerte")
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  sheet.getRange("E25:F25")
    .merge()
    .setValue("Nombre")
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  row = 26;
  alertes.forEach((alerte, index) => {
    sheet.getRange(`A${row}:D${row}`).merge().setValue(alerte.label);
    sheet.getRange(`E${row}:F${row}`).merge()
      .setFormula(alerte.formule)
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");

    // Mise en forme conditionnelle (rouge si > 0)
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0)
      .setBackground(CONFIG.COLORS.DANGER)
      .setFontColor("#ffffff")
      .setRanges([sheet.getRange(`E${row}:F${row}`)])
      .build();

    const rules = sheet.getConditionalFormatRules();
    rules.push(rule);
    sheet.setConditionalFormatRules(rules);

    if (index % 2 === 0) {
      sheet.getRange(`A${row}:F${row}`).setBackground(CONFIG.COLORS.ROW_ALT);
    }
    row++;
  });

  // ===== ACCÈS RAPIDE AUX MODULES =====
  sheet.getRange("A31:P31").merge()
    .setValue("🚀 ACCÈS RAPIDE AUX MODULES")
    .setFontSize(14)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.SECONDARY)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setHorizontalAlignment("center");

  sheet.setRowHeight(31, 35);

  const modulesAccesRapide = [
    ["📁 Projets", "🏗️ Ouvrages", "✅ Tâches", "📐 Relevés"],
    ["👥 Équipes", "👤 Employés", "🔧 Matériel", "💼 Postes"],
    ["📄 Documents", "📅 Planning", "💰 Budget", "🧾 Factures"]
  ];

  row = 32;
  modulesAccesRapide.forEach((ligne, indexLigne) => {
    let col = 0;
    ligne.forEach((module, indexCol) => {
      const startCol = String.fromCharCode(65 + col);
      const endCol = String.fromCharCode(65 + col + 3);

      sheet.getRange(`${startCol}${row}:${endCol}${row}`).merge()
        .setValue(module)
        .setBackground(CONFIG.COLORS.PRIMARY)
        .setFontColor("#ffffff")
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setFontSize(12);

      sheet.setRowHeight(row, 40);
      col += 4;
    });
    row++;
  });

  // Ajuster les largeurs de colonnes
  for (let i = 1; i <= 16; i++) {
    sheet.setColumnWidth(i, 120);
  }

  // Protection de la feuille (sauf zones de saisie)
  const protection = sheet.protect().setDescription("Tableau de bord protégé");
  protection.setWarningOnly(true);

  Logger.log("✅ Tableau de bord créé avec succès");
}

/**
 * Crée la feuille de configuration
 */
function creerFeuilleConfiguration() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEETS.CONFIG);

  if (sheet) {
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet(CONFIG.SHEETS.CONFIG);

  // En-tête
  sheet.getRange("A1:D1").merge()
    .setValue("⚙️ CONFIGURATION DU SYSTÈME")
    .setFontSize(16)
    .setFontWeight("bold")
    .setBackground(CONFIG.COLORS.PRIMARY)
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");

  sheet.setRowHeight(1, 40);

  // Paramètres généraux
  const parametres = [
    ["PARAMÈTRE", "VALEUR", "DESCRIPTION", "TYPE"],
    ["Nom de l'application", CONFIG.APP_NAME, "Nom complet de l'application", "Texte"],
    ["Version", CONFIG.VERSION, "Version actuelle", "Texte"],
    ["Fuseau horaire", CONFIG.TIMEZONE, "Fuseau horaire du système", "Texte"],
    ["Locale", CONFIG.LOCALE, "Configuration régionale", "Texte"],
    ["Devise", "FCFA", "Devise utilisée", "Texte"],
    ["Format de date", "jj/mm/aaaa", "Format d'affichage des dates", "Texte"],
    ["Email admin", "admin@topogést.cm", "Email de l'administrateur", "Email"],
    ["Téléphone support", "+237 6XX XXX XXX", "Téléphone du support", "Téléphone"],
    ["Durée session (min)", "60", "Durée de session en minutes", "Nombre"],
    ["Sauvegarde auto", "OUI", "Sauvegarde automatique activée", "Booléen"],
    ["Notifications email", "OUI", "Notifications par email", "Booléen"],
    ["Mode debug", "NON", "Mode débogage", "Booléen"]
  ];

  sheet.getRange(3, 1, parametres.length, 4).setValues(parametres);

  // Mise en forme de l'en-tête du tableau
  sheet.getRange("A3:D3")
    .setBackground(CONFIG.COLORS.DARK)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  // Bordures
  sheet.getRange(3, 1, parametres.length, 4).setBorder(
    true, true, true, true, true, true,
    "#000000", SpreadsheetApp.BorderStyle.SOLID
  );

  // Largeurs de colonnes
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 300);
  sheet.setColumnWidth(4, 100);

  // Alternance de couleurs
  for (let i = 4; i < 3 + parametres.length; i++) {
    if ((i - 3) % 2 === 0) {
      sheet.getRange(`A${i}:D${i}`).setBackground(CONFIG.COLORS.ROW_ALT);
    }
  }

  Logger.log("✅ Feuille de configuration créée");
}

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Journalise une action utilisateur
 */
function journaliserAction(type, description) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.JOURNAL);

    if (!sheet) return;

    const user = Session.getActiveUser().getEmail() || "Système";
    const timestamp = new Date();

    sheet.appendRow([
      "",  // ID auto-incrémenté
      user,
      timestamp,
      type,
      description
    ]);

  } catch (error) {
    Logger.log("Erreur journalisation: " + error);
  }
}

/**
 * Envoie une notification
 */
function envoyerNotification(utilisateurId, message, priorite = "NORMALE") {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEETS.NOTIFICATION);

    if (!sheet) return;

    sheet.appendRow([
      "",  // ID auto-incrémenté
      utilisateurId,
      message,
      new Date(),
      "NON",  // Lu
      priorite
    ]);

  } catch (error) {
    Logger.log("Erreur notification: " + error);
  }
}

/**
 * Formate une cellule en style GAFAM
 */
function formaterCelluleGAFAM(range, type = "header") {
  const styles = {
    header: {
      background: CONFIG.COLORS.PRIMARY,
      fontColor: "#ffffff",
      fontWeight: "bold",
      fontSize: 11,
      align: "center"
    },
    subheader: {
      background: CONFIG.COLORS.DARK,
      fontColor: "#ffffff",
      fontWeight: "bold",
      fontSize: 10,
      align: "center"
    },
    data: {
      background: "#ffffff",
      fontColor: "#000000",
      fontWeight: "normal",
      fontSize: 10,
      align: "left"
    },
    highlight: {
      background: CONFIG.COLORS.WARNING,
      fontColor: "#000000",
      fontWeight: "bold",
      fontSize: 10,
      align: "center"
    }
  };

  const style = styles[type] || styles.data;

  range.setBackground(style.background)
    .setFontColor(style.fontColor)
    .setFontWeight(style.fontWeight)
    .setFontSize(style.fontSize)
    .setHorizontalAlignment(style.align);

  return range;
}

/**
 * Applique une mise en forme conditionnelle avancée
 */
function appliquerMiseEnFormeConditionnelle(sheet, range, type, valeurReference = null) {
  const rules = sheet.getConditionalFormatRules();

  switch(type) {
    case "statut":
      // Vert pour "Terminé"
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("Terminé")
        .setBackground(CONFIG.COLORS.SUCCESS)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());

      // Orange pour "En cours"
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("En cours")
        .setBackground(CONFIG.COLORS.WARNING)
        .setFontColor("#000000")
        .setRanges([range])
        .build());

      // Rouge pour "En retard"
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("En retard")
        .setBackground(CONFIG.COLORS.DANGER)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());
      break;

    case "priorite":
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("Haute")
        .setBackground(CONFIG.COLORS.DANGER)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());

      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("Moyenne")
        .setBackground(CONFIG.COLORS.WARNING)
        .setRanges([range])
        .build());

      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("Basse")
        .setBackground(CONFIG.COLORS.SUCCESS)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());
      break;

    case "progression":
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenNumberGreaterThanOrEqualTo(0.75)
        .setBackground(CONFIG.COLORS.SUCCESS)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());

      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenNumberBetween(0.25, 0.74)
        .setBackground(CONFIG.COLORS.WARNING)
        .setRanges([range])
        .build());

      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenNumberLessThan(0.25)
        .setBackground(CONFIG.COLORS.DANGER)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());
      break;

    case "date_echeance":
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenDateBefore(SpreadsheetApp.RelativeDate.TODAY)
        .setBackground(CONFIG.COLORS.DANGER)
        .setFontColor("#ffffff")
        .setRanges([range])
        .build());

      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .whenDateBefore(SpreadsheetApp.RelativeDate.TOMORROW)
        .setBackground(CONFIG.COLORS.WARNING)
        .setRanges([range])
        .build());
      break;
  }

  sheet.setConditionalFormatRules(rules);
}

/**
 * Crée un graphique moderne
 */
function creerGraphiqueModerne(sheet, type, titre, plageData, position = {row: 1, col: 1}) {
  const chartBuilder = sheet.newChart();

  chartBuilder
    .setChartType(type)
    .addRange(plageData)
    .setPosition(position.row, position.col, 0, 0)
    .setOption('title', titre)
    .setOption('colors', [
      CONFIG.COLORS.PRIMARY,
      CONFIG.COLORS.SECONDARY,
      CONFIG.COLORS.WARNING,
      CONFIG.COLORS.DANGER,
      CONFIG.COLORS.INFO
    ])
    .setOption('legend', {position: 'bottom', textStyle: {fontSize: 10}})
    .setOption('chartArea', {width: '80%', height: '70%'})
    .setOption('titleTextStyle', {fontSize: 14, bold: true})
    .setOption('animation', {
      startup: true,
      duration: 1000,
      easing: 'inAndOut'
    });

  sheet.insertChart(chartBuilder.build());
}

/**
 * Valide les données selon le type
 */
function validerDonnees(sheet, range, type, valeurs = null) {
  let rule;

  switch(type) {
    case "email":
      rule = SpreadsheetApp.newDataValidation()
        .requireTextIsEmail()
        .setAllowInvalid(false)
        .setHelpText("Veuillez entrer une adresse email valide")
        .build();
      break;

    case "telephone":
      rule = SpreadsheetApp.newDataValidation()
        .requireTextMatchesPattern("^\\+?237[0-9]{9}$")
        .setAllowInvalid(false)
        .setHelpText("Format: +237XXXXXXXXX")
        .build();
      break;

    case "liste":
      rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(valeurs, true)
        .setAllowInvalid(false)
        .build();
      break;

    case "date":
      rule = SpreadsheetApp.newDataValidation()
        .requireDate()
        .setAllowInvalid(false)
        .setHelpText("Veuillez entrer une date valide")
        .build();
      break;

    case "nombre":
      rule = SpreadsheetApp.newDataValidation()
        .requireNumberGreaterThan(0)
        .setAllowInvalid(false)
        .setHelpText("Veuillez entrer un nombre positif")
        .build();
      break;

    case "montant":
      rule = SpreadsheetApp.newDataValidation()
        .requireNumberGreaterThanOrEqualTo(0)
        .setAllowInvalid(false)
        .setHelpText("Veuillez entrer un montant valide")
        .build();
      break;
  }

  if (rule) {
    range.setDataValidation(rule);
  }
}

/**
 * Génère un ID unique
 */
function genererID(prefixe = "") {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${prefixe}${timestamp}${random}`;
}

/**
 * Affiche le menu principal
 */
function afficherMenuPrincipal() {
  const html = HtmlService.createHtmlOutputFromFile('modules/core/CoreSidebar')
    .setTitle('TopoGest Pro - Menu')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal principal
 */
function afficherModalPrincipal() {
  const html = HtmlService.createHtmlOutputFromFile('modules/core/CoreModal')
    .setWidth(800)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'TopoGest Pro - Gestionnaire');
}

/**
 * Exporte les données en CSV
 */
function exporterEnCSV(nomFeuille) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(nomFeuille);

  if (!sheet) {
    throw new Error("Feuille non trouvée: " + nomFeuille);
  }

  const data = sheet.getDataRange().getValues();
  let csv = "";

  data.forEach(row => {
    csv += row.join(";") + "\n";
  });

  return csv;
}

/**
 * Sauvegarde automatique (backup)
 */
function sauvegardeAutomatique() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd_HHmmss");
    const backupName = `${CONFIG.APP_NAME} - Backup ${timestamp}`;

    const backup = DriveApp.getFileById(ss.getId()).makeCopy(backupName);

    // Déplacer dans un dossier Backups
    const folders = DriveApp.getFoldersByName("TopoGest Backups");
    let backupFolder;

    if (folders.hasNext()) {
      backupFolder = folders.next();
    } else {
      backupFolder = DriveApp.createFolder("TopoGest Backups");
    }

    backup.moveTo(backupFolder);

    journaliserAction("BACKUP", `Sauvegarde automatique créée: ${backupName}`);

    return {success: true, message: "Sauvegarde créée avec succès"};

  } catch (error) {
    Logger.log("Erreur backup: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Nettoie les données anciennes
 */
function nettoyerDonneesAnciennes(joursConservation = 365) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - joursConservation);

    // Nettoyer le journal d'actions
    const journalSheet = ss.getSheetByName(CONFIG.SHEETS.JOURNAL);
    if (journalSheet) {
      const data = journalSheet.getDataRange().getValues();
      let nbSupprime = 0;

      for (let i = data.length - 1; i > 0; i--) {
        const dateAction = new Date(data[i][2]);
        if (dateAction < dateLimit) {
          journalSheet.deleteRow(i + 1);
          nbSupprime++;
        }
      }

      journaliserAction("MAINTENANCE", `Nettoyage: ${nbSupprime} entrées supprimées du journal`);
    }

    return {success: true, message: `Nettoyage effectué avec succès`};

  } catch (error) {
    Logger.log("Erreur nettoyage: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Vérifie l'intégrité des données
 */
function verifierIntegriteDonnees() {
  const rapports = [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Vérifier chaque module
  CONFIG.MODULES.forEach(module => {
    const sheetName = CONFIG.SHEETS[module];
    const sheet = ss.getSheetByName(sheetName);

    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const nbLignes = data.length - 1; // Moins l'en-tête

      rapports.push({
        module: module,
        feuille: sheetName,
        lignes: nbLignes,
        statut: "OK"
      });
    } else {
      rapports.push({
        module: module,
        feuille: sheetName,
        lignes: 0,
        statut: "MANQUANT"
      });
    }
  });

  return rapports;
}

// ==================== TRIGGERS ET ÉVÉNEMENTS ====================

/**
 * Fonction appelée à l'ouverture du classeur
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🏗️ TopoGest Pro')
    .addItem('📊 Tableau de Bord', 'naviguerVersTableauDeBord')
    .addSeparator()
    .addSubMenu(ui.createMenu('📁 Gestion')
      .addItem('Projets', 'naviguerVersProjets')
      .addItem('Ouvrages', 'naviguerVersOuvrages')
      .addItem('Tâches', 'naviguerVersTaches')
      .addItem('Relevés', 'naviguerVersReleves'))
    .addSubMenu(ui.createMenu('👥 Ressources')
      .addItem('Équipes', 'naviguerVersEquipes')
      .addItem('Employés', 'naviguerVersEmployes')
      .addItem('Matériel', 'naviguerVersMateriel')
      .addItem('Postes', 'naviguerVersPostes'))
    .addSubMenu(ui.createMenu('💰 Finance')
      .addItem('Budget', 'naviguerVersBudget')
      .addItem('Factures', 'naviguerVersFactures'))
    .addSubMenu(ui.createMenu('📄 Documents & Planning')
      .addItem('Documents', 'naviguerVersDocuments')
      .addItem('Planning', 'naviguerVersPlanning')
      .addItem('Contrôleurs', 'naviguerVersControleurs'))
    .addSeparator()
    .addItem('🔐 Utilisateurs', 'naviguerVersUtilisateurs')
    .addItem('🔔 Notifications', 'naviguerVersNotifications')
    .addItem('📝 Journal', 'naviguerVersJournal')
    .addSeparator()
    .addItem('⚙️ Configuration', 'naviguerVersConfiguration')
    .addSeparator()
    .addItem('📱 Menu Principal', 'afficherMenuPrincipal')
    .addItem('🎛️ Gestionnaire', 'afficherModalPrincipal')
    .addSeparator()
    .addSubMenu(ui.createMenu('🛠️ Outils')
      .addItem('💾 Sauvegarde', 'sauvegardeAutomatique')
      .addItem('🔍 Vérifier Intégrité', 'afficherRapportIntegrite')
      .addItem('🗑️ Nettoyer Données', 'nettoyerDonneesAnciennes')
      .addItem('🔄 Réinitialiser Système', 'initialiserSysteme'))
    .addToUi();

  // Afficher un message de bienvenue
  const user = Session.getActiveUser().getEmail();
  journaliserAction("CONNEXION", `Connexion de ${user}`);
}

/**
 * Fonctions de navigation
 */
function naviguerVersTableauDeBord() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.DASHBOARD).activate();
}

function naviguerVersProjets() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PROJET).activate();
}

function naviguerVersOuvrages() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.OUVRAGE).activate();
}

function naviguerVersTaches() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.TACHE).activate();
}

function naviguerVersReleves() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.RELEVE).activate();
}

function naviguerVersEquipes() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.EQUIPE).activate();
}

function naviguerVersEmployes() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.EMPLOYE).activate();
}

function naviguerVersMateriel() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.MATERIEL).activate();
}

function naviguerVersPostes() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.POSTE).activate();
}

function naviguerVersUtilisateurs() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.UTILISATEUR).activate();
}

function naviguerVersJournal() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.JOURNAL).activate();
}

function naviguerVersNotifications() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.NOTIFICATION).activate();
}

function naviguerVersDocuments() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.DOCUMENT).activate();
}

function naviguerVersPlanning() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.PLANNING).activate();
}

function naviguerVersBudget() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.BUDGET).activate();
}

function naviguerVersFactures() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.FACTURE).activate();
}

function naviguerVersControleurs() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.CONTROLEUR).activate();
}

function naviguerVersConfiguration() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.CONFIG).activate();
}

/**
 * Affiche le rapport d'intégrité
 */
function afficherRapportIntegrite() {
  const rapport = verifierIntegriteDonnees();
  let message = "📊 RAPPORT D'INTÉGRITÉ DES DONNÉES\n\n";

  rapport.forEach(item => {
    message += `${item.module}: ${item.lignes} lignes - ${item.statut}\n`;
  });

  SpreadsheetApp.getUi().alert(message);
}
