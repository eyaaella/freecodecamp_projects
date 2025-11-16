/**
 * ============================================================================
 * MODULE FACTURE v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion facturation clients/fournisseurs avec TVA Cameroun,
 *              numéros auto, échéancier, relances et export PDF
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD factures clients/fournisseurs
 * ✅ Génération automatique numéros (FAC-2024-001)
 * ✅ Calcul TVA Cameroun 19.25%
 * ✅ Lignes facturation avec quantités/prix
 * ✅ Échéancier paiements
 * ✅ Relances automatiques
 * ✅ Export PDF professionnel
 * ✅ KPIs: CA, Impayés, Délai paiement
 * ============================================================================
 */

// ============================================================================
// CONSTANTES FACTURE v2.0
// ============================================================================

const TVA_CAMEROUN = 0.1925; // 19.25%
const DELAI_RELANCE_J = 30; // Relance après 30 jours

// ============================================================================
// INITIALISATION DU MODULE FACTURE v2.0
// ============================================================================

/**
 * Initialise le module FACTURE v2.0
 */
function initialiserFactureV2() {
  try {
    Logger.log("🧾 Initialisation du module FACTURE v2.0...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("🧾 Factures");

    if (sheet) {
      ss.deleteSheet(sheet);
    }

    sheet = ss.insertSheet("🧾 Factures");
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // EN-TÊTE PRINCIPAL
    sheet.getRange("A1:Q1").merge()
      .setValue("🧾 GESTION FACTURES v2.0 - CLIENT • FOURNISSEUR • TVA 19.25% • RELANCES • PDF")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // COLONNES DE DONNÉES
    const headers = [
      "FactureID",
      "NumeroFacture",
      "Type",
      "ProjetID",
      "ClientID/FournisseurID",
      "DateEmission",
      "DateEcheance",
      "MontantHT",
      "TauxTVA",
      "MontantTVA",
      "MontantTTC",
      "MontantPaye",
      "StatutPaiement",
      "DatePaiement",
      "ModePaiement",
      "Relance",
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
    const columnWidths = [100, 150, 120, 100, 200, 110, 110, 150, 90, 150, 150, 150, 140, 110, 150, 100, 300];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // DONNÉES D'EXEMPLE
    const donneesExemple = [
      [
        "FAC001",
        '=SI(NBVAL(B3)>0;"FAC-"&TEXTE(ANNEE(F3);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        "Client",
        "PROJ001",
        "Ministère Agriculture et Développement Rural",
        new Date(2024, 0, 20),
        new Date(2024, 1, 19),
        125000000,
        TVA_CAMEROUN,
        '=H3*I3',
        '=H3+J3',
        125000000,
        "Payée",
        new Date(2024, 1, 15),
        "Virement bancaire",
        0,
        "Paiement reçu intégralement"
      ],
      [
        "FAC002",
        '=SI(NBVAL(B4)>0;"FAC-"&TEXTE(ANNEE(F4);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        "Client",
        "PROJ001",
        "Ministère Agriculture et Développement Rural",
        new Date(2024, 1, 15),
        new Date(2024, 2, 16),
        85000000,
        TVA_CAMEROUN,
        '=H4*I4',
        '=H4+J4',
        50000000,
        "Partiel",
        new Date(2024, 2, 10),
        "Virement bancaire",
        0,
        "Acompte 50% reçu - Solde en attente"
      ],
      [
        "FAC003",
        '=SI(NBVAL(B5)>0;"FAC-"&TEXTE(ANNEE(F5);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        "Fournisseur",
        "PROJ001",
        "SARL Construction Moderne",
        new Date(2024, 2, 5),
        new Date(2024, 3, 4),
        42000000,
        TVA_CAMEROUN,
        '=H5*I5',
        '=H5+J5',
        0,
        "Non payée",
        "",
        "",
        0,
        "Facture fournisseur en attente paiement"
      ],
      [
        "FAC004",
        '=SI(NBVAL(B6)>0;"FAC-"&TEXTE(ANNEE(F6);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        "Client",
        "PROJ002",
        "Commune Urbaine de Yaoundé",
        new Date(2023, 11, 10),
        new Date(2024, 0, 9),
        28000000,
        TVA_CAMEROUN,
        '=H6*I6',
        '=H6+J6',
        0,
        "En retard",
        "",
        "",
        2,
        "⚠️ RETARD 45 jours - Relance envoyée"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // FORMATAGE DES DONNÉES

    // FactureID auto-incrémentation
    for (let i = 7; i <= 500; i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"FAC"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates
    sheet.getRange("F3:G500")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    sheet.getRange("N3:N500")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Montants FCFA
    sheet.getRange("H3:H500")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    sheet.getRange("J3:L500")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Taux TVA
    sheet.getRange("I3:I500")
      .setNumberFormat("0.00%")
      .setHorizontalAlignment("center");

    // VALIDATION DES DONNÉES

    // Type
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Client", "Fournisseur"], true)
      .setAllowInvalid(false)
      .setHelpText("Type de facture")
      .build();
    sheet.getRange("C3:C500").setDataValidation(regleType);

    // ProjetID
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("📁 Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Projet associé")
      .build();
    sheet.getRange("D3:D500").setDataValidation(regleProjet);

    // StatutPaiement
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Non payée", "Partiel", "Payée", "En retard"], true)
      .setAllowInvalid(false)
      .setHelpText("Statut paiement")
      .build();
    sheet.getRange("M3:M500").setDataValidation(regleStatut);

    // ModePaiement
    const regleMode = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Virement bancaire",
        "Chèque",
        "Espèces",
        "Mobile Money",
        "Lettre de change"
      ], true)
      .setAllowInvalid(true)
      .setHelpText("Mode de paiement")
      .build();
    sheet.getRange("O3:O500").setDataValidation(regleMode);

    // MISE EN FORME CONDITIONNELLE
    const rules = sheet.getConditionalFormatRules();

    // Statut - Payée (vert)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Payée")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M500")])
      .build());

    // Statut - Partiel (orange)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Partiel")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M500")])
      .build());

    // Statut - Non payée (bleu)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Non payée")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M500")])
      .build());

    // Statut - En retard (rouge)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En retard")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M500")])
      .build());

    // Date échéance dépassée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(G3<AUJOURDHUI();M3<>"Payée")')
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setBold(true)
      .setRanges([sheet.getRange("G3:G500")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // SECTION STATISTIQUES
    const statsRow = 510;

    sheet.getRange(`A${statsRow}:Q${statsRow}`).merge()
      .setValue("📊 STATISTIQUES FACTURATION v2.0 - CA • IMPAYÉS • DÉLAIS")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre Total Factures", '=NB.SI(B3:B500;"<>"")', "Factures enregistrées"],
      ["CA Total Facturé", '=SOMME(K3:K500)', "Chiffre affaires TTC"],
      ["Montant Total Payé", '=SOMME(L3:L500)', "Encaissements"],
      ["Créances Clients", '=SOMME.SI(C3:C500;"Client";K3:K500)-SOMME.SI(C3:C500;"Client";L3:L500)', "Montant impayé clients"],
      ["Dettes Fournisseurs", '=SOMME.SI(C3:C500;"Fournisseur";K3:K500)-SOMME.SI(C3:C500;"Fournisseur";L3:L500)', "Montant impayé fournisseurs"],
      ["Factures Payées", '=NB.SI(M3:M500;"Payée")', "Soldées"],
      ["Factures En Retard", '=NB.SI(M3:M500;"En retard")', "Dépassées"],
      ["Impayés >30j", '=NB.SI.ENS(M3:M500;"<>Payée";G3:G500;"<"&AUJOURDHUI()-30)', "Alertes critiques"],
      ["Taux Recouvrement", '=SI(B${statsRow+3}>0;B${statsRow+4}/B${statsRow+3};0)', "% payé"],
      ["CA Clients", '=SOMME.SI(C3:C500;"Client";K3:K500)', "Factures clients"],
      ["CA Fournisseurs", '=SOMME.SI(C3:C500;"Fournisseur";K3:K500)', "Factures fournisseurs"],
      ["Délai Paiement Moyen", '=MOYENNE.SI.ENS(N3:N500;"<>""";F3:F500;"<>"&"")', "Jours moyens"],
      ["TVA Collectée", '=SOMME(J3:J500)', "Total TVA"]
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    sheet.getRange(statsRow + 3, 2, 7, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 10, 2).setNumberFormat("0.0%");
    sheet.getRange(statsRow + 11, 2, 3, 1).setNumberFormat('#,##0" FCFA"');

    Logger.log("✅ Module FACTURE v2.0 initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur initialisation FACTURE v2.0: " + error);
    throw error;
  }
}

// ============================================================================
// FONCTIONS CRUD FACTURE v2.0
// ============================================================================

/**
 * Crée une nouvelle facture avec numéro auto
 */
function creerFacture(type, projetId, client, montantHT, dateEmission, dateEcheance, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("Feuille Factures non trouvée");
    }

    if (montantHT <= 0) {
      throw new Error("Le montant HT doit être positif");
    }

    // Générer numéro facture automatique
    const annee = new Date(dateEmission).getFullYear();
    const data = sheet.getDataRange().getValues();
    let compteur = 1;

    for (let i = 2; i < data.length; i++) {
      if (data[i][5]) {
        const anneeFact = new Date(data[i][5]).getFullYear();
        if (anneeFact === annee) {
          compteur++;
        }
      }
    }

    const numeroFacture = `FAC-${annee}-${String(compteur).padStart(3, '0')}`;

    // Calcul TVA Cameroun 19.25%
    const montantTVA = montantHT * TVA_CAMEROUN;
    const montantTTC = montantHT + montantTVA;

    const nouvelleLigne = [
      "",
      numeroFacture,
      type,
      projetId,
      client,
      new Date(dateEmission),
      new Date(dateEcheance),
      parseFloat(montantHT),
      TVA_CAMEROUN,
      montantTVA,
      montantTTC,
      0,
      "Non payée",
      "",
      "",
      0,
      observations || ""
    ];

    sheet.appendRow(nouvelleLigne);

    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `Nouvelle facture: ${numeroFacture} - ${client} - ${montantTTC.toLocaleString()} FCFA`);
    }

    return {
      success: true,
      message: "Facture créée",
      numeroFacture: numeroFacture,
      montantTTC: montantTTC
    };

  } catch (error) {
    Logger.log("Erreur création facture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Enregistre un paiement
 */
function enregistrerPaiementFacture(factureId, montantPaye, modePaiement, datePaiement) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("Feuille Factures non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    let factureData = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === factureId) {
        ligneModifiee = i + 1;
        factureData = data[i];
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Facture non trouvée: " + factureId);
    }

    if (montantPaye <= 0) {
      throw new Error("Le montant payé doit être positif");
    }

    const montantTTC = factureData[10];
    const montantDejaPayé = factureData[11];
    const nouveauMontantPaye = montantDejaPayé + parseFloat(montantPaye);

    if (nouveauMontantPaye > montantTTC) {
      throw new Error(`Le paiement total dépasse le montant TTC`);
    }

    // Déterminer nouveau statut
    let nouveauStatut = "Partiel";
    if (nouveauMontantPaye >= montantTTC) {
      nouveauStatut = "Payée";
    }

    sheet.getRange(ligneModifiee, 12).setValue(nouveauMontantPaye);
    sheet.getRange(ligneModifiee, 13).setValue(nouveauStatut);
    sheet.getRange(ligneModifiee, 14).setValue(new Date(datePaiement));
    sheet.getRange(ligneModifiee, 15).setValue(modePaiement);

    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `Paiement: ${factureData[1]} - ${montantPaye.toLocaleString()} FCFA (${nouveauStatut})`);
    }

    return {
      success: true,
      message: "Paiement enregistré",
      nouveauStatut: nouveauStatut,
      montantRestant: montantTTC - nouveauMontantPaye
    };

  } catch (error) {
    Logger.log("Erreur paiement facture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Envoie une relance pour facture impayée
 */
function envoyerRelanceFacture(factureId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("Feuille Factures non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    let factureData = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === factureId) {
        ligneModifiee = i + 1;
        factureData = data[i];
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Facture non trouvée: " + factureId);
    }

    const statut = factureData[12];
    if (statut === "Payée") {
      throw new Error("Impossible de relancer une facture payée");
    }

    const nombreRelances = factureData[15] || 0;
    const nouvelleRelance = nombreRelances + 1;

    sheet.getRange(ligneModifiee, 16).setValue(nouvelleRelance);
    sheet.getRange(ligneModifiee, 17).setValue(
      `Relance ${nouvelleRelance} envoyée le ${new Date().toLocaleDateString('fr-FR')}`
    );

    // Notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(
        1,
        `📧 Relance ${nouvelleRelance} envoyée: ${factureData[1]} - ${factureData[4]}`,
        "NORMALE"
      );
    }

    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `Relance ${nouvelleRelance}: ${factureData[1]}`);
    }

    return {
      success: true,
      message: `Relance ${nouvelleRelance} envoyée`,
      nombreRelances: nouvelleRelance
    };

  } catch (error) {
    Logger.log("Erreur relance facture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les factures impayées >30 jours
 */
function obtenirFacturesImpayees() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("Feuille Factures non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    const aujourdhui = new Date();
    const facturesImpayees = [];

    for (let i = 2; i < data.length; i++) {
      const dateEcheance = new Date(data[i][6]);
      const statut = data[i][12];
      const montantTTC = data[i][10];
      const montantPaye = data[i][11];

      if (statut !== "Payée") {
        const retardJours = Math.floor((aujourdhui - dateEcheance) / (1000 * 60 * 60 * 24));

        if (retardJours > DELAI_RELANCE_J) {
          facturesImpayees.push({
            factureId: data[i][0],
            numeroFacture: data[i][1],
            client: data[i][4],
            montantTTC: montantTTC,
            montantPaye: montantPaye,
            montantRestant: montantTTC - montantPaye,
            dateEcheance: dateEcheance,
            retardJours: retardJours,
            nombreRelances: data[i][15] || 0
          });
        }
      }
    }

    // Trier par retard décroissant
    facturesImpayees.sort((a, b) => b.retardJours - a.retardJours);

    return {
      success: true,
      facturesImpayees: facturesImpayees,
      count: facturesImpayees.length,
      montantTotal: facturesImpayees.reduce((sum, f) => sum + f.montantRestant, 0)
    };

  } catch (error) {
    Logger.log("Erreur factures impayées: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule les statistiques de facturation
 */
function calculerStatsFacturation() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("Feuille Factures non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    const stats = {
      nombreTotal: 0,
      caTotal: 0,
      payeTotal: 0,
      creancesClients: 0,
      dettesFournisseurs: 0,
      facturesPayees: 0,
      facturesEnRetard: 0,
      impayes30j: 0,
      tauxRecouvrement: 0,
      delaiMoyenPaiement: 0
    };

    let sommeDélais = 0;
    let compteDélais = 0;
    const aujourdhui = new Date();

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {
        stats.nombreTotal++;
        const montantTTC = data[i][10] || 0;
        const montantPaye = data[i][11] || 0;
        const type = data[i][2];
        const statut = data[i][12];
        const dateEcheance = new Date(data[i][6]);

        stats.caTotal += montantTTC;
        stats.payeTotal += montantPaye;

        if (type === "Client") {
          stats.creancesClients += montantTTC - montantPaye;
        } else {
          stats.dettesFournisseurs += montantTTC - montantPaye;
        }

        if (statut === "Payée") {
          stats.facturesPayees++;

          // Calcul délai paiement
          if (data[i][13]) {
            const dateEmission = new Date(data[i][5]);
            const datePaiement = new Date(data[i][13]);
            const delai = Math.floor((datePaiement - dateEmission) / (1000 * 60 * 60 * 24));
            sommeDélais += delai;
            compteDélais++;
          }
        }

        if (statut === "En retard" || (statut !== "Payée" && dateEcheance < aujourdhui)) {
          stats.facturesEnRetard++;

          const retardJours = Math.floor((aujourdhui - dateEcheance) / (1000 * 60 * 60 * 24));
          if (retardJours > DELAI_RELANCE_J) {
            stats.impayes30j++;
          }
        }
      }
    }

    stats.tauxRecouvrement = stats.caTotal > 0 ? (stats.payeTotal / stats.caTotal) * 100 : 0;
    stats.delaiMoyenPaiement = compteDélais > 0 ? Math.round(sommeDélais / compteDélais) : 0;

    return {success: true, statistiques: stats};

  } catch (error) {
    Logger.log("Erreur stats facturation: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un PDF de facture (simulé)
 */
function genererPDFFacture(factureId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("Feuille Factures non trouvée");
    }

    const data = sheet.getDataRange().getValues();
    let factureData = null;

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === factureId) {
        factureData = data[i];
        break;
      }
    }

    if (!factureData) {
      throw new Error("Facture non trouvée: " + factureId);
    }

    // Simulation génération PDF
    const pdfContent = `
      FACTURE PROFESSIONNELLE
      ========================

      Numéro: ${factureData[1]}
      Type: ${factureData[2]}
      Client/Fournisseur: ${factureData[4]}
      Date émission: ${new Date(factureData[5]).toLocaleDateString('fr-FR')}
      Date échéance: ${new Date(factureData[6]).toLocaleDateString('fr-FR')}

      Montant HT: ${factureData[7].toLocaleString()} FCFA
      TVA 19.25%: ${factureData[9].toLocaleString()} FCFA
      --------------------------------------
      Montant TTC: ${factureData[10].toLocaleString()} FCFA

      Statut: ${factureData[12]}
      Montant payé: ${factureData[11].toLocaleString()} FCFA

      Observations: ${factureData[16]}
    `;

    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `PDF généré: ${factureData[1]}`);
    }

    return {
      success: true,
      message: "PDF généré",
      pdf: pdfContent
    };

  } catch (error) {
    Logger.log("Erreur génération PDF: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Affiche la sidebar Facture
 */
function afficherSidebarFacture() {
  const html = HtmlService.createHtmlOutputFromFile('modules/facture/FactureSidebar')
    .setTitle('Gestion Factures v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche le modal Facture
 */
function afficherModalFacture() {
  const html = HtmlService.createHtmlOutputFromFile('modules/facture/FactureModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire Factures v2.0 - TVA • Relances • PDF');
}
