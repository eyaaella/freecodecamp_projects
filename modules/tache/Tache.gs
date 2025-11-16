/**
 * MODULE TACHE v2.0 - Gestion Avancée des Tâches avec CPM
 * Chemin critique, dépendances, Gantt automatique, templates
 * Version: 2.0 Production Ready avec calculs CPM avancés
 */

// ==================== INITIALISATION DU MODULE TACHE v2.0 ====================

/**
 * Initialise le module TACHE v2.0 avec toutes les fonctionnalités CPM
 */
function initialiserTache() {
  try {
    Logger.log("✅ Initialisation du module TACHE v2.0...");

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
    sheet.getRange("A1:T1").merge()
      .setValue("✅ GESTION TÂCHES v2.0 - CPM • GANTT • DÉPENDANCES • CHEMIN CRITIQUE")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#34a853")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "TacheID",
      "ProjetID",
      "OuvrageID",
      "Nom",
      "Description",
      "Type",
      "DateDebut",
      "DateFin",
      "Duree (jours)",
      "Predecesseurs",
      "Progression (%)",
      "ResponsableID",
      "Charge (h/j)",
      "CheminCritique",
      "Marge (jours)",
      "DateTotDebut",
      "DateTotFin",
      "DateTardDebut",
      "DateTardFin",
      "Statut"
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#2d8e47")
      .setFontColor("#ffffff")
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS DE COLONNES =====
    const columnWidths = [100, 100, 100, 250, 300, 120, 110, 110, 100, 150, 100, 150, 100, 120, 100, 110, 110, 110, 110, 120];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "TACH001",
        "PROJ001",
        "OUV001",
        "Terrassement principal",
        "Excavation de 5000 m³ pour canal principal",
        "Excavation",
        new Date(2024, 0, 15),
        new Date(2024, 0, 30),
        15,
        "",
        0.60,
        "Mbarga Jean",
        8,
        false,
        5,
        new Date(2024, 0, 15),
        new Date(2024, 0, 30),
        new Date(2024, 0, 20),
        new Date(2024, 1, 4),
        "En cours"
      ],
      [
        "TACH002",
        "PROJ001",
        "OUV001",
        "Coffrage canal",
        "Mise en place coffrage métallique 200m",
        "Coffrage",
        new Date(2024, 0, 31),
        new Date(2024, 1, 10),
        10,
        "TACH001",
        0.40,
        "Nkolo Marie",
        6,
        true,
        0,
        new Date(2024, 0, 31),
        new Date(2024, 1, 10),
        new Date(2024, 0, 31),
        new Date(2024, 1, 10),
        "En cours"
      ],
      [
        "TACH003",
        "PROJ001",
        "OUV001",
        "Bétonnage canal",
        "Coulage béton C25/30 - 350 m³",
        "Bétonnage",
        new Date(2024, 1, 11),
        new Date(2024, 1, 20),
        9,
        "TACH002",
        0.00,
        "Tchokothe Paul",
        10,
        true,
        0,
        new Date(2024, 1, 11),
        new Date(2024, 1, 20),
        new Date(2024, 1, 11),
        new Date(2024, 1, 20),
        "Planifié"
      ],
      [
        "TACH004",
        "PROJ001",
        "OUV002",
        "Installation vannes",
        "Pose 12 vannes régulation DN400",
        "Installation",
        new Date(2024, 1, 5),
        new Date(2024, 1, 15),
        10,
        "TACH001",
        0.20,
        "Mbarga Jean",
        5,
        false,
        7,
        new Date(2024, 1, 5),
        new Date(2024, 1, 15),
        new Date(2024, 1, 12),
        new Date(2024, 1, 22),
        "En cours"
      ],
      [
        "TACH005",
        "PROJ002",
        "OUV003",
        "Remblai périmètre",
        "Remblaiement compacté 1500 m³",
        "Remblai",
        new Date(2024, 2, 1),
        new Date(2024, 2, 12),
        11,
        "",
        0.00,
        "Nkolo Marie",
        7,
        false,
        3,
        new Date(2024, 2, 1),
        new Date(2024, 2, 12),
        new Date(2024, 2, 4),
        new Date(2024, 2, 15),
        "Planifié"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // TacheID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(D${i})>0;"TACH"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes G, H, P, Q, R, S)
    sheet.getRange("G3:H100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    sheet.getRange("P3:S100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Durée et Marge (colonnes I et O)
    sheet.getRange("I3:I100")
      .setNumberFormat('#,##0" j"')
      .setHorizontalAlignment("center");

    sheet.getRange("O3:O100")
      .setNumberFormat('#,##0" j"')
      .setHorizontalAlignment("center");

    // Progression (colonne K)
    sheet.getRange("K3:K100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // Charge (colonne M)
    sheet.getRange("M3:M100")
      .setNumberFormat('#,##0" h"')
      .setHorizontalAlignment("center");

    // Chemin Critique (colonne N)
    sheet.getRange("N3:N100")
      .setHorizontalAlignment("center");

    // ===== VALIDATION DES DONNÉES =====

    // Type de tâche
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Excavation", "Coffrage", "Bétonnage", "Remblai", "Installation", "Contrôle", "Autre"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type de tâche")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleType);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Planifié", "En cours", "En attente", "Terminé", "Bloqué"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut")
      .build();
    sheet.getRange("T3:T100").setDataValidation(regleStatut);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Terminé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("T3:T100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("T3:T100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Bloqué")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("T3:T100")])
      .build());

    // Chemin Critique
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(true)
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N100")])
      .build());

    // Marge nulle (chemin critique)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(0)
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setBold(true)
      .setRanges([sheet.getRange("O3:O100")])
      .build());

    // Progression
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(1)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("K3:K100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:T${statsRow}`).merge()
      .setValue("📊 STATISTIQUES TÂCHES v2.0 - ANALYSE CHEMIN CRITIQUE CPM")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#2d8e47")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total de tâches", '=NB.SI(D3:D100;"<>"")', "Tâches enregistrées"],
      ["Tâches en cours", '=NB.SI(T3:T100;"En cours")', "En exécution"],
      ["Tâches terminées", '=NB.SI(T3:T100;"Terminé")', "Complétées"],
      ["Tâches en retard", '=SOMMEPROD((H3:H100<AUJOURDHUI())*(T3:T100<>"Terminé"))', "À surveiller"],
      ["Tâches critiques", '=NB.SI(N3:N100;VRAI)', "Chemin critique"],
      ["Charge totale (heures)", '=SOMME(M3:M100)', "Heures de travail"],
      ["Durée totale (jours)", '=SOMME(I3:I100)', "Durée cumulée"],
      ["Progression moyenne", '=MOYENNE(K3:K100)', "Avancement global"],
      ["Tâches bloquées", '=NB.SI(T3:T100;"Bloqué")', "Nécessitent attention"],
      ["Marge moyenne", '=MOYENNE(O3:O100)', "Flexibilité planning"],
      ["Tâches sans marge", '=NB.SI(O3:O100;0)', "Sur chemin critique"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 7, 2).setNumberFormat('#,##0" h"');
    sheet.getRange(statsRow + 8, 2).setNumberFormat('#,##0" j"');
    sheet.getRange(statsRow + 9, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 11, 2).setNumberFormat('#,##0" j"');

    Logger.log("✅ Module TACHE v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module TACHE v2.0: " + error);
    throw error;
  }
}

// ==================== ALGORITHME CPM (Critical Path Method) ====================

/**
 * Calcule le chemin critique d'un projet avec méthode CPM complète
 * @param {string} projetId - ID du projet
 * @return {Object} Résultat avec chemin critique et dates
 */
function calculerCheminCritiqueCPM(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const taches = [];

    // Récupérer toutes les tâches du projet
    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId && data[i][3]) { // ProjetID et Nom non vides
        taches.push({
          id: data[i][0],
          nom: data[i][3],
          duree: parseFloat(data[i][8]) || 0,
          predecesseurs: data[i][9] ? data[i][9].split(',').map(p => p.trim()) : [],
          dateDebut: data[i][6],
          dateFin: data[i][7],
          ligne: i + 1,
          // Dates CPM
          dateTotDebut: null,
          dateTotFin: null,
          dateTardDebut: null,
          dateTardFin: null,
          marge: null,
          estCritique: false
        });
      }
    }

    if (taches.length === 0) {
      return {success: false, message: "Aucune tâche trouvée pour ce projet"};
    }

    // ===== PASSE AVANT (Forward Pass) - Calcul dates au plus tôt =====
    let tachesTraitees = new Set();
    let iteration = 0;
    const maxIterations = taches.length * 2;

    while (tachesTraitees.size < taches.length && iteration < maxIterations) {
      iteration++;

      for (let tache of taches) {
        if (tachesTraitees.has(tache.id)) continue;

        // Vérifier si tous les prédécesseurs sont traités
        const predsTraites = tache.predecesseurs.every(predId =>
          predId === "" || tachesTraitees.has(predId)
        );

        if (predsTraites) {
          if (tache.predecesseurs.length === 0 || tache.predecesseurs[0] === "") {
            // Tâche de départ
            tache.dateTotDebut = 0;
          } else {
            // Calculer la date au plus tôt basée sur les prédécesseurs
            let maxFinPred = 0;
            for (let predId of tache.predecesseurs) {
              const pred = taches.find(t => t.id === predId);
              if (pred && pred.dateTotFin !== null) {
                maxFinPred = Math.max(maxFinPred, pred.dateTotFin);
              }
            }
            tache.dateTotDebut = maxFinPred;
          }

          tache.dateTotFin = tache.dateTotDebut + tache.duree;
          tachesTraitees.add(tache.id);
        }
      }
    }

    // Trouver la durée totale du projet
    const dureeTotaleProjet = Math.max(...taches.map(t => t.dateTotFin || 0));

    // ===== PASSE ARRIÈRE (Backward Pass) - Calcul dates au plus tard =====
    tachesTraitees = new Set();
    iteration = 0;

    // Trier les tâches par ordre inverse de fin au plus tôt
    const tachesInversees = [...taches].sort((a, b) => (b.dateTotFin || 0) - (a.dateTotFin || 0));

    while (tachesTraitees.size < taches.length && iteration < maxIterations) {
      iteration++;

      for (let tache of tachesInversees) {
        if (tachesTraitees.has(tache.id)) continue;

        // Trouver les successeurs
        const successeurs = taches.filter(t =>
          t.predecesseurs.includes(tache.id)
        );

        // Vérifier si tous les successeurs sont traités
        const succsTraites = successeurs.every(succ => tachesTraitees.has(succ.id));

        if (successeurs.length === 0) {
          // Tâche finale
          tache.dateTardFin = dureeTotaleProjet;
        } else if (succsTraites) {
          // Calculer la date au plus tard basée sur les successeurs
          let minDebutSucc = dureeTotaleProjet;
          for (let succ of successeurs) {
            if (succ.dateTardDebut !== null) {
              minDebutSucc = Math.min(minDebutSucc, succ.dateTardDebut);
            }
          }
          tache.dateTardFin = minDebutSucc;
        } else {
          continue;
        }

        tache.dateTardDebut = tache.dateTardFin - tache.duree;
        tachesTraitees.add(tache.id);
      }
    }

    // ===== CALCUL DES MARGES ET CHEMIN CRITIQUE =====
    const cheminCritique = [];

    for (let tache of taches) {
      // Marge totale = Date tard début - Date tôt début
      tache.marge = (tache.dateTardDebut || 0) - (tache.dateTotDebut || 0);

      // Tâche critique si marge = 0
      tache.estCritique = Math.abs(tache.marge) < 0.01; // Tolérance numérique

      if (tache.estCritique) {
        cheminCritique.push(tache);
      }

      // Mettre à jour la feuille
      sheet.getRange(tache.ligne, 15).setValue(tache.marge); // Colonne O: Marge
      sheet.getRange(tache.ligne, 14).setValue(tache.estCritique); // Colonne N: CheminCritique
    }

    // Trier le chemin critique par ordre de début
    cheminCritique.sort((a, b) => (a.dateTotDebut || 0) - (b.dateTotDebut || 0));

    return {
      success: true,
      dureeTotale: dureeTotaleProjet,
      nombreTaches: taches.length,
      nombreCritiques: cheminCritique.length,
      cheminCritique: cheminCritique.map(t => ({
        id: t.id,
        nom: t.nom,
        duree: t.duree,
        debut: t.dateTotDebut,
        fin: t.dateTotFin
      })),
      taches: taches
    };

  } catch (error) {
    Logger.log("Erreur calcul CPM: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Détecte les retards dans les tâches d'un projet
 */
function detecterRetards(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const retards = [];
    const aujourdhui = new Date();

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId && data[i][3]) {
        const dateFin = new Date(data[i][7]);
        const statut = data[i][19];
        const progression = parseFloat(data[i][10]) || 0;

        // Tâche en retard si date fin dépassée et pas terminée
        if (dateFin < aujourdhui && statut !== "Terminé") {
          const joursRetard = Math.floor((aujourdhui - dateFin) / (1000 * 60 * 60 * 24));
          retards.push({
            id: data[i][0],
            nom: data[i][3],
            dateFin: dateFin,
            joursRetard: joursRetard,
            progression: progression,
            responsable: data[i][11],
            critique: data[i][13]
          });
        }
      }
    }

    return {
      success: true,
      nombreRetards: retards.length,
      retards: retards.sort((a, b) => b.joursRetard - a.joursRetard)
    };

  } catch (error) {
    Logger.log("Erreur détection retards: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== GESTION DES DÉPENDANCES ====================

/**
 * Ajoute une dépendance entre deux tâches
 */
function ajouterDependance(tacheId, predecesseurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligne = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === tacheId) {
        ligne = i + 1;
        break;
      }
    }

    if (ligne === -1) {
      throw new Error("Tâche non trouvée: " + tacheId);
    }

    // Récupérer les prédécesseurs existants
    const predecesseursActuels = data[ligne - 1][9] || "";
    const listePreds = predecesseursActuels ? predecesseursActuels.split(',').map(p => p.trim()) : [];

    // Vérifier que le prédécesseur n'est pas déjà dans la liste
    if (listePreds.includes(predecesseurId)) {
      return {success: false, message: "Cette dépendance existe déjà"};
    }

    // Ajouter le nouveau prédécesseur
    listePreds.push(predecesseurId);
    const nouveauxPreds = listePreds.join(', ');

    sheet.getRange(ligne, 10).setValue(nouveauxPreds); // Colonne J: Predecesseurs

    journaliserAction("TACHE", `Dépendance ajoutée: ${tacheId} dépend de ${predecesseurId}`);

    return {success: true, message: "Dépendance ajoutée avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout dépendance: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime une dépendance entre deux tâches
 */
function supprimerDependance(tacheId, predecesseurId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligne = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === tacheId) {
        ligne = i + 1;
        break;
      }
    }

    if (ligne === -1) {
      throw new Error("Tâche non trouvée: " + tacheId);
    }

    // Récupérer et filtrer les prédécesseurs
    const predecesseursActuels = data[ligne - 1][9] || "";
    const listePreds = predecesseursActuels.split(',').map(p => p.trim()).filter(p => p !== predecesseurId);
    const nouveauxPreds = listePreds.join(', ');

    sheet.getRange(ligne, 10).setValue(nouveauxPreds);

    journaliserAction("TACHE", `Dépendance supprimée: ${tacheId} ne dépend plus de ${predecesseurId}`);

    return {success: true, message: "Dépendance supprimée avec succès"};

  } catch (error) {
    Logger.log("Erreur suppression dépendance: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== TEMPLATES DE TÂCHES ====================

/**
 * Retourne les templates de tâches prédéfinis
 */
function obtenirTemplatesTaches() {
  return {
    success: true,
    templates: [
      {
        id: "TPL_EXCAVATION",
        nom: "Excavation Standard",
        description: "Terrassement et excavation de terre",
        type: "Excavation",
        dureeEstimee: 10,
        charge: 8,
        taches: [
          {nom: "Préparation terrain", duree: 2, charge: 6},
          {nom: "Excavation principale", duree: 6, charge: 10},
          {nom: "Évacuation déblais", duree: 2, charge: 8}
        ]
      },
      {
        id: "TPL_COFFRAGE",
        nom: "Coffrage Béton",
        description: "Mise en place coffrage métallique ou bois",
        type: "Coffrage",
        dureeEstimee: 8,
        charge: 7,
        taches: [
          {nom: "Préparation supports", duree: 2, charge: 5},
          {nom: "Montage coffrage", duree: 4, charge: 8},
          {nom: "Étaiement et vérification", duree: 2, charge: 6}
        ]
      },
      {
        id: "TPL_BETONNAGE",
        nom: "Bétonnage Standard",
        description: "Coulage et vibration béton",
        type: "Bétonnage",
        dureeEstimee: 5,
        charge: 10,
        taches: [
          {nom: "Préparation surface", duree: 1, charge: 6},
          {nom: "Coulage béton", duree: 2, charge: 12},
          {nom: "Vibration et finition", duree: 2, charge: 8}
        ]
      },
      {
        id: "TPL_REMBLAI",
        nom: "Remblaiement Compacté",
        description: "Remblai par couches compactées",
        type: "Remblai",
        dureeEstimee: 12,
        charge: 8,
        taches: [
          {nom: "Préparation fond", duree: 2, charge: 6},
          {nom: "Remblaiement couches", duree: 8, charge: 10},
          {nom: "Compactage final", duree: 2, charge: 8}
        ]
      },
      {
        id: "TPL_INSTALLATION",
        nom: "Installation Équipements",
        description: "Pose et raccordement équipements",
        type: "Installation",
        dureeEstimee: 7,
        charge: 6,
        taches: [
          {nom: "Préparation emplacement", duree: 2, charge: 5},
          {nom: "Installation équipements", duree: 3, charge: 8},
          {nom: "Raccordements et tests", duree: 2, charge: 6}
        ]
      },
      {
        id: "TPL_CONTROLE",
        nom: "Contrôle Qualité",
        description: "Inspection et tests qualité",
        type: "Contrôle",
        dureeEstimee: 3,
        charge: 4,
        taches: [
          {nom: "Inspection visuelle", duree: 1, charge: 3},
          {nom: "Tests techniques", duree: 1, charge: 5},
          {nom: "Rapport qualité", duree: 1, charge: 4}
        ]
      },
      {
        id: "TPL_REVETEMENT",
        nom: "Revêtement Surface",
        description: "Application revêtement de protection",
        type: "Autre",
        dureeEstimee: 6,
        charge: 6,
        taches: [
          {nom: "Préparation surface", duree: 2, charge: 5},
          {nom: "Application revêtement", duree: 3, charge: 7},
          {nom: "Séchage et finition", duree: 1, charge: 3}
        ]
      },
      {
        id: "TPL_DRAINAGE",
        nom: "Système Drainage",
        description: "Installation réseau de drainage",
        type: "Installation",
        dureeEstimee: 9,
        charge: 7,
        taches: [
          {nom: "Tracé et nivellement", duree: 2, charge: 5},
          {nom: "Pose canalisations", duree: 5, charge: 8},
          {nom: "Raccordements et tests", duree: 2, charge: 7}
        ]
      }
    ]
  };
}

/**
 * Crée une tâche depuis un template
 */
function creerTacheDepuisTemplate(templateId, projetId, ouvrageId, responsableId) {
  try {
    const templates = obtenirTemplatesTaches();
    const template = templates.templates.find(t => t.id === templateId);

    if (!template) {
      throw new Error("Template non trouvé: " + templateId);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const dateDebut = new Date();
    const dateFin = new Date(dateDebut.getTime() + template.dureeEstimee * 24 * 60 * 60 * 1000);

    const nouvelleTache = [
      "", // TacheID - auto-généré
      projetId,
      ouvrageId,
      template.nom,
      template.description,
      template.type,
      dateDebut,
      dateFin,
      template.dureeEstimee,
      "",
      0,
      responsableId,
      template.charge,
      false,
      0,
      dateDebut,
      dateFin,
      dateDebut,
      dateFin,
      "Planifié"
    ];

    sheet.appendRow(nouvelleTache);

    journaliserAction("TACHE", `Tâche créée depuis template: ${template.nom}`);

    return {success: true, message: "Tâche créée avec succès", template: template};

  } catch (error) {
    Logger.log("Erreur création tâche depuis template: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== EXPORT MS PROJECT XML ====================

/**
 * Génère un export MS Project XML pour un projet
 */
function exporterMSProjectXML(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<Project xmlns="http://schemas.microsoft.com/project">\n';
    xml += '  <Name>' + projetId + '</Name>\n';
    xml += '  <Tasks>\n';

    let taskNumber = 1;
    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId && data[i][3]) {
        xml += '    <Task>\n';
        xml += '      <UID>' + taskNumber + '</UID>\n';
        xml += '      <ID>' + taskNumber + '</ID>\n';
        xml += '      <Name>' + escapeXml(data[i][3]) + '</Name>\n';
        xml += '      <Duration>PT' + (data[i][8] * 8) + 'H0M0S</Duration>\n';
        xml += '      <Start>' + formatDateXml(data[i][6]) + '</Start>\n';
        xml += '      <Finish>' + formatDateXml(data[i][7]) + '</Finish>\n';
        xml += '      <PercentComplete>' + Math.round((data[i][10] || 0) * 100) + '</PercentComplete>\n';

        // Prédécesseurs
        if (data[i][9]) {
          xml += '      <PredecessorLink>\n';
          xml += '        <PredecessorUID>' + data[i][9] + '</PredecessorUID>\n';
          xml += '      </PredecessorLink>\n';
        }

        xml += '    </Task>\n';
        taskNumber++;
      }
    }

    xml += '  </Tasks>\n';
    xml += '</Project>';

    // Créer un fichier dans Google Drive
    const fileName = 'MS_Project_' + projetId + '_' + new Date().getTime() + '.xml';
    const file = DriveApp.createFile(fileName, xml, MimeType.PLAIN_TEXT);

    journaliserAction("TACHE", `Export MS Project XML créé: ${fileName}`);

    return {
      success: true,
      message: "Export MS Project XML créé avec succès",
      fileUrl: file.getUrl(),
      fileName: fileName
    };

  } catch (error) {
    Logger.log("Erreur export MS Project: " + error);
    return {success: false, message: error.message};
  }
}

function escapeXml(text) {
  if (!text) return "";
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDateXml(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString();
}

// ==================== NOTIFICATIONS AUTOMATIQUES ====================

/**
 * Envoie des notifications pour les tâches en retard
 */
function envoyerNotificationsRetards(projetId) {
  try {
    const retards = detecterRetards(projetId);

    if (!retards.success || retards.nombreRetards === 0) {
      return {success: true, message: "Aucun retard à notifier"};
    }

    let message = `⚠️ ALERTE RETARDS - Projet ${projetId}\n\n`;
    message += `${retards.nombreRetards} tâche(s) en retard:\n\n`;

    for (let retard of retards.retards) {
      message += `- ${retard.nom}\n`;
      message += `  Retard: ${retard.joursRetard} jour(s)\n`;
      message += `  Progression: ${(retard.progression * 100).toFixed(0)}%\n`;
      message += `  Responsable: ${retard.responsable}\n`;
      if (retard.critique) {
        message += `  ⚠️ TÂCHE CRITIQUE\n`;
      }
      message += `\n`;
    }

    // Log la notification (dans un système réel, envoyer par email)
    Logger.log(message);
    journaliserAction("TACHE", `Notifications retards envoyées pour ${projetId}`);

    return {
      success: true,
      message: "Notifications envoyées",
      nombreNotifications: retards.nombreRetards
    };

  } catch (error) {
    Logger.log("Erreur envoi notifications: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== FONCTIONS CRUD ====================

function ajouterTache(projetId, ouvrageId, nom, description, type, dateDebut, dateFin, duree, predecesseurs, responsableId, charge) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const nouvelleLigne = [
      "",
      projetId,
      ouvrageId,
      nom,
      description,
      type,
      new Date(dateDebut),
      new Date(dateFin),
      parseFloat(duree),
      predecesseurs || "",
      0,
      responsableId,
      parseFloat(charge),
      false,
      0,
      new Date(dateDebut),
      new Date(dateFin),
      new Date(dateDebut),
      new Date(dateFin),
      "Planifié"
    ];

    sheet.appendRow(nouvelleLigne);

    if (typeof journaliserAction === 'function') {
      journaliserAction("TACHE", `Nouvelle tâche créée: ${nom}`);
    }

    return {success: true, message: "Tâche ajoutée avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout tâche: " + error);
    return {success: false, message: error.message};
  }
}

function modifierTache(tacheId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("✅ Tâches");

    if (!sheet) {
      throw new Error("La feuille Tâches n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === tacheId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Tâche non trouvée: " + tacheId);
    }

    const colonnes = {
      "projetId": 2, "ouvrageId": 3, "nom": 4, "description": 5,
      "type": 6, "dateDebut": 7, "dateFin": 8, "duree": 9,
      "predecesseurs": 10, "progression": 11, "responsableId": 12,
      "charge": 13, "statut": 20
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("TACHE", `Tâche ${tacheId} modifiée: ${champAModifier}`);
    }

    return {success: true, message: "Tâche modifiée avec succès"};

  } catch (error) {
    Logger.log("Erreur modification tâche: " + error);
    return {success: false, message: error.message};
  }
}

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
      if (data[i][3]) {
        taches.push({
          id: data[i][0],
          projetId: data[i][1],
          ouvrageId: data[i][2],
          nom: data[i][3],
          type: data[i][5],
          dateDebut: data[i][6],
          dateFin: data[i][7],
          duree: data[i][8],
          progression: data[i][10],
          responsable: data[i][11],
          critique: data[i][13],
          marge: data[i][14],
          statut: data[i][19]
        });
      }
    }

    return {success: true, taches: taches};

  } catch (error) {
    Logger.log("Erreur obtention tâches: " + error);
    return {success: false, message: error.message};
  }
}

function afficherSidebarTache() {
  const html = HtmlService.createHtmlOutputFromFile('modules/tache/TacheSidebar')
    .setTitle('Gestion Tâches v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalTache() {
  const html = HtmlService.createHtmlOutputFromFile('modules/tache/TacheModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Tâches v2.0 - CPM & Gantt');
}
