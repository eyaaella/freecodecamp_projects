/**
 * MODULE POSTE - Référentiel des Postes RH
 * Gestion des postes et grille salariale pour projets d'aménagement
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE POSTE ====================

/**
 * Initialise le module POSTE avec toutes les fonctionnalités
 */
function initialiserPoste() {
  try {
    Logger.log("💼 Initialisation du module POSTE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("💼 Postes");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("💼 Postes");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:L1").merge()
      .setValue("💼 RÉFÉRENTIEL DES POSTES - GRILLE SALARIALE ET COMPÉTENCES")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "PosteID",
      "Intitulé",
      "Catégorie",
      "Description",
      "Salaire Min (FCFA)",
      "Salaire Max (FCFA)",
      "Compétences Requises",
      "Niveau Étude",
      "Expérience Min (années)",
      "Responsabilités",
      "Statut",
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
    const columnWidths = [100, 200, 150, 300, 150, 150, 250, 150, 120, 250, 120, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "POST001",
        "Topographe Principal",
        "Topographe",
        "Responsable des levés topographiques et implantation des ouvrages",
        800000,
        1500000,
        "Topographie, GPS RTK, Station totale, Logiciels CAO/DAO",
        "Licence en Géomatique",
        5,
        "Supervision équipe terrain, Contrôle qualité relevés, Rapports techniques",
        "Actif",
        "Expertise réseau gravitaire requise"
      ],
      [
        "POST002",
        "Ingénieur Hydraulicien",
        "Ingénieur",
        "Conception et dimensionnement des ouvrages hydrauliques",
        1200000,
        2500000,
        "Hydraulique, CAO, Calcul structures, Gestion projets",
        "Master en Génie Civil/Hydraulique",
        7,
        "Études techniques, Supervision travaux, Validation ouvrages",
        "Actif",
        "Spécialisation irrigation gravitaire"
      ],
      [
        "POST003",
        "Technicien Topographe",
        "Technicien",
        "Exécution des levés topographiques terrain",
        400000,
        750000,
        "GPS, Niveau, Théodolite, Calculs topographiques",
        "BTS/DUT Géomètre-Topographe",
        2,
        "Levés terrain, Implantation, Carnets de terrain",
        "Actif",
        "Travail terrain intensif"
      ],
      [
        "POST004",
        "Ouvrier Qualifié",
        "Ouvrier",
        "Exécution travaux d'aménagement hydraulique",
        150000,
        300000,
        "Maçonnerie, Terrassement, Lecture plans",
        "CAP/CEPE",
        1,
        "Réalisation ouvrages, Entretien canaux, Travaux terrain",
        "Actif",
        "Conditions terrain difficiles"
      ],
      [
        "POST005",
        "Chef d'Équipe Terrain",
        "Technicien",
        "Coordination équipe terrain et supervision chantiers",
        600000,
        1000000,
        "Leadership, Topographie, Organisation, Sécurité",
        "BTS Génie Civil",
        4,
        "Animation équipe, Planning travaux, Reporting quotidien",
        "Actif",
        "Mobilité géographique requise"
      ],
      [
        "POST006",
        "Gestionnaire RH",
        "Administratif",
        "Gestion administrative du personnel",
        500000,
        900000,
        "Gestion RH, Paie, Législation travail, Excel avancé",
        "Licence en Gestion RH",
        3,
        "Paie, Contrats, Suivi carrières, Formation",
        "Actif",
        "Maîtrise législation camerounaise"
      ],
      [
        "POST007",
        "Conducteur d'Engins",
        "Technicien",
        "Conduite engins de terrassement et nivellement",
        350000,
        600000,
        "Conduite pelle, bulldozer, niveleuse, Mécanique de base",
        "Formation professionnelle",
        3,
        "Terrassement, Nivellement, Entretien matériel",
        "Actif",
        "Permis engins obligatoire"
      ],
      [
        "POST008",
        "Pilote de Drone",
        "Topographe",
        "Levés aériens par drone et photogrammétrie",
        550000,
        1100000,
        "Pilotage drone, Photogrammétrie, Traitement images, SIG",
        "Licence Géomatique + Certification drone",
        2,
        "Levés aériens, Modélisation 3D, Orthophotos",
        "Actif",
        "Certification DSAC requise"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // PosteID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 11; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"POST"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Salaires (colonnes E et F)
    sheet.getRange("E3:F100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Expérience (colonne I)
    sheet.getRange("I3:I100")
      .setNumberFormat('0" ans"')
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Salaire Moyen (colonne cachée)
    sheet.insertColumnAfter(6);
    sheet.getRange("G2").setValue("Salaire Moyen");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`G${i}`).setFormula(`=SI(ET(E${i}>0;F${i}>0);(E${i}+F${i})/2;0)`);
    }
    sheet.getRange("G3:G100").setNumberFormat('#,##0" FCFA"');
    sheet.hideColumns(7);

    // Écart Salarial (colonne cachée)
    sheet.insertColumnAfter(7);
    sheet.getRange("H2").setValue("Écart Salarial");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`H${i}`).setFormula(`=SI(ET(E${i}>0;F${i}>0);F${i}-E${i};0)`);
    }
    sheet.getRange("H3:H100").setNumberFormat('#,##0" FCFA"');
    sheet.hideColumns(8);

    // Taux écart (%)
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Taux Écart");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`I${i}`).setFormula(`=SI(E${i}>0;(F${i}-E${i})/E${i};0)`);
    }
    sheet.getRange("I3:I100").setNumberFormat("0.0%");
    sheet.hideColumns(9);

    // Niveau expérience (colonne cachée)
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Niveau Exp");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(L${i}="";""`;SI(L${i}<2;"Junior";SI(L${i}<5;"Confirmé";SI(L${i}<10;"Senior";"Expert"))))`
      );
    }
    sheet.hideColumns(10);

    // ===== VALIDATION DES DONNÉES =====

    // Catégorie
    const regleCategorie = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Topographe", "Ingénieur", "Technicien", "Ouvrier", "Administratif"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la catégorie professionnelle")
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleCategorie);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "Inactif", "En révision"], true)
      .setAllowInvalid(false)
      .setHelpText("Statut du poste dans le référentiel")
      .build();
    sheet.getRange("K3:K100").setDataValidation(regleStatut);

    // Salaires (nombres positifs uniquement)
    const regleSalaire = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez un montant positif en FCFA")
      .build();
    sheet.getRange("E3:F100").setDataValidation(regleSalaire);

    // Expérience (nombre entier positif)
    const regleExperience = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Nombre d'années d'expérience minimum")
      .build();
    sheet.getRange("L3:L100").setDataValidation(regleExperience);

    // Niveau d'étude
    const regleNiveau = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "CEPE",
        "CAP",
        "BEPC",
        "Probatoire",
        "Baccalauréat",
        "BTS/DUT",
        "Licence",
        "Master",
        "Doctorat",
        "Formation professionnelle"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le niveau d'étude requis")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleNiveau);

    // Validation Salaire Max > Salaire Min
    const regleSalaireMax = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=F3>E3')
      .setAllowInvalid(false)
      .setHelpText("Le salaire maximum doit être supérieur au salaire minimum")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleSalaireMax);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Catégories - Couleurs différenciées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Ingénieur")
      .setBackground("#e8f0fe")
      .setFontColor("#1a73e8")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Topographe")
      .setBackground("#e6f4ea")
      .setFontColor("#137333")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Technicien")
      .setBackground("#fef7e0")
      .setFontColor("#b45309")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Ouvrier")
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Administratif")
      .setBackground("#f3e8fd")
      .setFontColor("#9c27b0")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C100")])
      .build());

    // Statut
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Actif")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Inactif")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En révision")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Salaires - Échelle de couleurs
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0, 500000)
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("E3:F100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(500001, 1000000)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("E3:F100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(1000000)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("E3:F100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:L${statsRow}`).merge()
      .setValue("📊 GRILLE SALARIALE ET ANALYSES RH")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total de postes", '=NB.SI(B3:B100;"<>"")', "Postes au référentiel"],
      ["Postes actifs", '=NB.SI(K3:K100;"Actif")', "Postes disponibles au recrutement"],
      ["Postes ingénieurs", '=NB.SI(C3:C100;"Ingénieur")', "Postes cadres supérieurs"],
      ["Postes topographes", '=NB.SI(C3:C100;"Topographe")', "Postes techniques spécialisés"],
      ["Postes techniciens", '=NB.SI(C3:C100;"Technicien")', "Postes techniques"],
      ["Postes ouvriers", '=NB.SI(C3:C100;"Ouvrier")', "Postes exécution"],
      ["Postes administratifs", '=NB.SI(C3:C100;"Administratif")', "Postes support"],
      ["Salaire moyen min", '=MOYENNE(E3:E100)', "Moyenne salaires minimums"],
      ["Salaire moyen max", '=MOYENNE(F3:F100)', "Moyenne salaires maximums"],
      ["Salaire global moyen", '=MOYENNE(G3:G100)', "Moyenne générale"],
      ["Écart salarial moyen", '=MOYENNE(H3:H100)', "Écart moyen min-max"],
      ["Expérience moyenne requise", '=MOYENNE(L3:L100)', "Années d'expérience moyennes"],
      ["Masse salariale min totale", '=SOMME(E3:E100)', "Si tous postes au minimum"],
      ["Masse salariale max totale", '=SOMME(F3:F100)', "Si tous postes au maximum"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 9, 2, 6, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 13, 2).setNumberFormat('0.0" ans"');

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

    // Graphique 1: Répartition par catégorie
    const chartCategorie = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("C2:C100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition des Postes par Catégorie')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9c27b0'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartCategorie);

    // Graphique 2: Grille salariale par poste
    const chartSalaires = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("E2:F100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Grille Salariale: Min vs Max par Poste')
      .setOption('width', 700)
      .setOption('height', 300)
      .setOption('colors', ['#34a853', '#ea4335'])
      .setOption('legend', {position: 'top'})
      .setOption('vAxis', {title: 'Salaire (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Postes', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartSalaires);

    // Graphique 3: Expérience requise par poste
    const chartExperience = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("L2:L100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Expérience Minimale Requise (années)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Années', format: '0'})
      .setOption('vAxis', {title: 'Postes'})
      .setOption('chartArea', {width: '60%', height: '80%'})
      .build();

    sheet.insertChart(chartExperience);

    // Graphique 4: Salaire moyen par catégorie
    const chartMoyenne = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("C2:C100"))
      .addRange(sheet.getRange("G2:G100"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'Salaire Moyen par Catégorie')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Salaire (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Catégorie'})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartMoyenne);

    // ===== TABLEAU RÉCAPITULATIF PAR CATÉGORIE =====
    const recapRow = statsRow + kpis.length + 35;

    sheet.getRange(`A${recapRow}:F${recapRow}`).merge()
      .setValue("📋 RÉCAPITULATIF PAR CATÉGORIE PROFESSIONNELLE")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["Catégorie", "Nb Postes", "Sal. Min Moyen", "Sal. Max Moyen", "Exp. Moyenne", "Postes Actifs"];
    sheet.getRange(recapRow + 1, 1, 1, 6).setValues([headersRecap])
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
        `=NB.SI(C3:C100;"${cat}")`,
        `=MOYENNE.SI(C3:C100;"${cat}";E3:E100)`,
        `=MOYENNE.SI(C3:C100;"${cat}";F3:F100)`,
        `=MOYENNE.SI(C3:C100;"${cat}";L3:L100)`,
        `=NB.SI.ENS(C3:C100;"${cat}";K3:K100;"Actif")`
      ]);
    });

    sheet.getRange(recapRow + 2, 1, categories.length, 6).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 3, categories.length, 2).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(recapRow + 2, 5, categories.length, 1).setNumberFormat('0.0" ans"');

    // Bordures
    sheet.getRange(recapRow + 1, 1, categories.length + 1, 6).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Postes protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:L100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module POSTE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module POSTE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau poste
 */
function ajouterPoste(intitule, categorie, description, salaireMin, salaireMax, competences, niveauEtude, experience, responsabilites) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    // Validation salaire max > salaire min
    if (parseFloat(salaireMax) <= parseFloat(salaireMin)) {
      throw new Error("Le salaire maximum doit être supérieur au salaire minimum");
    }

    const nouvelleLigne = [
      "",  // PosteID auto-généré
      intitule,
      categorie,
      description,
      parseFloat(salaireMin),
      parseFloat(salaireMax),
      competences,
      niveauEtude,
      parseInt(experience),
      responsabilites,
      "Actif",
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("POSTE", `Nouveau poste créé: ${intitule}`);
    }

    return {success: true, message: "Poste ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout poste: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un poste existant
 */
function modifierPoste(posteId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver le poste
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === posteId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Poste non trouvé: " + posteId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "intitule": 2,
      "categorie": 3,
      "description": 4,
      "salaireMin": 5,
      "salaireMax": 6,
      "competences": 7,
      "niveauEtude": 8,
      "experience": 9,
      "responsabilites": 10,
      "statut": 11,
      "observations": 12
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("POSTE", `Poste ${posteId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Poste modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification poste: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime un poste (désactivation recommandée plutôt que suppression)
 */
function desactiverPoste(posteId) {
  return modifierPoste(posteId, "statut", "Inactif");
}

/**
 * Recherche des postes selon critères
 */
function rechercherPostes(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "intitule": 1,
      "categorie": 2,
      "niveauEtude": 7,
      "statut": 10
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push(data[i]);
      }
    }

    return {success: true, resultats: resultats};

  } catch (error) {
    Logger.log("Erreur recherche postes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les postes actifs
 */
function obtenirPostesActifs() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const postes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][10] === "Actif") {
        postes.push({
          id: data[i][0],
          intitule: data[i][1],
          categorie: data[i][2],
          description: data[i][3],
          salaireMin: data[i][4],
          salaireMax: data[i][5],
          competences: data[i][6],
          niveauEtude: data[i][7],
          experience: data[i][8],
          responsabilites: data[i][9],
          statut: data[i][10]
        });
      }
    }

    return {success: true, postes: postes};

  } catch (error) {
    Logger.log("Erreur obtention postes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les postes par catégorie
 */
function obtenirPostesParCategorie(categorie) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const postes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][2] === categorie && data[i][1]) {
        postes.push({
          id: data[i][0],
          intitule: data[i][1],
          salaireMin: data[i][4],
          salaireMax: data[i][5],
          experience: data[i][8]
        });
      }
    }

    return {success: true, postes: postes, count: postes.length};

  } catch (error) {
    Logger.log("Erreur obtention postes par catégorie: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Vérifie si un salaire est dans la fourchette du poste
 */
function verifierSalaire(posteId, salaire) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === posteId) {
        const salaireMin = data[i][4];
        const salaireMax = data[i][5];
        const estDansForchette = salaire >= salaireMin && salaire <= salaireMax;

        return {
          success: true,
          estDansForchette: estDansForchette,
          salaireMin: salaireMin,
          salaireMax: salaireMax,
          salaire: salaire,
          message: estDansForchette
            ? "Salaire conforme à la grille"
            : `Salaire hors fourchette (${salaireMin} - ${salaireMax} FCFA)`
        };
      }
    }

    throw new Error("Poste non trouvé");

  } catch (error) {
    Logger.log("Erreur vérification salaire: " + error);
    return {success: false, message: error.message};
  }
}
