/**
 * MODULE NOTIFICATION - Système de Notifications
 * Gestion complète des notifications et alertes système
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE NOTIFICATION ====================

/**
 * Initialise le module NOTIFICATION avec toutes les fonctionnalités
 */
function initialiserNotification() {
  try {
    Logger.log("🔔 Initialisation du module NOTIFICATION...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("🔔 Notifications");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("🔔 Notifications");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:M1").merge()
      .setValue("🔔 SYSTÈME DE NOTIFICATIONS - ALERTES ET COMMUNICATIONS")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#fbbc04")
      .setFontColor("#000000");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "NotificationID",
      "UtilisateurID",
      "Type",
      "Message",
      "DateCreation",
      "DateLecture",
      "Lu",
      "Priorite",
      "Module",
      "ActionRequise",
      "Lien",
      "ExpireDate",
      "Statut"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f29900")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [130, 120, 100, 350, 140, 140, 70, 100, 120, 150, 200, 120, 100];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "NOT001",
        "USR002",
        "Alerte",
        "Retard projet PROJ008: Dépassement échéance de 5 jours",
        new Date(2025, 10, 14, 9, 0),
        new Date(2025, 10, 14, 9, 30),
        "Oui",
        "Haute",
        "PROJET",
        "Vérifier planning",
        "/projets/PROJ008",
        new Date(2025, 10, 20),
        "Actif"
      ],
      [
        "NOT002",
        "USR001",
        "Urgence",
        "Validation urgente requise: Document technique OUV045",
        new Date(2025, 10, 14, 10, 15),
        "",
        "Non",
        "Critique",
        "DOCUMENT",
        "Valider document",
        "/documents/DOC123",
        new Date(2025, 10, 15),
        "Actif"
      ],
      [
        "NOT003",
        "USR003",
        "Info",
        "Nouvelle tâche assignée: Levé topographique secteur Nord",
        new Date(2025, 10, 13, 14, 20),
        new Date(2025, 10, 13, 15, 0),
        "Oui",
        "Normale",
        "TACHE",
        "Consulter tâche",
        "/taches/TACHE156",
        new Date(2025, 10, 25),
        "Actif"
      ],
      [
        "NOT004",
        "USR002",
        "Alerte",
        "Budget projet PROJ008: 85% consommé",
        new Date(2025, 10, 13, 11, 0),
        new Date(2025, 10, 13, 11, 45),
        "Oui",
        "Haute",
        "BUDGET",
        "Réviser budget",
        "/projets/PROJ008/budget",
        new Date(2025, 10, 30),
        "Actif"
      ],
      [
        "NOT005",
        "USR004",
        "Info",
        "Nouveau rapport mensuel disponible pour octobre 2025",
        new Date(2025, 10, 14, 8, 0),
        "",
        "Non",
        "Normale",
        "RAPPORT",
        "Consulter rapport",
        "/rapports/2025-10",
        new Date(2025, 11, 14),
        "Actif"
      ],
      [
        "NOT006",
        "USR003",
        "Urgence",
        "Matériel GPS RTK #MAT003 nécessite maintenance urgente",
        new Date(2025, 10, 12, 16, 30),
        new Date(2025, 10, 13, 8, 0),
        "Oui",
        "Critique",
        "MATERIEL",
        "Planifier maintenance",
        "/materiel/MAT003",
        new Date(2025, 10, 16),
        "Actif"
      ],
      [
        "NOT007",
        "USR001",
        "Info",
        "Sauvegarde système complétée avec succès",
        new Date(2025, 10, 14, 2, 0),
        new Date(2025, 10, 14, 8, 15),
        "Oui",
        "Faible",
        "SYSTEME",
        "Aucune",
        "",
        new Date(2025, 10, 21),
        "Actif"
      ],
      [
        "NOT008",
        "USR002",
        "Alerte",
        "3 employés sans affectation d'équipe",
        new Date(2025, 10, 13, 9, 0),
        "",
        "Non",
        "Normale",
        "EMPLOYE",
        "Affecter équipes",
        "/employes/non-affectes",
        new Date(2025, 10, 20),
        "Actif"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // NotificationID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 11; i <= Math.min(derniereLigne, 500); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(D${i})>0;"NOT"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes E, F, L)
    sheet.getRange("E3:F500")
      .setNumberFormat("dd/mm/yyyy hh:mm")
      .setHorizontalAlignment("center");

    sheet.getRange("L3:L500")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Nom Utilisateur (depuis référentiel)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("NomUtilisateur");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(B${i}<>"";RECHERCHEV(B${i};'🔐 Utilisateurs'!A:C;3;FAUX);"")`
      );
    }
    sheet.hideColumns(14);

    // Âge notification (heures depuis création)
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Âge (heures)");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(E${i}<>"";(MAINTENANT()-E${i})*24;"")`
      );
    }
    sheet.getRange("O3:O500").setNumberFormat('0.0" h"');
    sheet.hideColumns(15);

    // Délai de lecture (minutes)
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Délai Lecture");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(ET(E${i}<>"";F${i}<>"");(F${i}-E${i})*24*60;"")`
      );
    }
    sheet.getRange("P3:P500").setNumberFormat('0" min"');
    sheet.hideColumns(16);

    // Jours avant expiration
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Jours Restants");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(L${i}<>"";L${i}-AUJOURDHUI();"")`
      );
    }
    sheet.getRange("Q3:Q500").setNumberFormat('0" jours"');
    sheet.hideColumns(17);

    // Expirée (Oui/Non)
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Expirée");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(L${i}<>"";SI(L${i}<AUJOURDHUI();"Oui";"Non");"")`
      );
    }
    sheet.hideColumns(18);

    // Badge notification (icône selon type)
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Badge");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(C${i}="Urgence";"🚨";SI(C${i}="Alerte";"⚠️";SI(C${i}="Info";"ℹ️";"📢")))`
      );
    }
    sheet.hideColumns(19);

    // Score urgence (pour tri)
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Score Urgence");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(D${i}="";0;(SI(H${i}="Critique";100;SI(H${i}="Haute";75;SI(H${i}="Normale";50;25)))+(SI(G${i}="Non";50;0))+(SI(Q${i}<3;30;SI(Q${i}<7;15;0)))))`
      );
    }
    sheet.hideColumns(20);

    // ===== VALIDATION DES DONNÉES =====

    // UtilisateurID - Liste déroulante depuis référentiel Utilisateurs
    const regleUtilisateur = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🔐 Utilisateurs").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un utilisateur")
      .build();
    sheet.getRange("B3:B500").setDataValidation(regleUtilisateur);

    // Type - Liste des types
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Info", "Alerte", "Urgence", "Succès", "Erreur"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type de notification")
      .build();
    sheet.getRange("C3:C500").setDataValidation(regleType);

    // Lu - Oui/Non
    const regleLu = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Oui", "Non"], true)
      .setAllowInvalid(false)
      .setHelpText("Notification lue ou non lue")
      .build();
    sheet.getRange("G3:G500").setDataValidation(regleLu);

    // Priorite - Liste des niveaux
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Critique", "Haute", "Normale", "Faible"], true)
      .setAllowInvalid(false)
      .setHelpText("Niveau de priorité")
      .build();
    sheet.getRange("H3:H500").setDataValidation(reglePriorite);

    // Module - Liste des modules
    const regleModule = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "PROJET",
        "OUVRAGE",
        "TACHE",
        "RELEVE",
        "EMPLOYE",
        "EQUIPE",
        "MATERIEL",
        "DOCUMENT",
        "PLANNING",
        "BUDGET",
        "CONTROLEUR",
        "UTILISATEUR",
        "SYSTEME"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Module source de la notification")
      .build();
    sheet.getRange("I3:I500").setDataValidation(regleModule);

    // Statut - Liste des statuts
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "Archivé", "Supprimé"], true)
      .setAllowInvalid(false)
      .setHelpText("Statut de la notification")
      .build();
    sheet.getRange("M3:M500").setDataValidation(regleStatut);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Type - Urgence (Rouge vif)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Urgence")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C500")])
      .build());

    // Type - Alerte (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Alerte")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C500")])
      .build());

    // Type - Info (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Info")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C500")])
      .build());

    // Type - Succès (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Succès")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C500")])
      .build());

    // Type - Erreur (Rouge foncé)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Erreur")
      .setBackground("#c5221f")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("C3:C500")])
      .build());

    // Lu - Non (Fond jaune clair sur toute la ligne)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$G3="Non"')
      .setBackground("#fff9c4")
      .setBold(true)
      .setRanges([sheet.getRange("A3:M500")])
      .build());

    // Priorite - Critique (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Critique")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H500")])
      .build());

    // Priorite - Haute (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Haute")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H500")])
      .build());

    // Expirée (Rouge clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$R3="Oui"')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // Expire bientôt (< 3 jours) - Orange clair
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET($Q3<3;$Q3>=0)')
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 505;

    // Titre de la section
    sheet.getRange(`A${statsRow}:M${statsRow}`).merge()
      .setValue("📊 STATISTIQUES NOTIFICATIONS ET ANALYSES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f29900")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Notifications totales", '=NB.SI(D3:D500;"<>"")', "Nombre total de notifications"],
      ["Non lues", '=NB.SI(G3:G500;"Non")', "Notifications à traiter"],
      ["Lues", '=NB.SI(G3:G500;"Oui")', "Notifications déjà consultées"],
      ["Taux de lecture", '=NB.SI(G3:G500;"Oui")/NB.SI(D3:D500;"<>"")', "% notifications lues"],
      ["Critiques non lues", '=NB.SI.ENS(H3:H500;"Critique";G3:G500;"Non")', "Urgence maximale à traiter"],
      ["Hautes non lues", '=NB.SI.ENS(H3:H500;"Haute";G3:G500;"Non")', "Priorité haute en attente"],
      ["Urgences", '=NB.SI(C3:C500;"Urgence")', "Notifications urgentes"],
      ["Alertes", '=NB.SI(C3:C500;"Alerte")', "Notifications d'alerte"],
      ["Infos", '=NB.SI(C3:C500;"Info")', "Notifications informatives"],
      ["Expirées", '=NB.SI(R3:R500;"Oui")', "Notifications expirées"],
      ["Expire < 3 jours", '=NB.SI.ENS(Q3:Q500;"<3";Q3:Q500;">=0")', "À traiter rapidement"],
      ["Délai lecture moyen", '=MOYENNE(P3:P500)', "Temps moyen avant lecture"],
      ["Âge moyen", '=MOYENNE(O3:O500)', "Ancienneté moyenne notifications"],
      ["Avec action requise", '=NB.SI(J3:J500;"<>"")', "Nécessitent une action"],
      ["Notifications aujourd'hui", '=NB.SI(E3:E500;">="&AUJOURDHUI())', "Créées aujourd'hui"],
      ["Lues aujourd'hui", '=NB.SI(F3:F500;">="&AUJOURDHUI())', "Consultées aujourd'hui"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 5, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 13, 2).setNumberFormat('0" min"');
    sheet.getRange(statsRow + 14, 2).setNumberFormat('0.0" h"');

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

    // Graphique 1: Répartition par type
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("C2:C500"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition par Type de Notification')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#4285f4', '#fbbc04', '#ea4335', '#34a853', '#c5221f'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartType);

    // Graphique 2: Lues vs Non lues
    const chartLu = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("G2:G500"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Statut de Lecture')
      .setOption('width', 450)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#34a853', '#fbbc04'])
      .setOption('pieSliceText', 'percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartLu);

    // Graphique 3: Notifications par module
    const chartModule = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("I2:I500"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Notifications par Module')
      .setOption('width', 700)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre', format: '0'})
      .setOption('hAxis', {title: 'Module', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '80%', height: '70%'})
      .build();

    sheet.insertChart(chartModule);

    // Graphique 4: Répartition par priorité
    const chartPriorite = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("H2:H500"))
      .setPosition(statsRow + kpis.length + 17, 10, 0, 0)
      .setOption('title', 'Répartition par Priorité')
      .setOption('width', 550)
      .setOption('height', 400)
      .setOption('colors', ['#ea4335'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre', format: '0'})
      .setOption('hAxis', {title: 'Priorité'})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartPriorite);

    // ===== TABLEAU RÉCAPITULATIF PAR UTILISATEUR =====
    const recapRow = statsRow + kpis.length + 43;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📋 NOTIFICATIONS PAR UTILISATEUR")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#f29900")
      .setFontColor("#ffffff");

    const headersRecap = ["Utilisateur", "Total", "Non Lues", "Critiques", "Hautes", "Taux Lecture", "Délai Moy.", "Plus Ancienne"];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setHorizontalAlignment("center");

    // Bordures
    sheet.getRange(recapRow + 1, 1, 1, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== BADGE NON LUS - DASHBOARD TEMPS RÉEL =====
    const badgeRow = recapRow + 15;

    sheet.getRange(`A${badgeRow}:F${badgeRow}`).merge()
      .setValue("🔴 NOTIFICATIONS NON LUES - À TRAITER")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#ea4335")
      .setFontColor("#ffffff");

    const headersBadge = ["Utilisateur", "Type", "Message", "Priorité", "Module", "Âge"];
    sheet.getRange(badgeRow + 1, 1, 1, 6).setValues([headersBadge])
      .setFontWeight("bold")
      .setBackground("#c5221f")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Afficher les 20 premières notifications non lues triées par score d'urgence
    for (let i = 0; i < 20; i++) {
      const row = badgeRow + 2 + i;
      // Ces formules devront être adaptées avec une fonction de tri complexe
      // Pour l'instant, on affiche simplement les premières non lues
    }

    // Bordures
    sheet.getRange(badgeRow + 1, 1, 21, 6).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== AUTO-NOTIFICATIONS CONFIGURÉES =====
    const autoRow = badgeRow + 25;

    sheet.getRange(`A${autoRow}:E${autoRow}`).merge()
      .setValue("⚙️ RÈGLES AUTO-NOTIFICATIONS")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersAuto = ["Règle", "Condition", "Type", "Priorité", "Actif"];
    sheet.getRange(autoRow + 1, 1, 1, 5).setValues([headersAuto])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    const reglesAuto = [
      ["Retard projet", "Échéance dépassée > 3 jours", "Alerte", "Haute", "Oui"],
      ["Budget critique", "Budget consommé > 90%", "Urgence", "Critique", "Oui"],
      ["Matériel maintenance", "Dernière maintenance > 6 mois", "Alerte", "Haute", "Oui"],
      ["Document validation", "Document en attente > 7 jours", "Alerte", "Normale", "Oui"],
      ["Tâche non assignée", "Tâche créée sans responsable", "Info", "Normale", "Oui"],
      ["Connexion suspecte", "Échec connexion > 3 fois", "Urgence", "Critique", "Oui"],
      ["Employé sans équipe", "Employé actif sans affectation", "Info", "Faible", "Oui"],
      ["Planning hebdo", "Nouveau planning publié", "Info", "Faible", "Oui"]
    ];

    sheet.getRange(autoRow + 2, 1, reglesAuto.length, 5).setValues(reglesAuto);

    // Bordures
    sheet.getRange(autoRow + 1, 1, reglesAuto.length + 1, 5).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Notifications protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:M500")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module NOTIFICATION initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module NOTIFICATION: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Envoie une notification à un utilisateur
 * Fonction principale appelée par tous les modules
 */
function envoyerNotification(utilisateurId, message, type, priorite, module, actionRequise, lien, joursExpiration) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔔 Notifications");

    if (!sheet) {
      Logger.log("Notification non envoyée (feuille manquante): " + message);
      return {success: false, message: "Feuille Notifications non initialisée"};
    }

    // Paramètres par défaut
    type = type || "Info";
    priorite = priorite || "Normale";
    module = module || "SYSTEME";
    joursExpiration = joursExpiration || 30;

    const dateExpiration = new Date();
    dateExpiration.setDate(dateExpiration.getDate() + joursExpiration);

    const nouvelleLigne = [
      "",  // NotificationID auto-généré
      utilisateurId,
      type,
      message,
      new Date(),  // DateCreation
      "",  // DateLecture - vide
      "Non",  // Lu
      priorite,
      module,
      actionRequise || "",
      lien || "",
      dateExpiration,
      "Actif"
    ];

    sheet.appendRow(nouvelleLigne);

    // TODO: Envoyer email si notification critique
    if (priorite === "Critique") {
      // envoyerEmailNotification(utilisateurId, message);
    }

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "NOTIFICATION", `Notification envoyée à ${utilisateurId}: ${message.substring(0, 50)}...`);
    }

    return {success: true, message: "Notification envoyée"};

  } catch (error) {
    Logger.log("Erreur envoi notification: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Marque une notification comme lue
 */
function marquerCommeLue(notificationId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔔 Notifications");

    if (!sheet) {
      throw new Error("La feuille Notifications n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneNotif = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === notificationId) {
        ligneNotif = i + 1;
        break;
      }
    }

    if (ligneNotif === -1) {
      throw new Error("Notification non trouvée");
    }

    // Marquer comme lue
    sheet.getRange(ligneNotif, 7).setValue("Oui");
    sheet.getRange(ligneNotif, 6).setValue(new Date());  // DateLecture

    return {success: true, message: "Notification marquée comme lue"};

  } catch (error) {
    Logger.log("Erreur marquage lecture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les notifications non lues d'un utilisateur
 */
function obtenirNotificationsNonLues(utilisateurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔔 Notifications");

    if (!sheet) {
      throw new Error("La feuille Notifications n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const notifications = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === utilisateurId && data[i][6] === "Non" && data[i][3]) {
        notifications.push({
          id: data[i][0],
          type: data[i][2],
          message: data[i][3],
          dateCreation: data[i][4],
          priorite: data[i][7],
          module: data[i][8],
          actionRequise: data[i][9],
          lien: data[i][10]
        });
      }
    }

    // Trier par priorité (Critique > Haute > Normale > Faible)
    const ordrePriorite = {"Critique": 4, "Haute": 3, "Normale": 2, "Faible": 1};
    notifications.sort((a, b) => ordrePriorite[b.priorite] - ordrePriorite[a.priorite]);

    return {success: true, notifications: notifications, count: notifications.length};

  } catch (error) {
    Logger.log("Erreur obtention notifications: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient le badge de notifications (nombre non lues)
 */
function obtenirBadgeNotifications(utilisateurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔔 Notifications");

    if (!sheet) {
      return {success: true, badge: 0};
    }

    const data = sheet.getDataRange().getValues();
    let count = 0;
    let critiques = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === utilisateurId && data[i][6] === "Non" && data[i][3]) {
        count++;
        if (data[i][7] === "Critique") {
          critiques++;
        }
      }
    }

    return {
      success: true,
      badge: count,
      critiques: critiques,
      message: count === 0 ? "Aucune notification" : `${count} notification(s) non lue(s)`
    };

  } catch (error) {
    Logger.log("Erreur badge notifications: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Archive les notifications anciennes
 */
function archiverNotifications(joursAnciennete) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔔 Notifications");

    if (!sheet) {
      throw new Error("La feuille Notifications n'existe pas");
    }

    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - joursAnciennete);

    const data = sheet.getDataRange().getValues();
    let archivees = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][4]) {  // Si DateCreation existe
        const dateCreation = new Date(data[i][4]);
        if (dateCreation < dateLimite && data[i][6] === "Oui") {  // Anciennes ET lues
          sheet.getRange(i + 1, 13).setValue("Archivé");
          archivees++;
        }
      }
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "NOTIFICATION", `${archivees} notifications archivées (>${joursAnciennete} jours)`);
    }

    return {success: true, archivees: archivees, message: `${archivees} notifications archivées`};

  } catch (error) {
    Logger.log("Erreur archivage: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime les notifications expirées
 */
function supprimerNotificationsExpirees() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🔔 Notifications");

    if (!sheet) {
      throw new Error("La feuille Notifications n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const aujourd'hui = new Date();
    let supprimees = 0;

    // Parcourir de bas en haut pour éviter les problèmes d'index
    for (let i = data.length - 1; i >= 2; i--) {
      if (data[i][11]) {  // Si ExpireDate existe
        const dateExpiration = new Date(data[i][11]);
        if (dateExpiration < aujourd'hui && data[i][6] === "Oui") {  // Expirée ET lue
          sheet.deleteRow(i + 1);
          supprimees++;
        }
      }
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("DELETE", "NOTIFICATION", `${supprimees} notifications expirées supprimées`);
    }

    return {success: true, supprimees: supprimees, message: `${supprimees} notifications supprimées`};

  } catch (error) {
    Logger.log("Erreur suppression: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Envoie une notification broadcast à tous les utilisateurs
 */
function envoyerNotificationBroadcast(message, type, priorite, module) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetUtilisateurs = ss.getSheetByName("🔐 Utilisateurs");

    if (!sheetUtilisateurs) {
      throw new Error("Impossible d'obtenir la liste des utilisateurs");
    }

    const dataUtilisateurs = sheetUtilisateurs.getDataRange().getValues();
    let envoyes = 0;

    for (let i = 2; i < dataUtilisateurs.length; i++) {
      if (dataUtilisateurs[i][0] && dataUtilisateurs[i][7] === "Oui") {  // UtilisateurID existe et Actif
        const result = envoyerNotification(
          dataUtilisateurs[i][0],
          message,
          type,
          priorite,
          module,
          "",
          "",
          7  // Expire dans 7 jours
        );

        if (result.success) {
          envoyes++;
        }
      }
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "NOTIFICATION", `Broadcast envoyé à ${envoyes} utilisateurs: ${message.substring(0, 50)}...`);
    }

    return {success: true, envoyes: envoyes, message: `Notification broadcast envoyée à ${envoyes} utilisateurs`};

  } catch (error) {
    Logger.log("Erreur broadcast: " + error);
    return {success: false, message: error.message};
  }
}
