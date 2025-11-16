/**
 * ============================================================================
 * MODULE BUDGET v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion budgétaire complète avec prévisionnel/réalisé,
 *              révisions, alertes dépassement et consolidation multi-projets
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD budgets par projet/ouvrage
 * ✅ Prévisionnel vs Réalisé avec écarts automatiques
 * ✅ Lignes budgétaires détaillées (main d'œuvre, matériel, sous-traitance, etc.)
 * ✅ Révisions budgétaires avec historique complet
 * ✅ Alertes dépassement automatiques (>90%, >100%)
 * ✅ Consolidation budgets multi-projets
 * ✅ KPIs financiers avancés
 * ============================================================================
 */

// ============================================================================
// INITIALISATION DU MODULE BUDGET v2.0
// ============================================================================

/**
 * Initialise le module BUDGET v2.0 avec toutes les fonctionnalités avancées
 */
function initialiserBudgetV2() {
  try {
    Logger.log("💰 Initialisation du module BUDGET v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("💰 Budget");

    if (sheet) {
      ss.deleteSheet(sheet);
    }

    sheet = ss.insertSheet("💰 Budget");
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // EN-TÊTE PRINCIPAL
    sheet.getRange("A1:P1").merge()
      .setValue("💰 GESTION BUDGET v2.0 - PRÉVISIONNEL • RÉALISÉ • RÉVISIONS • ALERTES • CONSOLIDATION")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // COLONNES DE DONNÉES
    const headers = [
      "BudgetID",
      "ProjetID",
      "OuvrageID",
      "Periode",
      "Annee",
      "Mois",
      "LigneBudgetaire",
      "MontantPrevu",
      "MontantRealise",
      "Ecart",
      "TauxConsommation (%)",
      "Statut",
      "Revision",
      "DateRevision",
      "Responsable",
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

    // LARGEURS DE COLONNES
    const columnWidths = [100, 100, 100, 130, 80, 80, 180, 150, 150, 150, 120, 130, 100, 110, 150, 300];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // DONNÉES D'EXEMPLE
    const donneesExemple = [
      [
        "BUD001",
        "PROJ001",
        "OUV001",
        "Mensuel",
        2024,
        1,
        "Main d'œuvre",
        45000000,
        22500000,
        '=H3-I3',
        '=SI(H3>0;I3/H3;0)',
        '=SI(I3>H3;"Dépassé";SI(I3>H3*0.9;"Alerte >90%";SI(I3>0;"En cours";"Planifié")))',
        1,
        new Date(2024, 0, 15),
        "Mbarga Jean",
        "Budget initial validé"
      ],
      [
        "BUD002",
        "PROJ001",
        "OUV001",
        "Mensuel",
        2024,
        2,
        "Matériel",
        280000000,
        168000000,
        '=H4-I4',
        '=SI(H4>0;I4/H4;0)',
        '=SI(I4>H4;"Dépassé";SI(I4>H4*0.9;"Alerte >90%";SI(I4>0;"En cours";"Planifié")))',
        1,
        new Date(2024, 1, 1),
        "Nkolo Marie",
        "Achats matériaux en cours"
      ],
      [
        "BUD003",
        "PROJ001",
        "OUV002",
        "Trimestriel",
        2024,
        3,
        "Sous-traitance",
        125000000,
        130000000,
        '=H5-I5',
        '=SI(H5>0;I5/H5;0)',
        '=SI(I5>H5;"Dépassé";SI(I5>H5*0.9;"Alerte >90%";SI(I5>0;"En cours";"Planifié")))',
        2,
        new Date(2024, 2, 15),
        "Tchokothe Paul",
        "⚠️ DÉPASSEMENT: Avenant requis"
      ],
      [
        "BUD004",
        "PROJ002",
        "OUV003",
        "Mensuel",
        2024,
        1,
        "Logistique",
        35000000,
        32000000,
        '=H6-I6',
        '=SI(H6>0;I6/H6;0)',
        '=SI(I6>H6;"Dépassé";SI(I6>H6*0.9;"Alerte >90%";SI(I6>0;"En cours";"Planifié")))',
        1,
        new Date(2024, 0, 20),
        "Essomba Claire",
        "Transport matériaux"
      ],
      [
        "BUD005",
        "PROJ001",
        "OUV001",
        "Annuel",
        2024,
        12,
        "Divers",
        18000000,
        0,
        '=H7-I7',
        '=SI(H7>0;I7/H7;0)',
        '=SI(I7>H7;"Dépassé";SI(I7>H7*0.9;"Alerte >90%";SI(I7>0;"En cours";"Planifié")))',
        1,
        new Date(2024, 0, 1),
        "Mbarga Jean",
        "Réserve imprévus"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // FORMATAGE DES DONNÉES

    // BudgetID auto-incrémentation
    for (let i = 8; i <= 500; i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"BUD"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Montants FCFA
    sheet.getRange("H3:I500")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    sheet.getRange("J3:J500")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Taux consommation
    sheet.getRange("K3:K500")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // Dates
    sheet.getRange("N3:N500")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // VALIDATION DES DONNÉES

    // ProjetID
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("📁 Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un projet existant")
      .build();
    sheet.getRange("B3:B500").setDataValidation(regleProjet);

    // OuvrageID
    const regleOuvrage = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("🏗️ Ouvrages").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un ouvrage existant")
      .build();
    sheet.getRange("C3:C500").setDataValidation(regleOuvrage);

    // Période
    const reglePeriode = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Mensuel", "Trimestriel", "Annuel"], true)
      .setAllowInvalid(false)
      .setHelpText("Type de période budgétaire")
      .build();
    sheet.getRange("D3:D500").setDataValidation(reglePeriode);

    // Ligne budgétaire
    const regleLigne = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Main d'œuvre",
        "Matériel",
        "Sous-traitance",
        "Logistique",
        "Divers"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Catégorie de dépense")
      .build();
    sheet.getRange("G3:G500").setDataValidation(regleLigne);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Planifié",
        "En cours",
        "Alerte >90%",
        "Dépassé",
        "Clôturé"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Statut budgétaire")
      .build();
    sheet.getRange("L3:L500").setDataValidation(regleStatut);

    // MISE EN FORME CONDITIONNELLE
    const rules = sheet.getConditionalFormatRules();

    // Statut - Dépassé (rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Dépassé")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // Statut - Alerte >90% (orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Alerte >90%")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // Statut - En cours (bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En cours")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // Statut - Clôturé (vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Clôturé")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("L3:L500")])
      .build());

    // Taux consommation >100% (rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(1)
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K500")])
      .build());

    // Taux consommation >90% (orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.9, 1)
      .setBackground("#fef7e0")
      .setFontColor("#ea8600")
      .setBold(true)
      .setRanges([sheet.getRange("K3:K500")])
      .build());

    // Écart négatif (dépassement)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0)
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J500")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // SECTION STATISTIQUES
    const statsRow = 510;

    sheet.getRange(`A${statsRow}:P${statsRow}`).merge()
      .setValue("📊 STATISTIQUES BUDGÉTAIRES v2.0 - KPIs FINANCIERS")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Budget Total Prévu", '=SOMME(H3:H500)', "Enveloppe globale"],
      ["Budget Total Consommé", '=SOMME(I3:I500)', "Réalisé effectif"],
      ["Budget Disponible", '=B${statsRow+2}-B${statsRow+3}', "Solde restant"],
      ["Taux Consommation Global", '=SI(B${statsRow+2}>0;B${statsRow+3}/B${statsRow+2};0)', "% budget utilisé"],
      ["Nombre Lignes Budget", '=NB.SI(B3:B500;"<>"")', "Postes budgétaires"],
      ["Lignes en Dépassement", '=NB.SI(L3:L500;"Dépassé")', "Alertes critiques"],
      ["Lignes Alerte >90%", '=NB.SI(L3:L500;"Alerte >90%")', "Surveillance requise"],
      ["Total Dépassements", '=SOMME(SI(J3:J500<0;ABS(J3:J500);0))', "Montant hors budget"],
      ["Projections Fin", '=SI(B${statsRow+5}>0;B${statsRow+3}/(B${statsRow+5}*0.01);0)', "Estimation finale"],
      ["Budget Main d'œuvre", '=SOMME.SI(G3:G500;"Main d''œuvre";H3:H500)', "Personnel"],
      ["Budget Matériel", '=SOMME.SI(G3:G500;"Matériel";H3:H500)', "Équipements"],
      ["Budget Sous-traitance", '=SOMME.SI(G3:G500;"Sous-traitance";H3:H500)', "Prestataires"],
      ["Budget Logistique", '=SOMME.SI(G3:G500;"Logistique";H3:H500)', "Transport"],
      ["Budget Divers", '=SOMME.SI(G3:G500;"Divers";H3:H500)', "Autres postes"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 2, 2, 4, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 5, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 9, 2, 2, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 11, 2, 5, 1).setNumberFormat('#,##0" FCFA"');

    Logger.log("✅ Module BUDGET v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur initialisation BUDGET v2.0: " + error);
    throw error;
  }
}

// ============================================================================
// FONCTIONS CRUD BUDGET v2.0
// ============================================================================

/**
 * Ajoute une ligne budgétaire
 */
function ajouterLigneBudget(projetId, ouvrageId, periode, annee, mois, ligneBudgetaire, montantPrevu, responsable, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("Feuille Budget non trouvée");
    }

    if (montantPrevu <= 0) {
      throw new Error("Le montant prévu doit être positif");
    }

    const nouvelleLigne = [
      "",
      projetId,
      ouvrageId,
      periode,
      annee,
      mois,
      ligneBudgetaire,
      parseFloat(montantPrevu),
      0,
      `=H${sheet.getLastRow() + 1}-I${sheet.getLastRow() + 1}`,
      `=SI(H${sheet.getLastRow() + 1}>0;I${sheet.getLastRow() + 1}/H${sheet.getLastRow() + 1};0)`,
      "Planifié",
      1,
      new Date(),
      responsable,
      observations || ""
    ];

    sheet.appendRow(nouvelleLigne);

    if (typeof journaliserAction === 'function') {
      journaliserAction("BUDGET", `Nouvelle ligne budget: ${ligneBudgetaire} - ${montantPrevu} FCFA`);
    }

    return {success: true, message: "Ligne budgétaire ajoutée"};

  } catch (error) {
    Logger.log("Erreur ajout ligne budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Enregistre un montant réalisé
 */
function enregistrerRealise(budgetId, montantRealise, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("Feuille Budget non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    let budgetData = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === budgetId) {
        ligneModifiee = i + 1;
        budgetData = data[i];
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Budget non trouvé: " + budgetId);
    }

    if (montantRealise < 0) {
      throw new Error("Le montant réalisé doit être positif ou nul");
    }

    const montantPrevu = budgetData[7];
    const tauxConsommation = montantPrevu > 0 ? montantRealise / montantPrevu : 0;

    // Déterminer statut
    let statut = "En cours";
    if (montantRealise > montantPrevu) {
      statut = "Dépassé";
    } else if (montantRealise > montantPrevu * 0.9) {
      statut = "Alerte >90%";
    } else if (montantRealise === montantPrevu) {
      statut = "Clôturé";
    }

    sheet.getRange(ligneModifiee, 9).setValue(parseFloat(montantRealise));
    sheet.getRange(ligneModifiee, 12).setValue(statut);
    sheet.getRange(ligneModifiee, 16).setValue(observations || budgetData[15]);

    // Alerte si dépassement
    if (statut === "Dépassé" && typeof envoyerNotification === 'function') {
      const ecart = montantRealise - montantPrevu;
      envoyerNotification(
        1,
        `⚠️ DÉPASSEMENT BUDGÉTAIRE: ${budgetData[6]} - Écart: ${ecart.toLocaleString()} FCFA (+${(tauxConsommation * 100 - 100).toFixed(1)}%)`,
        "HAUTE"
      );
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("BUDGET", `Réalisé enregistré: ${budgetId} - ${montantRealise} FCFA (${statut})`);
    }

    return {
      success: true,
      message: "Montant réalisé enregistré",
      statut: statut,
      tauxConsommation: tauxConsommation * 100
    };

  } catch (error) {
    Logger.log("Erreur enregistrement réalisé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Crée une révision budgétaire
 */
function creerRevisionBudget(budgetId, nouveauMontantPrevu, motif) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("Feuille Budget non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    let budgetData = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === budgetId) {
        ligneModifiee = i + 1;
        budgetData = data[i];
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Budget non trouvé: " + budgetId);
    }

    const ancienMontant = budgetData[7];
    const revisionActuelle = budgetData[12];
    const nouvelleRevision = revisionActuelle + 1;

    sheet.getRange(ligneModifiee, 8).setValue(parseFloat(nouveauMontantPrevu));
    sheet.getRange(ligneModifiee, 13).setValue(nouvelleRevision);
    sheet.getRange(ligneModifiee, 14).setValue(new Date());
    sheet.getRange(ligneModifiee, 16).setValue(
      `RÉVISION ${nouvelleRevision}: ${ancienMontant.toLocaleString()} → ${nouveauMontantPrevu.toLocaleString()} FCFA. ${motif}`
    );

    if (typeof journaliserAction === 'function') {
      journaliserAction(
        "BUDGET",
        `Révision budgétaire ${nouvelleRevision}: ${budgetId} - ${ancienMontant.toLocaleString()} → ${nouveauMontantPrevu.toLocaleString()} FCFA`
      );
    }

    return {
      success: true,
      message: "Révision budgétaire créée",
      revision: nouvelleRevision,
      variation: nouveauMontantPrevu - ancienMontant
    };

  } catch (error) {
    Logger.log("Erreur révision budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Consolide les budgets par projet
 */
function consoliderBudgetsProjet(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("Feuille Budget non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    const consolidation = {
      projetId: projetId,
      budgetTotal: 0,
      realiseTotal: 0,
      ecartTotal: 0,
      tauxConsommationGlobal: 0,
      nombreLignes: 0,
      parLigneBudgetaire: {},
      parOuvrage: {},
      alertes: {
        depassements: 0,
        alertes90: 0
      }
    };

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] === projetId) {
        const montantPrevu = data[i][7] || 0;
        const montantRealise = data[i][8] || 0;
        const ecart = montantPrevu - montantRealise;
        const ligneBudgetaire = data[i][6];
        const ouvrageId = data[i][2];
        const statut = data[i][11];

        consolidation.budgetTotal += montantPrevu;
        consolidation.realiseTotal += montantRealise;
        consolidation.ecartTotal += ecart;
        consolidation.nombreLignes++;

        // Par ligne budgétaire
        if (!consolidation.parLigneBudgetaire[ligneBudgetaire]) {
          consolidation.parLigneBudgetaire[ligneBudgetaire] = {
            prevu: 0,
            realise: 0,
            ecart: 0
          };
        }
        consolidation.parLigneBudgetaire[ligneBudgetaire].prevu += montantPrevu;
        consolidation.parLigneBudgetaire[ligneBudgetaire].realise += montantRealise;
        consolidation.parLigneBudgetaire[ligneBudgetaire].ecart += ecart;

        // Par ouvrage
        if (!consolidation.parOuvrage[ouvrageId]) {
          consolidation.parOuvrage[ouvrageId] = {
            prevu: 0,
            realise: 0,
            ecart: 0
          };
        }
        consolidation.parOuvrage[ouvrageId].prevu += montantPrevu;
        consolidation.parOuvrage[ouvrageId].realise += montantRealise;
        consolidation.parOuvrage[ouvrageId].ecart += ecart;

        // Alertes
        if (statut === "Dépassé") consolidation.alertes.depassements++;
        if (statut === "Alerte >90%") consolidation.alertes.alertes90++;
      }
    }

    consolidation.tauxConsommationGlobal = consolidation.budgetTotal > 0
      ? (consolidation.realiseTotal / consolidation.budgetTotal) * 100
      : 0;

    return {success: true, consolidation: consolidation};

  } catch (error) {
    Logger.log("Erreur consolidation budget: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les alertes de dépassement
 */
function obtenirAlertesDepassement() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💰 Budget");

    if (!sheet) {
      throw new Error("Feuille Budget non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    const alertes = {
      depassements: [],
      alertes90: [],
      totalDepassement: 0,
      totalAlerte90: 0
    };

    for (let i = 2; i < data.length; i++) {
      const statut = data[i][11];
      const montantPrevu = data[i][7];
      const montantRealise = data[i][8];
      const ecart = montantPrevu - montantRealise;

      if (statut === "Dépassé") {
        alertes.depassements.push({
          budgetId: data[i][0],
          projetId: data[i][1],
          ligneBudgetaire: data[i][6],
          montantPrevu: montantPrevu,
          montantRealise: montantRealise,
          ecart: ecart,
          tauxConsommation: (montantRealise / montantPrevu) * 100
        });
        alertes.totalDepassement += Math.abs(ecart);
      }

      if (statut === "Alerte >90%") {
        alertes.alertes90.push({
          budgetId: data[i][0],
          projetId: data[i][1],
          ligneBudgetaire: data[i][6],
          montantPrevu: montantPrevu,
          montantRealise: montantRealise,
          margeRestante: ecart,
          tauxConsommation: (montantRealise / montantPrevu) * 100
        });
        alertes.totalAlerte90 += ecart;
      }
    }

    return {
      success: true,
      alertes: alertes,
      countDepassements: alertes.depassements.length,
      countAlertes90: alertes.alertes90.length
    };

  } catch (error) {
    Logger.log("Erreur alertes dépassement: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affiche la sidebar Budget
 */
function afficherSidebarBudget() {
  const html = HtmlService.createHtmlOutputFromFile('modules/budget/BudgetSidebar')
    .setTitle('Gestion Budget v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal Budget
 */
function afficherModalBudget() {
  const html = HtmlService.createHtmlOutputFromFile('modules/budget/BudgetModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire Budget v2.0 - Prévisionnel & Réalisé');
}
