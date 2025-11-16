/**
 * ============================================================================
 * MODULE MATERIEL v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion avancée du matériel et équipements avec maintenance
 *              préventive/curative, suivi des pannes, alertes et KPIs
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD complet matériel/équipements
 * ✅ Suivi maintenance préventive et curative
 * ✅ Historique pannes et réparations
 * ✅ Calcul coût utilisation et amortissement
 * ✅ Planning de disponibilité
 * ✅ Alertes maintenance basées date/heures utilisation
 * ✅ Export rapports maintenance
 * ✅ KPIs: Total, Disponible, En panne, Coût maintenance
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION MODULE MATERIEL
// ============================================================================

const CONFIG_MATERIEL = {
  VERSION: '2.0.0',
  MODULE_NAME: 'MATERIEL',
  SHEET_NAME: '🔧 Matériel',

  // Alertes maintenance (en heures)
  SEUIL_ALERTE_HEURES: 500,
  SEUIL_CRITIQUE_HEURES: 1000,

  // Alertes date (en jours)
  SEUIL_ALERTE_JOURS: 30,
  SEUIL_CRITIQUE_JOURS: 7,

  // Types de matériel
  TYPES: [
    'GPS RTK',
    'Station totale',
    'Niveau optique',
    'Niveau laser',
    'Théodolite',
    'Drone topographique',
    'Scanner 3D',
    'Engin TP',
    'Véhicule',
    'Ordinateur',
    'Logiciel',
    'Autre'
  ],

  // États
  ETATS: [
    'Neuf',
    'Bon',
    'Moyen',
    'Dégradé',
    'Hors service'
  ],

  // Statuts disponibilité
  STATUTS_DISPO: [
    'Disponible',
    'En utilisation',
    'En maintenance',
    'En panne',
    'Hors service',
    'En réparation'
  ],

  // Types de maintenance
  TYPES_MAINTENANCE: [
    'Préventive',
    'Curative',
    'Corrective',
    'Améliorative',
    'Étalonnage'
  ]
};

// ============================================================================
// INITIALISATION MODULE MATERIEL v2.0
// ============================================================================

/**
 * Initialise le module MATERIEL v2.0 avec structure complète
 */
function initialiserMateriel() {
  try {
    Logger.log("🔧 Initialisation du module MATERIEL v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    // Supprimer la feuille si elle existe
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer nouvelle feuille
    sheet = ss.insertSheet(CONFIG_MATERIEL.SHEET_NAME);

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:T1").merge()
      .setValue("🔧 GESTION MATÉRIEL v2.0 - MAINTENANCE • ALERTES • COÛTS • PLANNING")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "MaterielID",
      "Nom",
      "Type",
      "Marque",
      "Modèle",
      "Numéro de Série",
      "Date Acquisition",
      "Valeur Achat (FCFA)",
      "État",
      "Statut Disponibilité",
      "Heures Utilisation",
      "Dernière Maintenance",
      "Prochaine Maintenance",
      "Coût Maintenance (FCFA)",
      "Nombre Pannes",
      "Temps Arrêt (jours)",
      "Projet Affecté",
      "Responsable",
      "Localisation",
      "Observations"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [
      100,  // MaterielID
      200,  // Nom
      150,  // Type
      120,  // Marque
      150,  // Modèle
      150,  // NumSerie
      120,  // Date Acquisition
      150,  // Valeur Achat
      100,  // État
      140,  // Statut Dispo
      130,  // Heures Utilisation
      140,  // Dernière Maintenance
      140,  // Prochaine Maintenance
      150,  // Coût Maintenance
      120,  // Nombre Pannes
      140,  // Temps Arrêt
      180,  // Projet Affecté
      180,  // Responsable
      180,  // Localisation
      300   // Observations
    ];

    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "MAT001",
        "GPS RTK Trimble R12",
        "GPS RTK",
        "Trimble",
        "R12 GNSS",
        "TR12-2024-001",
        new Date(2023, 0, 15),
        25000000,
        "Bon",
        "En utilisation",
        1250,
        new Date(2024, 10, 1),
        new Date(2025, 1, 1),
        1500000,
        2,
        5,
        "PROJ001",
        "Mbarga Jean",
        "Dépôt Yaoundé",
        "Maintenance régulière - Batterie changée en Oct 2024"
      ],
      [
        "MAT002",
        "Station Totale Leica TS16",
        "Station totale",
        "Leica",
        "TS16 I 1\"",
        "LC-TS16-2023-045",
        new Date(2022, 5, 10),
        32000000,
        "Bon",
        "Disponible",
        2100,
        new Date(2024, 9, 15),
        new Date(2024, 11, 15),
        2200000,
        1,
        2,
        "",
        "Nkolo Marie",
        "Bureau Douala",
        "Étalonnage annuel effectué"
      ],
      [
        "MAT003",
        "Drone DJI Phantom 4 RTK",
        "Drone topographique",
        "DJI",
        "Phantom 4 RTK",
        "DJI-P4R-2024-089",
        new Date(2024, 2, 20),
        18000000,
        "Neuf",
        "Disponible",
        85,
        new Date(2024, 10, 10),
        new Date(2025, 4, 10),
        200000,
        0,
        0,
        "",
        "Tchokothe Paul",
        "Dépôt Yaoundé",
        "Équipement neuf - Formation effectuée"
      ],
      [
        "MAT004",
        "Niveleuse CAT 140M",
        "Engin TP",
        "Caterpillar",
        "140M",
        "CAT-140M-2020-234",
        new Date(2020, 8, 5),
        185000000,
        "Moyen",
        "En maintenance",
        8500,
        new Date(2024, 10, 20),
        new Date(2024, 11, 5),
        12000000,
        5,
        15,
        "PROJ001",
        "Ateba Simon",
        "Chantier Logone",
        "⚠️ Révision moteur en cours - Retour prévu 05/12"
      ],
      [
        "MAT005",
        "Véhicule 4x4 Toyota Hilux",
        "Véhicule",
        "Toyota",
        "Hilux Double Cab",
        "TOY-HLX-2021-678",
        new Date(2021, 3, 12),
        22000000,
        "Bon",
        "En utilisation",
        45000,
        new Date(2024, 10, 5),
        new Date(2025, 0, 5),
        3500000,
        3,
        8,
        "PROJ002",
        "Biya Laurent",
        "Chantier Yaoundé",
        "Vidange tous les 5000 km"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // MaterielID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"MAT"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes G, L, M)
    sheet.getRange("G3:G100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    sheet.getRange("L3:M100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Valeurs monétaires (colonnes H, N)
    sheet.getRange("H3:H100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    sheet.getRange("N3:N100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Heures utilisation (colonne K)
    sheet.getRange("K3:K100")
      .setNumberFormat('#,##0" h"')
      .setHorizontalAlignment("right");

    // Nombre pannes et temps arrêt (colonnes O, P)
    sheet.getRange("O3:O100")
      .setHorizontalAlignment("center");

    sheet.getRange("P3:P100")
      .setNumberFormat('#,##0" j"')
      .setHorizontalAlignment("right");

    // ===== VALIDATION DES DONNÉES =====

    // Type de matériel
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_MATERIEL.TYPES, true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type de matériel")
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleType);

    // État
    const regleEtat = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_MATERIEL.ETATS, true)
      .setAllowInvalid(false)
      .setHelpText("État général du matériel")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleEtat);

    // Statut Disponibilité
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_MATERIEL.STATUTS_DISPO, true)
      .setAllowInvalid(false)
      .setHelpText("Statut de disponibilité")
      .build();
    sheet.getRange("J3:J100").setDataValidation(regleStatut);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // État du matériel
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Neuf")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Hors service")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Statut Disponibilité
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Disponible")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En panne")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En maintenance")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Alertes maintenance (Prochaine Maintenance)
    const aujourdhui = new Date();
    const dans7jours = new Date(aujourdhui.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dans30jours = new Date(aujourdhui.getTime() + 30 * 24 * 60 * 60 * 1000);

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenDateBefore(dans7jours)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenDateBefore(dans30jours)
      .setBackground("#fef7e0")
      .setFontColor("#ea8600")
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES & KPIs =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:T${statsRow}`).merge()
      .setValue("📊 STATISTIQUES & KPIs MATÉRIEL v2.0 - MAINTENANCE • COÛTS • DISPONIBILITÉ")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Total matériel", '=NB.SI(B3:B100;"<>"")', "Équipements enregistrés"],
      ["Matériel disponible", '=NB.SI(J3:J100;"Disponible")', "Prêt à l'emploi"],
      ["Matériel en utilisation", '=NB.SI(J3:J100;"En utilisation")', "Affecté aux projets"],
      ["Matériel en panne", '=NB.SI(J3:J100;"En panne")', "⚠️ Hors service"],
      ["Matériel en maintenance", '=NB.SI(J3:J100;"En maintenance")', "En révision"],
      ["Taux de disponibilité", '=SI(B${statsRow+2}>0;B${statsRow+3}/B${statsRow+2};0)', "% matériel disponible"],
      ["Valeur totale parc (FCFA)", '=SOMME(H3:H100)', "Investissement total"],
      ["Coût maintenance total (FCFA)", '=SOMME(N3:N100)', "Dépenses maintenance"],
      ["Coût moyen maintenance (FCFA)", '=SI(B${statsRow+2}>0;B${statsRow+9}/B${statsRow+2};0)', "Par équipement"],
      ["Total pannes", '=SOMME(O3:O100)', "Nombre total d'incidents"],
      ["Temps d'arrêt total (jours)", '=SOMME(P3:P100)', "Indisponibilité cumulée"],
      ["Matériel neuf", '=NB.SI(I3:I100;"Neuf")', "État neuf"],
      ["Matériel bon état", '=NB.SI(I3:I100;"Bon")', "État bon"],
      ["Matériel dégradé", '=NB.SI(I3:I100;"Dégradé")', "⚠️ À surveiller"],
      ["Alertes maintenance urgente", '=NB.SI.ENS(M3:M100;"<"&AUJOURDHUI()+7)', "🚨 Maintenance dans 7j"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Formatage valeurs spécifiques
    sheet.getRange(statsRow + 7, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 8, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 9, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 10, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 12, 2).setNumberFormat('#,##0" j"');

    // ===== FEUILLE HISTORIQUE MAINTENANCE =====
    creerFeuilleHistoriqueMaintenance(ss);

    // ===== FEUILLE PLANNING MAINTENANCE =====
    creerFeuillePlanningMaintenance(ss);

    Logger.log("✅ Module MATERIEL v2.0 initialisé avec succès!");

    if (typeof logMessage === 'function') {
      logMessage('MATERIEL_INIT', 'Module MATERIEL v2.0 initialisé');
    }

    return {success: true, message: "Module MATERIEL v2.0 initialisé"};

  } catch (error) {
    Logger.log("❌ Erreur initialisation MATERIEL v2.0: " + error);
    if (typeof logError === 'function') {
      logError('MATERIEL_INIT', error);
    }
    throw error;
  }
}

// ============================================================================
// CRÉATION FEUILLES SUPPLÉMENTAIRES
// ============================================================================

/**
 * Crée la feuille d'historique des maintenances
 */
function creerFeuilleHistoriqueMaintenance(ss) {
  let sheet = ss.getSheetByName("📝 Historique Maintenance");

  if (sheet) {
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet("📝 Historique Maintenance");

  // En-tête
  sheet.getRange("A1:K1").merge()
    .setValue("📝 HISTORIQUE MAINTENANCE MATÉRIEL")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#1a73e8")
    .setFontColor("#ffffff");

  sheet.setRowHeight(1, 35);

  // Colonnes
  const headers = [
    "MaintenanceID",
    "MaterielID",
    "Nom Matériel",
    "Type Maintenance",
    "Date Maintenance",
    "Durée (h)",
    "Coût (FCFA)",
    "Technicien",
    "Description",
    "Pièces Changées",
    "Observations"
  ];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#174ea6")
    .setFontColor("#ffffff")
    .setWrap(true);

  sheet.setRowHeight(2, 30);

  // Largeurs
  const widths = [120, 100, 200, 150, 120, 100, 150, 180, 300, 250, 250];
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });

  // Données exemple
  const exempleMaintenance = [
    [
      "MAINT001",
      "MAT001",
      "GPS RTK Trimble R12",
      "Préventive",
      new Date(2024, 10, 1),
      2,
      150000,
      "Ngono Patrick",
      "Révision générale annuelle",
      "Batterie lithium",
      "RAS - Fonctionnement optimal"
    ],
    [
      "MAINT002",
      "MAT004",
      "Niveleuse CAT 140M",
      "Curative",
      new Date(2024, 10, 20),
      24,
      4500000,
      "Mekam Jules",
      "Révision moteur - Panne coupure alimentation",
      "Filtre gasoil, injecteurs, courroie distribution",
      "Intervention lourde - Garantie constructeur appliquée"
    ]
  ];

  sheet.getRange(3, 1, exempleMaintenance.length, headers.length).setValues(exempleMaintenance);

  // Formatage
  sheet.getRange("E3:E100").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("F3:F100").setNumberFormat('#,##0" h"');
  sheet.getRange("G3:G100").setNumberFormat('#,##0" FCFA"');

  // Validation type maintenance
  const regleType = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG_MATERIEL.TYPES_MAINTENANCE, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("D3:D100").setDataValidation(regleType);

  sheet.setFrozenRows(2);
}

/**
 * Crée la feuille de planning maintenance
 */
function creerFeuillePlanningMaintenance(ss) {
  let sheet = ss.getSheetByName("📅 Planning Maintenance");

  if (sheet) {
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet("📅 Planning Maintenance");

  // En-tête
  sheet.getRange("A1:H1").merge()
    .setValue("📅 PLANNING MAINTENANCE PRÉVENTIVE")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#1a73e8")
    .setFontColor("#ffffff");

  sheet.setRowHeight(1, 35);

  // Colonnes
  const headers = [
    "MaterielID",
    "Nom Matériel",
    "Type",
    "Prochaine Maintenance",
    "Jours Restants",
    "Priorité",
    "Responsable",
    "Statut"
  ];

  sheet.getRange(2, 1, 1, headers.length).setValues([headers])
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setBackground("#174ea6")
    .setFontColor("#ffffff");

  sheet.setRowHeight(2, 30);

  // Largeurs
  const widths = [100, 250, 150, 140, 120, 120, 180, 140];
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });

  // Formule pour importer depuis feuille principale
  sheet.getRange("A3").setFormula(
    `=QUERY('🔧 Matériel'!A3:T100, "SELECT A, B, C, M WHERE B IS NOT NULL ORDER BY M ASC", 0)`
  );

  // Formule jours restants (colonne E)
  for (let i = 3; i <= 50; i++) {
    sheet.getRange(`E${i}`).setFormula(`=SI(NBVAL(D${i})>0;D${i}-AUJOURDHUI();"")`);
  }

  // Formule priorité (colonne F)
  for (let i = 3; i <= 50; i++) {
    sheet.getRange(`F${i}`).setFormula(
      `=SI(E${i}="";"";SI(E${i}<7;"🚨 URGENT";SI(E${i}<30;"⚠️ Haute";"✅ Normale")))`
    );
  }

  // Formatage
  sheet.getRange("D3:D100").setNumberFormat("dd/mm/yyyy");
  sheet.getRange("E3:E100").setNumberFormat('#,##0" j"');

  // Mise en forme conditionnelle
  const rules = [];

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(7)
    .setBackground("#fce8e6")
    .setFontColor("#c5221f")
    .setBold(true)
    .setRanges([sheet.getRange("E3:E100")])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(7, 30)
    .setBackground("#fef7e0")
    .setFontColor("#ea8600")
    .setRanges([sheet.getRange("E3:E100")])
    .build());

  sheet.setConditionalFormatRules(rules);
  sheet.setFrozenRows(2);
}

// ============================================================================
// FONCTIONS CRUD MATÉRIEL
// ============================================================================

/**
 * Ajoute un nouveau matériel
 */
function ajouterMateriel(nom, type, marque, modele, numSerie, dateAcquisition, valeurAchat, etat, responsable, localisation) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const nouvelleLigne = [
      "", // MaterielID auto-généré
      nom,
      type,
      marque,
      modele,
      numSerie,
      new Date(dateAcquisition),
      parseFloat(valeurAchat),
      etat,
      "Disponible", // Statut initial
      0, // Heures utilisation
      new Date(), // Dernière maintenance = aujourd'hui
      new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // Prochaine dans 6 mois
      0, // Coût maintenance
      0, // Nombre pannes
      0, // Temps arrêt
      "", // Projet affecté
      responsable,
      localisation,
      "Nouveau matériel enregistré"
    ];

    sheet.appendRow(nouvelleLigne);

    if (typeof logMessage === 'function') {
      logMessage('MATERIEL_CREATE', `Nouveau matériel: ${nom}`);
    }

    return {success: true, message: "Matériel ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout matériel: " + error);
    if (typeof logError === 'function') {
      logError('MATERIEL_CREATE', error);
    }
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un matériel existant
 */
function modifierMateriel(materielId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === materielId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Matériel non trouvé: " + materielId);
    }

    const colonnes = {
      "nom": 2, "type": 3, "marque": 4, "modele": 5, "numSerie": 6,
      "dateAcquisition": 7, "valeurAchat": 8, "etat": 9, "statutDispo": 10,
      "heuresUtilisation": 11, "derniereMaintenance": 12, "prochaineMaintenance": 13,
      "coutMaintenance": 14, "nombrePannes": 15, "tempsArret": 16,
      "projetAffecte": 17, "responsable": 18, "localisation": 19, "observations": 20
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof logMessage === 'function') {
      logMessage('MATERIEL_UPDATE', `Matériel ${materielId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Matériel modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification matériel: " + error);
    if (typeof logError === 'function') {
      logError('MATERIEL_UPDATE', error);
    }
    return {success: false, message: error.message};
  }
}

/**
 * Supprime un matériel
 */
function supprimerMateriel(materielId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === materielId) {
        sheet.deleteRow(i + 1);

        if (typeof logMessage === 'function') {
          logMessage('MATERIEL_DELETE', `Matériel supprimé: ${materielId}`);
        }

        return {success: true, message: "Matériel supprimé avec succès"};
      }
    }

    throw new Error("Matériel non trouvé: " + materielId);

  } catch (error) {
    Logger.log("Erreur suppression matériel: " + error);
    if (typeof logError === 'function') {
      logError('MATERIEL_DELETE', error);
    }
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les matériels
 */
function obtenirTousMateriel() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const materiel = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) { // Si nom non vide
        materiel.push({
          id: data[i][0],
          nom: data[i][1],
          type: data[i][2],
          marque: data[i][3],
          statut: data[i][9],
          heuresUtilisation: data[i][10],
          prochaineMaintenance: data[i][12]
        });
      }
    }

    return {success: true, materiel: materiel};

  } catch (error) {
    Logger.log("Erreur obtention matériel: " + error);
    return {success: false, message: error.message};
  }
}

// ============================================================================
// FONCTIONS MAINTENANCE
// ============================================================================

/**
 * Enregistre une opération de maintenance
 */
function enregistrerMaintenance(materielId, typeMaintenance, duree, cout, technicien, description, piecesChangees) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetHisto = ss.getSheetByName("📝 Historique Maintenance");
    const sheetMateriel = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheetHisto || !sheetMateriel) {
      throw new Error("Feuilles nécessaires manquantes");
    }

    // Récupérer infos matériel
    const dataMateriel = sheetMateriel.getDataRange().getValues();
    let materielNom = "";
    let ligneMatriel = -1;

    for (let i = 2; i < dataMateriel.length; i++) {
      if (dataMateriel[i][0] === materielId) {
        materielNom = dataMateriel[i][1];
        ligneMatriel = i + 1;
        break;
      }
    }

    if (ligneMatriel === -1) {
      throw new Error("Matériel non trouvé");
    }

    // Ajouter dans historique
    const derniereLigne = sheetHisto.getLastRow() + 1;
    const maintenanceId = "MAINT" + Utilities.formatString("%03d", derniereLigne - 2);

    const nouvelleMaintenance = [
      maintenanceId,
      materielId,
      materielNom,
      typeMaintenance,
      new Date(),
      parseFloat(duree),
      parseFloat(cout),
      technicien,
      description,
      piecesChangees,
      ""
    ];

    sheetHisto.appendRow(nouvelleMaintenance);

    // Mettre à jour feuille matériel
    sheetMateriel.getRange(ligneMatriel, 12).setValue(new Date()); // Dernière maintenance

    // Calculer prochaine maintenance (6 mois)
    const prochaineMaintenance = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
    sheetMateriel.getRange(ligneMatriel, 13).setValue(prochaineMaintenance);

    // Mettre à jour coût total maintenance
    const coutActuel = parseFloat(dataMateriel[ligneMatriel - 1][13]) || 0;
    sheetMateriel.getRange(ligneMatriel, 14).setValue(coutActuel + parseFloat(cout));

    // Si maintenance terminée, remettre en disponible
    if (dataMateriel[ligneMatriel - 1][9] === "En maintenance") {
      sheetMateriel.getRange(ligneMatriel, 10).setValue("Disponible");
    }

    if (typeof logMessage === 'function') {
      logMessage('MATERIEL_MAINTENANCE', `Maintenance ${typeMaintenance} effectuée: ${materielId}`);
    }

    return {success: true, message: "Maintenance enregistrée avec succès", maintenanceId: maintenanceId};

  } catch (error) {
    Logger.log("Erreur enregistrement maintenance: " + error);
    if (typeof logError === 'function') {
      logError('MATERIEL_MAINTENANCE', error);
    }
    return {success: false, message: error.message};
  }
}

/**
 * Déclare une panne
 */
function declarerPanne(materielId, description) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === materielId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Matériel non trouvé");
    }

    // Mettre en panne
    sheet.getRange(ligneModifiee, 10).setValue("En panne");

    // Incrémenter nombre de pannes
    const nombrePannes = parseInt(data[ligneModifiee - 1][14]) || 0;
    sheet.getRange(ligneModifiee, 15).setValue(nombrePannes + 1);

    // Ajouter observation
    const observations = data[ligneModifiee - 1][19] || "";
    const nouvelleObs = `${observations}\n[PANNE ${new Date().toLocaleDateString()}] ${description}`;
    sheet.getRange(ligneModifiee, 20).setValue(nouvelleObs);

    if (typeof logMessage === 'function') {
      logMessage('MATERIEL_PANNE', `Panne déclarée: ${materielId} - ${description}`);
    }

    return {success: true, message: "Panne déclarée avec succès"};

  } catch (error) {
    Logger.log("Erreur déclaration panne: " + error);
    if (typeof logError === 'function') {
      logError('MATERIEL_PANNE', error);
    }
    return {success: false, message: error.message};
  }
}

/**
 * Calcule le coût d'utilisation avec amortissement
 */
function calculerCoutUtilisation(materielId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let materiel = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === materielId) {
        materiel = data[i];
        break;
      }
    }

    if (!materiel) {
      throw new Error("Matériel non trouvé");
    }

    const valeurAchat = parseFloat(materiel[7]) || 0;
    const dateAcquisition = new Date(materiel[6]);
    const coutMaintenance = parseFloat(materiel[13]) || 0;
    const heuresUtilisation = parseFloat(materiel[10]) || 1;

    // Calcul amortissement linéaire (10 ans)
    const aujourdhui = new Date();
    const ageAnnees = (aujourdhui - dateAcquisition) / (365 * 24 * 60 * 60 * 1000);
    const tauxAmortissement = 0.1; // 10% par an
    const amortissementCumule = Math.min(valeurAchat * tauxAmortissement * ageAnnees, valeurAchat);
    const valeurNetteComptable = valeurAchat - amortissementCumule;

    // Coût horaire
    const coutHoraire = (amortissementCumule + coutMaintenance) / heuresUtilisation;

    return {
      success: true,
      couts: {
        valeurAchat: valeurAchat,
        amortissementCumule: amortissementCumule,
        valeurNetteComptable: valeurNetteComptable,
        coutMaintenance: coutMaintenance,
        heuresUtilisation: heuresUtilisation,
        coutHoraire: coutHoraire,
        ageAnnees: ageAnnees.toFixed(1)
      }
    };

  } catch (error) {
    Logger.log("Erreur calcul coût: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les alertes de maintenance
 */
function obtenirAlertesMaintenance() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const alertes = [];
    const aujourdhui = new Date();

    for (let i = 2; i < data.length; i++) {
      if (!data[i][1]) continue; // Skip si pas de nom

      const prochaineMaintenance = new Date(data[i][12]);
      const joursRestants = Math.ceil((prochaineMaintenance - aujourdhui) / (24 * 60 * 60 * 1000));
      const heuresUtilisation = parseFloat(data[i][10]) || 0;

      let niveau = "";
      let message = "";

      // Alerte basée sur date
      if (joursRestants < 0) {
        niveau = "URGENT";
        message = `Maintenance en retard de ${Math.abs(joursRestants)} jours`;
      } else if (joursRestants <= CONFIG_MATERIEL.SEUIL_CRITIQUE_JOURS) {
        niveau = "CRITIQUE";
        message = `Maintenance dans ${joursRestants} jours`;
      } else if (joursRestants <= CONFIG_MATERIEL.SEUIL_ALERTE_JOURS) {
        niveau = "ALERTE";
        message = `Maintenance dans ${joursRestants} jours`;
      }

      // Alerte basée sur heures utilisation
      if (heuresUtilisation >= CONFIG_MATERIEL.SEUIL_CRITIQUE_HEURES) {
        niveau = niveau || "CRITIQUE";
        message += ` - ${heuresUtilisation}h d'utilisation`;
      } else if (heuresUtilisation >= CONFIG_MATERIEL.SEUIL_ALERTE_HEURES) {
        niveau = niveau || "ALERTE";
        message += ` - ${heuresUtilisation}h d'utilisation`;
      }

      if (niveau) {
        alertes.push({
          niveau: niveau,
          materielId: data[i][0],
          nom: data[i][1],
          type: data[i][2],
          prochaineMaintenance: prochaineMaintenance,
          joursRestants: joursRestants,
          heuresUtilisation: heuresUtilisation,
          message: message
        });
      }
    }

    // Trier par urgence
    alertes.sort((a, b) => {
      const ordre = {URGENT: 0, CRITIQUE: 1, ALERTE: 2};
      return ordre[a.niveau] - ordre[b.niveau];
    });

    return {success: true, alertes: alertes, total: alertes.length};

  } catch (error) {
    Logger.log("Erreur obtention alertes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Exporte un rapport de maintenance
 */
function exporterRapportMaintenance(format = 'csv') {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Historique Maintenance");

    if (!sheet) {
      throw new Error("L'historique de maintenance n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    if (format === 'csv') {
      let csv = "";
      data.forEach(row => {
        csv += row.join(";") + "\n";
      });

      return {success: true, data: csv, format: 'csv'};
    }

    if (format === 'json') {
      const headers = data[1];
      const jsonData = [];

      for (let i = 2; i < data.length; i++) {
        if (data[i][0]) {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = data[i][index];
          });
          jsonData.push(obj);
        }
      }

      return {success: true, data: JSON.stringify(jsonData, null, 2), format: 'json'};
    }

    throw new Error("Format non supporté: " + format);

  } catch (error) {
    Logger.log("Erreur export rapport: " + error);
    return {success: false, message: error.message};
  }
}

// ============================================================================
// FONCTIONS UI
// ============================================================================

/**
 * Affiche la sidebar Matériel
 */
function afficherSidebarMateriel() {
  const html = HtmlService.createHtmlOutputFromFile('modules/materiel/MaterielSidebar')
    .setTitle('Gestion Matériel v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal Matériel
 */
function afficherModalMateriel() {
  const html = HtmlService.createHtmlOutputFromFile('modules/materiel/MaterielModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Matériel v2.0 - Maintenance & Alertes');
}

/**
 * Obtient les KPIs matériel pour l'affichage
 */
function obtenirKPIsMateriel() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG_MATERIEL.SHEET_NAME);

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    let total = 0;
    let disponible = 0;
    let enPanne = 0;
    let enMaintenance = 0;
    let valeurTotale = 0;
    let coutMaintenance = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {
        total++;
        if (data[i][9] === "Disponible") disponible++;
        if (data[i][9] === "En panne") enPanne++;
        if (data[i][9] === "En maintenance") enMaintenance++;
        valeurTotale += parseFloat(data[i][7]) || 0;
        coutMaintenance += parseFloat(data[i][13]) || 0;
      }
    }

    const tauxDisponibilite = total > 0 ? (disponible / total * 100).toFixed(1) : 0;

    return {
      success: true,
      kpis: {
        total: total,
        disponible: disponible,
        enPanne: enPanne,
        enMaintenance: enMaintenance,
        tauxDisponibilite: tauxDisponibilite,
        valeurTotale: valeurTotale,
        coutMaintenance: coutMaintenance
      }
    };

  } catch (error) {
    Logger.log("Erreur obtention KPIs: " + error);
    return {success: false, message: error.message};
  }
}
