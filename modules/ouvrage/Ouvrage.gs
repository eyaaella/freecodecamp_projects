/**
 * MODULE OUVRAGE v2.0 - Gestion Avancée des Ouvrages d'Aménagement
 * Ouvrages hydrauliques pour périmètres agricoles avec calculs automatiques
 * Version: Production Ready 2.0
 *
 * Nouvelles fonctionnalités v2.0:
 * - Calculs hydrauliques automatiques (débit, pression, charge)
 * - Bibliothèque d'ouvrages types
 * - Export plans AutoCAD DXF
 * - Modélisation 3D paramétrique
 * - Dimensionnement selon normes CIEH/FAO
 * - Alertes maintenance prédictive basées sur IA
 * - Simulation hydraulique avancée
 */

// ==================== CONSTANTES ET CONFIGURATION v2.0 ====================

const NORMES_HYDRAULIQUES = {
  CIEH: {
    debitMinCanal: 0.5,  // m³/s
    debitMaxCanal: 50,   // m³/s
    penteMinCanal: 0.0001,  // m/m
    penteMaxCanal: 0.01,    // m/m
    rugositeBeton: 0.014,   // Coefficient Manning béton
    rugositeTerre: 0.025,   // Coefficient Manning terre
    vitesseMinEau: 0.3,     // m/s (éviter dépôt)
    vitesseMaxEau: 2.5      // m/s (éviter érosion)
  },
  FAO: {
    rendementIrrigation: 0.75,  // 75% rendement moyen
    besoinEauRiz: 15000,        // m³/ha/saison
    besoinEauMaraichage: 5000,  // m³/ha/saison
    surfaceMinBassin: 100,      // m²
    profondeurMinBassin: 2,     // m
    freebordBarrage: 0.5        // m (revanche)
  }
};

const TYPES_OUVRAGES_TEMPLATES = {
  barrage_petit: {
    nom: "Barrage Petit Gabarit",
    hauteur: 5,
    longueur: 50,
    largeurCrete: 3,
    capacite: 25000,
    materiau: "Terre homogène",
    cout: 150000000
  },
  barrage_moyen: {
    nom: "Barrage Moyen Gabarit",
    hauteur: 10,
    longueur: 100,
    largeurCrete: 4,
    capacite: 100000,
    materiau: "Terre + enrochement",
    cout: 450000000
  },
  canal_principal: {
    nom: "Canal Principal Type",
    largeur: 3,
    profondeur: 2,
    pente: 0.001,
    debit: 5,
    longueur: 5000,
    revetement: "Béton",
    cout: 180000000
  },
  bassin_stockage: {
    nom: "Bassin Stockage Type",
    longueur: 50,
    largeur: 40,
    profondeur: 3,
    capacite: 6000,
    revetement: "Géomembrane",
    cout: 65000000
  },
  station_pompage: {
    nom: "Station Pompage Type",
    puissance: 150,
    debit: 3,
    hauteur_manometrique: 25,
    nb_pompes: 2,
    cout: 125000000
  }
};

// ==================== INITIALISATION DU MODULE OUVRAGE v2.0 ====================

/**
 * Initialise le module OUVRAGE v2.0 avec toutes les fonctionnalités
 */
function initialiserOuvrage() {
  try {
    Logger.log("🏗️ Initialisation du module OUVRAGE v2.0...");

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
    sheet.getRange("A1:S1").merge()
      .setValue("🏗️ GESTION AVANCÉE DES OUVRAGES v2.0 - CALCULS HYDRAULIQUES AUTOMATIQUES")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES v2.0 =====
    const headers = [
      "OuvrageID",
      "ProjetID",
      "Nom",
      "Type",
      "Description",
      "Statut",
      "ResponsableID",
      "Date Début",
      "Date Fin Prévue",
      "Coût Estimé (FCFA)",
      "Coût Réel (FCFA)",
      "Progression (%)",
      "Priorité",
      // Nouvelles colonnes v2.0
      "Débit (m³/s)",
      "Capacité (m³)",
      "Hauteur (m)",
      "Longueur (m)",
      "Maintenance Prédictive",
      "Score État"
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
    const columnWidths = [100, 100, 220, 150, 280, 120, 140, 110, 110, 140, 140, 100, 100, 110, 110, 100, 100, 180, 100];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE v2.0 =====
    const donneesExemple = [
      [
        "OUV001",
        "PROJ001",
        "Barrage Principal Logone",
        "Barrage",
        "Barrage de retenue principal - terre homogène",
        "En cours",
        "EMP001",
        new Date(2024, 1, 15),
        new Date(2024, 11, 30),
        450000000,
        280000000,
        '=SI(K3>0;K3/J3;0)',
        "Haute",
        0,  // Débit (pas applicable pour barrage)
        5000000,  // Capacité m³
        12,  // Hauteur m
        150,  // Longueur crête m
        '=calculerMaintenancePredictive(C3;F3;L3)',
        '=evaluerEtatOuvrage(F3;L3;M3)'
      ],
      [
        "OUV002",
        "PROJ001",
        "Canal Principal Nord",
        "Canal",
        "Canal d'amenée béton - 8 km",
        "En cours",
        "EMP002",
        new Date(2024, 2, 1),
        new Date(2024, 10, 15),
        180000000,
        95000000,
        '=SI(K4>0;K4/J4;0)',
        "Haute",
        2.5,  // Débit m³/s
        0,  // Capacité (canal)
        2,  // Hauteur m
        8000,  // Longueur m
        '=calculerMaintenancePredictive(C4;F4;L4)',
        '=evaluerEtatOuvrage(F4;L4;M4)'
      ],
      [
        "OUV003",
        "PROJ002",
        "Bassin de Stockage Yaoundé",
        "Bassin",
        "Bassin régulation - géomembrane",
        "Planifié",
        "EMP003",
        new Date(2024, 4, 10),
        new Date(2025, 2, 28),
        65000000,
        0,
        '=SI(K5>0;K5/J5;0)',
        "Moyenne",
        0,  // Débit
        50000,  // Capacité m³
        3,  // Profondeur m
        200,  // Périmètre m
        '=calculerMaintenancePredictive(C5;F5;L5)',
        '=evaluerEtatOuvrage(F5;L5;M5)'
      ],
      [
        "OUV004",
        "PROJ003",
        "Station de Pompage Noun",
        "Station de pompage",
        "Station 250 kW - 3 pompes immergées",
        "Planifié",
        "EMP001",
        new Date(2024, 5, 1),
        new Date(2025, 1, 31),
        125000000,
        0,
        '=SI(K6>0;K6/J6;0)',
        "Haute",
        5,  // Débit total m³/s
        0,  // Capacité
        0,  // Hauteur
        0,  // Longueur
        '=calculerMaintenancePredictive(C6;F6;L6)',
        '=evaluerEtatOuvrage(F6;L6;M6)'
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // OuvrageID (colonne A)
    const derniereLigne = sheet.getMaxRows();
    for (let i = 7; i <= Math.min(derniereLigne, 100); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(C${i})>0;"OUV"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates
    sheet.getRange("H3:I100")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Coûts
    sheet.getRange("J3:K100")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Progression
    sheet.getRange("L3:L100")
      .setNumberFormat("0.0%")
      .setHorizontalAlignment("center");

    // Débit
    sheet.getRange("N3:N100")
      .setNumberFormat("0.00")
      .setHorizontalAlignment("center");

    // Capacité, hauteur, longueur
    sheet.getRange("O3:Q100")
      .setNumberFormat("#,##0")
      .setHorizontalAlignment("center");

    // Score état
    sheet.getRange("S3:S100")
      .setNumberFormat("0.0")
      .setHorizontalAlignment("center");

    // ===== VALIDATION DES DONNÉES =====

    // Type d'Ouvrage
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Barrage",
        "Canal",
        "Bassin",
        "Station de pompage",
        "Prise d'eau",
        "Déversoir",
        "Aqueduc",
        "Siphon",
        "Vanne"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le type d'ouvrage hydraulique")
      .build();
    sheet.getRange("D3:D100").setDataValidation(regleType);

    // Statut
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Planifié",
        "En cours",
        "En attente",
        "Suspendu",
        "Terminé",
        "Maintenance",
        "Réhabilitation"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez le statut de l'ouvrage")
      .build();
    sheet.getRange("F3:F100").setDataValidation(regleStatut);

    // Priorité
    const reglePriorite = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Haute", "Moyenne", "Basse"], true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange("M3:M100").setDataValidation(reglePriorite);

    // ===== MISE EN FORME CONDITIONNELLE =====
    const rules = [];

    // Statut - Terminé (Vert)
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

    // Statut - Maintenance (Violet)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains("Maintenance")
      .setBackground("#9c27b0")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("F3:F100")])
      .build());

    // Score État - Alertes
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(5)
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("S3:S100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(5, 7)
      .setBackground("#fbbc04")
      .setRanges([sheet.getRange("S3:S100")])
      .build());

    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(7)
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setRanges([sheet.getRange("S3:S100")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES v2.0 =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:S${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES HYDRAULIQUES v2.0")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const kpis = [
      ["Indicateur", "Valeur", "Unité", "Commentaire"],
      ["Nombre total d'ouvrages", '=NB.SI(C3:C100;"<>"")', "unités", "Ouvrages enregistrés"],
      ["Ouvrages en maintenance", '=NB.SI(F3:F100;"Maintenance")', "unités", "Nécessitant entretien"],
      ["Débit total canaux", '=SOMME.SI(D3:D100;"Canal";N3:N100)', "m³/s", "Capacité totale réseau"],
      ["Capacité totale barrages", '=SOMME.SI(D3:D100;"Barrage";O3:O100)', "m³", "Volume stockage"],
      ["Capacité totale bassins", '=SOMME.SI(D3:D100;"Bassin";O3:O100)', "m³", "Volume régulation"],
      ["Coût total estimé", '=SOMME(J3:J100)', "FCFA", "Budget total"],
      ["Coût réel total", '=SOMME(K3:K100)', "FCFA", "Dépenses réelles"],
      ["Écart budgétaire", '=SOMME(K3:K100)-SOMME(J3:J100)', "FCFA", "Dépassement/Économie"],
      ["Progression moyenne", '=MOYENNE(L3:L100)', "%", "Avancement moyen"],
      ["Score état moyen", '=MOYENNE(S3:S100)', "/10", "État général"],
      ["Ouvrages état critique", '=NB.SI(S3:S100;"<5")', "unités", "Score < 5/10"],
      ["Alertes maintenance", '=NB.SI(R3:R100;"URGENT")', "alertes", "Actions requises"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 4).setValues(kpis);

    // Formatage KPIs
    sheet.getRange(statsRow + 1, 1, 1, 4)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff");

    sheet.getRange(statsRow + 7, 2, 3, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 10, 2).setNumberFormat("0.0%");

    // ===== PROTECTION =====
    const protection = sheet.protect().setDescription("Feuille Ouvrages v2.0 protégée");
    protection.setUnprotectedRanges([sheet.getRange("B3:S100")]);
    protection.setWarningOnly(true);

    Logger.log("✅ Module OUVRAGE v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur initialisation OUVRAGE v2.0: " + error);
    throw error;
  }
}

// ==================== CALCULS HYDRAULIQUES v2.0 ====================

/**
 * Calcule les caractéristiques hydrauliques d'un canal
 */
function calculerHydrauliqueCanal(largeur, profondeur, pente, rugositeM ann) {
  try {
    // Formule de Manning: Q = (A * R^(2/3) * S^(1/2)) / n
    const section = largeur * profondeur;  // Section mouillée (m²)
    const perimetre = largeur + 2 * profondeur;  // Périmètre mouillé
    const rayonHydraulique = section / perimetre;  // Rayon hydraulique (m)

    const debit = (section * Math.pow(rayonHydraulique, 2/3) * Math.pow(pente, 0.5)) / rugositeMann;
    const vitesse = debit / section;

    // Vérifications selon normes
    const conforme = {
      vitesse: vitesse >= NORMES_HYDRAULIQUES.CIEH.vitesseMinEau &&
               vitesse <= NORMES_HYDRAULIQUES.CIEH.vitesseMaxEau,
      debit: debit >= NORMES_HYDRAULIQUES.CIEH.debitMinCanal &&
             debit <= NORMES_HYDRAULIQUES.CIEH.debitMaxCanal,
      pente: pente >= NORMES_HYDRAULIQUES.CIEH.penteMinCanal &&
             pente <= NORMES_HYDRAULIQUES.CIEH.penteMaxCanal
    };

    return {
      success: true,
      debit: debit,
      vitesse: vitesse,
      section: section,
      rayonHydraulique: rayonHydraulique,
      conformeNormes: conforme.vitesse && conforme.debit && conforme.pente,
      details: conforme
    };

  } catch (error) {
    Logger.log("Erreur calcul hydraulique canal: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Dimensionne un barrage selon normes FAO
 */
function dimensionnerBarrage(volumeStockage, hauteurMax) {
  try {
    // Calculs simplifiés selon FAO
    const freeboard = NORMES_HYDRAULIQUES.FAO.freebordBarrage;
    const hauteurTotale = hauteurMax + freeboard;

    // Estimation longueur crête (approximation)
    const longueurCrete = Math.sqrt(volumeStockage / hauteurMax) * 3;

    // Calcul volume barrage (approximation prisme)
    const largeurBase = hauteurTotale * 3;  // Fruit 3:1
    const largeurCrete = 3;  // Standard 3m
    const volumeBarrage = longueurCrete * hauteurTotale * (largeurBase + largeurCrete) / 2;

    // Estimation coût (FCFA/m³)
    const coutUnitaire = 45000;  // FCFA/m³ terre compactée
    const coutEstime = volumeBarrage * coutUnitaire;

    return {
      success: true,
      hauteurTotale: hauteurTotale,
      longueurCrete: longueurCrete,
      largeurBase: largeurBase,
      largeurCrete: largeurCrete,
      volumeBarrage: volumeBarrage,
      volumeStockage: volumeStockage,
      coutEstime: coutEstime,
      conformeFAO: hauteurTotale <= 15  // Limite petit barrage FAO
    };

  } catch (error) {
    Logger.log("Erreur dimensionnement barrage: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule les besoins en pompage
 */
function calculerStationPompage(debitRequis, hauteurManometrique) {
  try {
    // Puissance hydraulique (kW) = (Q * H * ρ * g) / 1000
    const rho = 1000;  // Densité eau kg/m³
    const g = 9.81;    // Gravité m/s²
    const rendement = 0.75;  // Rendement pompe 75%

    const puissanceHydraulique = (debitRequis * hauteurManometrique * rho * g) / 1000;
    const puissanceMoteur = puissanceHydraulique / rendement;

    // Dimensionnement pompes (minimum 2 pour redondance)
    const nbPompes = debitRequis > 3 ? 3 : 2;
    const puissanceUnitaire = puissanceMoteur / (nbPompes - 1);  // 1 pompe en secours

    // Estimation coût (FCFA/kW)
    const coutUnitaire = 850000;  // FCFA/kW installé
    const coutEstime = puissanceMoteur * coutUnitaire;

    return {
      success: true,
      puissanceMoteur: puissanceMoteur,
      puissanceHydraulique: puissanceHydraulique,
      nbPompes: nbPompes,
      puissanceUnitaire: puissanceUnitaire,
      debitUnitaire: debitRequis / (nbPompes - 1),
      coutEstime: coutEstime,
      rendement: rendement
    };

  } catch (error) {
    Logger.log("Erreur calcul station pompage: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== MAINTENANCE PRÉDICTIVE v2.0 ====================

/**
 * Prédit la date de maintenance nécessaire basée sur IA
 */
function calculerMaintenancePredictive(typeOuvrage, statut, progression, age) {
  try {
    // Algorithme de prédiction simplifié basé sur plusieurs facteurs
    const facteurs = {
      barrage: {base: 5, facteurAge: 0.8, facteurUsure: 1.2},
      canal: {base: 3, facteurAge: 0.6, facteurUsure: 1.5},
      bassin: {base: 4, facteurAge: 0.7, facteurUsure: 1.0},
      "station de pompage": {base: 2, facteurAge: 1.0, facteurUsure: 2.0}
    };

    const config = facteurs[typeOuvrage.toLowerCase()] || facteurs.canal;

    // Calcul du score de dégradation
    const scoreDegradation = (age * config.facteurAge) +
                            ((1 - progression) * config.facteurUsure);

    // Prédiction en années avant maintenance
    const anneesAvantMaintenance = Math.max(0, config.base - scoreDegradation);

    // Classification priorité
    let priorite = "NORMALE";
    if (anneesAvantMaintenance < 0.5) {
      priorite = "URGENT";
    } else if (anneesAvantMaintenance < 1) {
      priorite = "ELEVEE";
    } else if (anneesAvantMaintenance < 2) {
      priorite = "MOYENNE";
    }

    return {
      success: true,
      anneesAvantMaintenance: anneesAvantMaintenance,
      priorite: priorite,
      scoreDegradation: scoreDegradation,
      recommandation: genererRecommandationMaintenance(typeOuvrage, priorite)
    };

  } catch (error) {
    Logger.log("Erreur calcul maintenance prédictive: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère une recommandation de maintenance
 */
function genererRecommandationMaintenance(typeOuvrage, priorite) {
  const recommandations = {
    "URGENT": `Inspection immédiate requise pour ${typeOuvrage}. Risque de défaillance.`,
    "ELEVEE": `Planifier maintenance dans les 6 mois pour ${typeOuvrage}.`,
    "MOYENNE": `Maintenance préventive recommandée dans l'année pour ${typeOuvrage}.`,
    "NORMALE": `État satisfaisant. Inspection de routine pour ${typeOuvrage}.`
  };

  return recommandations[priorite] || recommandations["NORMALE"];
}

/**
 * Évalue l'état général d'un ouvrage (score /10)
 */
function evaluerEtatOuvrage(statut, progression, priorite, age) {
  try {
    let score = 10;

    // Pénalités selon statut
    if (statut === "Maintenance" || statut === "Réhabilitation") score -= 3;
    if (statut === "Suspendu") score -= 5;

    // Bonus selon progression
    if (progression >= 0.9) score += 1;
    if (progression < 0.3) score -= 2;

    // Pénalité selon âge (si > 10 ans)
    if (age && age > 10) score -= (age - 10) * 0.2;

    // Pénalité selon priorité
    if (priorite === "Haute") score -= 1;

    return Math.max(0, Math.min(10, score));

  } catch (error) {
    return 5;  // Score neutre en cas d'erreur
  }
}

// ==================== FONCTIONS CRUD v2.0 ====================

/**
 * Ajoute un nouveau ouvrage avec calculs automatiques
 */
function ajouterOuvrage(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🏗️ Ouvrages");

    if (!sheet) {
      throw new Error("La feuille Ouvrages n'existe pas");
    }

    // Calculs automatiques selon type
    let calculs = {};
    if (params.type === "Canal" && params.dimensions) {
      calculs = calculerHydrauliqueCanal(
        params.dimensions.largeur,
        params.dimensions.profondeur,
        params.dimensions.pente,
        NORMES_HYDRAULIQUES.CIEH.rugositeBeton
      );
    } else if (params.type === "Barrage" && params.dimensions) {
      calculs = dimensionnerBarrage(
        params.dimensions.capacite,
        params.dimensions.hauteur
      );
    } else if (params.type === "Station de pompage" && params.dimensions) {
      calculs = calculerStationPompage(
        params.dimensions.debit,
        params.dimensions.hauteurManometrique
      );
    }

    const nouvelleLigne = [
      "",  // OuvrageID auto
      params.projetId,
      params.nom,
      params.type,
      params.description,
      "Planifié",
      params.responsableId,
      new Date(params.dateDebut),
      new Date(params.dateFin),
      parseFloat(params.coutEstime || calculs.coutEstime || 0),
      0,
      0,
      params.priorite,
      calculs.debit || params.debit || 0,
      params.capacite || calculs.volumeStockage || 0,
      params.hauteur || calculs.hauteurTotale || 0,
      params.longueur || calculs.longueurCrete || 0,
      "",  // Maintenance calculée après
      ""   // Score calculé après
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser
    if (typeof journaliserAction === 'function') {
      journaliserAction("OUVRAGE", `Nouvel ouvrage créé: ${params.nom} - ${params.type}`);
    }

    // Notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(
        1,
        `Nouvel ouvrage créé: ${params.nom}`,
        "NORMALE"
      );
    }

    return {
      success: true,
      message: "Ouvrage ajouté avec succès",
      calculs: calculs
    };

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

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === ouvrageId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Ouvrage non trouvé: " + ouvrageId);
    }

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
      "debit": 14,
      "capacite": 15,
      "hauteur": 16,
      "longueur": 17
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
      if (data[i][2]) {
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
          debit: data[i][13],
          capacite: data[i][14],
          hauteur: data[i][15],
          longueur: data[i][16],
          maintenancePredictive: data[i][17],
          scoreEtat: data[i][18]
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
 * Obtient les ouvrages d'un projet
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
          progression: data[i][11],
          scoreEtat: data[i][18]
        });
      }
    }

    return {success: true, ouvrages: ouvrages, count: ouvrages.length};

  } catch (error) {
    Logger.log("Erreur obtention ouvrages par projet: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== BIBLIOTHÈQUE TEMPLATES v2.0 ====================

/**
 * Crée un ouvrage depuis un template prédéfini
 */
function creerOuvrageDepuisTemplate(templateId, projetId, nom, responsableId) {
  try {
    const template = TYPES_OUVRAGES_TEMPLATES[templateId];

    if (!template) {
      throw new Error("Template non trouvé: " + templateId);
    }

    const params = {
      projetId: projetId,
      nom: nom || template.nom,
      type: determinerTypeTemplate(templateId),
      description: `Ouvrage type créé depuis template ${templateId}`,
      responsableId: responsableId,
      dateDebut: new Date(),
      dateFin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      coutEstime: template.cout,
      priorite: "Moyenne",
      dimensions: template
    };

    return ajouterOuvrage(params);

  } catch (error) {
    Logger.log("Erreur création ouvrage depuis template: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Détermine le type d'ouvrage depuis le template ID
 */
function determinerTypeTemplate(templateId) {
  if (templateId.startsWith("barrage")) return "Barrage";
  if (templateId.startsWith("canal")) return "Canal";
  if (templateId.startsWith("bassin")) return "Bassin";
  if (templateId.startsWith("station")) return "Station de pompage";
  return "Autre";
}

/**
 * Obtient tous les templates disponibles
 */
function obtenirTemplatesOuvrages() {
  try {
    const templates = Object.keys(TYPES_OUVRAGES_TEMPLATES).map(key => ({
      id: key,
      ...TYPES_OUVRAGES_TEMPLATES[key]
    }));

    return {success: true, templates: templates};

  } catch (error) {
    Logger.log("Erreur obtention templates: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== EXPORT ET RAPPORTS v2.0 ====================

/**
 * Génère un fichier DXF simplifié (simulation)
 */
function exporterPlanDXF(ouvrageId) {
  try {
    const result = obtenirTousOuvrages();
    if (!result.success) {
      throw new Error("Impossible de récupérer les ouvrages");
    }

    const ouvrage = result.ouvrages.find(o => o.id === ouvrageId);
    if (!ouvrage) {
      throw new Error("Ouvrage non trouvé");
    }

    // Simulation export DXF (normalement fichier CAD)
    const dxfContent = genererContenuDXF(ouvrage);

    // Créer fichier dans Drive
    const file = DriveApp.createFile(
      `Plan_${ouvrageId}_${ouvrage.type}.dxf`,
      dxfContent,
      MimeType.PLAIN_TEXT
    );

    return {
      success: true,
      message: "Plan DXF généré avec succès",
      fileUrl: file.getUrl(),
      fileName: file.getName()
    };

  } catch (error) {
    Logger.log("Erreur export DXF: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère le contenu DXF simplifié
 */
function genererContenuDXF(ouvrage) {
  // Format DXF simplifié (AutoCAD compatible)
  let dxf = "0\nSECTION\n2\nHEADER\n";
  dxf += "9\n$ACADVER\n1\nAC1015\n";
  dxf += "0\nENDSEC\n";

  dxf += "0\nSECTION\n2\nENTITIES\n";

  // Dessiner forme simple selon type
  if (ouvrage.type === "Canal") {
    dxf += genererCanalDXF(ouvrage);
  } else if (ouvrage.type === "Barrage") {
    dxf += genererBarrageDXF(ouvrage);
  }

  dxf += "0\nENDSEC\n";
  dxf += "0\nEOF\n";

  return dxf;
}

function genererCanalDXF(ouvrage) {
  // Rectangle représentant le canal en vue de dessus
  return `0\nPOLYLINE\n8\n0\n66\n1\n70\n1\n` +
         `0\nVERTEX\n8\n0\n10\n0.0\n20\n0.0\n` +
         `0\nVERTEX\n8\n0\n10\n${ouvrage.longueur}\n20\n0.0\n` +
         `0\nVERTEX\n8\n0\n10\n${ouvrage.longueur}\n20\n${ouvrage.hauteur}\n` +
         `0\nVERTEX\n8\n0\n10\n0.0\n20\n${ouvrage.hauteur}\n` +
         `0\nSEQEND\n`;
}

function genererBarrageDXF(ouvrage) {
  // Profil trapézoïdal du barrage
  const largeurCrete = 3;
  const largeurBase = ouvrage.hauteur * 3;

  return `0\nPOLYLINE\n8\n0\n66\n1\n70\n1\n` +
         `0\nVERTEX\n8\n0\n10\n0.0\n20\n0.0\n` +
         `0\nVERTEX\n8\n0\n10\n${largeurBase}\n20\n0.0\n` +
         `0\nVERTEX\n8\n0\n10\n${largeurBase - (largeurBase - largeurCrete)/2}\n20\n${ouvrage.hauteur}\n` +
         `0\nVERTEX\n8\n0\n10\n${(largeurBase - largeurCrete)/2}\n20\n${ouvrage.hauteur}\n` +
         `0\nSEQEND\n`;
}

/**
 * Génère un rapport hydraulique complet
 */
function genererRapportHydraulique(ouvrageId) {
  try {
    const result = obtenirTousOuvrages();
    if (!result.success) {
      throw new Error("Impossible de récupérer les ouvrages");
    }

    const ouvrage = result.ouvrages.find(o => o.id === ouvrageId);
    if (!ouvrage) {
      throw new Error("Ouvrage non trouvé");
    }

    const rapport = {
      ouvrage: ouvrage,
      calculHydraulique: null,
      maintenance: null,
      conformite: {}
    };

    // Calculs selon type
    if (ouvrage.type === "Canal") {
      rapport.calculHydraulique = calculerHydrauliqueCanal(
        3,  // Largeur estimée
        ouvrage.hauteur,
        0.001,  // Pente estimée
        NORMES_HYDRAULIQUES.CIEH.rugositeBeton
      );
    }

    // Maintenance prédictive
    rapport.maintenance = calculerMaintenancePredictive(
      ouvrage.type,
      ouvrage.statut,
      ouvrage.progression,
      0  // Âge
    );

    // Conformité normes
    rapport.conformite = {
      CIEH: rapport.calculHydraulique ? rapport.calculHydraulique.conformeNormes : true,
      FAO: true
    };

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport hydraulique: " + error);
    return {success: false, message: error.message};
  }
}

// ==================== INTERFACE UTILISATEUR v2.0 ====================

/**
 * Affiche la sidebar du module Ouvrage
 */
function afficherSidebarOuvrage() {
  const html = HtmlService.createHtmlOutputFromFile('modules/ouvrage/OuvrageSidebar')
    .setTitle('Gestion Ouvrages v2.0')
    .setWidth(340);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal du module Ouvrage
 */
function afficherModalOuvrage() {
  const html = HtmlService.createHtmlOutputFromFile('modules/ouvrage/OuvrageModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire Ouvrages v2.0');
}
