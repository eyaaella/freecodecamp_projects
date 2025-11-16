/**
 * MODULE PROJET v2.0 - Gestion Avancée des Projets d'Aménagement
 * Projets de périmètres agricoles avec Gantt, EVM, Templates et IA
 * Version: 2.0 Production Ready avec améliorations majeures
 */

// ==================== INITIALISATION DU MODULE PROJET v2.0 ====================

/**
 * Initialise le module PROJET v2.0 avec toutes les fonctionnalités avancées
 */
function initialiserProjet() {
  try {
    Logger.log("📁 Initialisation du module PROJET v2.0...");

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
    sheet.getRange("A1:U1").merge()
      .setValue("📁 GESTION PROJETS v2.0 - GANTT • EVM • TEMPLATES • IA • CHEMIN CRITIQUE")
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
      "TemplateID",
      "CPI (EVM)",
      "SPI (EVM)",
      "EAC (FCFA)",
      "VAC (FCFA)",
      "Risque Global",
      "Jalons",
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
    const columnWidths = [100, 250, 110, 110, 300, 180, 120, 120, 150, 150, 180, 110, 100, 120, 90, 90, 150, 150, 120, 200, 250];
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
        0.50,
        "Haute",
        "TPL001",
        '=SI(ET(J3>0;L3>0);(I3*L3)/J3;0)',
        '=SI(I3>0;(I3*L3)/I3;0)',
        '=SI(ET(J3>0;O3>0);J3+(I3-I3*L3)/O3;J3)',
        '=I3-Q3',
        "Moyen",
        "Conception:OK;Travaux:En cours;Réception:À venir",
        "Projet prioritaire - EVM activé"
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
        0.50,
        "Moyenne",
        "TPL002",
        '=SI(ET(J4>0;L4>0);(I4*L4)/J4;0)',
        '=SI(I4>0;(I4*L4)/I4;0)',
        '=SI(ET(J4>0;O4>0);J4+(I4-I4*L4)/O4;J4)',
        '=I4-Q4',
        "Faible",
        "Études:OK;Acquisition:En cours",
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
        0.00,
        "Haute",
        "TPL001",
        '=SI(ET(J5>0;L5>0);(I5*L5)/J5;0)',
        '=SI(I5>0;(I5*L5)/I5;0)',
        '=SI(ET(J5>0;O5>0);J5+(I5-I5*L5)/O5;J5)',
        '=I5-Q5',
        "Élevé",
        "Financement:En attente",
        "En attente financement"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // ProjetID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 6; i <= Math.min(derniereLigne, 100); i++) {
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

    // Budget (colonnes I, J, Q, R)
    sheet.getRange("I3:J100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    sheet.getRange("Q3:R100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Progression (colonne L)
    sheet.getRange("L3:L100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // CPI et SPI (colonnes O et P)
    sheet.getRange("O3:P100")
      .setNumberFormat("0.00")
      .setHorizontalAlignment("center");

    // ===== VALIDATION DES DONNÉES =====

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Planifié", "En cours", "En attente", "Suspendu", "Terminé"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut du projet")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleStatut);

    // Priorité
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Haute", "Moyenne", "Basse"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez la priorité")
      .build();
    sheet.getRange("M3:M100").setDataValidation(reglePriorite);

    // Risque Global
    const regleRisque = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Faible", "Moyen", "Élevé", "Critique"], true)
      .setAllowInvalid(false)
      .setHelpText("Niveau de risque global")
      .build();
    sheet.getRange("S3:S100").setDataValidation(regleRisque);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Terminé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // CPI - Performance de coût
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(1)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.9)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // SPI - Performance de délai
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(1)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.9)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setRanges([sheet.getRange("P3:P100")])
      .build());

    // Risque Global
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Critique")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("S3:S100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Élevé")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("S3:S100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Faible")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("S3:S100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:U${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES v2.0 - EARNED VALUE MANAGEMENT")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total de projets", '=NB.SI(B3:B100;"<>"")', "Projets enregistrés"],
      ["Projets actifs", '=NB.SI(H3:H100;"En cours")', "En cours d'exécution"],
      ["Budget total alloué (PV)", '=SOMME(I3:I100)', "Planned Value total"],
      ["Budget utilisé (AC)", '=SOMME(J3:J100)', "Actual Cost total"],
      ["Valeur gagnée (EV)", '=SOMME.PRODUIT(I3:I100;L3:L100)', "Earned Value total"],
      ["CPI global", '=SI(B${statsRow+5}>0;B${statsRow+6}/B${statsRow+5};0)', "Performance de coût"],
      ["SPI global", '=SI(B${statsRow+4}>0;B${statsRow+6}/B${statsRow+4};0)', "Performance de délai"],
      ["Projets en avance (CPI>1)", '=NB.SI(O3:O100;">1")', "Sous budget"],
      ["Projets en retard (SPI<1)", '=NB.SI(P3:P100;"<1")', "Dépassement délai"],
      ["Risques critiques", '=NB.SI(S3:S100;"Critique")', "À surveiller"],
      ["Progression moyenne", '=MOYENNE(L3:L100)', "Avancement global"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 4, 2, 3, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 7, 2, 2, 1).setNumberFormat("0.00");
    sheet.getRange(statsRow + 12, 2).setNumberFormat("0.0%");

    Logger.log("✅ Module PROJET v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module PROJET v2.0: " + error);
    throw error;
  }
}

// ==================== FONCTIONS EVM (Earned Value Management) ====================

/**
 * Calcule l'EVM (Earned Value Management) pour un projet
 */
function calculerEVM(projetId) {
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
      throw new Error("Projet non trouvé: " + projetId);
    }

    // Calculs EVM
    const BAC = parseFloat(projet[8]); // Budget At Completion (Budget Total)
    const AC = parseFloat(projet[9]);  // Actual Cost (Budget Utilisé)
    const progression = parseFloat(projet[11]) || 0;
    const PV = BAC; // Planned Value (simplifié pour cet exemple)
    const EV = BAC * progression; // Earned Value

    // Indices de performance
    const CPI = AC > 0 ? EV / AC : 0;  // Cost Performance Index
    const SPI = PV > 0 ? EV / PV : 0;  // Schedule Performance Index

    // Prévisions
    const EAC = CPI > 0 ? AC + (BAC - EV) / CPI : AC; // Estimate At Completion
    const ETC = EAC - AC; // Estimate To Complete
    const VAC = BAC - EAC; // Variance At Completion
    const CV = EV - AC;    // Cost Variance
    const SV = EV - PV;    // Schedule Variance

    return {
      success: true,
      evm: {
        BAC: BAC,
        PV: PV,
        EV: EV,
        AC: AC,
        CPI: CPI,
        SPI: SPI,
        EAC: EAC,
        ETC: ETC,
        VAC: VAC,
        CV: CV,
        SV: SV,
        progression: progression
      },
      interpretation: {
        coutPerformance: CPI >= 1 ? "Sous budget" : "Dépassement budget",
        delaiPerformance: SPI >= 1 ? "En avance" : "En retard",
        previsionFinale: EAC > BAC ? "Dépassement prévu" : "Dans le budget"
      }
    };

  } catch (error) {
    Logger.log("Erreur calcul EVM: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule le chemin critique d'un projet (simplifié)
 */
function calculerCheminCritique(projetId) {
  try {
    // Récupérer toutes les tâches du projet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetTaches = ss.getSheetByName("✅ Tâches");

    if (!sheetTaches) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const dataTaches = sheetTaches.getDataRange().getValues();
    const tachesProjet = [];

    // Filtrer les tâches du projet
    for (let i = 2; i < dataTaches.length; i++) {
      if (dataTaches[i][1] && dataTaches[i][1].toString().includes(projetId.substring(0, 7))) {
        tachesProjet.push({
          id: dataTaches[i][0],
          description: dataTaches[i][4],
          debut: dataTaches[i][5],
          fin: dataTaches[i][6],
          duree: dataTaches[i][12] || 0,
          dependances: [] // À implémenter avec dépendances
        });
      }
    }

    // Algorithme simplifié du chemin critique
    // (Version complète nécessiterait analyse des dépendances)
    const cheminCritique = tachesProjet.sort((a, b) => b.duree - a.duree);
    const dureeTotale = tachesProjet.reduce((sum, t) => sum + parseFloat(t.duree || 0), 0);

    return {
      success: true,
      cheminCritique: cheminCritique.slice(0, 5), // Top 5 tâches critiques
      dureeTotale: dureeTotale,
      nombreTaches: tachesProjet.length
    };

  } catch (error) {
    Logger.log("Erreur calcul chemin critique: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== FONCTIONS TEMPLATES ====================

/**
 * Crée un template de projet réutilisable
 */
function creerTemplateProjet(nomTemplate, projetSource) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetTemplates = ss.getSheetByName("🎨 Templates Projets");

    // Créer la feuille templates si elle n'existe pas
    if (!sheetTemplates) {
      sheetTemplates = ss.insertSheet("🎨 Templates Projets");
      sheetTemplates.getRange("A1:E1").setValues([["TemplateID", "Nom", "Description", "Structure", "Créé le"]]);
      sheetTemplates.getRange("A1:E1").setBackground("#1a73e8").setFontColor("#ffffff").setFontWeight("bold");
    }

    const templateId = "TPL" + Utilities.formatString("%03d", sheetTemplates.getLastRow());

    // Copier la structure du projet source
    const sheetProjets = ss.getSheetByName("📁 Projets");
    const dataProjets = sheetProjets.getDataRange().getValues();

    let projetData = null;
    for (let i = 2; i < dataProjets.length; i++) {
      if (dataProjets[i][0] === projetSource) {
        projetData = dataProjets[i];
        break;
      }
    }

    if (!projetData) {
      throw new Error("Projet source non trouvé");
    }

    const template = {
      id: templateId,
      nom: nomTemplate,
      description: projetData[4],
      structure: JSON.stringify({
        type: projetData[7],
        superficie: projetData[6],
        priorite: projetData[12],
        jalons: projetData[19]
      }),
      creeLe: new Date()
    };

    sheetTemplates.appendRow([
      template.id,
      template.nom,
      template.description,
      template.structure,
      template.creeLe
    ]);

    journaliserAction("PROJET", `Template créé: ${nomTemplate} depuis ${projetSource}`);

    return {success: true, template: template};

  } catch (error) {
    Logger.log("Erreur création template: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Clone un projet depuis un template
 */
function clonerProjetDepuisTemplate(templateId, nouveauNom, chefProjet) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetTemplates = ss.getSheetByName("🎨 Templates Projets");
    const sheetProjets = ss.getSheetByName("📁 Projets");

    if (!sheetTemplates || !sheetProjets) {
      throw new Error("Feuilles nécessaires manquantes");
    }

    // Récupérer le template
    const dataTemplates = sheetTemplates.getDataRange().getValues();
    let templateData = null;

    for (let i = 1; i < dataTemplates.length; i++) {
      if (dataTemplates[i][0] === templateId) {
        templateData = dataTemplates[i];
        break;
      }
    }

    if (!templateData) {
      throw new Error("Template non trouvé: " + templateId);
    }

    const structure = JSON.parse(templateData[3]);

    // Créer le nouveau projet
    const derniereLigne = sheetProjets.getLastRow() + 1;
    const nouveauProjetId = "PROJ" + Utilities.formatString("%03d", derniereLigne - 2);

    const nouveauProjet = [
      nouveauProjetId,
      nouveauNom,
      new Date(),
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
      templateData[2], // Description du template
      "",
      structure.superficie || 0,
      "Planifié",
      0, // Budget à définir
      0,
      chefProjet,
      0,
      structure.priorite || "Moyenne",
      templateId,
      0, 0, 0, 0,
      "Moyen",
      structure.jalons || "",
      "Créé depuis template " + templateData[1]
    ];

    sheetProjets.appendRow(nouveauProjet);

    journaliserAction("PROJET", `Projet cloné: ${nouveauNom} depuis template ${templateId}`);

    return {success: true, projetId: nouveauProjetId};

  } catch (error) {
    Logger.log("Erreur clonage projet: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== FONCTIONS ANALYSE DES RISQUES ====================

/**
 * Analyse les risques d'un projet
 */
function analyserRisquesProjet(projetId) {
  try {
    const evm = calculerEVM(projetId);

    if (!evm.success) {
      throw new Error("Impossible de calculer l'EVM");
    }

    let scoreRisque = 0;
    const risques = [];

    // Analyse CPI
    if (evm.evm.CPI < 0.8) {
      scoreRisque += 3;
      risques.push({
        type: "Budget",
        niveau: "Élevé",
        description: `CPI très faible (${evm.evm.CPI.toFixed(2)}). Dépassement budget important.`
      });
    } else if (evm.evm.CPI < 0.9) {
      scoreRisque += 2;
      risques.push({
        type: "Budget",
        niveau: "Moyen",
        description: `CPI faible (${evm.evm.CPI.toFixed(2)}). Surveillance budget nécessaire.`
      });
    }

    // Analyse SPI
    if (evm.evm.SPI < 0.8) {
      scoreRisque += 3;
      risques.push({
        type: "Délai",
        niveau: "Élevé",
        description: `SPI très faible (${evm.evm.SPI.toFixed(2)}). Retard important.`
      });
    } else if (evm.evm.SPI < 0.9) {
      scoreRisque += 2;
      risques.push({
        type: "Délai",
        niveau: "Moyen",
        description: `SPI faible (${evm.evm.SPI.toFixed(2)}). Risque de retard.`
      });
    }

    // Analyse VAC
    if (evm.evm.VAC < 0) {
      scoreRisque += 2;
      risques.push({
        type: "Prévision",
        niveau: "Moyen",
        description: `Dépassement budgétaire prévu: ${Math.abs(evm.evm.VAC).toLocaleString()} FCFA`
      });
    }

    // Niveau de risque global
    let niveauGlobal = "Faible";
    if (scoreRisque >= 6) niveauGlobal = "Critique";
    else if (scoreRisque >= 4) niveauGlobal = "Élevé";
    else if (scoreRisque >= 2) niveauGlobal = "Moyen";

    return {
      success: true,
      scoreRisque: scoreRisque,
      niveauGlobal: niveauGlobal,
      risques: risques,
      recommendations: genererRecommandations(niveauGlobal, evm.evm)
    };

  } catch (error) {
    Logger.log("Erreur analyse risques: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère des recommandations basées sur l'analyse
 */
function genererRecommandations(niveauRisque, evm) {
  const recommendations = [];

  if (niveauRisque === "Critique" || niveauRisque === "Élevé") {
    recommendations.push("🚨 Réunion urgente avec le chef de projet requise");
    recommendations.push("📊 Audit complet du budget et du planning");
    recommendations.push("⚡ Plan d'action correctif immédiat");
  }

  if (evm.CPI < 1) {
    recommendations.push("💰 Réviser les coûts et identifier les économies possibles");
  }

  if (evm.SPI < 1) {
    recommendations.push("⏰ Optimiser le planning et augmenter les ressources si nécessaire");
  }

  return recommendations;
}

// ==================== FONCTIONS PRÉVISIONS IA ====================

/**
 * Prévisions basées sur historique (IA simplifiée)
 */
function previsionsIA(projetId) {
  try {
    const evm = calculerEVM(projetId);

    if (!evm.success) {
      throw new Error("Données EVM indisponibles");
    }

    // Calculs prédictifs basés sur les tendances
    const tempsEcoule = evm.evm.progression;
    const tempsRestant = 1 - tempsEcoule;

    // Prévision date de fin
    const joursRestantsPrevu = tempsRestant / (evm.evm.SPI || 1);
    const dateFin = new Date(Date.now() + joursRestantsPrevu * 24 * 60 * 60 * 1000);

    // Prévision budget final
    const budgetFinalPrevu = evm.evm.EAC;

    // Probabilité de succès
    let probabiliteSucces = 50; // Base 50%
    if (evm.evm.CPI >= 1) probabiliteSucces += 20;
    if (evm.evm.SPI >= 1) probabiliteSucces += 20;
    if (evm.evm.CPI >= 1 && evm.evm.SPI >= 1) probabiliteSucces += 10;

    return {
      success: true,
      previsions: {
        dateFin: dateFin,
        budgetFinal: budgetFinalPrevu,
        joursRestants: Math.ceil(joursRestantsPrevu),
        probabiliteSucces: Math.min(probabiliteSucces, 95),
        confiance: evm.evm.progression > 0.3 ? "Haute" : "Moyenne"
      }
    };

  } catch (error) {
    Logger.log("Erreur prévisions IA: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== FONCTIONS CRUD HÉRITÉES v1.0 ====================

function ajouterProjet(nomProjet, dateDebut, dateFin, description, localisation, superficie, budget, chefProjet, priorite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const nouvelleLigne = [
      "",
      nomProjet,
      new Date(dateDebut),
      new Date(dateFin),
      description,
      localisation,
      parseFloat(superficie),
      "Planifié",
      parseFloat(budget),
      0,
      chefProjet,
      0,
      priorite,
      "",
      0, 0, 0, 0,
      "Faible",
      "",
      ""
    ];

    sheet.appendRow(nouvelleLigne);

    if (typeof journaliserAction === 'function') {
      journaliserAction("PROJET", `Nouveau projet créé: ${nomProjet}`);
    }

    return {success: true, message: "Projet ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout projet: " + error);
    return {success: false, message: error.message};
  }
}

function modifierProjet(projetId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("📁 Projets");

    if (!sheet) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === projetId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Projet non trouvé: " + projetId);
    }

    const colonnes = {
      "nom": 2, "dateDebut": 3, "dateFin": 4, "description": 5,
      "localisation": 6, "superficie": 7, "statut": 8, "budget": 9,
      "budgetUtilise": 10, "chefProjet": 11, "progression": 12,
      "priorite": 13, "templateId": 14, "risque": 19, "jalons": 20,
      "observations": 21
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("PROJET", `Projet ${projetId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Projet modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification projet: " + error);
    return {success: false, message: error.message};
  }
}

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
        if (typeof journaliserAction === 'function') {
          journaliserAction("PROJET", `Projet supprimé: ${projetId}`);
        }
        return {success: true, message: "Projet supprimé avec succès"};
      }
    }

    throw new Error("Projet non trouvé: " + projetId);

  } catch (error) {
    Logger.log("Erreur suppression projet: " + error);
    return {success: false, message: error.message};
  }
}

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
      if (data[i][1]) {
        projets.push({
          id: data[i][0],
          nom: data[i][1],
          dateDebut: data[i][2],
          dateFin: data[i][3],
          statut: data[i][7],
          budget: data[i][8],
          progression: data[i][11],
          cpi: data[i][14],
          spi: data[i][15]
        });
      }
    }

    return {success: true, projets: projets};

  } catch (error) {
    Logger.log("Erreur obtention projets: " + error);
    return {success: false, message: error.message};
  }
}

function afficherSidebarProjet() {
  const html = HtmlService.createHtmlOutputFromFile('modules/projet/ProjetSidebar')
    .setTitle('Gestion Projets v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalProjet() {
  const html = HtmlService.createHtmlOutputFromFile('modules/projet/ProjetModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Projets v2.0 - EVM & Gantt');
}
