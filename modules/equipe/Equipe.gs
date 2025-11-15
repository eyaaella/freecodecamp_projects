/**
 * MODULE EQUIPE - Gestion Complète des Équipes Terrain
 * Gestion des équipes topographiques et de construction
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE EQUIPE ====================

/**
 * Initialise le module EQUIPE avec toutes les fonctionnalités
 */
function initialiserEquipe() {
  try {
    Logger.log("👥 Initialisation du module EQUIPE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("👥 Équipes");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("👥 Équipes");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:L1").merge()
      .setValue("👥 GESTION DES ÉQUIPES TERRAIN - ORGANISATION ET COORDINATION")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "EquipeID",
      "Nom Équipe",
      "Chef EquipeID",
      "Nombre Membres",
      "Spécialité",
      "Statut",
      "Date Création",
      "Zone Intervention",
      "Matériel Assigné",
      "ProjetID Actuel",
      "Taux Occupation (%)",
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
    const columnWidths = [100, 200, 120, 120, 180, 120, 110, 180, 250, 120, 130, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "EQ001",
        "Équipe Topographie Nord",
        "EMP002",
        8,
        "Topographie",
        "Actif",
        new Date(2023, 0, 10),
        "Extrême-Nord, Nord",
        "GPS RTK Trimble, Station totale Leica, Véhicule 4x4",
        "PROJ001",
        '=D3/10',
        "Équipe principale levés terrain zone Nord"
      ],
      [
        "EQ002",
        "Équipe Génie Civil Ouest",
        "EMP003",
        12,
        "Génie civil",
        "Actif",
        new Date(2022, 5, 15),
        "Ouest, Littoral",
        "Matériel terrassement, Niveleuses, Compacteurs",
        "PROJ003",
        '=D4/15',
        "Construction ouvrages hydrauliques"
      ],
      [
        "EQ003",
        "Équipe Irrigation Centre",
        "EMP005",
        6,
        "Irrigation",
        "Actif",
        new Date(2023, 8, 1),
        "Centre, Sud",
        "Drone DJI Phantom 4 RTK, GPS, Matériel irrigation",
        "PROJ002",
        '=D5/8',
        "Spécialisation irrigation goutte-à-goutte"
      ],
      [
        "EQ004",
        "Équipe Mixte Sud",
        "EMP001",
        10,
        "Mixte",
        "Actif",
        new Date(2021, 11, 20),
        "Sud, Est",
        "Équipement complet topo + génie civil",
        "PROJ001",
        '=D6/12',
        "Polyvalente: topo et construction"
      ],
      [
        "EQ005",
        "Équipe Maintenance",
        "",
        4,
        "Mixte",
        "En attente",
        new Date(2024, 2, 5),
        "National",
        "Outils maintenance, Véhicule atelier mobile",
        "",
        '=D7/5',
        "Entretien infrastructures existantes"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // EquipeID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"EQ"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Date Création (colonne G)
    sheet.getRange("G3:G100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Taux Occupation (colonne K)
    sheet.getRange("K3:K100")
      .setNumberFormat("0%")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Nom Chef d'Équipe (colonne cachée)
    sheet.insertColumnAfter(3);
    sheet.getRange("D2").setValue("Nom Chef");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`D${i}`).setFormula(
        `=SI(C${i}<>"";RECHERCHEV(C${i};'👤 Employés'!A:M;13;FAUX);"")`
      );
    }
    sheet.hideColumns(4);

    // Capacité Maximale (colonne cachée) - selon spécialité
    sheet.insertColumnAfter(4);
    sheet.getRange("E2").setValue("Capacité Max");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`E${i}`).setFormula(
        `=SI(F${i}="Topographie";10;SI(F${i}="Génie civil";15;SI(F${i}="Irrigation";8;SI(F${i}="Mixte";12;10))))`
      );
    }
    sheet.getRange("E3:E100").setNumberFormat("0");
    sheet.hideColumns(5);

    // Effectif Actuel (depuis table Employés)
    sheet.insertColumnAfter(5);
    sheet.getRange("F2").setValue("Effectif Actuel");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`F${i}`).setFormula(
        `=SI(A${i}<>"";NB.SI.ENS('👤 Employés'!G:G;A${i};'👤 Employés'!K:K;"Actif");0)`
      );
    }
    sheet.getRange("F3:F100").setNumberFormat("0");
    sheet.hideColumns(6);

    // Taux Occupation Réel (depuis effectif actuel)
    sheet.insertColumnAfter(6);
    sheet.getRange("G2").setValue("Taux Occup. Réel");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`G${i}`).setFormula(
        `=SI(E${i}>0;F${i}/E${i};0)`
      );
    }
    sheet.getRange("G3:G100").setNumberFormat("0%");
    sheet.hideColumns(7);

    // Places Disponibles
    sheet.insertColumnAfter(7);
    sheet.getRange("H2").setValue("Places Dispo");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`H${i}`).setFormula(
        `=SI(E${i}>0;E${i}-F${i};0)`
      );
    }
    sheet.getRange("H3:H100").setNumberFormat("0");
    sheet.hideColumns(8);

    // Ancienneté Équipe (jours)
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Ancienneté (j)");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`I${i}`).setFormula(
        `=SI(K${i}<>"";AUJOURDHUI()-K${i};"")`
      );
    }
    sheet.getRange("I3:I100").setNumberFormat("0");
    sheet.hideColumns(9);

    // Nom Projet Actuel
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Nom Projet");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(N${i}<>"";RECHERCHEV(N${i};'📁 Projets'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(10);

    // Statut d'Occupation
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Statut Occup.");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(G${i}>=0.9;"Pleine"`;SI(G${i}>=0.6;"Normale";SI(G${i}>0;"Faible";"Vide")))`
      );
    }
    sheet.hideColumns(11);

    // ===== VALIDATION DES DONNÉES =====

    // Chef EquipeID - Liste déroulante depuis Employés
    const regleChef = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("👤 Employés").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez un employé comme chef d'équipe")
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleChef);

    // Spécialité
    const regleSpecialite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Topographie", "Génie civil", "Irrigation", "Mixte"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la spécialité de l'équipe")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleSpecialite);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "En attente", "Repos", "Maintenance", "Dissous"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut de l'équipe")
      .build();
    sheet.getRange("J3:J100").setDataValidation(regleStatut);

    // Nombre Membres (nombre positif)
    const regleMembres = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(1, 50)
      .setAllowInvalid(false)
      .setHelpText("Nombre de membres: 1-50")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleMembres);

    // ProjetID - Liste déroulante depuis Projets
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("📁 Projets").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez le projet actuel (optionnel)")
      .build();
    sheet.getRange("N3:N100").setDataValidation(regleProjet);

    // Date création (pas future)
    const regleDate = SpreadsheetApp.newDataValidation()
      .requireDateBefore(new Date())
      .setAllowInvalid(false)
      .setHelpText("La date de création ne peut être future")
      .build();
    sheet.getRange("K3:K100").setDataValidation(regleDate);

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

    // Statut - En attente (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En attente")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Statut - Repos (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Repos")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Statut - Maintenance (Violet)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Maintenance")
      .setBackground("#9c27b0")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Statut - Dissous (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Dissous")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Spécialités - Couleurs différenciées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Topographie")
      .setBackground("#e8f0fe")
      .setFontColor("#1a73e8")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Génie civil")
      .setBackground("#e6f4ea")
      .setFontColor("#137333")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Irrigation")
      .setBackground("#fef7e0")
      .setFontColor("#b45309")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Mixte")
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Taux Occupation - Échelle de couleurs
    // < 30% (Rouge clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.3)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // 30-60% (Jaune clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.3, 0.6)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // 60-90% (Vert clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.6, 0.9)
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // > 90% (Bleu clair - pleine capacité)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0.9)
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // Taux Occupation Réel - Échelle de couleurs
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.3)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.3, 0.6)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.6, 0.9)
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0.9)
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:L${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DES ÉQUIPES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total d'équipes", '=NB.SI(B3:B100;"<>"")', "Équipes enregistrées"],
      ["Équipes actives", '=NB.SI(J3:J100;"Actif")', "Équipes en opération"],
      ["Équipes en attente", '=NB.SI(J3:J100;"En attente")', "Équipes disponibles"],
      ["Équipes en repos", '=NB.SI(J3:J100;"Repos")', "Équipes en période de repos"],
      ["Équipes Topographie", '=NB.SI(I3:I100;"Topographie")', "Spécialistes topographie"],
      ["Équipes Génie civil", '=NB.SI(I3:I100;"Génie civil")', "Spécialistes construction"],
      ["Équipes Irrigation", '=NB.SI(I3:I100;"Irrigation")', "Spécialistes irrigation"],
      ["Équipes Mixtes", '=NB.SI(I3:I100;"Mixte")', "Équipes polyvalentes"],
      ["Effectif total", '=SOMME(F3:F100)', "Total membres tous équipes"],
      ["Effectif moyen par équipe", '=MOYENNE(F3:F100)', "Moyenne membres par équipe"],
      ["Taux occupation moyen", '=MOYENNE(G3:G100)', "% occupation moyen"],
      ["Capacité totale", '=SOMME(E3:E100)', "Capacité maximale toutes équipes"],
      ["Places disponibles", '=SOMME(H3:H100)', "Places libres total"],
      ["Équipes pleines (>90%)", '=NB.SI(G3:G100;">0.9")', "Équipes à pleine capacité"],
      ["Équipes sous-utilisées (<30%)", '=NB.SI(G3:G100;"<0.3")', "Équipes sous-effectif"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 11, 2).setNumberFormat('0.0" personnes"');
    sheet.getRange(statsRow + 12, 2).setNumberFormat("0.0%");

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
      .addRange(sheet.getRange("I2:I100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition des Équipes par Spécialité')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#1a73e8', '#34a853', '#fbbc04', '#ea4335'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartSpecialite);

    // Graphique 2: Effectif par équipe
    const chartEffectif = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("F2:F100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Effectif Actuel par Équipe')
      .setOption('width', 650)
      .setOption('height', 300)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre de membres', format: '0'})
      .setOption('hAxis', {title: 'Équipes', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartEffectif);

    // Graphique 3: Taux d'occupation par équipe
    const chartOccupation = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("G2:G100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Taux d\'Occupation par Équipe (%)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Taux (%)', format: '#%', minValue: 0, maxValue: 1})
      .setOption('vAxis', {title: 'Équipes'})
      .setOption('chartArea', {width: '60%', height: '80%'})
      .build();

    sheet.insertChart(chartOccupation);

    // Graphique 4: Statut des équipes
    const chartStatut = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("J2:J100"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'Équipes par Statut')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre', format: '0'})
      .setOption('hAxis', {title: 'Statut', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartStatut);

    // ===== TABLEAU RÉCAPITULATIF PAR SPÉCIALITÉ =====
    const recapRow = statsRow + kpis.length + 35;

    sheet.getRange(`A${recapRow}:G${recapRow}`).merge()
      .setValue("📋 RÉCAPITULATIF PAR SPÉCIALITÉ")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["Spécialité", "Nb Équipes", "Effectif Total", "Capacité Tot.", "Taux Occup.", "Équipes Actives", "Places Dispo"];
    sheet.getRange(recapRow + 1, 1, 1, 7).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Données récapitulatives
    const specialites = ["Topographie", "Génie civil", "Irrigation", "Mixte"];
    const recapData = [];

    specialites.forEach((spec, idx) => {
      const row = recapRow + 2 + idx;
      recapData.push([
        spec,
        `=NB.SI(I3:I100;"${spec}")`,
        `=SOMME.SI(I3:I100;"${spec}";F3:F100)`,
        `=SOMME.SI(I3:I100;"${spec}";E3:E100)`,
        `=SOMME.SI(I3:I100;"${spec}";F3:F100)/SOMME.SI(I3:I100;"${spec}";E3:E100)`,
        `=NB.SI.ENS(I3:I100;"${spec}";J3:J100;"Actif")`,
        `=SOMME.SI(I3:I100;"${spec}";H3:H100)`
      ]);
    });

    sheet.getRange(recapRow + 2, 1, specialites.length, 7).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 5, specialites.length, 1).setNumberFormat("0.0%");

    // Bordures
    sheet.getRange(recapRow + 1, 1, specialites.length + 1, 7).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Équipes protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:P100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module EQUIPE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module EQUIPE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute une nouvelle équipe
 */
function ajouterEquipe(nomEquipe, chefEquipeId, nombreMembres, specialite, zoneIntervention, materielAssigne, projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const nouvelleLigne = [
      "",  // EquipeID auto-généré
      nomEquipe,
      chefEquipeId || "",
      parseInt(nombreMembres),
      specialite,
      "Actif",
      new Date(),
      zoneIntervention,
      materielAssigne,
      projetId || "",
      0,  // Taux occupation initial
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("EQUIPE", `Nouvelle équipe créée: ${nomEquipe}`);
    }

    // Envoyer notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(1, `Nouvelle équipe créée: ${nomEquipe} (${specialite})`, "NORMALE");
    }

    return {success: true, message: "Équipe ajoutée avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout équipe: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie une équipe existante
 */
function modifierEquipe(equipeId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver l'équipe
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === equipeId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Équipe non trouvée: " + equipeId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "nomEquipe": 2,
      "chefEquipeId": 3,
      "nombreMembres": 4,
      "specialite": 5,
      "statut": 6,
      "zoneIntervention": 8,
      "materielAssigne": 9,
      "projetId": 10,
      "tauxOccupation": 11,
      "observations": 12
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("EQUIPE", `Équipe ${equipeId} modifiée: ${champAModifier}`);
    }

    return {success: true, message: "Équipe modifiée avec succès"};

  } catch (error) {
    Logger.log("Erreur modification équipe: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Dissout une équipe (changement de statut)
 */
function dissoudreEquipe(equipeId) {
  return modifierEquipe(equipeId, "statut", "Dissous");
}

/**
 * Recherche des équipes selon critères
 */
function rechercherEquipes(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "nom": 1,
      "specialite": 4,
      "statut": 5,
      "zone": 7
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push(data[i]);
      }
    }

    return {success: true, resultats: resultats};

  } catch (error) {
    Logger.log("Erreur recherche équipes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient toutes les équipes actives
 */
function obtenirEquipesActives() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const equipes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][5] === "Actif") {
        equipes.push({
          id: data[i][0],
          nom: data[i][1],
          chefEquipeId: data[i][2],
          nombreMembres: data[i][3],
          specialite: data[i][4],
          statut: data[i][5],
          zoneIntervention: data[i][7],
          projetId: data[i][9]
        });
      }
    }

    return {success: true, equipes: equipes};

  } catch (error) {
    Logger.log("Erreur obtention équipes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les équipes par spécialité
 */
function obtenirEquipesParSpecialite(specialite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const equipes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][4] === specialite && data[i][1]) {
        equipes.push({
          id: data[i][0],
          nom: data[i][1],
          nombreMembres: data[i][3],
          statut: data[i][5]
        });
      }
    }

    return {success: true, equipes: equipes, count: equipes.length};

  } catch (error) {
    Logger.log("Erreur obtention équipes par spécialité: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule le taux d'occupation d'une équipe
 */
function calculerTauxOccupation(equipeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === equipeId) {
        const nombreMembres = data[i][3];
        const capaciteMax = data[i][4] === "Topographie" ? 10
          : data[i][4] === "Génie civil" ? 15
          : data[i][4] === "Irrigation" ? 8
          : 12;  // Mixte par défaut

        const tauxOccupation = nombreMembres / capaciteMax;

        return {
          success: true,
          nombreMembres: nombreMembres,
          capaciteMax: capaciteMax,
          tauxOccupation: tauxOccupation,
          placesDisponibles: capaciteMax - nombreMembres
        };
      }
    }

    throw new Error("Équipe non trouvée");

  } catch (error) {
    Logger.log("Erreur calcul taux occupation: " + error);
    return {success: false, message: error.message};
  }
}
