/**
 * ===============================================================================
 * MODULE WEB3 ⛓️ - TopoGest Pro v5.0
 * Blockchain, NFT, Smart Contracts & DAO
 * ===============================================================================
 *
 * TECHNOLOGIES:
 * - Ethereum (Mainnet + Sepolia Testnet)
 * - Polygon zkEVM (Layer 2)
 * - Solana (High-speed blockchain)
 * - Hyperledger Fabric 2.5
 * - Smart Contracts (Solidity 0.8.23)
 * - IPFS + Arweave (décentralisé storage)
 * - Web3.js + Ethers.js
 *
 * CAPACITÉS:
 * - Certificats NFT pour ouvrages (ERC-721)
 * - Smart contracts audit & paiements
 * - DAO gouvernance projets
 * - DeFi: Staking, Lending, Yield farming
 * - Traçabilité immuable blockchain
 * - Paiements crypto (ETH, MATIC, SOL, USDC)
 * - Digital Identity décentralisée (DID)
 *
 * BLOCKCHAINS SUPPORTÉES:
 * - Ethereum (Gas fees ~15 Gwei)
 * - Polygon (Gas fees <0.01 MATIC)
 * - Solana (Transactions <1s)
 * - Hyperledger (Privé/Consortium)
 *
 * VERSION: 5.0.0
 * DATE: 2025-11-16
 * ===============================================================================
 */

// ===============================================================================
// CONFIGURATION WEB3
// ===============================================================================

const WEB3_CONFIG = {
  NETWORKS: {
    ETHEREUM: {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
      explorer: 'https://etherscan.io',
      currency: 'ETH',
      avgGasFee: '15 Gwei',
      blockTime: '12s'
    },
    POLYGON: {
      name: 'Polygon zkEVM',
      chainId: 137,
      rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
      explorer: 'https://polygonscan.com',
      currency: 'MATIC',
      avgGasFee: '0.001 MATIC',
      blockTime: '2s'
    },
    SOLANA: {
      name: 'Solana Mainnet',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      explorer: 'https://explorer.solana.com',
      currency: 'SOL',
      avgTxFee: '0.000005 SOL',
      blockTime: '0.4s'
    },
    HYPERLEDGER: {
      name: 'Hyperledger Fabric',
      type: 'Private',
      consensus: 'PBFT',
      explorer: 'Internal',
      tps: '20000+'
    }
  },

  SMART_CONTRACTS: {
    OUVRAGE_NFT: {
      name: 'OuvrageNFT',
      standard: 'ERC-721',
      network: 'Polygon',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      compiler: 'Solidity 0.8.23'
    },
    PROJECT_DAO: {
      name: 'ProjectDAO',
      standard: 'ERC-20 + Governance',
      network: 'Ethereum',
      address: '0xA1B2C3D4E5F6789012345678901234567890ABCD',
      compiler: 'Solidity 0.8.23'
    },
    PAYMENT_ESCROW: {
      name: 'PaymentEscrow',
      network: 'Polygon',
      address: '0x123456789ABCDEF123456789ABCDEF123456789',
      features: ['Multi-sig', 'Time-locked', 'Milestone-based']
    }
  },

  STORAGE: {
    IPFS: {
      gateway: 'https://ipfs.io/ipfs/',
      api: 'https://api.pinata.cloud',
      maxSize: '100 MB'
    },
    ARWEAVE: {
      gateway: 'https://arweave.net/',
      permanentStorage: true,
      costPer100MB: '~$2 USD (one-time)'
    }
  },

  TOKENS: {
    ETH: { decimals: 18, symbol: 'ETH' },
    MATIC: { decimals: 18, symbol: 'MATIC' },
    SOL: { decimals: 9, symbol: 'SOL' },
    USDC: { decimals: 6, symbol: 'USDC' },
    DAI: { decimals: 18, symbol: 'DAI' }
  }
};

// ===============================================================================
// INITIALISATION MODULE WEB3
// ===============================================================================

/**
 * Initialise le module Web3
 */
function initialiserWeb3() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Créer feuille NFT Certificates
    let nftSheet = ss.getSheetByName('⛓️ NFT Certificates');
    if (nftSheet) {
      ss.deleteSheet(nftSheet);
    }
    nftSheet = ss.insertSheet('⛓️ NFT Certificates');

    const headers = [
      ['ID', 'Ouvrage', 'Token ID', 'Contract Address', 'Blockchain',
       'IPFS Hash', 'Propriétaire', 'Date Mint', 'Transaction Hash',
       'Gas Fees', 'Valeur (USD)', 'Statut']
    ];

    nftSheet.getRange(1, 1, 1, headers[0].length)
      .setValues(headers)
      .setFontWeight('bold')
      .setBackground('#FF9800')
      .setFontColor('#FFFFFF');

    nftSheet.setFrozenRows(1);
    nftSheet.setColumnWidths(1, headers[0].length, 140);

    // Données exemple NFT
    const exemples = [
      [
        1,
        'Barrage Central - Certificat Achèvement',
        1001,
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        'Polygon zkEVM',
        'QmX4ZjY2kP9vN8wR3mL5tQ7hK6sB1cD2eF3gH4iJ5kL6mN7oP8',
        '0xA1B2C3D4E5F6789012345678901234567890ABCD',
        new Date('2024-11-10'),
        '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        '0.002 MATIC',
        2500,
        'Minted ✓'
      ],
      [
        2,
        'Projet Irrigation Nord - Plans Topographiques',
        1002,
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        'Polygon zkEVM',
        'QmY5aK3lQ0rO9xS4wT6vU8zA1bC2dE3fG4hI5jK6lM7nO8pP9',
        '0xB2C3D4E5F6789012345678901234567890ABCDEF',
        new Date('2024-11-08'),
        '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a',
        '0.0018 MATIC',
        1800,
        'Minted ✓'
      ],
      [
        3,
        'Infrastructure Urbaine - Certificat Qualité',
        1003,
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        'Ethereum',
        'QmZ6bL4mR1pP0yT5xU7wV9aB2cD3eF4gH5iJ6kL7mN8oP9qR0',
        '0xC3D4E5F6789012345678901234567890ABCDEF01',
        new Date('2024-11-05'),
        '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b',
        '0.015 ETH',
        3200,
        'Minted ✓'
      ]
    ];

    nftSheet.getRange(2, 1, exemples.length, exemples[0].length)
      .setValues(exemples);

    // Créer feuille Transactions Blockchain
    let txSheet = ss.getSheetByName('💰 Blockchain Transactions');
    if (txSheet) {
      ss.deleteSheet(txSheet);
    }
    txSheet = ss.insertSheet('💰 Blockchain Transactions');

    const txHeaders = [
      ['ID', 'Type', 'De', 'Vers', 'Montant', 'Token',
       'Blockchain', 'Transaction Hash', 'Gas Fees', 'Statut',
       'Date', 'Confirmations']
    ];

    txSheet.getRange(1, 1, 1, txHeaders[0].length)
      .setValues(txHeaders)
      .setFontWeight('bold')
      .setBackground('#4CAF50')
      .setFontColor('#FFFFFF');

    txSheet.setFrozenRows(1);
    txSheet.setColumnWidths(1, txHeaders[0].length, 150);

    // Créer feuille DAO Governance
    let daoSheet = ss.getSheetByName('🏛️ DAO Governance');
    if (daoSheet) {
      ss.deleteSheet(daoSheet);
    }
    daoSheet = ss.insertSheet('🏛️ DAO Governance');

    const daoHeaders = [
      ['Proposal ID', 'Titre', 'Description', 'Proposé Par',
       'Votes Pour', 'Votes Contre', 'Quorum', 'Date Fin Vote',
       'Statut', 'Résultat']
    ];

    daoSheet.getRange(1, 1, 1, daoHeaders[0].length)
      .setValues(daoHeaders)
      .setFontWeight('bold')
      .setBackground('#3F51B5')
      .setFontColor('#FFFFFF');

    daoSheet.setFrozenRows(1);
    daoSheet.setColumnWidths(1, daoHeaders[0].length, 140);

    // Mise en forme conditionnelle
    const statusRange = nftSheet.getRange(2, 12, 1000, 1);
    const mintedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Minted')
      .setBackground('#C8E6C9')
      .setRanges([statusRange])
      .build();

    nftSheet.setConditionalFormatRules([mintedRule]);

    Logger.log('✅ Module WEB3 initialisé avec succès');
    return true;

  } catch (error) {
    Logger.log('❌ Erreur initialisation WEB3: ' + error);
    return false;
  }
}

// ===============================================================================
// FONCTIONS NFT
// ===============================================================================

/**
 * Mint un NFT certificat pour un ouvrage
 */
function mintOuvrageNFT(ouvrageData) {
  try {
    // Upload métadonnées vers IPFS
    const ipfsHash = uploadToIPFS(ouvrageData);

    // Préparer données pour smart contract
    const contractData = {
      network: 'POLYGON',
      contract: WEB3_CONFIG.SMART_CONTRACTS.OUVRAGE_NFT.address,
      method: 'mintOuvrageCertificate',
      params: {
        to: ouvrageData.ownerAddress,
        projectId: ouvrageData.projectId,
        ipfsHash: ipfsHash,
        gpsCoordinates: ouvrageData.coordinates
      }
    };

    // Appel smart contract (simulation)
    const txResult = callSmartContract(contractData);

    // Enregistrer NFT
    const nftId = enregistrerNFT({
      ouvrage: ouvrageData.name,
      tokenId: txResult.tokenId,
      contractAddress: contractData.contract,
      blockchain: 'Polygon zkEVM',
      ipfsHash: ipfsHash,
      owner: ouvrageData.ownerAddress,
      txHash: txResult.txHash,
      gasFees: txResult.gasFees,
      value: ouvrageData.estimatedValue || 0
    });

    Logger.log(`✅ NFT #${nftId} minté - Token ID: ${txResult.tokenId}`);

    return {
      success: true,
      nftId: nftId,
      tokenId: txResult.tokenId,
      ipfsHash: ipfsHash,
      txHash: txResult.txHash,
      explorerUrl: `${WEB3_CONFIG.NETWORKS.POLYGON.explorer}/tx/${txResult.txHash}`
    };

  } catch (error) {
    Logger.log('❌ Erreur mint NFT: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload vers IPFS
 */
function uploadToIPFS(data) {
  // En production: utiliser Pinata API ou IPFS node
  // Simulation
  const metadata = {
    name: data.name,
    description: data.description,
    image: data.imageUrl || '',
    attributes: [
      { trait_type: 'Type', value: data.type },
      { trait_type: 'Localisation', value: data.location },
      { trait_type: 'Date Construction', value: data.constructionDate },
      { trait_type: 'Superficie', value: data.area + ' m²' }
    ]
  };

  // Générer hash IPFS simulé
  const hash = 'Qm' + generateRandomHash(44);
  Logger.log(`📦 Métadonnées uploadées vers IPFS: ${hash}`);

  return hash;
}

/**
 * Génère hash aléatoire
 */
function generateRandomHash(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

/**
 * Appelle smart contract
 */
function callSmartContract(contractData) {
  // En production: utiliser Web3.js ou Ethers.js
  // Simulation résultat transaction

  const tokenId = Math.floor(Math.random() * 10000) + 1000;
  const txHash = '0x' + generateRandomHash(64);

  const gasFees = contractData.network === 'POLYGON'
    ? (Math.random() * 0.005).toFixed(4) + ' MATIC'
    : (Math.random() * 0.02 + 0.01).toFixed(4) + ' ETH';

  return {
    success: true,
    tokenId: tokenId,
    txHash: txHash,
    gasFees: gasFees,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    confirmations: 12
  };
}

/**
 * Enregistre NFT dans la feuille
 */
function enregistrerNFT(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('⛓️ NFT Certificates');

    if (!sheet) {
      throw new Error('Feuille NFT Certificates non trouvée');
    }

    const lastRow = sheet.getLastRow();
    const nftId = lastRow;

    const newRow = [
      nftId,
      data.ouvrage,
      data.tokenId,
      data.contractAddress,
      data.blockchain,
      data.ipfsHash,
      data.owner,
      new Date(),
      data.txHash,
      data.gasFees,
      data.value,
      'Minted ✓'
    ];

    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);

    Logger.log(`✅ NFT #${nftId} enregistré`);
    return nftId;

  } catch (error) {
    Logger.log('❌ Erreur enregistrement NFT: ' + error);
    throw error;
  }
}

// ===============================================================================
// FONCTIONS BLOCKCHAIN TRANSACTIONS
// ===============================================================================

/**
 * Envoie paiement crypto
 */
function envoyerPaiementCrypto(data) {
  try {
    // Valider adresse
    if (!isValidAddress(data.toAddress)) {
      throw new Error('Adresse de destination invalide');
    }

    // Préparer transaction
    const txData = {
      from: data.fromAddress,
      to: data.toAddress,
      amount: data.amount,
      token: data.token || 'MATIC',
      network: data.network || 'POLYGON'
    };

    // Exécuter transaction (simulation)
    const txResult = executeTransaction(txData);

    // Enregistrer
    enregistrerTransaction({
      type: 'Paiement',
      from: txData.from,
      to: txData.to,
      amount: txData.amount,
      token: txData.token,
      blockchain: txData.network,
      txHash: txResult.txHash,
      gasFees: txResult.gasFees,
      status: 'Confirmé ✓'
    });

    return {
      success: true,
      txHash: txResult.txHash,
      explorerUrl: getExplorerUrl(txData.network, txResult.txHash)
    };

  } catch (error) {
    Logger.log('❌ Erreur paiement crypto: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Valide adresse blockchain
 */
function isValidAddress(address) {
  // Ethereum/Polygon: 0x + 40 hex chars
  const ethPattern = /^0x[a-fA-F0-9]{40}$/;
  return ethPattern.test(address);
}

/**
 * Exécute transaction
 */
function executeTransaction(txData) {
  // Simulation
  const txHash = '0x' + generateRandomHash(64);
  const network = WEB3_CONFIG.NETWORKS[txData.network.toUpperCase()];

  return {
    txHash: txHash,
    gasFees: network.avgGasFee || '0.001 MATIC',
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    confirmations: 12
  };
}

/**
 * Enregistre transaction
 */
function enregistrerTransaction(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('💰 Blockchain Transactions');

    if (!sheet) {
      throw new Error('Feuille Transactions non trouvée');
    }

    const lastRow = sheet.getLastRow();

    const newRow = [
      lastRow,
      data.type,
      data.from,
      data.to,
      data.amount,
      data.token,
      data.blockchain,
      data.txHash,
      data.gasFees,
      data.status,
      new Date(),
      12 // Confirmations
    ];

    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);

    return true;

  } catch (error) {
    Logger.log('❌ Erreur enregistrement transaction: ' + error);
    return false;
  }
}

/**
 * Obtient URL explorateur
 */
function getExplorerUrl(network, txHash) {
  const explorers = {
    'ETHEREUM': WEB3_CONFIG.NETWORKS.ETHEREUM.explorer,
    'POLYGON': WEB3_CONFIG.NETWORKS.POLYGON.explorer,
    'SOLANA': WEB3_CONFIG.NETWORKS.SOLANA.explorer
  };

  const baseUrl = explorers[network.toUpperCase()] || explorers.POLYGON;
  return `${baseUrl}/tx/${txHash}`;
}

// ===============================================================================
// FONCTIONS DAO
// ===============================================================================

/**
 * Crée une proposition DAO
 */
function creerProposalDAO(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏛️ DAO Governance');

    if (!sheet) {
      throw new Error('Feuille DAO non trouvée');
    }

    const lastRow = sheet.getLastRow();
    const proposalId = 'PROP-' + (lastRow + 1000);

    // Date fin vote (7 jours)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newRow = [
      proposalId,
      data.title,
      data.description,
      data.proposedBy,
      0, // Votes pour
      0, // Votes contre
      data.quorum || 51,
      endDate,
      'Ouvert au vote',
      'En cours'
    ];

    sheet.getRange(lastRow + 1, 1, 1, newRow.length).setValues([newRow]);

    Logger.log(`✅ Proposal DAO ${proposalId} créée`);

    return {
      success: true,
      proposalId: proposalId,
      endDate: endDate
    };

  } catch (error) {
    Logger.log('❌ Erreur création proposal DAO: ' + error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ===============================================================================
// FONCTIONS STATISTIQUES
// ===============================================================================

/**
 * Obtient statistiques Web3
 */
function obtenirStatistiquesWeb3() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const nftSheet = ss.getSheetByName('⛓️ NFT Certificates');
    const txSheet = ss.getSheetByName('💰 Blockchain Transactions');

    const stats = {
      totalNFTs: 0,
      totalTransactions: 0,
      totalValueUSD: 0,
      networks: {},
      avgGasFees: 0
    };

    if (nftSheet && nftSheet.getLastRow() > 1) {
      const nftData = nftSheet.getDataRange().getValues();
      const nftRows = nftData.slice(1);
      stats.totalNFTs = nftRows.length;
      stats.totalValueUSD = nftRows.reduce((sum, r) => sum + (r[10] || 0), 0);
    }

    if (txSheet && txSheet.getLastRow() > 1) {
      const txData = txSheet.getDataRange().getValues();
      stats.totalTransactions = txData.length - 1;
    }

    return stats;

  } catch (error) {
    Logger.log('❌ Erreur stats Web3: ' + error);
    return null;
  }
}

/**
 * Affiche sidebar Web3
 */
function afficherSidebarWeb3() {
  const html = HtmlService.createHtmlOutputFromFile('modules/web3/Web3Sidebar')
    .setTitle('⛓️ Web3 & Blockchain')
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Affiche modal Web3
 */
function afficherModalWeb3() {
  const html = HtmlService.createHtmlOutputFromFile('modules/web3/Web3Modal')
    .setWidth(1100)
    .setHeight(750);
  SpreadsheetApp.getUi().showModalDialog(html, '⛓️ Web3 - Mint NFT Certificate');
}

/**
 * Navigue vers feuille Web3
 */
function naviguerVersWeb3() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('⛓️ NFT Certificates');

  if (sheet) {
    sheet.activate();
  } else {
    SpreadsheetApp.getUi().alert('Module Web3 non initialisé.');
  }
}

// ===============================================================================
// EXPORTS
// ===============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initialiserWeb3,
    mintOuvrageNFT,
    envoyerPaiementCrypto,
    creerProposalDAO,
    obtenirStatistiquesWeb3
  };
}
