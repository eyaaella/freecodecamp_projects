/**
 * Configuration de l'ERP Secrétariat
 * Config.gs
 */

/**
 * Configuration générale de l'entreprise
 */
const CONFIG = {
  // Informations de l'entreprise
  entreprise: {
    nom: 'SECRETARIAT BUREAUTIQUE',
    adresse: 'Yaoundé, Cameroun',
    telephone: '+237 XXX XXX XXX',
    email: 'contact@secretariat.cm',
    nif: '',  // Numéro d'Identification Fiscale
    rc: ''    // Registre de Commerce
  },

  // Devise
  devise: 'FCFA',

  // Taux de TVA par défaut
  tauxTVA: 19.25, // 19.25% au Cameroun

  // Préfixes pour les numéros de documents
  prefixes: {
    client: 'CLT',
    fournisseur: 'FRS',
    devis: 'DEV',
    facture: 'FAC',
    courrierEntrant: 'CE',
    courrierSortant: 'CS',
    tache: 'TSK',
    employe: 'EMP'
  },

  // Couleurs pour les en-têtes
  colors: {
    header: '#4A86E8',
    headerText: '#FFFFFF',
    subHeader: '#6FA8DC',
    success: '#93C47D',
    warning: '#F6B26B',
    danger: '#E06666',
    info: '#76A5AF'
  }
};

/**
 * Crée la feuille de configuration
 */
function createConfigSheet() {
  const sheet = getOrCreateSheet('Configuration');

  // Effacer le contenu existant
  sheet.clear();

  // En-tête
  sheet.getRange('A1:B1').merge()
    .setValue('⚙️ CONFIGURATION DE L\'ERP')
    .setBackground(CONFIG.colors.header)
    .setFontColor(CONFIG.colors.headerText)
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // Section Entreprise
  sheet.getRange('A3').setValue('INFORMATIONS ENTREPRISE').setFontWeight('bold');
  sheet.getRange('A4:B10').setValues([
    ['Nom de l\'entreprise:', CONFIG.entreprise.nom],
    ['Adresse:', CONFIG.entreprise.adresse],
    ['Téléphone:', CONFIG.entreprise.telephone],
    ['Email:', CONFIG.entreprise.email],
    ['NIF:', CONFIG.entreprise.nif],
    ['RC:', CONFIG.entreprise.rc],
    ['Devise:', CONFIG.devise]
  ]);

  // Section Taxes
  sheet.getRange('A12').setValue('PARAMÈTRES FISCAUX').setFontWeight('bold');
  sheet.getRange('A13:B13').setValues([
    ['Taux TVA (%):', CONFIG.tauxTVA]
  ]);

  // Section Préfixes
  sheet.getRange('A15').setValue('PRÉFIXES DOCUMENTS').setFontWeight('bold');
  sheet.getRange('A16:B23').setValues([
    ['Clients:', CONFIG.prefixes.client],
    ['Fournisseurs:', CONFIG.prefixes.fournisseur],
    ['Devis:', CONFIG.prefixes.devis],
    ['Factures:', CONFIG.prefixes.facture],
    ['Courrier Entrant:', CONFIG.prefixes.courrierEntrant],
    ['Courrier Sortant:', CONFIG.prefixes.courrierSortant],
    ['Tâches:', CONFIG.prefixes.tache],
    ['Employés:', CONFIG.prefixes.employe]
  ]);

  // Instructions
  sheet.getRange('A25').setValue('📝 Instructions:').setFontWeight('bold').setFontColor(CONFIG.colors.info);
  sheet.getRange('A26').setValue('Modifiez les valeurs de la colonne B pour personnaliser votre ERP.');

  // Formatage
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 300);

  // Protection des en-têtes
  const range = sheet.getRange('A1:B2');
  const protection = range.protect().setDescription('En-tête protégé');
  protection.setWarningOnly(true);

  return sheet;
}

/**
 * Lit la configuration depuis la feuille Configuration
 */
function getConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Configuration');

  if (!sheet) {
    return CONFIG; // Retourne la config par défaut
  }

  try {
    return {
      entreprise: {
        nom: sheet.getRange('B4').getValue() || CONFIG.entreprise.nom,
        adresse: sheet.getRange('B5').getValue() || CONFIG.entreprise.adresse,
        telephone: sheet.getRange('B6').getValue() || CONFIG.entreprise.telephone,
        email: sheet.getRange('B7').getValue() || CONFIG.entreprise.email,
        nif: sheet.getRange('B8').getValue() || CONFIG.entreprise.nif,
        rc: sheet.getRange('B9').getValue() || CONFIG.entreprise.rc
      },
      devise: sheet.getRange('B10').getValue() || CONFIG.devise,
      tauxTVA: sheet.getRange('B13').getValue() || CONFIG.tauxTVA,
      prefixes: {
        client: sheet.getRange('B16').getValue() || CONFIG.prefixes.client,
        fournisseur: sheet.getRange('B17').getValue() || CONFIG.prefixes.fournisseur,
        devis: sheet.getRange('B18').getValue() || CONFIG.prefixes.devis,
        facture: sheet.getRange('B19').getValue() || CONFIG.prefixes.facture,
        courrierEntrant: sheet.getRange('B20').getValue() || CONFIG.prefixes.courrierEntrant,
        courrierSortant: sheet.getRange('B21').getValue() || CONFIG.prefixes.courrierSortant,
        tache: sheet.getRange('B22').getValue() || CONFIG.prefixes.tache,
        employe: sheet.getRange('B23').getValue() || CONFIG.prefixes.employe
      },
      colors: CONFIG.colors
    };
  } catch (error) {
    Logger.log('Erreur lecture configuration: ' + error);
    return CONFIG;
  }
}
