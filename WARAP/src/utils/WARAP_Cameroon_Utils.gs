/**
 * ============================================================================
 * WARAP_CAMEROON_UTILS.GS - Utilitaires spécifiques au Cameroun
 * ============================================================================
 *
 * Fonctions pour :
 * - Validation et formatage des numéros de téléphone camerounais
 * - Formatage des montants en FCFA
 * - Gestion des communes et régions
 * - Calcul des distances (simplifié)
 *
 * @version 1.0.0
 * @author WARAP Team
 * ============================================================================
 */

/**
 * ============================================================================
 * TÉLÉPHONE CAMEROUNAIS
 * ============================================================================
 */

/**
 * Valide un numéro de téléphone camerounais
 *
 * Formats acceptés:
 * - +237 6XX XX XX XX
 * - +237 2XX XX XX XX
 * - 237XXXXXXXXX
 * - 6XXXXXXXX
 *
 * @param {string} phone - Numéro à valider
 * @return {boolean} true si valide
 *
 * @example
 * validateCameroonPhone('+237 6 77 88 99 00') // true
 * validateCameroonPhone('+237 2 22 33 44 55') // true
 * validateCameroonPhone('+241 6 77 88 99 00') // false (Gabon)
 */
function validateCameroonPhone(phone) {
  if (!phone) return false;

  // Nettoyer le numéro (enlever espaces, tirets)
  const cleaned = phone.replace(/[\s\-]/g, '');

  // Pattern: +237 suivi de 9 chiffres commençant par 2-9
  const regex = /^\+?237[2-9]\d{8}$/;

  // Pattern alternatif: 9 chiffres commençant par 6 (mobile)
  const regexMobile = /^6\d{8}$/;

  return regex.test(cleaned) || regexMobile.test(cleaned);
}

/**
 * Formate un numéro de téléphone camerounais
 *
 * @param {string} phone - Numéro à formater
 * @return {string} Numéro formaté ou original si invalide
 *
 * @example
 * formatCameroonPhone('677889900') // '+237 6 77 88 99 00'
 * formatCameroonPhone('237677889900') // '+237 6 77 88 99 00'
 */
function formatCameroonPhone(phone) {
  if (!phone) return '';

  // Nettoyer le numéro
  let cleaned = phone.replace(/\D/g, '');

  // Ajouter 237 si nécessaire
  if (cleaned.length === 9 && cleaned[0] >= '2' && cleaned[0] <= '9') {
    cleaned = '237' + cleaned;
  }

  // Vérifier qu'on a bien 12 chiffres (237 + 9 chiffres)
  if (cleaned.length !== 12 || !cleaned.startsWith('237')) {
    return phone; // Retourner l'original si format invalide
  }

  // Formater: +237 6 XX XX XX XX
  const formatted = `+${cleaned.substr(0,3)} ${cleaned.substr(3,1)} ${cleaned.substr(4,2)} ${cleaned.substr(6,2)} ${cleaned.substr(8,2)} ${cleaned.substr(10,2)}`;

  return formatted;
}

/**
 * Obtient l'opérateur mobile à partir du numéro
 *
 * @param {string} phone - Numéro de téléphone
 * @return {string} Nom de l'opérateur
 *
 * @example
 * getPhoneOperator('+237 6 77 88 99 00') // 'MTN'
 * getPhoneOperator('+237 6 55 44 33 22') // 'Orange'
 */
function getPhoneOperator(phone) {
  const cleaned = phone.replace(/\D/g, '');

  // Extraire l'indicatif mobile (après 237)
  let mobileCode;
  if (cleaned.startsWith('237')) {
    mobileCode = cleaned.substr(3, 3);
  } else if (cleaned.length === 9) {
    mobileCode = cleaned.substr(0, 3);
  } else {
    return 'Inconnu';
  }

  // Indicatifs MTN: 650-679, 680-699
  if ((mobileCode >= '650' && mobileCode <= '679') || (mobileCode >= '680' && mobileCode <= '699')) {
    return 'MTN';
  }

  // Indicatifs Orange: 655-659, 690-699
  if ((mobileCode >= '655' && mobileCode <= '659') || (mobileCode >= '690' && mobileCode <= '699')) {
    return 'Orange';
  }

  // Indicatifs Camtel: 242, 243
  if (mobileCode.startsWith('242') || mobileCode.startsWith('243')) {
    return 'Camtel';
  }

  return 'Inconnu';
}

/**
 * ============================================================================
 * FORMATAGE MONÉTAIRE
 * ============================================================================
 */

/**
 * Formate un montant en FCFA (Franc CFA)
 *
 * @param {number} montant - Montant à formater
 * @return {string} Montant formaté
 *
 * @example
 * formatCFA(15000) // '15 000 FCFA'
 * formatCFA(2500000) // '2 500 000 FCFA'
 */
function formatCFA(montant) {
  if (!montant || isNaN(montant)) return '0 FCFA';

  // Arrondir à l'entier le plus proche
  const rounded = Math.round(montant);

  // Formater avec séparateurs de milliers (espace)
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rounded);

  return `${formatted} FCFA`;
}

/**
 * Parse un montant FCFA en nombre
 *
 * @param {string} montantStr - Montant sous forme de chaîne
 * @return {number} Montant numérique
 *
 * @example
 * parseCFA('15 000 FCFA') // 15000
 * parseCFA('2.500.000 FCFA') // 2500000
 */
function parseCFA(montantStr) {
  if (!montantStr) return 0;

  // Enlever 'FCFA', espaces, points, virgules
  const cleaned = montantStr.toString()
    .replace(/FCFA/gi, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  const number = parseFloat(cleaned);

  return isNaN(number) ? 0 : number;
}

/**
 * Calcule la répartition des commissions WARAP
 *
 * @param {number} montantTotal - Montant total de la transaction
 * @return {Object} {plateforme, franchise, prestataire, total, verification}
 *
 * @example
 * calculateCommissions(100000)
 * // {plateforme: 15000, franchise: 10000, prestataire: 75000, total: 100000, verification: true}
 */
function calculateCommissions(montantTotal) {
  const TAUX = {
    PLATEFORME: 0.15,  // 15%
    FRANCHISE: 0.10,   // 10%
    PRESTATAIRE: 0.75  // 75%
  };

  const commissions = {
    plateforme: Math.round(montantTotal * TAUX.PLATEFORME),
    franchise: Math.round(montantTotal * TAUX.FRANCHISE),
    prestataire: Math.round(montantTotal * TAUX.PRESTATAIRE),
    total: montantTotal
  };

  // Vérification que la somme = total (avec tolérance 1 FCFA pour arrondi)
  const sum = commissions.plateforme + commissions.franchise + commissions.prestataire;
  commissions.verification = Math.abs(montantTotal - sum) <= 1;

  // Ajuster le prestataire si nécessaire pour avoir exactement le total
  if (!commissions.verification) {
    const diff = montantTotal - sum;
    commissions.prestataire += diff;
    commissions.verification = true;
  }

  return commissions;
}

/**
 * ============================================================================
 * COMMUNES ET RÉGIONS
 * ============================================================================
 */

/**
 * Obtient la région à partir d'une commune
 *
 * @param {string} commune - Nom de la commune
 * @return {string} Nom de la région
 *
 * @example
 * getRegionFromCommune('Yaoundé 3') // 'Centre'
 * getRegionFromCommune('Douala 1') // 'Littoral'
 * getRegionFromCommune('Lagdo') // 'Nord'
 */
function getRegionFromCommune(commune) {
  if (!commune) return '';

  const communeUpper = commune.toUpperCase();

  // Région du Centre
  if (communeUpper.includes('YAOUNDÉ') || communeUpper.includes('YAOUNDE') ||
      communeUpper.includes('MFOU') || communeUpper.includes('SOA') ||
      communeUpper.includes('BAFIA') || communeUpper.includes('MBANKOMO') ||
      communeUpper.includes('OBALA')) {
    return 'Centre';
  }

  // Région du Littoral
  if (communeUpper.includes('DOUALA') || communeUpper.includes('EDEA') ||
      communeUpper.includes('ÉDÉA') || communeUpper.includes('NKONGSAMBA') ||
      communeUpper.includes('LOUM')) {
    return 'Littoral';
  }

  // Région de l'Ouest
  if (communeUpper.includes('BAFOUSSAM') || communeUpper.includes('MBOUDA') ||
      communeUpper.includes('DSCHANG') || communeUpper.includes('BAFANG') ||
      communeUpper.includes('FOUMBAN') || communeUpper.includes('BANDJOUN')) {
    return 'Ouest';
  }

  // Région du Nord-Ouest
  if (communeUpper.includes('BAMENDA') || communeUpper.includes('KUMBO') ||
      communeUpper.includes('WUM') || communeUpper.includes('FUNDONG')) {
    return 'Nord-Ouest';
  }

  // Région du Sud-Ouest
  if (communeUpper.includes('BUEA') || communeUpper.includes('LIMBE') ||
      communeUpper.includes('LIMBÉ') || communeUpper.includes('TIKO') ||
      communeUpper.includes('KUMBA') || communeUpper.includes('MAMFE')) {
    return 'Sud-Ouest';
  }

  // Région du Nord
  if (communeUpper.includes('GAROUA') || communeUpper.includes('LAGDO') ||
      communeUpper.includes('GUIDER') || communeUpper.includes('PITOA') ||
      communeUpper.includes('REY BOUBA')) {
    return 'Nord';
  }

  // Région de l'Extrême-Nord
  if (communeUpper.includes('MAROUA') || communeUpper.includes('MOKOLO') ||
      communeUpper.includes('YAGOUA') || communeUpper.includes('KOUSSERI') ||
      communeUpper.includes('MORA')) {
    return 'Extrême-Nord';
  }

  // Région de l'Adamaoua
  if (communeUpper.includes('NGAOUNDÉRÉ') || communeUpper.includes('NGAOUNDERE') ||
      communeUpper.includes('MEIGANGA') || communeUpper.includes('TIBATI') ||
      communeUpper.includes('BANYO')) {
    return 'Adamaoua';
  }

  // Région de l'Est
  if (communeUpper.includes('BERTOUA') || communeUpper.includes('BATOURI') ||
      communeUpper.includes('ABONG') || communeUpper.includes('YOKADOUMA')) {
    return 'Est';
  }

  // Région du Sud
  if (communeUpper.includes('EBOLOWA') || communeUpper.includes('KRIBI') ||
      communeUpper.includes('SANGMÉLIMA') || communeUpper.includes('SANGMELIMA') ||
      communeUpper.includes('AMBAM') || communeUpper.includes('CAMPO')) {
    return 'Sud';
  }

  return 'Non définie';
}

/**
 * Liste des 10 régions du Cameroun
 */
const REGIONS_CAMEROUN = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest'
];

/**
 * Obtient la liste des régions
 *
 * @return {Array} Liste des régions
 */
function getRegionsCameroun() {
  return REGIONS_CAMEROUN;
}

/**
 * ============================================================================
 * DISTANCE ET GÉOLOCALISATION (SIMPLIFIÉ)
 * ============================================================================
 */

/**
 * Calcule une distance approximative entre deux communes
 * Version simplifiée basée sur les quartiers/communes
 * Pour une version réelle, utiliser Google Maps API
 *
 * @param {Object} point1 - {commune, quartier}
 * @param {Object} point2 - {commune, quartier}
 * @return {number} Distance estimée en km
 *
 * @example
 * calculateDistance(
 *   {commune: 'Yaoundé 3', quartier: 'Bastos'},
 *   {commune: 'Yaoundé 3', quartier: 'Nlongkak'}
 * ) // ~3 km
 */
function calculateDistance(point1, point2) {
  // Même quartier
  if (point1.quartier && point2.quartier && point1.quartier === point2.quartier) {
    return 1; // ≈ 1 km
  }

  // Même commune
  if (point1.commune === point2.commune) {
    return 5; // ≈ 5 km
  }

  // Même région
  const region1 = getRegionFromCommune(point1.commune);
  const region2 = getRegionFromCommune(point2.commune);

  if (region1 === region2) {
    return 25; // ≈ 25 km
  }

  // Régions différentes
  return 150; // ≈ 150 km (estimation)
}

/**
 * ============================================================================
 * FORMATAGE DE DATES
 * ============================================================================
 */

/**
 * Formate une date au format camerounais
 *
 * @param {Date|string} date - Date à formater
 * @param {string} format - Format souhaité ('short', 'long', 'time')
 * @return {string} Date formatée
 *
 * @example
 * formatDateCameroon(new Date(), 'short') // '15/01/2024'
 * formatDateCameroon(new Date(), 'long') // 'Lundi 15 janvier 2024'
 * formatDateCameroon(new Date(), 'time') // '14:30'
 */
function formatDateCameroon(date, format = 'short') {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'short') {
    return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }

  if (format === 'long') {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const jour = jours[dateObj.getDay()];
    const jourMois = dateObj.getDate();
    const moisNom = mois[dateObj.getMonth()];
    const annee = dateObj.getFullYear();

    return `${jour} ${jourMois} ${moisNom} ${annee}`;
  }

  if (format === 'time') {
    return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'HH:mm');
  }

  if (format === 'datetime') {
    return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  }

  return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'dd/MM/yyyy');
}

/**
 * ============================================================================
 * NORMALISATION DE TEXTE
 * ============================================================================
 */

/**
 * Normalise une chaîne (enlève accents, met en minuscules)
 *
 * @param {string} str - Chaîne à normaliser
 * @return {string} Chaîne normalisée
 *
 * @example
 * normalizeString('Éléctriciité') // 'electriciite'
 */
function normalizeString(str) {
  if (!str) return '';

  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .trim();
}

Logger.log('✅ WARAP_Cameroon_Utils.gs chargé');
