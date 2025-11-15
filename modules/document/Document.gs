/**
 * MODULE DOCUMENT - Gestion Documents Techniques
 * Système de gestion documentaire avec versioning et workflow
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE DOCUMENT ====================

/**
 * Initialise le module DOCUMENT avec toutes les fonctionnalités
 */
function initialiserDocument() {
  try {
    Logger.log("📄 Initialisation du module DOCUMENT...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("📄 Documents");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("📄 Documents");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:P1").merge()
      .setValue("📄 GESTION DOCUMENTS TECHNIQUES - WORKFLOW ET VERSIONING")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#34a853")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "DocumentID",
      "OuvrageID",
      "ProjetID",
      "Nom",
      "Type",
      "CheminFichier",
      "DateCreation",
      "AuteurID",
      "Taille",
      "Format",
      "Statut",
      "DecisionControle",
      "DecisionHierarchie",
      "VersionDocument",
      "ControleurID",
      "DateValidation"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#188038")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [120, 120, 120, 280, 150, 300, 120, 120, 100, 80, 130, 150, 150, 80, 120, 130];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "DOC001",
        "OUV003",
        "PROJ008",
        "Plan topographique canal principal Nord",
        "Plan",
        "/documents/projets/PROJ008/plans/canal_nord_v3.dwg",
        new Date(2025, 10, 10, 14, 30),
        "USR003",
        2.5,
        "DWG",
        "Validé",
        "Conforme",
        "Approuvé",
        "3.0",
        "CTRL001",
        new Date(2025, 10, 12, 10, 0)
      ],
      [
        "DOC002",
        "OUV005",
        "PROJ008",
        "Rapport géotechnique forage F-12",
        "Rapport",
        "/documents/projets/PROJ008/rapports/geo_F12.pdf",
        new Date(2025, 10, 8, 9, 15),
        "USR002",
        5.8,
        "PDF",
        "En attente validation",
        "À vérifier",
        "",
        "1.0",
        "CTRL002",
        ""
      ],
      [
        "DOC003",
        "OUV007",
        "PROJ008",
        "Photo aérienne secteur irrigation",
        "Photo",
        "/documents/projets/PROJ008/photos/drone_20251109.jpg",
        new Date(2025, 10, 9, 16, 0),
        "USR005",
        15.2,
        "JPG",
        "Validé",
        "Conforme",
        "Approuvé",
        "1.0",
        "CTRL001",
        new Date(2025, 10, 10, 8, 30)
      ],
      [
        "DOC004",
        "OUV003",
        "PROJ008",
        "Certificat conformité béton lot 3",
        "Certificat",
        "/documents/projets/PROJ008/certificats/beton_lot3.pdf",
        new Date(2025, 10, 11, 11, 0),
        "USR002",
        0.8,
        "PDF",
        "Validé",
        "Conforme",
        "Approuvé",
        "1.0",
        "CTRL003",
        new Date(2025, 10, 11, 15, 0)
      ],
      [
        "DOC005",
        "OUV009",
        "PROJ010",
        "Compte-rendu réunion chantier 2025-11-08",
        "Compte-rendu",
        "/documents/projets/PROJ010/cr/cr_20251108.docx",
        new Date(2025, 10, 8, 17, 30),
        "USR002",
        0.3,
        "DOCX",
        "Brouillon",
        "",
        "",
        "0.9",
        "",
        ""
      ],
      [
        "DOC006",
        "OUV003",
        "PROJ008",
        "Plan topographique canal principal Nord",
        "Plan",
        "/documents/projets/PROJ008/plans/canal_nord_v2.dwg",
        new Date(2025, 10, 5, 10, 0),
        "USR003",
        2.3,
        "DWG",
        "Obsolète",
        "Non conforme",
        "Rejeté",
        "2.0",
        "CTRL001",
        new Date(2025, 10, 6, 14, 0)
      ],
      [
        "DOC007",
        "OUV012",
        "PROJ010",
        "Étude impact environnemental zone humide",
        "Rapport",
        "/documents/projets/PROJ010/etudes/impact_env.pdf",
        new Date(2025, 10, 12, 9, 0),
        "USR002",
        12.5,
        "PDF",
        "En cours de rédaction",
        "",
        "",
        "0.5",
        "",
        ""
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // DocumentID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 10; i <= Math.min(derniereLigne, 500); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(D${i})>0;"DOC"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes G et P)
    sheet.getRange("G3:G500")
      .setNumberFormat("dd/mm/yyyy hh:mm")
      .setHorizontalAlignment("center");

    sheet.getRange("P3:P500")
      .setNumberFormat("dd/mm/yyyy hh:mm")
      .setHorizontalAlignment("center");

    // Taille (colonne I) - en MB
    sheet.getRange("I3:I500")
      .setNumberFormat('0.0" MB"')
      .setHorizontalAlignment("right");

    // ===== FORMULES AVANCÉES =====

    // Nom Projet (depuis référentiel)
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Nom Projet");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(C${i}<>"";RECHERCHEV(C${i};'🏗️ Projets'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(17);

    // Nom Ouvrage (depuis référentiel)
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Nom Ouvrage");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(B${i}<>"";RECHERCHEV(B${i};'🏗️ Ouvrages'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(18);

    // Nom Auteur (depuis référentiel)
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Nom Auteur");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(H${i}<>"";RECHERCHEV(H${i};'🔐 Utilisateurs'!A:C;3;FAUX);"")`
      );
    }
    sheet.hideColumns(19);

    // Nom Contrôleur (depuis référentiel)
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Nom Contrôleur");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(O${i}<>"";RECHERCHEV(O${i};'✓ Contrôleurs'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(20);

    // Jours depuis création
    sheet.insertColumnAfter(20);
    sheet.getRange("U2").setValue("Âge (jours)");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`U${i}`).setFormula(
        `=SI(G${i}<>"";AUJOURDHUI()-ENT(G${i});"")`
      );
    }
    sheet.getRange("U3:U500").setNumberFormat('0" jours"');
    sheet.hideColumns(21);

    // Délai de validation (jours)
    sheet.insertColumnAfter(21);
    sheet.getRange("V2").setValue("Délai Validation");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`V${i}`).setFormula(
        `=SI(ET(G${i}<>"";P${i}<>"");P${i}-G${i};"")`
      );
    }
    sheet.getRange("V3:V500").setNumberFormat('0.0" jours"');
    sheet.hideColumns(22);

    // Version numérique (pour tri)
    sheet.insertColumnAfter(22);
    sheet.getRange("W2").setValue("Version Num");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`W${i}`).setFormula(
        `=SI(N${i}<>"";VALEUR(N${i});0)`
      );
    }
    sheet.hideColumns(23);

    // Workflow complet (Oui/Non)
    sheet.insertColumnAfter(23);
    sheet.getRange("X2").setValue("Workflow OK");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`X${i}`).setFormula(
        `=SI(ET(L${i}<>"";M${i}<>"";P${i}<>"");"Oui";"Non")`
      );
    }
    sheet.hideColumns(24);

    // Extension fichier
    sheet.insertColumnAfter(24);
    sheet.getRange("Y2").setValue("Extension");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Y${i}`).setFormula(
        `=SI(F${i}<>"";DROITE(F${i};TROUVE(".";SUBSTITUE(F${i};".";"";NBCAR(F${i})-NBCAR(SUBSTITUE(F${i};".";""))))-1);"")`
      );
    }
    sheet.hideColumns(25);

    // Catégorie taille
    sheet.insertColumnAfter(25);
    sheet.getRange("Z2").setValue("Catégorie Taille");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Z${i}`).setFormula(
        `=SI(I${i}="";"";SI(I${i}<1;"Petit";SI(I${i}<5;"Moyen";SI(I${i}<20;"Grand";"Très Grand"))))`
      );
    }
    sheet.hideColumns(26);

    // ===== VALIDATION DES DONNÉES =====

    // OuvrageID - Liste déroulante depuis référentiel Ouvrages
    const regleOuvrage = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🏗️ Ouvrages").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez un ouvrage (optionnel)")
      .build();
    sheet.getRange("B3:B500").setDataValidation(regleOuvrage);

    // ProjetID - Liste déroulante depuis référentiel Projets
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🏗️ Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un projet")
      .build();
    sheet.getRange("C3:C500").setDataValidation(regleProjet);

    // Type - Liste des types de documents
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Plan", "Rapport", "Photo", "Certificat", "Compte-rendu", "Étude", "Devis", "Facture", "Autre"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type de document")
      .build();
    sheet.getRange("E3:E500").setDataValidation(regleType);

    // AuteurID - Liste déroulante depuis référentiel Utilisateurs
    const regleAuteur = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🔐 Utilisateurs").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez l'auteur du document")
      .build();
    sheet.getRange("H3:H500").setDataValidation(regleAuteur);

    // Format - Liste des formats
    const regleFormat = SpreadsheetApp.newDataValidation()
      .requireValueInList(["PDF", "DWG", "DXF", "JPG", "PNG", "DOCX", "XLSX", "KML", "SHP", "CSV", "TXT"], true)
      .setAllowInvalid(false)
      .setHelpText("Format du fichier")
      .build();
    sheet.getRange("J3:J500").setDataValidation(regleFormat);

    // Statut - Liste des statuts
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Brouillon",
        "En cours de rédaction",
        "En attente validation",
        "En révision",
        "Validé",
        "Archivé",
        "Obsolète"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Statut du document")
      .build();
    sheet.getRange("K3:K500").setDataValidation(regleStatut);

    // DecisionControle - Liste des décisions
    const regleControle = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Conforme", "Non conforme", "Conforme avec réserves", "À vérifier"], true)
      .setAllowInvalid(true)
      .setHelpText("Décision du contrôleur technique")
      .build();
    sheet.getRange("L3:L500").setDataValidation(regleControle);

    // DecisionHierarchie - Liste des décisions
    const regleHierarchie = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Approuvé", "Rejeté", "Approuvé avec réserves", "En attente"], true)
      .setAllowInvalid(true)
      .setHelpText("Décision de la hiérarchie")
      .build();
    sheet.getRange("M3:M500").setDataValidation(regleHierarchie);

    // ControleurID - Liste déroulante depuis référentiel Contrôleurs
    const regleControleur = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("✓ Contrôleurs").getRange("A3:A100"), true)
      .setAllowInvalid(true)
      .setHelpText("Sélectionnez un contrôleur (optionnel)")
      .build();
    sheet.getRange("O3:O500").setDataValidation(regleControleur);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut - Validé (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Validé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K500")])
      .build());

    // Statut - En attente validation (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En attente validation")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K500")])
      .build());

    // Statut - Obsolète (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Obsolète")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K500")])
      .build());

    // Statut - Brouillon (Bleu clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Brouillon")
      .setBackground("#e8f0fe")
      .setFontColor("#000000")
      .setRanges([sheet.getRange("K3:K500")])
      .build());

    // DecisionControle - Conforme (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Conforme")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // DecisionControle - Non conforme (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Non conforme")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // DecisionHierarchie - Approuvé (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Approuvé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M500")])
      .build());

    // DecisionHierarchie - Rejeté (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Rejeté")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M500")])
      .build());

    // Documents anciens non validés (> 30 jours)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET($U3>30;$K3<>"Validé";$K3<>"Obsolète")')
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("A3:P500")])
      .build());

    // Taille excessive (> 20 MB)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(20)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("I3:I500")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 505;

    // Titre de la section
    sheet.getRange(`A${statsRow}:P${statsRow}`).merge()
      .setValue("📊 STATISTIQUES DOCUMENTAIRES ET ANALYSES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#188038")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Documents totaux", '=NB.SI(D3:D500;"<>"")', "Nombre total de documents"],
      ["Documents validés", '=NB.SI(K3:K500;"Validé")', "Documents approuvés"],
      ["En attente validation", '=NB.SI(K3:K500;"En attente validation")', "À valider"],
      ["Brouillons", '=NB.SI(K3:K500;"Brouillon")', "En cours de rédaction"],
      ["Obsolètes", '=NB.SI(K3:K500;"Obsolète")', "Documents obsolètes"],
      ["Taux validation", '=NB.SI(K3:K500;"Validé")/NB.SI(D3:D500;"<>"")', "% documents validés"],
      ["Plans techniques", '=NB.SI(E3:E500;"Plan")', "Plans topographiques/CAO"],
      ["Rapports", '=NB.SI(E3:E500;"Rapport")', "Rapports techniques"],
      ["Photos", '=NB.SI(E3:E500;"Photo")', "Photos et images"],
      ["Certificats", '=NB.SI(E3:E500;"Certificat")', "Certificats de conformité"],
      ["Taille totale", '=SOMME(I3:I500)', "Espace disque utilisé"],
      ["Taille moyenne", '=MOYENNE(I3:I500)', "Taille moyenne par document"],
      ["Délai validation moyen", '=MOYENNE(V3:V500)', "Temps moyen de validation"],
      ["Conformes", '=NB.SI(L3:L500;"Conforme")', "Décisions contrôle conformes"],
      ["Approuvés hiérarchie", '=NB.SI(M3:M500;"Approuvé")', "Approuvés par hiérarchie"],
      ["Workflow complets", '=NB.SI(X3:X500;"Oui")', "Documents avec workflow OK"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 7, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 12, 2, 2, 1).setNumberFormat('0.0" MB"');
    sheet.getRange(statsRow + 14, 2).setNumberFormat('0.0" jours"');

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
      .addRange(sheet.getRange("K2:K500"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition par Statut')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#e8f0fe', '#4285f4', '#fbbc04', '#1a73e8', '#34a853', '#9aa0a6', '#9aa0a6'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 10}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Documents par type
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("E2:E500"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Documents par Type')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre', format: '0'})
      .setOption('hAxis', {title: 'Type', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartType);

    // Graphique 3: Distribution taille des fichiers
    const chartTaille = sheet.newChart()
      .setChartType(Charts.ChartType.HISTOGRAM)
      .addRange(sheet.getRange("I2:I500"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Distribution Taille des Fichiers')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Taille (MB)', format: '0.0'})
      .setOption('vAxis', {title: 'Nombre de documents'})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartTaille);

    // Graphique 4: Workflow validation
    const chartWorkflow = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("M2:M500"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'Décisions Hiérarchie')
      .setOption('width', 500)
      .setOption('height', 400)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#ea4335', '#fbbc04', '#4285f4'])
      .setOption('pieSliceText', 'percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartWorkflow);

    // ===== TABLEAU RÉCAPITULATIF PAR PROJET =====
    const recapRow = statsRow + kpis.length + 43;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📋 DOCUMENTS PAR PROJET")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#188038")
      .setFontColor("#ffffff");

    const headersRecap = ["Projet", "Total Docs", "Validés", "En attente", "Taille Totale", "Taux Valid.", "Dernier Doc", "Formats"];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Bordures
    sheet.getRange(recapRow + 1, 1, 1, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== LISTE DOCUMENTS EN ATTENTE VALIDATION =====
    const attenteRow = recapRow + 15;

    sheet.getRange(`A${attenteRow}:H${attenteRow}`).merge()
      .setValue("⏳ DOCUMENTS EN ATTENTE DE VALIDATION")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#fbbc04")
      .setFontColor("#000000");

    const headersAttente = ["Document", "Projet", "Type", "Auteur", "Date Création", "Âge", "Contrôleur", "Priorité"];
    sheet.getRange(attenteRow + 1, 1, 1, 8).setValues([headersAttente])
      .setFontWeight("bold")
      .setBackground("#f29900")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Bordures
    sheet.getRange(attenteRow + 1, 1, 1, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== VERSIONING - HISTORIQUE VERSIONS =====
    const versionRow = attenteRow + 25;

    sheet.getRange(`A${versionRow}:G${versionRow}`).merge()
      .setValue("📋 GESTION DES VERSIONS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersVersion = ["Document", "Version", "Date", "Auteur", "Statut", "Décision", "Remarques"];
    sheet.getRange(versionRow + 1, 1, 1, 7).setValues([headersVersion])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Note sur le versioning
    sheet.getRange(versionRow + 2, 1, 1, 7).merge()
      .setValue("Chaque modification majeure d'un document génère une nouvelle version. Les versions obsolètes sont conservées pour traçabilité.")
      .setFontSize(9)
      .setFontStyle("italic")
      .setBackground("#e8f0fe")
      .setWrap(true);

    // Bordures
    sheet.getRange(versionRow + 1, 1, 2, 7).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Documents protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:P500")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module DOCUMENT initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module DOCUMENT: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau document
 */
function ajouterDocument(projetId, ouvrageId, nom, type, cheminFichier, auteurId, taille, format) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📄 Documents");

    if (!sheet) {
      throw new Error("La feuille Documents n'existe pas");
    }

    const nouvelleLigne = [
      "",  // DocumentID auto-généré
      ouvrageId || "",
      projetId,
      nom,
      type,
      cheminFichier,
      new Date(),
      auteurId,
      parseFloat(taille) || 0,
      format,
      "Brouillon",  // Statut initial
      "",  // DecisionControle
      "",  // DecisionHierarchie
      "1.0",  // Version initiale
      "",  // ControleurID
      ""  // DateValidation
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "DOCUMENT", `Document ajouté: ${nom}`);
    }

    // Notifier l'auteur
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(auteurId, `Document créé: ${nom}`, "Info", "Normale", "DOCUMENT");
    }

    return {success: true, message: "Document ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout document: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Soumet un document pour validation
 */
function soumettreValidation(documentId, controleurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📄 Documents");

    if (!sheet) {
      throw new Error("La feuille Documents n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneDoc = -1;
    let nomDoc = "";

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === documentId) {
        ligneDoc = i + 1;
        nomDoc = data[i][3];
        break;
      }
    }

    if (ligneDoc === -1) {
      throw new Error("Document non trouvé");
    }

    // Mettre à jour le statut et le contrôleur
    sheet.getRange(ligneDoc, 11).setValue("En attente validation");
    sheet.getRange(ligneDoc, 12).setValue("À vérifier");
    sheet.getRange(ligneDoc, 15).setValue(controleurId);

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "DOCUMENT", `Document ${documentId} soumis pour validation`);
    }

    // Notifier le contrôleur
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(
        controleurId,
        `Nouveau document à valider: ${nomDoc}`,
        "Alerte",
        "Haute",
        "DOCUMENT",
        "Valider document",
        `/documents/${documentId}`
      );
    }

    return {success: true, message: "Document soumis pour validation"};

  } catch (error) {
    Logger.log("Erreur soumission validation: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Valide un document (décision du contrôleur)
 */
function validerDocument(documentId, decision, decisionHierarchie) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📄 Documents");

    if (!sheet) {
      throw new Error("La feuille Documents n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneDoc = -1;
    let auteurId = "";
    let nomDoc = "";

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === documentId) {
        ligneDoc = i + 1;
        auteurId = data[i][7];
        nomDoc = data[i][3];
        break;
      }
    }

    if (ligneDoc === -1) {
      throw new Error("Document non trouvé");
    }

    // Mettre à jour les décisions
    sheet.getRange(ligneDoc, 12).setValue(decision);
    sheet.getRange(ligneDoc, 13).setValue(decisionHierarchie);
    sheet.getRange(ligneDoc, 16).setValue(new Date());

    // Mettre à jour le statut
    if (decision === "Conforme" && decisionHierarchie === "Approuvé") {
      sheet.getRange(ligneDoc, 11).setValue("Validé");
    } else if (decision === "Non conforme" || decisionHierarchie === "Rejeté") {
      sheet.getRange(ligneDoc, 11).setValue("En révision");
    }

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "DOCUMENT", `Document ${documentId} validé: ${decision} / ${decisionHierarchie}`);
    }

    // Notifier l'auteur
    if (typeof envoyerNotification === 'function') {
      const typeNotif = (decision === "Conforme" && decisionHierarchie === "Approuvé") ? "Succès" : "Alerte";
      envoyerNotification(
        auteurId,
        `Document "${nomDoc}": ${decision} / ${decisionHierarchie}`,
        typeNotif,
        "Haute",
        "DOCUMENT"
      );
    }

    return {success: true, message: "Document validé", decision: decision};

  } catch (error) {
    Logger.log("Erreur validation document: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Crée une nouvelle version d'un document
 */
function creerNouvelleVersion(documentId, nouveauChemin, nouveauNom, auteurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📄 Documents");

    if (!sheet) {
      throw new Error("La feuille Documents n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let docOriginal = null;

    // Trouver le document original
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === documentId) {
        docOriginal = {
          ligne: i + 1,
          ouvrageId: data[i][1],
          projetId: data[i][2],
          nom: data[i][3],
          type: data[i][4],
          format: data[i][9],
          version: parseFloat(data[i][13])
        };
        break;
      }
    }

    if (!docOriginal) {
      throw new Error("Document original non trouvé");
    }

    // Marquer l'ancienne version comme obsolète
    sheet.getRange(docOriginal.ligne, 11).setValue("Obsolète");

    // Calculer nouvelle version
    const nouvelleVersion = (docOriginal.version + 1).toFixed(1);

    // Créer la nouvelle version
    const nouvelleLigne = [
      "",  // DocumentID auto-généré
      docOriginal.ouvrageId,
      docOriginal.projetId,
      nouveauNom || docOriginal.nom,
      docOriginal.type,
      nouveauChemin,
      new Date(),
      auteurId,
      0,  // Taille à renseigner
      docOriginal.format,
      "Brouillon",
      "",
      "",
      nouvelleVersion,
      "",
      ""
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "DOCUMENT", `Nouvelle version ${nouvelleVersion} du document ${documentId}`);
    }

    return {success: true, message: `Version ${nouvelleVersion} créée`, version: nouvelleVersion};

  } catch (error) {
    Logger.log("Erreur création version: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les documents d'un projet
 */
function obtenirDocumentsProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📄 Documents");

    if (!sheet) {
      throw new Error("La feuille Documents n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const documents = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][2] === projetId && data[i][3]) {
        documents.push({
          id: data[i][0],
          nom: data[i][3],
          type: data[i][4],
          dateCreation: data[i][6],
          statut: data[i][10],
          version: data[i][13],
          taille: data[i][8]
        });
      }
    }

    return {success: true, documents: documents, count: documents.length};

  } catch (error) {
    Logger.log("Erreur obtention documents projet: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les documents en attente de validation
 */
function obtenirDocumentsEnAttente(controleurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📄 Documents");

    if (!sheet) {
      throw new Error("La feuille Documents n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const documents = [];

    for (let i = 2; i < data.length; i++) {
      const condition = controleurId
        ? (data[i][14] === controleurId && data[i][10] === "En attente validation")
        : (data[i][10] === "En attente validation");

      if (condition && data[i][3]) {
        documents.push({
          id: data[i][0],
          nom: data[i][3],
          type: data[i][4],
          projet: data[i][2],
          dateCreation: data[i][6],
          auteur: data[i][7],
          age: Math.floor((new Date() - new Date(data[i][6])) / (1000 * 60 * 60 * 24))
        });
      }
    }

    return {success: true, documents: documents, count: documents.length};

  } catch (error) {
    Logger.log("Erreur obtention documents en attente: " + error);
    return {success: false, message: error.message};
  }
}
