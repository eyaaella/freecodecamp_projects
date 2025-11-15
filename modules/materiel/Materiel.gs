/**
 * MODULE MATERIEL - Gestion Complète du Matériel Topographique
 * Gestion du parc matériel et équipements techniques
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE MATERIEL ====================

/**
 * Initialise le module MATERIEL avec toutes les fonctionnalités
 */
function initialiserMateriel() {
  try {
    Logger.log("🔧 Initialisation du module MATERIEL...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("🔧 Matériel");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("🔧 Matériel");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:N1").merge()
      .setValue("🔧 GESTION DU MATÉRIEL TOPOGRAPHIQUE - PARC MATÉRIEL ET ÉQUIPEMENTS")
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
      "Numéro Série",
      "Date Acquisition",
      "Date Dernier Entretien",
      "Prochain Entretien",
      "Statut",
      "Affecté à",
      "Valeur (FCFA)",
      "État",
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
    const columnWidths = [100, 200, 150, 120, 150, 150, 110, 130, 130, 130, 120, 150, 120, 250];
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
        "R12",
        "TR12-2023-001",
        new Date(2023, 0, 15),
        new Date(2024, 8, 10),
        new Date(2025, 2, 10),
        "En utilisation",
        "EQ001",
        45000000,
        "Bon",
        "GPS haute précision - réseau RTK"
      ],
      [
        "MAT002",
        "Station totale Leica TS16",
        "Station totale",
        "Leica",
        "TS16",
        "LC-TS16-2022-045",
        new Date(2022, 5, 20),
        new Date(2024, 10, 5),
        new Date(2025, 4, 5),
        "Disponible",
        "",
        38000000,
        "Bon",
        "Station robotisée - précision 1mm"
      ],
      [
        "MAT003",
        "Niveau automatique Sokkia B40",
        "Niveau",
        "Sokkia",
        "B40",
        "SK-B40-2021-103",
        new Date(2021, 2, 10),
        new Date(2024, 7, 15),
        new Date(2025, 1, 15),
        "En utilisation",
        "EQ002",
        2500000,
        "Moyen",
        "Niveau optique chantier"
      ],
      [
        "MAT004",
        "Drone DJI Phantom 4 RTK",
        "Drone",
        "DJI",
        "Phantom 4 RTK",
        "DJI-P4RTK-2023-012",
        new Date(2023, 4, 1),
        new Date(2024, 9, 20),
        new Date(2025, 3, 20),
        "En utilisation",
        "EQ003",
        15000000,
        "Bon",
        "Drone photogrammétrie - module RTK"
      ],
      [
        "MAT005",
        "Véhicule Toyota Hilux 4x4",
        "Véhicule",
        "Toyota",
        "Hilux 2.8 D4D",
        "TOY-HIL-2022-YDE-789",
        new Date(2022, 10, 15),
        new Date(2024, 10, 1),
        new Date(2025, 4, 1),
        "En utilisation",
        "EQ001",
        25000000,
        "Bon",
        "Véhicule terrain équipe Nord"
      ],
      [
        "MAT006",
        "Théodolite Wild T2",
        "Station totale",
        "Wild",
        "T2",
        "WLD-T2-1998-056",
        new Date(2018, 8, 10),
        new Date(2024, 6, 12),
        new Date(2025, 0, 12),
        "Hors service",
        "",
        500000,
        "Mauvais",
        "Matériel obsolète - à remplacer"
      ],
      [
        "MAT007",
        "GPS Garmin eTrex 32x",
        "GPS RTK",
        "Garmin",
        "eTrex 32x",
        "GAR-32X-2023-078",
        new Date(2023, 6, 5),
        new Date(2024, 11, 1),
        new Date(2025, 5, 1),
        "Disponible",
        "",
        450000,
        "Bon",
        "GPS navigation terrain"
      ],
      [
        "MAT008",
        "Scanner laser Leica RTC360",
        "Station totale",
        "Leica",
        "RTC360",
        "LC-RTC360-2024-001",
        new Date(2024, 0, 10),
        new Date(2024, 10, 15),
        new Date(2025, 4, 15),
        "Disponible",
        "",
        85000000,
        "Excellent",
        "Scanner 3D dernière génération"
      ],
      [
        "MAT009",
        "Mire télescopique 5m",
        "Niveau",
        "Nedo",
        "mEssfix-S",
        "NED-MIRE-2020-125",
        new Date(2020, 3, 20),
        new Date(2024, 5, 10),
        new Date(2024, 11, 10),
        "Maintenance",
        "",
        180000,
        "Moyen",
        "Mire en révision - peinture écaillée"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // MaterielID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 12; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"MAT"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes G, H, I)
    sheet.getRange("G3:I100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Valeur (colonne L)
    sheet.getRange("L3:L100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // ===== FORMULES AVANCÉES =====

    // Âge du matériel (années)
    sheet.insertColumnAfter(7);
    sheet.getRange("H2").setValue("Âge (ans)");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`H${i}`).setFormula(
        `=SI(G${i}<>"";DATEDIF(G${i};AUJOURDHUI();"Y");"")`
      );
    }
    sheet.getRange("H3:H100").setNumberFormat('0" ans"');
    sheet.hideColumns(8);

    // Jours depuis dernier entretien
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Jours Depuis Entretien");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`I${i}`).setFormula(
        `=SI(I${i}<>"";AUJOURDHUI()-I${i};"")`
      );
    }
    sheet.getRange("I3:I100").setNumberFormat("0");
    sheet.hideColumns(9);

    // Jours avant prochain entretien
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Jours Avant Entretien");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(K${i}<>"";K${i}-AUJOURDHUI();"")`
      );
    }
    sheet.getRange("J3:J100").setNumberFormat("0");
    sheet.hideColumns(10);

    // Alerte maintenance (colonne cachée)
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Alerte Maintenance");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(J${i}<>"";SI(J${i}<0;"URGENT";SI(J${i}<30;"PROCHE";"OK"));"N/A")`
      );
    }
    sheet.hideColumns(11);

    // Fréquence entretien (mois) selon type
    sheet.insertColumnAfter(11);
    sheet.getRange("L2").setValue("Fréq. Entretien");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`L${i}`).setFormula(
        `=SI(D${i}="GPS RTK";6;SI(D${i}="Station totale";6;SI(D${i}="Drone";3;SI(D${i}="Véhicule";6;SI(D${i}="Niveau";12;12)))))`
      );
    }
    sheet.getRange("L3:L100").setNumberFormat('0" mois"');
    sheet.hideColumns(12);

    // Nom de l'équipe affectée
    sheet.insertColumnAfter(12);
    sheet.getRange("M2").setValue("Nom Équipe");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`M${i}`).setFormula(
        `=SI(N${i}<>"";RECHERCHEV(N${i};'👥 Équipes'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(13);

    // Valeur amortie (dépréciation 10% par an)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Valeur Amortie");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(ET(O${i}>0;H${i}>0);O${i}*PUISSANCE(0.9;H${i});O${i})`
      );
    }
    sheet.getRange("N3:N100").setNumberFormat('#,##0" FCFA"');
    sheet.hideColumns(14);

    // Taux utilisation (colonne cachée)
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Taux Utilisation");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(M${i}="En utilisation";1;SI(M${i}="Disponible";0;SI(M${i}="Maintenance";0.5;0)))`
      );
    }
    sheet.getRange("O3:O100").setNumberFormat("0%");
    sheet.hideColumns(15);

    // ===== VALIDATION DES DONNÉES =====

    // Type de matériel
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "GPS RTK",
        "Station totale",
        "Niveau",
        "Drone",
        "Véhicule",
        "Théodolite",
        "Scanner laser",
        "Logiciel",
        "Accessoire"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type de matériel")
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleType);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Disponible",
        "En utilisation",
        "Maintenance",
        "Hors service",
        "En réparation",
        "Perdu",
        "Volé"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut du matériel")
      .build();
    sheet.getRange("M3:M100").setDataValidation(regleStatut);

    // État
    const regleEtat = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Excellent",
        "Bon",
        "Moyen",
        "Mauvais",
        "Hors d'usage"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez l'état physique du matériel")
      .build();
    sheet.getRange("P3:P100").setDataValidation(regleEtat);

    // Affecté à - Liste déroulante depuis Équipes
    const regleEquipe = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("👥 Équipes").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez une équipe (optionnel)")
      .build();
    sheet.getRange("N3:N100").setDataValidation(regleEquipe);

    // Valeur (nombre positif)
    const regleValeur = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez la valeur en FCFA")
      .build();
    sheet.getRange("O3:O100").setDataValidation(regleValeur);

    // Dates
    const regleDate = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText("Entrez une date valide")
      .build();
    sheet.getRange("G3:K100").setDataValidation(regleDate);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut - Disponible (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Disponible")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Statut - En utilisation (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En utilisation")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Statut - Maintenance (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Maintenance")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Statut - Hors service (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Hors service")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Statut - En réparation (Violet)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En réparation")
      .setBackground("#9c27b0")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Statut - Perdu/Volé (Gris foncé)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Perdu")
      .setBackground("#5f6368")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Volé")
      .setBackground("#5f6368")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // État - Couleurs selon condition
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Excellent")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Bon")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Moyen")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Mauvais")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Hors d'usage")
      .setBackground("#5f6368")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    // Alerte maintenance - Couleurs selon urgence
    // URGENT (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=K3="URGENT"')
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // PROCHE (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=K3="PROCHE"')
      .setBackground("#fef7e0")
      .setFontColor("#b45309")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // OK (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=K3="OK"')
      .setBackground("#e6f4ea")
      .setFontColor("#137333")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Types de matériel - Couleurs différenciées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("GPS RTK")
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Station totale")
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Drone")
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Véhicule")
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:N${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DU PARC MATÉRIEL")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Matériel total", '=NB.SI(B3:B100;"<>"")', "Équipements enregistrés"],
      ["Matériel disponible", '=NB.SI(M3:M100;"Disponible")', "Prêt à l'utilisation"],
      ["Matériel en utilisation", '=NB.SI(M3:M100;"En utilisation")', "Actuellement affecté"],
      ["Matériel en maintenance", '=NB.SI(M3:M100;"Maintenance")', "En entretien"],
      ["Matériel hors service", '=NB.SI(M3:M100;"Hors service")', "Non opérationnel"],
      ["GPS RTK", '=NB.SI(C3:C100;"GPS RTK")', "Récepteurs GPS"],
      ["Stations totales", '=NB.SI(C3:C100;"Station totale")', "Stations et théodolites"],
      ["Drones", '=NB.SI(C3:C100;"Drone")', "Drones topographiques"],
      ["Véhicules", '=NB.SI(C3:C100;"Véhicule")', "Parc véhicules"],
      ["Valeur totale parc", '=SOMME(O3:O100)', "Valeur d'acquisition totale"],
      ["Valeur amortie", '=SOMME(N3:N100)', "Valeur comptable actuelle"],
      ["Dépréciation totale", '=SOMME(O3:O100)-SOMME(N3:N100)', "Perte de valeur"],
      ["Taux dépréciation", '=1-(SOMME(N3:N100)/SOMME(O3:O100))', "% de dépréciation"],
      ["Âge moyen parc", '=MOYENNE(H3:H100)', "Ancienneté moyenne"],
      ["Taux utilisation", '=NB.SI(M3:M100;"En utilisation")/NB.SI(B3:B100;"<>"")', "% matériel utilisé"],
      ["Alertes maintenance urgentes", '=NB.SI(K3:K100;"URGENT")', "Entretiens en retard"],
      ["Alertes maintenance proches", '=NB.SI(K3:K100;"PROCHE")', "Entretiens à prévoir <30j"],
      ["Matériel état excellent/bon", '=NB.SI(P3:P100;"Excellent")+NB.SI(P3:P100;"Bon")', "Bon état général"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 11, 2, 3, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 14, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 15, 2).setNumberFormat('0.0" ans"');
    sheet.getRange(statsRow + 16, 2).setNumberFormat("0.0%");

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

    // ===== GRAPHIQUES ET ANALYSES =====

    // Graphique 1: Répartition par statut
    const chartStatut = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("M2:M100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition du Matériel par Statut')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#4285f4', '#fbbc04', '#ea4335', '#9c27b0', '#5f6368'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Répartition par type
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("C2:C100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Inventaire par Type de Matériel')
      .setOption('width', 650)
      .setOption('height', 300)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Quantité', format: '0'})
      .setOption('hAxis', {title: 'Type', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartType);

    // Graphique 3: Valeur par type de matériel
    const chartValeur = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("C2:C100"))
      .addRange(sheet.getRange("O2:O100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Valeur du Parc par Type')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Valeur (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Type', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartValeur);

    // Graphique 4: État du matériel
    const chartEtat = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("P2:P100"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'État Général du Parc')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#4285f4', '#fbbc04', '#ea4335', '#5f6368'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartEtat);

    // ===== TABLEAU RÉCAPITULATIF PAR TYPE =====
    const recapRow = statsRow + kpis.length + 35;

    sheet.getRange(`A${recapRow}:G${recapRow}`).merge()
      .setValue("📋 RÉCAPITULATIF PAR TYPE DE MATÉRIEL")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["Type", "Quantité", "Disponible", "En Utilisation", "Valeur Totale", "Âge Moyen", "Taux Utilisation"];
    sheet.getRange(recapRow + 1, 1, 1, 7).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Données récapitulatives
    const types = ["GPS RTK", "Station totale", "Niveau", "Drone", "Véhicule"];
    const recapData = [];

    types.forEach((type, idx) => {
      const row = recapRow + 2 + idx;
      recapData.push([
        type,
        `=NB.SI(C3:C100;"${type}")`,
        `=NB.SI.ENS(C3:C100;"${type}";M3:M100;"Disponible")`,
        `=NB.SI.ENS(C3:C100;"${type}";M3:M100;"En utilisation")`,
        `=SOMME.SI(C3:C100;"${type}";O3:O100)`,
        `=MOYENNE.SI(C3:C100;"${type}";H3:H100)`,
        `=NB.SI.ENS(C3:C100;"${type}";M3:M100;"En utilisation")/NB.SI(C3:C100;"${type}")`
      ]);
    });

    sheet.getRange(recapRow + 2, 1, types.length, 7).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 5, types.length, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(recapRow + 2, 6, types.length, 1).setNumberFormat('0.0" ans"');
    sheet.getRange(recapRow + 2, 7, types.length, 1).setNumberFormat("0.0%");

    // Bordures
    sheet.getRange(recapRow + 1, 1, types.length + 1, 7).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== TABLEAU ALERTES MAINTENANCE =====
    const alerteRow = recapRow + types.length + 4;

    sheet.getRange(`A${alerteRow}:E${alerteRow}`).merge()
      .setValue("⚠️ ALERTES MAINTENANCE - ACTIONS REQUISES")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#ea4335")
      .setFontColor("#ffffff");

    const headersAlerte = ["MaterielID", "Nom", "Dernier Entretien", "Prochain Entretien", "Statut Alerte"];
    sheet.getRange(alerteRow + 1, 1, 1, 5).setValues([headersAlerte])
      .setFontWeight("bold")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setHorizontalAlignment("center");

    // Note: Les données seront filtrées dynamiquement depuis la table principale
    sheet.getRange(alerteRow + 2, 1, 1, 5).setValues([[
      "Utilisez un filtre pour afficher les matériels avec alerte URGENT ou PROCHE",
      "", "", "", ""
    ]]);

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Matériel protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:Q100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module MATERIEL initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module MATERIEL: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau matériel
 */
function ajouterMateriel(nom, type, marque, modele, numeroSerie, dateAcquisition, valeur, etat) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔧 Matériel");

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    // Calculer date prochain entretien selon type
    const dateProchainEntretien = new Date(dateAcquisition);
    const moisEntretien = type === "Drone" ? 3 : 6;
    dateProchainEntretien.setMonth(dateProchainEntretien.getMonth() + moisEntretien);

    const nouvelleLigne = [
      "",  // MaterielID auto-généré
      nom,
      type,
      marque,
      modele,
      numeroSerie,
      new Date(dateAcquisition),
      "",  // Dernier entretien vide
      dateProchainEntretien,
      "Disponible",
      "",  // Affecté à vide
      parseFloat(valeur),
      etat,
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("MATERIEL", `Nouveau matériel enregistré: ${nom} (${type})`);
    }

    return {success: true, message: "Matériel ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout matériel: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un matériel existant
 */
function modifierMateriel(materielId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔧 Matériel");

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver le matériel
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === materielId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Matériel non trouvé: " + materielId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "nom": 2,
      "type": 3,
      "marque": 4,
      "modele": 5,
      "numeroSerie": 6,
      "dateAcquisition": 7,
      "dateDernierEntretien": 8,
      "prochainEntretien": 9,
      "statut": 10,
      "affecteA": 11,
      "valeur": 12,
      "etat": 13,
      "observations": 14
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("MATERIEL", `Matériel ${materielId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Matériel modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification matériel: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affecte du matériel à une équipe
 */
function affecterMateriel(materielId, equipeId) {
  try {
    const resultat1 = modifierMateriel(materielId, "affecteA", equipeId);
    if (!resultat1.success) return resultat1;

    const resultat2 = modifierMateriel(materielId, "statut", "En utilisation");

    if (typeof journaliserAction === 'function') {
      journaliserAction("MATERIEL", `Matériel ${materielId} affecté à équipe ${equipeId}`);
    }

    return {success: true, message: "Matériel affecté avec succès"};

  } catch (error) {
    Logger.log("Erreur affectation matériel: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Libère du matériel (retour de mission)
 */
function libererMateriel(materielId) {
  try {
    const resultat1 = modifierMateriel(materielId, "affecteA", "");
    if (!resultat1.success) return resultat1;

    const resultat2 = modifierMateriel(materielId, "statut", "Disponible");

    if (typeof journaliserAction === 'function') {
      journaliserAction("MATERIEL", `Matériel ${materielId} libéré`);
    }

    return {success: true, message: "Matériel libéré avec succès"};

  } catch (error) {
    Logger.log("Erreur libération matériel: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Enregistre un entretien
 */
function enregistrerEntretien(materielId, dateEntretien, prochainEntretien, observations) {
  try {
    const resultat1 = modifierMateriel(materielId, "dateDernierEntretien", new Date(dateEntretien));
    if (!resultat1.success) return resultat1;

    const resultat2 = modifierMateriel(materielId, "prochainEntretien", new Date(prochainEntretien));
    if (!resultat2.success) return resultat2;

    if (observations) {
      modifierMateriel(materielId, "observations", observations);
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("MATERIEL", `Entretien effectué: ${materielId}`);
    }

    return {success: true, message: "Entretien enregistré avec succès"};

  } catch (error) {
    Logger.log("Erreur enregistrement entretien: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient le matériel disponible
 */
function obtenirMaterielDisponible() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔧 Matériel");

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const materiel = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][9] === "Disponible") {
        materiel.push({
          id: data[i][0],
          nom: data[i][1],
          type: data[i][2],
          marque: data[i][3],
          modele: data[i][4],
          etat: data[i][12]
        });
      }
    }

    return {success: true, materiel: materiel};

  } catch (error) {
    Logger.log("Erreur obtention matériel disponible: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les alertes maintenance
 */
function obtenirAlertesMaintenance() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔧 Matériel");

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const alertes = {
      urgentes: [],
      proches: []
    };

    for (let i = 2; i < data.length; i++) {
      if (!data[i][1]) continue;

      const prochainEntretien = new Date(data[i][8]);
      const maintenant = new Date();
      const joursRestants = Math.floor((prochainEntretien - maintenant) / (1000 * 60 * 60 * 24));

      if (joursRestants < 0) {
        alertes.urgentes.push({
          id: data[i][0],
          nom: data[i][1],
          type: data[i][2],
          joursRetard: Math.abs(joursRestants),
          prochainEntretien: prochainEntretien
        });
      } else if (joursRestants < 30) {
        alertes.proches.push({
          id: data[i][0],
          nom: data[i][1],
          type: data[i][2],
          joursRestants: joursRestants,
          prochainEntretien: prochainEntretien
        });
      }
    }

    return {
      success: true,
      alertesUrgentes: alertes.urgentes,
      alertesProches: alertes.proches,
      totalUrgentes: alertes.urgentes.length,
      totalProches: alertes.proches.length
    };

  } catch (error) {
    Logger.log("Erreur obtention alertes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient le matériel affecté à une équipe
 */
function obtenirMaterielParEquipe(equipeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔧 Matériel");

    if (!sheet) {
      throw new Error("La feuille Matériel n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const materiel = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][10] === equipeId && data[i][1]) {
        materiel.push({
          id: data[i][0],
          nom: data[i][1],
          type: data[i][2],
          statut: data[i][9],
          etat: data[i][12]
        });
      }
    }

    return {success: true, materiel: materiel, count: materiel.length};

  } catch (error) {
    Logger.log("Erreur obtention matériel par équipe: " + error);
    return {success: false, message: error.message};
  }
}
