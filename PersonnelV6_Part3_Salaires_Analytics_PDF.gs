/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MODULE GESTION DU PERSONNEL V6.0 ULTIMATE - PARTIE 3/3
 * SALAIRES, ANALYTICS RH, PDF ET UTILITAIRES CRUD
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @description Gestion salaires, analytics, PDF et fonctions CRUD
 * @version 6.0.0 - OPTIMISÉ
 * @date 2025-01-23
 * @author WARAP Education Team
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// 💵 FEUILLE SALAIRES PERSONNEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise la feuille Salaires Personnel
 */
function initSalairesSheet(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.salaires;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // En-tête principal
    sheet.getRange('A1:P1')
      .merge()
      .setValue('💵 SALAIRES PERSONNEL - GESTION PAIE MENSUELLE')
      .setBackground('#22c55e')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(16)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.setRowHeight(1, 60);

    // Headers colonnes
    var headers = [
      '🆔 ID Paie',
      '👤 ID Personnel',
      '👤 Nom Personnel',
      '📅 Mois',
      '📅 Année',
      '💰 Salaire Base',
      '💰 Primes',
      '💰 Indemnités',
      '💰 Heures Sup',
      '💰 Total Brut',
      '💰 CNPS (4.25%)',
      '💰 IRPP',
      '💰 Autres Retenues',
      '💰 Total Net',
      '✅ Statut Paiement',
      '📅 Date Paiement',
      '📝 Commentaire',
      '👤 Créé Par',
      '📅 Créé Le',
      '🔐 Hash'
    ];

    sheet.getRange(3, 1, 1, headers.length)
      .setValues([headers])
      .setBackground('#22c55e')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center')
      .setWrap(true);

    sheet.setRowHeight(3, 50);

    // Largeurs colonnes
    var widths = [150, 150, 200, 100, 100, 140, 140, 140, 140, 140, 140, 140, 140, 140, 140, 120, 250, 150, 150, 120];
    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }

    // Figer
    sheet.setFrozenRows(3);
    sheet.setFrozenColumns(3);

    // Statistiques (ligne 2)
    sheet.getRange('A2').setValue('📊 STATISTIQUES:');
    sheet.getRange('B2').setFormula('=CONCATENATE("Fiches Paie: ",IFERROR(COUNTIF(A:A,">A3")-1,0)," | Masse Totale: ",IFERROR(TEXT(SUM(N:N),"#,##0"),0)," XAF | Payées: ",IFERROR(COUNTIF(O:O,"✅ Payé"),0))');
    sheet.getRange('A2:B2').setFontWeight('bold').setBackground('#d1fae5');

    // Validations
    applySalairesValidations(sheet);

    // Formules auto
    applySalairesFormulas(sheet);

    // Couleur onglet
    sheet.setTabColor('#22c55e');

    Logger.log('✅ Feuille Salaires créée');
  }

  return sheet;
}

/**
 * Applique les validations pour Salaires
 */
function applySalairesValidations(sheet) {
  var lastRow = 2000;

  // Validation Statut Paiement
  var statutsPaiement = ['✅ Payé', '⏳ En Attente', '❌ Rejeté', '⏸️ Suspendu'];
  sheet.getRange(4, 15, lastRow, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(statutsPaiement, true)
      .setAllowInvalid(false)
      .build());

  // Formats montants XAF
  var formatXAF = '#,##0 "XAF"';
  for (var col = 6; col <= 14; col++) {
    sheet.getRange(4, col, lastRow, 1).setNumberFormat(formatXAF);
  }

  // Formats dates
  sheet.getRange(4, 16, lastRow, 1).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(4, 19, lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');
}

/**
 * Applique formules auto calcul salaires
 */
function applySalairesFormulas(sheet) {
  // Total Brut = Base + Primes + Indemnités + Heures Sup
  sheet.getRange(4, 10).setFormula('=IF(F4>0,F4+G4+H4+I4,0)');

  // CNPS 4.25% du brut
  sheet.getRange(4, 11).setFormula('=IF(J4>0,ROUND(J4*0.0425,0),0)');

  // IRPP (simplifié - à adapter selon barème)
  sheet.getRange(4, 12).setFormula('=IF(J4>0,ROUND(J4*0.10,0),0)');

  // Total Net = Brut - CNPS - IRPP - Autres Retenues
  sheet.getRange(4, 14).setFormula('=IF(J4>0,J4-K4-L4-M4,0)');
}

/**
 * Génère fiche de paie
 */
function genererFichePaie(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.salaires);
    var user = Session.getActiveUser().getEmail();
    var now = new Date();

    if (!data.id_personnel || !data.mois || !data.annee) {
      throw new Error('Personnel, mois et année obligatoires');
    }

    // Vérifier si fiche existe déjà
    var existing = rechercherFichePaie(data.id_personnel, data.mois, data.annee);
    if (existing) {
      return { success: false, message: '❌ Fiche de paie existe déjà pour cette période !' };
    }

    // Générer ID
    var id = generateUniqueID('PAIE');

    // Récupérer données personnel
    var personnelData = getPersonnelDetailsV6(data.id_personnel);
    if (!personnelData.success) {
      throw new Error('Personnel introuvable');
    }

    var pers = personnelData.data;

    // Calculs
    var salaireBase = parseFloat(data.salaire_base) || parseFloat(pers.salaire_base) || 0;
    var primes = parseFloat(data.primes) || parseFloat(pers.primes_mensuelles) || 0;
    var indemnites = parseFloat(data.indemnites) || parseFloat(pers.indemnites) || 0;
    var heuresSup = parseFloat(data.heures_sup) || 0;

    // Ligne de données (formules calculeront le reste)
    var rowData = [
      id,
      data.id_personnel,
      pers.nom_complet,
      data.mois,
      data.annee,
      salaireBase,
      primes,
      indemnites,
      heuresSup,
      '', // Total Brut - formule
      '', // CNPS - formule
      '', // IRPP - formule
      parseFloat(data.autres_retenues) || 0,
      '', // Total Net - formule
      '⏳ En Attente',
      '',
      data.commentaire || '',
      user,
      now,
      generateHash(id + data.id_personnel + now.getTime())
    ];

    sheet.appendRow(rowData);

    logActionV6('PAIE_GENERATION', { id: id, personnel: pers.nom_complet, mois: data.mois, annee: data.annee });

    return { success: true, message: '✅ Fiche de paie générée !', id: id };

  } catch (error) {
    Logger.log('❌ Erreur génération paie: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Recherche fiche de paie existante
 */
function rechercherFichePaie(personnelId, mois, annee) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.salaires);
    var data = sheet.getDataRange().getValues();

    for (var i = 3; i < data.length; i++) {
      if (data[i][1] === personnelId && data[i][3] === mois && data[i][4] === annee) {
        return data[i][0]; // Retourne ID
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📈 FEUILLE ANALYTICS RH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialise la feuille Analytics RH
 */
function initAnalyticsRHSheet(ss) {
  var sheetName = CONFIG_PERSONNEL_V6.sheets.analytics;
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    // En-tête principal
    sheet.getRange('A1:T1')
      .merge()
      .setValue('📈 ANALYTICS RH - TABLEAUX DE BORD DÉCISIONNELS')
      .setBackground('#8b5cf6')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold')
      .setFontSize(18)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    sheet.setRowHeight(1, 80);

    var colors = CONFIG_PERSONNEL_V6.colors;

    // Section 1: KPIs
    sheet.getRange('A3:T3')
      .merge()
      .setValue('📊 INDICATEURS CLÉS RH')
      .setBackground(colors.gray[800])
      .setFontColor('#FFFFFF')
      .setFontSize(14)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // Turnover
    sheet.getRange('A5:C5').merge().setValue('📉 TAUX DE TURNOVER (%)');
    sheet.getRange('A6:C6').merge().setFormula('="0%"')
      .setBackground('#fef3c7').setFontWeight('bold').setFontSize(24).setHorizontalAlignment('center');

    // Taux d'absentéisme
    sheet.getRange('E5:G5').merge().setValue('❌ TAUX D\'ABSENTÉISME (%)');
    sheet.getRange('E6:G6').merge().setFormula('="0%"')
      .setBackground('#fee2e2').setFontWeight('bold').setFontSize(24).setHorizontalAlignment('center');

    // Satisfaction moyenne
    sheet.getRange('I5:K5').merge().setValue('😊 NOTE SATISFACTION MOYENNE');
    sheet.getRange('I6:K6').merge().setFormula('="0/100"')
      .setBackground('#d1fae5').setFontWeight('bold').setFontSize(24).setHorizontalAlignment('center');

    // Coût moyen recrutement
    sheet.getRange('M5:O5').merge().setValue('💰 COÛT MOYEN RECRUTEMENT');
    sheet.getRange('M6:O6').merge().setValue('0 XAF')
      .setBackground('#dbeafe').setFontWeight('bold').setFontSize(24).setHorizontalAlignment('center');

    // Section 2: Pyramide des âges
    var rowAge = 9;
    sheet.getRange('A' + rowAge + ':J' + rowAge)
      .merge()
      .setValue('👥 PYRAMIDE DES ÂGES')
      .setBackground(colors.gray[800])
      .setFontColor('#FFFFFF')
      .setFontSize(14)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    rowAge += 2;
    sheet.getRange('A' + rowAge + ':C' + rowAge).setValues([['📅 Tranche d\'âge', '👥 Nombre', '📊 %']])
      .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

    var tranches = ['< 25 ans', '25-34 ans', '35-44 ans', '45-54 ans', '55+ ans'];
    rowAge++;
    tranches.forEach(function(tranche) {
      sheet.getRange(rowAge, 1).setValue(tranche);
      sheet.getRange(rowAge, 2).setValue(0); // À calculer dynamiquement
      sheet.getRange(rowAge, 3).setValue('0%');
      rowAge++;
    });

    // Section 3: Distribution géographique
    var rowGeo = 9;
    sheet.getRange('L' + rowGeo + ':T' + rowGeo)
      .merge()
      .setValue('🗺️ DISTRIBUTION GÉOGRAPHIQUE')
      .setBackground(colors.gray[800])
      .setFontColor('#FFFFFF')
      .setFontSize(14)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    rowGeo += 2;
    sheet.getRange('L' + rowGeo + ':N' + rowGeo).setValues([['🏙️ Ville', '👥 Nombre', '📊 %']])
      .setBackground(colors.gray[200]).setFontWeight('bold').setHorizontalAlignment('center');

    // Section 4: Évolution effectifs
    var rowEvol = rowAge + 3;
    sheet.getRange('A' + rowEvol + ':T' + rowEvol)
      .merge()
      .setValue('📈 ÉVOLUTION EFFECTIFS (12 DERNIERS MOIS)')
      .setBackground(colors.gray[800])
      .setFontColor('#FFFFFF')
      .setFontSize(14)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // Couleur onglet
    sheet.setTabColor('#8b5cf6');

    Logger.log('✅ Feuille Analytics RH créée');
  }

  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════════
// ➕ CRUD PERSONNEL COMPLET
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Ajoute un nouveau membre du personnel
 */
function ajouterPersonnelV6(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var col = CONFIG_PERSONNEL_V6.col;
    var user = Session.getActiveUser().getEmail();
    var now = new Date();

    // Validation
    if (!data.nom || !data.prenom) {
      throw new Error('Nom et prénom obligatoires');
    }

    if (!data.type_personnel) {
      throw new Error('Type de personnel obligatoire');
    }

    // Générer ID et Matricule
    var id = generateUniqueID('PER');
    var matricule = generateMatriculePersonnelV6();

    // Calculer salaire net
    var salaireBase = parseFloat(data.salaire_base) || 0;
    var primes = parseFloat(data.primes_mensuelles) || 0;
    var indemnites = parseFloat(data.indemnites) || 0;
    var charges = calculerChargesSociales(salaireBase);

    // Préparer données (60 colonnes)
    var rowData = new Array(60).fill('');

    rowData[col.ID_Personnel - 1] = id;
    rowData[col.Matricule - 1] = matricule;
    rowData[col.Nom - 1] = data.nom || '';
    rowData[col.Prenom - 1] = data.prenom || '';
    // Nom_Complet = formule auto
    rowData[col.Date_Naissance - 1] = data.date_naissance ? new Date(data.date_naissance) : '';
    rowData[col.Lieu_Naissance - 1] = data.lieu_naissance || '';
    rowData[col.Sexe - 1] = data.sexe || '';
    rowData[col.Nationalite - 1] = data.nationalite || 'Camerounaise';
    rowData[col.Numero_CNI - 1] = data.numero_cni || '';
    rowData[col.Email - 1] = data.email || '';
    rowData[col.Telephone - 1] = data.telephone || '';
    rowData[col.Telephone_2 - 1] = data.telephone_2 || '';
    rowData[col.Adresse - 1] = data.adresse || '';
    rowData[col.Ville - 1] = data.ville || '';
    rowData[col.Quartier - 1] = data.quartier || '';
    rowData[col.Type_Personnel - 1] = data.type_personnel;
    rowData[col.Fonction - 1] = data.fonction || '';
    rowData[col.Diplome_Superieur - 1] = data.diplome_superieur || '';
    rowData[col.Niveau_Etudes - 1] = data.niveau_etudes || '';
    rowData[col.Specialite_Enseignement - 1] = data.specialite_enseignement || '';
    rowData[col.Matieres_Enseignees - 1] = data.matieres_enseignees || '';
    rowData[col.Date_Embauche - 1] = data.date_embauche ? new Date(data.date_embauche) : now;
    rowData[col.Date_Fin_Contrat - 1] = data.date_fin_contrat ? new Date(data.date_fin_contrat) : '';
    rowData[col.Type_Contrat - 1] = data.type_contrat || '';
    rowData[col.Statut_Emploi - 1] = '✅ Actif';
    rowData[col.Grade - 1] = data.grade || '';
    rowData[col.Echelon - 1] = data.echelon || '';
    rowData[col.Salaire_Base - 1] = salaireBase;
    rowData[col.Primes_Mensuelles - 1] = primes;
    rowData[col.Indemnites - 1] = indemnites;
    rowData[col.Charges_Sociales - 1] = charges;
    // Salaire_Net = formule auto
    rowData[col.Numero_Compte_Bancaire - 1] = data.numero_compte_bancaire || '';
    rowData[col.Banque - 1] = data.banque || '';
    rowData[col.Personne_A_Contacter - 1] = data.personne_a_contacter || '';
    rowData[col.Telephone_Urgence - 1] = data.telephone_urgence || '';
    rowData[col.Numero_CNPS - 1] = data.numero_cnps || '';
    rowData[col.Numero_Contribuable - 1] = data.numero_contribuable || '';
    rowData[col.Photo_URL - 1] = data.photo_url || '';
    rowData[col.Badge_ID_URL - 1] = '';
    rowData[col.Classes_En_Charge_IDs - 1] = '';
    rowData[col.Classes_En_Charge - 1] = '';
    rowData[col.Professeur_Principal_De_ID - 1] = '';
    rowData[col.Professeur_Principal_De - 1] = '';
    rowData[col.Nombre_Heures_Semaine - 1] = 0;
    // Taux_Charge = formule auto
    rowData[col.Note_Evaluation_Derniere - 1] = '';
    rowData[col.Date_Derniere_Evaluation - 1] = '';
    rowData[col.Distinctions - 1] = '';
    rowData[col.Nombre_Absences - 1] = 0;
    rowData[col.Nombre_Retards - 1] = 0;
    rowData[col.Tags - 1] = data.tags || '';
    rowData[col.Notes_Internes - 1] = data.notes_internes || '';
    rowData[col.Alertes - 1] = '';
    rowData[col.Cree_Par - 1] = user;
    rowData[col.Date_Creation - 1] = now;
    rowData[col.Modifie_Par - 1] = '';
    rowData[col.Date_Modification - 1] = '';
    rowData[col.Hash_Integrite - 1] = generateHash(id + matricule + now.getTime());

    // Ajouter
    sheet.appendRow(rowData);

    // Log
    logActionV6('PERSONNEL_AJOUT', { id: id, matricule: matricule, nom: data.nom + ' ' + data.prenom });

    // Rafraîchir dashboard
    rafraichirDashboardPersonnel();

    return {
      success: true,
      message: '✅ Personnel ajouté avec succès !',
      data: { id: id, matricule: matricule }
    };

  } catch (error) {
    Logger.log('❌ Erreur ajout: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Génère un matricule unique (format: PE25XXXXX)
 */
function generateMatriculePersonnelV6() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
  var col = CONFIG_PERSONNEL_V6.col;
  var year = new Date().getFullYear().toString().substr(-2);

  if (sheet.getLastRow() < 2) {
    return 'PE' + year + '00001';
  }

  var data = sheet.getRange(2, col.Matricule, sheet.getLastRow() - 1, 1).getValues();
  var maxSeq = 0;

  for (var i = 0; i < data.length; i++) {
    var mat = data[i][0];
    if (mat && mat.toString().startsWith('PE' + year)) {
      var seq = parseInt(mat.toString().substr(-5));
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }

  return 'PE' + year + (maxSeq + 1).toString().padStart(5, '0');
}

/**
 * Calcule les charges sociales (CNPS 4.25%)
 */
function calculerChargesSociales(salaireBase) {
  var tauxCNPS = CONFIG_PERSONNEL_V6.salaire.tauxCNPS;
  return Math.round(salaireBase * tauxCNPS);
}

/**
 * Modifie un personnel existant
 */
function modifierPersonnelV6(personnelId, data) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var col = CONFIG_PERSONNEL_V6.col;
    var allData = sheet.getDataRange().getValues();
    var user = Session.getActiveUser().getEmail();
    var now = new Date();

    // Trouver la ligne
    var rowIndex = -1;
    for (var i = 1; i < allData.length; i++) {
      if (allData[i][col.ID_Personnel - 1] === personnelId) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error('Personnel non trouvé');
    }

    // Mettre à jour les champs fournis
    if (data.nom) sheet.getRange(rowIndex, col.Nom).setValue(data.nom);
    if (data.prenom) sheet.getRange(rowIndex, col.Prenom).setValue(data.prenom);
    if (data.sexe) sheet.getRange(rowIndex, col.Sexe).setValue(data.sexe);
    if (data.date_naissance) sheet.getRange(rowIndex, col.Date_Naissance).setValue(new Date(data.date_naissance));
    if (data.lieu_naissance) sheet.getRange(rowIndex, col.Lieu_Naissance).setValue(data.lieu_naissance);
    if (data.nationalite) sheet.getRange(rowIndex, col.Nationalite).setValue(data.nationalite);
    if (data.numero_cni) sheet.getRange(rowIndex, col.Numero_CNI).setValue(data.numero_cni);
    if (data.email) sheet.getRange(rowIndex, col.Email).setValue(data.email);
    if (data.telephone) sheet.getRange(rowIndex, col.Telephone).setValue(data.telephone);
    if (data.telephone_2) sheet.getRange(rowIndex, col.Telephone_2).setValue(data.telephone_2);
    if (data.adresse) sheet.getRange(rowIndex, col.Adresse).setValue(data.adresse);
    if (data.ville) sheet.getRange(rowIndex, col.Ville).setValue(data.ville);
    if (data.quartier) sheet.getRange(rowIndex, col.Quartier).setValue(data.quartier);
    if (data.type_personnel) sheet.getRange(rowIndex, col.Type_Personnel).setValue(data.type_personnel);
    if (data.fonction) sheet.getRange(rowIndex, col.Fonction).setValue(data.fonction);
    if (data.diplome_superieur) sheet.getRange(rowIndex, col.Diplome_Superieur).setValue(data.diplome_superieur);
    if (data.niveau_etudes) sheet.getRange(rowIndex, col.Niveau_Etudes).setValue(data.niveau_etudes);
    if (data.specialite_enseignement) sheet.getRange(rowIndex, col.Specialite_Enseignement).setValue(data.specialite_enseignement);
    if (data.matieres_enseignees) sheet.getRange(rowIndex, col.Matieres_Enseignees).setValue(data.matieres_enseignees);
    if (data.date_embauche) sheet.getRange(rowIndex, col.Date_Embauche).setValue(new Date(data.date_embauche));
    if (data.date_fin_contrat) sheet.getRange(rowIndex, col.Date_Fin_Contrat).setValue(new Date(data.date_fin_contrat));
    if (data.type_contrat) sheet.getRange(rowIndex, col.Type_Contrat).setValue(data.type_contrat);
    if (data.statut_emploi) sheet.getRange(rowIndex, col.Statut_Emploi).setValue(data.statut_emploi);
    if (data.grade) sheet.getRange(rowIndex, col.Grade).setValue(data.grade);
    if (data.echelon) sheet.getRange(rowIndex, col.Echelon).setValue(data.echelon);

    // Salaires
    if (data.salaire_base) {
      sheet.getRange(rowIndex, col.Salaire_Base).setValue(parseFloat(data.salaire_base));
      sheet.getRange(rowIndex, col.Charges_Sociales).setValue(calculerChargesSociales(parseFloat(data.salaire_base)));
    }
    if (data.primes_mensuelles) sheet.getRange(rowIndex, col.Primes_Mensuelles).setValue(parseFloat(data.primes_mensuelles));
    if (data.indemnites) sheet.getRange(rowIndex, col.Indemnites).setValue(parseFloat(data.indemnites));

    // Bancaire
    if (data.numero_compte_bancaire) sheet.getRange(rowIndex, col.Numero_Compte_Bancaire).setValue(data.numero_compte_bancaire);
    if (data.banque) sheet.getRange(rowIndex, col.Banque).setValue(data.banque);
    if (data.personne_a_contacter) sheet.getRange(rowIndex, col.Personne_A_Contacter).setValue(data.personne_a_contacter);
    if (data.telephone_urgence) sheet.getRange(rowIndex, col.Telephone_Urgence).setValue(data.telephone_urgence);
    if (data.numero_cnps) sheet.getRange(rowIndex, col.Numero_CNPS).setValue(data.numero_cnps);
    if (data.numero_contribuable) sheet.getRange(rowIndex, col.Numero_Contribuable).setValue(data.numero_contribuable);

    // Divers
    if (data.photo_url) sheet.getRange(rowIndex, col.Photo_URL).setValue(data.photo_url);
    if (data.tags) sheet.getRange(rowIndex, col.Tags).setValue(data.tags);
    if (data.notes_internes) sheet.getRange(rowIndex, col.Notes_Internes).setValue(data.notes_internes);

    // Métadonnées modification
    sheet.getRange(rowIndex, col.Modifie_Par).setValue(user);
    sheet.getRange(rowIndex, col.Date_Modification).setValue(now);

    logActionV6('PERSONNEL_MODIFICATION', { id: personnelId });

    rafraichirDashboardPersonnel();

    return { success: true, message: '✅ Personnel modifié avec succès !' };

  } catch (error) {
    Logger.log('❌ Erreur modification: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Supprime un personnel (soft delete - change statut)
 */
function supprimerPersonnelV6(personnelId, hard) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var col = CONFIG_PERSONNEL_V6.col;
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (data[i][col.ID_Personnel - 1] === personnelId) {
        if (hard === true) {
          // Suppression définitive
          sheet.deleteRow(i + 1);
        } else {
          // Soft delete: changer statut
          sheet.getRange(i + 1, col.Statut_Emploi).setValue('❌ Licencié');
        }

        logActionV6('PERSONNEL_SUPPRESSION', { id: personnelId, hard: !!hard });
        rafraichirDashboardPersonnel();

        return { success: true, message: '✅ Personnel supprimé !' };
      }
    }

    throw new Error('Personnel non trouvé');

  } catch (error) {
    Logger.log('❌ Erreur suppression: ' + error);
    return { success: false, message: '❌ ' + error.message };
  }
}

/**
 * Recherche avancée multi-critères
 */
function rechercherPersonnelV6(criteres) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var col = CONFIG_PERSONNEL_V6.col;
    var lastRow = sheet.getLastRow();

    if (lastRow < 2) return [];

    var data = sheet.getRange(2, 1, lastRow - 1, 60).getValues();
    var resultats = [];

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      if (!row[col.ID_Personnel - 1]) continue;

      var match = true;

      // Filtre nom/prénom
      if (criteres.nom && match) {
        var nomComplet = (row[col.Nom - 1] + ' ' + row[col.Prenom - 1]).toLowerCase();
        match = nomComplet.indexOf(criteres.nom.toLowerCase()) > -1;
      }

      // Filtre matricule
      if (criteres.matricule && match) {
        match = row[col.Matricule - 1].toString().toLowerCase().indexOf(criteres.matricule.toLowerCase()) > -1;
      }

      // Filtre type
      if (criteres.type_personnel && match) {
        match = row[col.Type_Personnel - 1] === criteres.type_personnel;
      }

      // Filtre statut
      if (criteres.statut_emploi && match) {
        match = row[col.Statut_Emploi - 1] === criteres.statut_emploi;
      }

      // Filtre fonction
      if (criteres.fonction && match) {
        match = row[col.Fonction - 1].toString().toLowerCase().indexOf(criteres.fonction.toLowerCase()) > -1;
      }

      // Filtre matières
      if (criteres.matiere && match) {
        var matieres = row[col.Matieres_Enseignees - 1].toString().toLowerCase();
        match = matieres.indexOf(criteres.matiere.toLowerCase()) > -1;
      }

      if (match) {
        resultats.push({
          id: row[col.ID_Personnel - 1],
          matricule: row[col.Matricule - 1],
          nom: row[col.Nom - 1],
          prenom: row[col.Prenom - 1],
          nom_complet: row[col.Nom_Complet - 1],
          type_personnel: row[col.Type_Personnel - 1],
          fonction: row[col.Fonction - 1],
          statut_emploi: row[col.Statut_Emploi - 1],
          email: row[col.Email - 1],
          telephone: row[col.Telephone - 1],
          date_embauche: row[col.Date_Embauche - 1],
          salaire_net: row[col.Salaire_Net - 1],
          photo_url: row[col.Photo_URL - 1],
          matieres_enseignees: row[col.Matieres_Enseignees - 1]
        });
      }
    }

    return resultats;

  } catch (error) {
    Logger.log('❌ Erreur recherche: ' + error);
    return [];
  }
}

/**
 * Récupère détails complets
 */
function getPersonnelDetailsV6(id) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var col = CONFIG_PERSONNEL_V6.col;
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 60).getValues();

    for (var i = 0; i < data.length; i++) {
      if (data[i][col.ID_Personnel - 1] === id) {
        var row = data[i];

        return {
          success: true,
          data: {
            id: row[col.ID_Personnel - 1],
            matricule: row[col.Matricule - 1],
            nom: row[col.Nom - 1],
            prenom: row[col.Prenom - 1],
            nom_complet: row[col.Nom_Complet - 1],
            date_naissance: row[col.Date_Naissance - 1],
            lieu_naissance: row[col.Lieu_Naissance - 1],
            sexe: row[col.Sexe - 1],
            nationalite: row[col.Nationalite - 1],
            numero_cni: row[col.Numero_CNI - 1],
            email: row[col.Email - 1],
            telephone: row[col.Telephone - 1],
            telephone_2: row[col.Telephone_2 - 1],
            adresse: row[col.Adresse - 1],
            ville: row[col.Ville - 1],
            quartier: row[col.Quartier - 1],
            type_personnel: row[col.Type_Personnel - 1],
            fonction: row[col.Fonction - 1],
            diplome_superieur: row[col.Diplome_Superieur - 1],
            niveau_etudes: row[col.Niveau_Etudes - 1],
            specialite_enseignement: row[col.Specialite_Enseignement - 1],
            matieres_enseignees: row[col.Matieres_Enseignees - 1],
            date_embauche: row[col.Date_Embauche - 1],
            date_fin_contrat: row[col.Date_Fin_Contrat - 1],
            type_contrat: row[col.Type_Contrat - 1],
            statut_emploi: row[col.Statut_Emploi - 1],
            grade: row[col.Grade - 1],
            echelon: row[col.Echelon - 1],
            salaire_base: row[col.Salaire_Base - 1],
            primes_mensuelles: row[col.Primes_Mensuelles - 1],
            indemnites: row[col.Indemnites - 1],
            charges_sociales: row[col.Charges_Sociales - 1],
            salaire_net: row[col.Salaire_Net - 1],
            numero_compte_bancaire: row[col.Numero_Compte_Bancaire - 1],
            banque: row[col.Banque - 1],
            personne_a_contacter: row[col.Personne_A_Contacter - 1],
            telephone_urgence: row[col.Telephone_Urgence - 1],
            numero_cnps: row[col.Numero_CNPS - 1],
            numero_contribuable: row[col.Numero_Contribuable - 1],
            photo_url: row[col.Photo_URL - 1],
            badge_id_url: row[col.Badge_ID_URL - 1],
            classes_en_charge: row[col.Classes_En_Charge - 1],
            professeur_principal_de: row[col.Professeur_Principal_De - 1],
            nombre_heures_semaine: row[col.Nombre_Heures_Semaine - 1],
            taux_charge: row[col.Taux_Charge - 1],
            note_evaluation_derniere: row[col.Note_Evaluation_Derniere - 1],
            date_derniere_evaluation: row[col.Date_Derniere_Evaluation - 1],
            distinctions: row[col.Distinctions - 1],
            nombre_absences: row[col.Nombre_Absences - 1],
            nombre_retards: row[col.Nombre_Retards - 1],
            tags: row[col.Tags - 1],
            notes_internes: row[col.Notes_Internes - 1],
            alertes: row[col.Alertes - 1]
          }
        };
      }
    }

    return { success: false, message: 'Personnel non trouvé' };

  } catch (error) {
    Logger.log('❌ Erreur détails: ' + error);
    return { success: false, message: error.message };
  }
}

/**
 * Génère statistiques complètes
 */
function getPersonnelStatisticsV6() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG_PERSONNEL_V6.sheets.personnel);
    var col = CONFIG_PERSONNEL_V6.col;
    var data = sheet.getRange(2, 1, Math.max(1, sheet.getLastRow() - 1), 60).getValues();

    var stats = {
      total: 0,
      actifs: 0,
      enseignants: 0,
      administration: 0,
      parType: {},
      parStatut: {},
      parContrat: {},
      parSexe: { masculin: 0, feminin: 0 },
      masseSalariale: 0,
      moyenneSalaire: 0,
      anciennete: { moinsUn: 0, unATrois: 0, troisACinq: 0, plusCinq: 0 },
      parVille: {},
      parGrade: {},
      evaluations: { moyenne: 0, total: 0 }
    };

    var now = new Date();
    var totalSalaires = 0;
    var totalEvaluations = 0;
    var sommeEvaluations = 0;

    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      if (!row[col.ID_Personnel - 1]) continue;

      stats.total++;

      var statut = row[col.Statut_Emploi - 1];
      if (statut === '✅ Actif') stats.actifs++;
      stats.parStatut[statut] = (stats.parStatut[statut] || 0) + 1;

      var type = row[col.Type_Personnel - 1];
      if (type) {
        stats.parType[type] = (stats.parType[type] || 0) + 1;
        if (type.indexOf('Enseignant') > -1) stats.enseignants++;
        else stats.administration++;
      }

      var contrat = row[col.Type_Contrat - 1];
      if (contrat) stats.parContrat[contrat] = (stats.parContrat[contrat] || 0) + 1;

      var sexe = row[col.Sexe - 1];
      if (sexe === 'Masculin') stats.parSexe.masculin++;
      else if (sexe === 'Féminin') stats.parSexe.feminin++;

      var salaireNet = parseFloat(row[col.Salaire_Net - 1]) || 0;
      if (salaireNet > 0 && statut === '✅ Actif') {
        totalSalaires += salaireNet;
      }

      var dateEmbauche = row[col.Date_Embauche - 1];
      if (dateEmbauche) {
        var years = (now - new Date(dateEmbauche)) / (1000 * 60 * 60 * 24 * 365);
        if (years < 1) stats.anciennete.moinsUn++;
        else if (years < 3) stats.anciennete.unATrois++;
        else if (years < 5) stats.anciennete.troisACinq++;
        else stats.anciennete.plusCinq++;
      }

      var ville = row[col.Ville - 1];
      if (ville) stats.parVille[ville] = (stats.parVille[ville] || 0) + 1;

      var grade = row[col.Grade - 1];
      if (grade) stats.parGrade[grade] = (stats.parGrade[grade] || 0) + 1;

      var noteEval = parseFloat(row[col.Note_Evaluation_Derniere - 1]);
      if (!isNaN(noteEval) && noteEval > 0) {
        sommeEvaluations += noteEval;
        totalEvaluations++;
      }
    }

    stats.masseSalariale = totalSalaires;
    stats.moyenneSalaire = stats.actifs > 0 ? Math.round(totalSalaires / stats.actifs) : 0;
    stats.evaluations.moyenne = totalEvaluations > 0 ? Math.round(sommeEvaluations / totalEvaluations * 100) / 100 : 0;
    stats.evaluations.total = totalEvaluations;

    return stats;

  } catch (error) {
    Logger.log('❌ Erreur stats: ' + error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📄 GÉNÉRATION BADGE PDF (simplifié)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Génère badge personnel
 */
function genererBadgePersonnel(personnelId) {
  try {
    var details = getPersonnelDetailsV6(personnelId);
    if (!details.success) return null;

    var data = details.data;

    // Template HTML badge (version simplifiée)
    var html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; margin: 0; padding: 20px; }
            .badge { width: 350px; height: 500px; border: 3px solid #1e40af; border-radius: 15px; padding: 20px; text-align: center; }
            .header { background: #1e40af; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 12px 12px 0 0; }
            .photo { width: 150px; height: 150px; border-radius: 50%; border: 4px solid #1e40af; margin: 20px auto; background: #eee; line-height: 150px; }
            .matricule { font-size: 24px; font-weight: bold; color: #1e40af; margin: 20px 0; }
            .nom { font-size: 20px; font-weight: bold; margin: 10px 0; }
            .fonction { font-size: 16px; color: #666; }
            .info { margin: 15px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="badge">
            <div class="header">
              <h2>🎓 WARAP ÉCOLE</h2>
              <p>BADGE PERSONNEL</p>
            </div>
            <div class="photo">PHOTO</div>
            <div class="matricule">${data.matricule}</div>
            <div class="nom">${data.nom_complet}</div>
            <div class="fonction">${data.fonction || data.type_personnel}</div>
            <div class="info">
              <p>📞 ${data.telephone || 'N/A'}</p>
              <p>📧 ${data.email || 'N/A'}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Retourner URL data (à implémenter avec service PDF réel)
    var badgeUrl = 'data:text/html;base64,' + Utilities.base64Encode(html);

    return badgeUrl;

  } catch (error) {
    Logger.log('❌ Erreur badge: ' + error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 UI - INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Crée le menu personnalisé
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('👨‍🏫 PERSONNEL V6.0')
    .addItem('🚀 Initialiser Système', 'initPersonnelSystemV6')
    .addSeparator()
    .addItem('➕ Ajouter Personnel', 'showAjouterPersonnelDialog')
    .addItem('🔍 Rechercher', 'showRechercherPersonnelDialog')
    .addItem('📊 Voir Dashboard', 'goToDashboard')
    .addSeparator()
    .addItem('📌 Gérer Affectations', 'showAffectationsDialog')
    .addItem('❌ Enregistrer Absence', 'showAbsenceDialog')
    .addItem('⭐ Nouvelle Évaluation', 'showEvaluationDialog')
    .addItem('💵 Générer Fiche Paie', 'showFichePaieDialog')
    .addSeparator()
    .addItem('📈 Statistiques RH', 'showStatistiquesRH')
    .addToUi();
}

/**
 * Navigation vers Dashboard
 */
function goToDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dashboard = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.dashboard);
  if (dashboard) {
    ss.setActiveSheet(dashboard);
  }
}

/**
 * Affiche statistiques RH dans popup
 */
function showStatistiquesRH() {
  var stats = getPersonnelStatisticsV6();
  if (!stats) {
    SpreadsheetApp.getUi().alert('❌ Erreur', 'Impossible de récupérer les statistiques', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }

  var message = '📊 STATISTIQUES RH\n\n' +
    '👥 Total Personnel: ' + stats.total + '\n' +
    '✅ Actifs: ' + stats.actifs + '\n' +
    '👨‍🏫 Enseignants: ' + stats.enseignants + '\n' +
    '💼 Administration: ' + stats.administration + '\n\n' +
    '💰 Masse Salariale: ' + stats.masseSalariale.toLocaleString() + ' XAF\n' +
    '📊 Salaire Moyen: ' + stats.moyenneSalaire.toLocaleString() + ' XAF\n\n' +
    '⭐ Évaluations: ' + stats.evaluations.total + ' | Moyenne: ' + stats.evaluations.moyenne + '/100';

  SpreadsheetApp.getUi().alert('📈 Statistiques RH', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

// Stubs pour dialogs (à implémenter avec HtmlService)
function showAjouterPersonnelDialog() {
  SpreadsheetApp.getUi().alert('Interface à implémenter', 'Utilisez ajouterPersonnelV6(data) via script', SpreadsheetApp.getUi().ButtonSet.OK);
}

function showRechercherPersonnelDialog() {
  SpreadsheetApp.getUi().alert('Interface à implémenter', 'Utilisez rechercherPersonnelV6(criteres) via script', SpreadsheetApp.getUi().ButtonSet.OK);
}

function showAffectationsDialog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.affectations);
  if (sheet) ss.setActiveSheet(sheet);
}

function showAbsenceDialog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.absences);
  if (sheet) ss.setActiveSheet(sheet);
}

function showEvaluationDialog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.evaluations);
  if (sheet) ss.setActiveSheet(sheet);
}

function showFichePaieDialog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_PERSONNEL_V6.sheets.salaires);
  if (sheet) ss.setActiveSheet(sheet);
}
