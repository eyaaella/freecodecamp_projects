/**
 * MODULE OUVRAGE - Gestion Complète des Ouvrages d'Aménagement
 * Ouvrages hydrauliques pour périmètres agricoles (barrages, canaux, bassins, stations)
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE OUVRAGE ====================

/**
 * Initialise le module OUVRAGE avec toutes les fonctionnalités
 */
function initialiserOuvrage() {
  try {
    Logger.log("🏗️ Initialisation du module OUVRAGE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("🏗️ Ouvrages");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("🏗️ Ouvrages");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:N1").merge()
      .setValue("🏗️ GESTION DES OUVRAGES D'AMÉNAGEMENT - INFRASTRUCTURES HYDRAULIQUES")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "OuvrageID",
      "ProjetID",
      "Nom de l'Ouvrage",
      "Type d'Ouvrage",
      "Description",
      "Statut",
      "ResponsableID",
      "Date Début",
      "Date Fin Prévue",
      "Coût Estimé (FCFA)",
      "Coût Réel (FCFA)",
      "Progression (%)",
      "Priorité",
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
    const columnWidths = [100, 100, 250, 180, 300, 120, 150, 110, 110, 150, 150, 110, 100, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "OUV001",
        "PROJ001",
        "Barrage Principal Logone",
        "Barrage",
        "Barrage de retenue principal - hauteur 12m - capacité 5000 m³",
        "En cours",
        "EMP001",
        new Date(2024, 1, 15),
        new Date(2024, 11, 30),
        450000000,
        280000000,
        '=SI(K3>0;K3/J3;0)',
        "Haute",
        "Ouvrage prioritaire - Contrôle hydraulique"
      ],
      [
        "OUV002",
        "PROJ001",
        "Canal Principal Nord",
        "Canal",
        "Canal d'amenée principal - 8 km - débit 2.5 m³/s",
        "En cours",
        "EMP002",
        new Date(2024, 2, 1),
        new Date(2024, 10, 15),
        180000000,
        95000000,
        '=SI(K4>0;K4/J4;0)',
        "Haute",
        "Réseau gravitaire principal"
      ],
      [
        "OUV003",
        "PROJ002",
        "Bassin de Stockage Yaoundé",
        "Bassin",
        "Bassin de régulation - 50000 m³ - irrigation maraîchère",
        "Planifié",
        "EMP003",
        new Date(2024, 4, 10),
        new Date(2025, 2, 28),
        65000000,
        0,
        '=SI(K5>0;K5/J5;0)',
        "Moyenne",
        "Zone périurbaine - irrigation goutte à goutte"
      ],
      [
        "OUV004",
        "PROJ003",
        "Station de Pompage Noun",
        "Station de pompage",
        "Station 250 kW - 3 pompes - débit total 5 m³/s",
        "Planifié",
        "EMP001",
        new Date(2024, 5, 1),
        new Date(2025, 1, 31),
        125000000,
        0,
        '=SI(K6>0;K6/J6;0)',
        "Haute",
        "Alimentation réseau secondaire"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // OuvrageID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 5; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(C${i})>0;"OUV"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes H et I)
    sheet.getRange("H3:I100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Coûts (colonnes J et K)
    sheet.getRange("J3:K100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Progression (colonne L)
    sheet.getRange("L3:L100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Budget Dépassé (colonne cachée)
    sheet.insertColumnAfter(11);
    sheet.getRange("L2").setValue("Écart Budget");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`L${i}`).setFormula(`=SI(K${i}>0;K${i}-J${i};0)`);
    }
    sheet.getRange("L3:L100").setNumberFormat('#,##0" FCFA"');
    sheet.hideColumns(12);

    // Durée prévue (jours)
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Durée (jours)");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(`=SI(ET(I${i}>0;J${i}>0);J${i}-I${i};"")`);
    }
    sheet.getRange("J3:J100").setNumberFormat("0");
    sheet.hideColumns(10);

    // Jours restants
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Jours Restants");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(
        `=SI(ET(J${i}>0;G2<>"Terminé");J${i}-AUJOURDHUI();"")`
      );
    }
    sheet.getRange("K3:K100").setNumberFormat("0");
    sheet.hideColumns(11);

    // Statut automatique
    sheet.insertColumnAfter(6);
    sheet.getRange("G2").setValue("Statut Auto");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`G${i}`).setFormula(
        `=SI(NBVAL(I${i})=0;"Non défini";SI(AUJOURDHUI()<I${i};"Planifié";SI(ET(AUJOURDHUI()>=I${i};AUJOURDHUI()<=J${i});"En cours";SI(AUJOURDHUI()>J${i};"En retard";""))))`
      );
    }
    sheet.hideColumns(7);

    // ===== VALIDATION DES DONNÉES =====

    // Type d'Ouvrage
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Barrage", "Canal", "Bassin", "Station de pompage", "Prise d'eau", "Déversoir", "Aqueduc"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type d'ouvrage hydraulique")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleType);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Planifié", "En cours", "En attente", "Suspendu", "Terminé", "Maintenance"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut de l'ouvrage")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleStatut);

    // Priorité
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Haute", "Moyenne", "Basse"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la priorité")
      .build();
    sheet.getRange("M3:M100").setDataValidation(reglePriorite);

    // Coûts (nombres positifs uniquement)
    const regleCout = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez un montant positif en FCFA")
      .build();
    sheet.getRange("J3:K100").setDataValidation(regleCout);

    // Dates
    const regleDate = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText("Entrez une date valide")
      .build();
    sheet.getRange("H3:I100").setDataValidation(regleDate);

    // ProjetID - Liste déroulante depuis la feuille Projets
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("📁 Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un projet existant")
      .build();
    sheet.getRange("B3:B100").setDataValidation(regleProjet);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut des ouvrages - Terminé (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Terminé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Statut - En cours (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Statut - Planifié (Bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Planifié")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Statut - Maintenance (Violet)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Maintenance")
      .setBackground("#9c27b0")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Statut - Suspendu (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Suspendu")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Priorité - Haute (Rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Haute")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Priorité - Moyenne (Orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Moyenne")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Priorité - Basse (Vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Basse")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Progression - Barres de données
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0, 0.33)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("L3:L100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.34, 0.66)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("L3:L100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.67, 1)
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("L3:L100")])
      .build());

    // Budget dépassé (Coût Réel > Coût Estimé)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=K3>J3')
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    // Type d'ouvrage - Couleurs différenciées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Barrage")
      .setBackground("#e8f0fe")
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Canal")
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Bassin")
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Station de pompage")
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:N${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DES OUVRAGES")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total d'ouvrages", '=NB.SI(C3:C100;"<>"")', "Ouvrages enregistrés"],
      ["Ouvrages en cours", '=NB.SI(F3:F100;"En cours")', "Ouvrages en construction"],
      ["Ouvrages terminés", '=NB.SI(F3:F100;"Terminé")', "Ouvrages achevés"],
      ["Ouvrages en maintenance", '=NB.SI(F3:F100;"Maintenance")', "Nécessitant entretien"],
      ["Barrages", '=NB.SI(D3:D100;"Barrage")', "Nombre de barrages"],
      ["Canaux", '=NB.SI(D3:D100;"Canal")', "Nombre de canaux"],
      ["Bassins", '=NB.SI(D3:D100;"Bassin")', "Nombre de bassins"],
      ["Stations de pompage", '=NB.SI(D3:D100;"Station de pompage")', "Nombre de stations"],
      ["Coût total estimé", '=SOMME(J3:J100)', "Budget total"],
      ["Coût réel total", '=SOMME(K3:K100)', "Dépenses réelles"],
      ["Écart budgétaire", '=SOMME(K3:K100)-SOMME(J3:J100)', "Dépassement/Économie"],
      ["Taux réalisation budget", '=SI(SOMME(J3:J100)>0;SOMME(K3:K100)/SOMME(J3:J100);0)', "% du budget utilisé"],
      ["Progression moyenne", '=MOYENNE(L3:L100)', "Avancement moyen"],
      ["Ouvrages priorité haute", '=NB.SI(M3:M100;"Haute")', "Ouvrages critiques"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 10, 2, 3, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 13, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 14, 2).setNumberFormat("0.0%");

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

    // Graphique 1: Répartition par type d'ouvrage
    const chartType = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("D2:D100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition des Ouvrages par Type')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#4285f4', '#34a853', '#fbbc04', '#ea4335', '#9c27b0'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartType);

    // Graphique 2: Coût Estimé vs Coût Réel par ouvrage
    const chartBudget = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("C2:C100"))
      .addRange(sheet.getRange("J2:K100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Budget: Estimé vs Réel par Ouvrage')
      .setOption('width', 650)
      .setOption('height', 300)
      .setOption('colors', ['#1a73e8', '#ea4335'])
      .setOption('legend', {position: 'top'})
      .setOption('vAxis', {title: 'Montant (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Ouvrages', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartBudget);

    // Graphique 3: Progression des ouvrages
    const chartProgression = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("C2:C100"))
      .addRange(sheet.getRange("L2:L100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Progression des Ouvrages (%)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Progression (%)', format: '#%', minValue: 0, maxValue: 1})
      .setOption('vAxis', {title: 'Ouvrages'})
      .setOption('chartArea', {width: '60%', height: '80%'})
      .build();

    sheet.insertChart(chartProgression);

    // Graphique 4: Répartition par statut
    const chartStatut = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("F2:F100"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'Ouvrages par Statut')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Nombre', format: '0'})
      .setOption('hAxis', {title: 'Statut', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartStatut);

    // ===== TABLEAU RÉCAPITULATIF PAR PROJET =====
    const recapRow = statsRow + kpis.length + 35;

    sheet.getRange(`A${recapRow}:F${recapRow}`).merge()
      .setValue("📁 RÉCAPITULATIF PAR PROJET")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["ProjetID", "Nb Ouvrages", "En Cours", "Terminés", "Coût Total", "Progression Moy."];
    sheet.getRange(recapRow + 1, 1, 1, 6).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Ouvrages protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:N100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module OUVRAGE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module OUVRAGE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau ouvrage
 */
function ajouterOuvrage(projetId, nomOuvrage, typeOuvrage, description, responsableId, dateDebut, dateFin, coutEstime, priorite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const nouvelleLigne = [
      "",  // OuvrageID auto-généré
      projetId,
      nomOuvrage,
      typeOuvrage,
      description,
      "Planifié",
      responsableId,
      new Date(dateDebut),
      new Date(dateFin),
      parseFloat(coutEstime),
      0,  // Coût réel initial
      0,  // Progression initiale
      priorite,
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("OUVRAGE", `Nouvel ouvrage créé: ${nomOuvrage}`);
    }

    // Envoyer notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(1, `Nouvel ouvrage créé: ${nomOuvrage} (${typeOuvrage})`, "NORMALE");
    }

    return {success: true, message: "Ouvrage ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout ouvrage: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un ouvrage existant
 */
function modifierOuvrage(ouvrageId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver l'ouvrage
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === ouvrageId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Ouvrage non trouvé: " + ouvrageId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "projetId": 2,
      "nom": 3,
      "type": 4,
      "description": 5,
      "statut": 6,
      "responsableId": 7,
      "dateDebut": 8,
      "dateFin": 9,
      "coutEstime": 10,
      "coutReel": 11,
      "progression": 12,
      "priorite": 13,
      "observations": 14
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("OUVRAGE", `Ouvrage ${ouvrageId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Ouvrage modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification ouvrage: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime un ouvrage
 */
function supprimerOuvrage(ouvrageId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === ouvrageId) {
        sheet.deleteRow(i + 1);

        if (typeof journaliserAction === 'function') {
          journaliserAction("OUVRAGE", `Ouvrage supprimé: ${ouvrageId}`);
        }

        return {success: true, message: "Ouvrage supprimé avec succès"};
      }
    }

    throw new Error("Ouvrage non trouvé: " + ouvrageId);

  } catch (error) {
    Logger.log("Erreur suppression ouvrage: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des ouvrages selon critères
 */
function rechercherOuvrages(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "nom": 2,
      "type": 3,
      "statut": 5,
      "projetId": 1,
      "priorite": 12
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push(data[i]);
      }
    }

    return {success: true, resultats: resultats};

  } catch (error) {
    Logger.log("Erreur recherche ouvrages: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les ouvrages
 */
function obtenirTousOuvrages() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const ouvrages = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][2]) {  // Si le nom de l'ouvrage existe
        ouvrages.push({
          id: data[i][0],
          projetId: data[i][1],
          nom: data[i][2],
          type: data[i][3],
          description: data[i][4],
          statut: data[i][5],
          responsableId: data[i][6],
          dateDebut: data[i][7],
          dateFin: data[i][8],
          coutEstime: data[i][9],
          coutReel: data[i][10],
          progression: data[i][11],
          priorite: data[i][12],
          observations: data[i][13]
        });
      }
    }

    return {success: true, ouvrages: ouvrages};

  } catch (error) {
    Logger.log("Erreur obtention ouvrages: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les ouvrages d'un projet spécifique
 */
function obtenirOuvragesParProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const ouvrages = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId && data[i][2]) {
        ouvrages.push({
          id: data[i][0],
          nom: data[i][2],
          type: data[i][3],
          statut: data[i][5],
          progression: data[i][11]
        });
      }
    }

    return {success: true, ouvrages: ouvrages, count: ouvrages.length};

  } catch (error) {
    Logger.log("Erreur obtention ouvrages par projet: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un rapport d'ouvrage
 */
function genererRapportOuvrage(ouvrageId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ouvrage = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === ouvrageId) {
        ouvrage = data[i];
        break;
      }
    }

    if (!ouvrage) {
      throw new Error("Ouvrage non trouvé");
    }

    const rapport = {
      id: ouvrage[0],
      projetId: ouvrage[1],
      nom: ouvrage[2],
      type: ouvrage[3],
      description: ouvrage[4],
      statut: ouvrage[5],
      responsableId: ouvrage[6],
      dateDebut: ouvrage[7],
      dateFin: ouvrage[8],
      coutEstime: ouvrage[9],
      coutReel: ouvrage[10],
      ecartBudget: ouvrage[10] - ouvrage[9],
      tauxRealisation: (ouvrage[10] / ouvrage[9]) * 100,
      progression: ouvrage[11],
      priorite: ouvrage[12],
      observations: ouvrage[13]
    };

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affiche la sidebar du module Ouvrage
 */
function afficherSidebarOuvrage() {
  const html = HtmlService.createHtmlOutputFromFile('modules/ouvrage/OuvrageSidebar')
    .setTitle('Gestion Ouvrages')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal du module Ouvrage
 */
function afficherModalOuvrage() {
  const html = HtmlService.createHtmlOutputFromFile('modules/ouvrage/OuvrageModal')
    .setWidth(900)
    .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire d\'Ouvrages');
}
