/**
 * MODULE BUDGET - Gestion Budgétaire Complète
 * Gestion et suivi budgétaire des projets d'aménagement
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE BUDGET ====================

/**
 * Initialise le module BUDGET avec toutes les fonctionnalités
 */
function initialiserBudget() {
  try {
    Logger.log("💰 Initialisation du module BUDGET...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("💰 Budget");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("💰 Budget");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:N1").merge()
      .setValue("💰 GESTION BUDGÉTAIRE - SUIVI FINANCIER DES PROJETS D'AMÉNAGEMENT")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "BudgetID",
      "ProjetID",
      "Categorie",
      "Libelle",
      "MontantPrevu (FCFA)",
      "MontantEngage (FCFA)",
      "MontantPaye (FCFA)",
      "MontantRestant (FCFA)",
      "DatePrevision",
      "DateEngagement",
      "StatutBudget",
      "Trimestre",
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
    const columnWidths = [100, 100, 150, 300, 150, 150, 150, 150, 110, 110, 140, 100, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "BUD001",
        "PROJ001",
        "Main d'oeuvre",
        "Équipe topographique - Levés terrain Logone et Chari",
        45000000,
        45000000,
        22500000,
        '=SI(E3>0;E3-G3;0)',
        new Date(2024, 0, 15),
        new Date(2024, 0, 20),
        "En cours",
        "T1-2024",
        "Paiement mensuel - 50% exécuté"
      ],
      [
        "BUD002",
        "PROJ001",
        "Matériel",
        "Fournitures béton, tuyauterie PVC - Canaux principaux",
        280000000,
        280000000,
        168000000,
        '=SI(E4>0;E4-G4;0)',
        new Date(2024, 1, 1),
        new Date(2024, 1, 10),
        "En cours",
        "T1-2024",
        "Livraison par lots - 60% livré"
      ],
      [
        "BUD003",
        "PROJ001",
        "Transport",
        "Transport matériaux et équipements - Zone Extrême-Nord",
        35000000,
        35000000,
        35000000,
        '=SI(E5>0;E5-G5;0)',
        new Date(2024, 1, 15),
        new Date(2024, 1, 18),
        "Soldé",
        "T1-2024",
        "Transport complet effectué"
      ],
      [
        "BUD004",
        "PROJ001",
        "Études",
        "Étude impact environnemental et social (EIES)",
        55000000,
        55000000,
        55000000,
        '=SI(E6>0;E6-G6;0)',
        new Date(2024, 0, 10),
        new Date(2024, 0, 12),
        "Soldé",
        "T1-2024",
        "Rapport final approuvé"
      ],
      [
        "BUD005",
        "PROJ001",
        "Imprévus",
        "Réserve imprévus et aléas techniques",
        75000000,
        12000000,
        0,
        '=SI(E7>0;E7-G7;0)',
        new Date(2024, 0, 15),
        "",
        "Disponible",
        "T1-2024",
        "16% du budget imprévus mobilisé"
      ],
      [
        "BUD006",
        "PROJ002",
        "Main d'oeuvre",
        "Personnel maraîcher - Aménagement Yaoundé",
        18000000,
        18000000,
        9000000,
        '=SI(E8>0;E8-G8;0)',
        new Date(2024, 2, 1),
        new Date(2024, 2, 5),
        "En cours",
        "T1-2024",
        "50% masse salariale versée"
      ],
      [
        "BUD007",
        "PROJ002",
        "Matériel",
        "Système irrigation goutte-à-goutte moderne",
        85000000,
        85000000,
        42500000,
        '=SI(E9>0;E9-G9;0)',
        new Date(2024, 2, 10),
        new Date(2024, 2, 15),
        "En cours",
        "T1-2024",
        "Installation 50% - reste à payer"
      ],
      [
        "BUD008",
        "PROJ003",
        "Études",
        "Étude faisabilité technique - Vallée du Noun",
        42000000,
        0,
        0,
        '=SI(E10>0;E10-G10;0)',
        new Date(2024, 5, 1),
        "",
        "Prévisionnel",
        "T2-2024",
        "En attente lancement - financement non débloqué"
      ],
      [
        "BUD009",
        "PROJ001",
        "Autre",
        "Formation agriculteurs - Techniques irrigation",
        12000000,
        12000000,
        12500000,
        '=SI(E11>0;E11-G11;0)',
        new Date(2024, 2, 20),
        new Date(2024, 2, 22),
        "Dépassement",
        "T1-2024",
        "⚠️ ALERTE: Dépassement 500,000 FCFA (+4.2%)"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // BudgetID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 12; i <= Math.min(derniereLigne, 200); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"BUD"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes I et J)
    sheet.getRange("I3:J200")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Montants (colonnes E, F, G, H)
    sheet.getRange("E3:H200")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // ===== FORMULES AVANCÉES =====

    // Taux Engagement (colonne cachée)
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Taux Engagement");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`I${i}`).setFormula(
        `=SI(E${i}>0;F${i}/E${i};0)`
      );
    }
    sheet.getRange("I3:I200").setNumberFormat("0.0%");
    sheet.hideColumns(9);

    // Taux Exécution (colonne cachée)
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Taux Exécution");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(E${i}>0;G${i}/E${i};0)`
      );
    }
    sheet.getRange("J3:J200").setNumberFormat("0.0%");
    sheet.hideColumns(10);

    // Écart Budget (colonne cachée)
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Écart Budget");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(E${i}>0;G${i}-E${i};0)`
      );
    }
    sheet.getRange("K3:K200")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");
    sheet.hideColumns(11);

    // % Écart (colonne cachée)
    sheet.insertColumnAfter(11);
    sheet.getRange("L2").setValue("% Écart");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`L${i}`).setFormula(
        `=SI(E${i}>0;K${i}/E${i};0)`
      );
    }
    sheet.getRange("L3:L200").setNumberFormat("0.0%");
    sheet.hideColumns(12);

    // Alerte Dépassement (colonne cachée)
    sheet.insertColumnAfter(12);
    sheet.getRange("M2").setValue("Alerte Dépassement");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`M${i}`).setFormula(
        `=SI(G${i}>E${i};"⚠️ DÉPASSEMENT";SI(G${i}>E${i}*0.9;"⚡ PROCHE LIMITE";"✓ Normal"))`
      );
    }
    sheet.hideColumns(13);

    // Nom Projet depuis référentiel (colonne cachée)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Nom Projet");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(B${i}<>"";SIERREUR(RECHERCHEV(B${i};'📁 Projets'!A:B;2;FAUX);"Projet non trouvé");"")`
      );
    }
    sheet.hideColumns(14);

    // Jours depuis engagement (colonne cachée)
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Jours Engagement");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(J${i}<>"";AUJOURDHUI()-J${i};"")`
      );
    }
    sheet.getRange("O3:O200").setNumberFormat('0" jours"');
    sheet.hideColumns(15);

    // Statut Auto basé sur exécution (colonne cachée)
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Statut Auto");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(NBVAL(E${i})=0;"Non défini";SI(G${i}>E${i};"Dépassement";SI(G${i}=E${i};"Soldé";SI(ET(G${i}>0;G${i}<E${i});"En cours";SI(F${i}>0;"Engagé";"Prévisionnel")))))`
      );
    }
    sheet.hideColumns(16);

    // ===== VALIDATION DES DONNÉES =====

    // ProjetID - Liste déroulante depuis référentiel Projets
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("📁 Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un projet existant (obligatoire)")
      .build();
    sheet.getRange("B3:B200").setDataValidation(regleProjet);

    // Catégorie - Liste fixe
    const regleCategorie = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Main d'oeuvre",
        "Matériel",
        "Transport",
        "Études",
        "Imprévus",
        "Autre"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Catégorie budgétaire obligatoire")
      .build();
    sheet.getRange("C3:C200").setDataValidation(regleCategorie);

    // Montants - Nombres positifs uniquement
    const regleMontant = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Montant en FCFA (positif uniquement)")
      .build();
    sheet.getRange("E3:G200").setDataValidation(regleMontant);

    // StatutBudget - Liste fixe
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Prévisionnel",
        "Engagé",
        "En cours",
        "Soldé",
        "Dépassement",
        "Disponible",
        "Annulé"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Statut du poste budgétaire")
      .build();
    sheet.getRange("L3:L200").setDataValidation(regleStatut);

    // Trimestre - Format validé
    const regleTrimestre = SpreadsheetApp.newDataValidation()
      .requireTextMatches("T[1-4]-20[0-9]{2}")
      .setAllowInvalid(false)
      .setHelpText("Format: T1-2024, T2-2024, T3-2024, T4-2024")
      .build();
    sheet.getRange("M3:M200").setDataValidation(regleTrimestre);

    // Dates - Date engagement après date prévision
    const regleDate = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(true)
      .setHelpText("Date au format jj/mm/aaaa")
      .build();
    sheet.getRange("I3:J200").setDataValidation(regleDate);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // StatutBudget - Vert pour "Soldé"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Soldé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L200")])
      .build());

    // StatutBudget - Orange pour "En cours"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L200")])
      .build());

    // StatutBudget - Bleu pour "Prévisionnel"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Prévisionnel")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L200")])
      .build());

    // StatutBudget - Rouge pour "Dépassement"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Dépassement")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L200")])
      .build());

    // StatutBudget - Violet pour "Engagé"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Engagé")
      .setBackground("#9334e9")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L200")])
      .build());

    // StatutBudget - Gris pour "Annulé"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Annulé")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L200")])
      .build());

    // MontantPaye - Rouge si dépassement (>100% budget prévu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=G3>E3')
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("G3:G200")])
      .build());

    // MontantPaye - Orange si >90% budget prévu
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(G3>E3*0.9;G3<=E3)')
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("G3:G200")])
      .build());

    // MontantPaye - Vert si normal (<90%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(G3>0;G3<=E3*0.9)')
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("G3:G200")])
      .build());

    // MontantRestant - Rouge clair si négatif (dépassement)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0)
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H200")])
      .build());

    // Catégorie - Couleurs par type
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Main d'oeuvre")
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("C3:C200")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Matériel")
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("C3:C200")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Imprévus")
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("C3:C200")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 205;

    // Titre de la section
    sheet.getRange(`A${statsRow}:N${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES BUDGÉTAIRES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Budget total prévu", '=SOMME(E3:E200)', "Budget global tous projets"],
      ["Budget total engagé", '=SOMME(F3:F200)', "Montants engagés contractuellement"],
      ["Budget total payé", '=SOMME(G3:G200)', "Décaissements effectifs réalisés"],
      ["Budget disponible", '=SOMME(H3:H200)', "Solde restant à payer"],
      ["Taux engagement global", '=SI(SOMME(E3:E200)>0;SOMME(F3:F200)/SOMME(E3:E200);0)', "% budget engagé"],
      ["Taux exécution global", '=SI(SOMME(E3:E200)>0;SOMME(G3:G200)/SOMME(E3:E200);0)', "% budget payé"],
      ["Nombre postes budgétaires", '=NB.SI(B3:B200;"<>"")', "Total lignes budget"],
      ["Postes en dépassement", '=NB.SI(L3:L200;"Dépassement")', "Lignes hors budget"],
      ["Postes soldés", '=NB.SI(L3:L200;"Soldé")', "Lignes soldées"],
      ["Postes en cours", '=NB.SI(L3:L200;"En cours")', "Lignes en exécution"],
      ["Budget Main d'oeuvre", '=SOMME.SI(C3:C200;"Main d''oeuvre";E3:E200)', "Personnel et salaires"],
      ["Budget Matériel", '=SOMME.SI(C3:C200;"Matériel";E3:E200)', "Matériaux et équipements"],
      ["Budget Transport", '=SOMME.SI(C3:C200;"Transport";E3:E200)', "Logistique et transport"],
      ["Budget Études", '=SOMME.SI(C3:C200;"Études";E3:E200)', "Études et expertises"],
      ["Budget Imprévus", '=SOMME.SI(C3:C200;"Imprévus";E3:E200)', "Réserve aléas"],
      ["Imprévus mobilisés", '=SOMME.SI(C3:C200;"Imprévus";F3:F200)', "Imprévus engagés"],
      ["% Imprévus utilisés", '=SI(SOMME.SI(C3:C200;"Imprévus";E3:E200)>0;SOMME.SI(C3:C200;"Imprévus";F3:F200)/SOMME.SI(C3:C200;"Imprévus";E3:E200);0)', "Taux utilisation imprévus"],
      ["Total dépassements", '=SOMME(SI(G3:G200>E3:E200;G3:G200-E3:E200;0))', "Montant total dépassé"],
      ["Écart moyen", '=MOYENNE(K3:K200)', "Écart moyen par ligne"]
    ];

    // Appliquer formule tableau pour Total dépassements
    sheet.getRange(statsRow + 19, 2).setFormula('=SOMME(SI(G3:G200>E3:E200;G3:G200-E3:E200;0))');
    SpreadsheetApp.flush();

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs monétaires
    sheet.getRange(statsRow + 2, 2, 5, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 12, 2, 6, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 19, 2, 2, 1).setNumberFormat('#,##0" FCFA"');

    // Format des pourcentages
    sheet.getRange(statsRow + 6, 2, 2, 1).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 18, 2).setNumberFormat("0.0%");

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

    // Graphique 1: Répartition Budget par Catégorie
    const chartCategorie = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("C2:C200"))
      .addRange(sheet.getRange("E2:E200"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition du Budget par Catégorie')
      .setOption('width', 550)
      .setOption('height', 350)
      .setOption('is3D', true)
      .setOption('colors', ['#4285f4', '#fbbc04', '#34a853', '#ea4335', '#9334e9', '#9aa0a6'])
      .setOption('pieSliceText', 'value-and-percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 10}})
      .setOption('pieSliceTextStyle', {fontSize: 9})
      .build();

    sheet.insertChart(chartCategorie);

    // Graphique 2: Exécution Budgétaire (Prévu vs Engagé vs Payé)
    const chartExecution = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("D2:D200"))
      .addRange(sheet.getRange("E2:G200"))
      .setPosition(statsRow + kpis.length + 2, 8, 0, 0)
      .setOption('title', 'Exécution Budgétaire: Prévu vs Engagé vs Payé')
      .setOption('width', 650)
      .setOption('height', 350)
      .setOption('colors', ['#4285f4', '#fbbc04', '#34a853'])
      .setOption('isStacked', false)
      .setOption('legend', {position: 'top', textStyle: {fontSize: 10}})
      .setOption('vAxis', {title: 'Montant (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Postes Budgétaires', slantedText: true, slantedTextAngle: 45, textStyle: {fontSize: 8}})
      .setOption('chartArea', {width: '70%', height: '60%'})
      .build();

    sheet.insertChart(chartExecution);

    // Graphique 3: Évolution Trimestrielle
    const chartTrimestre = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("M2:M200"))
      .addRange(sheet.getRange("E2:E200"))
      .setPosition(statsRow + kpis.length + 22, 1, 0, 0)
      .setOption('title', 'Budget Prévu par Trimestre')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Budget (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Trimestre'})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartTrimestre);

    // Graphique 4: Dépassements Budgétaires
    const chartDepassement = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("D2:D200"))
      .addRange(sheet.getRange("K2:K200"))
      .setPosition(statsRow + kpis.length + 22, 8, 0, 0)
      .setOption('title', 'Écarts Budgétaires par Poste')
      .setOption('width', 650)
      .setOption('height', 400)
      .setOption('colors', ['#ea4335'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Écart (FCFA)', format: 'short'})
      .setOption('vAxis', {title: 'Postes', textStyle: {fontSize: 8}})
      .setOption('chartArea', {width: '55%', height: '75%'})
      .build();

    sheet.insertChart(chartDepassement);

    // Graphique 5: Taux d'Exécution par Projet
    const chartTauxExec = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("N2:N200"))
      .addRange(sheet.getRange("J2:J200"))
      .setPosition(statsRow + kpis.length + 45, 1, 0, 0)
      .setOption('title', 'Taux d\'Exécution par Projet')
      .setOption('width', 700)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Taux Exécution (%)', format: '#%', minValue: 0, maxValue: 1})
      .setOption('vAxis', {title: 'Projets'})
      .setOption('chartArea', {width: '60%', height: '75%'})
      .build();

    sheet.insertChart(chartTauxExec);

    // ===== TABLEAU RÉCAPITULATIF PAR PROJET =====
    const recapRow = statsRow + kpis.length + 70;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📁 RÉCAPITULATIF BUDGÉTAIRE PAR PROJET")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = [
      "ProjetID",
      "Nom Projet",
      "Budget Prévu",
      "Budget Engagé",
      "Budget Payé",
      "Budget Restant",
      "Taux Engagement",
      "Taux Exécution"
    ];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Budget protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:N200")  // Zone de saisie principale (sauf colonne H qui a formule)
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module BUDGET initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module BUDGET: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau poste budgétaire
 */
function ajouterBudget(projetId, categorie, libelle, montantPrevu, montantEngage, montantPaye, datePrevision, trimestre, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    // Validation montants
    if (montantPrevu < 0 || montantEngage < 0 || montantPaye < 0) {
      throw new Error("Les montants doivent être positifs");
    }

    if (montantEngage > montantPrevu) {
      throw new Error("Le montant engagé ne peut dépasser le montant prévu");
    }

    // Déterminer le statut automatique
    let statut = "Prévisionnel";
    if (montantPaye > montantPrevu) {
      statut = "Dépassement";
    } else if (montantPaye === montantPrevu) {
      statut = "Soldé";
    } else if (montantPaye > 0) {
      statut = "En cours";
    } else if (montantEngage > 0) {
      statut = "Engagé";
    }

    const nouvelleLigne = [
      "",  // BudgetID auto-généré
      projetId,
      categorie,
      libelle,
      parseFloat(montantPrevu),
      parseFloat(montantEngage),
      parseFloat(montantPaye),
      `=SI(E${sheet.getLastRow() + 1}>0;E${sheet.getLastRow() + 1}-G${sheet.getLastRow() + 1};0)`,  // Formule MontantRestant
      new Date(datePrevision),
      montantEngage > 0 ? new Date() : "",
      statut,
      trimestre,
      observations || ""
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("BUDGET", `Nouveau poste budgétaire: ${libelle} - ${montantPrevu} FCFA`);
    }

    // Alerte si dépassement
    if (montantPaye > montantPrevu && typeof envoyerNotification === 'function') {
      envoyerNotification(
        1,
        `⚠️ ALERTE DÉPASSEMENT BUDGÉTAIRE: ${libelle} - Écart: ${montantPaye - montantPrevu} FCFA`,
        "HAUTE"
      );
    }

    return {success: true, message: "Poste budgétaire ajouté avec succès", statut: statut};

  } catch (error) {
    Logger.log("Erreur ajout budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un poste budgétaire existant
 */
function modifierBudget(budgetId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver le poste budgétaire
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === budgetId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Poste budgétaire non trouvé: " + budgetId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "projetId": 2,
      "categorie": 3,
      "libelle": 4,
      "montantPrevu": 5,
      "montantEngage": 6,
      "montantPaye": 7,
      "datePrevision": 9,
      "dateEngagement": 10,
      "statut": 11,
      "trimestre": 12,
      "observations": 13
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    // Validation montants
    if (["montantPrevu", "montantEngage", "montantPaye"].includes(champAModifier)) {
      if (parseFloat(nouvelleValeur) < 0) {
        throw new Error("Le montant doit être positif");
      }
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("BUDGET", `Budget ${budgetId} modifié: ${champAModifier} = ${nouvelleValeur}`);
    }

    return {success: true, message: "Poste budgétaire modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime un poste budgétaire
 */
function supprimerBudget(budgetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === budgetId) {
        sheet.deleteRow(i + 1);

        if (typeof journaliserAction === 'function') {
          journaliserAction("BUDGET", `Poste budgétaire supprimé: ${budgetId}`);
        }

        return {success: true, message: "Poste budgétaire supprimé avec succès"};
      }
    }

    throw new Error("Poste budgétaire non trouvé: " + budgetId);

  } catch (error) {
    Logger.log("Erreur suppression budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des postes budgétaires par critère
 */
function rechercherBudget(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "projetId": 1,
      "categorie": 2,
      "libelle": 3,
      "statut": 10,
      "trimestre": 11
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push({
          budgetId: data[i][0],
          projetId: data[i][1],
          categorie: data[i][2],
          libelle: data[i][3],
          montantPrevu: data[i][4],
          montantPaye: data[i][6],
          statut: data[i][10]
        });
      }
    }

    return {success: true, resultats: resultats, count: resultats.length};

  } catch (error) {
    Logger.log("Erreur recherche budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient le budget d'un projet spécifique
 */
function obtenirBudgetParProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const budget = {
      projetId: projetId,
      postes: [],
      budgetTotal: 0,
      budgetEngage: 0,
      budgetPaye: 0,
      budgetRestant: 0,
      tauxExecution: 0
    };

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId) {
        budget.postes.push({
          budgetId: data[i][0],
          categorie: data[i][2],
          libelle: data[i][3],
          montantPrevu: data[i][4],
          montantEngage: data[i][5],
          montantPaye: data[i][6],
          statut: data[i][10]
        });

        budget.budgetTotal += data[i][4] || 0;
        budget.budgetEngage += data[i][5] || 0;
        budget.budgetPaye += data[i][6] || 0;
      }
    }

    budget.budgetRestant = budget.budgetTotal - budget.budgetPaye;
    budget.tauxExecution = budget.budgetTotal > 0 ? (budget.budgetPaye / budget.budgetTotal) * 100 : 0;

    return {success: true, budget: budget};

  } catch (error) {
    Logger.log("Erreur obtention budget projet: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un rapport budgétaire détaillé
 */
function genererRapportBudgetaire(projetId) {
  try {
    const budgetData = obtenirBudgetParProjet(projetId);

    if (!budgetData.success) {
      throw new Error("Impossible d'obtenir les données budgétaires");
    }

    const budget = budgetData.budget;

    // Analyse par catégorie
    const parCategorie = {};
    budget.postes.forEach(poste => {
      if (!parCategorie[poste.categorie]) {
        parCategorie[poste.categorie] = {
          prevu: 0,
          engage: 0,
          paye: 0,
          count: 0
        };
      }
      parCategorie[poste.categorie].prevu += poste.montantPrevu;
      parCategorie[poste.categorie].engage += poste.montantEngage;
      parCategorie[poste.categorie].paye += poste.montantPaye;
      parCategorie[poste.categorie].count++;
    });

    const rapport = {
      projetId: projetId,
      dateGeneration: new Date(),
      resume: {
        budgetTotal: budget.budgetTotal,
        budgetEngage: budget.budgetEngage,
        budgetPaye: budget.budgetPaye,
        budgetRestant: budget.budgetRestant,
        tauxEngagement: budget.budgetTotal > 0 ? (budget.budgetEngage / budget.budgetTotal) * 100 : 0,
        tauxExecution: budget.tauxExecution,
        nombrePostes: budget.postes.length
      },
      parCategorie: parCategorie,
      depassements: budget.postes.filter(p => p.montantPaye > p.montantPrevu),
      postesActifs: budget.postes.filter(p => p.statut === "En cours").length
    };

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport budgétaire: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Vérifie les dépassements budgétaires
 */
function verifierDepassements() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const depassements = [];

    for (let i = 2; i < data.length; i++) {
      const montantPrevu = data[i][4];
      const montantPaye = data[i][6];

      if (montantPaye > montantPrevu) {
        depassements.push({
          budgetId: data[i][0],
          projetId: data[i][1],
          libelle: data[i][3],
          montantPrevu: montantPrevu,
          montantPaye: montantPaye,
          ecart: montantPaye - montantPrevu,
          pourcentageEcart: ((montantPaye - montantPrevu) / montantPrevu) * 100
        });
      }
    }

    return {
      success: true,
      depassements: depassements,
      count: depassements.length,
      montantTotalEcart: depassements.reduce((sum, d) => sum + d.ecart, 0)
    };

  } catch (error) {
    Logger.log("Erreur vérification dépassements: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule les statistiques budgétaires globales
 */
function calculerStatistiquesBudgetaires() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("La feuille Budget n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    const stats = {
      budgetTotalPrevu: 0,
      budgetTotalEngage: 0,
      budgetTotalPaye: 0,
      budgetTotalRestant: 0,
      nombrePostes: 0,
      parCategorie: {},
      parStatut: {},
      tauxExecutionGlobal: 0,
      tauxEngagementGlobal: 0
    };

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {  // Si ProjetID existe
        stats.nombrePostes++;
        stats.budgetTotalPrevu += data[i][4] || 0;
        stats.budgetTotalEngage += data[i][5] || 0;
        stats.budgetTotalPaye += data[i][6] || 0;

        // Par catégorie
        const cat = data[i][2];
        if (!stats.parCategorie[cat]) {
          stats.parCategorie[cat] = {prevu: 0, paye: 0};
        }
        stats.parCategorie[cat].prevu += data[i][4] || 0;
        stats.parCategorie[cat].paye += data[i][6] || 0;

        // Par statut
        const statut = data[i][10];
        stats.parStatut[statut] = (stats.parStatut[statut] || 0) + 1;
      }
    }

    stats.budgetTotalRestant = stats.budgetTotalPrevu - stats.budgetTotalPaye;
    stats.tauxExecutionGlobal = stats.budgetTotalPrevu > 0
      ? (stats.budgetTotalPaye / stats.budgetTotalPrevu) * 100
      : 0;
    stats.tauxEngagementGlobal = stats.budgetTotalPrevu > 0
      ? (stats.budgetTotalEngage / stats.budgetTotalPrevu) * 100
      : 0;

    return {success: true, statistiques: stats};

  } catch (error) {
    Logger.log("Erreur calcul statistiques budgétaires: " + error);
    return {success: false, message: error.message};
  }
}
