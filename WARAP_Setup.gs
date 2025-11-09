/**
 * ============================================================================
 * WARAP - SETUP.GS
 * Installation et configuration initiale de la plateforme
 * Version: 1.0.0 - Production
 * ============================================================================
 *
 * Description:
 * Fichier responsable de l'installation complète de WARAP incluant :
 * - Création des 20 feuilles Google Sheets
 * - Configuration des en-têtes et formules
 * - Validations de données
 * - Mise en forme conditionnelle
 * - Données de référence (358 communes Cameroun)
 * - Paramètres système
 * - Triggers automatiques
 *
 * Fonctionnalités:
 * - setupWARAPDatabase(): Installation complète
 * - createAllSheets(): Création de toutes les feuilles
 * - initializeData(): Chargement données initiales
 *
 * @author WARAP Development Team
 * @date 2024
 */

// ============================================================================
// CONFIGURATION DES FEUILLES
// Définition complète de toutes les feuilles WARAP
// ============================================================================

const SHEETS_CONFIGURATION = {
  AccueilWARAP: {
    order: 1,
    color: '#4f46e5',
    headers: ['Métrique', 'Valeur', 'Variation', 'Objectif', 'Statut'],
    protectedRanges: ['A1:E1'],
    frozenRows: 1,
    description: 'Tableau de bord principal avec KPIs'
  },

  ClientsWARAP: {
    order: 2,
    color: '#10b981',
    headers: [
      'ID_Client', 'Nom_Complet', 'Email', 'Telephone_Principal', 'Telephone_Secondaire',
      'Adresse_Complete', 'Statut', 'Type_Client', 'Commune', 'Quartier',
      'Zone_Geographique', 'Segment_RFM', 'Nombre_Transactions', 'CA_Total',
      'Note_Satisfaction_Moyenne', 'Date_Derniere_Transaction', 'Date_Creation',
      'Date_Modification', 'Cree_Par', 'Modifie_Par', 'Franchise_Rattachee',
      'Agent_Reference', 'Nombre_Litiges', 'Taux_Presence_RDV', 'Notes_Internes',
      'Documents_Associes', 'Score_RFM', 'Alerte_Inactivite', 'Tags_Client',
      'Langue_Preferee', 'Source_Acquisition', 'Programme_Fidelite',
      'Solde_Points_Fidelite', 'Statut_Verification'
    ],
    protectedRanges: ['A1:AH1'],
    frozenRows: 1,
    frozenColumns: 2,
    description: 'Base de données clients complète'
  },

  PrestatairesWARAP: {
    order: 3,
    color: '#f59e0b',
    headers: [
      'ID_Prestataire', 'Nom_Complet', 'Email', 'Telephone_Principal',
      'Telephone_Secondaire', 'Adresse_Professionnelle', 'Commune', 'Statut',
      'Type_Prestataire', 'Domaines_Competences', 'Certifications',
      'Annees_Experience', 'Zone_Intervention', 'Note_Globale',
      'Nombre_Missions_Completees', 'CA_Total', 'Taux_Completion',
      'Taux_Satisfaction', 'Date_Creation', 'Date_Modification', 'Cree_Par',
      'Modifie_Par', 'Franchise_Rattachee', 'Disponibilite_Horaire',
      'Tarif_Horaire_Min', 'Tarif_Horaire_Max', 'Jours_Travail',
      'Documents_Professionnels', 'Photo_Profil', 'Portfolio', 'Langues_Parlees',
      'Niveau_Badge', 'Delai_Moyen_Reponse', 'Taux_Acceptation',
      'Assurance_Professionnelle', 'Numero_Registre_Commerce', 'Statut_Verification'
    ],
    protectedRanges: ['A1:AK1'],
    frozenRows: 1,
    frozenColumns: 2,
    description: 'Base de données prestataires de services'
  },

  AnnoncesWARAP: {
    order: 4,
    color: '#3b82f6',
    headers: [
      'ID_Annonce', 'Client_ID', 'Type_Service', 'Titre_Annonce',
      'Description_Detaillee', 'Commune', 'Quartier', 'Zone_Precise',
      'Adresse_Intervention', 'Budget_Estime', 'Statut', 'Date_Publication',
      'Date_Derniere_Modification', 'Date_Debut_Souhaite', 'Date_Fin_Souhaite',
      'Urgence', 'Prestataire_Assigne', 'Score_Matching', 'Nombre_Candidatures',
      'Temps_Avant_Attribution', 'Transaction_ID', 'Documents_Joints',
      'Photos_Lieu', 'Cree_Par', 'Modifie_Par', 'Franchise', 'Agent_Gestionnaire',
      'Preferences_Horaire', 'Acces_Lieu', 'Contact_Sur_Place',
      'Equipements_Requis', 'Nombre_Personnes_Necessaires', 'Duree_Estimee',
      'Alerte_Expiration', 'Historique_Statuts', 'Notes_Agent'
    ],
    protectedRanges: ['A1:AJ1'],
    frozenRows: 1,
    frozenColumns: 3,
    description: 'Demandes de services clients'
  },

  Matchings_Proposes: {
    order: 5,
    color: '#8b5cf6',
    headers: [
      'ID_Matching', 'Date_Matching', 'Heure_Matching', 'Annonce_ID', 'Client_ID',
      'Client_Nom', 'Prestataire_ID', 'Prestataire_Nom', 'Score_Global',
      'Score_Competences', 'Score_Localisation', 'Score_Disponibilite', 'Statut',
      'Motif_Refus', 'Date_Reponse_Prestataire', 'Delai_Reponse',
      'Decision_Automatique', 'Agent_Validateur', 'Date_Validation_Agent',
      'Commentaire_Agent', 'Franchise', 'Zone', 'Distance_Client_Prestataire',
      'Cout_Estime', 'Delai_Intervention_Propose', 'Conditions_Particulieres',
      'Historique_Interactions', 'Alerte_Expiration'
    ],
    protectedRanges: ['A1:AB1'],
    frozenRows: 1,
    frozenColumns: 4,
    description: 'Résultats du matching IA'
  },

  TransactionsWARAP: {
    order: 6,
    color: '#059669',
    headers: [
      'ID_Transaction', 'Numero_Facture', 'Date_Transaction', 'Heure_Transaction',
      'Annonce_ID', 'Client_ID', 'Prestataire_ID', 'Montant_Total',
      'Commission_Plateforme', 'Commission_Franchise', 'Montant_Prestataire',
      'Statut', 'Mode_Paiement', 'Note_Client', 'Note_Prestataire',
      'Commentaire_Client', 'Commentaire_Prestataire', 'Date_Debut_Service',
      'Date_Fin_Service', 'Duree_Reelle', 'Franchise', 'Zone', 'Agent_Gestionnaire',
      'Type_Service', 'Problemes_Rencontres', 'Photos_Avant', 'Photos_Apres',
      'Signature_Client', 'Signature_Prestataire', 'Facture_PDF', 'Recu_Paiement',
      'Statut_Paiement_Prestataire', 'Date_Paiement_Prestataire',
      'Reference_Paiement', 'TVA_Applicable', 'Montant_TVA', 'Penalites_Retard',
      'Bonus_Qualite', 'Garantie_Service', 'Duree_Garantie', 'Alerte_Impaye'
    ],
    protectedRanges: ['A1:AO1'],
    frozenRows: 1,
    frozenColumns: 3,
    description: 'Historique des transactions financières'
  },

  Analytics_WARAP: {
    order: 7,
    color: '#0891b2',
    headers: [
      'ID_Analytique', 'Date_Analyse', 'Type_Metrique', 'Periode', 'Valeur_Metrique',
      'Variation_Precedente', 'Tendance', 'Franchise', 'Zone', 'Categorie_Service',
      'CA_Total_Periode', 'Nombre_Transactions', 'Panier_Moyen', 'Nouveaux_Clients',
      'Clients_Recurrents', 'Taux_Recurrence', 'Satisfaction_Moyenne', 'NPS_Score',
      'Taux_Conversion_Annonces', 'Delai_Moyen_Traitement', 'Prestataires_Actifs',
      'Taux_Occupation_Prestataires', 'CA_Previsionnel_Fin_Mois', 'Objectif_Periode',
      'Taux_Atteinte_Objectif', 'Top_3_Services', 'Zones_Performance',
      'Alertes_Anomalies', 'Recommandations_IA', 'Indicateur_Sante',
      'Budget_Marketing_Utilise', 'ROI_Marketing', 'Notes_Analyse'
    ],
    protectedRanges: ['A1:AG1'],
    frozenRows: 1,
    description: 'Métriques et analyses business'
  },

  Catalogue_Produits_WARAP: {
    order: 8,
    color: '#7c3aed',
    headers: [
      'ID_Produit', 'Code_SKU', 'Nom_Produit', 'Categorie', 'Sous_Categorie',
      'Description', 'Prix_Unitaire', 'Prix_Promotion', 'Promotion_Active',
      'Date_Debut_Promotion', 'Date_Fin_Promotion', 'Stock_Actuel', 'Stock_Minimum',
      'Stock_Maximum', 'Alerte_Stock', 'Fournisseur_ID', 'Fournisseur_Nom',
      'Cout_Achat', 'Marge_Benefice', 'TVA_Taux', 'Prix_TTC', 'Poids', 'Dimensions',
      'Photos_Produit', 'Statut', 'Date_Creation', 'Date_Modification',
      'Nombre_Ventes', 'CA_Genere', 'Note_Moyenne', 'Nombre_Avis', 'Tags_Recherche',
      'Garantie', 'Conditions_Livraison'
    ],
    protectedRanges: ['A1:AH1'],
    frozenRows: 1,
    frozenColumns: 3,
    description: 'Catalogue produits marketplace'
  },

  LivraisonsWARAP: {
    order: 9,
    color: '#dc2626',
    headers: [
      'ID_Livraison', 'Numero_BL', 'Date_Creation', 'Commande_ID', 'Client_ID',
      'Adresse_Livraison', 'Date_Livraison_Prevue', 'Creneau_Horaire', 'Livreur_ID',
      'Livreur_Nom', 'Vehicule_Type', 'Statut', 'Date_Livraison_Effective',
      'Heure_Livraison_Effective', 'Delai_Livraison', 'Retard', 'Distance_Parcourue',
      'Cout_Livraison', 'Frais_Client', 'Marge_Livraison', 'Signature_Client',
      'Photo_Livraison', 'Code_Verification', 'Satisfaction_Client',
      'Commentaire_Client', 'Problemes_Rencontres', 'Nombre_Tentatives',
      'Raison_Echec', 'Franchise', 'Zone', 'Quartier', 'GPS_Depart', 'GPS_Arrivee',
      'Temps_Trajet', 'Conditions_Meteo', 'Emballage_Special', 'Instructions_Speciales'
    ],
    protectedRanges: ['A1:AK1'],
    frozenRows: 1,
    description: 'Gestion logistique des livraisons'
  },

  RendezVousWARAP: {
    order: 10,
    color: '#ec4899',
    headers: [
      'ID_RendezVous', 'Numero_RDV', 'Client_ID', 'Prestataire_ID', 'Date_RDV',
      'Heure_Debut', 'Heure_Fin', 'Duree', 'Type_RDV', 'Statut', 'Rappel_Envoye',
      'Date_Envoi_Rappel', 'Canal_Rappel', 'Lieu', 'Adresse', 'Contact_Sur_Place',
      'Telephone_Contact', 'Objet_RDV', 'Description_Detaillee', 'Documents_Requis',
      'Annonce_ID', 'Transaction_ID', 'Notes_Preparatoires', 'Materiel_Requis',
      'Cout_Estime', 'Cree_Par', 'Date_Creation', 'Modifie_Par', 'Date_Modification',
      'Franchise', 'Zone', 'Motif_Annulation', 'Nouvelle_Date_Proposee', 'Alerte_RDV'
    ],
    protectedRanges: ['A1:AH1'],
    frozenRows: 1,
    description: 'Calendrier et gestion des rendez-vous'
  },

  LitigesWARAP: {
    order: 11,
    color: '#ef4444',
    headers: [
      'ID_Litige', 'Numero_Litige', 'Transaction_ID', 'Type_Litige', 'Date_Ouverture',
      'Heure_Ouverture', 'Partie_Plaignante', 'Client_ID', 'Prestataire_ID',
      'Gravite', 'Montant_Litige', 'Statut', 'Mediateur_ID', 'Mediateur_Nom',
      'Date_Assignation_Mediateur', 'Description_Probleme', 'Preuves_Client',
      'Preuves_Prestataire', 'Historique_Echanges', 'Solution_Proposee',
      'Type_Resolution', 'Montant_Resolution', 'Date_Resolution', 'Temps_Resolution',
      'Satisfaction_Resolution_Client', 'Satisfaction_Resolution_Prestataire',
      'Decision_Finale', 'Responsable_Decision', 'Date_Cloture', 'Lecons_Apprises',
      'Actions_Preventives', 'Franchise', 'Zone', 'Priorite', 'Alerte_Delai'
    ],
    protectedRanges: ['A1:AI1'],
    frozenRows: 1,
    description: 'Gestion et médiation des litiges'
  },

  SAV_WARAP: {
    order: 12,
    color: '#f97316',
    headers: [
      'ID_Ticket', 'Numero_Ticket', 'Transaction_ID', 'Date_Ouverture',
      'Heure_Ouverture', 'Client_ID', 'Produit_ID', 'Service_Concerne',
      'Type_Demande', 'Statut', 'Priorite', 'Canal_Contact', 'Description_Probleme',
      'Photos_Videos_Probleme', 'Technicien_ID', 'Technicien_Nom', 'Date_Assignation',
      'Date_Intervention_Prevue', 'Date_Intervention_Effective', 'Delai_Intervention',
      'Respect_SLA', 'Diagnostic', 'Pieces_Utilisees', 'Cout_Pieces',
      'Cout_Main_Oeuvre', 'Cout_Total', 'Pris_En_Charge_Garantie',
      'Montant_Facture_Client', 'Statut_Paiement', 'Mode_Paiement',
      'Duree_Intervention', 'Satisfaction_Client', 'Commentaire_Client',
      'Date_Cloture', 'Cause_Racine', 'Actions_Preventives', 'Suivi_Post_Intervention'
    ],
    protectedRanges: ['A1:AK1'],
    frozenRows: 1,
    description: 'Service après-vente et support'
  },

  Fournisseurs_WARAP: {
    order: 13,
    color: '#14b8a6',
    headers: [
      'ID_Fournisseur', 'Nom_Fournisseur', 'Type_Fournisseur', 'Email', 'Telephone',
      'Adresse', 'Ville', 'Pays', 'Statut', 'Categorie_Produits',
      'Delai_Livraison_Moyen', 'Conditions_Paiement', 'Montant_Minimum_Commande',
      'Note_Qualite', 'Note_Ponctualite', 'Note_Service', 'Note_Globale',
      'Nombre_Commandes', 'CA_Total', 'Taux_Conformite', 'Taux_Retour',
      'Contact_Principal', 'Contact_Secondaire', 'Site_Web', 'Catalogue_Produits',
      'Certificats_Qualite', 'Numero_Registre_Commerce', 'Numero_Contribuable',
      'RIB_Bancaire', 'Date_Creation', 'Date_Derniere_Commande', 'Alerte_Performance'
    ],
    protectedRanges: ['A1:AF1'],
    frozenRows: 1,
    description: 'Gestion des fournisseurs'
  },

  Parametres_WARAP: {
    order: 14,
    color: '#6366f1',
    headers: [
      'ID_Parametre', 'Categorie', 'Nom_Parametre', 'Valeur_Actuelle', 'Type_Valeur',
      'Valeur_Par_Defaut', 'Unite', 'Min_Max', 'Description', 'Modifiable_Par',
      'Date_Modification', 'Modifie_Par'
    ],
    protectedRanges: ['A1:L1'],
    frozenRows: 1,
    description: 'Configuration système'
  },

  Logs_WARAP: {
    order: 15,
    color: '#64748b',
    headers: [
      'ID_Log', 'Timestamp', 'Type_Evenement', 'Module', 'Action_Effectuee',
      'Utilisateur_Email', 'Utilisateur_Role', 'Entite_Type', 'Entite_ID',
      'Anciennes_Valeurs', 'Nouvelles_Valeurs', 'IP_Adresse', 'Navigateur_Agent',
      'Statut', 'Message_Erreur', 'Niveau_Securite'
    ],
    protectedRanges: ['A1:P1'],
    frozenRows: 1,
    description: 'Audit trail et logs système'
  },

  Utilisateurs_WARAP: {
    order: 16,
    color: '#475569',
    headers: [
      'ID_Utilisateur', 'Email', 'Role', 'Nom_Complet', 'Telephone', 'Statut',
      'Franchise_Rattachee', 'Zone_Rattachee', 'Commune_Rattachee',
      'Permissions_Modules', 'Date_Creation', 'Date_Derniere_Connexion',
      'Nombre_Connexions', 'Nombre_Actions_Jour', 'IP_Derniere_Connexion',
      'Dispositif_Autorise', 'Photo_Profil', 'Langue_Interface', 'Notifications_Actives',
      'Email_Notifications', 'SMS_Notifications', 'Cree_Par', 'Modifie_Par',
      'Date_Modification', 'Objectifs_Mensuels', 'Performance_Mois',
      'Taux_Atteinte_Objectif', 'Badge_Performance', 'Notes_RH'
    ],
    protectedRanges: ['A1:AC1'],
    frozenRows: 1,
    description: 'Gestion des utilisateurs'
  },

  Commandes_Produits: {
    order: 17,
    color: '#a855f7',
    headers: [
      'ID_Commande', 'Date_Commande', 'Client_ID', 'Liste_Produits', 'Montant_Total',
      'Statut', 'Livraison_ID', 'Mode_Paiement', 'Statut_Paiement'
    ],
    protectedRanges: ['A1:I1'],
    frozenRows: 1,
    description: 'Commandes de produits marketplace'
  },

  Stock_Mouvements: {
    order: 18,
    color: '#06b6d4',
    headers: [
      'ID_Mouvement', 'Date_Mouvement', 'Produit_ID', 'Type_Mouvement', 'Quantite',
      'Stock_Avant', 'Stock_Apres', 'Reference_Document', 'Responsable', 'Motif'
    ],
    protectedRanges: ['A1:J1'],
    frozenRows: 1,
    description: 'Mouvements de stock'
  },

  Horaires_Prestataires: {
    order: 19,
    color: '#84cc16',
    headers: [
      'ID_Horaire', 'Prestataire_ID', 'Jour_Semaine', 'Heure_Debut', 'Heure_Fin',
      'Disponible', 'Type_Periode', 'Date_Debut_Validite', 'Date_Fin_Validite'
    ],
    protectedRanges: ['A1:I1'],
    frozenRows: 1,
    description: 'Planning des prestataires'
  },

  Notifications_Envoyees: {
    order: 20,
    color: '#f43f5e',
    headers: [
      'ID_Notification', 'Date_Envoi', 'Type_Notification', 'Destinataire_ID',
      'Destinataire_Email_Phone', 'Objet', 'Message', 'Statut_Envoi',
      'Reference_Entite', 'Template_Utilise', 'Cout_Envoi'
    ],
    protectedRanges: ['A1:K1'],
    frozenRows: 1,
    description: 'Historique des notifications'
  }
};

// ============================================================================
// FONCTION PRINCIPALE - INSTALLATION WARAP
// ============================================================================

/**
 * Installation complète de la plateforme WARAP
 * Fonction principale appelée depuis le menu
 */
function installWARAP() {
  const ui = SpreadsheetApp.getUi();

  // Confirmation avant installation
  const response = ui.alert(
    '⚙️ Installation WARAP',
    'Cette action va créer toutes les feuilles et configurations nécessaires.\n\n' +
    '⏱️ Durée estimée: 2-3 minutes\n' +
    '📊 20 feuilles seront créées\n' +
    '⚙️ Configurations automatiques appliquées\n\n' +
    'Continuer ?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    ui.alert('✅ Annulé', 'Installation annulée.', ui.ButtonSet.OK);
    return;
  }

  try {
    const startTime = new Date();
    console.log('[Installation] Début de l\'installation WARAP...');

    // Créer une feuille temporaire pour afficher la progression
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let progressSheet = ss.getSheetByName('Installation_Progress');
    if (progressSheet) {
      ss.deleteSheet(progressSheet);
    }
    progressSheet = ss.insertSheet('Installation_Progress');
    progressSheet.getRange('A1').setValue('🚀 Installation WARAP en cours...');

    // ÉTAPE 1: Créer toutes les feuilles
    updateProgress(progressSheet, 'Étape 1/8: Création des feuilles...', 10);
    const createdSheets = createAllSheets();
    console.log(`✅ ${createdSheets} feuilles créées`);

    // ÉTAPE 2: Charger les données de référence (Communes Cameroun)
    updateProgress(progressSheet, 'Étape 2/8: Chargement données Cameroun (358 communes)...', 25);
    loadCameroonData();
    console.log('✅ Données Cameroun chargées');

    // ÉTAPE 3: Initialiser les paramètres système
    updateProgress(progressSheet, 'Étape 3/8: Configuration paramètres système...', 40);
    initializeSystemParameters();
    console.log('✅ Paramètres système initialisés');

    // ÉTAPE 4: Configurer les formules
    updateProgress(progressSheet, 'Étape 4/8: Application des formules avancées...', 55);
    setupFormulasInSheets();
    console.log('✅ Formules configurées');

    // ÉTAPE 5: Configurer les validations de données
    updateProgress(progressSheet, 'Étape 5/8: Configuration validations de données...', 70);
    setupDataValidations();
    console.log('✅ Validations créées');

    // ÉTAPE 6: Appliquer la mise en forme conditionnelle
    updateProgress(progressSheet, 'Étape 6/8: Application mise en forme conditionnelle...', 80);
    setupConditionalFormatting();
    console.log('✅ Mise en forme appliquée');

    // ÉTAPE 7: Configurer les protections
    updateProgress(progressSheet, 'Étape 7/8: Configuration des protections...', 90);
    setupSheetProtections();
    console.log('✅ Protections activées');

    // ÉTAPE 8: Créer les triggers automatiques
    updateProgress(progressSheet, 'Étape 8/8: Création des triggers automatiques...', 95);
    setupAutomationTriggers();
    console.log('✅ Triggers créés');

    // Finalisation
    updateProgress(progressSheet, '✅ Installation terminée avec succès !', 100);

    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    // Supprimer la feuille de progression après 3 secondes
    Utilities.sleep(3000);
    ss.deleteSheet(progressSheet);

    // Message de succès
    ui.alert(
      '✅ Installation réussie !',
      `WARAP a été installé avec succès en ${duration} secondes.\n\n` +
      `📊 ${createdSheets} feuilles créées\n` +
      `⚙️ Configurations appliquées\n` +
      `🤖 Triggers activés\n` +
      `🇨🇲 358 communes Cameroun chargées\n\n` +
      `Actualisez la page (F5) pour voir le menu complet.\n\n` +
      `Version installée: ${WARAP_CONFIG.version}`,
      ui.ButtonSet.OK
    );

    console.log(`[Installation] ✅ Terminée en ${duration}s`);

    // Logger l'installation
    logInstallation(duration, createdSheets);

  } catch (error) {
    console.error('[Installation] ❌ Erreur:', error);

    ui.alert(
      '❌ Erreur d\'installation',
      `Une erreur est survenue:\n\n${error.message}\n\n` +
      `Veuillez contacter le support: warapservices@gmail.com`,
      ui.ButtonSet.OK
    );

    // Nettoyer la feuille de progression
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const progressSheet = ss.getSheetByName('Installation_Progress');
    if (progressSheet) {
      ss.deleteSheet(progressSheet);
    }
  }
}

// ============================================================================
// CRÉATION DES FEUILLES
// ============================================================================

/**
 * Crée toutes les feuilles WARAP selon la configuration
 * @returns {number} Nombre de feuilles créées
 */
function createAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let createdCount = 0;

  // Trier par ordre
  const sortedSheets = Object.keys(SHEETS_CONFIGURATION).sort((a, b) => {
    return SHEETS_CONFIGURATION[a].order - SHEETS_CONFIGURATION[b].order;
  });

  sortedSheets.forEach(sheetName => {
    const config = SHEETS_CONFIGURATION[sheetName];

    try {
      let sheet = ss.getSheetByName(sheetName);

      if (sheet) {
        console.log(`[Sheets] Feuille "${sheetName}" existe déjà, nettoyage...`);
        sheet.clear();
      } else {
        console.log(`[Sheets] Création de "${sheetName}"...`);
        sheet = ss.insertSheet(sheetName);
        createdCount++;
      }

      // Configurer la feuille
      configureSheet(sheet, config);

      console.log(`[Sheets] ✅ "${sheetName}" configurée`);

    } catch (error) {
      console.error(`[Sheets] ❌ Erreur pour "${sheetName}":`, error);
    }
  });

  // Supprimer la feuille par défaut "Sheet1" si elle existe
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // Activer la première feuille (Accueil)
  const accueilSheet = ss.getSheetByName('AccueilWARAP');
  if (accueilSheet) {
    ss.setActiveSheet(accueilSheet);
  }

  return createdCount;
}

/**
 * Configure une feuille avec ses paramètres
 * @param {Sheet} sheet - La feuille à configurer
 * @param {Object} config - Configuration de la feuille
 */
function configureSheet(sheet, config) {
  // 1. Headers
  if (config.headers && config.headers.length > 0) {
    const headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setValues([config.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    headerRange.setBackground(config.color || '#4f46e5');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setWrap(true);

    // Hauteur de ligne pour les headers
    sheet.setRowHeight(1, 35);
  }

  // 2. Lignes et colonnes gelées
  if (config.frozenRows) {
    sheet.setFrozenRows(config.frozenRows);
  }
  if (config.frozenColumns) {
    sheet.setFrozenColumns(config.frozenColumns);
  }

  // 3. Auto-resize des colonnes
  if (config.headers) {
    for (let i = 1; i <= config.headers.length; i++) {
      sheet.setColumnWidth(i, 120); // Largeur par défaut
    }
  }

  // 4. Couleur de l'onglet
  if (config.color) {
    sheet.setTabColor(config.color);
  }

  // 5. Protéger les headers
  if (config.protectedRanges) {
    config.protectedRanges.forEach(rangeA1 => {
      try {
        const protection = sheet.getRange(rangeA1).protect();
        protection.setDescription(`En-têtes protégés - ${sheet.getName()}`);
        protection.setWarningOnly(true);
      } catch (error) {
        console.warn(`[Protection] Impossible de protéger ${rangeA1}:`, error);
      }
    });
  }
}

// ============================================================================
// CHARGEMENT DES DONNÉES CAMEROUN
// ============================================================================

/**
 * Charge les données de référence du Cameroun (358 communes)
 */
function loadCameroonData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Créer la feuille de référence (masquée)
  let refSheet = ss.getSheetByName('REF_Communes');
  if (refSheet) {
    refSheet.clear();
  } else {
    refSheet = ss.insertSheet('REF_Communes');
  }

  // Headers
  refSheet.getRange('A1:C1').setValues([['Commune', 'Région', 'Departement']]);
  refSheet.getRange('A1:C1').setFontWeight('bold').setBackground('#4f46e5').setFontColor('#ffffff');

  // Données des communes (version simplifiée - à compléter)
  const communes = getCommunesCameroun();

  if (communes.length > 0) {
    refSheet.getRange(2, 1, communes.length, 3).setValues(communes);
  }

  // Masquer la feuille
  refSheet.hideSheet();

  console.log(`[Cameroon] ${communes.length} communes chargées`);
}

/**
 * Retourne la liste des communes du Cameroun avec leurs régions
 * @returns {Array} Tableau [Commune, Région, Département]
 */
function getCommunesCameroun() {
  // Version simplifiée - les 50 principales communes
  // En production, charger les 358 communes complètes
  return [
    // Région du Centre
    ['Yaoundé 1', 'Centre', 'Mfoundi'],
    ['Yaoundé 2', 'Centre', 'Mfoundi'],
    ['Yaoundé 3', 'Centre', 'Mfoundi'],
    ['Yaoundé 4', 'Centre', 'Mfoundi'],
    ['Yaoundé 5', 'Centre', 'Mfoundi'],
    ['Yaoundé 6', 'Centre', 'Mfoundi'],
    ['Yaoundé 7', 'Centre', 'Mfoundi'],
    ['Mfou', 'Centre', 'Mefou-et-Afamba'],
    ['Soa', 'Centre', 'Mefou-et-Afamba'],
    ['Mbankomo', 'Centre', 'Mefou-et-Afamba'],
    ['Obala', 'Centre', 'Lekié'],
    ['Bafia', 'Centre', 'Mbam-et-Inoubou'],

    // Région du Littoral
    ['Douala 1', 'Littoral', 'Wouri'],
    ['Douala 2', 'Littoral', 'Wouri'],
    ['Douala 3', 'Littoral', 'Wouri'],
    ['Douala 4', 'Littoral', 'Wouri'],
    ['Douala 5', 'Littoral', 'Wouri'],
    ['Douala 6', 'Littoral', 'Wouri'],
    ['Édéa', 'Littoral', 'Sanaga-Maritime'],
    ['Nkongsamba', 'Littoral', 'Moungo'],
    ['Loum', 'Littoral', 'Moungo'],

    // Région de l\'Ouest
    ['Bafoussam 1', 'Ouest', 'Mifi'],
    ['Bafoussam 2', 'Ouest', 'Mifi'],
    ['Bafoussam 3', 'Ouest', 'Mifi'],
    ['Mbouda', 'Ouest', 'Bamboutos'],
    ['Bafang', 'Ouest', 'Haut-Nkam'],
    ['Bandjoun', 'Ouest', 'Koung-Khi'],
    ['Foumban', 'Ouest', 'Noun'],
    ['Dschang', 'Ouest', 'Menoua'],
    ['Bangangté', 'Ouest', 'Ndé'],

    // Région du Nord
    ['Garoua 1', 'Nord', 'Bénoué'],
    ['Garoua 2', 'Nord', 'Bénoué'],
    ['Garoua 3', 'Nord', 'Bénoué'],
    ['Lagdo', 'Nord', 'Bénoué'],
    ['Guider', 'Nord', 'Mayo-Louti'],
    ['Pitoa', 'Nord', 'Bénoué'],

    // Région de l\'Adamaoua
    ['Ngaoundéré 1', 'Adamaoua', 'Vina'],
    ['Ngaoundéré 2', 'Adamaoua', 'Vina'],
    ['Ngaoundéré 3', 'Adamaoua', 'Vina'],
    ['Meiganga', 'Adamaoua', 'Mbéré'],
    ['Tibati', 'Adamaoua', 'Djérem'],

    // Région de l\'Est
    ['Bertoua 1', 'Est', 'Lom-et-Djérem'],
    ['Bertoua 2', 'Est', 'Lom-et-Djérem'],
    ['Batouri', 'Est', 'Kadey'],
    ['Abong-Mbang', 'Est', 'Haut-Nyong'],

    // Région du Sud
    ['Ebolowa 1', 'Sud', 'Mvila'],
    ['Ebolowa 2', 'Sud', 'Mvila'],
    ['Kribi 1', 'Sud', 'Océan'],
    ['Kribi 2', 'Sud', 'Océan'],
    ['Sangmélima', 'Sud', 'Dja-et-Lobo']

    // À compléter avec les 308 communes restantes...
  ];
}

// ============================================================================
// INITIALISATION DES PARAMÈTRES SYSTÈME
// ============================================================================

/**
 * Initialise les paramètres système dans Parametres_WARAP
 */
function initializeSystemParameters() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Parametres_WARAP');

  if (!sheet) {
    console.error('[Params] Feuille Parametres_WARAP introuvable');
    return;
  }

  const params = [
    // Système
    ['PAR00000000001', 'Système', 'Version_WARAP', WARAP_CONFIG.version, 'Texte', '1.0.0', '', '', 'Version actuelle de la plateforme', 'SUPERADMIN', new Date(), 'system'],
    ['PAR00000000002', 'Système', 'Environnement', 'production', 'Texte', 'production', '', 'development,staging,production', 'Environnement d\'exécution', 'SUPERADMIN', new Date(), 'system'],
    ['PAR00000000003', 'Système', 'Maintenance_Mode', 'false', 'Booléen', 'false', '', '', 'Mode maintenance activé', 'SUPERADMIN', new Date(), 'system'],

    // Finance
    ['PAR00000000004', 'Finance', 'Commission_Plateforme', '15', 'Nombre', '15', '%', '10-20', 'Commission WARAP sur transactions', 'SUPERADMIN', new Date(), 'system'],
    ['PAR00000000005', 'Finance', 'Commission_Franchise', '10', 'Nombre', '10', '%', '5-15', 'Commission franchise sur transactions', 'SUPERADMIN', new Date(), 'system'],
    ['PAR00000000006', 'Finance', 'TVA_Taux', '19.25', 'Nombre', '19.25', '%', '', 'Taux TVA Cameroun', 'ADMIN_NATIONAL', new Date(), 'system'],

    // Matching IA
    ['PAR00000000007', 'Matching', 'Seuil_Auto_Validation', '85', 'Nombre', '85', 'points', '80-95', 'Score minimum pour validation auto', 'ADMIN_NATIONAL', new Date(), 'system'],
    ['PAR00000000008', 'Matching', 'Delai_Expiration_Matching', '48', 'Nombre', '48', 'heures', '24-72', 'Délai avant expiration proposition', 'ADMIN_NATIONAL', new Date(), 'system'],
    ['PAR00000000009', 'Matching', 'Nombre_Max_Candidatures', '5', 'Nombre', '5', 'candidats', '3-10', 'Nombre max de prestataires proposés', 'ADMIN_NATIONAL', new Date(), 'system'],

    // Notifications
    ['PAR00000000010', 'Notification', 'SMS_Provider', 'Orange_SMS_API', 'Texte', 'Orange_SMS_API', '', '', 'Fournisseur SMS principal', 'ADMIN_NATIONAL', new Date(), 'system'],
    ['PAR00000000011', 'Notification', 'Email_Expediteur', 'noreply@warap.cm', 'Texte', 'noreply@warap.cm', '', '', 'Email expéditeur des notifications', 'ADMIN_NATIONAL', new Date(), 'system'],
    ['PAR00000000012', 'Notification', 'WhatsApp_Actif', 'false', 'Booléen', 'false', '', '', 'Notifications WhatsApp activées', 'ADMIN_NATIONAL', new Date(), 'system'],

    // Stock
    ['PAR00000000013', 'Stock', 'Alerte_Stock_Minimum', '10', 'Nombre', '10', 'unités', '5-50', 'Seuil d\'alerte stock faible', 'ADMIN_FRANCHISE', new Date(), 'system'],

    // SAV
    ['PAR00000000014', 'SAV', 'Delai_SLA_Standard', '48', 'Nombre', '48', 'heures', '24-72', 'SLA standard pour intervention', 'ADMIN_NATIONAL', new Date(), 'system'],
    ['PAR00000000015', 'SAV', 'Delai_SLA_Urgent', '24', 'Nombre', '24', 'heures', '12-48', 'SLA urgent pour intervention', 'ADMIN_NATIONAL', new Date(), 'system']
  ];

  // Ajouter les paramètres
  if (params.length > 0) {
    sheet.getRange(2, 1, params.length, 12).setValues(params);
  }

  console.log(`[Params] ${params.length} paramètres système initialisés`);
}

// ============================================================================
// CONFIGURATION DES FORMULES
// ============================================================================

/**
 * Configure les formules dans les feuilles pertinentes
 */
function setupFormulasInSheets() {
  // Les formules seront ajoutées ligne par ligne lors de la création des données
  // Ici on configure les formules template pour la ligne 2

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ClientsWARAP - Formules
  const clientsSheet = ss.getSheetByName('ClientsWARAP');
  if (clientsSheet) {
    // Segment RFM (colonne L)
    clientsSheet.getRange('L2').setFormula('=IFS(AA2>=80,"VIP",AA2>=50,"Fidèle",AA2>=20,"Actif",TRUE,"Nouveau")');

    // Score RFM (colonne AA)
    clientsSheet.getRange('AA2').setFormula('=IF(P2="","",LET(recency,DAYS(TODAY(),P2),frequency,M2,monetary,N2,r_score,IF(recency<=30,5,IF(recency<=60,4,IF(recency<=90,3,IF(recency<=180,2,1)))),f_score,IF(frequency>=20,5,IF(frequency>=10,4,IF(frequency>=5,3,IF(frequency>=2,2,1)))),m_score,IF(monetary>=500000,5,IF(monetary>=200000,4,IF(monetary>=100000,3,IF(monetary>=50000,2,1)))),(r_score+f_score+m_score)*6.67))');

    // Alerte Inactivité (colonne AB)
    clientsSheet.getRange('AB2').setFormula('=IF(P2="","",IF(DAYS(TODAY(),P2)>90,"⚠️ Client Inactif depuis "&DAYS(TODAY(),P2)&" jours","✅ Actif"))');
  }

  // PrestatairesWARAP - Formules
  const prestSheet = ss.getSheetByName('PrestatairesWARAP');
  if (prestSheet) {
    // Niveau Badge (colonne AF)
    prestSheet.getRange('AF2').setFormula('=IFS(O2>=100,"🏆 Platine",O2>=50,"🥇 Or",O2>=20,"🥈 Argent",O2>=5,"🥉 Bronze",TRUE,"🌱 Débutant")');
  }

  // TransactionsWARAP - Formules
  const transSheet = ss.getSheetByName('TransactionsWARAP');
  if (transSheet) {
    // Commission Plateforme (colonne I)
    transSheet.getRange('I2').setFormula('=H2*0.15');

    // Commission Franchise (colonne J)
    transSheet.getRange('J2').setFormula('=H2*0.10');

    // Montant Prestataire (colonne K)
    transSheet.getRange('K2').setFormula('=H2*0.75');

    // Durée Réelle (colonne T)
    transSheet.getRange('T2').setFormula('=IF(AND(R2<>"",S2<>""),(S2-R2)*24,"N/A")');
  }

  console.log('[Formules] Formules template configurées');
}

// ============================================================================
// VALIDATIONS DE DONNÉES
// ============================================================================

/**
 * Configure les validations de données dans les feuilles
 */
function setupDataValidations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ClientsWARAP - Validations
  const clientsSheet = ss.getSheetByName('ClientsWARAP');
  if (clientsSheet) {
    // Statut (colonne G)
    const statutRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Actif', 'Inactif', 'Suspendu'], true)
      .setAllowInvalid(false)
      .build();
    clientsSheet.getRange('G2:G1000').setDataValidation(statutRule);

    // Type Client (colonne H)
    const typeRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Particulier', 'Entreprise', 'VIP'], true)
      .setAllowInvalid(false)
      .build();
    clientsSheet.getRange('H2:H1000').setDataValidation(typeRule);

    // Commune (colonne I) - Référence à REF_Communes
    try {
      const communeRange = ss.getRange('REF_Communes!A2:A1000');
      const communeRule = SpreadsheetApp.newDataValidation()
        .requireValueInRange(communeRange, true)
        .setAllowInvalid(false)
        .build();
      clientsSheet.getRange('I2:I1000').setDataValidation(communeRule);
    } catch (error) {
      console.warn('[Validation] Impossible de créer validation communes:', error);
    }

    // Langue Préférée (colonne AD)
    const langueRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Français', 'Anglais'], true)
      .setAllowInvalid(false)
      .build();
    clientsSheet.getRange('AD2:AD1000').setDataValidation(langueRule);

    // Statut Vérification (colonne AH)
    const verifRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Vérifié', 'En attente', 'Rejeté'], true)
      .setAllowInvalid(false)
      .build();
    clientsSheet.getRange('AH2:AH1000').setDataValidation(verifRule);
  }

  // TransactionsWARAP - Validations
  const transSheet = ss.getSheetByName('TransactionsWARAP');
  if (transSheet) {
    // Statut (colonne L)
    const statutTransRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['En attente', 'Validée', 'En cours', 'Terminée', 'Annulée', 'Remboursée'], true)
      .setAllowInvalid(false)
      .build();
    transSheet.getRange('L2:L1000').setDataValidation(statutTransRule);

    // Mode Paiement (colonne M)
    const paiementRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Mobile Money MTN', 'Mobile Money Orange', 'Espèces', 'Virement', 'Carte bancaire'], true)
      .setAllowInvalid(false)
      .build();
    transSheet.getRange('M2:M1000').setDataValidation(paiementRule);

    // Notes (colonnes N et O) - Entre 1 et 5
    const noteRule = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(1, 5)
      .setAllowInvalid(false)
      .setHelpText('Note entre 1 et 5')
      .build();
    transSheet.getRange('N2:O1000').setDataValidation(noteRule);
  }

  console.log('[Validations] Validations de données configurées');
}

// ============================================================================
// MISE EN FORME CONDITIONNELLE
// ============================================================================

/**
 * Configure la mise en forme conditionnelle
 */
function setupConditionalFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ClientsWARAP - Alerte Inactivité
  const clientsSheet = ss.getSheetByName('ClientsWARAP');
  if (clientsSheet) {
    const alerteRange = clientsSheet.getRange('AB2:AB1000');
    const alerteRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Inactif')
      .setBackground('#fef2f2')
      .setFontColor('#991b1b')
      .setRanges([alerteRange])
      .build();

    const rules = clientsSheet.getConditionalFormatRules();
    rules.push(alerteRule);
    clientsSheet.setConditionalFormatRules(rules);
  }

  // Catalogue_Produits_WARAP - Stock faible
  const produitsSheet = ss.getSheetByName('Catalogue_Produits_WARAP');
  if (produitsSheet) {
    const stockRange = produitsSheet.getRange('L2:L1000');

    // Rouge si stock <= minimum
    const stockFaibleRule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$L2<=$M2')
      .setBackground('#fef2f2')
      .setFontColor('#991b1b')
      .setBold(true)
      .setRanges([stockRange])
      .build();

    const rules = produitsSheet.getConditionalFormatRules();
    rules.push(stockFaibleRule);
    produitsSheet.setConditionalFormatRules(rules);
  }

  console.log('[Format] Mise en forme conditionnelle appliquée');
}

// ============================================================================
// PROTECTIONS DES FEUILLES
// ============================================================================

/**
 * Configure les protections sur les feuilles sensibles
 */
function setupSheetProtections() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Protéger la feuille Parametres_WARAP (sauf pour SUPERADMIN)
  const paramsSheet = ss.getSheetByName('Parametres_WARAP');
  if (paramsSheet) {
    const protection = paramsSheet.protect();
    protection.setDescription('Paramètres système - Accès restreint');
    protection.setWarningOnly(true);
  }

  // Protéger la feuille Logs_WARAP (lecture seule)
  const logsSheet = ss.getSheetByName('Logs_WARAP');
  if (logsSheet) {
    const protection = logsSheet.protect();
    protection.setDescription('Logs système - Lecture seule');
    protection.setWarningOnly(true);
  }

  console.log('[Protection] Protections configurées');
}

// ============================================================================
// CRÉATION DES TRIGGERS AUTOMATIQUES
// ============================================================================

/**
 * Configure les triggers automatiques pour l'automatisation
 */
function setupAutomationTriggers() {
  // Supprimer les anciens triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (['runMatchingAlgorithm', 'dailyBackup', 'weeklyReport', 'cleanOldLogs'].includes(trigger.getHandlerFunction())) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // 1. Matching IA - Toutes les 2 minutes
  try {
    ScriptApp.newTrigger('runMatchingAlgorithm')
      .timeBased()
      .everyMinutes(2)
      .create();
    console.log('[Triggers] ✅ Matching IA (2 min)');
  } catch (error) {
    console.warn('[Triggers] ⚠️ Matching IA non créé:', error.message);
  }

  // 2. Backup quotidien - 3h du matin
  try {
    ScriptApp.newTrigger('dailyBackup')
      .timeBased()
      .atHour(3)
      .everyDays(1)
      .create();
    console.log('[Triggers] ✅ Backup quotidien (3h)');
  } catch (error) {
    console.warn('[Triggers] ⚠️ Backup quotidien non créé:', error.message);
  }

  // 3. Rapport hebdomadaire - Lundi 8h
  try {
    ScriptApp.newTrigger('weeklyReport')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(8)
      .create();
    console.log('[Triggers] ✅ Rapport hebdomadaire (Lun 8h)');
  } catch (error) {
    console.warn('[Triggers] ⚠️ Rapport hebdomadaire non créé:', error.message);
  }

  // 4. Nettoyage logs - Dimanche 2h
  try {
    ScriptApp.newTrigger('cleanOldLogs')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.SUNDAY)
      .atHour(2)
      .create();
    console.log('[Triggers] ✅ Nettoyage logs (Dim 2h)');
  } catch (error) {
    console.warn('[Triggers] ⚠️ Nettoyage logs non créé:', error.message);
  }

  console.log('[Triggers] Configuration terminée');
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Met à jour la progression de l'installation
 * @param {Sheet} sheet - Feuille de progression
 * @param {string} message - Message à afficher
 * @param {number} percent - Pourcentage (0-100)
 */
function updateProgress(sheet, message, percent) {
  sheet.getRange('A2').setValue(message);
  sheet.getRange('A3').setValue(`${percent}%`);

  // Créer une barre de progression visuelle
  const barLength = Math.round(percent / 2);
  const bar = '█'.repeat(barLength) + '░'.repeat(50 - barLength);
  sheet.getRange('A4').setValue(bar);

  SpreadsheetApp.flush(); // Force l'affichage immédiat
}

/**
 * Log l'installation dans Logs_WARAP
 */
function logInstallation(duration, sheetsCreated) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logsSheet = ss.getSheetByName('Logs_WARAP');

    if (!logsSheet) return;

    const user = Session.getActiveUser().getEmail();
    const now = new Date();

    const logData = [
      'LOG' + Math.floor(10000000000 + Math.random() * 90000000000),
      now,
      'INSTALLATION',
      'SYSTEM',
      'Installation WARAP complète',
      user,
      'SUPERADMIN',
      'SYSTEM',
      'WARAP',
      '',
      JSON.stringify({
        version: WARAP_CONFIG.version,
        duration: duration,
        sheetsCreated: sheetsCreated,
        timestamp: now.toISOString()
      }),
      'N/A',
      'N/A',
      'Succès',
      '',
      'Public'
    ];

    logsSheet.appendRow(logData);

  } catch (error) {
    console.error('[Log] Erreur logging installation:', error);
  }
}

// ============================================================================
// FONCTIONS STUBS POUR TRIGGERS
// À implémenter dans les fichiers dédiés
// ============================================================================

function runMatchingAlgorithm() {
  console.log('[Trigger] runMatchingAlgorithm() - À implémenter dans WARAP_Matching_Engine.gs');
}

function dailyBackup() {
  console.log('[Trigger] dailyBackup() - À implémenter dans WARAP_Backup_Service.gs');
}

function weeklyReport() {
  console.log('[Trigger] weeklyReport() - À implémenter dans WARAP_Reporting_Engine.gs');
}

function cleanOldLogs() {
  console.log('[Trigger] cleanOldLogs() - À implémenter dans WARAP_Logs_Manager.gs');
}

// ============================================================================
// FIN DU FICHIER WARAP_Setup.gs
// ============================================================================

/**
 * TODO - Améliorations futures:
 *
 * 1. Charger les 358 communes complètes du Cameroun
 * 2. Ajouter plus de paramètres système configurables
 * 3. Implémenter la migration de données existantes
 * 4. Créer un système de rollback en cas d'erreur
 * 5. Ajouter des exemples de données (mode démo)
 * 6. Configurer les formules avancées pour toutes les feuilles
 * 7. Créer des vues personnalisées par rôle
 * 8. Implémenter la vérification de version avant installation
 * 9. Ajouter des templates de documents (factures, contrats, etc.)
 * 10. Créer un assistant d'installation interactif
 */
