/**
 * MODULE PROJET - Gestion Complète des Projets d'Aménagement
 * Projets de périmètres agricoles en réseau gravitaire au Cameroun
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE PROJET ====================

/**
 * Initialise le module PROJET avec toutes les fonctionnalités
 */
function initialiserProjet() {
  try {
    Logger.log("📁 Initialisation du module PROJET...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("📁 Projets");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("📁 Projets");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:N1").merge()
      .setValue("📁 GESTION DES PROJETS D'AMÉNAGEMENT - PÉRIMÈTRES AGRICOLES EN RÉSEAU GRAVITAIRE")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "ProjetID",
      "Nom du Projet",
      "Date Début",
      "Date Fin Prévue",
      "Description",
      "Localisation",
      "Superficie (ha)",
      "Statut",
      "Budget Total (FCFA)",
      "Budget Utilisé (FCFA)",
      "Chef de Projet",
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
    const columnWidths = [100, 250, 110, 110, 300, 180, 120, 120, 150, 150, 180, 110, 100, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "PROJ001",
        "Aménagement Périmètre Irrigué Logone et Chari",
        new Date(2024, 0, 15),
        new Date(2025, 11, 31),
        "Aménagement hydro-agricole de 5000 ha avec réseau gravitaire",
        "Extrême-Nord, Logone et Chari",
        5000,
        "En cours",
        1500000000,
        750000000,
        "Mbarga Jean",
        '=SI(J3>0;I3/J3;0)',
        "Haute",
        "Projet prioritaire - Irrigation gravitaire"
      ],
      [
        "PROJ002",
        "Périmètre Maraîcher de Yaoundé",
        new Date(2024, 2, 1),
        new Date(2025, 5, 30),
        "Développement maraîcher avec système d'irrigation moderne",
        "Centre, Yaoundé",
        200,
        "En cours",
        250000000,
        125000000,
        "Nkolo Marie",
        '=SI(J4>0;I4/J4;0)',
        "Moyenne",
        "Zone périurbaine"
      ],
      [
        "PROJ003",
        "Aménagement Vallée du Noun",
        new Date(2024, 4, 10),
        new Date(2026, 3, 15),
        "Riziculture irriguée - 3000 ha réseau gravitaire",
        "Ouest, Noun",
        3000,
        "Planifié",
        980000000,
        0,
        "Tchokothe Paul",
        '=SI(J5>0;I5/J5;0)',
        "Haute",
        "En attente financement"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // ProjetID (colonne A) - Auto-incrémentation
    const derniereL igne = sheet.getMaxRows();
    for (let i = 4; i <= Math.min(derniereL igne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"PROJ"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes C et D)
    sheet.getRange("C3:D100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Superficie (colonne G)
    sheet.getRange("G3:G100")
      .setNumberFormat('#,##0" ha"')
      .setHorizontalAlignment("right");

    // Budget (colonnes I et J)
    sheet.getRange("I3:J100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Progression (colonne L)
    sheet.getRange("L3:L100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Budget Restant (colonne cachée)
    sheet.insertColumnAfter(10);
    sheet.getRange("K2").setValue("Budget Restant");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`K${i}`).setFormula(`=SI(I${i}>0;I${i}-J${i};0)`);
    }
    sheet.getRange("K3:K100").setNumberFormat('#,##0" FCFA"');
    sheet.hideColumns(11);

    // Durée du projet en jours
    sheet.insertColumnAfter(4);
    sheet.getRange("E2").setValue("Durée (jours)");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`E${i}`).setFormula(`=SI(ET(D${i}>0;E${i}>0);E${i}-D${i};"")`);
    }
    sheet.getRange("E3:E100").setNumberFormat("0");
    sheet.hideColumns(5);

    // Jours restants
    sheet.insertColumnAfter(5);
    sheet.getRange("F2").setValue("Jours Restants");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`F${i}`).setFormula(
        `=SI(ET(E${i}>0;I2<>"Terminé");E${i}-AUJOURDHUI();"")`
      );
    }
    sheet.getRange("F3:F100").setNumberFormat("0");
    sheet.hideColumns(6);

    // Statut automatique basé sur les dates
    sheet.insertColumnAfter(9);
    sheet.getRange("J2").setValue("Statut Auto");
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(
        `=SI(NBVAL(D${i})=0;"Non défini";SI(AUJOURDHUI()<D${i};"Planifié";SI(ET(AUJOURDHUI()>=D${i};AUJOURDHUI()<=E${i});"En cours";SI(AUJOURDHUI()>E${i};"Terminé/En retard";""))))`
      );
    }
    sheet.hideColumns(10);

    // ===== VALIDATION DES DONNÉES =====

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Planifié", "En cours", "En attente", "Suspendu", "Terminé"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut du projet")
      .build();
    sheet.getRange("I3:I100").setDataValidation(regleStatut);

    // Priorité
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Haute", "Moyenne", "Basse"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la priorité")
      .build();
    sheet.getRange("N3:N100").setDataValidation(reglePriorite);

    // Budget (nombres positifs uniquement)
    const regleBudget = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez un montant positif")
      .build();
    sheet.getRange("J3:K100").setDataValidation(regleBudget);

    // Superficie
    const regleSuperficie = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Entrez la superficie en hectares")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleSuperficie);

    // Date fin après date début
    const regleDateFin = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText("La date de fin doit être postérieure à la date de début")
      .build();
    sheet.getRange("E3:E100").setDataValidation(regleDateFin);

    // ===== MISE EN FORME CONDITIONNELLE =====

    // Statut des projets
    const rules = sheet.getConditionalFormatRules();

    // Vert pour "Terminé"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Terminé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Orange pour "En cours"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Bleu pour "Planifié"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Planifié")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Gris pour "En attente"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En attente")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Rouge pour "Suspendu"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Suspendu")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("I3:I100")])
      .build());

    // Priorité - Rouge pour Haute
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Haute")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    // Priorité - Orange pour Moyenne
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Moyenne")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    // Priorité - Vert pour Basse
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Basse")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    // Progression - Barres de données
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0, 0.33)
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.34, 0.66)
      .setBackground("#fef7e0")
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.67, 1)
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    // Budget dépassé (Budget Utilisé > Budget Total)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=K3>J3')
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    // Titre de la section
    sheet.getRange(`A${statsRow}:O${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DES PROJETS")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total de projets", '=NB.SI(B3:B100;"<>"")', "Projets enregistrés"],
      ["Projets actifs", '=NB.SI(I3:I100;"En cours")', "Projets en cours d'exécution"],
      ["Projets terminés", '=NB.SI(I3:I100;"Terminé")', "Projets achevés"],
      ["Projets en attente", '=NB.SI(I3:I100;"En attente")', "Projets en attente de démarrage"],
      ["Budget total alloué", '=SOMME(J3:J100)', "Somme de tous les budgets"],
      ["Budget total utilisé", '=SOMME(K3:K100)', "Dépenses totales"],
      ["Budget disponible", '=SOMME(J3:J100)-SOMME(K3:K100)', "Budget restant global"],
      ["Taux d'utilisation budget", '=SI(SOMME(J3:J100)>0;SOMME(K3:K100)/SOMME(J3:J100);0)', "% du budget utilisé"],
      ["Superficie totale", '=SOMME(H3:H100)', "Hectares totaux aménagés"],
      ["Progression moyenne", '=MOYENNE(M3:M100)', "Avancement moyen des projets"],
      ["Projets priorité haute", '=NB.SI(N3:N100;"Haute")', "Projets à haute priorité"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs
    sheet.getRange(statsRow + 6, 2, 3, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 9, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 10, 2).setNumberFormat('#,##0" ha"');
    sheet.getRange(statsRow + 11, 2).setNumberFormat("0.0%");

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
      .addRange(sheet.getRange("I2:I100"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition des Projets par Statut')
      .setOption('width', 500)
      .setOption('height', 300)
      .setOption('is3D', true)
      .setOption('colors', ['#4285f4', '#fbbc04', '#9aa0a6', '#ea4335', '#34a853'])
      .setOption('pieSliceText', 'value')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 11}})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Budget Total vs Budget Utilisé par projet
    const chartBudget = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("J2:K100"))
      .setPosition(statsRow + kpis.length + 2, 7, 0, 0)
      .setOption('title', 'Budget: Alloué vs Utilisé')
      .setOption('width', 600)
      .setOption('height', 300)
      .setOption('colors', ['#1a73e8', '#ea4335'])
      .setOption('legend', {position: 'top'})
      .setOption('vAxis', {title: 'Montant (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Projets', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartBudget);

    // Graphique 3: Progression des projets
    const chartProgression = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("M2:M100"))
      .setPosition(statsRow + kpis.length + 17, 1, 0, 0)
      .setOption('title', 'Progression des Projets (%)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Progression (%)', format: '#%', minValue: 0, maxValue: 1})
      .setOption('vAxis', {title: 'Projets'})
      .setOption('chartArea', {width: '60%', height: '80%'})
      .build();

    sheet.insertChart(chartProgression);

    // Graphique 4: Superficie par projet
    const chartSuperficie = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("B2:B100"))
      .addRange(sheet.getRange("H2:H100"))
      .setPosition(statsRow + kpis.length + 17, 8, 0, 0)
      .setOption('title', 'Superficie Aménagée par Projet (ha)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Superficie (ha)', format: 'short'})
      .setOption('hAxis', {title: 'Projets', slantedText: true, slantedTextAngle: 45})
      .setOption('chartArea', {width: '75%', height: '70%'})
      .build();

    sheet.insertChart(chartSuperficie);

    // ===== TABLEAU RÉCAPITULATIF PAR LOCALISATION =====
    const recapRow = statsRow + kpis.length + 35;

    sheet.getRange(`A${recapRow}:F${recapRow}`).merge()
      .setValue("📍 RÉCAPITULATIF PAR LOCALISATION")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = ["Localisation", "Nb Projets", "Superficie Tot.", "Budget Alloué", "Budget Utilisé", "Taux Util."];
    sheet.getRange(recapRow + 1, 1, 1, 6).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // TODO: Ajouter formules UNIQUE et SOMME.SI pour récapitulatif dynamique
    // Note: Nécessite Google Sheets version récente

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Projets protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:O100")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module PROJET initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module PROJET: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau projet
 */
function ajouterProjet(nomProjet, dateDebut, dateFin, description, localisation, superficie, budget, chefProjet, priorite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const nouvelleLigne = [
      "",  // ProjetID auto-généré
      nomProjet,
      new Date(dateDebut),
      new Date(dateFin),
      description,
      localisation,
      parseFloat(superficie),
      "Planifié",
      parseFloat(budget),
      0,  // Budget utilisé initial
      chefProjet,
      0,  // Progression initiale
      priorite,
      ""  // Observations
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("PROJET", `Nouveau projet créé: ${nomProjet}`);
    }

    // Envoyer notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(1, `Nouveau projet créé: ${nomProjet}`, "NORMALE");
    }

    return {success: true, message: "Projet ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout projet: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un projet existant
 */
function modifierProjet(projetId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver le projet
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === projetId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Projet non trouvé: " + projetId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "nom": 2,
      "dateDebut": 3,
      "dateFin": 4,
      "description": 5,
      "localisation": 6,
      "superficie": 7,
      "statut": 8,
      "budget": 9,
      "budgetUtilise": 10,
      "chefProjet": 11,
      "progression": 12,
      "priorite": 13,
      "observations": 14
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    journaliserAction("PROJET", `Projet ${projetId} modifié: ${champAModifier}`);

    return {success: true, message: "Projet modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification projet: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime un projet
 */
function supprimerProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === projetId) {
        sheet.deleteRow(i + 1);
        journaliserAction("PROJET", `Projet supprimé: ${projetId}`);
        return {success: true, message: "Projet supprimé avec succès"};
      }
    }

    throw new Error("Projet non trouvé: " + projetId);

  } catch (error) {
    Logger.log("Erreur suppression projet: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des projets selon critères
 */
function rechercherProjets(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "nom": 1,
      "localisation": 5,
      "statut": 7,
      "chefProjet": 10,
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
    Logger.log("Erreur recherche projets: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient tous les projets
 */
function obtenirTousProjets() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const projets = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {  // Si le nom du projet existe
        projets.push({
          id: data[i][0],
          nom: data[i][1],
          dateDebut: data[i][2],
          dateFin: data[i][3],
          description: data[i][4],
          localisation: data[i][5],
          superficie: data[i][6],
          statut: data[i][7],
          budget: data[i][8],
          budgetUtilise: data[i][9],
          chefProjet: data[i][10],
          progression: data[i][11],
          priorite: data[i][12],
          observations: data[i][13]
        });
      }
    }

    return {success: true, projets: projets};

  } catch (error) {
    Logger.log("Erreur obtention projets: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un rapport de projet
 */
function genererRapportProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let projet = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === projetId) {
        projet = data[i];
        break;
      }
    }

    if (!projet) {
      throw new Error("Projet non trouvé");
    }

    const rapport = {
      id: projet[0],
      nom: projet[1],
      dateDebut: projet[2],
      dateFin: projet[3],
      description: projet[4],
      localisation: projet[5],
      superficie: projet[6],
      statut: projet[7],
      budget: projet[8],
      budgetUtilise: projet[9],
      budgetRestant: projet[8] - projet[9],
      tauxUtilisation: (projet[9] / projet[8]) * 100,
      chefProjet: projet[10],
      progression: projet[11],
      priorite: projet[12],
      observations: projet[13]
    };

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affiche la sidebar du module Projet
 */
function afficherSidebarProjet() {
  const html = HtmlService.createHtmlOutputFromFile('modules/projet/ProjetSidebar')
    .setTitle('Gestion Projets')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal du module Projet
 */
function afficherModalProjet() {
  const html = HtmlService.createHtmlOutputFromFile('modules/projet/ProjetModal')
    .setWidth(900)
    .setHeight(650);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Projets');
}
