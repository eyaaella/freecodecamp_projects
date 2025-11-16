/**
 * ========================================================================
 * CONFIGURATION GLOBALE DU SYSTÈME DE GESTION TOPOGRAPHIQUE
 * ========================================================================
 * Système de gestion complet pour service topographique
 * Projet: Aménagement des périmètres agricoles en réseau gravitaire
 * Localisation: Cameroun
 * ========================================================================
 */

const CONFIG = {
  // Informations du système
  APP_NAME: "Système de Gestion Topographique",
  APP_VERSION: "1.0.0",
  APP_LOCALE: "fr_FR",

  // Couleurs du thème GAFAM moderne
  COLORS: {
    PRIMARY: "#1a73e8",          // Bleu Google
    SECONDARY: "#34a853",         // Vert Google
    ACCENT: "#fbbc04",            // Jaune Google
    DANGER: "#ea4335",            // Rouge Google
    WARNING: "#ff9800",           // Orange
    SUCCESS: "#34a853",           // Vert
    INFO: "#2196f3",              // Bleu clair
    DARK: "#202124",              // Gris foncé Google
    LIGHT: "#f8f9fa",             // Gris clair
    HEADER_BG: "#1a73e8",         // Fond en-tête
    HEADER_TEXT: "#ffffff",       // Texte en-tête
    ALT_ROW: "#f1f3f4",          // Ligne alternée
    BORDER: "#dadce0"             // Bordure
  },

  // Configuration des feuilles
  SHEETS: {
    DASHBOARD: "📊 Tableau de Bord",
    PROJET: "📁 Projets",
    OUVRAGE: "🏗️ Ouvrages",
    TACHE: "✓ Tâches",
    RELEVE: "📍 Relevés",
    EQUIPE: "👥 Équipes",
    EMPLOYE: "👤 Employés",
    MATERIEL: "🔧 Matériel",
    POSTE: "💼 Postes",
    UTILISATEUR: "🔐 Utilisateurs",
    JOURNAL: "📝 Journal Actions",
    NOTIFICATION: "🔔 Notifications",
    DOCUMENT: "📄 Documents",
    PLANNING: "📅 Planning",
    BUDGET: "💰 Budget",
    FACTURE: "🧾 Factures",
    CONTROLEUR: "✅ Contrôleurs",
    STATS: "📈 Statistiques"
  },

  // Configuration des statuts
  STATUTS: {
    PROJET: ["En Préparation", "En Cours", "En Pause", "Terminé", "Annulé"],
    OUVRAGE: ["Planifié", "En Cours", "Terminé", "Validé", "Rejeté"],
    TACHE: ["À Faire", "En Cours", "En Révision", "Terminée", "Annulée"],
    MATERIEL: ["Disponible", "En Utilisation", "En Maintenance", "Hors Service"],
    DOCUMENT: ["Brouillon", "Soumis", "En Révision", "Validé", "Rejeté"],
    FACTURE: ["Brouillon", "Émise", "Envoyée", "Payée", "Annulée"]
  },

  // Priorités
  PRIORITES: ["Basse", "Normale", "Haute", "Critique"],

  // Types d'ouvrages topographiques
  TYPES_OUVRAGE: [
    "Levé Topographique",
    "Implantation",
    "Piquetage",
    "Nivellement",
    "Cubature",
    "Bornage",
    "Cadastre",
    "Réseau Gravitaire",
    "Canal d'Irrigation",
    "Drainage"
  ],

  // Types de relevés
  TYPES_RELEVE: [
    "Point GPS",
    "Point de Nivellement",
    "Point de Détail",
    "Point d'Implantation",
    "Borne",
    "Profil en Long",
    "Profil en Travers"
  ],

  // Types de matériel
  TYPES_MATERIEL: [
    "Station Totale",
    "GPS RTK",
    "Niveau",
    "Théodolite",
    "Laser Scanner",
    "Drone",
    "Prisme",
    "Jalon",
    "Mire",
    "Équerre",
    "Canne GPS"
  ],

  // Niveaux d'accès utilisateur
  NIVEAUX_ACCES: [
    "Administrateur",
    "Chef de Projet",
    "Topographe",
    "Chef d'Équipe",
    "Opérateur",
    "Lecture Seule"
  ],

  // Types de documents
  TYPES_DOCUMENT: [
    "Plan Topographique",
    "Rapport Technique",
    "Compte Rendu",
    "PV de Réception",
    "Devis",
    "Cahier des Charges",
    "Note de Calcul",
    "Photo",
    "Autre"
  ],

  // Configuration des notifications
  NOTIFICATION: {
    AUTO_SEND: true,
    SEND_EMAIL: true,
    RETENTION_DAYS: 30
  },

  // Configuration du journal
  JOURNAL: {
    RETENTION_DAYS: 365,
    TYPES_ACTION: [
      "Création",
      "Modification",
      "Suppression",
      "Validation",
      "Consultation",
      "Export",
      "Import"
    ]
  },

  // Formats de colonnes pour validation
  FORMATS: {
    DATE: "dd/mm/yyyy",
    DATETIME: "dd/mm/yyyy hh:mm",
    CURRENCY: "#,##0.00 FCFA",
    PERCENTAGE: "0.00%",
    DECIMAL: "#,##0.00",
    COORDINATE: "0.000000"
  },

  // Largeurs de colonnes par défaut
  COLUMN_WIDTHS: {
    ID: 60,
    NAME: 200,
    DESCRIPTION: 300,
    DATE: 110,
    STATUS: 120,
    AMOUNT: 130,
    COORDINATE: 110,
    EMAIL: 200,
    PHONE: 130,
    SMALL: 80,
    MEDIUM: 150,
    LARGE: 250
  }
};

/**
 * Fonction pour obtenir une configuration
 */
function getConfig(path) {
  const parts = path.split('.');
  let value = CONFIG;
  for (const part of parts) {
    value = value[part];
    if (value === undefined) return null;
  }
  return value;
}

/**
 * Fonction pour obtenir la feuille de calcul active
 */
function getActiveSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Fonction pour obtenir ou créer une feuille
 */
function getOrCreateSheet(sheetName) {
  const ss = getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  return sheet;
}

/**
 * Fonction pour logger les actions
 */
function logAction(typeAction, description) {
  try {
    const utilisateur = Session.getActiveUser().getEmail();
    const timestamp = new Date();

    const sheet = getOrCreateSheet(CONFIG.SHEETS.JOURNAL);
    sheet.appendRow([
      timestamp,
      utilisateur,
      typeAction,
      description
    ]);
  } catch (e) {
    console.error("Erreur lors de l'enregistrement de l'action:", e);
  }
}

/**
 * Fonction pour envoyer une notification
 */
function sendNotification(utilisateurEmail, message) {
  try {
    if (!CONFIG.NOTIFICATION.AUTO_SEND) return;

    const sheet = getOrCreateSheet(CONFIG.SHEETS.NOTIFICATION);
    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      utilisateurEmail,
      message,
      false // Non lu
    ]);

    // Envoyer email si configuré
    if (CONFIG.NOTIFICATION.SEND_EMAIL) {
      MailApp.sendEmail({
        to: utilisateurEmail,
        subject: "Notification - " + CONFIG.APP_NAME,
        body: message
      });
    }
  } catch (e) {
    console.error("Erreur lors de l'envoi de la notification:", e);
  }
}
