/**
 * ============================================================================
 * WARAP_CLIENTS_MANAGER.GS - Gestion complète des clients
 * ============================================================================
 *
 * Fonctionnalités :
 * - CRUD complet (Create, Read, Update, Delete)
 * - Calcul automatique du score RFM
 * - Segmentation intelligente
 * - Export de données
 * - Statistiques clients
 *
 * @version 1.0.0
 * @author WARAP Team
 * ============================================================================
 */

/**
 * ============================================================================
 * RÉCUPÉRATION DES DONNÉES
 * ============================================================================
 */

/**
 * Récupère les clients pour l'utilisateur connecté (avec filtrage par scope)
 *
 * @return {Object} {clients: Array, stats: Object, communes: Array}
 */
function getClientsForUser() {
  const user = requireAuth('AGENT', 'clients');

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ClientsWARAP');

    if (!sheet) {
      throw new Error('Feuille ClientsWARAP non trouvée. Exécutez l\'installation WARAP.');
    }

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return {
        clients: [],
        stats: { total: 0, actifs: 0, vip: 0, nouveaux7j: 0 },
        communes: []
      };
    }

    const headers = data[0];
    let clients = data.slice(1).map(row => rowToObject(row, headers));

    // Filtrer par scope utilisateur
    clients = filterDataByUserScope(clients, 'Commune');

    // Calculer statistiques
    const stats = calculateClientsStats(clients);

    // Liste communes uniques
    const communes = [...new Set(clients.map(c => c.Commune))].filter(c => c).sort();

    return {
      clients: clients,
      stats: stats,
      communes: communes
    };

  } catch (error) {
    Logger.log(`❌ Erreur getClientsForUser: ${error}`);
    throw error;
  }
}

/**
 * Récupère un client par son ID
 *
 * @param {string} clientId - ID du client
 * @return {Object|null} Objet client ou null
 */
function getClientById(clientId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ClientsWARAP');

  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === clientId) {
      return rowToObject(data[i], headers);
    }
  }

  return null;
}

/**
 * ============================================================================
 * CRÉATION DE CLIENT
 * ============================================================================
 */

/**
 * Créé un nouveau client
 *
 * @param {Object} clientData - Données du client
 * @return {Object} {success: boolean, clientId: string, message: string}
 */
function createClient(clientData) {
  const user = requireAuth('AGENT', 'clients');

  try {
    // Validation
    validateClientData(clientData);

    // Générer ID unique
    const clientId = generateClientID();

    // Préparer données
    const now = new Date();
    const newClient = prepareClientData(clientData, clientId, user, now);

    // Insérer dans la feuille
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ClientsWARAP');

    if (!sheet) {
      throw new Error('Feuille ClientsWARAP non trouvée');
    }

    // Convertir l'objet en tableau selon l'ordre des colonnes
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = headers.map(header => newClient[header] || '');

    sheet.appendRow(rowData);

    // Logger
    logAction('CLIENTS', 'CREATION', {
      client_id: clientId,
      nom: clientData.nom,
      email: clientData.email
    });

    // Notification email au client
    try {
      sendWelcomeEmail(clientData.email, clientData.nom);
    } catch (emailError) {
      Logger.log(`⚠️ Erreur envoi email bienvenue: ${emailError}`);
    }

    Logger.log(`✅ Client créé: ${clientId} - ${clientData.nom}`);

    return {
      success: true,
      clientId: clientId,
      message: 'Client créé avec succès'
    };

  } catch (error) {
    Logger.log(`❌ Erreur createClient: ${error}`);
    throw error;
  }
}

/**
 * Prépare les données du client pour insertion
 */
function prepareClientData(clientData, clientId, user, now) {
  return {
    ID_Client: clientId,
    Nom_Complet: clientData.nom,
    Email: clientData.email.toLowerCase(),
    Telephone_Principal: formatCameroonPhone(clientData.telephone),
    Telephone_Secondaire: clientData.telephone2 ? formatCameroonPhone(clientData.telephone2) : '',
    Adresse_Complete: clientData.adresse || '',
    Statut: 'Actif',
    Type_Client: clientData.type || 'Particulier',
    Commune: clientData.commune,
    Quartier: clientData.quartier || '',
    Zone_Geographique: getRegionFromCommune(clientData.commune),
    Segment_RFM: 'Nouveau', // Sera calculé automatiquement par formule
    Nombre_Transactions: 0, // Formule
    CA_Total: 0, // Formule
    Note_Satisfaction_Moyenne: 0, // Formule
    Date_Derniere_Transaction: '', // Formule
    Date_Creation: now,
    Date_Modification: now,
    Cree_Par: user.email,
    Modifie_Par: user.email,
    Franchise_Rattachee: user.franchise,
    Agent_Reference: user.email,
    Nombre_Litiges: 0, // Formule
    Taux_Presence_RDV: '0%', // Formule
    Notes_Internes: clientData.notes || '',
    Documents_Associes: '',
    Score_RFM: 0, // Formule
    Alerte_Inactivite: '✅ Nouveau client',
    Tags_Client: clientData.tags || '',
    Langue_Preferee: clientData.langue || 'Français',
    Source_Acquisition: clientData.source || 'Direct',
    Programme_Fidelite: 'Standard',
    Solde_Points_Fidelite: 0,
    Statut_Verification: 'En attente'
  };
}

/**
 * ============================================================================
 * VALIDATION DES DONNÉES
 * ============================================================================
 */

/**
 * Valide les données client
 *
 * @param {Object} data - Données à valider
 * @throws {Error} Si données invalides
 */
function validateClientData(data) {
  const errors = [];

  // Nom requis (minimum 2 caractères)
  if (!data.nom || data.nom.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  // Email valide et unique
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email invalide');
  } else if (emailExists(data.email, data.clientId)) {
    errors.push('Cet email est déjà utilisé par un autre client');
  }

  // Téléphone camerounais
  if (!validateCameroonPhone(data.telephone)) {
    errors.push('Numéro de téléphone camerounais invalide (format: +237 6XX XX XX XX)');
  }

  // Commune valide
  if (!data.commune) {
    errors.push('La commune est requise');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

/**
 * Vérifie si un email existe déjà
 *
 * @param {string} email - Email à vérifier
 * @param {string} excludeId - ID à exclure de la vérification (pour update)
 * @return {boolean} true si l'email existe
 */
function emailExists(email, excludeId = null) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ClientsWARAP');

  if (!sheet) return false;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const emailIndex = headers.indexOf('Email');
  const idIndex = headers.indexOf('ID_Client');

  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIndex] === email.toLowerCase() && data[i][idIndex] !== excludeId) {
      return true;
    }
  }

  return false;
}

/**
 * ============================================================================
 * MISE À JOUR DE CLIENT
 * ============================================================================
 */

/**
 * Met à jour un client existant
 *
 * @param {string} clientId - ID du client
 * @param {Object} updates - Données à mettre à jour
 * @return {Object} {success: boolean, message: string}
 */
function updateClient(clientId, updates) {
  const user = requireAuth('AGENT', 'clients');

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ClientsWARAP');

    if (!sheet) {
      throw new Error('Feuille ClientsWARAP non trouvée');
    }

    // Trouver la ligne du client
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('ID_Client');
    let rowIndex = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] === clientId) {
        rowIndex = i + 1; // +1 car getRange est 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error('Client non trouvé');
    }

    // Validation des updates
    const validationData = {
      ...updates,
      clientId: clientId
    };
    validateClientData(validationData);

    // Appliquer les mises à jour
    const now = new Date();

    if (updates.nom) {
      const colIndex = headers.indexOf('Nom_Complet') + 1;
      sheet.getRange(rowIndex, colIndex).setValue(updates.nom);
    }

    if (updates.email) {
      const colIndex = headers.indexOf('Email') + 1;
      sheet.getRange(rowIndex, colIndex).setValue(updates.email.toLowerCase());
    }

    if (updates.telephone) {
      const colIndex = headers.indexOf('Telephone_Principal') + 1;
      sheet.getRange(rowIndex, colIndex).setValue(formatCameroonPhone(updates.telephone));
    }

    if (updates.commune) {
      const colIndex = headers.indexOf('Commune') + 1;
      sheet.getRange(rowIndex, colIndex).setValue(updates.commune);

      // Mettre à jour la zone géographique
      const zoneIndex = headers.indexOf('Zone_Geographique') + 1;
      sheet.getRange(rowIndex, zoneIndex).setValue(getRegionFromCommune(updates.commune));
    }

    // Date de modification
    const modifIndex = headers.indexOf('Date_Modification') + 1;
    sheet.getRange(rowIndex, modifIndex).setValue(now);

    // Modifié par
    const modifParIndex = headers.indexOf('Modifie_Par') + 1;
    sheet.getRange(rowIndex, modifParIndex).setValue(user.email);

    // Logger
    logAction('CLIENTS', 'MODIFICATION', {
      client_id: clientId,
      updates: Object.keys(updates)
    });

    Logger.log(`✅ Client mis à jour: ${clientId}`);

    return {
      success: true,
      message: 'Client mis à jour avec succès'
    };

  } catch (error) {
    Logger.log(`❌ Erreur updateClient: ${error}`);
    throw error;
  }
}

/**
 * ============================================================================
 * STATISTIQUES ET CALCULS
 * ============================================================================
 */

/**
 * Calcule les statistiques clients
 *
 * @param {Array} clients - Liste des clients
 * @return {Object} Statistiques
 */
function calculateClientsStats(clients) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

  return {
    total: clients.length,
    actifs: clients.filter(c => c.Statut === 'Actif').length,
    inactifs: clients.filter(c => c.Statut === 'Inactif').length,
    vip: clients.filter(c => c.Segment_RFM === 'VIP').length,
    fideles: clients.filter(c => c.Segment_RFM === 'Fidèle').length,
    nouveaux7j: clients.filter(c => {
      const dateCreation = new Date(c.Date_Creation);
      return dateCreation >= sevenDaysAgo;
    }).length,
    caTotal: clients.reduce((sum, c) => sum + (parseFloat(c.CA_Total) || 0), 0),
    panierMoyen: clients.length > 0
      ? clients.reduce((sum, c) => sum + (parseFloat(c.CA_Total) || 0), 0) / clients.length
      : 0
  };
}

/**
 * Calcule le score RFM pour un client
 * (Recency, Frequency, Monetary)
 *
 * @param {string} clientId - ID du client
 * @return {number} Score RFM (0-100)
 */
function calculateRFMScore(clientId) {
  const client = getClientById(clientId);

  if (!client) return 0;

  const now = new Date();
  const lastTransaction = client.Date_Derniere_Transaction ? new Date(client.Date_Derniere_Transaction) : null;

  // Recency (0-5)
  let recencyScore = 1;
  if (lastTransaction) {
    const daysSinceLastTransaction = Math.floor((now - lastTransaction) / (1000 * 60 * 60 * 24));

    if (daysSinceLastTransaction <= 30) recencyScore = 5;
    else if (daysSinceLastTransaction <= 60) recencyScore = 4;
    else if (daysSinceLastTransaction <= 90) recencyScore = 3;
    else if (daysSinceLastTransaction <= 180) recencyScore = 2;
  }

  // Frequency (0-5)
  const frequency = parseInt(client.Nombre_Transactions) || 0;
  let frequencyScore = 1;

  if (frequency >= 20) frequencyScore = 5;
  else if (frequency >= 10) frequencyScore = 4;
  else if (frequency >= 5) frequencyScore = 3;
  else if (frequency >= 2) frequencyScore = 2;

  // Monetary (0-5)
  const monetary = parseFloat(client.CA_Total) || 0;
  let monetaryScore = 1;

  if (monetary >= 500000) monetaryScore = 5;
  else if (monetary >= 200000) monetaryScore = 4;
  else if (monetary >= 100000) monetaryScore = 3;
  else if (monetary >= 50000) monetaryScore = 2;

  // Score final (0-100)
  const finalScore = Math.round((recencyScore + frequencyScore + monetaryScore) * 6.67);

  return finalScore;
}

/**
 * ============================================================================
 * EXPORT DE DONNÉES
 * ============================================================================
 */

/**
 * Exporte les données clients en CSV
 *
 * @param {Array} clientIds - Liste des IDs clients à exporter (vide = tous)
 * @return {string} URL du fichier exporté
 */
function exportClientsData(clientIds = []) {
  const user = requireAuth('AGENT', 'clients');

  try {
    const { clients } = getClientsForUser();

    // Filtrer par IDs si fournis
    let dataToExport = clients;
    if (clientIds.length > 0) {
      dataToExport = clients.filter(c => clientIds.includes(c.ID_Client));
    }

    // Créer un nouveau Sheet temporaire
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const exportSheet = ss.insertSheet('Export_Clients_' + new Date().getTime());

    // Headers
    const headers = Object.keys(dataToExport[0] || {});
    exportSheet.appendRow(headers);

    // Données
    dataToExport.forEach(client => {
      const row = headers.map(h => client[h] || '');
      exportSheet.appendRow(row);
    });

    // Générer URL
    const url = ss.getUrl();

    Logger.log(`✅ Export clients: ${dataToExport.length} lignes`);

    return url;

  } catch (error) {
    Logger.log(`❌ Erreur exportClientsData: ${error}`);
    throw error;
  }
}

/**
 * ============================================================================
 * FONCTIONS UTILITAIRES
 * ============================================================================
 */

/**
 * Convertit une ligne de données en objet
 *
 * @param {Array} row - Ligne de données
 * @param {Array} headers - En-têtes
 * @return {Object} Objet avec clés = headers
 */
function rowToObject(row, headers) {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index];
  });
  return obj;
}

/**
 * Envoie un email de bienvenue au nouveau client
 *
 * @param {string} email - Email du client
 * @param {string} nom - Nom du client
 */
function sendWelcomeEmail(email, nom) {
  const subject = 'Bienvenue sur WARAP !';

  const body = `
Bonjour ${nom},

Bienvenue sur WARAP, votre plateforme de services au Cameroun !

Votre compte a été créé avec succès. Vous pouvez maintenant :
• Publier des annonces de service
• Recevoir des propositions de prestataires qualifiés
• Commander des produits
• Suivre vos transactions

Pour toute question, contactez-nous : warapservices@gmail.com

Cordialement,
L'équipe WARAP
  `.trim();

  try {
    MailApp.sendEmail(email, subject, body);
    Logger.log(`✅ Email bienvenue envoyé à ${email}`);
  } catch (error) {
    Logger.log(`❌ Erreur envoi email: ${error}`);
  }
}

/**
 * Log une action utilisateur
 *
 * @param {string} module - Module concerné
 * @param {string} action - Action effectuée
 * @param {Object} details - Détails de l'action
 */
function logAction(module, action, details) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs_WARAP');

    if (!sheet) return;

    const user = getCurrentUser();
    const logData = [
      generateLogID(),
      new Date(),
      action,
      module,
      action,
      user.email,
      user.role,
      module,
      details.client_id || details.id || '-',
      '',
      JSON.stringify(details),
      'N/A',
      '',
      'Succès',
      '',
      'Normal'
    ];

    sheet.appendRow(logData);

  } catch (error) {
    Logger.log(`⚠️ Erreur logAction: ${error}`);
  }
}

Logger.log('✅ WARAP_Clients_Manager.gs chargé');
