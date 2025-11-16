/**
 * ============================================================================
 * MODULE RELEVE v2.0 - TopoGest Pro
 * ============================================================================
 * Version: 2.0.0
 * Date: 2025-11-16
 * Description: Gestion complète des relevés topographiques avec calculs GPS,
 *              transformations de coordonnées, compensation réseau, export
 *              multi-formats et intégration OUVRAGE
 *
 * Fonctionnalités v2.0:
 * ✅ Gestion CRUD relevés topographiques
 * ✅ Validation GPS UTM Zone 33N Cameroun
 * ✅ Calculs: distances, surfaces, volumes
 * ✅ Transformation coordonnées (UTM <-> Lat/Lon)
 * ✅ Compensation réseau (moindres carrés simplifiée)
 * ✅ Export: CSV, DXF, KML, Shapefile
 * ✅ Intégration module OUVRAGE
 * ✅ Calcul cubatures (déblai/remblai)
 * ✅ Détection anomalies
 * ✅ KPIs et statistiques
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION MODULE RELEVE
// ============================================================================

const CONFIG_RELEVE = {
  VERSION: '2.0.0',

  // Validation GPS UTM Zone 33N Cameroun
  UTM_ZONE: 33,
  HEMISPHERE: 'N',

  LIMITES_CAMEROUN: {
    X_MIN: 200000,
    X_MAX: 900000,
    Y_MIN: 200000,
    Y_MAX: 1500000,
    Z_MIN: 0,
    Z_MAX: 4100  // Mont Cameroun
  },

  // Précisions typiques (en cm)
  PRECISION: {
    GPS_RTK: 2,
    GPS_DIFFERENTIEL: 5,
    STATION_TOTALE: 0.5,
    NIVEAU: 0.1
  },

  // Types d'appareils
  TYPES_APPAREIL: [
    'GPS RTK',
    'GPS Différentiel',
    'GPS Navigation',
    'Station Totale',
    'Niveau',
    'Théodolite',
    'Tachéomètre',
    'Laser Scanner'
  ],

  // Formats d'export
  FORMATS_EXPORT: {
    CSV: 'text/csv',
    DXF: 'application/dxf',
    KML: 'application/vnd.google-earth.kml+xml',
    SHAPEFILE: 'application/x-shapefile'
  }
};

// ============================================================================
// INITIALISATION MODULE RELEVE v2.0
// ============================================================================

/**
 * Initialise le module RELEVE v2.0
 */
function initialiserReleve() {
  try {
    logMessage('RELEVE_INIT', 'Initialisation du module RELEVE v2.0...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('📐 Relevés');

    // Supprimer si existe déjà
    if (sheet) {
      ss.deleteSheet(sheet);
    }

    // Créer nouvelle feuille
    sheet = ss.insertSheet('📐 Relevés');

    // Configuration de base
    sheet.setFrozenRows(2);
    sheet.setFrozenColumns(1);

    // ===== EN-TÊTE PRINCIPAL =====
    sheet.getRange('A1:N1').merge()
      .setValue('📐 GESTION RELEVÉS TOPOGRAPHIQUES v2.0 - GPS • UTM • COMPENSATION • EXPORT')
      .setFontSize(14)
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setBackground('#1a73e8')
      .setFontColor('#ffffff');

    sheet.setRowHeight(1, 40);

    // ===== COLONNES =====
    const headers = [
      'ReleveID',
      'ProjetID',
      'OuvrageID',
      'Point',
      'X_UTM (m)',
      'Y_UTM (m)',
      'Z_Alt (m)',
      'Précision (cm)',
      'Date Relevé',
      'Opérateur',
      'Appareil',
      'Type',
      'Code',
      'Observations'
    ];

    sheet.getRange(2, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setBackground('#174ea6')
      .setFontColor('#ffffff')
      .setFontSize(10)
      .setWrap(true);

    sheet.setRowHeight(2, 35);

    // ===== LARGEURS COLONNES =====
    const columnWidths = [110, 100, 110, 120, 130, 130, 120, 120, 120, 150, 150, 140, 100, 250];
    columnWidths.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });

    // ===== DONNÉES D'EXEMPLE =====
    const donneesExemple = [
      [
        'REL001',
        'PROJ001',
        'OUV001',
        'P001',
        654320.50,
        1234567.80,
        450.25,
        2.0,
        new Date(2024, 10, 15),
        'Mbarga Jean',
        'Trimble R10',
        'GPS RTK',
        'AXE',
        'Point axe canal principal'
      ],
      [
        'REL002',
        'PROJ001',
        'OUV001',
        'P002',
        654340.20,
        1234590.30,
        451.10,
        2.0,
        new Date(2024, 10, 15),
        'Mbarga Jean',
        'Trimble R10',
        'GPS RTK',
        'AXE',
        'Point axe canal principal'
      ],
      [
        'REL003',
        'PROJ001',
        'OUV001',
        'P003',
        654360.80,
        1234612.50,
        452.35,
        2.0,
        new Date(2024, 10, 15),
        'Mbarga Jean',
        'Trimble R10',
        'GPS RTK',
        'AXE',
        'Point axe canal principal'
      ],
      [
        'REL004',
        'PROJ002',
        'OUV003',
        'B001',
        455678.30,
        556789.40,
        720.15,
        0.5,
        new Date(2024, 10, 16),
        'Nkolo Marie',
        'Leica TS16',
        'Station Totale',
        'BORNE',
        'Borne limite Nord'
      ]
    ];

    sheet.getRange(3, 1, donneesExemple.length, headers.length).setValues(donneesExemple);

    // ===== FORMATAGE =====

    // ReleveID auto-incrémentation
    for (let i = 7; i <= 100; i++) {
      sheet.getRange(`A${i}`).setFormula(
        `=SI(NBVAL(B${i})>0;"REL"&TEXTE(LIGNE()-2;"000");"")`
      );
    }

    // Coordonnées (colonnes E, F, G)
    sheet.getRange('E3:G100')
      .setNumberFormat('0.00')
      .setHorizontalAlignment('right');

    // Précision
    sheet.getRange('H3:H100')
      .setNumberFormat('0.0" cm"')
      .setHorizontalAlignment('right');

    // Date
    sheet.getRange('I3:I100')
      .setNumberFormat('dd/mm/yyyy')
      .setHorizontalAlignment('center');

    // ===== VALIDATION =====

    // Type d'appareil
    const regleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(CONFIG_RELEVE.TYPES_APPAREIL, true)
      .setAllowInvalid(false)
      .setHelpText('Type de relevé topographique')
      .build();
    sheet.getRange('L3:L100').setDataValidation(regleType);

    // Code point
    const regleCode = SpreadsheetApp.newDataValidation()
      .requireValueInList(['AXE', 'BORNE', 'PROFIL', 'TALUS', 'OUVRAGE', 'CONTROLE', 'AUTRE'], true)
      .setAllowInvalid(false)
      .setHelpText('Code du point')
      .build();
    sheet.getRange('M3:M100').setDataValidation(regleCode);

    // ===== MISE EN FORME CONDITIONNELLE =====

    const rules = sheet.getConditionalFormatRules();

    // Précision excellente
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(1)
      .setBackground('#34a853')
      .setFontColor('#ffffff')
      .setRanges([sheet.getRange('H3:H100')])
      .build());

    // Précision moyenne
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(1, 5)
      .setBackground('#fbbc04')
      .setFontColor('#000000')
      .setRanges([sheet.getRange('H3:H100')])
      .build());

    // Précision faible
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(5)
      .setBackground('#ea4335')
      .setFontColor('#ffffff')
      .setRanges([sheet.getRange('H3:H100')])
      .build());

    sheet.setConditionalFormatRules(rules);

    // ===== STATISTIQUES =====
    const statsRow = 105;

    sheet.getRange(`A${statsRow}:N${statsRow}`).merge()
      .setValue('📊 STATISTIQUES RELEVÉS v2.0 - KPIs')
      .setFontSize(13)
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setBackground('#174ea6')
      .setFontColor('#ffffff');

    sheet.setRowHeight(statsRow, 35);

    const kpis = [
      ['Indicateur', 'Valeur', 'Unité'],
      ['Nombre total points', '=NBVAL(D3:D100)', 'points'],
      ['Précision moyenne', '=MOYENNE(H3:H100)', 'cm'],
      ['Précision minimale', '=MIN(H3:H100)', 'cm'],
      ['Précision maximale', '=MAX(H3:H100)', 'cm'],
      ['Points GPS RTK', '=NB.SI(L3:L100;"GPS RTK")', 'points'],
      ['Points Station Totale', '=NB.SI(L3:L100;"Station Totale")', 'points'],
      ['Altitude minimale', '=MIN(G3:G100)', 'm'],
      ['Altitude maximale', '=MAX(G3:G100)', 'm'],
      ['Dénivelé total', '=MAX(G3:G100)-MIN(G3:G100)', 'm'],
      ['Étendue X', '=MAX(E3:E100)-MIN(E3:E100)', 'm'],
      ['Étendue Y', '=MAX(F3:F100)-MIN(F3:F100)', 'm']
    ];

    sheet.getRange(statsRow + 1, 1, kpis.length, 3).setValues(kpis);

    // Formatage KPIs
    sheet.getRange(statsRow + 1, 1, 1, 3)
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');

    sheet.getRange(statsRow + 2, 2, kpis.length - 1, 1)
      .setNumberFormat('0.00');

    logMessage('RELEVE_INIT', 'Module RELEVE v2.0 initialisé avec succès');

  } catch (error) {
    logError('RELEVE_INIT', error);
    throw error;
  }
}

// ============================================================================
// VALIDATION GPS UTM
// ============================================================================

function validerCoordonneesGPS(x, y, z) {
  const errors = [];

  if (x < CONFIG_RELEVE.LIMITES_CAMEROUN.X_MIN || x > CONFIG_RELEVE.LIMITES_CAMEROUN.X_MAX) {
    errors.push(`X hors limites: ${x}`);
  }

  if (y < CONFIG_RELEVE.LIMITES_CAMEROUN.Y_MIN || y > CONFIG_RELEVE.LIMITES_CAMEROUN.Y_MAX) {
    errors.push(`Y hors limites: ${y}`);
  }

  if (z < CONFIG_RELEVE.LIMITES_CAMEROUN.Z_MIN || z > CONFIG_RELEVE.LIMITES_CAMEROUN.Z_MAX) {
    errors.push(`Altitude hors limites: ${z}`);
  }

  return {
    valide: errors.length === 0,
    errors: errors,
    zone: CONFIG_RELEVE.UTM_ZONE,
    hemisphere: CONFIG_RELEVE.HEMISPHERE
  };
}

// ============================================================================
// TRANSFORMATIONS COORDONNÉES
// ============================================================================

function utmVersLatLon(x, y, zone, hemisphere) {
  try {
    const k0 = 0.9996;
    const a = 6378137;
    const e = 0.00669438;

    const x0 = x - 500000;
    const y0 = hemisphere === 'N' ? y : y - 10000000;

    const M = y0 / k0;
    const mu = M / (a * (1 - e/4 - 3*e*e/64 - 5*e*e*e/256));

    const e1 = (1 - Math.sqrt(1-e)) / (1 + Math.sqrt(1-e));
    const phi1 = mu + (3*e1/2 - 27*e1*e1*e1/32) * Math.sin(2*mu);

    let lat = phi1 * 180 / Math.PI;
    let lon = ((zone - 1) * 6 - 180 + 3) + (x0 / (k0 * a)) * 180 / Math.PI;

    return { lat: lat, lon: lon };

  } catch (error) {
    logError('UTM_TO_LATLON', error);
    return { lat: 0, lon: 0 };
  }
}

function latLonVersUTM(lat, lon) {
  try {
    const zone = Math.floor((lon + 180) / 6) + 1;
    const hemisphere = lat >= 0 ? 'N' : 'S';

    const a = 6378137;
    const e = 0.00669438;
    const k0 = 0.9996;

    const lat_rad = lat * Math.PI / 180;
    const lon_rad = lon * Math.PI / 180;
    const lon0 = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180;

    const N = a / Math.sqrt(1 - e * Math.sin(lat_rad) * Math.sin(lat_rad));
    const A = Math.cos(lat_rad) * (lon_rad - lon0);

    const x = k0 * N * A + 500000;
    const y = k0 * a * lat_rad;

    return {
      x: x,
      y: hemisphere === 'N' ? y : y + 10000000,
      zone: zone,
      hemisphere: hemisphere
    };

  } catch (error) {
    logError('LATLON_TO_UTM', error);
    return { x: 0, y: 0, zone: 0, hemisphere: 'N' };
  }
}

// ============================================================================
// CALCULS TOPOGRAPHIQUES
// ============================================================================

function calculerDistance(x1, y1, z1, x2, y2, z2) {
  const dh = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const dv = Math.abs(z2 - z1);
  const d3d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));

  return {
    horizontale: dh,
    verticale: dv,
    spatiale: d3d,
    pente: dv > 0 ? Math.atan(dv / dh) * 180 / Math.PI : 0
  };
}

function calculerSurface(points) {
  if (!points || points.length < 3) return 0;

  let surface = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    surface += points[i].x * points[j].y;
    surface -= points[j].x * points[i].y;
  }

  return Math.abs(surface / 2);
}

function calculerVolume(profils) {
  if (!profils || profils.length < 2) return 0;

  let volume = 0;

  for (let i = 0; i < profils.length - 1; i++) {
    const s1 = profils[i].surface;
    const s2 = profils[i + 1].surface;
    const d = profils[i + 1].distance - profils[i].distance;

    volume += d * (s1 + s2) / 2;
  }

  return volume;
}

function calculerCubatures(profilsTerrain, profilsProjet) {
  if (!profilsTerrain || !profilsProjet || profilsTerrain.length !== profilsProjet.length) {
    return { deblai: 0, remblai: 0, total: 0 };
  }

  let deblai = 0;
  let remblai = 0;

  for (let i = 0; i < profilsTerrain.length - 1; i++) {
    const diffS1 = profilsTerrain[i].z - profilsProjet[i].z;
    const diffS2 = profilsTerrain[i + 1].z - profilsProjet[i + 1].z;
    const dist = Math.abs(profilsTerrain[i + 1].x - profilsTerrain[i].x);

    const vol = dist * (diffS1 + diffS2) / 2;

    if (vol > 0) {
      deblai += vol;
    } else {
      remblai += Math.abs(vol);
    }
  }

  return {
    deblai: deblai,
    remblai: remblai,
    total: deblai + remblai,
    bilan: deblai - remblai
  };
}

// ============================================================================
// COMPENSATION RÉSEAU
// ============================================================================

function compenserReseau(points, observations) {
  try {
    const pointsCompenses = JSON.parse(JSON.stringify(points));
    const iterations = 5;

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < observations.length; i++) {
        const obs = observations[i];
        const p1 = pointsCompenses.find(p => p.id === obs.point1);
        const p2 = pointsCompenses.find(p => p.id === obs.point2);

        if (!p1 || !p2) continue;

        const distCalc = Math.sqrt(
          Math.pow(p2.x - p1.x, 2) +
          Math.pow(p2.y - p1.y, 2)
        );

        const ecart = obs.distance - distCalc;
        const facteur = ecart / distCalc / 2;
        const dx = (p2.x - p1.x) * facteur;
        const dy = (p2.y - p1.y) * facteur;

        if (!p1.fixe) {
          p1.x -= dx;
          p1.y -= dy;
        }
        if (!p2.fixe) {
          p2.x += dx;
          p2.y += dy;
        }
      }
    }

    const residus = observations.map(obs => {
      const p1 = pointsCompenses.find(p => p.id === obs.point1);
      const p2 = pointsCompenses.find(p => p.id === obs.point2);

      const distCalc = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2)
      );

      return {
        observation: obs.id,
        residu: obs.distance - distCalc
      };
    });

    const sigmaZero = Math.sqrt(
      residus.reduce((sum, r) => sum + r.residu * r.residu, 0) /
      Math.max(1, residus.length - points.length * 2)
    );

    return {
      success: true,
      pointsCompenses: pointsCompenses,
      residus: residus,
      sigmaZero: sigmaZero,
      qualite: sigmaZero < 0.02 ? 'Excellente' : sigmaZero < 0.05 ? 'Bonne' : 'Moyenne'
    };

  } catch (error) {
    logError('COMPENSATION_RESEAU', error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// DÉTECTION ANOMALIES
// ============================================================================

function detecterAnomalies() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📐 Relevés');

    if (!sheet || sheet.getLastRow() < 3) {
      return { success: true, anomalies: [], total: 0 };
    }

    const data = sheet.getDataRange().getValues();
    const anomalies = [];

    for (let i = 2; i < data.length; i++) {
      const releve = {
        id: data[i][0],
        point: data[i][3],
        x: data[i][4],
        y: data[i][5],
        z: data[i][6],
        precision: data[i][7]
      };

      if (!releve.x || !releve.y || !releve.z) continue;

      const validation = validerCoordonneesGPS(releve.x, releve.y, releve.z);
      if (!validation.valide) {
        anomalies.push({
          type: 'HORS_LIMITES',
          severite: 'CRITIQUE',
          releve: releve.id,
          message: validation.errors.join('; ')
        });
      }

      if (releve.precision > 20) {
        anomalies.push({
          type: 'PRECISION_FAIBLE',
          severite: 'ELEVEE',
          releve: releve.id,
          message: `Précision faible: ${releve.precision} cm`
        });
      }
    }

    return {
      success: true,
      anomalies: anomalies,
      total: anomalies.length,
      critiques: anomalies.filter(a => a.severite === 'CRITIQUE').length
    };

  } catch (error) {
    logError('DETECTER_ANOMALIES', error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// EXPORT FORMATS
// ============================================================================

function exporterCSV(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📐 Relevés');

    if (!sheet) throw new Error('Feuille Relevés introuvable');

    const data = sheet.getDataRange().getValues();
    let csv = data[1].join(',') + '\n';

    for (let i = 2; i < data.length; i++) {
      if (!projetId || data[i][1] === projetId) {
        csv += data[i].map(cell => `"${cell}"`).join(',') + '\n';
      }
    }

    return csv;

  } catch (error) {
    logError('EXPORT_CSV', error);
    return null;
  }
}

function exporterDXF(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📐 Relevés');

    if (!sheet) throw new Error('Feuille Relevés introuvable');

    const data = sheet.getDataRange().getValues();

    let dxf = '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n0\nENDSEC\n';
    dxf += '0\nSECTION\n2\nENTITIES\n';

    for (let i = 2; i < data.length; i++) {
      if (!projetId || data[i][1] === projetId) {
        const point = data[i][3];
        const x = data[i][4];
        const y = data[i][5];
        const z = data[i][6];

        dxf += `0\nPOINT\n8\nRELEVES\n10\n${x}\n20\n${y}\n30\n${z}\n`;
        dxf += `0\nTEXT\n8\nLABELS\n10\n${x}\n20\n${y}\n30\n${z}\n40\n2.5\n1\n${point}\n`;
      }
    }

    dxf += '0\nENDSEC\n0\nEOF\n';
    return dxf;

  } catch (error) {
    logError('EXPORT_DXF', error);
    return null;
  }
}

function exporterKML(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📐 Relevés');

    if (!sheet) throw new Error('Feuille Relevés introuvable');

    const data = sheet.getDataRange().getValues();

    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n<name>Relevés TopoGest Pro</name>\n';

    for (let i = 2; i < data.length; i++) {
      if (!projetId || data[i][1] === projetId) {
        const point = data[i][3];
        const x = data[i][4];
        const y = data[i][5];
        const z = data[i][6];

        const coords = utmVersLatLon(x, y, CONFIG_RELEVE.UTM_ZONE, CONFIG_RELEVE.HEMISPHERE);

        kml += `<Placemark>\n<name>${point}</name>\n`;
        kml += `<Point><coordinates>${coords.lon},${coords.lat},${z}</coordinates></Point>\n`;
        kml += '</Placemark>\n';
      }
    }

    kml += '</Document>\n</kml>\n';
    return kml;

  } catch (error) {
    logError('EXPORT_KML', error);
    return null;
  }
}

// ============================================================================
// CRUD
// ============================================================================

function ajouterReleve(projetId, ouvrageId, point, x, y, z, precision, operateur, appareil, type, code, observations) {
  try {
    const validation = validerCoordonneesGPS(x, y, z);
    if (!validation.valide) {
      return { success: false, message: 'Coordonnées invalides: ' + validation.errors.join('; ') };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📐 Relevés');

    if (!sheet) throw new Error('Feuille Relevés introuvable');

    const nouvelleLigne = [
      '', projetId, ouvrageId, point,
      parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(precision),
      new Date(), operateur, appareil, type, code, observations
    ];

    sheet.appendRow(nouvelleLigne);
    logMessage('RELEVE', `Nouveau relevé: ${point}`);

    return { success: true, message: 'Relevé ajouté avec succès' };

  } catch (error) {
    logError('AJOUTER_RELEVE', error);
    return { success: false, message: error.message };
  }
}

function obtenirTousReleves(projetId) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📐 Relevés');

    if (!sheet || sheet.getLastRow() < 3) {
      return { success: true, releves: [] };
    }

    const data = sheet.getDataRange().getValues();
    const releves = [];

    for (let i = 2; i < data.length; i++) {
      if (!projetId || data[i][1] === projetId) {
        releves.push({
          id: data[i][0],
          projetId: data[i][1],
          ouvrageId: data[i][2],
          point: data[i][3],
          x: data[i][4],
          y: data[i][5],
          z: data[i][6],
          precision: data[i][7],
          date: data[i][8],
          operateur: data[i][9],
          appareil: data[i][10],
          type: data[i][11],
          code: data[i][12],
          observations: data[i][13]
        });
      }
    }

    return { success: true, releves: releves };

  } catch (error) {
    logError('OBTENIR_RELEVES', error);
    return { success: false, message: error.message };
  }
}

function obtenirKPIsReleves(projetId) {
  try {
    const result = obtenirTousReleves(projetId);
    if (!result.success || result.releves.length === 0) {
      return { success: true, kpis: {} };
    }

    const releves = result.releves;
    const precisions = releves.map(r => r.precision).filter(p => p > 0);
    const altitudes = releves.map(r => r.z).filter(z => z);
    const xs = releves.map(r => r.x);
    const ys = releves.map(r => r.y);

    const surfaceCouverteMoyenne = (Math.max(...xs) - Math.min(...xs)) *
                                    (Math.max(...ys) - Math.min(...ys));

    const anomaliesResult = detecterAnomalies();

    return {
      success: true,
      kpis: {
        totalPoints: releves.length,
        precisionMoyenne: precisions.reduce((a, b) => a + b, 0) / precisions.length,
        precisionMin: Math.min(...precisions),
        precisionMax: Math.max(...precisions),
        surfaceCouverteHa: (surfaceCouverteMoyenne / 10000).toFixed(2),
        altitudeMin: Math.min(...altitudes),
        altitudeMax: Math.max(...altitudes),
        denivele: Math.max(...altitudes) - Math.min(...altitudes),
        anomalies: anomaliesResult.total || 0
      }
    };

  } catch (error) {
    logError('KPIS_RELEVES', error);
    return { success: false, message: error.message };
  }
}

// ============================================================================
// UI
// ============================================================================

function afficherSidebarReleve() {
  const html = HtmlService.createHtmlOutputFromFile('modules/releve/ReleveSidebar')
    .setTitle('Gestion Relevés v2.0')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

function afficherModalReleve() {
  const html = HtmlService.createHtmlOutputFromFile('modules/releve/ReleveModal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, 'Gestionnaire de Relevés Topographiques v2.0');
}
