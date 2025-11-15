/**
 * MODULE FACTURE - Gestion Facturation Clients
 * Gestion complète de la facturation et du recouvrement
 * Version: Production Ready 1.0
 */

// ==================== INITIALISATION DU MODULE FACTURE ====================

/**
 * Initialise le module FACTURE avec toutes les fonctionnalités
 */
function initialiserFacture() {
  try {
    Logger.log("🧾 Initialisation du module FACTURE...");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("🧾 Factures");

    // Supprimer la feuille si elle existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer une nouvelle feuille
    sheet = ss.insertSheet("🧾 Factures");

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange("A1:Q1").merge()
      .setValue("🧾 GESTION DES FACTURES CLIENTS - FACTURATION ET RECOUVREMENT")
      .setFontSize(14)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#1a73e8")
      .setFontColor("#ffffff");

    sheet.setRowHeight(1, 40);

    // ===== COLONNES DE DONNÉES =====
    const headers = [
      "FactureID",
      "ProjetID",
      "NumeroFacture",
      "DateFacture",
      "DateEcheance",
      "Client",
      "Libelle",
      "MontantHT (FCFA)",
      "TauxTVA (%)",
      "MontantTVA (FCFA)",
      "MontantTTC (FCFA)",
      "MontantPaye (FCFA)",
      "MontantRestant (FCFA)",
      "Statut",
      "ModePaiement",
      "DatePaiement",
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
    const columnWidths = [100, 100, 140, 110, 110, 200, 300, 150, 100, 150, 150, 150, 150, 170, 150, 110, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        "FACT001",
        "PROJ001",
        '=SI(NBVAL(B3)>0;"FAC-"&TEXTE(ANNEE(D3);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 0, 20),
        new Date(2024, 1, 19),
        "Ministère Agriculture et Développement Rural",
        "Levés topographiques - Périmètre Logone et Chari - Phase 1",
        125000000,
        19.25,
        '=SI(H3>0;H3*I3/100;0)',
        '=SI(H3>0;H3+J3;0)',
        125000000,
        '=SI(K3>0;K3-L3;0)',
        "Payée",
        "Virement bancaire",
        new Date(2024, 1, 15),
        "Paiement complet reçu - Délai respecté"
      ],
      [
        "FACT002",
        "PROJ001",
        '=SI(NBVAL(B4)>0;"FAC-"&TEXTE(ANNEE(D4);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 1, 15),
        new Date(2024, 2, 16),
        "Ministère Agriculture et Développement Rural",
        "Fourniture matériaux - Canaux irrigation - Lot 1",
        85000000,
        19.25,
        '=SI(H4>0;H4*I4/100;0)',
        '=SI(H4>0;H4+J4;0)',
        50000000,
        '=SI(K4>0;K4-L4;0)',
        "Payée partiellement",
        "Virement bancaire",
        new Date(2024, 2, 10),
        "Acompte 50% reçu - Solde en attente"
      ],
      [
        "FACT003",
        "PROJ002",
        '=SI(NBVAL(B5)>0;"FAC-"&TEXTE(ANNEE(D5);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 2, 5),
        new Date(2024, 3, 4),
        "Commune Urbaine de Yaoundé",
        "Aménagement périmètre maraîcher - Études préliminaires",
        42000000,
        19.25,
        '=SI(H5>0;H5*I5/100;0)',
        '=SI(K5>0;H5+J5;0)',
        0,
        '=SI(K5>0;K5-L5;0)',
        "Émise",
        "",
        "",
        "Facture envoyée - En attente paiement"
      ],
      [
        "FACT004",
        "PROJ001",
        '=SI(NBVAL(B6)>0;"FAC-"&TEXTE(ANNEE(D6);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2023, 11, 10),
        new Date(2024, 0, 9),
        "Ministère Agriculture et Développement Rural",
        "Transport équipements - Zone Extrême-Nord",
        28000000,
        19.25,
        '=SI(H6>0;H6*I6/100;0)',
        '=SI(H6>0;H6+J6;0)',
        0,
        '=SI(K6>0;K6-L6;0)',
        "En retard",
        "",
        "",
        "⚠️ RETARD: 45 jours - Relance envoyée le 15/02/2024"
      ],
      [
        "FACT005",
        "PROJ002",
        '=SI(NBVAL(B7)>0;"FAC-"&TEXTE(ANNEE(D7);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 3, 1),
        new Date(2024, 4, 1),
        "Commune Urbaine de Yaoundé",
        "Installation système irrigation - Matériel et pose",
        68000000,
        19.25,
        '=SI(H7>0;H7*I7/100;0)',
        '=SI(H7>0;H7+J7;0)',
        0,
        '=SI(K7>0;K7-L7;0)',
        "Émise",
        "",
        "",
        "Échéance proche - À surveiller"
      ],
      [
        "FACT006",
        "PROJ001",
        '=SI(NBVAL(B8)>0;"FAC-"&TEXTE(ANNEE(D8);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 2, 20),
        new Date(2024, 3, 19),
        "Ministère Agriculture et Développement Rural",
        "Études impact environnemental - EIES complète",
        55000000,
        19.25,
        '=SI(H8>0;H8*I8/100;0)',
        '=SI(H8>0;H8+J8;0)',
        55000000,
        '=SI(K8>0;K8-L8;0)',
        "Payée",
        "Virement bancaire",
        new Date(2024, 3, 12),
        "Paiement reçu avant échéance"
      ],
      [
        "FACT007",
        "PROJ003",
        '=SI(NBVAL(B9)>0;"FAC-"&TEXTE(ANNEE(D9);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 1, 28),
        new Date(2024, 2, 29),
        "PNDP - Programme National de Développement Participatif",
        "Étude faisabilité - Vallée du Noun",
        38000000,
        19.25,
        '=SI(H9>0;H9*I9/100;0)',
        '=SI(H9>0;H9+J9;0)',
        0,
        '=SI(K9>0;K9-L9;0)',
        "Annulée",
        "",
        "",
        "Projet suspendu - Facture annulée"
      ],
      [
        "FACT008",
        "PROJ001",
        '=SI(NBVAL(B10)>0;"FAC-"&TEXTE(ANNEE(D10);"0000")&"-"&TEXTE(LIGNE()-2;"000");"")',
        new Date(2024, 0, 5),
        new Date(2024, 0, 19),
        "Ministère Agriculture et Développement Rural",
        "Formation agriculteurs - Techniques irrigation gravitaire",
        15000000,
        19.25,
        '=SI(H10>0;H10*I10/100;0)',
        '=SI(H10>0;H10+J10;0)',
        15000000,
        '=SI(K10>0;K10-L10;0)',
        "Payée",
        "Virement bancaire",
        new Date(2024, 0, 18),
        "Paiement rapide - 14 jours"
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE DES DONNÉES =====

    // FactureID (colonne A) - Auto-incrémentation
    const derniereLigne = sheet.getMaxRows();
    for (let i = 11; i <= Math.min(derniereLigne, 200); i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"FACT"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Dates (colonnes D, E, P)
    sheet.getRange("D3:E200")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");
    sheet.getRange("P3:P200")
      .setNumberFormat("dd/mm/yyyy")
      .setHorizontalAlignment("center");

    // Montants (colonnes H, J, K, L, M)
    sheet.getRange("H3:H200")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");
    sheet.getRange("J3:M200")
      .setNumberFormat('#,##0" FCFA"')
      .setHorizontalAlignment("right");

    // Taux TVA (colonne I)
    sheet.getRange("I3:I200")
      .setNumberFormat("0.00%")
      .setHorizontalAlignment("center");

    // ===== FORMULES AVANCÉES =====

    // Délai Paiement en jours (colonne cachée)
    sheet.insertColumnAfter(17);
    sheet.getRange("R2").setValue("Délai Paiement");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`R${i}`).setFormula(
        `=SI(ET(P${i}<>"";D${i}<>"");P${i}-D${i};"")`
      );
    }
    sheet.getRange("R3:R200").setNumberFormat('0" jours"');
    sheet.hideColumns(18);

    // Retard en jours (colonne cachée)
    sheet.insertColumnAfter(18);
    sheet.getRange("S2").setValue("Retard (jours)");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`S${i}`).setFormula(
        `=SI(ET(E${i}<>"";N${i}<>"Payée";N${i}<>"Annulée");MAX(0;AUJOURDHUI()-E${i});0)`
      );
    }
    sheet.getRange("S3:S200").setNumberFormat('0" jours"');
    sheet.hideColumns(19);

    // Statut Auto basé sur dates et paiements (colonne cachée)
    sheet.insertColumnAfter(19);
    sheet.getRange("T2").setValue("Statut Auto");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`T${i}`).setFormula(
        `=SI(NBVAL(D${i})=0;"Brouillon";SI(N${i}="Annulée";"Annulée";SI(M${i}=0;SI(AUJOURDHUI()>E${i};"En retard";"Émise");SI(M${i}<K${i};"Payée partiellement";"Payée"))))`
      );
    }
    sheet.hideColumns(20);

    // Nom Projet depuis référentiel (colonne cachée)
    sheet.insertColumnAfter(20);
    sheet.getRange("U2").setValue("Nom Projet");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`U${i}`).setFormula(
        `=SI(B${i}<>"";SIERREUR(RECHERCHEV(B${i};'📁 Projets'!A:B;2;FAUX);"Projet non trouvé");"")`
      );
    }
    sheet.hideColumns(21);

    // Jours jusqu'à échéance (colonne cachée)
    sheet.insertColumnAfter(21);
    sheet.getRange("V2").setValue("Jours Échéance");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`V${i}`).setFormula(
        `=SI(ET(E${i}<>"";N${i}<>"Payée";N${i}<>"Annulée");E${i}-AUJOURDHUI();"")`
      );
    }
    sheet.getRange("V3:V200").setNumberFormat('0" jours"');
    sheet.hideColumns(22);

    // Taux Recouvrement (colonne cachée)
    sheet.insertColumnAfter(22);
    sheet.getRange("W2").setValue("Taux Recouvrement");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`W${i}`).setFormula(
        `=SI(K${i}>0;L${i}/K${i};0)`
      );
    }
    sheet.getRange("W3:W200").setNumberFormat("0.0%");
    sheet.hideColumns(23);

    // Alerte Retard (colonne cachée)
    sheet.insertColumnAfter(23);
    sheet.getRange("X2").setValue("Alerte Retard");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`X${i}`).setFormula(
        `=SI(S${i}>60;"🔴 URGENT: +"&S${i}&"j";SI(S${i}>30;"🟠 RETARD: +"&S${i}&"j";SI(S${i}>0;"🟡 Léger: +"&S${i}&"j";"")))`
      );
    }
    sheet.hideColumns(24);

    // Année facture (colonne cachée)
    sheet.insertColumnAfter(24);
    sheet.getRange("Y2").setValue("Année");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`Y${i}`).setFormula(
        `=SI(D${i}<>"";ANNEE(D${i});"")`
      );
    }
    sheet.hideColumns(25);

    // Mois facture (colonne cachée)
    sheet.insertColumnAfter(25);
    sheet.getRange("Z2").setValue("Mois");
    for (let i = 3; i <= 200; i++) {
      sheet.getRange(`Z${i}`).setFormula(
        `=SI(D${i}<>"";TEXTE(D${i};"mmmm");"")`
      );
    }
    sheet.hideColumns(26);

    // ===== VALIDATION DES DONNÉES =====

    // ProjetID - Liste déroulante depuis référentiel Projets
    const regleProjet = SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName("📁 Projets").getRange("A3:A100"), true)
      .setAllowInvalid(false)
      .setHelpText("Sélectionnez un projet existant (obligatoire)")
      .build();
    sheet.getRange("B3:B200").setDataValidation(regleProjet);

    // DateFacture - Date valide, pas future
    const regleDateFacture = SpreadsheetApp.newDataValidation()
      .requireDateOnOrBefore(new Date())
      .setAllowInvalid(false)
      .setHelpText("Date de facture ne peut être future")
      .build();
    sheet.getRange("D3:D200").setDataValidation(regleDateFacture);

    // DateEcheance - Doit être après DateFacture
    const regleDateEcheance = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .setHelpText("Date d'échéance doit être après la date de facture")
      .build();
    sheet.getRange("E3:E200").setDataValidation(regleDateEcheance);

    // MontantHT - Nombre positif
    const regleMontantHT = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThan(0)
      .setAllowInvalid(false)
      .setHelpText("Montant HT en FCFA (strictement positif)")
      .build();
    sheet.getRange("H3:H200").setDataValidation(regleMontantHT);

    // TauxTVA - Entre 0 et 25%
    const regleTVA = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(0, 0.25)
      .setAllowInvalid(false)
      .setHelpText("Taux TVA entre 0% et 25% (Cameroun: 19.25% standard)")
      .build();
    sheet.getRange("I3:I200").setDataValidation(regleTVA);

    // MontantPaye - Nombre positif ou zéro
    const regleMontantPaye = SpreadsheetApp.newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText("Montant payé en FCFA (0 ou positif)")
      .build();
    sheet.getRange("L3:L200").setDataValidation(regleMontantPaye);

    // Statut - Liste fixe
    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Brouillon",
        "Émise",
        "Payée partiellement",
        "Payée",
        "Annulée",
        "En retard"
      ], true)
      .setAllowInvalid(false)
      .setHelpText("Statut de la facture")
      .build();
    sheet.getRange("N3:N200").setDataValidation(regleStatut);

    // ModePaiement - Liste fixe
    const regleModePaiement = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "Virement bancaire",
        "Chèque",
        "Espèces",
        "Mobile Money",
        "Lettre de change",
        "Compensation"
      ], true)
      .setAllowInvalid(true)
      .setHelpText("Mode de paiement utilisé")
      .build();
    sheet.getRange("O3:O200").setDataValidation(regleModePaiement);

    // DatePaiement - Date valide
    const regleDatePaiement = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(true)
      .setHelpText("Date de réception du paiement")
      .build();
    sheet.getRange("P3:P200").setDataValidation(regleDatePaiement);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Statut - Vert pour "Payée"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Payée")
      .setBackground("#34a853")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N200")])
      .build());

    // Statut - Orange clair pour "Payée partiellement"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Payée partiellement")
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N200")])
      .build());

    // Statut - Bleu pour "Émise"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Émise")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N200")])
      .build());

    // Statut - Rouge pour "En retard"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("En retard")
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N200")])
      .build());

    // Statut - Gris pour "Brouillon"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Brouillon")
      .setBackground("#e8eaed")
      .setFontColor("#5f6368")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N200")])
      .build());

    // Statut - Gris foncé pour "Annulée"
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Annulée")
      .setBackground("#9aa0a6")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("N3:N200")])
      .build());

    // DateEcheance - Rouge si dépassée et impayée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(E3<AUJOURDHUI();N3<>"Payée";N3<>"Annulée")')
      .setBackground("#ea4335")
      .setFontColor("#ffffff")
      .setBold(true)
      .setRanges([sheet.getRange("E3:E200")])
      .build());

    // DateEcheance - Orange si < 7 jours et impayée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(E3>=AUJOURDHUI();E3<=AUJOURDHUI()+7;N3<>"Payée";N3<>"Annulée")')
      .setBackground("#fbbc04")
      .setFontColor("#000000")
      .setBold(true)
      .setRanges([sheet.getRange("E3:E200")])
      .build());

    // DateEcheance - Vert si payée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=N3="Payée"')
      .setBackground("#e6f4ea")
      .setRanges([sheet.getRange("E3:E200")])
      .build());

    // MontantRestant - Rouge si >0 et échéance dépassée
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(M3>0;E3<AUJOURDHUI())')
      .setBackground("#fce8e6")
      .setFontColor("#ea4335")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M200")])
      .build());

    // MontantRestant - Orange si >0 et échéance proche
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=ET(M3>0;E3<=AUJOURDHUI()+7;E3>=AUJOURDHUI())')
      .setBackground("#fef7e0")
      .setFontColor("#ea8600")
      .setBold(true)
      .setRanges([sheet.getRange("M3:M200")])
      .build());

    // MontantRestant - Vert si = 0 (soldé)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberEqualTo(0)
      .setBackground("#e6f4ea")
      .setFontColor("#137333")
      .setRanges([sheet.getRange("M3:M200")])
      .build());

    // Ligne complète en rouge clair si retard > 30 jours
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$S3>30')
      .setBackground("#fce8e6")
      .setRanges([sheet.getRange("A3:Q200")])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== SECTION STATISTIQUES =====
    const statsRow = 205;

    // Titre de la section
    sheet.getRange(`A${statsRow}:Q${statsRow}`).merge()
      .setValue("📊 STATISTIQUES ET ANALYSES DE FACTURATION")
      .setFontSize(13)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    sheet.setRowHeight(statsRow, 35);

    // KPIs
    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Nombre total factures", '=NB.SI(B3:B200;"<>"")', "Factures enregistrées"],
      ["Factures émises", '=NB.SI(N3:N200;"Émise")', "En attente paiement"],
      ["Factures payées", '=NB.SI(N3:N200;"Payée")', "Intégralement soldées"],
      ["Factures partielles", '=NB.SI(N3:N200;"Payée partiellement")', "Acomptes reçus"],
      ["Factures en retard", '=NB.SI(N3:N200;"En retard")', "Échéance dépassée"],
      ["Factures annulées", '=NB.SI(N3:N200;"Annulée")', "Factures annulées"],
      ["Chiffre affaires total", '=SOMME(K3:K200)', "Total TTC facturé"],
      ["Montant total payé", '=SOMME(L3:L200)', "Encaissements effectifs"],
      ["Créances clients", '=SOMME(M3:M200)', "Montant total impayé"],
      ["Taux recouvrement", '=SI(SOMME(K3:K200)>0;SOMME(L3:L200)/SOMME(K3:K200);0)', "% factures recouvrées"],
      ["Délai paiement moyen", '=MOYENNE.SI(R3:R200;">0";R3:R200)', "Jours moyens paiement"],
      ["Retard moyen", '=MOYENNE.SI(S3:S200;">0";S3:S200)', "Jours moyens retard"],
      ["CA Hors Taxe", '=SOMME(H3:H200)', "Total HT"],
      ["TVA collectée", '=SOMME(J3:J200)', "Total TVA"],
      ["Factures retard >30j", '=NB.SI(S3:S200;">30")', "Retards significatifs"],
      ["Factures retard >60j", '=NB.SI(S3:S200;">60")', "Retards critiques"],
      ["Plus grosse facture", '=MAX(K3:K200)', "Montant TTC maximum"],
      ["Facture moyenne", '=MOYENNE.SI(K3:K200;">0";K3:K200)', "Montant TTC moyen"],
      ["Créance la plus ancienne", '=SI(NB.SI(M3:M200;">0")>0;MAX((M3:M200>0)*(AUJOURDHUI()-E3:E200));0)', "Jours créance max"]
    ];

    // Appliquer formule tableau pour créance la plus ancienne
    sheet.getRange(statsRow + 20, 2).setFormula('=SI(NB.SI(M3:M200;">0")>0;MAX((M3:M200>0)*(AUJOURDHUI()-E3:E200));0)');
    SpreadsheetApp.flush();

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage des KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // Format des valeurs monétaires
    sheet.getRange(statsRow + 8, 2, 3, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 14, 2, 2, 1).setNumberFormat('#,##0" FCFA"');
    sheet.getRange(statsRow + 18, 2, 2, 1).setNumberFormat('#,##0" FCFA"');

    // Format des pourcentages
    sheet.getRange(statsRow + 11, 2).setNumberFormat("0.0%");

    // Format des jours
    sheet.getRange(statsRow + 12, 2, 2, 1).setNumberFormat('0" jours"');
    sheet.getRange(statsRow + 20, 2).setNumberFormat('0" jours"');

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

    // Graphique 1: Répartition Factures par Statut
    const chartStatut = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange("N2:N200"))
      .setPosition(statsRow + kpis.length + 2, 1, 0, 0)
      .setOption('title', 'Répartition des Factures par Statut')
      .setOption('width', 550)
      .setOption('height', 350)
      .setOption('is3D', true)
      .setOption('colors', ['#e8eaed', '#4285f4', '#fbbc04', '#34a853', '#9aa0a6', '#ea4335'])
      .setOption('pieSliceText', 'value-and-percentage')
      .setOption('legend', {position: 'right', textStyle: {fontSize: 10}})
      .setOption('pieSliceTextStyle', {fontSize: 9})
      .build();

    sheet.insertChart(chartStatut);

    // Graphique 2: Évolution CA mensuel
    const chartCA = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("Z2:Z200"))
      .addRange(sheet.getRange("K2:K200"))
      .setPosition(statsRow + kpis.length + 2, 8, 0, 0)
      .setOption('title', 'Chiffre d\'Affaires par Mois')
      .setOption('width', 650)
      .setOption('height', 350)
      .setOption('colors', ['#1a73e8'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'CA TTC (FCFA)', format: 'short'})
      .setOption('hAxis', {title: 'Mois', slantedText: true, slantedTextAngle: 30})
      .setOption('chartArea', {width: '75%', height: '65%'})
      .build();

    sheet.insertChart(chartCA);

    // Graphique 3: Top Clients
    const chartClients = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("F2:F200"))
      .addRange(sheet.getRange("K2:K200"))
      .setPosition(statsRow + kpis.length + 22, 1, 0, 0)
      .setOption('title', 'Chiffre d\'Affaires par Client')
      .setOption('width', 700)
      .setOption('height', 400)
      .setOption('colors', ['#34a853'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'CA TTC (FCFA)', format: 'short'})
      .setOption('vAxis', {title: 'Clients', textStyle: {fontSize: 9}})
      .setOption('chartArea', {width: '55%', height: '75%'})
      .build();

    sheet.insertChart(chartClients);

    // Graphique 4: Retards de Paiement
    const chartRetards = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange("C2:C200"))
      .addRange(sheet.getRange("S2:S200"))
      .setPosition(statsRow + kpis.length + 22, 9, 0, 0)
      .setOption('title', 'Retards de Paiement (jours)')
      .setOption('width', 600)
      .setOption('height', 400)
      .setOption('colors', ['#ea4335'])
      .setOption('legend', {position: 'none'})
      .setOption('vAxis', {title: 'Jours de retard', format: '0'})
      .setOption('hAxis', {title: 'Numéro Facture', slantedText: true, slantedTextAngle: 45, textStyle: {fontSize: 8}})
      .setOption('chartArea', {width: '70%', height: '65%'})
      .build();

    sheet.insertChart(chartRetards);

    // Graphique 5: Taux de Recouvrement
    const chartRecouvrement = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sheet.getRange("C2:C200"))
      .addRange(sheet.getRange("W2:W200"))
      .setPosition(statsRow + kpis.length + 45, 1, 0, 0)
      .setOption('title', 'Taux de Recouvrement par Facture')
      .setOption('width', 700)
      .setOption('height', 400)
      .setOption('colors', ['#fbbc04'])
      .setOption('legend', {position: 'none'})
      .setOption('hAxis', {title: 'Taux Recouvrement (%)', format: '#%', minValue: 0, maxValue: 1})
      .setOption('vAxis', {title: 'Factures', textStyle: {fontSize: 8}})
      .setOption('chartArea', {width: '60%', height: '75%'})
      .build();

    sheet.insertChart(chartRecouvrement);

    // ===== TABLEAU RÉCAPITULATIF PAR CLIENT =====
    const recapRow = statsRow + kpis.length + 70;

    sheet.getRange(`A${recapRow}:H${recapRow}`).merge()
      .setValue("👥 RÉCAPITULATIF PAR CLIENT")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#174ea6")
      .setFontColor("#ffffff");

    const headersRecap = [
      "Client",
      "Nb Factures",
      "CA Total TTC",
      "Montant Payé",
      "Créances",
      "Taux Recouvrement",
      "Délai Moyen",
      "Retard Moyen"
    ];
    sheet.getRange(recapRow + 1, 1, 1, 8).setValues([headersRecap])
      .setFontWeight("bold")
      .setBackground("#4285f4")
      .setFontColor("#ffffff")
      .setHorizontalAlignment("center");

    // ===== TABLEAU ALERTES RETARDS =====
    const alerteRow = recapRow + 15;

    sheet.getRange(`A${alerteRow}:G${alerteRow}`).merge()
      .setValue("⚠️ ALERTES - FACTURES EN RETARD")
      .setFontSize(12)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setBackground("#ea4335")
      .setFontColor("#ffffff");

    const headersAlerte = [
      "Numéro Facture",
      "Client",
      "Montant TTC",
      "Date Échéance",
      "Retard (jours)",
      "Créance",
      "Action"
    ];
    sheet.getRange(alerteRow + 1, 1, 1, 7).setValues([headersAlerte])
      .setFontWeight("bold")
      .setBackground("#f28b82")
      .setFontColor("#000000")
      .setHorizontalAlignment("center");

    // ===== PROTECTION DE LA FEUILLE =====
    const protection = sheet.protect().setDescription("Feuille Factures protégée");

    // Déprotéger les plages de saisie
    const plagesSaisie = [
      sheet.getRange("B3:Q200")  // Zone de saisie principale
    ];

    protection.setUnprotectedRanges(plagesSaisie);
    protection.setWarningOnly(true);

    Logger.log("✅ Module FACTURE initialisé avec succès!");

  } catch (error) {
    Logger.log("❌ Erreur lors de l'initialisation du module FACTURE: " + error);
    throw error;
  }
}

// ==================== FONCTIONS CRUD ====================

/**
 * Ajoute une nouvelle facture
 */
function ajouterFacture(projetId, client, libelle, montantHT, tauxTVA, dateFacture, dateEcheance, observations) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    // Validation montant
    if (montantHT <= 0) {
      throw new Error("Le montant HT doit être strictement positif");
    }

    // Validation TVA
    if (tauxTVA < 0 || tauxTVA > 0.25) {
      throw new Error("Le taux de TVA doit être entre 0% et 25%");
    }

    // Validation dates
    const dfacture = new Date(dateFacture);
    const decheance = new Date(dateEcheance);

    if (dfacture > new Date()) {
      throw new Error("La date de facture ne peut être future");
    }

    if (decheance < dfacture) {
      throw new Error("La date d'échéance doit être après la date de facture");
    }

    // Calculs automatiques
    const montantTVA = montantHT * tauxTVA;
    const montantTTC = montantHT + montantTVA;

    // Générer le numéro de facture
    const annee = dfacture.getFullYear();
    const data = sheet.getDataRange().getValues();
    let numeroSequence = 1;

    // Compter les factures de la même année
    for (let i = 2; i < data.length; i++) {
      if (data[i][3]) {  // Si date facture existe
        const anneeFact = new Date(data[i][3]).getFullYear();
        if (anneeFact === annee) {
          numeroSequence++;
        }
      }
    }

    const numeroFacture = `FAC-${annee}-${String(numeroSequence).padStart(3, '0')}`;

    const nouvelleLigne = [
      "",  // FactureID auto-généré
      projetId,
      numeroFacture,
      dfacture,
      decheance,
      client,
      libelle,
      parseFloat(montantHT),
      parseFloat(tauxTVA),
      montantTVA,
      montantTTC,
      0,  // MontantPaye initial
      montantTTC,  // MontantRestant initial
      "Émise",  // Statut initial
      "",  // ModePaiement
      "",  // DatePaiement
      observations || ""
    ];

    sheet.appendRow(nouvelleLigne);

    // Journaliser l'action
    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `Nouvelle facture: ${numeroFacture} - ${client} - ${montantTTC} FCFA`);
    }

    // Notification
    if (typeof envoyerNotification === 'function') {
      envoyerNotification(
        1,
        `Nouvelle facture émise: ${numeroFacture} - ${client} - Échéance: ${decheance.toLocaleDateString('fr-FR')}`,
        "NORMALE"
      );
    }

    return {
      success: true,
      message: "Facture créée avec succès",
      numeroFacture: numeroFacture,
      montantTTC: montantTTC
    };

  } catch (error) {
    Logger.log("Erreur ajout facture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Enregistre un paiement sur une facture
 */
function enregistrerPaiement(factureId, montantPaye, modePaiement, datePaiement) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    let factureData = null;

    // Trouver la facture
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

    // Validation
    if (montantPaye <= 0) {
      throw new Error("Le montant payé doit être positif");
    }

    const montantTTC = factureData[10];
    const montantDejaPayé = factureData[11];
    const nouveauMontantPaye = montantDejaPayé + parseFloat(montantPaye);

    if (nouveauMontantPaye > montantTTC) {
      throw new Error(`Le paiement total (${nouveauMontantPaye} FCFA) dépasse le montant TTC (${montantTTC} FCFA)`);
    }

    // Déterminer le nouveau statut
    let nouveauStatut = "Payée partiellement";
    if (nouveauMontantPaye >= montantTTC) {
      nouveauStatut = "Payée";
    }

    // Mettre à jour la facture
    sheet.getRange(ligneModifiee, 12).setValue(nouveauMontantPaye);  // MontantPaye
    sheet.getRange(ligneModifiee, 14).setValue(nouveauStatut);  // Statut
    sheet.getRange(ligneModifiee, 15).setValue(modePaiement);  // ModePaiement
    sheet.getRange(ligneModifiee, 16).setValue(new Date(datePaiement));  // DatePaiement

    if (typeof journaliserAction === 'function') {
      journaliserAction(
        "FACTURE",
        `Paiement enregistré: ${factureData[2]} - ${montantPaye} FCFA (${nouveauStatut})`
      );
    }

    // Notification si soldé
    if (nouveauStatut === "Payée" && typeof envoyerNotification === 'function') {
      envoyerNotification(
        1,
        `✅ Facture soldée: ${factureData[2]} - ${factureData[5]} - ${montantTTC} FCFA`,
        "NORMALE"
      );
    }

    return {
      success: true,
      message: "Paiement enregistré avec succès",
      nouveauStatut: nouveauStatut,
      montantRestant: montantTTC - nouveauMontantPaye
    };

  } catch (error) {
    Logger.log("Erreur enregistrement paiement: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Modifie une facture existante
 */
function modifierFacture(factureId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;

    // Trouver la facture
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === factureId) {
        ligneModifiee = i + 1;
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Facture non trouvée: " + factureId);
    }

    // Mapper les champs aux colonnes
    const colonnes = {
      "projetId": 2,
      "client": 6,
      "libelle": 7,
      "montantHT": 8,
      "tauxTVA": 9,
      "dateFacture": 4,
      "dateEcheance": 5,
      "statut": 14,
      "observations": 17
    };

    const colonne = colonnes[champAModifier];
    if (!colonne) {
      throw new Error("Champ invalide: " + champAModifier);
    }

    // Validation spécifique
    if (champAModifier === "montantHT" && parseFloat(nouvelleValeur) <= 0) {
      throw new Error("Le montant HT doit être strictement positif");
    }

    if (champAModifier === "tauxTVA" && (parseFloat(nouvelleValeur) < 0 || parseFloat(nouvelleValeur) > 0.25)) {
      throw new Error("Le taux de TVA doit être entre 0% et 25%");
    }

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);

    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `Facture ${factureId} modifiée: ${champAModifier} = ${nouvelleValeur}`);
    }

    return {success: true, message: "Facture modifiée avec succès"};

  } catch (error) {
    Logger.log("Erreur modification facture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Annule une facture
 */
function annulerFacture(factureId, motif) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    let numeroFacture = "";

    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === factureId) {
        ligneModifiee = i + 1;
        numeroFacture = data[i][2];

        // Vérifier si déjà payée
        if (data[i][11] > 0) {
          throw new Error("Impossible d'annuler une facture déjà payée (partiellement ou totalement)");
        }
        break;
      }
    }

    if (ligneModifiee === -1) {
      throw new Error("Facture non trouvée: " + factureId);
    }

    sheet.getRange(ligneModifiee, 14).setValue("Annulée");
    sheet.getRange(ligneModifiee, 17).setValue(`ANNULÉE - Motif: ${motif}`);

    if (typeof journaliserAction === 'function') {
      journaliserAction("FACTURE", `Facture annulée: ${numeroFacture} - ${motif}`);
    }

    return {success: true, message: "Facture annulée avec succès"};

  } catch (error) {
    Logger.log("Erreur annulation facture: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Recherche des factures par critère
 */
function rechercherFactures(critere, valeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const resultats = [];

    const colonnes = {
      "projetId": 1,
      "client": 5,
      "numeroFacture": 2,
      "statut": 13
    };

    const colonne = colonnes[critere];

    for (let i = 2; i < data.length; i++) {
      if (data[i][colonne] && data[i][colonne].toString().toLowerCase().includes(valeur.toLowerCase())) {
        resultats.push({
          factureId: data[i][0],
          numeroFacture: data[i][2],
          client: data[i][5],
          montantTTC: data[i][10],
          montantPaye: data[i][11],
          montantRestant: data[i][12],
          statut: data[i][13],
          dateEcheance: data[i][4]
        });
      }
    }

    return {success: true, resultats: resultats, count: resultats.length};

  } catch (error) {
    Logger.log("Erreur recherche factures: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Obtient les factures en retard
 */
function obtenirFacturesEnRetard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const aujourdhui = new Date();
    const facturesEnRetard = [];

    for (let i = 2; i < data.length; i++) {
      const dateEcheance = new Date(data[i][4]);
      const statut = data[i][13];
      const montantRestant = data[i][12];

      if (dateEcheance < aujourdhui && montantRestant > 0 && statut !== "Annulée") {
        const retardJours = Math.floor((aujourdhui - dateEcheance) / (1000 * 60 * 60 * 24));

        facturesEnRetard.push({
          factureId: data[i][0],
          numeroFacture: data[i][2],
          client: data[i][5],
          montantTTC: data[i][10],
          montantRestant: data[i][12],
          dateEcheance: dateEcheance,
          retardJours: retardJours,
          gravite: retardJours > 60 ? "CRITIQUE" : retardJours > 30 ? "HAUTE" : "MOYENNE"
        });
      }
    }

    // Trier par retard décroissant
    facturesEnRetard.sort((a, b) => b.retardJours - a.retardJours);

    return {
      success: true,
      facturesEnRetard: facturesEnRetard,
      count: facturesEnRetard.length,
      montantTotalRetard: facturesEnRetard.reduce((sum, f) => sum + f.montantRestant, 0)
    };

  } catch (error) {
    Logger.log("Erreur obtention factures en retard: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Génère un rapport de facturation
 */
function genererRapportFacturation(periode) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const rapport = {
      periode: periode,
      dateGeneration: new Date(),
      nombreFactures: 0,
      chiffreAffaires: 0,
      montantPaye: 0,
      creances: 0,
      parStatut: {},
      parClient: {},
      factures: []
    };

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {  // Si ProjetID existe
        rapport.nombreFactures++;
        rapport.chiffreAffaires += data[i][10] || 0;
        rapport.montantPaye += data[i][11] || 0;
        rapport.creances += data[i][12] || 0;

        // Par statut
        const statut = data[i][13];
        rapport.parStatut[statut] = (rapport.parStatut[statut] || 0) + 1;

        // Par client
        const client = data[i][5];
        if (!rapport.parClient[client]) {
          rapport.parClient[client] = {
            nombreFactures: 0,
            ca: 0,
            paye: 0,
            creances: 0
          };
        }
        rapport.parClient[client].nombreFactures++;
        rapport.parClient[client].ca += data[i][10] || 0;
        rapport.parClient[client].paye += data[i][11] || 0;
        rapport.parClient[client].creances += data[i][12] || 0;

        rapport.factures.push({
          numeroFacture: data[i][2],
          client: data[i][5],
          montantTTC: data[i][10],
          statut: data[i][13]
        });
      }
    }

    rapport.tauxRecouvrement = rapport.chiffreAffaires > 0
      ? (rapport.montantPaye / rapport.chiffreAffaires) * 100
      : 0;

    return {success: true, rapport: rapport};

  } catch (error) {
    Logger.log("Erreur génération rapport facturation: " + error);
    return {success: false, message: error.message};
  }
}

/**
 * Calcule les statistiques de facturation
 */
function calculerStatistiquesFacturation() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("🧾 Factures");

    if (!sheet) {
      throw new Error("La feuille Factures n'existe pas");
    }

    const data = sheet.getDataRange().getValues();
    const aujourdhui = new Date();

    const stats = {
      nombreTotal: 0,
      caTotal: 0,
      payeTotal: 0,
      creancesTotal: 0,
      delaiPaiementMoyen: 0,
      retardMoyen: 0,
      tauxRecouvrement: 0,
      nombreRetards: 0,
      montantRetards: 0
    };

    let sommeDélais = 0;
    let compteDelais = 0;
    let sommeRetards = 0;
    let compteRetards = 0;

    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {
        stats.nombreTotal++;
        stats.caTotal += data[i][10] || 0;
        stats.payeTotal += data[i][11] || 0;
        stats.creancesTotal += data[i][12] || 0;

        // Délai paiement
        if (data[i][15]) {  // Si date paiement existe
          const dateFacture = new Date(data[i][3]);
          const datePaiement = new Date(data[i][15]);
          const delai = Math.floor((datePaiement - dateFacture) / (1000 * 60 * 60 * 24));
          sommeDélais += delai;
          compteDelais++;
        }

        // Retards
        const dateEcheance = new Date(data[i][4]);
        const statut = data[i][13];
        if (dateEcheance < aujourdhui && data[i][12] > 0 && statut !== "Annulée") {
          stats.nombreRetards++;
          stats.montantRetards += data[i][12];
          const retard = Math.floor((aujourdhui - dateEcheance) / (1000 * 60 * 60 * 24));
          sommeRetards += retard;
          compteRetards++;
        }
      }
    }

    stats.delaiPaiementMoyen = compteDelais > 0 ? Math.round(sommeDélais / compteDelais) : 0;
    stats.retardMoyen = compteRetards > 0 ? Math.round(sommeRetards / compteRetards) : 0;
    stats.tauxRecouvrement = stats.caTotal > 0 ? (stats.payeTotal / stats.caTotal) * 100 : 0;

    return {success: true, statistiques: stats};

  } catch (error) {
    Logger.log("Erreur calcul statistiques facturation: " + error);
    return {success: false, message: error.message};
  }
}
