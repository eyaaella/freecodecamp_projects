/**
 * MODULE POSTE v2.0 - Référentiel des Postes RH
 * Gestion des postes, grilles salariales, organigramme et compétences
 * Version: 2.0 Production Ready
 */

// ==================== INITIALISATION DU MODULE POSTE v2.0 ====================

/**
 * Initialise le module POSTE v2.0 avec toutes les fonctionnalités
 */
function initialiserPoste() {
  try {
    Logger.log("💼 Initialisation du module POSTE v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("💼 Postes");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("💼 Postes");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:N1").merge()
      .setValue("💼 RÉFÉRENTIEL DES POSTES v2.0 - GRILLE SALARIALE & ORGANIGRAMME")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "PosteID",
      "Titre",
      "Département",
      "NiveauHiérarchique",
      "CompétencesRequises",
      "SalaireMin (FCFA)",
      "SalaireMax (FCFA)",
      "NbPostes",
      "NbPourvus",
      "NbVacants",
      "Description",
      "ResponsableID",
      "Statut",
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
    const columnWidths = [100, 200, 150, 120, 250, 150, 150, 100, 100, 100, 300, 120, 100, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "POST001",
        "Directeur Général",
        "Direction",
        "Directeur",
        "Leadership, Gestion stratégique, Vision d'entreprise",
        3500000,
        5000000,
        1,
        1,
        0,
        "Direction générale de TopoGest Pro",
        "",
        "Actif",
        "Poste de direction stratégique"
      ],
      [
        "POST002",
        "Chef de Projet Senior",
        "Projets",
        "Manager",
        "Gestion projet, EVM, Gantt, Leadership",
        1800000,
        2800000,
        3,
        2,
        1,
        "Pilotage projets d'aménagement majeurs",
        "POST001",
        "Actif",
        "Recrutement en cours"
      ],
      [
        "POST003",
        "Topographe Principal",
        "Topographie",
        "Senior",
        "GPS RTK, Station totale, CAO/DAO",
        1000000,
        1800000,
        5,
        4,
        1,
        "Levés topographiques et supervision terrain",
        "POST002",
        "Actif",
        "Expertise périmètres irrigués requise"
      ],
      [
        "POST004",
        "Technicien Topographe",
        "Topographie",
        "Junior",
        "GPS, Niveau, Théodolite, Calculs topo",
        500000,
        900000,
        8,
        6,
        2,
        "Exécution levés terrain",
        "POST003",
        "Actif",
        "Formation continue assurée"
      ],
      [
        "POST005",
        "Ingénieur Hydraulicien",
        "Ingénierie",
        "Senior",
        "Hydraulique, CAO, Dimensionnement ouvrages",
        1500000,
        2500000,
        2,
        2,
        0,
        "Conception ouvrages hydrauliques",
        "POST001",
        "Actif",
        "Spécialisation irrigation gravitaire"
      ],
      [
        "POST006",
        "Gestionnaire RH",
        "Administration",
        "Manager",
        "Paie, Législation, GRH, Excel avancé",
        800000,
        1200000,
        1,
        1,
        0,
        "Gestion administrative du personnel",
        "POST001",
        "Actif",
        "Maîtrise OHADA et Code du Travail CM"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // PosteID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 9; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"POST"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Salaires (colonnes F et G)
    sheet.getRange("F3:G100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Nombres (colonnes H, I, J)
    sheet.getRange("H3:J100")
      .setNumberFormat('0')
      .setHorizontalAlignment("center");

    // Formule NbVacants (colonne J) = NbPostes - NbPourvus
    for (let i = 3; i <= 100; i++) {
      sheet.getRange(`J${i}`).setFormula(`=SI(H${i}>0;H${i}-I${i};0)`);
    }

    // ===== VALIDATION DES DONNÉES =====

    // Département
    const regleDepartement = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Direction", "Projets", "Topographie", "Ingénierie", "Administration", "Terrain"], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le département")
      .build();
    sheet.getRange("C3:C100").setDataValidation(regleDepartement);

    // NiveauHiérarchique
    const regleNiveau = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Junior", "Senior", "Manager", "Directeur"], true)
      .setAllowInvalid(false)
      .setHelpText("Niveau hiérarchique du poste")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleNiveau);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "Inactif", "En révision"], true)
      .setAllowInvalid(false)
      .setHelpText("Statut du poste")
      .build();
    sheet.getRange("M3:M100").setDataValidation(regleStatut);

    // Salaires (nombres positifs)
    const regleSalaire = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Salaire en FCFA (> 0)")
      .build();
    sheet.getRange("F3:G100").setDataValidation(regleSalaire);

    // Nombres de postes
    const regleNombre = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Nombre entier >= 0")
      .build();
    sheet.getRange("H3:I100").setDataValidation(regleNombre);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // NiveauHiérarchique - Couleurs différenciées
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Directeur")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Manager")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Senior")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Junior")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("D3:D100")])
      .build());

    // Postes vacants - Alerte si > 0
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0)
      .setBackground("#fff3e0")
      .setFontColor("#e65100")
      .setBold(true)
      .setRanges([sheet.getRange("J3:J100")])
      .build());

    // Statut
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Actif")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Inactif")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:N${statsRow}`).merge()
      .setValue("📊 STATISTIQUES RH ET GRILLE SALARIALE")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Total postes", '=NB.SI(B3:B100;"<>"")', "Postes au référentiel"],
      ["Postes actifs", '=NB.SI(M3:M100;"Actif")', "Disponibles"],
      ["Total employés théorique", '=SOMME(H3:H100)', "Si tous postes pourvus"],
      ["Employés actuels", '=SOMME(I3:I100)', "Postes pourvus"],
      ["Postes vacants", '=SOMME(J3:J100)', "À pourvoir"],
      ["Taux de pourvoi", '=SI(B${statsRow+3}>0;B${statsRow+4}/B${statsRow+3};0)', "% postes pourvus"],
      ["Salaire moyen min", '=MOYENNE(F3:F100)', "Moyenne minimums"],
      ["Salaire moyen max", '=MOYENNE(G3:G100)', "Moyenne maximums"],
      ["Salaire moyen global", '=MOYENNE(F3:G100)', "Moyenne générale"],
      ["Postes Junior", '=NB.SI(D3:D100;"Junior")', "Niveau débutant"],
      ["Postes Senior", '=NB.SI(D3:D100;"Senior")', "Niveau confirmé"],
      ["Postes Manager", '=NB.SI(D3:D100;"Manager")', "Management"],
      ["Postes Directeur", '=NB.SI(D3:D100;"Directeur")', "Direction"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 7, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 8, 2, 3, 1).setNumberFormat('#,##0" FCFA"');

    Logger.log("✅ Module POSTE v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module POSTE v2.0: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute un nouveau poste
 */
function ajouterPoste(titre, departement, niveau, competences, salaireMin, salaireMax, nbPostes, description, responsableId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    // Validation
    if (parseFloat(salaireMax) <= parseFloat(salaireMin)) {
      throw new Error("Le salaire maximum doit être supérieur au salaire minimum");
    }

    const nouvelleLigne = [
      "",  // PosteID auto-généré
      titre,
      departement,
      niveau,
      competences,
      parseFloat(salaireMin),
      parseFloat(salaireMax),
      parseInt(nbPostes),
      0,  // NbPourvus initial
      "",  // NbVacants (formule)
      description,
      responsableId || "",
      "Actif",
      ""
    ];

    sheet.appendRow(nouvelleLigne);

    if (typeof journaliserAction === 'function') {
      journaliserAction("POSTE", `Nouveau poste créé: ${titre}`);
    }

    return {success: true, message: "Poste ajouté avec succès"};

  } catch (error) {
    Logger.log("Erreur ajout poste: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie un poste existant
 */
function modifierPoste(posteId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === posteId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Poste non trouvé: " + posteId);
    }

    const colonnes = {
      "titre": 2, "departement": 3, "niveau": 4, "competences": 5,
      "salaireMin": 6, "salaireMax": 7, "nbPostes": 8, "nbPourvus": 9,
      "description": 11, "responsableId": 12, "statut": 13, "observations": 14
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("POSTE", `Poste ${posteId} modifié: ${champAModifier}`);
    }

    return {success: true, message: "Poste modifié avec succès"};

  } catch (error) {
    Logger.log("Erreur modification poste: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Supprime (désactive) un poste
 */
function supprimerPoste(posteId) {
  return modifierPoste(posteId, "statut", "Inactif");
}

/**
 * Obtient tous les postes
 */
function obtenirTousPostes() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const postes = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {
        postes.push({
          id: data[i][0],
          titre: data[i][1],
          departement: data[i][2],
          niveau: data[i][3],
          competences: data[i][4],
          salaireMin: data[i][5],
          salaireMax: data[i][6],
          nbPostes: data[i][7],
          nbPourvus: data[i][8],
          nbVacants: data[i][9],
          description: data[i][10],
          responsableId: data[i][11],
          statut: data[i][12]
        });
      }
    }

    return {success: true, postes: postes};

  } catch (error) {
    Logger.log("Erreur obtention postes: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les KPIs des postes
 */
function obtenirKPIsPostes() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    
    let totalPostes = 0;
    let totalPourvus = 0;
    let totalVacants = 0;
    let sommeSalairesMoyens = 0;
    let count = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][12] === "Actif") {
        totalPostes += data[i][7] || 0;
        totalPourvus += data[i][8] || 0;
        totalVacants += data[i][9] || 0;
        sommeSalairesMoyens += ((data[i][5] + data[i][6]) / 2) || 0;
        count++;
      }
    }

    const salaireMoyen = count > 0 ? sommeSalairesMoyens / count : 0;

    return {
      success: true,
      kpis: {
        total: totalPostes,
        pourvus: totalPourvus,
        vacants: totalVacants,
        salaireMoyen: Math.round(salaireMoyen)
      }
    };

  } catch (error) {
    Logger.log("Erreur calcul KPIs: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère l'organigramme hiérarchique
 */
function genererOrganigramme() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const organigramme = {
      directeurs: [],
      managers: [],
      seniors: [],
      juniors: []
    };

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][12] === "Actif") {
        const poste = {
          id: data[i][0],
          titre: data[i][1],
          departement: data[i][2],
          niveau: data[i][3],
          nbPostes: data[i][7],
          nbPourvus: data[i][8],
          responsableId: data[i][11]
        };

        switch (data[i][3]) {
          case "Directeur":
            organigramme.directeurs.push(poste);
            break;
          case "Manager":
            organigramme.managers.push(poste);
            break;
          case "Senior":
            organigramme.seniors.push(poste);
            break;
          case "Junior":
            organigramme.juniors.push(poste);
            break;
        }
      }
    }

    return {success: true, organigramme: organigramme};

  } catch (error) {
    Logger.log("Erreur génération organigramme: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les postes vacants
 */
function obtenirPostesVacants() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const postesVacants = [];

    for (let i = 2; i < data.length; i++) {
      if (data[i][1] && data[i][12] === "Actif" && data[i][9] > 0) {
        postesVacants.push({
          id: data[i][0],
          titre: data[i][1],
          departement: data[i][2],
          niveau: data[i][3],
          nbVacants: data[i][9],
          salaireMin: data[i][5],
          salaireMax: data[i][6]
        });
      }
    }

    return {success: true, postes: postesVacants, count: postesVacants.length};

  } catch (error) {
    Logger.log("Erreur obtention postes vacants: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affecte un employé à un poste
 */
function affecterEmployePoste(posteId, employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === posteId) {
        const nbPostes = data[i][7];
        const nbPourvus = data[i][8];

        if (nbPourvus >= nbPostes) {
          throw new Error("Tous les postes sont déjà pourvus");
        }

        sheet.getRange(i + 1, 9).setValue(nbPourvus + 1);

        if (typeof journaliserAction === 'function') {
          journaliserAction("POSTE", `Employé ${employeId} affecté au poste ${posteId}`);
        }

        return {success: true, message: "Employé affecté avec succès"};
      }
    }

    throw new Error("Poste non trouvé");

  } catch (error) {
    Logger.log("Erreur affectation employé: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Libère un poste (employé quittant)
 */
function libererPoste(posteId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("💼 Postes");

    if (!sheet) {
      throw new Error("La feuille Postes n'existe pas");
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === posteId) {
        const nbPourvus = data[i][8];

        if (nbPourvus <= 0) {
          throw new Error("Aucun poste n'est pourvu");
        }

        sheet.getRange(i + 1, 9).setValue(nbPourvus - 1);

        if (typeof journaliserAction === 'function') {
          journaliserAction("POSTE", `Poste libéré: ${posteId}`);
        }

        return {success: true, message: "Poste libéré avec succès"};
      }
    }

    throw new Error("Poste non trouvé");

  } catch (error) {
    Logger.log("Erreur libération poste: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== FONCTIONS INTERFACE ====================

function afficherSidebarPoste() {
  const html = HtmlService.createHtmlOutputFromFile('modules/poste/PosteSidebar')
    .setTitle('Gestion Postes v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalPoste() {
  const html = HtmlService.createHtmlOutputFromFile('modules/poste/PosteModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Postes v2.0 - Organigramme & Grille Salariale');
}
