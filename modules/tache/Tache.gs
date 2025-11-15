/**
 * MODULE TACHE - Gestion Complète des Tâches Terrain
 * Planification et suivi des tâches de terrain pour travaux topographiques
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE TACHE ====================

/**
 * Initialise le module TACHE avec toutes les fonctionnalités
 */
function initialiserTache() {
  try {
    Logger.log("✅ Initialisation du module TACHE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("✅ Tâches");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("✅ Tâches");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:O1").merge()
      .setValue("✅ GESTION DES TÂCHES TERRAIN - PLANIFICATION ET SUIVI DES TRAVAUX TOPOGRAPHIQUES")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "TacheID",
      "OuvrageID",
      "EquipeID",
      "MaterielID",
      "Description de la Tâche",
      "Date Début",
      "Date Fin Prévue",
      "Date Fin Réelle",
      "Statut",
      "Priorité",
      "Progression (%)",
      "Responsable",
      "Durée Estimée (j)",
      "Observations",
      "Alertes"
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
    const columnWidths = [100, 100, 100, 100, 300, 110, 110, 110, 120, 100, 100, 150, 110, 250, 150];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "TACHE001",
        "OUV001",
        "EQ001",
        "MAT001",
        "Levé topographique initial - zone barrage - 500 points",
        new Date(2024, 1, 15),
        new Date(2024, 1, 25),
        new Date(2024, 1, 24),
        "Terminé",
        "Haute",
        1.00,
        "Nkolo Pierre",
        10,
        "Relevé réalisé avec station totale - Précision ±2cm",
        ""
      ],
      [
        "TACHE002",
        "OUV002",
        "EQ002",
        "MAT003",
        "Implantation tracé canal principal - 8 km",
        new Date(2024, 2, 1),
        new Date(2024, 2, 15),
        "",
        "En cours",
        "Haute",
        0.65,
        "Tchamba Marie",
        14,
        "Utilisation GPS RTK - Jalonnement en cours",
        ""
      ],
      [
        "TACHE003",
        "OUV003",
        "EQ001",
        "MAT002",
        "Nivellement réseau secondaire - 25 profils",
        new Date(2024, 3, 5),
        new Date(2024, 3, 20),
        "",
        "En cours",
        "Moyenne",
        0.40,
        "Nkolo Pierre",
        15,
        "Nivellement par rayonnement - 5 profils/jour",
        ""
      ],
      [
        "TACHE004",
        "OUV004",
        "EQ003",
        "MAT001",
        "Contrôle dimensionnel station pompage",
        new Date(2024, 4, 1),
        new Date(2024, 4, 8),
        "",
        "Planifié",
        "Haute",
        0.00,
        "Mballa Joseph",
        7,
        "Vérification conformité plans - As-built",
        ""
      ],
      [
        "TACHE005",
        "OUV001",
        "EQ002",
        "MAT004",
        "Contrôle bathymétrique bassin - Échosondage",
        new Date(2024, 2, 10),
        new Date(2024, 2, 20),
        "",
        "En attente",
        "Basse",
        0.00,
        "Tchamba Marie",
        10,
        "Attente validation étude impact environnemental",
        "En attente validation"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // TacheID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 6; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(E${i})>0;"TACHE"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes F, G, H)
    sheet.getRange("F3:H100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Progression (colonne K)
    sheet.getRange("K3:K100")
      .setNumberFormat("0%")
      .setHorizontalAlignment("center");

    // Durée (colonne M)
    sheet.getRange("M3:M100")
      .setNumberFormat('0" jours"')
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Durée réelle (colonne cachée)
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Durée Réelle");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`I${i}`).setFormula(
        `=SI(ET(H${i}>0;G${i}>0);H${i}-G${i};SI(ET(J2="En cours";G${i}>0);AUJOURDHUI()-G${i};""))`
      );
    }
    sheet.getRange("I3:I100").setNumberFormat('0" jours"');
    sheet.hideColumns(9);

    // Retard (colonne cachée)
    sheet.insertColumnAfter(8);
    sheet.getRange("I2").setValue("Retard");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`I${i}`).setFormula(
        `=SI(ET(H${i}>0;I${i}>0);SI(I${i}>H${i};I${i}-H${i};0);SI(ET(J2="En cours";AUJOURDHUI()>H${i});AUJOURDHUI()-H${i};0))`
      );
    }
    sheet.getRange("I3:I100").setNumberFormat('0" jours"');
    sheet.hideColumns(9);

    // Statut automatique basé sur les dates et progression
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Statut Auto");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(L${i}=1;"Terminé";SI(ET(AUJOURDHUI()>=G${i};AUJOURDHUI()<=H${i});"En cours";SI(AUJOURDHUI()<G${i};"Planifié";SI(AUJOURDHUI()>H${i};"En retard";""))))`
      );
    }
    sheet.hideColumns(10);

    // Alerte retard automatique
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`O${i}`).setFormula(
        `=SI(ET(J${i}="En cours";AUJOURDHUI()>H${i});"⚠️ RETARD: "&TEXTE(AUJOURDHUI()-H${i};"0")&" jours";SI(ET(J${i}="En cours";H${i}-AUJOURDHUI()<=3);"⏰ Échéance proche: "&TEXTE(H${i}-AUJOURDHUI();"0")&" jours";""))`
      );
    }

    // Taux d'achèvement estimé basé sur durée
    sheet.insertColumnAfter(11);
    sheet.getRange("L2").setValue("Avancement Auto");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`L${i}`).setFormula(
        `=SI(ET(J${i}="En cours";N${i}>0);MIN((AUJOURDHUI()-G${i})/N${i};1);SI(J${i}="Terminé";1;0))`
      );
    }
    sheet.getRange("L3:L100").setNumberFormat("0%");
    sheet.hideColumns(12);

    // ===== VALIDATION DES DONNÉES =====

    // OuvrageID - Liste déroulante depuis la feuille Ouvrages
    const regleOuvrage = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🏗️ Ouvrages").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un ouvrage existant")
      .build();
    sheet.getRange("B3:B100").setDataValidation(regleOuvrage);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Planifié", "En cours", "En attente", "Suspendu", "Terminé", "Annulé"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut de la tâche")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleStatut);

    // Priorité
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Haute", "Moyenne", "Basse"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la priorité")
      .build();
    sheet.getRange("J3:J100").setDataValidation(reglePriorite);

    // Progression (entre 0 et 1)
    const regleProgression = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 1)
      .setAllowInvalid(false)
      .setHelpText("Entrez un pourcentage entre 0% et 100%")
      .build();
    sheet.getRange("K3:K100").setDataValidation(regleProgression);

    // Durée (nombre positif)
    const regleDuree = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez le nombre de jours")
      .build();
    sheet.getRange("M3:M100").setDataValidation(regleDuree);

    // Dates
    const regleDate = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText("Entrez une date valide")
      .build();
    sheet.getRange("F3:H100").setDataValidation(regleDate);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut - Terminé (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Terminé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Statut - En cours (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Statut - Planifié (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Planifié")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Statut - En attente (Gris)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En attente")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Statut - Suspendu/Annulé (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Suspendu")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Annulé")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Priorité - Haute (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Haute")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Priorité - Moyenne (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Moyenne")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Priorité - Basse (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Basse")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Progression - Barres de progression colorées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0, 0.33)
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.34, 0.66)
      .setBackground("#fef7e0")
      .setFontColor("#f57c00")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.67, 0.99)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(1)
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Alertes - Mise en évidence des retards
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("⚠️ RETARD")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("⏰ Échéance")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // Date de fin dépassée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(H3<AUJOURDHUI();I3<>"Terminé")')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("G3:G100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 110;

    // Titre de la section
    sheet.getRange(`A${statsRow}:O${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DES TÂCHES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total de tâches", '=NB.SI(E3:E100;"<>"")', "Tâches enregistrées"],
      ["Tâches en cours", '=NB.SI(I3:I100;"En cours")', "Tâches actives"],
      ["Tâches terminées", '=NB.SI(I3:I100;"Terminé")', "Tâches achevées"],
      ["Tâches planifiées", '=NB.SI(I3:I100;"Planifié")', "À venir"],
      ["Tâches en retard", '=NB.SI.ENS(I3:I100;"En cours";G3:G100;"<"&AUJOURDHUI())', "Dépassement échéance"],
      ["Tâches en attente", '=NB.SI(I3:I100;"En attente")', "Bloquées"],
      ["Tâches annulées", '=NB.SI(I3:I100;"Annulé")', "Abandonnées"],
      ["Taux de complétion", '=SI(NB.SI(E3:E100;"<>""")>0;NB.SI(I3:I100;"Terminé")/NB.SI(E3:E100;"<>""");0)', "% tâches terminées"],
      ["Progression moyenne", '=MOYENNE(K3:K100)', "Avancement moyen global"],
      ["Tâches priorité haute", '=NB.SI(J3:J100;"Haute")', "Tâches critiques"],
      ["Tâches priorité moyenne", '=NB.SI(J3:J100;"Moyenne")', "Tâches normales"],
      ["Tâches priorité basse", '=NB.SI(J3:J100;"Basse")', "Tâches différables"],
      ["Durée moyenne estimée", '=MOYENNE(M3:M100)', "Jours moyens par tâche"],
      ["Retard moyen", '=MOYENNE(SI(I3:I100="En cours";G3:G100-AUJOURDHUI();0))', "Jours de retard moyen"],
      ["Tâches échéance < 7j", '=NB.SI.ENS(I3:I100;"En cours";G3:G100;"<="&AUJOURDHUI()+7)', "Échéance imminente"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 9, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 10, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 14, 2).setNumberFormat('0.0" jours"');
    sheet.getRange(statsRow + 15, 2).setNumberFormat('0.0" jours"');

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

    // ===== PLANNING GANTT SIMPLIFIÉ =====
    const ganttRow = statsRow + kpis.length + 3;

    sheet.getRange(`A${ganttRow}:O${ganttRow}`).merge()
      .setValue("📅 PLANNING GANTT - VUE TEMPORELLE DES TÂCHES")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersGantt = ["TacheID", "Description", "Début", "Fin", "Durée", "Statut", "Progression"];
    sheet.getRange(ganttRow + 1, 1, 1, 7).setValues([headersGantt])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // ===== GRAPHIQUES ET ANALYSES =====

    // Graphique 1: Répartition par statut
    const chartStatut = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("I2:I100"))
      .setPosition(statsRow + kpis.length + 10, 1, 0, 0)
      .setOption('title', 'Répartition des Tâches par Statut')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#4285f4', '#fbbc04', '#9aa0a6', '#ea4335', '#34a853', '#5f6368'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Tâches par priorité
    const chartPriorite = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("J2:J100"))
      .setPosition(statsRow + kpis.length + 10, 8, 0, 0)
      .setOption('title', 'Tâches par Niveau de Priorité')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('colors', ['#ea4335'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre de tâches', format: '0'})
      .setOption('hAxis', {title: 'Priorité'})
      .setOption('chartArea', {width: '70%', height: '65%'})
      .build();

    sheet.insertChart(chartPriorite);

    // Graphique 3: Progression des tâches en cours
    const chartProgression = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("A2:A100"))
      .addRange(sheet.getRange("K2:K100"))
      .setPosition(statsRow + kpis.length + 27, 1, 0, 0)
      .setOption('title', 'Progression des Tâches (%)')
      .setOption('width', 650)
      .setOption('height', 450)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Progression (%)', format: '#%', minValue: 0, maxValue: 1})
      .setOption('vAxis', {title: 'Tâches'})
      .setOption('chartArea', {width: '60%', height: '85%'})
      .build();

    sheet.insertChart(chartProgression);

    // Graphique 4: Timeline - Durées planifiées vs réelles
    const chartDuree = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("A2:A100"))
      .addRange(sheet.getRange("M2:M100"))
      .setPosition(statsRow + kpis.length + 27, 9, 0, 0)
      .setOption('title', 'Durée Estimée par Tâche (jours)')
      .setOption('width', 600)
      .setOption('height', 450)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Durée (jours)', format: '0'})
      .setOption('hAxis', {title: 'Tâches', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '70%', height: '75%'})
      .build();

    sheet.insertChart(chartDuree);

    // ===== TABLEAU RÉCAPITULATIF PAR OUVRAGE =====
    const recapRow = statsRow + kpis.length + 52;

    sheet.getRange(`A${recapRow}:G${recapRow}`).merge()
      .setValue("🏗️ RÉCAPITULATIF DES TÂCHES PAR OUVRAGE")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["OuvrageID", "Nb Tâches", "En Cours", "Terminées", "Retard", "Progression Moy.", "Durée Tot."];
    sheet.getRange(recapRow + 1, 1, 1, 7).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // ===== ALERTES ET NOTIFICATIONS =====
    const alerteRow = recapRow + 10;

    sheet.getRange(`A${alerteRow}:G${alerteRow}`).merge()
      .setValue("⚠️ ALERTES ET TÂCHES CRITIQUES")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#ea4335")
      .setFontColor("#ffffff");

    const headersAlerte = ["TacheID", "Description", "Statut", "Échéance", "Retard", "Priorité", "Action Requise"];
    sheet.getRange(alerteRow + 1, 1, 1, 7).setValues([headersAlerte])
      .setFontWeight("bold")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setHorizontalAlignment("center");

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Tâches protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:N100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module TACHE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module TACHE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute une nouvelle tâche
 */
function ajouterTache(ouvrageId, equipeId, materielId, description, dateDebut, dateFin, responsable, dureeEstimee, priorite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const nouvelleLigne = [
      "",  // TacheID auto-généré
      ouvrageId,
      equipeId,
      materielId,
      description,
      new Date(dateDebut),
      new Date(dateFin),
      "",  // Date fin réelle
      "Planifié",
      priorite,
      0,  // Progression initiale
      responsable,
      parseFloat(dureeEstimee),
      "",  // Observations
      ""   // Alertes (auto-générées)
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("TACHE", `Nouvelle tâche créée: ${description}`);
    }

    // Envoyer notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(1, `Nouvelle tâche assignée: ${description}`, "NORMALE");
    }

    return {success: true, message: "Tâche ajoutée avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout tâche: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie une tâche existante
 */
function modifierTache(tacheId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver la tâche
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === tacheId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Tâche non trouvée: " + tacheId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "ouvrageId": 2,
      "equipeId": 3,
      "materielId": 4,
      "description": 5,
      "dateDebut": 6,
      "dateFin": 7,
      "dateFinReelle": 8,
      "statut": 9,
      "priorite": 10,
      "progression": 11,
      "responsable": 12,
      "dureeEstimee": 13,
      "observations": 14
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    // Si progression = 100%, mettre statut à Terminé et date fin réelle
    if (champAModifier === "progression" && nouvelleValeur >= 1) {
      sheet.getRange(ligneModifiee, colonnes["statut"]).setValue("Terminé");
      sheet.getRange(ligneModifiee, colonnes["dateFinReelle"]).setValue(new Date());
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("TACHE", `Tâche ${tacheId} modifiée: ${champAModifier}`);
    }

    return {success: true, message: "Tâche modifiée avec succès"};

  } catch (error) {
    Logger.log("Erreur modification tâche: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime une tâche
 */
function supprimerTache(tacheId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === tacheId) {
        sheet.deleteRow(i + 1);

        if (typeof journaliserAction === 'function') {
          journaliserAction("TACHE", `Tâche supprimée: ${tacheId}`);
        }

        return {success: true, message: "Tâche supprimée avec succès"};
      }
    }

    throw new Error("Tâche non trouvée: " + tacheId);

  } catch (error) {
    Logger.log("Erreur suppression tâche: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des tâches selon critères
 */
function rechercherTaches(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "description": 4,
      "statut": 8,
      "priorite": 9,
      "responsable": 11,
      "ouvrageId": 1
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push(data[i]);
      }
    }

    return {success: true, resultats: resultats};

  } catch (error) {
    Logger.log("Erreur recherche tâches: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient toutes les tâches
 */
function obtenirToutesTaches() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const taches = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][4]) {  // Si description existe
        taches.push({
          id: data[i][0],
          ouvrageId: data[i][1],
          equipeId: data[i][2],
          materielId: data[i][3],
          description: data[i][4],
          dateDebut: data[i][5],
          dateFin: data[i][6],
          dateFinReelle: data[i][7],
          statut: data[i][8],
          priorite: data[i][9],
          progression: data[i][10],
          responsable: data[i][11],
          dureeEstimee: data[i][12],
          observations: data[i][13],
          alertes: data[i][14]
        });
      }
    }

    return {success: true, taches: taches};

  } catch (error) {
    Logger.log("Erreur obtention tâches: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les tâches en retard
 */
function obtenirTachesEnRetard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const tachesRetard = [];
    const aujourdhui = new Date();

    for (let i = 2; i < data.length; i++) {
      if (data[i][8] === "En cours" && data[i][6] < aujourdhui) {
        tachesRetard.push({
          id: data[i][0],
          description: data[i][4],
          dateFin: data[i][6],
          retard: Math.floor((aujourdhui - data[i][6]) / (1000 * 60 * 60 * 24)),
          responsable: data[i][11],
          priorite: data[i][9]
        });
      }
    }

    return {success: true, taches: tachesRetard, count: tachesRetard.length};

  } catch (error) {
    Logger.log("Erreur obtention tâches en retard: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un rapport de tâche
 */
function genererRapportTache(tacheId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let tache = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === tacheId) {
        tache = data[i];
        break;
      }
    }

    if (!tache) {
      throw new Error("Tâche non trouvée");
    }

    const aujourdhui = new Date();
    const dureeReelle = tache[7] ?
      Math.floor((tache[7] - tache[5]) / (1000 * 60 * 60 * 24)) :
      Math.floor((aujourdhui - tache[5]) / (1000 * 60 * 60 * 24));

    const rapport = {
      id: tache[0],
      ouvrageId: tache[1],
      description: tache[4],
      dateDebut: tache[5],
      dateFin: tache[6],
      dateFinReelle: tache[7],
      statut: tache[8],
      priorite: tache[9],
      progression: tache[10],
      responsable: tache[11],
      dureeEstimee: tache[12],
      dureeReelle: dureeReelle,
      ecartDuree: dureeReelle - tache[12],
      observations: tache[13],
      alertes: tache[14]
    };

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affiche la sidebar du module Tâche
 */
function afficherSidebarTache() {
  const html = HtmlService.createHtmlOutputFromFile('modules/tache/TacheSidebar')
    .setTitle('Gestion Tâches')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal du module Tâche
 */
function afficherModalTache() {
  const html = HtmlService.createHtmlOutputFromFile('modules/tache/TacheModal')
    .setWidth(900)
    .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Tâches');
}
