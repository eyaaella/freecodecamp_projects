/**
 * MODULE CONTROLEUR - Référentiel Contrôleurs Externes
 * Gestion des contrôleurs techniques et de leurs prestations
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE CONTROLEUR ====================

/**
 * Initialise le module CONTROLEUR avec toutes les fonctionnalités
 */
function initialiserControleur() {
  try {
    Logger.log("✓ Initialisation du module CONTROLEUR...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("✓ Contrôleurs");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("✓ Contrôleurs");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:M1").merge()
      .setValue("✓ RÉFÉRENTIEL CONTRÔLEURS EXTERNES - SUIVI PRESTATIONS CONTRÔLE TECHNIQUE")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#0d652d")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "ControleurID",
      "Nom",
      "Prenom",
      "Specialite",
      "Organisme",
      "Contact",
      "Email",
      "NombreControles",
      "DateDernierControle",
      "Statut",
      "Certifications",
      "Zone",
      "Observations"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#0b5424")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [120, 150, 150, 180, 220, 150, 220, 120, 150, 120, 280, 150, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "CTRL001",
        "Atangana",
        "François",
        "Génie civil",
        "Bureau Veritas Cameroun",
        "+237 6 99 88 77 66",
        "f.atangana@bureauveritas.cm",
        24,
        new Date(2025, 10, 12),
        "Actif",
        "Ingénieur Contrôle Technique BTP, Certif. ISO 9001",
        "Centre, Littoral",
        "Expert béton et structures"
      ],
      [
        "CTRL002",
        "Nguimfack",
        "Marie",
        "Topographie",
        "Cabinet GEOTOPO Sarl",
        "+237 6 77 55 44 33",
        "m.nguimfack@geotopo.cm",
        18,
        new Date(2025, 10, 8),
        "Actif",
        "Géomètre-Expert, Licence Topographie",
        "Ouest, Nord-Ouest",
        "Spécialiste levés GPS RTK"
      ],
      [
        "CTRL003",
        "Essomba",
        "Jean-Pierre",
        "Irrigation",
        "SOGREAH Consultants",
        "+237 6 88 99 00 11",
        "jp.essomba@sogreah.cm",
        32,
        new Date(2025, 10, 14),
        "Actif",
        "Ingénieur Hydraulique, Expert Irrigation Gravitaire",
        "Nord, Extrême-Nord",
        "15 ans expérience aménagements hydro-agricoles"
      ],
      [
        "CTRL004",
        "Kom",
        "Elisabeth",
        "Environnement",
        "Green Impact Studies",
        "+237 6 55 66 77 88",
        "e.kom@greenimpact.cm",
        12,
        new Date(2025, 9, 28),
        "Actif",
        "Master Environnement, Certif. Études Impact",
        "Toutes zones",
        "Études impact environnemental et social"
      ],
      [
        "CTRL005",
        "Fomba",
        "André",
        "Génie civil",
        "SCET Cameroun",
        "+237 6 44 33 22 11",
        "a.fomba@scet.cm",
        45,
        new Date(2025, 10, 10),
        "Actif",
        "Ingénieur Travaux Publics, Cert. Chef de Mission Contrôle",
        "Centre, Sud",
        "Contrôles ouvrages d'art"
      ],
      [
        "CTRL006",
        "Moukouri",
        "Patrick",
        "Topographie",
        "TOPO Services Sarl",
        "+237 6 22 11 00 99",
        "p.moukouri@toposervices.cm",
        7,
        new Date(2025, 10, 5),
        "Suspendu",
        "BTS Géomètre-Topographe",
        "Littoral",
        "Suspendu - problème certification"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // ControleurID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 9; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"CTRL"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // DateDernierControle (colonne I)
    sheet.getRange("I3:I100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Nom complet
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Nom Complet");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(ET(B${i}<>"";C${i}<>"");CONCATENER(B${i};" ";C${i});"")`
      );
    }
    sheet.hideColumns(14);

    // Jours depuis dernier contrôle
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Jours Inactivité");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(I${i}<>"";AUJOURDHUI()-I${i};"")`
      );
    }
    sheet.getRange("O3:O100").setNumberFormat('0" jours"');
    sheet.hideColumns(15);

    // Niveau activité
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Activité");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(H${i}="";"Nouveau";SI(H${i}>=30;"Très actif";SI(H${i}>=15;"Actif";SI(H${i}>=5;"Modéré";"Faible"))))`
      );
    }
    sheet.hideColumns(16);

    // Moyenne contrôles par mois (estimée)
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Contrôles/Mois");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(I${i}<>"";H${i}/(DATEDIF(I${i}-365;AUJOURDHUI();"M")+1);"")`
      );
    }
    sheet.getRange("Q3:Q100").setNumberFormat('0.0" /mois"');
    sheet.hideColumns(17);

    // Email valide
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Email Valide");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(G${i}="";FAUX;ET(TROUVE("@";G${i})>0;TROUVE(".";G${i})>TROUVE("@";G${i})))`
      );
    }
    sheet.hideColumns(18);

    // Téléphone valide Cameroun
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Tél Valide");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(F${i}="";FAUX;ET(GAUCHE(F${i};4)="+237";NBCAR(SUBSTITUE(F${i};" ";""))>=12))`
      );
    }
    sheet.hideColumns(19);

    // Disponibilité (basée sur inactivité)
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Disponibilité");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(J${i}<>"Actif";"Indisponible";SI(O${i}="";"Disponible";SI(O${i}>30;"Disponible";SI(O${i}>14;"Probablement disponible";"Occupé"))))`
      );
    }
    sheet.hideColumns(20);

    // Nombre de certifications
    sheet.insertColumnAfter(20);
    sheet.getRange("U2").setValue("Nb Certifications");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`U${i}`).setFormula(
        `=SI(K${i}="";0;NBCAR(K${i})-NBCAR(SUBSTITUE(K${i};",";""))+1)`
      );
    }
    sheet.hideColumns(21);

    // Score qualité (basé sur nb contrôles et certifications)
    sheet.insertColumnAfter(21);
    sheet.getRange("V2").setValue("Score Qualité");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`V${i}`).setFormula(
        `=SI(B${i}="";0;MIN(100;H${i}*2+U${i}*10))`
      );
    }
    sheet.getRange("V3:V100").setNumberFormat('0"/100"');
    sheet.hideColumns(22);

    // ===== VALIDATION DES DONNÉES =====

    // Specialite - Liste des spécialités
    const regleSpecialite = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Génie civil",
        "Topographie",
        "Irrigation",
        "Environnement",
        "Géotechnique",
        "Hydraulique",
        "Structures",
        "Routes",
        "Qualité"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la spécialité principale")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleSpecialite);

    // Contact - Format Cameroun +237
    const regleTelephone = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(GAUCHE(F3;4)="+237";NBCAR(SUBSTITUE(F3;" ";""))>=12)')
      .setAllowInvalid(false)
      .setHelpText("Format: +237 6 XX XX XX XX (obligatoire)")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleTelephone);

    // Email - Format email
    const regleEmail = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(TROUVE("@";G3)>0;TROUVE(".";G3)>TROUVE("@";G3))')
      .setAllowInvalid(false)
      .setHelpText("Entrez un email valide")
      .build();
    sheet.getRange("G3:G100").setDataValidation(regleEmail);

    // NombreControles - Nombre positif
    const regleNombre = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Nombre de contrôles effectués (≥0)")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleNombre);

    // Statut - Liste des statuts
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "Suspendu", "Inactif", "Retraité"], true)
      .setAllowInvalid(false)
      .setHelpText("Statut du contrôleur")
      .build();
    sheet.getRange("J3:J100").setDataValidation(regleStatut);

    // Zone - Liste des régions
    const regleZone = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Centre",
        "Littoral",
        "Ouest",
        "Nord-Ouest",
        "Sud-Ouest",
        "Nord",
        "Extrême-Nord",
        "Adamaoua",
        "Est",
        "Sud",
        "Toutes zones"
      ], true)
      .setAllowInvalid(true)
      .setHelpText("Zone(s) d'intervention (séparées par virgule si plusieurs)")
      .build();
    sheet.getRange("L3:L100").setDataValidation(regleZone);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut - Actif (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Actif")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Statut - Suspendu (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Suspendu")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Statut - Inactif (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Inactif")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Activité - Très actif (Vert foncé)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(30)
      .setBackground("#0d652d")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Activité - Actif (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(15, 29)
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Activité - Modéré (Jaune)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(5, 14)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Activité - Faible (Orange clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(5)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Inactivité longue (> 90 jours)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$O3>90')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Email invalide
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=NON(R3)')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    // Téléphone invalide
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=NON(S3)')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:M${statsRow}`).merge()
      .setValue("📊 STATISTIQUES CONTRÔLEURS ET ANALYSES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#0b5424")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Contrôleurs totaux", '=NB.SI(B3:B100;"<>"")', "Nombre total de contrôleurs"],
      ["Actifs", '=NB.SI(J3:J100;"Actif")', "Contrôleurs disponibles"],
      ["Suspendus", '=NB.SI(J3:J100;"Suspendu")', "Suspensions temporaires"],
      ["Inactifs", '=NB.SI(J3:J100;"Inactif")', "Non disponibles"],
      ["Génie civil", '=NB.SI(D3:D100;"Génie civil")', "Spécialité génie civil"],
      ["Topographie", '=NB.SI(D3:D100;"Topographie")', "Spécialité topographie"],
      ["Irrigation", '=NB.SI(D3:D100;"Irrigation")', "Spécialité irrigation"],
      ["Environnement", '=NB.SI(D3:D100;"Environnement")', "Spécialité environnement"],
      ["Contrôles totaux", '=SOMME(H3:H100)', "Total contrôles effectués"],
      ["Moyenne contrôles/contrôleur", '=MOYENNE(H3:H100)', "Moyenne par contrôleur"],
      ["Très actifs (≥30)", '=NB.SI(H3:H100;">=30")', "Contrôleurs très sollicités"],
      ["Disponibles", '=NB.SI(T3:T100;"Disponible")', "Contrôleurs disponibles"],
      ["Score qualité moyen", '=MOYENNE(V3:V100)', "Score moyen sur 100"],
      ["Emails valides", '=NB.SI(R3:R100;VRAI)/NB.SI(B3:B100;"<>"")', "% emails correctement formatés"],
      ["Téléphones valides", '=NB.SI(S3:S100;VRAI)/NB.SI(B3:B100;"<>"")', "% téléphones format Cameroun"],
      ["Inactifs >90j", '=NB.SI(O3:O100;">90")', "Contrôleurs sans activité longue durée"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#0d652d")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 11, 2).setNumberFormat("0.0");
    sheet.getRange(statsRow + 14, 2).setNumberFormat('0"/100"');
    sheet.getRange(statsRow + 15, 2, 2, 1).setNumberFormat("0.0%");

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

    // Graphique 1: Répartition par spécialité
    const chartSpecialite = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("D2:D100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition par Spécialité')
      .setOption('width', 550)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#0d652d', '#34a853', '#81c995', '#a8dab5', '#c6e8d0', '#e6f4ea'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 10}})
      .build();

    sheet.insertChart(chartSpecialite);

    // Graphique 2: Statut des contrôleurs
    const chartStatut = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("J2:J100"))
      .setPosition(statsRow + kpis.length + 2, 8, 0, 0)
      .setOption('title', 'Statut des Contrôleurs')
      .setOption('width', 450)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#fbbc04', '#9aa0a6', '#e8eaed'])
      .setOption('pieSliceText', 'percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 3: Nombre de contrôles par contrôleur
    const chartControles = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("N2:N100"))
      .addRange(sheet.getRange("H2:H100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Nombre de Contrôles par Contrôleur')
      .setOption('width', 750)
      .setOption('height', 400)
      .setOption('colors', ['#0d652d'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre de contrôles', format: '0'})
      .setOption('hAxis', {title: 'Contrôleur', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '80%', height: '70%'})
      .build();

    sheet.insertChart(chartControles);

    // Graphique 4: Score qualité
    const chartQualite = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("N2:N100"))
      .addRange(sheet.getRange("V2:V100"))
      .setPosition(statsRow + kpis.length + 17, 11, 0, 0)
      .setOption('title', 'Score Qualité par Contrôleur')
      .setOption('width', 650)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Score (/100)', format: '0', viewWindow: {min: 0, max: 100}})
      .setOption('hAxis', {title: 'Contrôleur', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartQualite);

    // ===== TABLEAU RÉCAPITULATIF PAR SPÉCIALITÉ =====
    const recapRow = statsRow + kpis.length + 43;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📋 ANALYSE PAR SPÉCIALITÉ")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#0b5424")
      .setFontColor("#ffffff");

    const headersRecap = ["Spécialité", "Effectif", "% Total", "Actifs", "Contrôles Moy.", "Disponibles", "Score Moy.", "Taux Disponibilité"];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#0d652d")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Données récapitulatives
    const specialites = ["Génie civil", "Topographie", "Irrigation", "Environnement", "Géotechnique"];
    const recapData = [];

    specialites.forEach((spec, idx) => {
      recapData.push([
        spec,
        `=NB.SI(D3:D100;"${spec}")`,
        `=NB.SI(D3:D100;"${spec}")/NB.SI(B3:B100;"<>""")`,
        `=NB.SI.ENS(D3:D100;"${spec}";J3:J100;"Actif")`,
        `=MOYENNE.SI(D3:D100;"${spec}";H3:H100)`,
        `=NB.SI.ENS(D3:D100;"${spec}";T3:T100;"Disponible")`,
        `=MOYENNE.SI(D3:D100;"${spec}";V3:V100)`,
        `=NB.SI.ENS(D3:D100;"${spec}";T3:T100;"Disponible")/NB.SI(D3:D100;"${spec}")`
      ]);
    });

    sheet.getRange(recapRow + 2, 1, specialites.length, 8).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 3, specialites.length, 1).setNumberFormat("0.0%");
    sheet.getRange(recapRow + 2, 5, specialites.length, 1).setNumberFormat("0.0");
    sheet.getRange(recapRow + 2, 7, specialites.length, 1).setNumberFormat('0"/100"');
    sheet.getRange(recapRow + 2, 8, specialites.length, 1).setNumberFormat("0.0%");

    // Bordures
    sheet.getRange(recapRow + 1, 1, specialites.length + 1, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== TABLEAU CONTRÔLEURS DISPONIBLES =====
    const dispoRow = recapRow + specialites.length + 4;

    sheet.getRange(`A${dispoRow}:H${dispoRow}`).merge()
      .setValue("✓ CONTRÔLEURS DISPONIBLES - PRÊTS POUR MISSIONS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#34a853")
      .setFontColor("#ffffff");

    const headersDispo = ["Nom Complet", "Spécialité", "Organisme", "Contact", "Zone", "Nb Contrôles", "Score", "Dernière Mission"];
    sheet.getRange(dispoRow + 1, 1, 1, 8).setValues([headersDispo])
      .setFontWeight("bold")
      .setBackground("#0d652d")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Afficher les contrôleurs disponibles (à implémenter avec filtres)
    sheet.getRange(dispoRow + 2, 1, 1, 8).merge()
      .setValue("Contrôleurs avec statut Actif et disponibilité élevée")
      .setFontSize(9)
      .setFontStyle("italic")
      .setBackground("#e6f4ea");

    // Bordures
    sheet.getRange(dispoRow + 1, 1, 2, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== HISTORIQUE PRESTATIONS PAR CONTRÔLEUR =====
    const histoRow = dispoRow + 15;

    sheet.getRange(`A${histoRow}:F${histoRow}`).merge()
      .setValue("📊 HISTORIQUE PRESTATIONS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersHisto = ["Contrôleur", "Période", "Nb Contrôles", "Projets", "Taux Conformité", "Observations"];
    sheet.getRange(histoRow + 1, 1, 1, 6).setValues([headersHisto])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(histoRow + 2, 1, 1, 6).merge()
      .setValue("Détail des prestations par contrôleur - Croisement avec module Documents")
      .setFontSize(9)
      .setFontStyle("italic")
      .setBackground("#e8f0fe");

    // Bordures
    sheet.getRange(histoRow + 1, 1, 2, 6).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Contrôleurs protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:M100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module CONTROLEUR initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module CONTROLEUR: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau contrôleur
 */
function ajouterControleur(nom, prenom, specialite, organisme, contact, email, certifications, zone) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✓ Contrôleurs");

    if (!sheet) {
      throw new Error("La feuille Contrôleurs n'existe pas");
    }

    // Validation email
    if (!email.includes("@") || !email.includes(".")) {
      throw new Error("Email invalide");
    }

    // Validation téléphone Cameroun
    if (!contact.startsWith("+237")) {
      throw new Error("Le téléphone doit commencer par +237");
    }

    const nouvelleLigne = [
      "",  // ControleurID auto-généré
      nom,
      prenom,
      specialite,
      organisme,
      contact,
      email,
      0,  // NombreControles initial
      "",  // DateDernierControle - vide
      "Actif",  // Statut par défaut
      certifications,
      zone,
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "CONTROLEUR", `Contrôleur ajouté: ${nom} ${prenom} (${specialite})`);
    }

    return {success: true, message: "Contrôleur ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout contrôleur: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Enregistre un contrôle effectué par un contrôleur
 */
function enregistrerControle(controleurId, dateControle) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✓ Contrôleurs");

    if (!sheet) {
      throw new Error("La feuille Contrôleurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneControleur = -1;
    let nbControles = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === controleurId) {
        ligneControleur = i + 1;
        nbControles = data[i][7] || 0;
        break;
      }
    }

    if (ligneControleur === -1) {
      throw new Error("Contrôleur non trouvé");
    }

    // Incrémenter le nombre de contrôles
    sheet.getRange(ligneControleur, 8).setValue(nbControles + 1);

    // Mettre à jour la date du dernier contrôle
    sheet.getRange(ligneControleur, 9).setValue(dateControle ? new Date(dateControle) : new Date());

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "CONTROLEUR", `Contrôle enregistré pour ${controleurId}`);
    }

    return {success: true, message: "Contrôle enregistré", totalControles: nbControles + 1};

  } catch (error) {
    Logger.log("Erreur enregistrement contrôle: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les contrôleurs disponibles par spécialité
 */
function obtenirControleursDisponibles(specialite, zone) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✓ Contrôleurs");

    if (!sheet) {
      throw new Error("La feuille Contrôleurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const controleurs = [];

    for (let i = 2; i < data.length; i++) {
      const matchSpecialite = !specialite || data[i][3] === specialite;
      const matchZone = !zone || data[i][11].includes(zone) || data[i][11].includes("Toutes zones");
      const estActif = data[i][9] === "Actif";

      if (matchSpecialite && matchZone && estActif && data[i][1]) {
        // Calculer disponibilité
        let disponibilite = "Disponible";
        if (data[i][8]) {
          const joursDernier = Math.floor((new Date() - new Date(data[i][8])) / (1000 * 60 * 60 * 24));
          if (joursDernier <= 14) {
            disponibilite = "Occupé";
          } else if (joursDernier <= 30) {
            disponibilite = "Probablement disponible";
          }
        }

        controleurs.push({
          id: data[i][0],
          nom: data[i][1] + " " + data[i][2],
          specialite: data[i][3],
          organisme: data[i][4],
          contact: data[i][5],
          email: data[i][6],
          nbControles: data[i][7],
          zone: data[i][11],
          disponibilite: disponibilite
        });
      }
    }

    return {success: true, controleurs: controleurs, count: controleurs.length};

  } catch (error) {
    Logger.log("Erreur obtention contrôleurs: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les statistiques d'un contrôleur
 */
function obtenirStatistiquesControleur(controleurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✓ Contrôleurs");

    if (!sheet) {
      throw new Error("La feuille Contrôleurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === controleurId) {
        const nbControles = data[i][7] || 0;
        const dateDernier = data[i][8];
        let joursDernier = null;
        let moyenneParMois = 0;

        if (dateDernier) {
          joursDernier = Math.floor((new Date() - new Date(dateDernier)) / (1000 * 60 * 60 * 24));
          // Estimation moyenne sur 1 an
          moyenneParMois = nbControles / 12;
        }

        return {
          success: true,
          stats: {
            nom: data[i][1] + " " + data[i][2],
            specialite: data[i][3],
            organisme: data[i][4],
            totalControles: nbControles,
            dateDernierControle: dateDernier,
            joursDernierControle: joursDernier,
            moyenneControlesParMois: moyenneParMois.toFixed(1),
            statut: data[i][9],
            certifications: data[i][10]
          }
        };
      }
    }

    throw new Error("Contrôleur non trouvé");

  } catch (error) {
    Logger.log("Erreur statistiques contrôleur: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie le statut d'un contrôleur
 */
function modifierStatutControleur(controleurId, nouveauStatut, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✓ Contrôleurs");

    if (!sheet) {
      throw new Error("La feuille Contrôleurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneControleur = -1;
    let nomControleur = "";

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === controleurId) {
        ligneControleur = i + 1;
        nomControleur = data[i][1] + " " + data[i][2];
        break;
      }
    }

    if (ligneControleur === -1) {
      throw new Error("Contrôleur non trouvé");
    }

    // Mettre à jour le statut
    sheet.getRange(ligneControleur, 10).setValue(nouveauStatut);

    // Ajouter observations si fournies
    if (observations) {
      sheet.getRange(ligneControleur, 13).setValue(observations);
    }

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "CONTROLEUR", `Statut ${controleurId} modifié: ${nouveauStatut}`);
    }

    // Notifier si suspension
    if (nouveauStatut === "Suspendu" && typeof envoyerNotification === 'function') {
      envoyerNotification(
        "USR001",  // Admin
        `Contrôleur ${nomControleur} suspendu: ${observations}`,
        "Alerte",
        "Haute",
        "CONTROLEUR"
      );
    }

    return {success: true, message: "Statut mis à jour"};

  } catch (error) {
    Logger.log("Erreur modification statut: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les contrôleurs inactifs (sans contrôle depuis X jours)
 */
function obtenirControleursInactifs(joursInactivite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✓ Contrôleurs");

    if (!sheet) {
      throw new Error("La feuille Contrôleurs n'existe pas");
    }

    const seuil = joursInactivite || 90;
    const data = sheet.getDataRange().getValues();
    const inactifs = [];
    const maintenant = new Date();

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][9] === "Actif") {
        if (data[i][8]) {
          const joursDernier = Math.floor((maintenant - new Date(data[i][8])) / (1000 * 60 * 60 * 24));
          if (joursDernier >= seuil) {
            inactifs.push({
              id: data[i][0],
              nom: data[i][1] + " " + data[i][2],
              specialite: data[i][3],
              organisme: data[i][4],
              dateDernierControle: data[i][8],
              joursInactivite: joursDernier,
              contact: data[i][5]
            });
          }
        } else if (data[i][7] === 0) {
          // Jamais effectué de contrôle
          inactifs.push({
            id: data[i][0],
            nom: data[i][1] + " " + data[i][2],
            specialite: data[i][3],
            organisme: data[i][4],
            dateDernierControle: null,
            joursInactivite: "Jamais",
            contact: data[i][5]
          });
        }
      }
    }

    return {success: true, inactifs: inactifs, count: inactifs.length};

  } catch (error) {
    Logger.log("Erreur obtention inactifs: " + error);
    return {success: false, message: error.message};
  }
}
