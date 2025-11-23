/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODULE GESTION DU PERSONNEL V6.0 ULTIMATE - PARTIE 2/3
 * FEUILLES SECONDAIRES: AFFECTATIONS, ABSENCES, ÉVALUATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @description Gestion des affectations cours, absences et évaluations
 * @version 6.0.0 - OPTIMISÉ
 * @date 2025-01-23
 * @author WARAP Education Team
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📌 FEUILLE AFFECTATIONS COURS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise la feuille Affectations Cours
 */
function initAffectationsSheet(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.affectations;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // En-tête principal
    sheet.getRange('A1:O1')
      .merge()
      .setValue('📌 AFFECTATIONS COURS - GESTION EMPLOIS DU TEMPS PERSONNEL')
      .setBackground('#8b5cf6')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(16)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.setRowHeight(1, 60);

    // Headers colonnes
    var headers = [
      '🆔 ID Affectation',
      '👤 ID Personnel',
      '👤 Nom Personnel',
      '📚 Matière',
      '🎓 Classe',
      '📊 Niveau',
      '⏰ Heures/Semaine',
      '📅 Date Début',
      '📅 Date Fin',
      '✅ Statut',
      '🎯 Type',
      '📝 Notes',
      '👤 Créé Par',
      '📅 Créé Le',
      '🔐 Hash'
    ];

    sheet.getRange(3, 1, 1, headers.length)
      .setValues([headers])
      .setBackground('#8b5cf6')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setWrap(true);

    sheet.setRowHeight(3, 50);

    // Largeurs colonnes
    var widths = [150, 150, 200, 150, 120, 100, 120, 120, 120, 120, 150, 250, 150, 150, 120];
    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }

    // Figer
    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(3);

    // Statistiques (ligne 2)
    sheet.getRange('A2').setValue('📊 STATISTIQUES:');
    sheet.getRange('B2').setFormula('=CONCATENATE("Total: ",IFERROR(COUNTIF(A:A,">A3")-1,0)," | Actives: ",IFERROR(COUNTIF(J:J,"✅ Active"),0)," | Terminées: ",IFERROR(COUNTIF(J:J,"🔚 Terminée"),0))');
    sheet.getRange('A2:B2').setFontWeight('bold').setBackground('#f3f4f6');

    // Validations
    applyAffectationsValidations(sheet);

    // Couleur onglet
    sheet.setTabColor('#8b5cf6');

    Logger.log('✅ Feuille Affectations créée');
  }

  return sheet;
}

/**
 * Applique les validations pour Affectations
 */
function applyAffectationsValidations(sheet) {
  var lastRow = 2000;

  // Validation Statut
  var statutsAffectation = ['✅ Active', '⏸️ Suspendue', '🔚 Terminée', '❌ Annulée'];
  sheet.getRange(4, 10, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(statutsAffectation, true)
      .setAllowInvalid(false)
      .build());

  // Validation Type
  var typesAffectation = ['📚 Cours Principal', '📖 Cours TD', '🔬 Cours TP', '🎯 Cours Soutien', '📝 Cours Rattrapage'];
  sheet.getRange(4, 11, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(typesAffectation, true)
      .setAllowInvalid(false)
      .build());

  // Validation Matières (depuis config)
  sheet.getRange(4, 4, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_PERSONNEL_V6.dropdowns.matieres, true)
      .setAllowInvalid(true)
      .build());

  // Formats dates
  sheet.getRange(4, 8, lastRow, 2).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(4, 14, lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');

  // Format heures
  sheet.getRange(4, 7, lastRow, 1).setNumberFormat('0.0" h"');
}

/**
 * Ajoute une affectation cours
 */
function ajouterAffectationCours(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.affectations);
    var user = Session.getActiveUser().getEmail();
    var now = new Date();

    if (!data.id_personnel || !data.matiere || !data.classe) {
      throw new Error('Personnel, matière et classe obligatoires');
    }

    // Générer ID
    var id = generateUniqueID('AFF');

    // Ligne de données
    var rowData = [
      id,
      data.id_personnel,
      data.nom_personnel || getPersonnelNom(data.id_personnel),
      data.matiere,
      data.classe,
      data.niveau || '',
      parseFloat(data.heures_semaine) || 0,
      data.date_debut ? new Date(data.date_debut) : now,
      data.date_fin ? new Date(data.date_fin) : '',
      '✅ Active',
      data.type || '📚 Cours Principal',
      data.notes || '',
      user,
      now,
      generateHash(id + data.id_personnel + now.getTime())
    ];

    sheet.appendRow(rowData);

    // Mise à jour Personnel: ajouter heures
    updatePersonnelHeures(data.id_personnel);

    logActionV6('AFFECTATION_AJOUT', { id: id, personnel: data.nom_personnel, matiere: data.matiere });

    return { success: true, message: '✅ Affectation ajoutée !', id: id };

  } catch (error) {
    Logger.log('❌ Erreur affectation: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Met à jour les heures totales du personnel
 */
function updatePersonnelHeures(personnelId) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetPersonnel = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var sheetAffectations = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.affectations);

    // Calculer total heures depuis affectations actives
    var affData = sheetAffectations.getDataRange().getValues();
    var totalHeures = 0;

    for (var i = 3; i < affData.length; i++) {
      if (affData[i][1] === personnelId && affData[i][9] === '✅ Active') {
        totalHeures += parseFloat(affData[i][6]) || 0;
      }
    }

    // Mettre à jour Personnel
    var persData = sheetPersonnel.getDataRange().getValues();
    for (var j = 1; j < persData.length; j++) {
      if (persData[j][0] === personnelId) {
        sheetPersonnel.getRange(j + 1, CONFIG_PERSONNEL_V6.col.Nombre_Heures_Semaine).setValue(totalHeures);
        break;
      }
    }

  } catch (e) {
    Logger.log('⚠️ Erreur update heures: ' + e);
  }
}

/**
 * Récupère le nom d'un personnel par ID
 */
function getPersonnelNom(personnelId) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === personnelId) {
        return data[i][4]; // Nom_Complet
      }
    }
    return 'N/A';
  } catch (e) {
    return 'N/A';
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ❌ FEUILLE ABSENCES PERSONNEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise la feuille Absences Personnel
 */
function initAbsencesPersonnelSheet(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.absences;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // En-tête principal
    sheet.getRange('A1:N1')
      .merge()
      .setValue('❌ ABSENCES & RETARDS PERSONNEL - SUIVI ASSIDUITÉ')
      .setBackground('#ef4444')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(16)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.setRowHeight(1, 60);

    // Headers colonnes
    var headers = [
      '🆔 ID Absence',
      '👤 ID Personnel',
      '👤 Nom Personnel',
      '📅 Date',
      '⏰ Type',
      '🔢 Durée (jours)',
      '📝 Motif',
      '✅ Justifiée',
      '📄 Document Justificatif',
      '⚠️ Sanction',
      '📝 Commentaire',
      '👤 Enregistré Par',
      '📅 Enregistré Le',
      '🔐 Hash'
    ];

    sheet.getRange(3, 1, 1, headers.length)
      .setValues([headers])
      .setBackground('#ef4444')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setWrap(true);

    sheet.setRowHeight(3, 50);

    // Largeurs colonnes
    var widths = [150, 150, 200, 120, 150, 120, 250, 120, 200, 150, 250, 150, 150, 120];
    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }

    // Figer
    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(3);

    // Statistiques (ligne 2)
    sheet.getRange('A2').setValue('📊 STATISTIQUES:');
    sheet.getRange('B2').setFormula('=CONCATENATE("Total Absences: ",IFERROR(COUNTIF(A:A,">A3")-1,0)," | Justifiées: ",IFERROR(COUNTIF(H:H,"✅ Oui"),0)," | Non Justifiées: ",IFERROR(COUNTIF(H:H,"❌ Non"),0)," | Avec Sanction: ",IFERROR(COUNTIF(J:J,">J3")-COUNTIF(J:J,""),0))');
    sheet.getRange('A2:B2').setFontWeight('bold').setBackground('#fee2e2');

    // Validations
    applyAbsencesValidations(sheet);

    // Mise en forme conditionnelle
    applyAbsencesConditionalFormatting(sheet);

    // Couleur onglet
    sheet.setTabColor('#ef4444');

    Logger.log('✅ Feuille Absences créée');
  }

  return sheet;
}

/**
 * Applique les validations pour Absences
 */
function applyAbsencesValidations(sheet) {
  var lastRow = 2000;

  // Validation Type
  var typesAbsence = ['❌ Absence', '⏰ Retard', '🏥 Congé Maladie', '🏖️ Congé Autorisé', '👶 Congé Maternité', '⚰️ Congé Deuil'];
  sheet.getRange(4, 5, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(typesAbsence, true)
      .setAllowInvalid(false)
      .build());

  // Validation Justifiée
  var justifOptions = ['✅ Oui', '❌ Non', '⏳ En Attente'];
  sheet.getRange(4, 8, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(justifOptions, true)
      .setAllowInvalid(false)
      .build());

  // Formats dates
  sheet.getRange(4, 4, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(4, 13, lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');

  // Format durée
  sheet.getRange(4, 6, lastRow, 1).setNumberFormat('0.0');
}

/**
 * Applique mise en forme conditionnelle Absences
 */
function applyAbsencesConditionalFormatting(sheet) {
  try {
    var range = sheet.getRange('H4:H2000');

    // Justifiée = Vert
    var ruleJustifiee = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('✅ Oui')
      .setBackground('#d1fae5')
      .setRanges([range])
      .build();

    // Non justifiée = Rouge
    var ruleNonJustifiee = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('❌ Non')
      .setBackground('#fee2e2')
      .setRanges([range])
      .build();

    // En attente = Jaune
    var ruleAttente = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('⏳ En Attente')
      .setBackground('#fef3c7')
      .setRanges([range])
      .build();

    sheet.setConditionalFormatRules([ruleJustifiee, ruleNonJustifiee, ruleAttente]);

  } catch (e) {
    Logger.log('⚠️ Erreur format conditionnel: ' + e);
  }
}

/**
 * Enregistre une absence
 */
function enregistrerAbsence(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.absences);
    var sheetPersonnel = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var user = Session.getActiveUser().getEmail();
    var now = new Date();

    if (!data.id_personnel || !data.date || !data.type) {
      throw new Error('Personnel, date et type obligatoires');
    }

    // Générer ID
    var id = generateUniqueID('ABS');

    // Ligne de données
    var rowData = [
      id,
      data.id_personnel,
      data.nom_personnel || getPersonnelNom(data.id_personnel),
      new Date(data.date),
      data.type,
      parseFloat(data.duree) || 1,
      data.motif || '',
      data.justifiee || '⏳ En Attente',
      data.document_url || '',
      data.sanction || '',
      data.commentaire || '',
      user,
      now,
      generateHash(id + data.id_personnel + now.getTime())
    ];

    sheet.appendRow(rowData);

    // Incrémenter compteur absences dans Personnel
    incrementerAbsencesPersonnel(data.id_personnel, data.type);

    logActionV6('ABSENCE_AJOUT', { id: id, personnel: data.nom_personnel, date: data.date });

    return { success: true, message: '✅ Absence enregistrée !', id: id };

  } catch (error) {
    Logger.log('❌ Erreur absence: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Incrémente compteur absences/retards Personnel
 */
function incrementerAbsencesPersonnel(personnelId, type) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var data = sheet.getDataRange().getValues();
    var col = CONFIG_PERSONNEL_V6.col;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === personnelId) {
        var row = i + 1;

        if (type === '⏰ Retard') {
          var retards = parseInt(data[i][col.Nombre_Retards - 1]) || 0;
          sheet.getRange(row, col.Nombre_Retards).setValue(retards + 1);
        } else {
          var absences = parseInt(data[i][col.Nombre_Absences - 1]) || 0;
          sheet.getRange(row, col.Nombre_Absences).setValue(absences + 1);
        }

        break;
      }
    }
  } catch (e) {
    Logger.log('⚠️ Erreur incrémentation: ' + e);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ⭐ FEUILLE ÉVALUATIONS PERSONNEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise la feuille Évaluations Personnel
 */
function initEvaluationsSheet(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.evaluations;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // En-tête principal
    sheet.getRange('A1:R1')
      .merge()
      .setValue('⭐ ÉVALUATIONS PERFORMANCE PERSONNEL - SUIVI QUALITÉ')
      .setBackground('#f59e0b')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(16)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.setRowHeight(1, 60);

    // Headers colonnes
    var headers = [
      '🆔 ID Évaluation',
      '👤 ID Personnel',
      '👤 Nom Personnel',
      '📅 Date Évaluation',
      '📊 Période',
      '⭐ Note Globale (/100)',
      '📚 Compétences Pédagogiques (/20)',
      '👥 Relations Élèves (/20)',
      '🤝 Relations Collègues (/20)',
      '⏰ Ponctualité (/20)',
      '📋 Respect Règlement (/20)',
      '💡 Points Forts',
      '⚠️ Axes Amélioration',
      '🎯 Objectifs',
      '📝 Commentaire Évaluateur',
      '👤 Évalué Par',
      '📅 Évalué Le',
      '🔐 Hash'
    ];

    sheet.getRange(3, 1, 1, headers.length)
      .setValues([headers])
      .setBackground('#f59e0b')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setWrap(true);

    sheet.setRowHeight(3, 60);

    // Largeurs colonnes
    var widths = [150, 150, 200, 120, 150, 150, 150, 150, 150, 120, 150, 250, 250, 250, 300, 150, 150, 120];
    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }

    // Figer
    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(3);

    // Statistiques (ligne 2)
    sheet.getRange('A2').setValue('📊 STATISTIQUES:');
    sheet.getRange('B2').setFormula('=CONCATENATE("Total Évaluations: ",IFERROR(COUNTIF(A:A,">A3")-1,0)," | Note Moyenne: ",IFERROR(ROUND(AVERAGE(F4:F),1),0),"/100")');
    sheet.getRange('A2:B2').setFontWeight('bold').setBackground('#fef3c7');

    // Validations
    applyEvaluationsValidations(sheet);

    // Formule auto Note Globale
    applyEvaluationsFormulas(sheet);

    // Mise en forme conditionnelle
    applyEvaluationsConditionalFormatting(sheet);

    // Couleur onglet
    sheet.setTabColor('#f59e0b');

    Logger.log('✅ Feuille Évaluations créée');
  }

  return sheet;
}

/**
 * Applique les validations pour Évaluations
 */
function applyEvaluationsValidations(sheet) {
  var lastRow = 2000;

  // Validation Période
  var periodes = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Annuelle', 'Probatoire', 'Autre'];
  sheet.getRange(4, 5, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(periodes, true)
      .setAllowInvalid(true)
      .build());

  // Validation Notes (0-20)
  for (var col = 7; col <= 11; col++) {
    sheet.getRange(4, col, lastRow, 1)
      .setDataValidation(SpreadsheetApp.newDataValidation()
        .requireNumberBetween(0, 20)
        .setAllowInvalid(true)
        .setHelpText('Note entre 0 et 20')
        .build());
  }

  // Validation Note Globale (0-100) - sera calculée automatiquement
  sheet.getRange(4, 6, lastRow, 1).setNumberFormat('0.0"/100"');

  // Formats dates
  sheet.getRange(4, 4, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(4, 17, lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');

  // Format notes
  for (var c = 7; c <= 11; c++) {
    sheet.getRange(4, c, lastRow, 1).setNumberFormat('0.0"/20"');
  }
}

/**
 * Applique formule auto calcul Note Globale
 */
function applyEvaluationsFormulas(sheet) {
  // Note Globale = moyenne des 5 critères * 5 (pour avoir /100)
  var formulaNoteGlobale = '=IF(COUNTBLANK(G4:K4)=5,0,ROUND(AVERAGE(G4:K4)*5,1))';
  sheet.getRange(4, 6).setFormula(formulaNoteGlobale);
}

/**
 * Applique mise en forme conditionnelle Évaluations
 */
function applyEvaluationsConditionalFormatting(sheet) {
  try {
    var range = sheet.getRange('F4:F2000');

    // Excellent >= 80 = Vert foncé
    var ruleExcellent = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(80)
      .setBackground('#22c55e')
      .setFontColor('#FFFFFF')
      .setRanges([range])
      .build();

    // Bien 60-79 = Vert clair
    var ruleBien = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(60, 79)
      .setBackground('#86efac')
      .setRanges([range])
      .build();

    // Moyen 40-59 = Jaune
    var ruleMoyen = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(40, 59)
      .setBackground('#fef3c7')
      .setRanges([range])
      .build();

    // Insuffisant < 40 = Rouge
    var ruleInsuffisant = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(40)
      .setBackground('#fee2e2')
      .setRanges([range])
      .build();

    sheet.setConditionalFormatRules([ruleExcellent, ruleBien, ruleMoyen, ruleInsuffisant]);

  } catch (e) {
    Logger.log('⚠️ Erreur format conditionnel: ' + e);
  }
}

/**
 * Enregistre une évaluation
 */
function enregistrerEvaluation(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.evaluations);
    var sheetPersonnel = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var user = Session.getActiveUser().getEmail();
    var now = new Date();

    if (!data.id_personnel || !data.date_evaluation) {
      throw new Error('Personnel et date obligatoires');
    }

    // Générer ID
    var id = generateUniqueID('EVAL');

    // Calculer note globale
    var notes = [
      parseFloat(data.note_competences) || 0,
      parseFloat(data.note_eleves) || 0,
      parseFloat(data.note_collegues) || 0,
      parseFloat(data.note_ponctualite) || 0,
      parseFloat(data.note_reglement) || 0
    ];

    var noteGlobale = 0;
    var count = 0;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i] > 0) {
        noteGlobale += notes[i];
        count++;
      }
    }
    noteGlobale = count > 0 ? Math.round((noteGlobale / count) * 5 * 10) / 10 : 0;

    // Ligne de données
    var rowData = [
      id,
      data.id_personnel,
      data.nom_personnel || getPersonnelNom(data.id_personnel),
      new Date(data.date_evaluation),
      data.periode || 'Autre',
      '', // Note Globale - sera calculée par formule
      parseFloat(data.note_competences) || 0,
      parseFloat(data.note_eleves) || 0,
      parseFloat(data.note_collegues) || 0,
      parseFloat(data.note_ponctualite) || 0,
      parseFloat(data.note_reglement) || 0,
      data.points_forts || '',
      data.axes_amelioration || '',
      data.objectifs || '',
      data.commentaire || '',
      user,
      now,
      generateHash(id + data.id_personnel + now.getTime())
    ];

    sheet.appendRow(rowData);

    // Mettre à jour note dans Personnel
    updatePersonnelEvaluation(data.id_personnel, noteGlobale, new Date(data.date_evaluation));

    logActionV6('EVALUATION_AJOUT', { id: id, personnel: data.nom_personnel, note: noteGlobale });

    return { success: true, message: '✅ Évaluation enregistrée !', id: id, note: noteGlobale };

  } catch (error) {
    Logger.log('❌ Erreur évaluation: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Met à jour la dernière évaluation dans Personnel
 */
function updatePersonnelEvaluation(personnelId, note, date) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var data = sheet.getDataRange().getValues();
    var col = CONFIG_PERSONNEL_V6.col;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === personnelId) {
        var row = i + 1;
        sheet.getRange(row, col.Note_Evaluation_Derniere).setValue(note);
        sheet.getRange(row, col.Date_Derniere_Evaluation).setValue(date);
        break;
      }
    }
  } catch (e) {
    Logger.log('⚠️ Erreur update évaluation: ' + e);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 STATISTIQUES FEUILLES SECONDAIRES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Récupère statistiques affectations
 */
function getAffectationsStats() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.affectations);
    var data = sheet.getDataRange().getValues();

    var stats = {
      total: 0,
      actives: 0,
      suspendues: 0,
      terminees: 0,
      annulees: 0,
      parMatiere: {},
      totalHeures: 0
    };

    for (var i = 3; i < data.length; i++) {
      if (!data[i][0]) continue;

      stats.total++;
      var statut = data[i][9];
      var matiere = data[i][3];
      var heures = parseFloat(data[i][6]) || 0;

      if (statut === '✅ Active') stats.actives++;
      else if (statut === '⏸️ Suspendue') stats.suspendues++;
      else if (statut === '🔚 Terminée') stats.terminees++;
      else if (statut === '❌ Annulée') stats.annulees++;

      if (matiere) {
        stats.parMatiere[matiere] = (stats.parMatiere[matiere] || 0) + 1;
      }

      if (statut === '✅ Active') {
        stats.totalHeures += heures;
      }
    }

    return stats;

  } catch (e) {
    Logger.log('❌ Erreur stats affectations: ' + e);
    return null;
  }
}

/**
 * Récupère statistiques absences
 */
function getAbsencesStats() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.absences);
    var data = sheet.getDataRange().getValues();

    var stats = {
      total: 0,
      justifiees: 0,
      nonJustifiees: 0,
      enAttente: 0,
      retards: 0,
      absences: 0,
      congesMaladie: 0,
      congesAutorises: 0,
      avecSanction: 0
    };

    for (var i = 3; i < data.length; i++) {
      if (!data[i][0]) continue;

      stats.total++;
      var type = data[i][4];
      var justifiee = data[i][7];
      var sanction = data[i][9];

      if (justifiee === '✅ Oui') stats.justifiees++;
      else if (justifiee === '❌ Non') stats.nonJustifiees++;
      else if (justifiee === '⏳ En Attente') stats.enAttente++;

      if (type === '⏰ Retard') stats.retards++;
      else if (type === '❌ Absence') stats.absences++;
      else if (type === '🏥 Congé Maladie') stats.congesMaladie++;
      else if (type === '🏖️ Congé Autorisé') stats.congesAutorises++;

      if (sanction && sanction.length > 0) stats.avecSanction++;
    }

    return stats;

  } catch (e) {
    Logger.log('❌ Erreur stats absences: ' + e);
    return null;
  }
}

/**
 * Récupère statistiques évaluations
 */
function getEvaluationsStats() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.evaluations);
    var data = sheet.getDataRange().getValues();

    var stats = {
      total: 0,
      noteMoyenne: 0,
      excellent: 0,
      bien: 0,
      moyen: 0,
      insuffisant: 0,
      parPeriode: {}
    };

    var totalNotes = 0;
    var countNotes = 0;

    for (var i = 3; i < data.length; i++) {
      if (!data[i][0]) continue;

      stats.total++;
      var note = parseFloat(data[i][5]);
      var periode = data[i][4];

      if (!isNaN(note)) {
        totalNotes += note;
        countNotes++;

        if (note >= 80) stats.excellent++;
        else if (note >= 60) stats.bien++;
        else if (note >= 40) stats.moyen++;
        else stats.insuffisant++;
      }

      if (periode) {
        stats.parPeriode[periode] = (stats.parPeriode[periode] || 0) + 1;
      }
    }

    stats.noteMoyenne = countNotes > 0 ? Math.round(totalNotes / countNotes * 10) / 10 : 0;

    return stats;

  } catch (e) {
    Logger.log('❌ Erreur stats évaluations: ' + e);
    return null;
  }
}
