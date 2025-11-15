/**
 * MODULE UTILISATEUR - Gestion Utilisateurs et Permissions
 * Système de gestion des accès et sécurité
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE UTILISATEUR ====================

/**
 * Initialise le module UTILISATEUR avec toutes les fonctionnalités
 */
function initialiserUtilisateur() {
  try {
    Logger.log("🔐 Initialisation du module UTILISATEUR...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("🔐 Utilisateurs");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("🔐 Utilisateurs");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:M1").merge()
      .setValue("🔐 GESTION DES UTILISATEURS - SYSTÈME DE SÉCURITÉ ET PERMISSIONS")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#c5221f")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "UtilisateurID",
      "EmployeID",
      "NomUtilisateur",
      "MotDePasse",
      "Email",
      "NiveauAcces",
      "DerniereConnexion",
      "Actif",
      "DateCreation",
      "Permissions",
      "Restrictions",
      "NbConnexions",
      "Observations"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#a50e0e")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [120, 100, 180, 150, 220, 150, 160, 80, 120, 280, 280, 120, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "USR001",
        "EMP001",
        "jmbarga",
        "********",
        "jean.mbarga@toposervice.cm",
        "Admin",
        new Date(2025, 10, 14, 15, 30),
        "Oui",
        new Date(2020, 0, 15),
        "FULL_ACCESS, USER_MANAGEMENT, SYSTEM_CONFIG, REPORTS",
        "",
        156,
        "Administrateur principal"
      ],
      [
        "USR002",
        "EMP002",
        "mnkolo",
        "********",
        "marie.nkolo@toposervice.cm",
        "Chef Projet",
        new Date(2025, 10, 14, 9, 15),
        "Oui",
        new Date(2019, 8, 10),
        "PROJECT_EDIT, TASK_MANAGE, TEAM_VIEW, REPORTS",
        "NO_DELETE, NO_BUDGET_EDIT",
        243,
        "Chef de projet Nord"
      ],
      [
        "USR003",
        "EMP003",
        "ptchokothe",
        "********",
        "paul.tchokothe@toposervice.cm",
        "Topographe",
        new Date(2025, 10, 13, 17, 45),
        "Oui",
        new Date(2021, 3, 1),
        "RELEVE_EDIT, OUVRAGE_VIEW, TASK_VIEW",
        "NO_PROJECT_EDIT, NO_TEAM_MANAGE",
        87,
        "Topographe zone Ouest"
      ],
      [
        "USR004",
        "EMP004",
        "bonana",
        "********",
        "berthe.onana@toposervice.cm",
        "Lecture seule",
        new Date(2025, 10, 14, 10, 20),
        "Oui",
        new Date(2022, 1, 15),
        "VIEW_ONLY, REPORTS",
        "NO_EDIT, NO_DELETE, NO_EXPORT",
        52,
        "RH et administration"
      ],
      [
        "USR005",
        "EMP005",
        "injoya",
        "********",
        "ibrahim.njoya@toposervice.cm",
        "Topographe",
        new Date(2025, 10, 12, 14, 0),
        "Oui",
        new Date(2023, 5, 20),
        "RELEVE_EDIT, DOCUMENT_UPLOAD, OUVRAGE_VIEW",
        "NO_PROJECT_EDIT",
        34,
        "Spécialiste drone"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // UtilisateurID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(C${i})>0;"USR"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes G et I)
    sheet.getRange("G3:G100")
      .setNumberFormat("dd/mm/yyyy hh:mm")
      .setHorizontalAlignment("center");

    sheet.getRange("I3:I100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Nom Complet Employé (depuis référentiel)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Nom Complet");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(B${i}<>"";RECHERCHEV(B${i};'👤 Employés'!A:C;2;FAUX)&" "&RECHERCHEV(B${i};'👤 Employés'!A:C;3;FAUX);"")`
      );
    }
    sheet.hideColumns(14);

    // Jours depuis dernière connexion
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Jours Inactivité");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(G${i}<>"";AUJOURDHUI()-ENT(G${i});"")`
      );
    }
    sheet.getRange("O3:O100").setNumberFormat('0" jours"');
    sheet.hideColumns(15);

    // Statut activité (actif si connexion < 30 jours)
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Statut Activité");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(ET(H${i}="Oui";O${i}<=30);"Actif";SI(ET(H${i}="Oui";O${i}>30);"Inactif";SI(H${i}="Non";"Désactivé";"")))`
      );
    }
    sheet.hideColumns(16);

    // Niveau de risque sécurité
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Risque");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(F${i}="Admin";"Élevé";SI(F${i}="Chef Projet";"Moyen";SI(F${i}="Topographe";"Faible";"Très Faible")))`
      );
    }
    sheet.hideColumns(17);

    // Durée depuis création compte (en mois)
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Ancienneté Compte");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(I${i}<>"";DATEDIF(I${i};AUJOURDHUI();"M");"")`
      );
    }
    sheet.getRange("R3:R100").setNumberFormat('0" mois"');
    sheet.hideColumns(18);

    // Email valide
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Email Valide");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(E${i}="";FAUX;ET(TROUVE("@";E${i})>0;TROUVE(".";E${i})>TROUVE("@";E${i})))`
      );
    }
    sheet.hideColumns(19);

    // Nombre de permissions
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Nb Permissions");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(J${i}="";0;NBCAR(J${i})-NBCAR(SUBSTITUE(J${i};",";""))+1)`
      );
    }
    sheet.hideColumns(20);

    // Nombre de restrictions
    sheet.insertColumnAfter(20);
    sheet.getRange("U2").setValue("Nb Restrictions");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`U${i}`).setFormula(
        `=SI(K${i}="";0;NBCAR(K${i})-NBCAR(SUBSTITUE(K${i};",";""))+1)`
      );
    }
    sheet.hideColumns(21);

    // ===== VALIDATION DES DONNÉES =====

    // EmployeID - Liste déroulante depuis référentiel Employés
    const regleEmploye = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("👤 Employés").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un employé existant")
      .build();
    sheet.getRange("B3:B100").setDataValidation(regleEmploye);

    // NomUtilisateur - Unique, alphanumerique, 3-20 caractères
    const regleNomUtilisateur = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(NBCAR(C3)>=3;NBCAR(C3)<=20;NB.SI(C:C;C3)=1)')
      .setAllowInvalid(false)
      .setHelpText("Nom d'utilisateur unique, 3-20 caractères alphanumérique")
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleNomUtilisateur);

    // Email - Format email
    const regleEmail = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(TROUVE("@";E3)>0;TROUVE(".";E3)>TROUVE("@";E3))')
      .setAllowInvalid(false)
      .setHelpText("Entrez un email valide (ex: nom.prenom@toposervice.cm)")
      .build();
    sheet.getRange("E3:E100").setDataValidation(regleEmail);

    // NiveauAcces - Liste des niveaux
    const regleNiveauAcces = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Admin", "Chef Projet", "Topographe", "Lecture seule"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le niveau d'accès")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleNiveauAcces);

    // Actif - Oui/Non
    const regleActif = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Oui", "Non"], true)
      .setAllowInvalid(false)
      .setHelpText("Compte actif ou désactivé")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleActif);

    // DateCreation - Date valide, pas future
    const regleDateCreation = SpreadsheetApp.newDataValidation()
      .requireDateBefore(new Date())
      .setAllowInvalid(false)
      .setHelpText("Date de création du compte (pas future)")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleDateCreation);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // NiveauAcces - Admin (Rouge foncé)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Admin")
      .setBackground("#c5221f")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // NiveauAcces - Chef Projet (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Chef Projet")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // NiveauAcces - Topographe (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Topographe")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // NiveauAcces - Lecture seule (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Lecture seule")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Actif - Oui (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Oui")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Actif - Non (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Non")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Inactivité > 30 jours (Orange clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=O3>30')
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    // Inactivité > 90 jours (Rouge clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=O3>90')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    // Email invalide (Rouge clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=NON(S3)')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("E3:E100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:M${statsRow}`).merge()
      .setValue("📊 STATISTIQUES UTILISATEURS ET SÉCURITÉ")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#a50e0e")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Utilisateurs totaux", '=NB.SI(C3:C100;"<>"")', "Nombre total de comptes"],
      ["Comptes actifs", '=NB.SI(H3:H100;"Oui")', "Comptes activés"],
      ["Comptes désactivés", '=NB.SI(H3:H100;"Non")', "Comptes désactivés"],
      ["Administrateurs", '=NB.SI(F3:F100;"Admin")', "Comptes admin (risque élevé)"],
      ["Chefs de projet", '=NB.SI(F3:F100;"Chef Projet")', "Niveau Chef Projet"],
      ["Topographes", '=NB.SI(F3:F100;"Topographe")', "Niveau Topographe"],
      ["Lecture seule", '=NB.SI(F3:F100;"Lecture seule")', "Accès lecture uniquement"],
      ["Connexions aujourd'hui", '=NB.SI(G3:G100;">="&AUJOURDHUI())', "Connexions du jour"],
      ["Inactifs > 30 jours", '=NB.SI(O3:O100;">30")', "Comptes inactifs longue durée"],
      ["Inactifs > 90 jours", '=NB.SI(O3:O100;">90")', "Comptes à désactiver"],
      ["Taux activité 30j", '=NB.SI(O3:O100;"<=30")/NB.SI(H3:H100;"Oui")', "% comptes actifs utilisés"],
      ["Connexions totales", '=SOMME(L3:L100)', "Total connexions tous comptes"],
      ["Connexions moyennes", '=MOYENNE(L3:L100)', "Moyenne connexions par compte"],
      ["Emails valides", '=NB.SI(S3:S100;VRAI)/NB.SI(C3:C100;"<>"")', "% emails correctement formatés"],
      ["Risque élevé", '=NB.SI(Q3:Q100;"Élevé")', "Comptes à risque élevé"],
      ["Comptes avec restrictions", '=NB.SI(K3:K100;"<>"")', "Comptes avec limitations"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#c5221f")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 12, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 15, 2).setNumberFormat("0.0%");

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

    // Graphique 1: Répartition par niveau d'accès
    const chartNiveau = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("F2:F100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition par Niveau d\'Accès')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#c5221f', '#fbbc04', '#4285f4', '#9aa0a6'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartNiveau);

    // Graphique 2: Comptes actifs vs désactivés
    const chartActif = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("H2:H100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Statut des Comptes')
      .setOption('width', 450)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#ea4335'])
      .setOption('pieSliceText', 'percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartActif);

    // Graphique 3: Activité des connexions
    const chartConnexions = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("N2:N100"))
      .addRange(sheet.getRange("L2:L100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Nombre de Connexions par Utilisateur')
      .setOption('width', 700)
      .setOption('height', 400)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Connexions', format: '0'})
      .setOption('hAxis', {title: 'Utilisateur', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '80%', height: '70%'})
      .build();

    sheet.insertChart(chartConnexions);

    // Graphique 4: Jours d'inactivité
    const chartInactivite = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("N2:N100"))
      .addRange(sheet.getRange("O2:O100"))
      .setPosition(statsRow + kpis.length + 17, 10, 0, 0)
      .setOption('title', 'Jours d\'Inactivité par Utilisateur')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Jours', format: '0'})
      .setOption('hAxis', {title: 'Utilisateur', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartInactivite);

    // ===== TABLEAU RÉCAPITULATIF PAR NIVEAU =====
    const recapRow = statsRow + kpis.length + 40;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📋 ANALYSE PAR NIVEAU D'ACCÈS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#a50e0e")
      .setFontColor("#ffffff");

    const headersRecap = ["Niveau Accès", "Effectif", "% Total", "Actifs", "Connexions Moy.", "Inactifs >30j", "Avec Restrictions", "Risque"];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#c5221f")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Données récapitulatives
    const niveaux = ["Admin", "Chef Projet", "Topographe", "Lecture seule"];
    const recapData = [];

    niveaux.forEach((niveau, idx) => {
      const row = recapRow + 2 + idx;
      recapData.push([
        niveau,
        `=NB.SI(F3:F100;"${niveau}")`,
        `=NB.SI(F3:F100;"${niveau}")/NB.SI(C3:C100;"<>""")`,
        `=NB.SI.ENS(F3:F100;"${niveau}";H3:H100;"Oui")`,
        `=MOYENNE.SI(F3:F100;"${niveau}";L3:L100)`,
        `=NB.SI.ENS(F3:F100;"${niveau}";O3:O100;">30")`,
        `=NB.SI.ENS(F3:F100;"${niveau}";K3:K100;"<>""")`,
        niveau === "Admin" ? "Élevé" : niveau === "Chef Projet" ? "Moyen" : "Faible"
      ]);
    });

    sheet.getRange(recapRow + 2, 1, niveaux.length, 8).setValues(recapData);

    // Formatage du récapitulatif
    sheet.getRange(recapRow + 2, 3, niveaux.length, 1).setNumberFormat("0.0%");
    sheet.getRange(recapRow + 2, 5, niveaux.length, 1).setNumberFormat("0.0");

    // Bordures
    sheet.getRange(recapRow + 1, 1, niveaux.length + 1, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== AUDIT TRAIL - DERNIÈRES CONNEXIONS =====
    const auditRow = recapRow + niveaux.length + 4;

    sheet.getRange(`A${auditRow}:F${auditRow}`).merge()
      .setValue("🔍 AUDIT TRAIL - DERNIÈRES CONNEXIONS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersAudit = ["Utilisateur", "Nom Complet", "Niveau", "Dernière Connexion", "Jours", "Statut"];
    sheet.getRange(auditRow + 1, 1, 1, 6).setValues([headersAudit])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Formule pour afficher les 10 dernières connexions
    for (let i = 0; i < 10; i++) {
      const row = auditRow + 2 + i;
      sheet.getRange(`A${row}`).setFormula(`=SI(LIGNE()-${auditRow + 2}<=NB.SI(C3:C100;"<>""");INDEX(C3:C100;LIGNE()-${auditRow + 2});"")`);
      sheet.getRange(`B${row}`).setFormula(`=SI(A${row}<>"";RECHERCHEV(A${row};C3:N100;12;FAUX);"")`);
      sheet.getRange(`C${row}`).setFormula(`=SI(A${row}<>"";RECHERCHEV(A${row};C3:F100;4;FAUX);"")`);
      sheet.getRange(`D${row}`).setFormula(`=SI(A${row}<>"";RECHERCHEV(A${row};C3:G100;5;FAUX);"")`);
      sheet.getRange(`E${row}`).setFormula(`=SI(A${row}<>"";RECHERCHEV(A${row};C3:O100;13;FAUX);"")`);
      sheet.getRange(`F${row}`).setFormula(`=SI(A${row}<>"";RECHERCHEV(A${row};C3:P100;14;FAUX);"")`);
    }

    sheet.getRange(auditRow + 2, 4, 10, 1).setNumberFormat("dd/mm/yyyy hh:mm");

    // Bordures
    sheet.getRange(auditRow + 1, 1, 11, 6).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Utilisateurs protégée - Haute sécurité");

    // Déprotéger les plages de saisie (sauf mot de passe)
    const plagesSaisie = [
      sheet.getRange("B3:C100"),
      sheet.getRange("E3:M100")
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module UTILISATEUR initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module UTILISATEUR: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Crée un nouveau compte utilisateur
 */
function creerUtilisateur(employeId, nomUtilisateur, email, niveauAcces, permissions, restrictions) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) {
      throw new Error("La feuille Utilisateurs n'existe pas");
    }

    // Validation email
    if (!email.includes("@") || !email.includes(".")) {
      throw new Error("Email invalide");
    }

    // Vérifier unicité nom utilisateur
    const data = sheet.getDataRange().getValues();
    for (let i = 2; i < data.length; i++) {
      if (data[i][2] === nomUtilisateur) {
        throw new Error("Ce nom d'utilisateur existe déjà");
      }
    }

    // Générer mot de passe temporaire
    const motDePasseTemp = genererMotDePasseTemporaire();

    const nouvelleLigne = [
      "",  // UtilisateurID auto-généré
      employeId,
      nomUtilisateur,
      "********",  // Mot de passe hashé (à implémenter)
      email,
      niveauAcces,
      "",  // DerniereConnexion - vide
      "Oui",  // Actif par défaut
      new Date(),  // DateCreation
      permissions || "",
      restrictions || "",
      0,  // NbConnexions initial
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "UTILISATEUR", `Compte créé: ${nomUtilisateur} (${niveauAcces})`);
    }

    // Envoyer notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(employeId, `Votre compte a été créé. Login: ${nomUtilisateur}`, "URGENCE");
    }

    return {
      success: true,
      message: "Utilisateur créé avec succès",
      motDePasseTemp: motDePasseTemp
    };

  } catch (error) {
    Logger.log("Erreur création utilisateur: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Connecte un utilisateur et enregistre l'activité
 */
function connecterUtilisateur(nomUtilisateur, motDePasse) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) {
      throw new Error("La feuille Utilisateurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneUtilisateur = -1;
    let utilisateur = null;

    // Trouver l'utilisateur
    for (let i = 2; i < data.length; i++) {
      if (data[i][2] === nomUtilisateur) {
        ligneUtilisateur = i + 1;
        utilisateur = {
          id: data[i][0],
          employeId: data[i][1],
          niveauAcces: data[i][5],
          actif: data[i][7],
          permissions: data[i][9],
          restrictions: data[i][10],
          nbConnexions: data[i][11]
        };
        break;
      }
    }

    if (ligneUtilisateur === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    if (utilisateur.actif !== "Oui") {
      throw new Error("Compte désactivé");
    }

    // TODO: Vérifier mot de passe hashé (à implémenter)
    // Pour l'instant, on simule une connexion réussie

    // Mettre à jour dernière connexion
    const maintenant = new Date();
    sheet.getRange(ligneUtilisateur, 7).setValue(maintenant);

    // Incrémenter nombre de connexions
    sheet.getRange(ligneUtilisateur, 12).setValue(utilisateur.nbConnexions + 1);

    // Journaliser la connexion
    if (typeof journaliserAction === 'function') {
      journaliserAction("LOGIN", "UTILISATEUR", `Connexion: ${nomUtilisateur}`);
    }

    return {
      success: true,
      utilisateur: utilisateur,
      message: "Connexion réussie"
    };

  } catch (error) {
    Logger.log("Erreur connexion: " + error);

    // Journaliser tentative échouée
    if (typeof journaliserAction === 'function') {
      journaliserAction("LOGIN", "UTILISATEUR", `Échec connexion: ${nomUtilisateur}`, false);
    }

    return {success: false, message: error.message};
  }
}

/**
 * Désactive un compte utilisateur
 */
function desactiverUtilisateur(utilisateurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) {
      throw new Error("La feuille Utilisateurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneUtilisateur = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === utilisateurId) {
        ligneUtilisateur = i + 1;
        break;
      }
    }

    if (ligneUtilisateur === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    sheet.getRange(ligneUtilisateur, 8).setValue("Non");

    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "UTILISATEUR", `Compte désactivé: ${utilisateurId}`);
    }

    return {success: true, message: "Utilisateur désactivé"};

  } catch (error) {
    Logger.log("Erreur désactivation: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie les permissions d'un utilisateur
 */
function modifierPermissions(utilisateurId, nouvellesPermissions, nouvellesRestrictions) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) {
      throw new Error("La feuille Utilisateurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneUtilisateur = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === utilisateurId) {
        ligneUtilisateur = i + 1;
        break;
      }
    }

    if (ligneUtilisateur === -1) {
      throw new Error("Utilisateur non trouvé");
    }

    if (nouvellesPermissions !== undefined) {
      sheet.getRange(ligneUtilisateur, 10).setValue(nouvellesPermissions);
    }

    if (nouvellesRestrictions !== undefined) {
      sheet.getRange(ligneUtilisateur, 11).setValue(nouvellesRestrictions);
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "UTILISATEUR", `Permissions modifiées: ${utilisateurId}`);
    }

    return {success: true, message: "Permissions mises à jour"};

  } catch (error) {
    Logger.log("Erreur modification permissions: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
function verifierPermission(utilisateurId, permission) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) {
      throw new Error("La feuille Utilisateurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === utilisateurId) {
        const permissions = data[i][9] || "";
        const restrictions = data[i][10] || "";

        // Vérifier si la permission est dans les restrictions
        if (restrictions.includes(permission)) {
          return {success: true, autorise: false, raison: "Permission restreinte"};
        }

        // Vérifier si la permission est accordée
        if (permissions.includes(permission) || permissions.includes("FULL_ACCESS")) {
          return {success: true, autorise: true};
        }

        return {success: true, autorise: false, raison: "Permission non accordée"};
      }
    }

    throw new Error("Utilisateur non trouvé");

  } catch (error) {
    Logger.log("Erreur vérification permission: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les utilisateurs inactifs
 */
function obtenirUtilisateursInactifs(joursInactivite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheet) {
      throw new Error("La feuille Utilisateurs n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const utilisateurs = [];
    const maintenant = new Date();

    for (let i = 2; i < data.length; i++) {
      if (data[i][2]) {  // Si nom utilisateur existe
        const derniereConnexion = data[i][6];
        if (derniereConnexion) {
          const diffMs = maintenant - new Date(derniereConnexion);
          const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (diffJours >= joursInactivite) {
            utilisateurs.push({
              id: data[i][0],
              nomUtilisateur: data[i][2],
              niveauAcces: data[i][5],
              derniereConnexion: derniereConnexion,
              joursInactivite: diffJours,
              actif: data[i][7]
            });
          }
        }
      }
    }

    return {success: true, utilisateurs: utilisateurs, count: utilisateurs.length};

  } catch (error) {
    Logger.log("Erreur obtention inactifs: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un mot de passe temporaire aléatoire
 */
function genererMotDePasseTemporaire() {
  const longueur = 12;
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let motDePasse = '';

  for (let i = 0; i < longueur; i++) {
    motDePasse += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return motDePasse;
}
