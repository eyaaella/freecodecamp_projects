/**
 * MODULE EMPLOYE - Gestion Complète des Employés
 * Gestion RH du personnel des projets d'aménagement
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE EMPLOYE ====================

/**
 * Initialise le module EMPLOYE avec toutes les fonctionnalités
 */
function initialiserEmploye() {
  try {
    Logger.log("👤 Initialisation du module EMPLOYE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("👤 Employés");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("👤 Employés");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:O1").merge()
      .setValue("👤 GESTION DES EMPLOYÉS - RESSOURCES HUMAINES PROJETS D'AMÉNAGEMENT")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "EmployeID",
      "Nom",
      "Prénom",
      "Email",
      "Téléphone",
      "PosteID",
      "EquipeID",
      "Date Embauche",
      "Date Naissance",
      "Statut",
      "Salaire (FCFA)",
      "Compétences",
      "Certifications",
      "Adresse",
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
    const columnWidths = [100, 150, 150, 220, 150, 100, 100, 110, 110, 120, 150, 250, 250, 200, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "EMP001",
        "Mbarga",
        "Jean",
        "jean.mbarga@toposervice.cm",
        "+237 6 77 88 99 00",
        "POST002",
        "EQ001",
        new Date(2020, 0, 15),
        new Date(1985, 5, 20),
        "Actif",
        1800000,
        "Hydraulique, CAO, Gestion projet, Supervision",
        "Ingénieur Génie Civil, Formation Irrigation Gravitaire",
        "Yaoundé, Quartier Bastos",
        "Chef de projet senior"
      ],
      [
        "EMP002",
        "Nkolo",
        "Marie",
        "marie.nkolo@toposervice.cm",
        "+237 6 99 11 22 33",
        "POST001",
        "EQ001",
        new Date(2019, 8, 10),
        new Date(1990, 2, 15),
        "Actif",
        1200000,
        "Topographie, GPS RTK, Station totale, AutoCAD",
        "Géomètre-Expert, Certif. GPS Trimble",
        "Douala, Akwa",
        "Topographe principale équipe Nord"
      ],
      [
        "EMP003",
        "Tchokothe",
        "Paul",
        "paul.tchokothe@toposervice.cm",
        "+237 6 55 44 33 22",
        "POST003",
        "EQ002",
        new Date(2021, 3, 1),
        new Date(1995, 10, 8),
        "Actif",
        550000,
        "Levés topographiques, Implantation, GPS",
        "BTS Géomètre-Topographe",
        "Bafoussam, Centre-ville",
        "Affecté zone Ouest"
      ],
      [
        "EMP004",
        "Onana",
        "Berthe",
        "berthe.onana@toposervice.cm",
        "+237 6 88 77 66 55",
        "POST006",
        "",
        new Date(2022, 1, 15),
        new Date(1988, 7, 25),
        "Actif",
        700000,
        "Gestion RH, Paie, Législation travail, Excel",
        "Licence RH, Formation Paie OHADA",
        "Yaoundé, Emana",
        "Responsable RH et administration"
      ],
      [
        "EMP005",
        "Njoya",
        "Ibrahim",
        "ibrahim.njoya@toposervice.cm",
        "+237 6 44 55 66 77",
        "POST008",
        "EQ003",
        new Date(2023, 5, 20),
        new Date(1992, 3, 12),
        "Actif",
        800000,
        "Pilotage drone DJI, Photogrammétrie, Pix4D, QGIS",
        "Licence Géomatique, Certif. DSAC Pilote Drone",
        "Garoua, Plateau",
        "Spécialiste levés aériens"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // EmployeID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"EMP"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes H et I)
    sheet.getRange("H3:I100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Salaire (colonne K)
    sheet.getRange("K3:K100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // ===== FORMULES AVANCÉES =====

    // Âge (colonne cachée)
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Âge");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(I${i}<>"";DATEDIF(I${i};AUJOURDHUI();"Y");"")`
      );
    }
    sheet.getRange("J3:J100").setNumberFormat('0" ans"');
    sheet.hideColumns(10);

    // Ancienneté (colonne cachée)
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Ancienneté");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(H${i}<>"";DATEDIF(H${i};AUJOURDHUI();"Y");"")`
      );
    }
    sheet.getRange("K3:K100").setNumberFormat('0" ans"');
    sheet.hideColumns(11);

    // Ancienneté en mois (colonne cachée)
    sheet.insertColumnAfter(11);
    sheet.getRange("L2").setValue("Ancienneté Mois");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`L${i}`).setFormula(
        `=SI(H${i}<>"";DATEDIF(H${i};AUJOURDHUI();"M");"")`
      );
    }
    sheet.getRange("L3:L100").setNumberFormat('0" mois"');
    sheet.hideColumns(12);

    // Nom complet (colonne cachée)
    sheet.insertColumnAfter(12);
    sheet.getRange("M2").setValue("Nom Complet");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`M${i}`).setFormula(
        `=SI(ET(B${i}<>"";C${i}<>"");CONCATENER(B${i};" ";C${i});"")`
      );
    }
    sheet.hideColumns(13);

    // Intitulé Poste (depuis référentiel)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Intitulé Poste");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(F${i}<>"";RECHERCHEV(F${i};'💼 Postes'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(14);

    // Catégorie Poste (depuis référentiel)
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Catégorie");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(F${i}<>"";RECHERCHEV(F${i};'💼 Postes'!A:C;3;FAUX);"")`
      );
    }
    sheet.hideColumns(15);

    // Nom Équipe (depuis référentiel)
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Nom Équipe");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(G${i}<>"";RECHERCHEV(G${i};'👥 Équipes'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(16);

    // Email valide (colonne cachée)
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Email Valide");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(D${i}="";FAUX;ET(TROUVE("@";D${i})>0;TROUVE(".";D${i})>TROUVE("@";D${i})))`
      );
    }
    sheet.hideColumns(17);

    // Téléphone valide Cameroun (colonne cachée)
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Tél Valide");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(E${i}="";FAUX;ET(GAUCHE(E${i};4)="+237";NBCAR(SUBSTITUE(E${i};" ";""))>=12))`
      );
    }
    sheet.hideColumns(18);

    // Conformité Salaire (colonne cachée)
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Salaire Conforme");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(ET(F${i}<>"";L${i}>0);ET(L${i}>=RECHERCHEV(F${i};'💼 Postes'!A:E;5;FAUX);L${i}<=RECHERCHEV(F${i};'💼 Postes'!A:F;6;FAUX));"")`
      );
    }
    sheet.hideColumns(19);

    // ===== VALIDATION DES DONNÉES =====

    // Email - Format email
    const regleEmail = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(TROUVE("@";D3)>0;TROUVE(".";D3)>TROUVE("@";D3))')
      .setAllowInvalid(false)
      .setHelpText("Entrez un email valide (ex: nom.prenom@toposervice.cm)")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleEmail);

    // Téléphone - Format Cameroun +237
    const regleTelephone = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(GAUCHE(E3;4)="+237";NBCAR(SUBSTITUE(E3;" ";""))>=12)')
      .setAllowInvalid(false)
      .setHelpText("Format: +237 6 XX XX XX XX (obligatoire)")
      .build();
    sheet.getRange("E3:E100").setDataValidation(regleTelephone);

    // PosteID - Liste déroulante depuis référentiel Postes
    const reglePoste = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("💼 Postes").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un poste existant")
      .build();
    sheet.getRange("F3:F100").setDataValidation(reglePoste);

    // EquipeID - Liste déroulante depuis référentiel Équipes
    const regleEquipe = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("👥 Équipes").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez une équipe (optionnel)")
      .build();
    sheet.getRange("G3:G100").setDataValidation(regleEquipe);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "Congé", "Suspendu", "Démission", "Retraite", "Licencié"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut de l'employé")
      .build();
    sheet.getRange("K3:K100").setDataValidation(regleStatut);

    // Salaire (nombre positif)
    const regleSalaire = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez un salaire positif en FCFA")
      .build();
    sheet.getRange("L3:L100").setDataValidation(regleSalaire);

    // Date embauche (date valide, pas future)
    const regleDateEmbauche = SpreadsheetApp.newDataValidation()
      .requireDateBefore(new Date())
      .setAllowInvalid(false)
      .setHelpText("Date d'embauche ne peut être future")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleDateEmbauche);

    // Date naissance (personne de 18 à 65 ans)
    const dateMin = new Date();
    dateMin.setFullYear(dateMin.getFullYear() - 65);
    const dateMax = new Date();
    dateMax.setFullYear(dateMax.getFullYear() - 18);

    const regleDateNaissance = SpreadsheetApp.newDataValidation()
      .requireDateBetween(dateMin, dateMax)
      .setAllowInvalid(false)
      .setHelpText("L'employé doit avoir entre 18 et 65 ans")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleDateNaissance);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut - Actif (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Actif")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Statut - Congé (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Congé")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Statut - Suspendu (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Suspendu")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Statut - Démission/Retraite/Licencié (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Démission")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Retraite")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Licencié")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Email invalide (Rouge clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=NON(Q3)')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    // Téléphone invalide (Rouge clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=NON(R3)')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("E3:E100")])
      .build());

    // Salaire non conforme à la grille (Orange clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=NON(S3)')
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("L3:L100")])
      .build());

    // Ancienneté - Couleurs selon années
    // < 1 an (Bleu clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(1)
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // 1-5 ans (Vert clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(1, 5)
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // > 5 ans (Jaune clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(5)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:O${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DU PERSONNEL")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Effectif total", '=NB.SI(B3:B100;"<>"")', "Nombre total d'employés"],
      ["Employés actifs", '=NB.SI(K3:K100;"Actif")', "En poste actuellement"],
      ["Employés en congé", '=NB.SI(K3:K100;"Congé")', "Absences temporaires"],
      ["Employés suspendus", '=NB.SI(K3:K100;"Suspendu")', "Suspensions en cours"],
      ["Ingénieurs", '=NB.SI(O3:O100;"Ingénieur")', "Effectif ingénieurs"],
      ["Topographes", '=NB.SI(O3:O100;"Topographe")', "Effectif topographes"],
      ["Techniciens", '=NB.SI(O3:O100;"Technicien")', "Effectif techniciens"],
      ["Ouvriers", '=NB.SI(O3:O100;"Ouvrier")', "Effectif ouvriers"],
      ["Personnel administratif", '=NB.SI(O3:O100;"Administratif")', "Effectif admin"],
      ["Ancienneté moyenne", '=MOYENNE(K3:K100)', "Années moyennes d'ancienneté"],
      ["Âge moyen", '=MOYENNE(J3:J100)', "Âge moyen du personnel"],
      ["Masse salariale totale", '=SOMME(L3:L100)', "Salaires mensuels totaux"],
      ["Salaire moyen", '=MOYENNE(L3:L100)', "Salaire mensuel moyen"],
      ["Taux conformité salaires", '=NB.SI(S3:S100;VRAI)/NB.SI(B3:B100;"<>"")', "% salaires conformes grille"],
      ["Taux emails valides", '=NB.SI(Q3:Q100;VRAI)/NB.SI(B3:B100;"<>"")', "% emails correctement formatés"],
      ["Taux téléphones valides", '=NB.SI(R3:R100;VRAI)/NB.SI(B3:B100;"<>"")', "% téléphones format Cameroun"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 11, 2).setNumberFormat('0.0" ans"');
    sheet.getRange(statsRow + 12, 2).setNumberFormat('0.0" ans"');
    sheet.getRange(statsRow + 13, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 14, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 15, 2, 3, 1).setNumberFormat("0.0%");

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
      .addRange(sheet.getRange("K2:K100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition des Employés par Statut')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#fbbc04', '#ea4335', '#9aa0a6'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Effectif par catégorie
    const chartCategorie = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("O2:O100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Effectif par Catégorie Professionnelle')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre', format: '0'})
      .setOption('hAxis', {title: 'Catégorie', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartCategorie);

    // Graphique 3: Pyramide des âges
    const chartAge = sheet.newChart()
      .setChartType(Charts.ChartType.HISTOGRAM)
      .addRange(sheet.getRange("J2:J100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Pyramide des Âges')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Âge', format: '0'})
      .setOption('vAxis', {title: 'Effectif'})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartAge);

    // Graphique 4: Répartition des salaires
    const chartSalaire = sheet.newChart()
      .setChartType(Charts.ChartType.HISTOGRAM)
      .addRange(sheet.getRange("L2:L100"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'Distribution des Salaires')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Salaire (FCFA)', format: 'short'})
      .setOption('vAxis', {title: 'Effectif'})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartSalaire);

    // ===== TABLEAU RÉCAPITULATIF PAR CATÉGORIE =====
    const recapRow = statsRow + kpis.length + 35;

    sheet.getRange(`A${recapRow}:G${recapRow}`).merge()
      .setValue("📋 RÉCAPITULATIF PAR CATÉGORIE PROFESSIONNELLE")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["Catégorie", "Effectif", "Ancienneté Moy.", "Âge Moyen", "Salaire Moyen", "Masse Salariale", "% Effectif"];
    sheet.getRange(recapRow + 1, 1, 1, 7).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Données récapitulatives
    const categories = ["Ingénieur", "Topographe", "Technicien", "Ouvrier", "Administratif"];
    const recapData = [];

    categories.forEach((cat, idx) => {
      const row = recapRow + 2 + idx;
      recapData.push([
        cat,
        `=NB.SI(O3:O100;"${cat}")`,
        `=MOYENNE.SI(O3:O100;"${cat}";K3:K100)`,
        `=MOYENNE.SI(O3:O100;"${cat}";J3:J100)`,
        `=MOYENNE.SI(O3:O100;"${cat}";L3:L100)`,
        `=SOMME.SI(O3:O100;"${cat}";L3:L100)`,
        `=NB.SI(O3:O100;"${cat}")/NB.SI(B3:B100;"<>"")`
      ]);
    });

    sheet.getRange(recapRow + 2, 1, categories.length, 7).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 3, categories.length, 2).setNumberFormat('0.0" ans"');
    sheet.getRange(recapRow + 2, 5, categories.length, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(recapRow + 2, 7, categories.length, 1).setNumberFormat("0.0%");

    // Bordures
    sheet.getRange(recapRow + 1, 1, categories.length + 1, 7).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Employés protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:O100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module EMPLOYE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module EMPLOYE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouvel employé
 */
function ajouterEmploye(nom, prenom, email, telephone, posteId, equipeId, dateEmbauche, dateNaissance, salaire, competences, certifications, adresse) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");

    if (!sheet) {
      throw new Error("La feuille Employés n'existe pas");
    }

    // Validation email
    if (!email.includes("@") || !email.includes(".")) {
      throw new Error("Email invalide");
    }

    // Validation téléphone Cameroun
    if (!telephone.startsWith("+237")) {
      throw new Error("Le téléphone doit commencer par +237");
    }

    const nouvelleLigne = [
      "",  // EmployeID auto-généré
      nom,
      prenom,
      email,
      telephone,
      posteId,
      equipeId || "",
      new Date(dateEmbauche),
      new Date(dateNaissance),
      "Actif",
      parseFloat(salaire),
      competences,
      certifications,
      adresse,
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("EMPLOYE", `Nouvel employé: ${nom} ${prenom}`);
    }

    // Envoyer notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(1, `Nouvel employé enregistré: ${nom} ${prenom}`, "NORMALE");
    }

    return {success: true, message: "Employé ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout employé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un employé existant
 */
function modifierEmploye(employeId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");

    if (!sheet) {
      throw new Error("La feuille Employés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver l'employé
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Employé non trouvé: " + employeId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "nom": 2,
      "prenom": 3,
      "email": 4,
      "telephone": 5,
      "posteId": 6,
      "equipeId": 7,
      "dateEmbauche": 8,
      "dateNaissance": 9,
      "statut": 10,
      "salaire": 11,
      "competences": 12,
      "certifications": 13,
      "adresse": 14,
      "observations": 15
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("EMPLOYE", `Employé ${employeId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Employé modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification employé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les employés actifs
 */
function obtenirEmployesActifs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");

    if (!sheet) {
      throw new Error("La feuille Employés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const employes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][9] === "Actif") {
        employes.push({
          id: data[i][0],
          nom: data[i][1],
          prenom: data[i][2],
          email: data[i][3],
          telephone: data[i][4],
          posteId: data[i][5],
          equipeId: data[i][6],
          dateEmbauche: data[i][7],
          statut: data[i][9]
        });
      }
    }

    return {success: true, employes: employes};

  } catch (error) {
    Logger.log("Erreur obtention employés: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les employés d'une équipe
 */
function obtenirEmployesParEquipe(equipeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");

    if (!sheet) {
      throw new Error("La feuille Employés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const employes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][6] === equipeId && data[i][1]) {
        employes.push({
          id: data[i][0],
          nom: data[i][1],
          prenom: data[i][2],
          posteId: data[i][5],
          statut: data[i][9]
        });
      }
    }

    return {success: true, employes: employes, count: employes.length};

  } catch (error) {
    Logger.log("Erreur obtention employés par équipe: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule l'ancienneté d'un employé
 */
function calculerAnciennete(employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");

    if (!sheet) {
      throw new Error("La feuille Employés n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) {
        const dateEmbauche = new Date(data[i][7]);
        const maintenant = new Date();
        const diffMs = maintenant - dateEmbauche;
        const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const annees = Math.floor(diffJours / 365);
        const mois = Math.floor((diffJours % 365) / 30);

        return {
          success: true,
          ancienneteAnnees: annees,
          ancienneteMois: mois,
          ancienneteJours: diffJours,
          dateEmbauche: dateEmbauche
        };
      }
    }

    throw new Error("Employé non trouvé");

  } catch (error) {
    Logger.log("Erreur calcul ancienneté: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Vérifie la validité des coordonnées (email/téléphone)
 */
function verifierCoordonnees(email, telephone) {
  const emailValide = email.includes("@") && email.includes(".");
  const telephoneValide = telephone.startsWith("+237") && telephone.replace(/\s/g, "").length >= 12;

  return {
    success: true,
    emailValide: emailValide,
    telephoneValide: telephoneValide,
    message: emailValide && telephoneValide
      ? "Coordonnées valides"
      : "Coordonnées invalides - vérifiez le format"
  };
}
