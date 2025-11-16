/**
 * ========================================================================
 * CRÉATION DE TOUTES LES FEUILLES DES MODULES
 * ========================================================================
 * Ce fichier contient toutes les fonctions de création de feuilles
 * pour accélérer le développement et maintenir la cohérence
 * ========================================================================
 */

/**
 * Créer la feuille OUVRAGE
 */
function createOuvrageSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.OUVRAGE);
  sheet.clear();

  // En-tête
  sheet.getRange('A1:O1').merge().setValue('🏗️ GESTION DES OUVRAGES TOPOGRAPHIQUES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  // Indicateurs
  const indicators = [
    ['📊 INDICATEURS', '', '', ''],
    ['Total Ouvrages:', '=COUNTA(A6:A)-1', 'Ouvrages Actifs:', '=NB.SI(F6:F;"En Cours")']
  ];
  sheet.getRange(3, 1, 2, 4).setValues(indicators);

  // En-têtes colonnes
  const headers = ['ID Ouvrage', 'ID Projet', 'Nom Ouvrage', 'Type Ouvrage', 'Description', 'Statut',
                   'Responsable', 'Date Début', 'Date Fin', 'Durée (jours)', 'Nb Tâches', '% Avancement',
                   'Coût Estimé', 'Coût Réel', 'Écart'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  // Formules ligne 6
  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('J6').setFormula('=SI(ET(COUNTA(H6:I6)=2);I6-H6;"")');
  sheet.getRange('K6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.TACHE + '!B:B;A6))');
  sheet.getRange('L6').setFormula('=SI(K6>0;NB.SI.ENS(' + CONFIG.SHEETS.TACHE + '!G:G;"Terminée";' + CONFIG.SHEETS.TACHE + '!B:B;A6)/K6;"")');
  sheet.getRange('N6').setFormula('=SI(COUNTA(M6:M6)=0;"";SOMME.SI(' + CONFIG.SHEETS.TACHE + '!B:B;A6;' + CONFIG.SHEETS.TACHE + '!O:O))');
  sheet.getRange('O6').setFormula('=SI(COUNTA(M6:M6)=0;"";M6-N6)');

  // Formats
  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('B6:B1000').setNumberFormat('0');
  sheet.getRange('H6:I1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('J6:J1000').setNumberFormat('#,##0');
  sheet.getRange('K6:K1000').setNumberFormat('#,##0');
  sheet.getRange('L6:L1000').setNumberFormat('0.0%');
  sheet.getRange('M6:O1000').setNumberFormat('#,##0.00 "FCFA"');

  // Validation statut
  const statutRule = createListValidation(CONFIG.STATUTS.OUVRAGE);
  sheet.getRange('F6:F1000').setDataValidation(statutRule);

  // Validation type ouvrage
  const typeRule = createListValidation(CONFIG.TYPES_OUVRAGE);
  sheet.getRange('D6:D1000').setDataValidation(typeRule);

  // Largeurs colonnes
  [80,80,250,180,300,130,180,110,110,100,90,110,140,140,140].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  sheet.setFrozenColumns(1);
  logAction("Création", "Feuille Ouvrages créée");
}

/**
 * Créer la feuille TACHE
 */
function createTacheSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.TACHE);
  sheet.clear();

  // En-tête
  sheet.getRange('A1:O1').merge().setValue('✓ GESTION DES TÂCHES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  // Indicateurs
  const indicators = [
    ['📊 INDICATEURS', '', '', ''],
    ['Total Tâches:', '=COUNTA(A6:A)-1', 'En Cours:', '=NB.SI(H6:H;"En Cours")']
  ];
  sheet.getRange(3, 1, 2, 4).setValues(indicators);

  // En-têtes
  const headers = ['ID Tâche', 'ID Ouvrage', 'ID Équipe', 'ID Matériel', 'Description', 'Date Début',
                   'Date Fin', 'Statut', 'Priorité', 'Durée (jours)', '% Avancement', 'Responsable',
                   'Observations', 'Coût Estimé', 'Coût Réel'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  // Formules
  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('J6').setFormula('=SI(ET(COUNTA(F6:G6)=2);G6-F6;"")');

  // Formats
  sheet.getRange('A6:D1000').setNumberFormat('0');
  sheet.getRange('F6:G1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('J6:J1000').setNumberFormat('#,##0');
  sheet.getRange('K6:K1000').setNumberFormat('0.0%');
  sheet.getRange('N6:O1000').setNumberFormat('#,##0.00 "FCFA"');

  // Validations
  sheet.getRange('H6:H1000').setDataValidation(createListValidation(CONFIG.STATUTS.TACHE));
  sheet.getRange('I6:I1000').setDataValidation(createListValidation(CONFIG.PRIORITES));

  [80,90,90,90,300,110,110,130,110,100,110,180,250,140,140].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Tâches créée");
}

/**
 * Créer la feuille RELEVE
 */
function createReleveSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.RELEVE);
  sheet.clear();

  // En-tête
  sheet.getRange('A1:N1').merge().setValue('📍 RELEVÉS TOPOGRAPHIQUES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  // Indicateurs
  const indicators = [
    ['📊 INDICATEURS', '', '', ''],
    ['Total Relevés:', '=COUNTA(A6:A)-1', 'Validés:', '=NB.SI(J6:J;VRAI)']
  ];
  sheet.getRange(3, 1, 2, 4).setValues(indicators);

  // En-têtes
  const headers = ['ID Relevé', 'ID Tâche', 'ID Employé', 'Date Relevé', 'Coordonnée X', 'Coordonnée Y',
                   'Coordonnée Z', 'Type Relevé', 'Observations', 'Validé', 'Précision (m)', 'Équipement',
                   'Conditions Météo', 'Photo/Document'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  // Formules
  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  // Formats
  sheet.getRange('A6:C1000').setNumberFormat('0');
  sheet.getRange('D6:D1000').setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange('E6:G1000').setNumberFormat('0.000000');
  sheet.getRange('K6:K1000').setNumberFormat('0.000');

  // Validations
  sheet.getRange('H6:H1000').setDataValidation(createListValidation(CONFIG.TYPES_RELEVE));

  [80,90,90,110,120,120,120,150,250,90,110,150,150,200].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Relevés créée");
}

/**
 * Créer la feuille EMPLOYE
 */
function createEmployeSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.EMPLOYE);
  sheet.clear();

  sheet.getRange('A1:M1').merge().setValue('👤 GESTION DES EMPLOYÉS');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Employé', 'Nom', 'Prénom', 'ID Équipe', 'ID Poste', 'Email', 'Téléphone',
                   'Date Embauche', 'Ancienneté (jours)', 'Statut', 'Compétences', 'Nb Tâches', 'Nb Relevés'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('I6').setFormula('=SI(COUNTA(H6:H6)>0;AUJOURDHUI()-H6;"")');
  sheet.getRange('L6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.RELEVE + '!C:C;A6))');

  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('H6:H1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('I6:I1000').setNumberFormat('#,##0');
  sheet.getRange('L6:M1000').setNumberFormat('#,##0');

  [90,150,150,90,90,200,130,120,130,120,250,90,90].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Employés créée");
}

/**
 * Créer la feuille EQUIPE
 */
function createEquipeSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.EQUIPE);
  sheet.clear();

  sheet.getRange('A1:I1').merge().setValue('👥 GESTION DES ÉQUIPES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Équipe', 'Nom Équipe', 'Chef d\'Équipe', 'Nb Membres', 'Spécialité', 'Statut',
                   'Nb Tâches Actives', 'Nb Tâches Terminées', 'Taux Réussite'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('D6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.EMPLOYE + '!D:D;A6))');
  sheet.getRange('G6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI.ENS(' + CONFIG.SHEETS.TACHE + '!C:C;A6;' + CONFIG.SHEETS.TACHE + '!H:H;"En Cours"))');
  sheet.getRange('H6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI.ENS(' + CONFIG.SHEETS.TACHE + '!C:C;A6;' + CONFIG.SHEETS.TACHE + '!H:H;"Terminée"))');
  sheet.getRange('I6').setFormula('=SI(ET(G6>0;H6>0);H6/(G6+H6);"")');

  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('D6:D1000').setNumberFormat('#,##0');
  sheet.getRange('G6:H1000').setNumberFormat('#,##0');
  sheet.getRange('I6:I1000').setNumberFormat('0.0%');

  [90,200,180,100,180,120,130,150,120].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Équipes créée");
}

/**
 * Créer la feuille MATERIEL
 */
function createMaterielSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.MATERIEL);
  sheet.clear();

  sheet.getRange('A1:L1').merge().setValue('🔧 GESTION DU MATÉRIEL');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Matériel', 'Nom Matériel', 'Type Matériel', 'Numéro Série', 'Date Acquisition',
                   'Date Dernier Entretien', 'Statut', 'Coût Acquisition', 'Coût Entretien Total',
                   'Prochaine Maintenance', 'Jours avant Maintenance', 'Utilisations'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('K6').setFormula('=SI(COUNTA(J6:J6)>0;J6-AUJOURDHUI();"")');
  sheet.getRange('L6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.TACHE + '!D:D;A6))');

  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('E6:F1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('J6:J1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('H6:I1000').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('K6:L1000').setNumberFormat('#,##0');

  sheet.getRange('G6:G1000').setDataValidation(createListValidation(CONFIG.STATUTS.MATERIEL));
  sheet.getRange('C6:C1000').setDataValidation(createListValidation(CONFIG.TYPES_MATERIEL));

  [90,200,180,150,120,140,130,140,140,150,150,100].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Matériel créée");
}

/**
 * Créer la feuille POSTE
 */
function createPosteSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.POSTE);
  sheet.clear();

  sheet.getRange('A1:G1').merge().setValue('💼 GESTION DES POSTES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Poste', 'Intitulé Poste', 'Description', 'Salaire Base', 'Département', 'Nb Employés', 'Compétences Requises'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('F6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.EMPLOYE + '!E:E;A6))');

  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('D6:D1000').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('F6:F1000').setNumberFormat('#,##0');

  [90,220,300,140,150,110,300].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Postes créée");
}

/**
 * Créer la feuille BUDGET
 */
function createBudgetSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.BUDGET);
  sheet.clear();

  sheet.getRange('A1:H1').merge().setValue('💰 GESTION DU BUDGET');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Budget', 'ID Projet', 'Montant Total', 'Montant Utilisé', 'Montant Restant', '% Utilisation', 'Date Création', 'Statut'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('D6').setFormula('=SI(COUNTA(A6:A6)=0;"";SOMME.SI.ENS(' + CONFIG.SHEETS.FACTURE + '!B:B;B6;' + CONFIG.SHEETS.FACTURE + '!E:E;"Payée";' + CONFIG.SHEETS.FACTURE + '!D:D;' + CONFIG.SHEETS.FACTURE + '!D:D))');
  sheet.getRange('E6').setFormula('=SI(COUNTA(C6:C6)=0;"";C6-D6)');
  sheet.getRange('F6').setFormula('=SI(ET(COUNTA(C6:C6)>0;C6>0);D6/C6;"")');

  sheet.getRange('A6:B1000').setNumberFormat('0');
  sheet.getRange('C6:E1000').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('F6:F1000').setNumberFormat('0.0%');
  sheet.getRange('G6:G1000').setNumberFormat('dd/mm/yyyy');

  [90,90,150,150,150,120,120,130].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Budget créée");
}

/**
 * Créer la feuille FACTURE
 */
function createFactureSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.FACTURE);
  sheet.clear();

  sheet.getRange('A1:J1').merge().setValue('🧾 GESTION DES FACTURES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Facture', 'ID Projet', 'Date Facture', 'Montant', 'Statut', 'Date Paiement', 'Mode Paiement', 'Référence', 'Fournisseur', 'Description'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  sheet.getRange('A6:B1000').setNumberFormat('0');
  sheet.getRange('C6:C1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('D6:D1000').setNumberFormat('#,##0.00 "FCFA"');
  sheet.getRange('F6:F1000').setNumberFormat('dd/mm/yyyy');

  sheet.getRange('E6:E1000').setDataValidation(createListValidation(CONFIG.STATUTS.FACTURE));

  [90,90,120,150,130,120,150,180,200,300].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Factures créée");
}

/**
 * Créer la feuille DOCUMENT
 */
function createDocumentSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.DOCUMENT);
  sheet.clear();

  sheet.getRange('A1:K1').merge().setValue('📄 GESTION DES DOCUMENTS');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Document', 'ID Ouvrage', 'Nom Document', 'Type Document', 'Chemin Fichier', 'Date Création',
                   'Statut', 'Décision Contrôle', 'Décision Hiérarchie', 'Version Document', 'ID Contrôleur'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  sheet.getRange('A6:B1000').setNumberFormat('0');
  sheet.getRange('F6:F1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('J6:K1000').setNumberFormat('0');

  sheet.getRange('D6:D1000').setDataValidation(createListValidation(CONFIG.TYPES_DOCUMENT));
  sheet.getRange('G6:G1000').setDataValidation(createListValidation(CONFIG.STATUTS.DOCUMENT));

  [90,90,250,150,300,120,130,150,150,120,110].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Documents créée");
}

/**
 * Créer la feuille UTILISATEUR
 */
function createUtilisateurSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.UTILISATEUR);
  sheet.clear();

  sheet.getRange('A1:H1').merge().setValue('🔐 GESTION DES UTILISATEURS');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Utilisateur', 'ID Employé', 'Nom Utilisateur', 'Niveau Accès', 'Date Création', 'Dernière Connexion', 'Statut', 'Email'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  sheet.getRange('A6:B1000').setNumberFormat('0');
  sheet.getRange('E6:E1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('F6:F1000').setNumberFormat('dd/mm/yyyy hh:mm');

  sheet.getRange('D6:D1000').setDataValidation(createListValidation(CONFIG.NIVEAUX_ACCES));

  [110,100,180,150,120,150,120,200].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Utilisateurs créée");
}

/**
 * Créer la feuille JOURNAL
 */
function createJournalSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.JOURNAL);
  sheet.clear();

  sheet.getRange('A1:D1').merge().setValue('📝 JOURNAL DES ACTIONS');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['Date/Heure', 'Utilisateur', 'Type Action', 'Description'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6:A1000').setNumberFormat('dd/mm/yyyy hh:mm:ss');

  [180,200,150,400].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Journal créée");
}

/**
 * Créer la feuille NOTIFICATION
 */
function createNotificationSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.NOTIFICATION);
  sheet.clear();

  sheet.getRange('A1:G1').merge().setValue('🔔 NOTIFICATIONS');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Notification', 'ID Utilisateur', 'Message', 'Date Création', 'Lu', 'Priorité', 'Type'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  sheet.getRange('A6:B1000').setNumberFormat('0');
  sheet.getRange('D6:D1000').setNumberFormat('dd/mm/yyyy hh:mm');

  [120,110,350,140,80,110,130].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Notifications créée");
}

/**
 * Créer la feuille PLANNING
 */
function createPlanningSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.PLANNING);
  sheet.clear();

  sheet.getRange('A1:F1').merge().setValue('📅 PLANNING');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Planning', 'Date Début', 'Date Fin', 'Type Planning', 'Nb Tâches', 'Description'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');

  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('B6:C1000').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('E6:E1000').setNumberFormat('#,##0');

  [100,120,120,150,100,300].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Planning créée");
}

/**
 * Créer la feuille CONTROLEUR
 */
function createControleurSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.CONTROLEUR);
  sheet.clear();

  sheet.getRange('A1:I1').merge().setValue('✅ CONTRÔLEURS QUALITÉ');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  const headers = ['ID Contrôleur', 'Nom', 'Prénom', 'Spécialité', 'Organisme', 'Contact', 'Email', 'Nb Documents', 'Nb Validations'];
  sheet.getRange(5, 1, 1, headers.length).setValues([headers]);
  applyHeaderStyle(sheet.getRange(5, 1, 1, headers.length), CONFIG.COLORS.PRIMARY);

  sheet.getRange('A6').setFormula('=SI(LIGNE()=6;1;SI(A5="";"";A5+1))');
  sheet.getRange('H6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI(' + CONFIG.SHEETS.DOCUMENT + '!K:K;A6))');
  sheet.getRange('I6').setFormula('=SI(COUNTA(A6:A6)=0;"";NB.SI.ENS(' + CONFIG.SHEETS.DOCUMENT + '!K:K;A6;' + CONFIG.SHEETS.DOCUMENT + '!G:G;"Validé"))');

  sheet.getRange('A6:A1000').setNumberFormat('0');
  sheet.getRange('H6:I1000').setNumberFormat('#,##0');

  [110,150,150,180,200,150,200,120,130].forEach((width, i) => {
    sheet.setColumnWidth(i + 1, width);
  });

  sheet.setFrozenRows(5);
  logAction("Création", "Feuille Contrôleurs créée");
}

/**
 * Créer la feuille STATS
 */
function createStatsSheet() {
  const sheet = getOrCreateSheet(CONFIG.SHEETS.STATS);
  sheet.clear();

  sheet.getRange('A1:F1').merge().setValue('📈 STATISTIQUES AVANCÉES');
  applyHeaderStyle(sheet.getRange('A1'), CONFIG.COLORS.PRIMARY);
  sheet.setRowHeight(1, 50);

  // Cette feuille contiendra des analyses avancées et des graphiques
  const sections = [
    ['📊 ANALYSE GLOBALE', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['📁 Par Projet', 'Total', '=COUNTA(' + CONFIG.SHEETS.PROJET + '!A:A)-1', 'Budget Total', '=SOMME(' + CONFIG.SHEETS.BUDGET + '!C:C)', ''],
    ['🏗️ Par Ouvrage', 'Total', '=COUNTA(' + CONFIG.SHEETS.OUVRAGE + '!A:A)-1', 'En Cours', '=NB.SI(' + CONFIG.SHEETS.OUVRAGE + '!F:F;"En Cours")', ''],
    ['✓ Par Tâche', 'Total', '=COUNTA(' + CONFIG.SHEETS.TACHE + '!A:A)-1', 'Terminées', '=NB.SI(' + CONFIG.SHEETS.TACHE + '!H:H;"Terminée")', ''],
    ['📍 Par Relevé', 'Total', '=COUNTA(' + CONFIG.SHEETS.RELEVE + '!A:A)-1', 'Validés', '=NB.SI(' + CONFIG.SHEETS.RELEVE + '!J:J;VRAI)', ''],
    ['👤 Par Employé', 'Total', '=COUNTA(' + CONFIG.SHEETS.EMPLOYE + '!A:A)-1', 'Actifs', '=NB.SI(' + CONFIG.SHEETS.EMPLOYE + '!J:J;"Actif")', ''],
  ];

  sheet.getRange(3, 1, sections.length, 6).setValues(sections);
  sheet.getRange('A3:F3').setBackground(CONFIG.COLORS.LIGHT).setFontWeight('bold').setFontSize(14);

  logAction("Création", "Feuille Statistiques créée");
}
