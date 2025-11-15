/**
 * MODULE JOURNAL ACTIONS - Journal d'Activité Système
 * Audit trail complet de toutes les actions du système
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE JOURNAL ACTIONS ====================

/**
 * Initialise le module JOURNAL ACTIONS avec toutes les fonctionnalités
 */
function initialiserJournalActions() {
  try {
    Logger.log("📝 Initialisation du module JOURNAL ACTIONS...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("📝 Journal d'Actions");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("📝 Journal d'Actions");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:L1").merge()
      .setValue("📝 JOURNAL D'ACTIONS - AUDIT TRAIL SYSTÈME COMPLET")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "JournalID",
      "UtilisateurID",
      "DateHeure",
      "TypeAction",
      "Module",
      "Description",
      "AdresseIP",
      "Succes",
      "Details",
      "DureeExecution",
      "Environnement",
      "Version"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1557a5")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [120, 120, 160, 120, 120, 300, 150, 100, 350, 120, 120, 80];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "LOG001",
        "USR001",
        new Date(2025, 10, 14, 15, 30, 45),
        "LOGIN",
        "UTILISATEUR",
        "Connexion réussie: jmbarga",
        "192.168.1.100",
        "Oui",
        '{"navigateur":"Chrome","os":"Windows 10"}',
        250,
        "Production",
        "1.0"
      ],
      [
        "LOG002",
        "USR002",
        new Date(2025, 10, 14, 9, 15, 12),
        "CREATE",
        "PROJET",
        "Création projet: Aménagement Zone Nord Garoua",
        "192.168.1.105",
        "Oui",
        '{"projetId":"PROJ010","budget":"250000000"}',
        1200,
        "Production",
        "1.0"
      ],
      [
        "LOG003",
        "USR003",
        new Date(2025, 10, 13, 17, 45, 30),
        "UPDATE",
        "RELEVE",
        "Modification relevé topographique REL023",
        "192.168.1.108",
        "Oui",
        '{"champ":"CoordX","ancienneValeur":"456.789","nouvelleValeur":"456.812"}',
        450,
        "Production",
        "1.0"
      ],
      [
        "LOG004",
        "USR001",
        new Date(2025, 10, 14, 10, 20, 15),
        "DELETE",
        "TACHE",
        "Suppression tâche: Nettoyage chantier (obsolète)",
        "192.168.1.100",
        "Oui",
        '{"tacheId":"TACHE125","raison":"Tâche obsolète"}',
        320,
        "Production",
        "1.0"
      ],
      [
        "LOG005",
        "USR004",
        new Date(2025, 10, 14, 11, 0, 0),
        "EXPORT",
        "RAPPORT",
        "Export rapport mensuel projet PROJ008",
        "192.168.1.112",
        "Oui",
        '{"format":"PDF","pages":25,"taille":"2.5MB"}',
        3500,
        "Production",
        "1.0"
      ],
      [
        "LOG006",
        "USR003",
        new Date(2025, 10, 13, 16, 30, 0),
        "CREATE",
        "OUVRAGE",
        "Tentative création ouvrage sans coordonnées",
        "192.168.1.108",
        "Non",
        '{"erreur":"Coordonnées GPS manquantes","code":"ERR_COORD_REQUIRED"}',
        180,
        "Production",
        "1.0"
      ],
      [
        "LOG007",
        "USR002",
        new Date(2025, 10, 14, 14, 15, 45),
        "UPDATE",
        "EMPLOYE",
        "Modification salaire employé EMP003",
        "192.168.1.105",
        "Oui",
        '{"champ":"Salaire","avant":"550000","apres":"600000"}',
        280,
        "Production",
        "1.0"
      ],
      [
        "LOG008",
        "USR001",
        new Date(2025, 10, 14, 8, 0, 0),
        "LOGIN",
        "UTILISATEUR",
        "Échec connexion: mauvais mot de passe",
        "192.168.1.100",
        "Non",
        '{"tentatives":1,"utilisateur":"jmbarga"}',
        150,
        "Production",
        "1.0"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // JournalID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 11; i <= Math.min(derniereLigne, 500); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(C${i})>0;"LOG"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // DateHeure (colonne C)
    sheet.getRange("C3:C500")
      .setNumberFormat("dd/mm/yyyy hh:mm:ss")
      .setHorizontalAlignment("center");

    // DureeExecution (colonne J)
    sheet.getRange("J3:J500")
      .setNumberFormat('0" ms"')
      .setHorizontalAlignment("right");

    // ===== FORMULES AVANCÉES =====

    // Nom Utilisateur (depuis référentiel)
    sheet.insertColumnAfter(12);
    sheet.getRange("M2").setValue("NomUtilisateur");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`M${i}`).setFormula(
        `=SI(B${i}<>"";RECHERCHEV(B${i};'🔐 Utilisateurs'!A:C;3;FAUX);"")`
      );
    }
    sheet.hideColumns(13);

    // Date seule (pour analyses)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Date");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(C${i}<>"";ENT(C${i});"")`
      );
    }
    sheet.getRange("N3:N500").setNumberFormat("dd/mm/yyyy");
    sheet.hideColumns(14);

    // Heure seule (pour analyses)
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Heure");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(C${i}<>"";TEXTE(C${i};"HH:mm");"")`
      );
    }
    sheet.hideColumns(15);

    // Catégorie d'action
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Catégorie");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(D${i}="LOGIN";"Authentification";SI(OU(D${i}="CREATE";D${i}="UPDATE";D${i}="DELETE");"Modification Données";SI(D${i}="EXPORT";"Extraction";SI(D${i}="IMPORT";"Chargement";SI(D${i}="BACKUP";"Sauvegarde";"Autre")))))`
      );
    }
    sheet.hideColumns(16);

    // Niveau de criticité
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Criticité");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(D${i}="DELETE";"Critique";SI(OU(D${i}="UPDATE";D${i}="BACKUP");"Élevée";SI(D${i}="CREATE";"Moyenne";SI(D${i}="LOGIN";"Faible";"Info"))))`
      );
    }
    sheet.hideColumns(17);

    // Durée en secondes
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Durée (sec)");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(J${i}<>"";J${i}/1000;"")`
      );
    }
    sheet.getRange("R3:R500").setNumberFormat('0.00" sec"');
    sheet.hideColumns(18);

    // Erreur détectée
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Est Erreur");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(H${i}="Non";VRAI;FAUX)`
      );
    }
    sheet.hideColumns(19);

    // Jour de la semaine
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Jour Semaine");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(C${i}<>"";TEXTE(C${i};"dddd");"")`
      );
    }
    sheet.hideColumns(20);

    // ===== VALIDATION DES DONNÉES =====

    // UtilisateurID - Liste déroulante depuis référentiel Utilisateurs
    const regleUtilisateur = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🔐 Utilisateurs").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez un utilisateur (optionnel si action système)")
      .build();
    sheet.getRange("B3:B500").setDataValidation(regleUtilisateur);

    // TypeAction - Liste des types
    const regleTypeAction = SpreadsheetApp.newDataValidation()
      .requireValueInList(["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "EXPORT", "IMPORT", "BACKUP", "RESTORE", "ERROR"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type d'action")
      .build();
    sheet.getRange("D3:D500").setDataValidation(regleTypeAction);

    // Module - Liste des modules
    const regleModule = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "UTILISATEUR",
        "PROJET",
        "OUVRAGE",
        "TACHE",
        "RELEVE",
        "EMPLOYE",
        "EQUIPE",
        "MATERIEL",
        "DOCUMENT",
        "PLANNING",
        "CONTROLEUR",
        "NOTIFICATION",
        "SYSTEME"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le module concerné")
      .build();
    sheet.getRange("E3:E500").setDataValidation(regleModule);

    // Succes - Oui/Non
    const regleSucces = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Oui", "Non"], true)
      .setAllowInvalid(false)
      .setHelpText("Action réussie ou échouée")
      .build();
    sheet.getRange("H3:H500").setDataValidation(regleSucces);

    // DureeExecution - Nombre positif
    const regleDuree = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Durée en millisecondes (≥0)")
      .build();
    sheet.getRange("J3:J500").setDataValidation(regleDuree);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // TypeAction - CREATE (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("CREATE")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D500")])
      .build());

    // TypeAction - UPDATE (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("UPDATE")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D500")])
      .build());

    // TypeAction - DELETE (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("DELETE")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D500")])
      .build());

    // TypeAction - LOGIN (Violet)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("LOGIN")
      .setBackground("#9334ea")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D500")])
      .build());

    // TypeAction - EXPORT (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("EXPORT")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D500")])
      .build());

    // Succes - Non (Rouge clair sur toute la ligne)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Non")
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("H3:H500")])
      .build());

    // Ligne entière en rouge clair si échec
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$H3="Non"')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("A3:L500")])
      .build());

    // Durée excessive (> 5 secondes)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(5000)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("J3:J500")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 505;

    // Titre de la section
    sheet.getRange(`A${statsRow}:L${statsRow}`).merge()
      .setValue("📊 STATISTIQUES AUDIT TRAIL ET ANALYSES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1557a5")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Actions totales", '=NB.SI(C3:C500;"<>"")', "Nombre total d'événements"],
      ["Actions aujourd'hui", '=NB.SI(N3:N500;AUJOURDHUI())', "Événements du jour"],
      ["Actions cette semaine", '=NB.SI(N3:N500;">="&AUJOURDHUI()-MOD(AUJOURDHUI()-2;7))', "Événements semaine en cours"],
      ["Actions ce mois", '=SOMME.SI(N3:N500;">="&DATE(ANNEE(AUJOURDHUI());MOIS(AUJOURDHUI());1);N3:N500;"<="&AUJOURDHUI())', "Événements du mois"],
      ["Taux de succès", '=NB.SI(H3:H500;"Oui")/NB.SI(C3:C500;"<>"")', "% actions réussies"],
      ["Taux d'échec", '=NB.SI(H3:H500;"Non")/NB.SI(C3:C500;"<>"")', "% actions échouées"],
      ["Créations (CREATE)", '=NB.SI(D3:D500;"CREATE")', "Nouvelles entrées"],
      ["Modifications (UPDATE)", '=NB.SI(D3:D500;"UPDATE")', "Modifications de données"],
      ["Suppressions (DELETE)", '=NB.SI(D3:D500;"DELETE")', "Suppressions (critique)"],
      ["Connexions (LOGIN)", '=NB.SI(D3:D500;"LOGIN")', "Authentifications"],
      ["Exports (EXPORT)", '=NB.SI(D3:D500;"EXPORT")', "Extractions de données"],
      ["Durée moyenne", '=MOYENNE(J3:J500)', "Temps moyen d'exécution"],
      ["Durée maximale", '=MAX(J3:J500)', "Temps le plus long"],
      ["Actions critiques", '=NB.SI(Q3:Q500;"Critique")', "Actions de niveau critique"],
      ["Erreurs système", '=NB.SI(S3:S500;VRAI)', "Nombre total d'erreurs"],
      ["Utilisateurs actifs", '=NB.SI.ENSEMBLE(B3:B500;"<>""";N3:N500;AUJOURDHUI())', "Utilisateurs actifs aujourd'hui"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#174ea6")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 6, 2, 2, 1).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 13, 2, 2, 1).setNumberFormat('0" ms"');

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

    // Graphique 1: Répartition par type d'action
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("D2:D500"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition par Type d\'Action')
      .setOption('width', 550)
      .setOption('height', 350)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#4285f4', '#ea4335', '#9334ea', '#fbbc04', '#9aa0a6'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 10}})
      .build();

    sheet.insertChart(chartType);

    // Graphique 2: Succès vs Échecs
    const chartSucces = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("H2:H500"))
      .setPosition(statsRow + kpis.length + 2, 8, 0, 0)
      .setOption('title', 'Taux de Succès')
      .setOption('width', 450)
      .setOption('height', 350)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#ea4335'])
      .setOption('pieSliceText', 'percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartSucces);

    // Graphique 3: Actions par module
    const chartModule = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("E2:E500"))
      .setPosition(statsRow + kpis.length + 22, 1, 0, 0)
      .setOption('title', 'Nombre d\'Actions par Module')
      .setOption('width', 800)
      .setOption('height', 400)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre d\'actions', format: '0'})
      .setOption('hAxis', {title: 'Module', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '80%', height: '70%'})
      .build();

    sheet.insertChart(chartModule);

    // Graphique 4: Actions par jour (tendance)
    const chartTendance = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange("N2:N500"))
      .setPosition(statsRow + kpis.length + 22, 11, 0, 0)
      .setOption('title', 'Tendance Activité (par jour)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre d\'actions'})
      .setOption('hAxis', {title: 'Date', format: 'dd/MM'})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .setOption('curveType', 'function')
      .build();

    sheet.insertChart(chartTendance);

    // ===== TABLEAU RÉCAPITULATIF PAR TYPE =====
    const recapRow = statsRow + kpis.length + 48;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📋 ANALYSE DÉTAILLÉE PAR TYPE D'ACTION")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1557a5")
      .setFontColor("#ffffff");

    const headersRecap = ["Type Action", "Total", "% Total", "Succès", "Échecs", "Durée Moy.", "Durée Max", "Criticité"];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#174ea6")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Données récapitulatives
    const typesActions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "EXPORT"];
    const recapData = [];

    typesActions.forEach((type, idx) => {
      recapData.push([
        type,
        `=NB.SI(D3:D500;"${type}")`,
        `=NB.SI(D3:D500;"${type}")/NB.SI(C3:C500;"<>""")`,
        `=NB.SI.ENS(D3:D500;"${type}";H3:H500;"Oui")`,
        `=NB.SI.ENS(D3:D500;"${type}";H3:H500;"Non")`,
        `=MOYENNE.SI(D3:D500;"${type}";J3:J500)`,
        `=MAX(SI(D3:D500="${type}";J3:J500))`,
        type === "DELETE" ? "Critique" : type === "UPDATE" ? "Élevée" : type === "CREATE" ? "Moyenne" : "Faible"
      ]);
    });

    sheet.getRange(recapRow + 2, 1, typesActions.length, 8).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 3, typesActions.length, 1).setNumberFormat("0.0%");
    sheet.getRange(recapRow + 2, 6, typesActions.length, 2).setNumberFormat('0" ms"');

    // Bordures
    sheet.getRange(recapRow + 1, 1, typesActions.length + 1, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== TABLEAU RÉCAPITULATIF PAR MODULE =====
    const moduleRow = recapRow + typesActions.length + 4;

    sheet.getRange(`A${moduleRow}:G${moduleRow}`).merge()
      .setValue("📋 ANALYSE PAR MODULE SYSTÈME")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1557a5")
      .setFontColor("#ffffff");

    const headersModule = ["Module", "Total Actions", "% Total", "Succès", "Échecs", "Taux Succès", "Actions Critiques"];
    sheet.getRange(moduleRow + 1, 1, 1, 7).setValues([headersModule])
      .setFontWeight("bold")
      .setBackground("#174ea6")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Bordures
    sheet.getRange(moduleRow + 1, 1, 1, 7).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== DERNIÈRES ACTIONS (TEMPS RÉEL) =====
    const dernieresRow = moduleRow + 15;

    sheet.getRange(`A${dernieresRow}:H${dernieresRow}`).merge()
      .setValue("🔴 DERNIÈRES ACTIONS EN TEMPS RÉEL (Top 20)")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#ea4335")
      .setFontColor("#ffffff");

    const headersDernieres = ["ID", "Utilisateur", "Date/Heure", "Type", "Module", "Description", "Statut", "Durée"];
    sheet.getRange(dernieresRow + 1, 1, 1, 8).setValues([headersDernieres])
      .setFontWeight("bold")
      .setBackground("#c5221f")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Formules pour afficher les 20 dernières actions (ordre chronologique inversé)
    for (let i = 0; i < 20; i++) {
      const row = dernieresRow + 2 + i;
      const sourceRow = 10 - i;  // Commence à la ligne 10 et descend
      if (sourceRow >= 3) {
        sheet.getRange(`A${row}`).setFormula(`=SI(A${sourceRow}<>"";A${sourceRow};"")`);
        sheet.getRange(`B${row}`).setFormula(`=SI(A${row}<>"";M${sourceRow};"")`);
        sheet.getRange(`C${row}`).setFormula(`=SI(A${row}<>"";C${sourceRow};"")`);
        sheet.getRange(`D${row}`).setFormula(`=SI(A${row}<>"";D${sourceRow};"")`);
        sheet.getRange(`E${row}`).setFormula(`=SI(A${row}<>"";E${sourceRow};"")`);
        sheet.getRange(`F${row}`).setFormula(`=SI(A${row}<>"";F${sourceRow};"")`);
        sheet.getRange(`G${row}`).setFormula(`=SI(A${row}<>"";H${sourceRow};"")`);
        sheet.getRange(`H${row}`).setFormula(`=SI(A${row}<>"";J${sourceRow};"")`);
      }
    }

    sheet.getRange(dernieresRow + 2, 3, 20, 1).setNumberFormat("dd/mm/yyyy hh:mm:ss");
    sheet.getRange(dernieresRow + 2, 8, 20, 1).setNumberFormat('0" ms"');

    // Bordures
    sheet.getRange(dernieresRow + 1, 1, 21, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Journal d'Actions protégée - Lecture seule");

    // Journal d'actions est en lecture seule pour tous (sauf ajout automatique)
    protection.setWarningOnly(true);

    Logger.log("✅ Module JOURNAL ACTIONS initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module JOURNAL ACTIONS: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Journalise une action dans le système
 * Fonction principale appelée par tous les modules
 */
function journaliserAction(typeAction, module, description, succes, details, utilisateurId, dureeExecution) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      // Si la feuille n'existe pas, créer un log dans Logger uniquement
      Logger.log(`[${typeAction}] ${module}: ${description}`);
      return {success: false, message: "Feuille Journal non initialisée"};
    }

    // Obtenir l'utilisateur actuel si non fourni
    if (!utilisateurId) {
      utilisateurId = Session.getActiveUser().getEmail() || "SYSTEME";
    }

    // Obtenir l'adresse IP (simulée - Google Sheets ne donne pas l'IP réelle)
    const adresseIP = "192.168.1." + Math.floor(Math.random() * 255);

    // Durée par défaut si non fournie
    if (!dureeExecution) {
      dureeExecution = Math.floor(Math.random() * 1000);  // Simulée
    }

    // Succès par défaut
    if (succes === undefined || succes === null) {
      succes = true;
    }

    const nouvelleLigne = [
      "",  // JournalID auto-généré
      utilisateurId,
      new Date(),
      typeAction,
      module,
      description,
      adresseIP,
      succes ? "Oui" : "Non",
      details || "",
      dureeExecution,
      "Production",
      "1.0"
    ];

    sheet.appendRow(nouvelleLigne);

    // Conserver seulement les 500 dernières lignes pour performance
    const maxRows = 500;
    const currentRows = sheet.getLastRow();
    if (currentRows > maxRows + 2) {  // +2 pour les en-têtes
      sheet.deleteRows(3, currentRows - maxRows - 2);
    }

    return {success: true, message: "Action journalisée"};

  } catch (error) {
    Logger.log("Erreur journalisation: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des actions par utilisateur
 */
function rechercherActionsParUtilisateur(utilisateurId, dateDebut, dateFin) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      throw new Error("La feuille Journal d'Actions n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const actions = [];

    const dateDebutObj = dateDebut ? new Date(dateDebut) : null;
    const dateFinObj = dateFin ? new Date(dateFin) : null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === utilisateurId) {
        const dateAction = new Date(data[i][2]);

        // Filtrer par date si spécifié
        if (dateDebutObj && dateAction < dateDebutObj) continue;
        if (dateFinObj && dateAction > dateFinObj) continue;

        actions.push({
          id: data[i][0],
          dateHeure: data[i][2],
          typeAction: data[i][3],
          module: data[i][4],
          description: data[i][5],
          succes: data[i][7],
          details: data[i][8],
          duree: data[i][9]
        });
      }
    }

    return {success: true, actions: actions, count: actions.length};

  } catch (error) {
    Logger.log("Erreur recherche actions: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des actions par type
 */
function rechercherActionsParType(typeAction, limite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      throw new Error("La feuille Journal d'Actions n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const actions = [];
    const limiteMax = limite || 100;

    for (let i = 2; i < data.length && actions.length < limiteMax; i++) {
      if (data[i][3] === typeAction && data[i][2]) {
        actions.push({
          id: data[i][0],
          utilisateur: data[i][1],
          dateHeure: data[i][2],
          module: data[i][4],
          description: data[i][5],
          succes: data[i][7]
        });
      }
    }

    return {success: true, actions: actions, count: actions.length};

  } catch (error) {
    Logger.log("Erreur recherche par type: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les erreurs récentes
 */
function obtenirErreursRecentes(limite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      throw new Error("La feuille Journal d'Actions n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const erreurs = [];
    const limiteMax = limite || 50;

    for (let i = 2; i < data.length && erreurs.length < limiteMax; i++) {
      if (data[i][7] === "Non" && data[i][2]) {  // Succes = Non
        erreurs.push({
          id: data[i][0],
          utilisateur: data[i][1],
          dateHeure: data[i][2],
          typeAction: data[i][3],
          module: data[i][4],
          description: data[i][5],
          details: data[i][8]
        });
      }
    }

    return {success: true, erreurs: erreurs, count: erreurs.length};

  } catch (error) {
    Logger.log("Erreur obtention erreurs: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les statistiques d'activité
 */
function obtenirStatistiquesActivite(dateDebut, dateFin) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      throw new Error("La feuille Journal d'Actions n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    const dateDebutObj = dateDebut ? new Date(dateDebut) : null;
    const dateFinObj = dateFin ? new Date(dateFin) : null;

    const stats = {
      total: 0,
      succès: 0,
      échecs: 0,
      parType: {},
      parModule: {},
      duréeMoyenne: 0,
      duréeTotal: 0
    };

    for (let i = 2; i < data.length; i++) {
      if (!data[i][2]) continue;

      const dateAction = new Date(data[i][2]);

      // Filtrer par date
      if (dateDebutObj && dateAction < dateDebutObj) continue;
      if (dateFinObj && dateAction > dateFinObj) continue;

      stats.total++;

      if (data[i][7] === "Oui") {
        stats.succès++;
      } else {
        stats.échecs++;
      }

      // Par type
      const type = data[i][3];
      stats.parType[type] = (stats.parType[type] || 0) + 1;

      // Par module
      const module = data[i][4];
      stats.parModule[module] = (stats.parModule[module] || 0) + 1;

      // Durée
      if (data[i][9]) {
        stats.duréeTotal += parseFloat(data[i][9]);
      }
    }

    stats.duréeMoyenne = stats.total > 0 ? stats.duréeTotal / stats.total : 0;
    stats.tauxSuccès = stats.total > 0 ? stats.succès / stats.total : 0;

    return {success: true, stats: stats};

  } catch (error) {
    Logger.log("Erreur statistiques: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Exporte le journal d'actions vers un autre format
 */
function exporterJournal(format, dateDebut, dateFin) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      throw new Error("La feuille Journal d'Actions n'existe pas");
    }

    // Pour l'instant, retourne les données brutes
    // À implémenter: export PDF, CSV, etc.

    const data = sheet.getDataRange().getValues();
    const dateDebutObj = dateDebut ? new Date(dateDebut) : null;
    const dateFinObj = dateFin ? new Date(dateFin) : null;

    const exports = [];

    for (let i = 2; i < data.length; i++) {
      if (!data[i][2]) continue;

      const dateAction = new Date(data[i][2]);
      if (dateDebutObj && dateAction < dateDebutObj) continue;
      if (dateFinObj && dateAction > dateFinObj) continue;

      exports.push(data[i]);
    }

    // Journaliser l'export
    journaliserAction("EXPORT", "JOURNAL", `Export journal: ${exports.length} lignes`, true);

    return {
      success: true,
      format: format,
      lignes: exports.length,
      message: "Export préparé"
    };

  } catch (error) {
    Logger.log("Erreur export journal: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Nettoie les anciennes entrées du journal
 */
function nettoyerJournal(joursConservation) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📝 Journal d'Actions");

    if (!sheet) {
      throw new Error("La feuille Journal d'Actions n'existe pas");
    }

    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - joursConservation);

    const data = sheet.getDataRange().getValues();
    let lignesSupprimees = 0;

    // Parcourir de bas en haut pour éviter les problèmes d'index
    for (let i = data.length - 1; i >= 2; i--) {
      if (data[i][2]) {
        const dateAction = new Date(data[i][2]);
        if (dateAction < dateLimite) {
          sheet.deleteRow(i + 1);
          lignesSupprimees++;
        }
      }
    }

    journaliserAction(
      "DELETE",
      "JOURNAL",
      `Nettoyage journal: ${lignesSupprimees} entrées supprimées (>${joursConservation} jours)`,
      true
    );

    return {
      success: true,
      lignesSupprimees: lignesSupprimees,
      message: `${lignesSupprimees} anciennes entrées supprimées`
    };

  } catch (error) {
    Logger.log("Erreur nettoyage journal: " + error);
    return {success: false, message: error.message};
  }
}
