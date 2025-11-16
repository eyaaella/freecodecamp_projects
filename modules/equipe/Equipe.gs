/**
 * ============================================================================
 * MODULE EQUIPE v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète des équipes de travail avec composition,
 *              affectations, planning, productivité et KPIs temps réel
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD équipes de travail complet
 * ✅ Composition équipe (chef + membres)
 * ✅ Affectation projet/ouvrage dynamique
 * ✅ Calcul productivité équipe
 * ✅ Planning disponibilité temps réel
 * ✅ KPIs: Nb équipes, charge totale, disponibilité
 * ✅ Gestion des spécialités
 * ✅ Historique des affectations
 * ✅ Rapport de performance
 * ============================================================================
 */

// ============================================================================
// INITIALISATION MODULE EQUIPE v2.0
// ============================================================================

/**
 * Initialise le module EQUIPE v2.0 avec toutes les fonctionnalités
 */
function initialiserEquipe() {
  try {
    Logger.log("👥 Initialisation du module EQUIPE v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("👥 Équipes");

    // Supprimer la feuille si elle existe
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer nouvelle feuille
    sheet = ss.insertSheet("👥 Équipes");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:O1").merge()
      .setValue("👥 GESTION ÉQUIPES v2.0 - COMPOSITION • AFFECTATIONS • PRODUCTIVITÉ • PLANNING")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "EquipeID",
      "Nom",
      "Chef Équipe ID",
      "Projet ID",
      "Type",
      "Effectif Total",
      "Date Création",
      "Statut",
      "Spécialités",
      "Productivité (%)",
      "Charge Travail (h)",
      "Disponibilité (%)",
      "Taux Utilisation (%)",
      "Dernière Affectation",
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
    const columnWidths = [100, 200, 130, 130, 150, 120, 110, 120, 250, 130, 130, 130, 150, 150, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "EQP001",
        "Équipe Topographie Nord",
        "EMP001",
        "PROJ001",
        "Topographie",
        8,
        new Date(2024, 0, 10),
        "Active",
        "Levés GPS, Nivellement, Implantation",
        0.85,
        320,
        0.75,
        '=SI(L3>0;K3/(L3*40);0)',
        new Date(),
        "Équipe principale levés topographiques"
      ],
      [
        "EQP002",
        "Équipe Terrassement Centre",
        "EMP005",
        "PROJ001",
        "Terrassement",
        12,
        new Date(2024, 1, 15),
        "Active",
        "Excavation, Remblais, Compactage",
        0.78,
        480,
        0.80,
        '=SI(L4>0;K4/(L4*40);0)',
        new Date(Date.now() - 86400000),
        "Spécialisée travaux de terre"
      ],
      [
        "EQP003",
        "Équipe Bétonnage Sud",
        "EMP008",
        "PROJ002",
        "Bétonnage",
        10,
        new Date(2024, 2, 5),
        "Active",
        "Coffrage, Ferraillage, Coulage béton",
        0.92,
        400,
        0.85,
        '=SI(L5>0;K5/(L5*40);0)',
        new Date(Date.now() - 172800000),
        "Performance excellente"
      ],
      [
        "EQP004",
        "Équipe Finition Ouest",
        "EMP012",
        "PROJ003",
        "Finition",
        6,
        new Date(2024, 3, 20),
        "Disponible",
        "Revêtements, Peinture, Carrelage",
        0.88,
        0,
        1.00,
        '=SI(L6>0;K6/(L6*40);0)',
        new Date(Date.now() - 604800000),
        "En attente nouvelle affectation"
      ],
      [
        "EQP005",
        "Équipe Maintenance",
        "EMP015",
        "",
        "Topographie",
        4,
        new Date(2024, 4, 10),
        "Maintenance",
        "Entretien matériel, Calibration",
        0.00,
        0,
        0.00,
        '=SI(L7>0;K7/(L7*40);0)',
        new Date(Date.now() - 1209600000),
        "Entretien annuel matériel topographique"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // EquipeID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 8; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"EQP"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Date (colonnes G et N)
    sheet.getRange("G3:G100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    sheet.getRange("N3:N100")
      .setNumberFormat("dd/mm/yyyy hh:mm")
      .setHorizontalAlignment("center");

    // Effectif (colonne F)
    sheet.getRange("F3:F100")
      .setNumberFormat("0")
      .setHorizontalAlignment("center");

    // Productivité, Disponibilité, Taux Utilisation (colonnes J, L, M)
    sheet.getRange("J3:J100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    sheet.getRange("L3:L100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    sheet.getRange("M3:M100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // Charge Travail (colonne K)
    sheet.getRange("K3:K100")
      .setNumberFormat('#,##0" h"')
      .setHorizontalAlignment("right");

    // ===== VALIDATION DES DONNÉES =====

    // Type d'équipe
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Topographie",
        "Terrassement",
        "Bétonnage",
        "Finition",
        "Mixte"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type d'équipe")
      .build();
    sheet.getRange("E3:E100").setDataValidation(regleType);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Active",
        "Disponible",
        "Maintenance",
        "Formation",
        "Dissoute"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut de l'équipe")
      .build();
    sheet.getRange("H3:H100").setDataValidation(regleStatut);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Active")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Disponible")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Maintenance")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("H3:H100")])
      .build());

    // Productivité
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0.8)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.6)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Disponibilité
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(0.7)
      .setBackground("#e6f4ea")
      .setFontColor("#1e8e3e")
      .setRanges([sheet.getRange("L3:L100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.3)
      .setBackground("#fce8e6")
      .setFontColor("#c5221f")
      .setRanges([sheet.getRange("L3:L100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:O${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ÉQUIPES v2.0 - KPIs & PERFORMANCE")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total d'équipes", '=NB.SI(B3:B100;"<>"")', "Équipes enregistrées"],
      ["Équipes actives", '=NB.SI(H3:H100;"Active")', "En cours d'activité"],
      ["Équipes disponibles", '=NB.SI(H3:H100;"Disponible")', "Prêtes pour affectation"],
      ["Effectif total", '=SOMME(F3:F100)', "Membres toutes équipes"],
      ["Charge totale (heures)", '=SOMME(K3:K100)', "Heures de travail planifiées"],
      ["Productivité moyenne", '=MOYENNE(J3:J100)', "Performance globale"],
      ["Disponibilité moyenne", '=MOYENNE(L3:L100)', "Capacité disponible"],
      ["Taux utilisation moyen", '=MOYENNE(M3:M100)', "Efficience générale"],
      ["Équipes en maintenance", '=NB.SI(H3:H100;"Maintenance")', "Hors service temporaire"],
      ["Équipes topographie", '=NB.SI(E3:E100;"Topographie")', "Spécialisées levés"],
      ["Équipes terrassement", '=NB.SI(E3:E100;"Terrassement")', "Spécialisées travaux terre"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 6, 2).setNumberFormat('#,##0" h"');
    sheet.getRange(statsRow + 7, 2, 3, 1).setNumberFormat("0.0%");

    Logger.log("✅ Module EQUIPE v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur initialisation module EQUIPE v2.0: " + error);
    throw error;
  }
}

// ============================================================================
// FONCTIONS CRUD ÉQUIPE v2.0
// ============================================================================

/**
 * Ajoute une nouvelle équipe
 */
function ajouterEquipe(nom, chefEquipeId, projetId, type, effectif, specialites, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    // Vérifier que le chef d'équipe existe
    if (chefEquipeId && !verifierEmployeExiste(chefEquipeId)) {
      throw new Error(`Chef d'équipe ${chefEquipeId} inexistant`);
    }

    const nouvelleLigne = [
      "",  // EquipeID auto
      nom,
      chefEquipeId,
      projetId || "",
      type,
      parseInt(effectif) || 0,
      new Date(),
      "Disponible",
      specialites || "",
      0.00,  // Productivité initiale
      0,     // Charge initiale
      1.00,  // Disponibilité 100%
      "",    // Taux utilisation (formule)
      new Date(),
      observations || ""
    ];

    sheet.appendRow(nouvelleLigne);

    logMessage("EQUIPE", `Nouvelle équipe créée: ${nom}`);

    return {
      success: true,
      message: "Équipe ajoutée avec succès",
      equipeId: `EQP${String(sheet.getLastRow() - 2).padStart(3, '0')}`
    };

  } catch (error) {
    Logger.log("Erreur ajout équipe: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Modifie une équipe existante
 */
function modifierEquipe(equipeId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === equipeId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Équipe non trouvée: " + equipeId);
    }

    const colonnes = {
      "nom": 2,
      "chefEquipeId": 3,
      "projetId": 4,
      "type": 5,
      "effectif": 6,
      "statut": 8,
      "specialites": 9,
      "productivite": 10,
      "chargeTravail": 11,
      "disponibilite": 12,
      "observations": 15
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    // Mise à jour date dernière modification
    sheet.getRange(ligneModifiee, 14).setValue(new Date());

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    logMessage("EQUIPE", `Équipe ${equipeId} modifiée: ${champAModifier} = ${nouvelleValeur}`);

    return { success: true, message: "Équipe modifiée avec succès" };

  } catch (error) {
    Logger.log("Erreur modification équipe: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Supprime une équipe
 */
function supprimerEquipe(equipeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === equipeId) {
        // Vérifier si l'équipe a des affectations actives
        const statut = data[i][7];
        if (statut === "Active") {
          const ui = SpreadsheetApp.getUi();
          const confirmation = ui.alert(
            "Équipe active",
            "Cette équipe est actuellement active. Confirmez la suppression.",
            ui.ButtonSet.YES_NO
          );
          if (confirmation !== ui.Button.YES) {
            return { success: false, message: "Suppression annulée" };
          }
        }

        sheet.deleteRow(i + 1);
        logMessage("EQUIPE", `Équipe supprimée: ${equipeId}`);
        return { success: true, message: "Équipe supprimée avec succès" };
      }
    }

    throw new Error("Équipe non trouvée: " + equipeId);

  } catch (error) {
    Logger.log("Erreur suppression équipe: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Obtient toutes les équipes
 */
function obtenirToutesEquipes(filtreStatut = null) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👥 Équipes");

    if (!sheet) {
      throw new Error("La feuille Équipes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const equipes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {  // Si nom non vide
        const equipe = {
          id: data[i][0],
          nom: data[i][1],
          chefEquipeId: data[i][2],
          projetId: data[i][3],
          type: data[i][4],
          effectif: data[i][5],
          dateCreation: data[i][6],
          statut: data[i][7],
          specialites: data[i][8],
          productivite: data[i][9],
          chargeTravail: data[i][10],
          disponibilite: data[i][11],
          tauxUtilisation: data[i][12],
          derniereAffectation: data[i][13],
          observations: data[i][14]
        };

        if (!filtreStatut || equipe.statut === filtreStatut) {
          equipes.push(equipe);
        }
      }
    }

    return { success: true, equipes: equipes };

  } catch (error) {
    Logger.log("Erreur obtention équipes: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Obtient une équipe par ID
 */
function obtenirEquipeParId(equipeId) {
  try {
    const result = obtenirToutesEquipes();
    if (!result.success) {
      throw new Error(result.message);
    }

    const equipe = result.equipes.find(e => e.id === equipeId);
    if (!equipe) {
      throw new Error("Équipe non trouvée: " + equipeId);
    }

    return { success: true, equipe: equipe };

  } catch (error) {
    Logger.log("Erreur obtention équipe: " + error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// GESTION COMPOSITION ÉQUIPE
// ============================================================================

/**
 * Obtient la composition d'une équipe (chef + membres)
 */
function obtenirCompositionEquipe(equipeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEmployes = ss.getSheetByName("👤 Employés");

    if (!sheetEmployes) {
      throw new Error("La feuille Employés n'existe pas");
    }

    const data = sheetEmployes.getDataRange().getValues();
    const membres = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][10] === equipeId) {  // Colonne EquipeID
        membres.push({
          employeId: data[i][0],
          matricule: data[i][1],
          nom: data[i][2],
          prenom: data[i][3],
          fonction: data[i][4],
          telephone: data[i][5],
          competences: data[i][9]
        });
      }
    }

    // Obtenir info équipe
    const equipeResult = obtenirEquipeParId(equipeId);
    if (!equipeResult.success) {
      throw new Error(equipeResult.message);
    }

    return {
      success: true,
      equipe: equipeResult.equipe,
      membres: membres,
      effectifReel: membres.length
    };

  } catch (error) {
    Logger.log("Erreur composition équipe: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Affecte un employé à une équipe
 */
function affecterEmployeEquipe(employeId, equipeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEmployes = ss.getSheetByName("👤 Employés");

    if (!sheetEmployes) {
      throw new Error("La feuille Employés n'existe pas");
    }

    // Vérifier que l'équipe existe
    const equipeResult = obtenirEquipeParId(equipeId);
    if (!equipeResult.success) {
      throw new Error("Équipe inexistante: " + equipeId);
    }

    const data = sheetEmployes.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Employé non trouvé: " + employeId);
    }

    // Affecter à l'équipe (colonne K = 11)
    sheetEmployes.getRange(ligneModifiee, 11).setValue(equipeId);

    // Mettre à jour effectif équipe
    mettreAJourEffectifEquipe(equipeId);

    logMessage("EQUIPE", `Employé ${employeId} affecté à équipe ${equipeId}`);

    return { success: true, message: "Employé affecté avec succès" };

  } catch (error) {
    Logger.log("Erreur affectation employé: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Retire un employé d'une équipe
 */
function retirerEmployeEquipe(employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEmployes = ss.getSheetByName("👤 Employés");

    if (!sheetEmployes) {
      throw new Error("La feuille Employés n'existe pas");
    }

    const data = sheetEmployes.getDataRange().getValues();
    let ligneModifiee = -1;
    let ancienneEquipeId = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) {
        ligneModifiee = i + 1;
        ancienneEquipeId = data[i][10];
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Employé non trouvé: " + employeId);
    }

    // Retirer de l'équipe
    sheetEmployes.getRange(ligneModifiee, 11).setValue("");

    // Mettre à jour effectif ancienne équipe
    if (ancienneEquipeId) {
      mettreAJourEffectifEquipe(ancienneEquipeId);
    }

    logMessage("EQUIPE", `Employé ${employeId} retiré de l'équipe`);

    return { success: true, message: "Employé retiré avec succès" };

  } catch (error) {
    Logger.log("Erreur retrait employé: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Met à jour l'effectif d'une équipe
 */
function mettreAJourEffectifEquipe(equipeId) {
  try {
    const composition = obtenirCompositionEquipe(equipeId);
    if (!composition.success) {
      throw new Error(composition.message);
    }

    modifierEquipe(equipeId, "effectif", composition.effectifReel);

    return { success: true, effectif: composition.effectifReel };

  } catch (error) {
    Logger.log("Erreur MAJ effectif: " + error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// GESTION AFFECTATIONS PROJET/OUVRAGE
// ============================================================================

/**
 * Affecte une équipe à un projet
 */
function affecterEquipeProjet(equipeId, projetId, chargeTravailHeures) {
  try {
    // Vérifier que le projet existe
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetProjets = ss.getSheetByName("📁 Projets");

    if (!sheetProjets) {
      throw new Error("La feuille Projets n'existe pas");
    }

    const dataProjets = sheetProjets.getDataRange().getValues();
    let projetTrouve = false;

    for (let i = 2; i < dataProjets.length; i++) {
      if (dataProjets[i][0] === projetId) {
        projetTrouve = true;
        break;
      }
    }

    if (!projetTrouve) {
      throw new Error("Projet inexistant: " + projetId);
    }

    // Affecter l'équipe
    modifierEquipe(equipeId, "projetId", projetId);
    modifierEquipe(equipeId, "chargeTravail", parseFloat(chargeTravailHeures) || 0);
    modifierEquipe(equipeId, "statut", "Active");

    // Calculer disponibilité
    calculerDisponibiliteEquipe(equipeId);

    logMessage("EQUIPE", `Équipe ${equipeId} affectée au projet ${projetId} (${chargeTravailHeures}h)`);

    return {
      success: true,
      message: "Équipe affectée au projet avec succès"
    };

  } catch (error) {
    Logger.log("Erreur affectation projet: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Libère une équipe d'un projet
 */
function libererEquipeProjet(equipeId) {
  try {
    modifierEquipe(equipeId, "projetId", "");
    modifierEquipe(equipeId, "chargeTravail", 0);
    modifierEquipe(equipeId, "statut", "Disponible");
    modifierEquipe(equipeId, "disponibilite", 1.00);

    logMessage("EQUIPE", `Équipe ${equipeId} libérée`);

    return { success: true, message: "Équipe libérée avec succès" };

  } catch (error) {
    Logger.log("Erreur libération équipe: " + error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// CALCUL PRODUCTIVITÉ & PERFORMANCE
// ============================================================================

/**
 * Calcule la productivité d'une équipe
 */
function calculerProductiviteEquipe(equipeId) {
  try {
    // Récupérer composition équipe
    const composition = obtenirCompositionEquipe(equipeId);
    if (!composition.success) {
      throw new Error(composition.message);
    }

    const equipe = composition.equipe;
    const effectif = composition.effectifReel;

    if (effectif === 0) {
      return { success: true, productivite: 0 };
    }

    // Calcul simplifié basé sur disponibilité et charge
    let productivite = 0;
    if (equipe.chargeTravail > 0) {
      const capacite = effectif * 160; // 160h/mois par personne
      productivite = Math.min(1, equipe.chargeTravail / capacite);
    }

    // Mise à jour dans la feuille
    modifierEquipe(equipeId, "productivite", productivite);

    return { success: true, productivite: productivite };

  } catch (error) {
    Logger.log("Erreur calcul productivité: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Calcule la disponibilité d'une équipe
 */
function calculerDisponibiliteEquipe(equipeId) {
  try {
    const equipeResult = obtenirEquipeParId(equipeId);
    if (!equipeResult.success) {
      throw new Error(equipeResult.message);
    }

    const equipe = equipeResult.equipe;
    const effectif = equipe.effectif || 0;
    const chargeTravail = equipe.chargeTravail || 0;

    if (effectif === 0) {
      modifierEquipe(equipeId, "disponibilite", 0);
      return { success: true, disponibilite: 0 };
    }

    // Capacité totale: effectif * 160h/mois
    const capaciteTotale = effectif * 160;

    // Disponibilité = (capacité - charge) / capacité
    let disponibilite = (capaciteTotale - chargeTravail) / capaciteTotale;
    disponibilite = Math.max(0, Math.min(1, disponibilite));

    modifierEquipe(equipeId, "disponibilite", disponibilite);

    return { success: true, disponibilite: disponibilite };

  } catch (error) {
    Logger.log("Erreur calcul disponibilité: " + error);
    return { success: false, message: error.message };
  }
}

/**
 * Obtient les KPIs des équipes
 */
function obtenirKPIsEquipes() {
  try {
    const result = obtenirToutesEquipes();
    if (!result.success) {
      throw new Error(result.message);
    }

    const equipes = result.equipes;

    const kpis = {
      nombreTotal: equipes.length,
      actives: equipes.filter(e => e.statut === "Active").length,
      disponibles: equipes.filter(e => e.statut === "Disponible").length,
      enMaintenance: equipes.filter(e => e.statut === "Maintenance").length,
      effectifTotal: equipes.reduce((sum, e) => sum + (e.effectif || 0), 0),
      chargeTotale: equipes.reduce((sum, e) => sum + (e.chargeTravail || 0), 0),
      productiviteMoyenne: equipes.reduce((sum, e) => sum + (e.productivite || 0), 0) / equipes.length || 0,
      disponibiliteMoyenne: equipes.reduce((sum, e) => sum + (e.disponibilite || 0), 0) / equipes.length || 0,
      parType: {
        topographie: equipes.filter(e => e.type === "Topographie").length,
        terrassement: equipes.filter(e => e.type === "Terrassement").length,
        betonnage: equipes.filter(e => e.type === "Bétonnage").length,
        finition: equipes.filter(e => e.type === "Finition").length
      }
    };

    return { success: true, kpis: kpis };

  } catch (error) {
    Logger.log("Erreur KPIs équipes: " + error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Vérifie si un employé existe
 */
function verifierEmployeExiste(employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");

    if (!sheet) return false;

    const data = sheet.getDataRange().getValues();
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) {
        return true;
      }
    }
    return false;

  } catch (error) {
    return false;
  }
}

// ============================================================================
// INTERFACE UTILISATEUR
// ============================================================================

/**
 * Affiche la sidebar de gestion des équipes
 */
function afficherSidebarEquipe() {
  const html = HtmlService.createHtmlOutputFromFile('modules/equipe/EquipeSidebar')
    .setTitle('Gestion Équipes v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal de gestion des équipes
 */
function afficherModalEquipe() {
  const html = HtmlService.createHtmlOutputFromFile('modules/equipe/EquipeModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire d\'Équipes v2.0');
}

/**
 * Fallback pour logMessage si module Core pas chargé
 */
function logMessage(type, message, metadata = {}) {
  try {
    if (typeof journaliserAction === 'function') {
      journaliserAction(type, message);
    } else {
      Logger.log(`[${type}] ${message}`);
    }
  } catch (error) {
    Logger.log(`[${type}] ${message}`);
  }
}
