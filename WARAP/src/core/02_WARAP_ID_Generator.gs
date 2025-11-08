/**
 * ============================================================================
 * WARAP_ID_GENERATOR.GS - Génération d'identifiants uniques 14 caractères
 * ============================================================================
 *
 * Format: [PREFIX 3 LETTRES][11 CHIFFRES ALÉATOIRES]
 * Exemples:
 *   - CLI12345678901 (Client)
 *   - PRE98765432109 (Prestataire)
 *   - ANN11223344556 (Annonce)
 *   - TRA55667788990 (Transaction)
 *
 * Garantit l'unicité en vérifiant dans la feuille correspondante
 *
 * @version 1.0.0
 * @author WARAP Team
 * ============================================================================
 */

/**
 * Préfixes pour chaque type d'entité
 */
const ID_PREFIXES = {
  CLIENT: 'CLI',
  PRESTATAIRE: 'PRE',
  ANNONCE: 'ANN',
  TRANSACTION: 'TRA',
  MATCHING: 'MAT',
  PRODUIT: 'PRD',
  LIVRAISON: 'LIV',
  RENDEZVOUS: 'RDV',
  LITIGE: 'LIT',
  SAV: 'SAV',
  FOURNISSEUR: 'FOU',
  UTILISATEUR: 'USR',
  PARAMETRE: 'PAR',
  LOG: 'LOG',
  NOTIFICATION: 'NOT',
  EVALUATION: 'EVA',
  COMMANDE: 'CMD',
  MOUVEMENT: 'MOV',
  HORAIRE: 'HOR',
  ANALYTIQUE: 'ANA'
};

/**
 * Mapping préfixe → nom de feuille
 */
const SHEET_MAPPING = {
  'CLI': 'ClientsWARAP',
  'PRE': 'PrestatairesWARAP',
  'ANN': 'AnnoncesWARAP',
  'TRA': 'TransactionsWARAP',
  'MAT': 'Matchings_Proposes',
  'PRD': 'Catalogue_Produits_WARAP',
  'LIV': 'LivraisonsWARAP',
  'RDV': 'RendezVousWARAP',
  'LIT': 'LitigesWARAP',
  'SAV': 'SAV_WARAP',
  'FOU': 'Fournisseurs_WARAP',
  'USR': 'Utilisateurs_WARAP',
  'PAR': 'Parametres_WARAP',
  'LOG': 'Logs_WARAP',
  'NOT': 'Notifications_Envoyees',
  'EVA': 'Evaluations_Detaillees',
  'CMD': 'Commandes_Produits',
  'MOV': 'Stock_Mouvements',
  'HOR': 'Horaires_Prestataires',
  'ANA': 'Analytics_WARAP'
};

/**
 * ============================================================================
 * FONCTION GÉNÉRIQUE DE GÉNÉRATION D'ID
 * ============================================================================
 */

/**
 * Génère un ID unique de 14 caractères
 *
 * @param {string} prefix - Préfixe 3 lettres (CLI, PRE, ANN, etc.)
 * @return {string} ID unique 14 caractères
 * @throws {Error} Si impossible de générer un ID unique après 10 tentatives
 *
 * @example
 * const clientId = generateID('CLI'); // "CLI12345678901"
 */
function generateID(prefix) {
  // Validation du préfixe
  if (!Object.values(ID_PREFIXES).includes(prefix)) {
    throw new Error(`❌ Préfixe invalide: ${prefix}. Préfixes acceptés: ${Object.values(ID_PREFIXES).join(', ')}`);
  }

  let id;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Générer 11 chiffres aléatoires
    // Math.random() retourne 0-0.999..., multiplié par 90000000000 donne 0-89999999999
    // Ajouter 10000000000 donne 10000000000-99999999999 (11 chiffres)
    const random11Digits = Math.floor(10000000000 + Math.random() * 90000000000);
    id = prefix + random11Digits.toString();

    // Vérifier l'unicité
    const sheetName = SHEET_MAPPING[prefix];
    isUnique = !idExists(id, sheetName);

    attempts++;

    if (!isUnique) {
      Logger.log(`⚠️ ID en doublon détecté: ${id} (tentative ${attempts}/${maxAttempts})`);
    }
  }

  if (!isUnique) {
    throw new Error(`❌ Impossible de générer un ID unique pour ${prefix} après ${maxAttempts} tentatives`);
  }

  Logger.log(`✅ ID généré: ${id}`);
  return id;
}

/**
 * Vérifie si un ID existe déjà dans une feuille
 *
 * @param {string} id - ID à vérifier
 * @param {string} sheetName - Nom de la feuille
 * @return {boolean} true si l'ID existe, false sinon
 */
function idExists(id, sheetName) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (!sheet) {
      Logger.log(`⚠️ Feuille ${sheetName} non trouvée. ID considéré comme unique.`);
      return false;
    }

    const lastRow = sheet.getLastRow();

    // Si la feuille n'a que les headers (ligne 1), l'ID est unique
    if (lastRow <= 1) {
      return false;
    }

    // Récupérer toutes les données de la colonne A (IDs)
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

    // Vérifier si l'ID existe
    return data.flat().includes(id);

  } catch (error) {
    Logger.log(`❌ Erreur vérification ID ${id} dans ${sheetName}: ${error}`);
    return false; // En cas d'erreur, considérer comme unique pour ne pas bloquer
  }
}

/**
 * Valide le format d'un ID
 *
 * @param {string} id - ID à valider
 * @return {boolean} true si valide, false sinon
 *
 * @example
 * validateID('CLI12345678901') // true
 * validateID('CLI123') // false (trop court)
 * validateID('XXX12345678901') // false (préfixe invalide)
 */
function validateID(id) {
  // Vérifier la longueur
  if (!id || id.length !== 14) {
    return false;
  }

  // Extraire préfixe et chiffres
  const prefix = id.substring(0, 3);
  const digits = id.substring(3);

  // Vérifier que le préfixe est valide
  if (!Object.values(ID_PREFIXES).includes(prefix)) {
    return false;
  }

  // Vérifier que les 11 caractères suivants sont des chiffres
  if (!/^\d{11}$/.test(digits)) {
    return false;
  }

  return true;
}

/**
 * Extrait le préfixe d'un ID
 *
 * @param {string} id - ID complet
 * @return {string} Préfixe 3 lettres
 *
 * @example
 * getIDPrefix('CLI12345678901') // 'CLI'
 */
function getIDPrefix(id) {
  if (!validateID(id)) {
    throw new Error(`❌ ID invalide: ${id}`);
  }
  return id.substring(0, 3);
}

/**
 * Obtient le type d'entité à partir d'un ID
 *
 * @param {string} id - ID complet
 * @return {string} Type d'entité
 *
 * @example
 * getEntityType('CLI12345678901') // 'Client'
 */
function getEntityType(id) {
  const prefix = getIDPrefix(id);

  const typeMapping = {
    'CLI': 'Client',
    'PRE': 'Prestataire',
    'ANN': 'Annonce',
    'TRA': 'Transaction',
    'MAT': 'Matching',
    'PRD': 'Produit',
    'LIV': 'Livraison',
    'RDV': 'Rendez-vous',
    'LIT': 'Litige',
    'SAV': 'Ticket SAV',
    'FOU': 'Fournisseur',
    'USR': 'Utilisateur',
    'PAR': 'Paramètre',
    'LOG': 'Log',
    'NOT': 'Notification',
    'EVA': 'Évaluation',
    'CMD': 'Commande',
    'MOV': 'Mouvement Stock',
    'HOR': 'Horaire',
    'ANA': 'Analytique'
  };

  return typeMapping[prefix] || 'Inconnu';
}

/**
 * ============================================================================
 * FONCTIONS SPÉCIFIQUES PAR TYPE D'ENTITÉ
 * ============================================================================
 */

/**
 * Génère un ID Client (CLI)
 * @return {string} ID Client unique
 */
function generateClientID() {
  return generateID(ID_PREFIXES.CLIENT);
}

/**
 * Génère un ID Prestataire (PRE)
 * @return {string} ID Prestataire unique
 */
function generatePrestataireID() {
  return generateID(ID_PREFIXES.PRESTATAIRE);
}

/**
 * Génère un ID Annonce (ANN)
 * @return {string} ID Annonce unique
 */
function generateAnnonceID() {
  return generateID(ID_PREFIXES.ANNONCE);
}

/**
 * Génère un ID Transaction (TRA)
 * @return {string} ID Transaction unique
 */
function generateTransactionID() {
  return generateID(ID_PREFIXES.TRANSACTION);
}

/**
 * Génère un ID Matching (MAT)
 * @return {string} ID Matching unique
 */
function generateMatchingID() {
  return generateID(ID_PREFIXES.MATCHING);
}

/**
 * Génère un ID Produit (PRD)
 * @return {string} ID Produit unique
 */
function generateProduitID() {
  return generateID(ID_PREFIXES.PRODUIT);
}

/**
 * Génère un ID Livraison (LIV)
 * @return {string} ID Livraison unique
 */
function generateLivraisonID() {
  return generateID(ID_PREFIXES.LIVRAISON);
}

/**
 * Génère un ID Rendez-vous (RDV)
 * @return {string} ID Rendez-vous unique
 */
function generateRDVID() {
  return generateID(ID_PREFIXES.RENDEZVOUS);
}

/**
 * Génère un ID Litige (LIT)
 * @return {string} ID Litige unique
 */
function generateLitigeID() {
  return generateID(ID_PREFIXES.LITIGE);
}

/**
 * Génère un ID SAV (SAV)
 * @return {string} ID Ticket SAV unique
 */
function generateSAVID() {
  return generateID(ID_PREFIXES.SAV);
}

/**
 * Génère un ID Fournisseur (FOU)
 * @return {string} ID Fournisseur unique
 */
function generateFournisseurID() {
  return generateID(ID_PREFIXES.FOURNISSEUR);
}

/**
 * Génère un ID Utilisateur (USR)
 * @return {string} ID Utilisateur unique
 */
function generateUtilisateurID() {
  return generateID(ID_PREFIXES.UTILISATEUR);
}

/**
 * Génère un ID Paramètre (PAR)
 * @return {string} ID Paramètre unique
 */
function generateParametreID() {
  return generateID(ID_PREFIXES.PARAMETRE);
}

/**
 * Génère un ID Log (LOG)
 * @return {string} ID Log unique
 */
function generateLogID() {
  return generateID(ID_PREFIXES.LOG);
}

/**
 * Génère un ID Notification (NOT)
 * @return {string} ID Notification unique
 */
function generateNotificationID() {
  return generateID(ID_PREFIXES.NOTIFICATION);
}

/**
 * Génère un ID Évaluation (EVA)
 * @return {string} ID Évaluation unique
 */
function generateEvaluationID() {
  return generateID(ID_PREFIXES.EVALUATION);
}

/**
 * Génère un ID Commande (CMD)
 * @return {string} ID Commande unique
 */
function generateCommandeID() {
  return generateID(ID_PREFIXES.COMMANDE);
}

/**
 * Génère un ID Mouvement Stock (MOV)
 * @return {string} ID Mouvement unique
 */
function generateMouvementID() {
  return generateID(ID_PREFIXES.MOUVEMENT);
}

/**
 * Génère un ID Horaire (HOR)
 * @return {string} ID Horaire unique
 */
function generateHoraireID() {
  return generateID(ID_PREFIXES.HORAIRE);
}

/**
 * Génère un ID Analytique (ANA)
 * @return {string} ID Analytique unique
 */
function generateAnalytiqueID() {
  return generateID(ID_PREFIXES.ANALYTIQUE);
}

/**
 * ============================================================================
 * FONCTIONS DE TEST
 * ============================================================================
 */

/**
 * Teste la génération de 100 IDs pour vérifier l'unicité
 */
function testIDGeneration() {
  Logger.log('🧪 Test génération IDs...');

  const types = ['CLI', 'PRE', 'ANN', 'TRA', 'MAT'];
  const results = [];

  types.forEach(prefix => {
    const ids = new Set();
    let allValid = true;
    let allUnique = true;

    for (let i = 0; i < 100; i++) {
      try {
        const id = generateID(prefix);

        // Vérifier format
        if (!validateID(id)) {
          allValid = false;
          Logger.log(`❌ ID invalide généré: ${id}`);
        }

        // Vérifier unicité
        if (ids.has(id)) {
          allUnique = false;
          Logger.log(`❌ ID en doublon: ${id}`);
        }

        ids.add(id);

      } catch (error) {
        Logger.log(`❌ Erreur génération ${prefix}: ${error}`);
        allValid = false;
      }
    }

    results.push({
      prefix: prefix,
      valid: allValid,
      unique: allUnique,
      count: ids.size
    });
  });

  // Afficher résultats
  Logger.log('\n📊 Résultats:');
  results.forEach(r => {
    const status = (r.valid && r.unique) ? '✅' : '❌';
    Logger.log(`${status} ${r.prefix}: ${r.count}/100 IDs générés, Valides: ${r.valid}, Uniques: ${r.unique}`);
  });

  const allSuccess = results.every(r => r.valid && r.unique);
  if (allSuccess) {
    Logger.log('\n🎉 Tous les tests réussis !');
  } else {
    Logger.log('\n⚠️ Certains tests ont échoué');
  }

  return results;
}

/**
 * Teste la validation d'IDs
 */
function testIDValidation() {
  Logger.log('🧪 Test validation IDs...');

  const testCases = [
    { id: 'CLI12345678901', expected: true, desc: 'ID Client valide' },
    { id: 'PRE98765432109', expected: true, desc: 'ID Prestataire valide' },
    { id: 'CLI123', expected: false, desc: 'ID trop court' },
    { id: 'XXX12345678901', expected: false, desc: 'Préfixe invalide' },
    { id: 'CLI1234567890A', expected: false, desc: 'Contient lettre' },
    { id: '', expected: false, desc: 'ID vide' },
    { id: 'CLI123456789012', expected: false, desc: 'Trop long (15 caractères)' }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach(test => {
    const result = validateID(test.id);
    const status = (result === test.expected) ? '✅' : '❌';

    if (result === test.expected) {
      passed++;
    } else {
      failed++;
    }

    Logger.log(`${status} ${test.desc}: "${test.id}" → ${result} (attendu: ${test.expected})`);
  });

  Logger.log(`\n📊 Résultats: ${passed} réussis, ${failed} échoués`);

  return { passed, failed };
}

/**
 * Génère un rapport de statistiques sur les IDs utilisés
 */
function getIDStatistics() {
  Logger.log('📊 Statistiques IDs...');

  const stats = {};

  Object.keys(SHEET_MAPPING).forEach(prefix => {
    const sheetName = SHEET_MAPPING[prefix];
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (sheet) {
      const lastRow = sheet.getLastRow();
      const count = lastRow > 1 ? lastRow - 1 : 0; // -1 pour headers

      stats[prefix] = {
        type: getEntityType(prefix + '00000000000'),
        count: count,
        sheet: sheetName
      };
    } else {
      stats[prefix] = {
        type: getEntityType(prefix + '00000000000'),
        count: 0,
        sheet: sheetName + ' (non créée)'
      };
    }
  });

  // Afficher statistiques
  Logger.log('\n📈 IDs utilisés:');
  Object.keys(stats).forEach(prefix => {
    const s = stats[prefix];
    Logger.log(`${prefix} (${s.type}): ${s.count} IDs - ${s.sheet}`);
  });

  const total = Object.values(stats).reduce((sum, s) => sum + s.count, 0);
  Logger.log(`\n🔢 TOTAL: ${total} IDs utilisés`);

  return stats;
}

Logger.log('✅ WARAP_ID_Generator.gs chargé');
