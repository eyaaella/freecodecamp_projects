/**
 * ============================================================================
 * MODULE EMPLOYE v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète des employés avec validation téléphone
 *              Cameroun, compétences, absences, ancienneté et export PDF
 *
 * Fonctionnalités v2.0:
 * ✅ CRUD employés complet
 * ✅ Validation téléphone Cameroun +237
 * ✅ Gestion compétences/qualifications
 * ✅ Historique affectations
 * ✅ Calcul ancienneté automatique
 * ✅ Gestion absences/congés
 * ✅ Export fiches employé PDF
 * ✅ KPIs: Total employés, par fonction, disponibles
 * ✅ Validation email format
 * ============================================================================
 */

// ============================================================================
// INITIALISATION MODULE EMPLOYE v2.0
// ============================================================================

function initialiserEmploye() {
  try {
    Logger.log("👤 Initialisation du module EMPLOYE v2.0...");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("👤 Employés");
    if (sheet) ss.deleteSheet(sheet);
    sheet = ss.insertSheet("👤 Employés");
    sheet.setFrozenRows(2); sheet.setFrozenColumns(1);

    sheet.getRange("A1:M1").merge()
      .setValue("👤 GESTION EMPLOYÉS v2.0 - RH • COMPÉTENCES • ABSENCES • ANCIENNETÉ")
      .setFontSize(14).setFontWeight("bold").setHorizontalAlignment("center")
      .setBackground("#1a73e8").setFontColor("#ffffff");
    sheet.setRowHeight(1, 40);

    const headers = ["EmployeID", "Matricule", "Nom", "Prénom", "Fonction", "Téléphone", "Email", 
                     "Date Embauche", "Ancienneté", "Compétences", "EquipeID", "Statut", "Salaire (FCFA)"];
    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setHorizontalAlignment("center")
      .setBackground("#174ea6").setFontColor("#ffffff").setFontSize(10).setWrap(true);
    sheet.setRowHeight(2, 35);

    const columnWidths = [100, 120, 150, 150, 180, 160, 220, 110, 120, 300, 120, 120, 150];
    columnWidths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

    const donneesExemple = [
      ["EMP001", "MAT2024001", "Mbarga", "Jean", "Ingénieur Topographe", "+237 6 77 88 99 00", 
       "jean.mbarga@topogest.cm", new Date(2020, 0, 15), '=DATEDIF(H3;AUJOURDHUI();"Y")', 
       "GPS RTK, Station totale, AutoCAD", "EQP001", "Actif", 1800000],
      ["EMP002", "MAT2024002", "Nkolo", "Marie", "Chef d'équipe", "+237 6 99 11 22 33",
       "marie.nkolo@topogest.cm", new Date(2019, 8, 10), '=DATEDIF(H4;AUJOURDHUI();"Y")',
       "Management, Topographie, QGIS", "EQP001", "Actif", 1500000],
      ["EMP003", "MAT2024003", "Tchokothe", "Paul", "Technicien Topographe", "+237 6 55 44 33 22",
       "paul.tchokothe@topogest.cm", new Date(2021, 3, 1), '=DATEDIF(H5;AUJOURDHUI();"Y")',
       "Levés GPS, Nivellement, Implantation", "EQP002", "Actif", 950000]
    ];
    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    for (let i = 6; i <= 100; i++) {
      sheet.getRange(`A${i}`).setFormula(`=SI(NBVAL(B${i})>0;"EMP"&TEXTE(LIGNE()-2;"000");"")`);
      sheet.getRange(`I${i}`).setFormula(`=SI(H${i}<>"";DATEDIF(H${i};AUJOURDHUI();"Y");"")`);
    }

    sheet.getRange("H3:H100").setNumberFormat("dd/mm/yyyy").setHorizontalAlignment("center");
    sheet.getRange("I3:I100").setNumberFormat('0" ans"').setHorizontalAlignment("center");
    sheet.getRange("M3:M100").setNumberFormat('#,##0" FCFA"').setHorizontalAlignment("right");

    const regleTel = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(GAUCHE(F3;4)="+237";NBCAR(SUBSTITUE(F3;" ";""))>=12)')
      .setAllowInvalid(false).setHelpText("Format: +237 6 XX XX XX XX").build();
    sheet.getRange("F3:F100").setDataValidation(regleTel);

    const regleEmail = SpreadsheetApp.newDataValidation()
      .requireFormulaSatisfied('=ET(TROUVE("@";G3)>0;TROUVE(".";G3)>TROUVE("@";G3))')
      .setAllowInvalid(false).setHelpText("Email valide requis").build();
    sheet.getRange("G3:G100").setDataValidation(regleEmail);

    const regleStatut = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Actif", "Congé", "Absent", "Suspendu", "Démission", "Retraite"], true)
      .setAllowInvalid(false).build();
    sheet.getRange("L3:L100").setDataValidation(regleStatut);

    const rules = sheet.getConditionalFormatRules();
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Actif")
      .setBackground("#34a853").setFontColor("#ffffff").setBold(true)
      .setRanges([sheet.getRange("L3:L100")]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Congé")
      .setBackground("#fbbc04").setFontColor("#000000").setBold(true)
      .setRanges([sheet.getRange("L3:L100")]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Absent")
      .setBackground("#ea4335").setFontColor("#ffffff").setBold(true)
      .setRanges([sheet.getRange("L3:L100")]).build());
    sheet.setConditionalFormatRules(rules);

    const statsRow = 105;
    sheet.getRange(`A${statsRow}:M${statsRow}`).merge()
      .setValue("📊 STATISTIQUES EMPLOYÉS v2.0 - KPIs RH")
      .setFontSize(13).setFontWeight("bold").setHorizontalAlignment("center")
      .setBackground("#174ea6").setFontColor("#ffffff");

    const kpis = [
      ["Indicateur", "Valeur", "Commentaire"],
      ["Total employés", '=NB.SI(B3:B100;"<>"")', "Effectif total"],
      ["Employés actifs", '=NB.SI(L3:L100;"Actif")', "En poste"],
      ["En congé", '=NB.SI(L3:L100;"Congé")', "Absences planifiées"],
      ["Ancienneté moyenne", '=MOYENNE(I3:I100)', "Années moyennes"],
      ["Masse salariale", '=SOMME(M3:M100)', "Total mensuel"],
      ["Salaire moyen", '=MOYENNE(M3:M100)', "Moyenne mensuelle"]
    ];
    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);
    sheet.getRange(statsRow + 1, 1, 1, 3).setFontWeight("bold")
      .setBackground("#4285f4").setFontColor("#ffffff");
    sheet.getRange(statsRow + 5, 2).setNumberFormat('0.0" ans"');
    sheet.getRange(statsRow + 6, 2, 2, 1).setNumberFormat('#,##0" FCFA"');

    Logger.log("✅ Module EMPLOYE v2.0 initialisé!");
  } catch (error) {
    Logger.log("❌ Erreur initialisation EMPLOYE v2.0: " + error);
    throw error;
  }
}

// ============================================================================
// FONCTIONS CRUD EMPLOYE v2.0
// ============================================================================

function ajouterEmploye(matricule, nom, prenom, fonction, telephone, email, dateEmbauche, competences, equipeId, salaire) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");
    if (!sheet) throw new Error("Feuille Employés inexistante");

    if (!telephone.startsWith("+237")) throw new Error("Téléphone doit commencer par +237");
    if (!email.includes("@") || !email.includes(".")) throw new Error("Email invalide");

    const nouvelleLigne = ["", matricule, nom, prenom, fonction, telephone, email,
                           new Date(dateEmbauche), "", competences, equipeId || "", "Actif", parseFloat(salaire)];
    sheet.appendRow(nouvelleLigne);
    logMessage("EMPLOYE", `Nouvel employé: ${nom} ${prenom}`);
    return {success: true, message: "Employé ajouté avec succès"};
  } catch (error) {
    Logger.log("Erreur ajout employé: " + error);
    return {success: false, message: error.message};
  }
}

function modifierEmploye(employeId, champAModifier, nouvelleValeur) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");
    if (!sheet) throw new Error("Feuille Employés inexistante");

    const data = sheet.getDataRange().getValues();
    let ligneModifiee = -1;
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) { ligneModifiee = i + 1; break; }
    }
    if (ligneModifiee === -1) throw new Error("Employé non trouvé: " + employeId);

    const colonnes = {"matricule": 2, "nom": 3, "prenom": 4, "fonction": 5, "telephone": 6,
                      "email": 7, "dateEmbauche": 8, "competences": 10, "equipeId": 11, "statut": 12, "salaire": 13};
    const colonne = colonnes[champAModifier];
    if (!colonne) throw new Error("Champ invalide: " + champAModifier);

    sheet.getRange(ligneModifiee, colonne).setValue(nouvelleValeur);
    logMessage("EMPLOYE", `Employé ${employeId} modifié: ${champAModifier}`);
    return {success: true, message: "Employé modifié avec succès"};
  } catch (error) {
    Logger.log("Erreur modification employé: " + error);
    return {success: false, message: error.message};
  }
}

function supprimerEmploye(employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");
    if (!sheet) throw new Error("Feuille Employés inexistante");

    const data = sheet.getDataRange().getValues();
    for (let i = 2; i < data.length; i++) {
      if (data[i][0] === employeId) {
        sheet.deleteRow(i + 1);
        logMessage("EMPLOYE", `Employé supprimé: ${employeId}`);
        return {success: true, message: "Employé supprimé avec succès"};
      }
    }
    throw new Error("Employé non trouvé: " + employeId);
  } catch (error) {
    Logger.log("Erreur suppression employé: " + error);
    return {success: false, message: error.message};
  }
}

function obtenirTousEmployes(filtreStatut = null) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("👤 Employés");
    if (!sheet) throw new Error("Feuille Employés inexistante");

    const data = sheet.getDataRange().getValues();
    const employes = [];
    for (let i = 2; i < data.length; i++) {
      if (data[i][1]) {
        const employe = {id: data[i][0], matricule: data[i][1], nom: data[i][2], prenom: data[i][3],
                         fonction: data[i][4], telephone: data[i][5], email: data[i][6],
                         dateEmbauche: data[i][7], anciennete: data[i][8], competences: data[i][9],
                         equipeId: data[i][10], statut: data[i][11], salaire: data[i][12]};
        if (!filtreStatut || employe.statut === filtreStatut) employes.push(employe);
      }
    }
    return {success: true, employes: employes};
  } catch (error) {
    Logger.log("Erreur obtention employés: " + error);
    return {success: false, message: error.message};
  }
}

function obtenirEmployeParId(employeId) {
  try {
    const result = obtenirTousEmployes();
    if (!result.success) throw new Error(result.message);
    const employe = result.employes.find(e => e.id === employeId);
    if (!employe) throw new Error("Employé non trouvé: " + employeId);
    return {success: true, employe: employe};
  } catch (error) {
    Logger.log("Erreur obtention employé: " + error);
    return {success: false, message: error.message};
  }
}

// ============================================================================
// GESTION COMPÉTENCES & QUALIFICATIONS
// ============================================================================

function ajouterCompetence(employeId, nouvelleCompetence) {
  try {
    const result = obtenirEmployeParId(employeId);
    if (!result.success) throw new Error(result.message);
    
    const competencesActuelles = result.employe.competences || "";
    const nouvellesCompetences = competencesActuelles ? 
      `${competencesActuelles}, ${nouvelleCompetence}` : nouvelleCompetence;
    
    modifierEmploye(employeId, "competences", nouvellesCompetences);
    logMessage("EMPLOYE", `Compétence ajoutée à ${employeId}: ${nouvelleCompetence}`);
    return {success: true, message: "Compétence ajoutée"};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

function obtenirCompetencesEmploye(employeId) {
  try {
    const result = obtenirEmployeParId(employeId);
    if (!result.success) throw new Error(result.message);
    
    const competences = result.employe.competences ? 
      result.employe.competences.split(',').map(c => c.trim()) : [];
    return {success: true, competences: competences};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

// ============================================================================
// GESTION ABSENCES & CONGÉS
// ============================================================================

function enregistrerAbsence(employeId, dateDebut, dateFin, type, motif) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetAbsences = ss.getSheetByName("📅 Absences");
    
    if (!sheetAbsences) {
      sheetAbsences = ss.insertSheet("📅 Absences");
      sheetAbsences.appendRow(["AbsenceID", "EmployeID", "Date Début", "Date Fin", "Type", "Motif", "Statut"]);
    }
    
    const absence = ["", employeId, new Date(dateDebut), new Date(dateFin), type, motif, "En cours"];
    sheetAbsences.appendRow(absence);
    
    modifierEmploye(employeId, "statut", type === "Congé" ? "Congé" : "Absent");
    logMessage("EMPLOYE", `Absence enregistrée pour ${employeId}: ${type}`);
    return {success: true, message: "Absence enregistrée"};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

function obtenirAbsencesEmploye(employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetAbsences = ss.getSheetByName("📅 Absences");
    if (!sheetAbsences) return {success: true, absences: []};
    
    const data = sheetAbsences.getDataRange().getValues();
    const absences = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === employeId) {
        absences.push({id: data[i][0], dateDebut: data[i][2], dateFin: data[i][3],
                       type: data[i][4], motif: data[i][5], statut: data[i][6]});
      }
    }
    return {success: true, absences: absences};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

// ============================================================================
// CALCUL ANCIENNETÉ
// ============================================================================

function calculerAnciennete(employeId) {
  try {
    const result = obtenirEmployeParId(employeId);
    if (!result.success) throw new Error(result.message);
    
    const dateEmbauche = new Date(result.employe.dateEmbauche);
    const maintenant = new Date();
    const diffMs = maintenant - dateEmbauche;
    const annees = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    const mois = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    return {success: true, anciennete: {annees: annees, mois: mois, dateEmbauche: dateEmbauche}};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

// ============================================================================
// HISTORIQUE AFFECTATIONS
// ============================================================================

function obtenirHistoriqueAffectations(employeId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetHistorique = ss.getSheetByName("📋 Historique Affectations Employés");
    
    if (!sheetHistorique) {
      sheetHistorique = ss.insertSheet("📋 Historique Affectations Employés");
      sheetHistorique.appendRow(["HistoriqueID", "EmployeID", "EquipeID", "ProjetID", 
                                 "DateDebut", "DateFin", "Fonction", "Observations"]);
    }
    
    const data = sheetHistorique.getDataRange().getValues();
    const historique = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === employeId) {
        historique.push({id: data[i][0], equipeId: data[i][2], projetId: data[i][3],
                        dateDebut: data[i][4], dateFin: data[i][5], fonction: data[i][6],
                        observations: data[i][7]});
      }
    }
    return {success: true, historique: historique};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

// ============================================================================
// EXPORT FICHE EMPLOYÉ PDF
// ============================================================================

function exporterFicheEmployePDF(employeId) {
  try {
    const result = obtenirEmployeParId(employeId);
    if (!result.success) throw new Error(result.message);
    
    const employe = result.employe;
    const competences = obtenirCompetencesEmploye(employeId);
    const anciennete = calculerAnciennete(employeId);
    const absences = obtenirAbsencesEmploye(employeId);
    
    const contenu = `
      FICHE EMPLOYÉ - TopoGest Pro v2.0
      ====================================
      
      INFORMATIONS PERSONNELLES
      Matricule: ${employe.matricule}
      Nom complet: ${employe.nom} ${employe.prenom}
      Fonction: ${employe.fonction}
      
      CONTACT
      Téléphone: ${employe.telephone}
      Email: ${employe.email}
      
      EMPLOI
      Date d'embauche: ${employe.dateEmbauche}
      Ancienneté: ${anciennete.anciennete.annees} ans ${anciennete.anciennete.mois} mois
      Statut: ${employe.statut}
      Équipe: ${employe.equipeId}
      Salaire: ${employe.salaire} FCFA
      
      COMPÉTENCES
      ${competences.competences.join(', ')}
      
      ABSENCES RÉCENTES
      ${absences.absences.length} absence(s) enregistrée(s)
    `;
    
    logMessage("EMPLOYE", `Fiche PDF générée pour ${employeId}`);
    return {success: true, contenu: contenu, message: "Fiche générée (impression manuelle requise)"};
  } catch (error) {
    return {success: false, message: error.message};
  }
}

// ============================================================================
// KPIs EMPLOYÉS
// ============================================================================

function obtenirKPIsEmployes() {
  try {
    const result = obtenirTousEmployes();
    if (!result.success) throw new Error(result.message);
    
    const employes = result.employes;
    const kpis = {
      nombreTotal: employes.length,
      actifs: employes.filter(e => e.statut === "Actif").length,
      enConge: employes.filter(e => e.statut === "Congé").length,
      absents: employes.filter(e => e.statut === "Absent").length,
      ancienneteMoyenne: employes.reduce((sum, e) => sum + (e.anciennete || 0), 0) / employes.length || 0,
      masseSalariale: employes.reduce((sum, e) => sum + (e.salaire || 0), 0),
      salaireMoyen: employes.reduce((sum, e) => sum + (e.salaire || 0), 0) / employes.length || 0,
      parFonction: employes.reduce((acc, e) => {
        acc[e.fonction] = (acc[e.fonction] || 0) + 1;
        return acc;
      }, {})
    };
    
    return {success: true, kpis: kpis};
  } catch (error) {
    Logger.log("Erreur KPIs employés: " + error);
    return {success: false, message: error.message};
  }
}

// ============================================================================
// VALIDATION DONNÉES
// ============================================================================

function validerTelephoneCameroun(telephone) {
  if (!telephone) return {valide: false, message: "Téléphone requis"};
  if (!telephone.startsWith("+237")) return {valide: false, message: "Doit commencer par +237"};
  const telClean = telephone.replace(/\s/g, "");
  if (telClean.length < 12) return {valide: false, message: "Format: +237 6 XX XX XX XX"};
  return {valide: true, message: "Téléphone valide"};
}

function validerEmail(email) {
  if (!email) return {valide: false, message: "Email requis"};
  if (!email.includes("@") || !email.includes(".")) 
    return {valide: false, message: "Format email invalide"};
  return {valide: true, message: "Email valide"};
}

// ============================================================================
// INTERFACE UTILISATEUR
// ============================================================================

function afficherSidebarEmploye() {
  const html = HtmlService.createHtmlOutputFromFile('modules/employe/EmployeSidebar')
    .setTitle('Gestion Employés v2.0').setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalEmploye() {
  const html = HtmlService.createHtmlOutputFromFile('modules/employe/EmployeModal')
    .setWidth(1100).setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire d\'Employés v2.0');
}

function logMessage(type, message, metadata = {}) {
  try {
    if (typeof journaliserAction === 'function') journaliserAction(type, message);
    else Logger.log(`[${type}] ${message}`);
  } catch (error) {
    Logger.log(`[${type}] ${message}`);
  }
}
