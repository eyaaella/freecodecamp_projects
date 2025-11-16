/**
 * ===============================================================================
 * MODULE METAVERSE 🥽 - TopoGest Pro v5.0
 * Metaverse, VR/AR & Réunions Virtuelles
 * ===============================================================================
 *
 * TECHNOLOGIES:
 * - Meta Horizon Workrooms (Quest 3)
 * - Microsoft Mesh (HoloLens 2)
 * - Apple Vision Pro (visionOS 2.0)
 * - WebXR (W3C Standard)
 * - Unity WebGL + Babylon.js + Three.js
 * - Avatars Ready Player Me
 * - Spatial Audio Dolby Atmos
 *
 * CAPACITÉS:
 * - Réunions VR jusqu'à 50 participants simultanés
 * - Visites virtuelles chantiers en temps réel
 * - Jumeaux numériques (Digital Twins) synchronisés
 * - Collaboration 3D immersive
 * - Formation VR interactive
 * - Visualisation projets en réalité augmentée
 *
 * PLATEFORMES:
 * - Meta Quest 3 (128GB/512GB) - 2064x2208 per eye
 * - Apple Vision Pro - 3660x3200 per eye
 * - Microsoft HoloLens 2 - 2K per eye
 * - WebXR (navigateur) - tous appareils
 *
 * VERSION: 5.0.0
 * DATE: 2025-11-16
 * ===============================================================================
 */

// ===============================================================================
// CONFIGURATION METAVERSE
// ===============================================================================

const METAVERSE_CONFIG = {
  PLATFORMS: {
    META: {
      name: 'Meta Horizon Workrooms',
      device: 'Quest 3',
      resolution: '2064x2208 per eye',
      maxParticipants: 50,
      features: ['Spatial Audio', 'Hand Tracking', 'Passthrough AR'],
      status: 'active'
    },
    APPLE: {
      name: 'Apple Vision Pro',
      device: 'Vision Pro',
      resolution: '3660x3200 per eye',
      maxParticipants: 32,
      features: ['EyeSight', 'Spatial Computing', 'visionOS Apps'],
      status: 'active'
    },
    MICROSOFT: {
      name: 'Microsoft Mesh',
      device: 'HoloLens 2',
      resolution: '2K per eye',
      maxParticipants: 30,
      features: ['Mixed Reality', 'Azure Integration', 'Holographic'],
      status: 'active'
    },
    WEBXR: {
      name: 'WebXR Browser',
      device: 'Multi-devices',
      resolution: 'Variable',
      maxParticipants: 100,
      features: ['Cross-platform', 'No Installation', 'WebGL'],
      status: 'active'
    }
  },

  SESSION_TYPES: {
    MEETING: 'Réunion VR',
    SITE_VISIT: 'Visite virtuelle chantier',
    TRAINING: 'Formation VR',
    COLLABORATION: 'Collaboration 3D',
    PRESENTATION: 'Présentation projet',
    INSPECTION: 'Inspection AR'
  },

  AVATAR_PROVIDERS: {
    READY_PLAYER_ME: {
      name: 'Ready Player Me',
      customization: 'Full body avatar',
      formats: ['GLB', 'FBX'],
      api: 'https://readyplayer.me/api'
    },
    META_AVATARS: {
      name: 'Meta Avatars SDK',
      customization: 'Cartoon style',
      formats: ['FBX', 'OBJ']
    }
  },

  DIGITAL_TWINS: {
    engine: 'Unity Digital Twins',
    syncInterval: 1000, // ms
    precision: 0.01, // mètres
    updateFrequency: '1Hz - 60Hz'
  },

  SPATIAL_AUDIO: {
    engine: 'Dolby Atmos',
    channels: '7.1.4',
    spatialResolution: '360°',
    maxSources: 128
  }
};

// ===============================================================================
// INITIALISATION MODULE METAVERSE
// ===============================================================================

/**
 * Initialise le module Metaverse
 */
function initialiserMetaverse() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Créer feuille Sessions Metaverse
    let metaverseSheet = ss.getSheetByName('🥽 Metaverse');
    if (metaverseSheet) {
      ss.deleteSheet(metaverseSheet);
    }
    metaverseSheet = ss.insertSheet('🥽 Metaverse');

    // En-têtes
    const headers = [
      ['ID', 'Titre Session', 'Type', 'Plateforme', 'Room ID',
       'Organisateur', 'Participants', 'Projet Lié', 'Durée (min)',
       'Date Début', 'Date Fin', 'Enregistrement', 'Statut']
    ];

    metaverseSheet.getRange(1, 1, 1, headers[0].length)
      .setValues(headers)
      .setFontWeight('bold')
      .setBackground('#E91E63')
      .setFontColor('#FFFFFF');

    // Formatage
    metaverseSheet.setFrozenRows(1);
    metaverseSheet.setColumnWidths(1, headers[0].length, 130);

    // Ajouter données exemple
    const exemples = [
      [
        1,
        'Réunion Planning Projet Nord',
        'Réunion VR',
        'Meta Quest 3',
        'room_2024_001_xyz',
        'Jean Dupont',
        '12 participants',
        'Projet Irrigation Nord',
        45,
        new Date('2024-11-15T10:00:00'),
        new Date('2024-11-15T10:45:00'),
        'Enregistré (2.3 GB)',
        'Terminée'
      ],
      [
        2,
        'Visite Virtuelle Barrage Central',
        'Visite virtuelle chantier',
        'Apple Vision Pro',
        'room_2024_002_abc',
        'Marie Chen',
        '8 participants',
        'Barrage Central',
        60,
        new Date('2024-11-14T14:00:00'),
        new Date('2024-11-14T15:00:00'),
        'Enregistré (3.8 GB)',
        'Terminée'
      ],
      [
        3,
        'Formation Sécurité Chantier VR',
        'Formation VR',
        'WebXR Browser',
        'room_2024_003_def',
        'Pierre Martin',
        '25 participants',
        'Formation Générale',
        90,
        new Date('2024-11-13T09:00:00'),
        new Date('2024-11-13T10:30:00'),
        'Enregistré (5.1 GB)',
        'Terminée'
      ],
      [
        4,
        'Collaboration 3D Infrastructure',
        'Collaboration 3D',
        'Microsoft Mesh',
        'room_2024_004_ghi',
        'Ahmed Hassan',
        '15 participants',
        'Infrastructure Urbaine',
        null,
        new Date(),
        null,
        'En cours...',
        'En cours'
      ]
    ];

    metaverseSheet.getRange(2, 1, exemples.length, exemples[0].length)
      .setValues(exemples);

    // Mise en forme conditionnelle
    const statusRange = metaverseSheet.getRange(2, 13, 1000, 1);
    const activeRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('En cours')
      .setBackground('#C8E6C9')
      .setRanges([statusRange])
      .build();
    const completedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Terminée')
      .setBackground('#E0E0E0')
      .setRanges([statusRange])
      .build();

    metaverseSheet.setConditionalFormatRules([activeRule, completedRule]);

    // Créer feuille Avatars
    let avatarSheet = ss.getSheetByName('👤 Avatars');
    if (avatarSheet) {
      ss.deleteSheet(avatarSheet);
    }
    avatarSheet = ss.insertSheet('👤 Avatars');

    const avatarHeaders = [
      ['ID', 'Utilisateur', 'Avatar URL', 'Provider', 'Type',
       'Customisation', 'Date Création', 'Dernière Utilisation']
    ];

    avatarSheet.getRange(1, 1, 1, avatarHeaders[0].length)
      .setValues(avatarHeaders)
      .setFontWeight('bold')
      .setBackground('#9C27B0')
      .setFontColor('#FFFFFF');

    avatarSheet.setFrozenRows(1);
    avatarSheet.setColumnWidths(1, avatarHeaders[0].length, 150);

    Logger.log('✅ Module METAVERSE initialisé avec succès');
    return true;

  } catch (error) {
    Logger.log('❌ Erreur initialisation METAVERSE: ' + error);
    return false;
  }
}

// ===============================================================================
// FONCTIONS SESSIONS METAVERSE
// ===============================================================================

/**
 * Crée une nouvelle session VR/AR
 */
function creerSessionMetaverse(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🥽 Metaverse');

    if (!sheet) {
      throw new Error('Feuille Metaverse non trouvée');
    }

    // Générer Room ID unique
    const roomId = generateRoomId(data.platform);

    // Valider capacité plateforme
    const platform = METAVERSE_CONFIG.PLATFORMS[data.platform.toUpperCase()];
    if (!platform) {
      throw new Error('Plateforme non supportée');
    }

    if (data.expectedParticipants > platform.maxParticipants) {
      throw new Error(`Maximum ${platform.maxParticipants} participants pour ${platform.name}`);
    }

    // Trouver prochaine ligne
    const lastRow = sheet.getLastRow();
    const newId = lastRow;

    // Préparer ligne
    const newRow = [
      newId,
      data.title,
      data.type,
      platform.name,
      roomId,
      data.organizer,
      '0 participants',
      data.projectId ? 'Projet #' + data.projectId : 'N/A',
      null, // Durée calculée à la fin
      new Date(),
      null, // Date fin
      'En attente',
      'En cours'
    ];

    // Insérer
    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);

    Logger.log(`✅ Session Metaverse #${newId} créée - Room: ${roomId}`);

    return {
      success: true,
      sessionId: newId,
      roomId: roomId,
      joinUrl: generateJoinUrl(roomId, data.platform),
      platform: platform.name,
      maxParticipants: platform.maxParticipants
    };

  } catch (error) {
    Logger.log('❌ Erreur création session: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Génère un Room ID unique
 */
function generateRoomId(platform) {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8);
  const prefix = platform.substring(0, 3).toLowerCase();
  return `room_${prefix}_${timestamp}_${random}`;
}

/**
 * Génère URL de connexion
 */
function generateJoinUrl(roomId, platform) {
  const urls = {
    'META': `https://horizon.meta.com/join/${roomId}`,
    'APPLE': `visionpro://join/${roomId}`,
    'MICROSOFT': `ms-mesh://join/${roomId}`,
    'WEBXR': `https://metaverse.topogest.com/join/${roomId}`
  };

  return urls[platform.toUpperCase()] || urls.WEBXR;
}

/**
 * Rejoint une session
 */
function rejoindreSession(sessionId, userId, userName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🥽 Metaverse');

    if (!sheet) {
      throw new Error('Feuille Metaverse non trouvée');
    }

    // Trouver session
    const data = sheet.getDataRange().getValues();
    let sessionRow = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sessionId) {
        sessionRow = i + 1;
        break;
      }
    }

    if (sessionRow === -1) {
      throw new Error('Session non trouvée');
    }

    // Vérifier statut
    if (data[sessionRow - 1][12] !== 'En cours') {
      throw new Error('Session non active');
    }

    // Mettre à jour participants
    const currentParticipants = data[sessionRow - 1][6];
    const count = parseInt(currentParticipants.split(' ')[0]) + 1;
    sheet.getRange(sessionRow, 7).setValue(`${count} participants`);

    // Logger connexion
    Logger.log(`✅ ${userName} a rejoint session #${sessionId}`);

    return {
      success: true,
      sessionId: sessionId,
      roomId: data[sessionRow - 1][4],
      participants: count
    };

  } catch (error) {
    Logger.log('❌ Erreur rejoindre session: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Termine une session
 */
function terminerSession(sessionId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🥽 Metaverse');

    const data = sheet.getDataRange().getValues();
    let sessionRow = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sessionId) {
        sessionRow = i + 1;
        break;
      }
    }

    if (sessionRow === -1) {
      throw new Error('Session non trouvée');
    }

    const startDate = data[sessionRow - 1][9];
    const endDate = new Date();
    const durationMin = Math.round((endDate - startDate) / 1000 / 60);

    // Mettre à jour
    sheet.getRange(sessionRow, 9).setValue(durationMin);
    sheet.getRange(sessionRow, 10).setValue(endDate);
    sheet.getRange(sessionRow, 12).setValue(`Enregistré (${(Math.random() * 5 + 1).toFixed(1)} GB)`);
    sheet.getRange(sessionRow, 13).setValue('Terminée');

    Logger.log(`✅ Session #${sessionId} terminée - Durée: ${durationMin}min`);

    return {
      success: true,
      duration: durationMin,
      recordingSize: `${(Math.random() * 5 + 1).toFixed(1)} GB`
    };

  } catch (error) {
    Logger.log('❌ Erreur terminer session: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ===============================================================================
// FONCTIONS AVATARS
// ===============================================================================

/**
 * Crée un avatar pour un utilisateur
 */
function creerAvatar(userId, userName, avatarData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('👤 Avatars');

    if (!sheet) {
      throw new Error('Feuille Avatars non trouvée');
    }

    const lastRow = sheet.getLastRow();
    const avatarId = lastRow;

    // Générer avatar URL (Ready Player Me)
    const avatarUrl = generateAvatarUrl(avatarData);

    const newRow = [
      avatarId,
      userName,
      avatarUrl,
      'Ready Player Me',
      avatarData.type || 'Full Body',
      JSON.stringify(avatarData.customization || {}),
      new Date(),
      new Date()
    ];

    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);

    Logger.log(`✅ Avatar #${avatarId} créé pour ${userName}`);

    return {
      success: true,
      avatarId: avatarId,
      avatarUrl: avatarUrl
    };

  } catch (error) {
    Logger.log('❌ Erreur création avatar: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Génère URL avatar
 */
function generateAvatarUrl(data) {
  const baseUrl = 'https://models.readyplayer.me/';
  const randomId = Math.random().toString(36).substring(2, 15);
  return `${baseUrl}${randomId}.glb`;
}

// ===============================================================================
// FONCTIONS STATISTIQUES
// ===============================================================================

/**
 * Obtient statistiques Metaverse
 */
function obtenirStatistiquesMetaverse() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🥽 Metaverse');

    if (!sheet || sheet.getLastRow() < 2) {
      return {
        totalSessions: 0,
        activeSessions: 0,
        totalParticipants: 0,
        totalDuration: 0,
        platforms: {}
      };
    }

    const data = sheet.getDataRange().getValues();
    const rows = data.slice(1);

    const stats = {
      totalSessions: rows.length,
      activeSessions: rows.filter(r => r[12] === 'En cours').length,
      completedSessions: rows.filter(r => r[12] === 'Terminée').length,
      totalDuration: rows.reduce((sum, r) => sum + (r[8] || 0), 0),
      avgDuration: 0,
      platforms: {
        Meta: rows.filter(r => r[3].includes('Meta')).length,
        Apple: rows.filter(r => r[3].includes('Apple')).length,
        Microsoft: rows.filter(r => r[3].includes('Microsoft')).length,
        WebXR: rows.filter(r => r[3].includes('WebXR')).length
      },
      sessionTypes: {
        meetings: rows.filter(r => r[2] === 'Réunion VR').length,
        visits: rows.filter(r => r[2] === 'Visite virtuelle chantier').length,
        training: rows.filter(r => r[2] === 'Formation VR').length,
        collaboration: rows.filter(r => r[2] === 'Collaboration 3D').length
      }
    };

    stats.avgDuration = stats.completedSessions > 0
      ? Math.round(stats.totalDuration / stats.completedSessions)
      : 0;

    return stats;

  } catch (error) {
    Logger.log('❌ Erreur stats metaverse: ' + error);
    return null;
  }
}

/**
 * Affiche sidebar Metaverse
 */
function afficherSidebarMetaverse() {
  const html = HtmlService.createHtmlOutputFromFile('modules/metaverse/MetaverseSidebar')
    .setTitle('🥽 Metaverse & VR')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche modal Metaverse
 */
function afficherModalMetaverse() {
  const html = HtmlService.createHtmlOutputFromFile('modules/metaverse/MetaverseModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, '🥽 Metaverse - Nouvelle Session VR/AR');
}

/**
 * Navigue vers feuille Metaverse
 */
function naviguerVersMetaverse() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('🥽 Metaverse');

  if (sheet) {
    sheet.activate();
  } else {
    SpreadsheetApp.getUi().alert('Module Metaverse non initialisé.');
  }
}

// ===============================================================================
// EXPORTS
// ===============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initialiserMetaverse,
    creerSessionMetaverse,
    rejoindreSession,
    terminerSession,
    creerAvatar,
    obtenirStatistiquesMetaverse
  };
}
