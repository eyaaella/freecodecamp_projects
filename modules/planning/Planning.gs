/**
 * MODULE PLANNING - Planning Général Projets
 * Gestion du planning hebdomadaire, mensuel et trimestriel
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE PLANNING ====================

/**
 * Initialise le module PLANNING avec toutes les fonctionnalités
 */
function initialiserPlanning() {
  try {
    Logger.log("📅 Initialisation du module PLANNING...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("📅 Planning");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("📅 Planning");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:M1").merge()
      .setValue("📅 PLANNING GÉNÉRAL PROJETS - SUIVI HEBDOMADAIRE ET MENSUEL")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#9334ea")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "PlanningID",
      "ProjetID",
      "Semaine",
      "DateDebut",
      "DateFin",
      "TypePlanning",
      "TachesPrevisionnelles",
      "TachesRealisees",
      "TauxRealisation",
      "Observations",
      "Responsable",
      "StatutSemaine",
      "Écarts"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#7c22d1")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [120, 120, 80, 120, 120, 140, 180, 180, 120, 300, 150, 140, 300];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "PLN001",
        "PROJ008",
        45,
        new Date(2025, 10, 3),
        new Date(2025, 10, 9),
        "Hebdomadaire",
        "Levés topo secteur Nord; Implantation canal; Terrassement 500m",
        "Levés topo secteur Nord; Implantation canal; Terrassement 350m",
        0.85,
        "Retard terrassement dû à la pluie. Rattrapage prévu semaine 46",
        "USR002",
        "En cours",
        "Terrassement: -30% (-150m)"
      ],
      [
        "PLN002",
        "PROJ008",
        44,
        new Date(2025, 9, 27),
        new Date(2025, 10, 2),
        "Hebdomadaire",
        "Réunion chantier; Livraison matériaux; Début terrassement",
        "Réunion chantier; Livraison matériaux; Début terrassement",
        1.00,
        "Semaine conforme au planning. Aucun écart",
        "USR002",
        "Terminé",
        "Aucun écart"
      ],
      [
        "PLN003",
        "PROJ010",
        45,
        new Date(2025, 10, 3),
        new Date(2025, 10, 9),
        "Hebdomadaire",
        "Étude impact environnemental; Photos drone; Rencontre élus locaux",
        "Étude impact environnemental (50%); Photos drone",
        0.67,
        "Rencontre élus reportée à la semaine prochaine sur leur demande",
        "USR002",
        "En cours",
        "Rencontre élus: non réalisée"
      ],
      [
        "PLN004",
        "PROJ008",
        46,
        new Date(2025, 10, 10),
        new Date(2025, 10, 16),
        "Hebdomadaire",
        "Rattrapage terrassement 150m; Contrôle qualité béton; Formation sécurité",
        "",
        0,
        "Semaine à venir - Planning prévisionnel",
        "USR002",
        "Planifié",
        ""
      ],
      [
        "PLN005",
        "PROJ008",
        "",
        new Date(2025, 10, 1),
        new Date(2025, 10, 30),
        "Mensuel",
        "Terrassement canal 2km; Implantation 15 ouvrages; Essais béton",
        "Terrassement 1.4km; Implantation 12 ouvrages; Essais béton",
        0.78,
        "Novembre: léger retard compensable en décembre",
        "USR002",
        "En cours",
        "Terrassement: -30%; Ouvrages: -20%"
      ],
      [
        "PLN006",
        "PROJ010",
        "",
        new Date(2025, 9, 1),
        new Date(2025, 11, 31),
        "Trimestriel",
        "Études préalables; Consultations publiques; Obtention autorisations",
        "Études préalables (90%); Consultations publiques (60%)",
        0.75,
        "T4 2025: avancement satisfaisant",
        "USR002",
        "En cours",
        "Autorisations: en attente"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // PlanningID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 9; i <= Math.min(derniereLigne, 500); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"PLN"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes D et E)
    sheet.getRange("D3:E500")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Taux réalisation (colonne I)
    sheet.getRange("I3:I500")
      .setNumberFormat("0%")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Nom Projet (depuis référentiel)
    sheet.insertColumnAfter(13);
    sheet.getRange("N2").setValue("Nom Projet");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`N${i}`).setFormula(
        `=SI(B${i}<>"";RECHERCHEV(B${i};'🏗️ Projets'!A:B;2;FAUX);"")`
      );
    }
    sheet.hideColumns(14);

    // Nom Responsable (depuis référentiel)
    sheet.insertColumnAfter(14);
    sheet.getRange("O2").setValue("Nom Responsable");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(K${i}<>"";RECHERCHEV(K${i};'🔐 Utilisateurs'!A:C;3;FAUX);"")`
      );
    }
    sheet.hideColumns(15);

    // Durée (jours)
    sheet.insertColumnAfter(15);
    sheet.getRange("P2").setValue("Durée (jours)");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`P${i}`).setFormula(
        `=SI(ET(D${i}<>"";E${i}<>"");E${i}-D${i}+1;"")`
      );
    }
    sheet.getRange("P3:P500").setNumberFormat('0" jours"');
    sheet.hideColumns(16);

    // Année
    sheet.insertColumnAfter(16);
    sheet.getRange("Q2").setValue("Année");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Q${i}`).setFormula(
        `=SI(D${i}<>"";ANNEE(D${i});"")`
      );
    }
    sheet.hideColumns(17);

    // Mois
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Mois");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(D${i}<>"";TEXTE(D${i};"mmmm");"")`
      );
    }
    sheet.hideColumns(18);

    // Trimestre
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Trimestre");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(D${i}<>"";CONCATENER("T";ARRONDI.SUP(MOIS(D${i})/3;0));"")`
      );
    }
    sheet.hideColumns(19);

    // Nombre de tâches prévues
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Nb Tâches Prévues");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(G${i}="";0;NBCAR(G${i})-NBCAR(SUBSTITUE(G${i};";";""))+1)`
      );
    }
    sheet.hideColumns(20);

    // Nombre de tâches réalisées
    sheet.insertColumnAfter(20);
    sheet.getRange("U2").setValue("Nb Tâches Réalisées");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`U${i}`).setFormula(
        `=SI(H${i}="";0;NBCAR(H${i})-NBCAR(SUBSTITUE(H${i};";";""))+1)`
      );
    }
    sheet.hideColumns(21);

    // Statut performance
    sheet.insertColumnAfter(21);
    sheet.getRange("V2").setValue("Performance");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`V${i}`).setFormula(
        `=SI(I${i}="";"";SI(I${i}>=1;"Excellent";SI(I${i}>=0,9;"Bon";SI(I${i}>=0,75;"Acceptable";SI(I${i}>=0,5;"Faible";"Critique")))))`
      );
    }
    sheet.hideColumns(22);

    // Écart taux (%)
    sheet.insertColumnAfter(22);
    sheet.getRange("W2").setValue("Écart %");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`W${i}`).setFormula(
        `=SI(I${i}<>"";I${i}-1;"")`
      );
    }
    sheet.getRange("W3:W500").setNumberFormat("0%");
    sheet.hideColumns(23);

    // Est en retard
    sheet.insertColumnAfter(23);
    sheet.getRange("X2").setValue("En Retard");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`X${i}`).setFormula(
        `=SI(I${i}<>"";SI(I${i}<1;VRAI;FAUX);FAUX)`
      );
    }
    sheet.hideColumns(24);

    // Est dans le futur
    sheet.insertColumnAfter(24);
    sheet.getRange("Y2").setValue("Futur");
    for (let i = 3; i <= 500; i++) {
      sheet.getRange(`Y${i}`).setFormula(
        `=SI(D${i}<>"";SI(D${i}>AUJOURDHUI();VRAI;FAUX);FAUX)`
      );
    }
    sheet.hideColumns(25);

    // ===== VALIDATION DES DONNÉES =====

    // ProjetID - Liste déroulante depuis référentiel Projets
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🏗️ Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un projet")
      .build();
    sheet.getRange("B3:B500").setDataValidation(regleProjet);

    // Semaine - Nombre entre 1 et 53
    const regleSemaine = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(1, 53)
      .setAllowInvalid(true)
      .setHelpText("Numéro de semaine (1-53) - optionnel pour mensuel/trimestriel")
      .build();
    sheet.getRange("C3:C500").setDataValidation(regleSemaine);

    // TypePlanning - Liste des types
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Hebdomadaire", "Mensuel", "Trimestriel", "Annuel"], true)
      .setAllowInvalid(false)
      .setHelpText("Type de planning")
      .build();
    sheet.getRange("F3:F500").setDataValidation(regleType);

    // TauxRealisation - Pourcentage 0-150%
    const regleTaux = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 1.5)
      .setAllowInvalid(false)
      .setHelpText("Taux de réalisation (0-150%)")
      .build();
    sheet.getRange("I3:I500").setDataValidation(regleTaux);

    // Responsable - Liste déroulante depuis référentiel Utilisateurs
    const regleResponsable = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🔐 Utilisateurs").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le responsable")
      .build();
    sheet.getRange("K3:K500").setDataValidation(regleResponsable);

    // StatutSemaine - Liste des statuts
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Planifié", "En cours", "Terminé", "Reporté", "Annulé"], true)
      .setAllowInvalid(false)
      .setHelpText("Statut de la période")
      .build();
    sheet.getRange("L3:L500").setDataValidation(regleStatut);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // StatutSemaine - Terminé (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Terminé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // StatutSemaine - En cours (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // StatutSemaine - Planifié (Violet clair)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Planifié")
      .setBackground("#e8eaed")
      .setFontColor("#000000")
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // StatutSemaine - Reporté (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Reporté")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // StatutSemaine - Annulé (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Annulé")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // TauxRealisation - Excellent (>= 100%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(1)
      .setBackground("#e6f4ea")
      .setFontColor("#137333")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I500")])
      .build());

    // TauxRealisation - Bon (90-99%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.9, 0.99)
      .setBackground("#e8f0fe")
      .setFontColor("#1967d2")
      .setRanges([sheet.getRange("I3:I500")])
      .build());

    // TauxRealisation - Acceptable (75-89%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.75, 0.89)
      .setBackground("#fef7e0")
      .setFontColor("#b06000")
      .setRanges([sheet.getRange("I3:I500")])
      .build());

    // TauxRealisation - Faible (50-74%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.5, 0.74)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setRanges([sheet.getRange("I3:I500")])
      .build());

    // TauxRealisation - Critique (< 50%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.5)
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I500")])
      .build());

    // Ligne entière si en retard significatif (< 75%)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET($I3<0,75;$I3>0;$L3="En cours")')
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("A3:M500")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 505;

    // Titre de la section
    sheet.getRange(`A${statsRow}:M${statsRow}`).merge()
      .setValue("📊 STATISTIQUES PLANNING ET ANALYSES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#7c22d1")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Plannings totaux", '=NB.SI(B3:B500;"<>"")', "Nombre total de périodes"],
      ["Hebdomadaires", '=NB.SI(F3:F500;"Hebdomadaire")', "Plannings semaine"],
      ["Mensuels", '=NB.SI(F3:F500;"Mensuel")', "Plannings mois"],
      ["Trimestriels", '=NB.SI(F3:F500;"Trimestriel")', "Plannings trimestre"],
      ["En cours", '=NB.SI(L3:L500;"En cours")', "Périodes actives"],
      ["Terminés", '=NB.SI(L3:L500;"Terminé")', "Périodes complétées"],
      ["Planifiés", '=NB.SI(L3:L500;"Planifié")', "Périodes à venir"],
      ["Taux réalisation moyen", '=MOYENNE(I3:I500)', "Moyenne tous plannings"],
      ["Taux hebdo moyen", '=MOYENNE.SI(F3:F500;"Hebdomadaire";I3:I500)', "Performance hebdomadaire"],
      ["Taux mensuel moyen", '=MOYENNE.SI(F3:F500;"Mensuel";I3:I500)', "Performance mensuelle"],
      ["Plannings en retard", '=NB.SI(X3:X500;VRAI)', "Taux < 100%"],
      ["Performance excellente", '=NB.SI(V3:V500;"Excellent")', "Taux ≥ 100%"],
      ["Performance critique", '=NB.SI(V3:V500;"Critique")', "Taux < 50%"],
      ["Écart moyen", '=MOYENNE(W3:W500)', "Écart % moyen"],
      ["Tâches prévues totales", '=SOMME(T3:T500)', "Total tâches planifiées"],
      ["Tâches réalisées totales", '=SOMME(U3:U500)', "Total tâches effectuées"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#9334ea")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 9, 2, 3, 1).setNumberFormat("0%");
    sheet.getRange(statsRow + 15, 2).setNumberFormat("0%");

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
      .addRange(sheet.getRange("L2:L500"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition par Statut')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#e8eaed', '#4285f4', '#34a853', '#fbbc04', '#ea4335'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Taux de réalisation par type
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("F2:F500"))
      .addRange(sheet.getRange("I2:I500"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Taux Réalisation par Type Planning')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('colors', ['#9334ea'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Taux (%)', format: '0%'})
      .setOption('hAxis', {title: 'Type de planning'})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartType);

    // Graphique 3: Évolution taux réalisation (tendance)
    const chartTendance = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sheet.getRange("C2:C500"))
      .addRange(sheet.getRange("I2:I500"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Tendance Taux de Réalisation Hebdomadaire')
      .setOption('width', 700)
      .setOption('height', 400)
      .setOption('colors', ['#9334ea'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Taux (%)', format: '0%', viewWindow: {min: 0, max: 1.2}})
      .setOption('hAxis', {title: 'Semaine'})
      .setOption('chartArea', {width: '80%', height: '70%'})
      .setOption('curveType', 'function')
      .build();

    sheet.insertChart(chartTendance);

    // Graphique 4: Performance par projet
    const chartProjet = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("N2:N500"))
      .addRange(sheet.getRange("I2:I500"))
      .setPosition(statsRow + kpis.length + 17, 10, 0, 0)
      .setOption('title', 'Performance par Projet')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Taux (%)', format: '0%'})
      .setOption('hAxis', {title: 'Projet', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartProjet);

    // ===== VUE GANTT SIMPLIFIÉE =====
    const ganttRow = statsRow + kpis.length + 43;

    sheet.getRange(`A${ganttRow}:M${ganttRow}`).merge()
      .setValue("📊 VUE GANTT - PLANNING VISUEL")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#7c22d1")
      .setFontColor("#ffffff");

    const headersGantt = ["Projet", "Période", "Début", "Fin", "Durée", "Statut", "% Réalisé", "S1", "S2", "S3", "S4", "S5", "S6"];
    sheet.getRange(ganttRow + 1, 1, 1, 13).setValues([headersGantt])
      .setFontWeight("bold")
      .setBackground("#9334ea")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(ganttRow + 2, 1, 1, 13).merge()
      .setValue("Note: Les colonnes S1-S6 représentent les semaines. ■ = Prévu, ▓ = Réalisé")
      .setFontSize(9)
      .setFontStyle("italic")
      .setBackground("#f3e8ff")
      .setWrap(true);

    // Bordures
    sheet.getRange(ganttRow + 1, 1, 2, 13).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== ALERTES ÉCARTS PLANNING =====
    const alerteRow = ganttRow + 15;

    sheet.getRange(`A${alerteRow}:H${alerteRow}`).merge()
      .setValue("⚠️ ALERTES ÉCARTS PLANNING")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#fbbc04")
      .setFontColor("#000000");

    const headersAlerte = ["Projet", "Semaine", "Type", "Taux Réalisé", "Écart", "Tâches Manquantes", "Responsable", "Actions"];
    sheet.getRange(alerteRow + 1, 1, 1, 8).setValues([headersAlerte])
      .setFontWeight("bold")
      .setBackground("#f29900")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Afficher les plannings en retard (< 75%)
    let alerteIdx = 0;
    const data = sheet.getDataRange().getValues();
    for (let i = 2; i < Math.min(data.length, 100); i++) {
      if (data[i][8] && data[i][8] < 0.75 && data[i][11] === "En cours" && alerteIdx < 10) {
        // Formule pour afficher les alertes
        alerteIdx++;
      }
    }

    // Bordures
    sheet.getRange(alerteRow + 1, 1, 12, 8).setBorder(
      true, true, true, true, true, true,
      "#000000", SpreadsheetApp.BorderStyle.SOLID
    );

    // ===== RÉCAPITULATIF PAR PROJET =====
    const recapRow = alerteRow + 15;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("📋 RÉCAPITULATIF PAR PROJET")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#188038")
      .setFontColor("#ffffff");

    const headersRecap = ["Projet", "Nb Périodes", "Terminés", "En cours", "Taux Moy.", "Écart Moy.", "Tâches Prévues", "Tâches Réalisées"];
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

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Planning protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:M500")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module PLANNING initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module PLANNING: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute une nouvelle période de planning
 */
function ajouterPlanning(projetId, semaine, dateDebut, dateFin, typePlanning, tachesPrevisionnelles, responsable) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📅 Planning");

    if (!sheet) {
      throw new Error("La feuille Planning n'existe pas");
    }

    const nouvelleLigne = [
      "",  // PlanningID auto-généré
      projetId,
      semaine || "",
      new Date(dateDebut),
      new Date(dateFin),
      typePlanning,
      tachesPrevisionnelles,
      "",  // TachesRealisees - vide au départ
      0,  // TauxRealisation initial
      "",  // Observations
      responsable,
      "Planifié",  // Statut initial
      ""  // Écarts
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("CREATE", "PLANNING", `Planning ${typePlanning} ajouté pour projet ${projetId}`);
    }

    // Notifier le responsable
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(
        responsable,
        `Nouveau planning ${typePlanning} assigné`,
        "Info",
        "Normale",
        "PLANNING"
      );
    }

    return {success: true, message: "Planning ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout planning: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Met à jour la réalisation d'une période de planning
 */
function mettreAJourRealisation(planningId, tachesRealisees, tauxRealisation, observations, ecarts) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📅 Planning");

    if (!sheet) {
      throw new Error("La feuille Planning n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let lignePlanning = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === planningId) {
        lignePlanning = i + 1;
        break;
      }
    }

    if (lignePlanning === -1) {
      throw new Error("Planning non trouvé");
    }

    // Mettre à jour les données
    sheet.getRange(lignePlanning, 8).setValue(tachesRealisees);
    sheet.getRange(lignePlanning, 9).setValue(parseFloat(tauxRealisation));
    sheet.getRange(lignePlanning, 10).setValue(observations);
    sheet.getRange(lignePlanning, 13).setValue(ecarts);

    // Mettre à jour le statut
    if (parseFloat(tauxRealisation) >= 1) {
      sheet.getRange(lignePlanning, 12).setValue("Terminé");
    } else {
      sheet.getRange(lignePlanning, 12).setValue("En cours");
    }

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("UPDATE", "PLANNING", `Planning ${planningId} mis à jour: ${(tauxRealisation * 100).toFixed(0)}% réalisé`);
    }

    // Alerter si retard significatif
    if (parseFloat(tauxRealisation) < 0.75 && typeof envoyerNotification === 'function') {
      const responsableId = data[lignePlanning - 1][10];
      envoyerNotification(
        responsableId,
        `Alerte retard planning ${planningId}: ${(tauxRealisation * 100).toFixed(0)}% réalisé`,
        "Alerte",
        "Haute",
        "PLANNING",
        "Analyser causes retard"
      );
    }

    return {success: true, message: "Planning mis à jour", taux: tauxRealisation};

  } catch (error) {
    Logger.log("Erreur mise à jour planning: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les plannings d'un projet
 */
function obtenirPlanningsProjet(projetId, typePlanning) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📅 Planning");

    if (!sheet) {
      throw new Error("La feuille Planning n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const plannings = [];

    for (let i = 2; i < data.length; i++) {
      const matchProjet = data[i][1] === projetId;
      const matchType = !typePlanning || data[i][5] === typePlanning;

      if (matchProjet && matchType && data[i][1]) {
        plannings.push({
          id: data[i][0],
          semaine: data[i][2],
          dateDebut: data[i][3],
          dateFin: data[i][4],
          type: data[i][5],
          tauxRealisation: data[i][8],
          statut: data[i][11]
        });
      }
    }

    return {success: true, plannings: plannings, count: plannings.length};

  } catch (error) {
    Logger.log("Erreur obtention plannings: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les plannings en retard
 */
function obtenirPlanningsEnRetard(seuilRetard) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📅 Planning");

    if (!sheet) {
      throw new Error("La feuille Planning n'existe pas");
    }

    const seuil = seuilRetard || 0.75;
    const data = sheet.getDataRange().getValues();
    const retards = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][8] && data[i][8] < seuil && data[i][11] === "En cours") {
        retards.push({
          id: data[i][0],
          projet: data[i][1],
          semaine: data[i][2],
          type: data[i][5],
          tauxRealisation: data[i][8],
          ecart: 1 - data[i][8],
          responsable: data[i][10],
          ecarts: data[i][12]
        });
      }
    }

    return {success: true, retards: retards, count: retards.length};

  } catch (error) {
    Logger.log("Erreur obtention retards: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule les statistiques de performance d'un projet
 */
function calculerPerformanceProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📅 Planning");

    if (!sheet) {
      throw new Error("La feuille Planning n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let total = 0;
    let sommeTaux = 0;
    let termines = 0;
    let enCours = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId && data[i][1]) {
        total++;
        if (data[i][8]) {
          sommeTaux += parseFloat(data[i][8]);
        }
        if (data[i][11] === "Terminé") {
          termines++;
        } else if (data[i][11] === "En cours") {
          enCours++;
        }
      }
    }

    const tauxMoyen = total > 0 ? sommeTaux / total : 0;
    const tauxCompletion = total > 0 ? termines / total : 0;

    return {
      success: true,
      stats: {
        totalPeriodes: total,
        termines: termines,
        enCours: enCours,
        tauxRealisationMoyen: tauxMoyen,
        tauxCompletion: tauxCompletion,
        performance: tauxMoyen >= 0.9 ? "Excellente" : tauxMoyen >= 0.75 ? "Bonne" : "À améliorer"
      }
    };

  } catch (error) {
    Logger.log("Erreur calcul performance: " + error);
    return {success: false, message: error.message};
  }
}
