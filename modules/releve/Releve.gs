/**
 * MODULE RELEVE - Gestion Complète des Relevés Topographiques
 * Saisie et analyse des données terrain - Coordonnées GPS, nivellement, implantation
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE RELEVE ====================

/**
 * Initialise le module RELEVE avec toutes les fonctionnalités
 */
function initialiserReleve() {
  try {
    Logger.log("📐 Initialisation du module RELEVE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("📐 Relevés");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("📐 Relevés");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:Q1").merge()
      .setValue("📐 GESTION DES RELEVÉS TOPOGRAPHIQUES - DONNÉES TERRAIN ET COORDONNÉES GPS")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "ReleveID",
      "TacheID",
      "EmployeID",
      "Date Relevé",
      "Heure",
      "Coordonnée X (m)",
      "Coordonnée Y (m)",
      "Coordonnée Z (m)",
      "Latitude (°)",
      "Longitude (°)",
      "Type de Relevé",
      "Méthode",
      "Instrument",
      "Précision (cm)",
      "Validé",
      "Observations",
      "Statut Qualité"
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
    const columnWidths = [100, 100, 100, 110, 80, 130, 130, 130, 130, 130, 150, 130, 120, 110, 80, 250, 120];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "REL001",
        "TACHE001",
        "EMP001",
        new Date(2024, 1, 15),
        "09:30",
        250450.125,
        580320.450,
        425.350,
        5.9876543,
        10.1234567,
        "Nivellement",
        "Station Totale",
        "Leica TS16",
        2,
        "OUI",
        "Point de référence PR-01 - Origine réseau",
        "✓ Valide"
      ],
      [
        "REL002",
        "TACHE001",
        "EMP001",
        new Date(2024, 1, 15),
        "10:15",
        250475.890,
        580345.230,
        425.890,
        5.9878234,
        10.1236789,
        "Implantation",
        "GPS RTK",
        "Trimble R12",
        1.5,
        "OUI",
        "Axe canal - PK 0+100",
        "✓ Valide"
      ],
      [
        "REL003",
        "TACHE002",
        "EMP002",
        new Date(2024, 2, 3),
        "14:20",
        251250.560,
        581100.780,
        428.120,
        5.9956789,
        10.1345678,
        "Contrôle",
        "GPS différentiel",
        "Trimble R12",
        2.5,
        "OUI",
        "Vérification implantation - Conforme",
        "✓ Valide"
      ],
      [
        "REL004",
        "TACHE003",
        "EMP003",
        new Date(2024, 2, 10),
        "08:45",
        249850.340,
        579890.120,
        422.780,
        5.9789012,
        10.1145678,
        "Levé",
        "Station Totale",
        "Topcon ES-105",
        3,
        "EN ATTENTE",
        "Levé terrain naturel - À vérifier",
        "⚠️ À vérifier"
      ],
      [
        "REL005",
        "TACHE002",
        "EMP001",
        new Date(2024, 2, 5),
        "11:30",
        250680.920,
        580560.340,
        426.450,
        5.9889123,
        10.1256789,
        "Nivellement",
        "Niveau optique",
        "Leica DNA03",
        0.5,
        "OUI",
        "Nivellement de précision - Bassin",
        "✓ Valide"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // ReleveID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 6; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(D${i})>0;"REL"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Date (colonne D)
    sheet.getRange("D3:D100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Heure (colonne E)
    sheet.getRange("E3:E100")
      .setNumberFormat("hh:mm")
      .setHorizontalAlignment("center");

    // Coordonnées XYZ (colonnes F, G, H) - Format avec 3 décimales
    sheet.getRange("F3:H100")
      .setNumberFormat("0.000")
      .setHorizontalAlignment("right");

    // Latitude/Longitude (colonnes I, J) - Format géographique avec 7 décimales
    sheet.getRange("I3:J100")
      .setNumberFormat("0.0000000°")
      .setHorizontalAlignment("right");

    // Précision (colonne N)
    sheet.getRange("N3:N100")
      .setNumberFormat('0.0" cm"')
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Distance horizontale entre points successifs (colonne cachée)
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Distance (m)");
    for (let i = 4; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(ET(F${i}>0;G${i}>0;F${i-1}>0;G${i-1}>0);RACINE(PUISSANCE(F${i}-F${i-1};2)+PUISSANCE(G${i}-G${i-1};2));"")`
      );
    }
    sheet.getRange("K3:K100").setNumberFormat('0.00" m"');
    sheet.hideColumns(11);

    // Dénivelé entre points (colonne cachée)
    sheet.insertColumnAfter(11);
    sheet.getRange("L2").setValue("Dénivelé (m)");
    for (let i = 4; i <= 100; i++) {
      sheet.getRange(`L${i}`).setFormula(
        `=SI(ET(H${i}>0;H${i-1}>0);H${i}-H${i-1};"")`
      );
    }
    sheet.getRange("L3:L100").setNumberFormat('0.000" m"');
    sheet.hideColumns(12);

    // Pente en % (colonne cachée)
    sheet.insertColumnAfter(12);
    sheet.getRange("M2").setValue("Pente (%)");
    for (let i = 4; i <= 100; i++) {
      sheet.getRange(`M${i}`).setFormula(
        `=SI(ET(K${i}>0;L${i}<>"");ABS(L${i}/K${i}*100);"")`
      );
    }
    sheet.getRange("M3:M100").setNumberFormat('0.00"%"');
    sheet.hideColumns(13);

    // Validation coordonnées GPS - Cameroun (Lat: 2°-13°N, Lon: 8°-16°E)
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Zone Valide");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(ET(I${i}>=2;I${i}<=13;J${i}>=8;J${i}<=16);"✓ Cameroun";"⚠️ Hors zone")`
      );
    }
    sheet.hideColumns(11);

    // Conversion coordonnées (UTM Zone 33N pour Cameroun)
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Zone UTM");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`I${i}`).setValue("33N");
    }
    sheet.hideColumns(9);

    // Calcul automatique de précision requise selon type de relevé
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Précision Requise");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(L${i}="Nivellement";0.5;SI(L${i}="Implantation";2;SI(L${i}="Contrôle";2;SI(L${i}="Levé";5;10))))`
      );
    }
    sheet.getRange("O3:O100").setNumberFormat('0.0" cm"');
    sheet.hideColumns(15);

    // Statut qualité automatique basé sur précision
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(P${i}="NON";"⏳ Non validé";SI(O${i}<=P${i};"✓ Valide";SI(O${i}<=P${i}*2;"⚠️ À vérifier";"❌ Rejeter")))`
      );
    }

    // ===== VALIDATION DES DONNÉES =====

    // TacheID - Liste déroulante depuis la feuille Tâches
    const regleTache = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("✅ Tâches").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez une tâche existante")
      .build();
    sheet.getRange("B3:B100").setDataValidation(regleTache);

    // Type de Relevé
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Nivellement", "Implantation", "Contrôle", "Levé", "Bathymétrie", "Profil en long", "Profil en travers"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type de relevé topographique")
      .build();
    sheet.getRange("K3:K100").setDataValidation(regleType);

    // Méthode
    const regleMethode = SpreadsheetApp.newDataValidation()
      .requireValueInList(["GPS RTK", "GPS différentiel", "Station Totale", "Niveau optique", "Niveau numérique", "Théodolite", "Laser scanner"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la méthode de mesure")
      .build();
    sheet.getRange("L3:L100").setDataValidation(regleMethode);

    // Instrument
    const regleInstrument = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Leica TS16", "Leica DNA03", "Trimble R12", "Topcon ES-105", "Sokkia GRX3", "Autre"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez l'instrument utilisé")
      .build();
    sheet.getRange("M3:M100").setDataValidation(regleInstrument);

    // Validé (OUI/NON)
    const regleValide = SpreadsheetApp.newDataValidation()
      .requireValueInList(["OUI", "NON", "EN ATTENTE"], true)
      .setAllowInvalid(false)
      .setHelpText("Le relevé a-t-il été validé ?")
      .build();
    sheet.getRange("O3:O100").setDataValidation(regleValide);

    // Coordonnées X, Y - Validation plage réaliste pour Cameroun (UTM Zone 33N)
    const regleCoordX = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(200000, 900000)
      .setAllowInvalid(false)
      .setHelpText("Coordonnée X UTM (200000-900000 m)")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleCoordX);

    const regleCoordY = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(200000, 1500000)
      .setAllowInvalid(false)
      .setHelpText("Coordonnée Y UTM (200000-1500000 m)")
      .build();
    sheet.getRange("G3:G100").setDataValidation(regleCoordY);

    // Altitude - Validation plage réaliste pour Cameroun (0-4100m)
    const regleAltitude = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 4100)
      .setAllowInvalid(false)
      .setHelpText("Altitude (0-4100 m)")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleAltitude);

    // Latitude - Cameroun (2°-13°N)
    const regleLatitude = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(2, 13)
      .setAllowInvalid(false)
      .setHelpText("Latitude Cameroun (2°-13°N)")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleLatitude);

    // Longitude - Cameroun (8°-16°E)
    const regleLongitude = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(8, 16)
      .setAllowInvalid(false)
      .setHelpText("Longitude Cameroun (8°-16°E)")
      .build();
    sheet.getRange("J3:J100").setDataValidation(regleLongitude);

    // Précision (nombre positif)
    const reglePrecision = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Précision en centimètres")
      .build();
    sheet.getRange("N3:N100").setDataValidation(reglePrecision);

    // Date
    const regleDate = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText("Entrez une date valide")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleDate);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut Qualité - Valide (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("✓ Valide")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("Q3:Q100")])
      .build());

    // Statut Qualité - À vérifier (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("⚠️ À vérifier")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("Q3:Q100")])
      .build());

    // Statut Qualité - Rejeter (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("❌ Rejeter")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("Q3:Q100")])
      .build());

    // Statut Qualité - Non validé (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("⏳ Non validé")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("Q3:Q100")])
      .build());

    // Validé - OUI (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("OUI")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // Validé - NON (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("NON")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // Validé - EN ATTENTE (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("EN ATTENTE")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // Type de Relevé - Couleurs différenciées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Nivellement")
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Implantation")
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Contrôle")
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Levé")
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Précision - Échelle colorée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThanOrEqualTo(2)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(2.1, 5)
      .setBackground("#fef7e0")
      .setFontColor("#f57c00")
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(5)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 110;

    // Titre de la section
    sheet.getRange(`A${statsRow}:Q${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DES RELEVÉS TOPOGRAPHIQUES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total de relevés", '=NB.SI(D3:D100;"<>"")', "Points topographiques"],
      ["Relevés validés", '=NB.SI(O3:O100;"OUI")', "Relevés conformes"],
      ["Relevés en attente", '=NB.SI(O3:O100;"EN ATTENTE")', "À vérifier"],
      ["Relevés rejetés", '=NB.SI(O3:O100;"NON")', "Non conformes"],
      ["Taux de validation", '=SI(NB.SI(D3:D100;"<>""")>0;NB.SI(O3:O100;"OUI")/NB.SI(D3:D100;"<>""");0)', "% relevés validés"],
      ["Nivellements", '=NB.SI(K3:K100;"Nivellement")', "Points de nivellement"],
      ["Implantations", '=NB.SI(K3:K100;"Implantation")', "Points d'implantation"],
      ["Contrôles", '=NB.SI(K3:K100;"Contrôle")', "Points de contrôle"],
      ["Levés terrain", '=NB.SI(K3:K100;"Levé")', "Points levés"],
      ["Précision moyenne", '=MOYENNE(N3:N100)', "Précision moyenne obtenue"],
      ["Précision minimale", '=MIN(N3:N100)', "Meilleure précision"],
      ["Précision maximale", '=MAX(N3:N100)', "Précision la plus faible"],
      ["Altitude moyenne", '=MOYENNE(H3:H100)', "Altitude moyenne du site"],
      ["Altitude min", '=MIN(H3:H100)', "Point le plus bas"],
      ["Altitude max", '=MAX(H3:H100)', "Point le plus haut"],
      ["Dénivelé total", '=MAX(H3:H100)-MIN(H3:H100)', "Amplitude altimétrique"],
      ["Relevés GPS RTK", '=NB.SI(L3:L100;"GPS RTK")', "Mesures GPS RTK"],
      ["Relevés Station Totale", '=NB.SI.SI.SI(L3:L100;"*Station*")', "Mesures station totale"],
      ["Relevés du mois", '=NB.SI.ENS(D3:D100;">="&AUJOURDHUI()-30)', "30 derniers jours"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 6, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 11, 2, 3, 1).setNumberFormat('0.0" cm"');
    sheet.getRange(statsRow + 14, 2, 4, 1).setNumberFormat('0.00" m"');

    // Bordures pour les KPIs
    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // Alternance de couleurs pour les lignes
    for (let i = 0; i < kpis.length; i++) {
      if (i > 0 && i % 2 === 0) {
        sheet.getRange(statsRow + 1 + i, 1, 1, 3).setBackground("#f8f9fa");
      }
    }

    // ===== ANALYSES SPATIALES =====
    const spatialRow = statsRow + kpis.length + 3;

    sheet.getRange(`A${spatialRow}:Q${spatialRow}`).merge()
      .setValue("🗺️ ANALYSES SPATIALES ET GÉOMÉTRIQUES")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const analysesSpatiales = [
      ["Analyse", "Valeur", "Unité", "Description"],
      ["Emprise X min", '=MIN(F3:F100)', "m", "Limite Ouest du site"],
      ["Emprise X max", '=MAX(F3:F100)', "m", "Limite Est du site"],
      ["Emprise Y min", '=MIN(G3:G100)', "m", "Limite Sud du site"],
      ["Emprise Y max", '=MAX(G3:G100)', "m", "Limite Nord du site"],
      ["Largeur site (X)", '=MAX(F3:F100)-MIN(F3:F100)', "m", "Extension Est-Ouest"],
      ["Longueur site (Y)", '=MAX(G3:G100)-MIN(G3:G100)', "m", "Extension Nord-Sud"],
      ["Centroïde X", '=MOYENNE(F3:F100)', "m", "Centre géométrique X"],
      ["Centroïde Y", '=MOYENNE(G3:G100)', "m", "Centre géométrique Y"],
      ["Pente moyenne", '=MOYENNE(M3:M100)', "%", "Pente moyenne du terrain"],
      ["Pente maximale", '=MAX(M3:M100)', "%", "Pente la plus forte"]
    ];

    sheet.getRange(spatialRow + 1, 1, analysesSpatiales.length, 4).setValues(analysesSpatiales);

    // Formatage des analyses spatiales
    sheet.getRange(spatialRow + 1, 1, 1, 4)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(spatialRow + 2, 2, analysesSpatiales.length - 1, 1).setNumberFormat("0.000");

    // Bordures
    sheet.getRange(spatialRow + 1, 1, analysesSpatiales.length, 4).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== GRAPHIQUES ET ANALYSES =====

    // Graphique 1: Répartition par type de relevé
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("K2:K100"))
      .setPosition(statsRow + kpis.length + 15, 1, 0, 0)
      .setOption('title', 'Répartition des Relevés par Type')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartType);

    // Graphique 2: Profil altimétrique
    const chartAltitude = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange("A2:A100"))
      .addRange(sheet.getRange("H2:H100"))
      .setPosition(statsRow + kpis.length + 15, 8, 0, 0)
      .setOption('title', 'Profil Altimétrique des Relevés')
      .setOption('width', 650)
      .setOption('height', 300)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Altitude (m)', format: '0.00'})
      .setOption('hAxis', {title: 'Points de relevé'})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .setOption('curveType', 'function')
      .setOption('pointSize', 3)
      .build();

    sheet.insertChart(chartAltitude);

    // Graphique 3: Distribution de précision
    const chartPrecision = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("A2:A100"))
      .addRange(sheet.getRange("N2:N100"))
      .setPosition(statsRow + kpis.length + 32, 1, 0, 0)
      .setOption('title', 'Précision des Relevés (cm)')
      .setOption('width', 600)
      .setOption('height', 350)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Précision (cm)', format: '0.0'})
      .setOption('hAxis', {title: 'Points de relevé', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartPrecision);

    // Graphique 4: Carte des points (X,Y)
    const chartCarte = sheet.newChart()
      .setChartType(Charts.ChartType.SCATTER)
      .addRange(sheet.getRange("F2:G100"))
      .setPosition(statsRow + kpis.length + 32, 9, 0, 0)
      .setOption('title', 'Carte de Position des Points (UTM)')
      .setOption('width', 600)
      .setOption('height', 350)
      .setOption('colors', ['#ea4335'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Coordonnée Y (m)', format: '0'})
      .setOption('hAxis', {title: 'Coordonnée X (m)', format: '0'})
      .setOption('chartArea', {width: '75%', height: '75%'})
      .setOption('pointSize', 5)
      .setOption('pointShape', 'circle')
      .build();

    sheet.insertChart(chartCarte);

    // ===== EXPORT ET FORMATS STANDARDS =====
    const exportRow = statsRow + kpis.length + 52;

    sheet.getRange(`A${exportRow}:Q${exportRow}`).merge()
      .setValue("💾 FORMATS D'EXPORT - COMPATIBILITÉ LOGICIELS TOPOGRAPHIQUES")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const formatsExport = [
      ["Format", "Extension", "Logiciel Compatible", "Colonnes Exportées"],
      ["ASCII XYZ", ".xyz", "AutoCAD, Civil 3D", "X, Y, Z"],
      ["Format Leica GSI", ".gsi", "Leica Geo Office", "Point, Hz, V, Sd"],
      ["Format Trimble DC", ".dc", "Trimble Business Center", "Point, N, E, Z, Code"],
      ["Shapefile", ".shp", "QGIS, ArcGIS", "Géométrie + Attributs"],
      ["DXF AutoCAD", ".dxf", "AutoCAD, MicroStation", "Polylignes 3D"],
      ["CSV Standard", ".csv", "Excel, Tous logiciels", "Toutes colonnes"],
      ["KML Google Earth", ".kml", "Google Earth", "Lat, Lon, Alt, Nom"]
    ];

    sheet.getRange(exportRow + 1, 1, formatsExport.length, 4).setValues(formatsExport);

    // Formatage
    sheet.getRange(exportRow + 1, 1, 1, 4)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(exportRow + 1, 1, formatsExport.length, 4).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== TABLEAU DE CONTRÔLE QUALITÉ =====
    const qualiteRow = exportRow + formatsExport.length + 3;

    sheet.getRange(`A${qualiteRow}:F${qualiteRow}`).merge()
      .setValue("✓ CONTRÔLE QUALITÉ DES RELEVÉS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#34a853")
      .setFontColor("#ffffff");

    const headersQualite = ["ReleveID", "Type", "Précision Obtenue", "Précision Requise", "Écart", "Statut"];
    sheet.getRange(qualiteRow + 1, 1, 1, 6).setValues([headersQualite])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Relevés protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:P100")  // Zone de saisie principale (pas le ReleveID ni le Statut Qualité)
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module RELEVE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module RELEVE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau relevé topographique
 */
function ajouterReleve(tacheId, employeId, coordX, coordY, coordZ, latitude, longitude, typeReleve, methode, instrument, precision, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    // Validation coordonnées Cameroun
    if (latitude < 2 || latitude > 13 || longitude < 8 || longitude > 16) {
      throw new Error("Coordonnées GPS hors zone Cameroun (Lat: 2-13°N, Lon: 8-16°E)");
    }

    const maintenant = new Date();
    const nouvelleLigne = [
      "",  // ReleveID auto-généré
      tacheId,
      employeId,
      maintenant,  // Date
      Utilities.formatDate(maintenant, Session.getScriptTimeZone(), "HH:mm"),  // Heure
      parseFloat(coordX),
      parseFloat(coordY),
      parseFloat(coordZ),
      parseFloat(latitude),
      parseFloat(longitude),
      typeReleve,
      methode,
      instrument,
      parseFloat(precision),
      "EN ATTENTE",  // Validé
      observations,
      ""  // Statut Qualité (auto-calculé)
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("RELEVE", `Nouveau relevé: ${typeReleve} - Point (${coordX}, ${coordY}, ${coordZ})`);
    }

    return {success: true, message: "Relevé ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout relevé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un relevé existant
 */
function modifierReleve(releveId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver le relevé
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === releveId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Relevé non trouvé: " + releveId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "tacheId": 2,
      "employeId": 3,
      "date": 4,
      "heure": 5,
      "coordX": 6,
      "coordY": 7,
      "coordZ": 8,
      "latitude": 9,
      "longitude": 10,
      "typeReleve": 11,
      "methode": 12,
      "instrument": 13,
      "precision": 14,
      "valide": 15,
      "observations": 16
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("RELEVE", `Relevé ${releveId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Relevé modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification relevé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Valide un relevé topographique
 */
function validerReleve(releveId) {
  return modifierReleve(releveId, "valide", "OUI");
}

/**
 * Rejette un relevé topographique
 */
function rejeterReleve(releveId, motif) {
  const result = modifierReleve(releveId, "valide", "NON");
  if (result.success) {
    modifierReleve(releveId, "observations", motif);
  }
  return result;
}

/**
 * Supprime un relevé
 */
function supprimerReleve(releveId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === releveId) {
        sheet.deleteRow(i + 1);

        if (typeof journaliserAction === 'function') {
          journaliserAction("RELEVE", `Relevé supprimé: ${releveId}`);
        }

        return {success: true, message: "Relevé supprimé avec succès"};
      }
    }

    throw new Error("Relevé non trouvé: " + releveId);

  } catch (error) {
    Logger.log("Erreur suppression relevé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des relevés selon critères
 */
function rechercherReleves(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "typeReleve": 10,
      "methode": 11,
      "instrument": 12,
      "valide": 14,
      "tacheId": 1
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push(data[i]);
      }
    }

    return {success: true, resultats: resultats};

  } catch (error) {
    Logger.log("Erreur recherche relevés: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les relevés
 */
function obtenirTousReleves() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const releves = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][3]) {  // Si date existe
        releves.push({
          id: data[i][0],
          tacheId: data[i][1],
          employeId: data[i][2],
          date: data[i][3],
          heure: data[i][4],
          coordX: data[i][5],
          coordY: data[i][6],
          coordZ: data[i][7],
          latitude: data[i][8],
          longitude: data[i][9],
          typeReleve: data[i][10],
          methode: data[i][11],
          instrument: data[i][12],
          precision: data[i][13],
          valide: data[i][14],
          observations: data[i][15],
          statutQualite: data[i][16]
        });
      }
    }

    return {success: true, releves: releves};

  } catch (error) {
    Logger.log("Erreur obtention relevés: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Exporte les relevés au format XYZ
 */
function exporterXYZ() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let contenuXYZ = "# Format XYZ - Relevés Topographiques\n";
    contenuXYZ += "# X(m) Y(m) Z(m) Code\n";

    for (let i = 2; i < data.length; i++) {
      if (data[i][14] === "OUI") {  // Seulement les relevés validés
        contenuXYZ += `${data[i][5].toFixed(3)} ${data[i][6].toFixed(3)} ${data[i][7].toFixed(3)} ${data[i][0]}\n`;
      }
    }

    return {success: true, contenu: contenuXYZ, format: "xyz"};

  } catch (error) {
    Logger.log("Erreur export XYZ: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Exporte les relevés au format CSV
 */
function exporterCSV() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let contenuCSV = data[1].join(";") + "\n";  // En-têtes

    for (let i = 2; i < data.length; i++) {
      if (data[i][3]) {  // Si date existe
        contenuCSV += data[i].join(";") + "\n";
      }
    }

    return {success: true, contenu: contenuCSV, format: "csv"};

  } catch (error) {
    Logger.log("Erreur export CSV: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un rapport de relevé
 */
function genererRapportReleve(releveId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📐 Relevés");

    if (!sheet) {
      throw new Error("La feuille Relevés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let releve = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === releveId) {
        releve = data[i];
        break;
      }
    }

    if (!releve) {
      throw new Error("Relevé non trouvé");
    }

    const rapport = {
      id: releve[0],
      tacheId: releve[1],
      employeId: releve[2],
      date: releve[3],
      heure: releve[4],
      coordonnees: {
        x: releve[5],
        y: releve[6],
        z: releve[7],
        latitude: releve[8],
        longitude: releve[9]
      },
      typeReleve: releve[10],
      methode: releve[11],
      instrument: releve[12],
      precision: releve[13],
      valide: releve[14],
      observations: releve[15],
      statutQualite: releve[16]
    };

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affiche la sidebar du module Relevé
 */
function afficherSidebarReleve() {
  const html = HtmlService.createHtmlOutputFromFile('modules/releve/ReleveSidebar')
    .setTitle('Gestion Relevés')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal du module Relevé
 */
function afficherModalReleve() {
  const html = HtmlService.createHtmlOutputFromFile('modules/releve/ReleveModal')
    .setWidth(900)
    .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Relevés Topographiques');
}
