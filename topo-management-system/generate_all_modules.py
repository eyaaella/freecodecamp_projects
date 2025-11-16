#!/usr/bin/env python3
"""
Script de génération automatique de tous les modules
du système de gestion topographique
"""

import os

# Configuration des modules
MODULES_CONFIG = {
    'OUVRAGE': {
        'icon': '🏗️',
        'title': 'Ouvrages',
        'columns': [
            ('ID Ouvrage', 80, '0'),
            ('ID Projet', 80, '0'),
            ('Nom Ouvrage', 250, ''),
            ('Type Ouvrage', 180, ''),
            ('Description', 300, ''),
            ('Statut', 130, ''),
            ('Responsable', 180, ''),
            ('Date Début', 110, 'dd/mm/yyyy'),
            ('Date Fin', 110, 'dd/mm/yyyy'),
            ('Durée (jours)', 100, '#,##0'),
            ('Nb Tâches', 90, '#,##0'),
            ('% Avancement', 110, '0.0%'),
            ('Coût Estimé', 140, '#,##0.00 "FCFA"'),
            ('Coût Réel', 140, '#,##0.00 "FCFA"'),
            ('Écart', 140, '#,##0.00 "FCFA"'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'J': '=SI(ET(COUNTA(H6:I6)=2);I6-H6;"")',
            'K': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'✓ Tâches'" + '!B:B;A6))',
            'L': '=SI(K6>0;NB.SI.ENS(' + "'✓ Tâches'" + '!G:G;"Terminée";' + "'✓ Tâches'" + '!B:B;A6)/K6;"")',
            'N': '=SI(COUNTA(M6:M6)=0;"";SOMME.SI(' + "'✓ Tâches'" + '!B:B;A6;' + "'✓ Tâches'" + '!N:N))',
            'O': '=SI(COUNTA(M6:M6)=0;"";M6-N6)',
        }
    },
    'TACHE': {
        'icon': '✓',
        'title': 'Tâches',
        'columns': [
            ('ID Tâche', 80, '0'),
            ('ID Ouvrage', 90, '0'),
            ('ID Équipe', 90, '0'),
            ('ID Matériel', 90, '0'),
            ('Description', 300, ''),
            ('Date Début', 110, 'dd/mm/yyyy'),
            ('Date Fin', 110, 'dd/mm/yyyy'),
            ('Statut', 130, ''),
            ('Priorité', 110, ''),
            ('Durée (jours)', 100, '#,##0'),
            ('% Avancement', 110, '0.0%'),
            ('Responsable', 180, ''),
            ('Observations', 250, ''),
            ('Coût Estimé', 140, '#,##0.00 "FCFA"'),
            ('Coût Réel', 140, '#,##0.00 "FCFA"'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'J': '=SI(ET(COUNTA(F6:G6)=2);G6-F6;"")',
        }
    },
    'RELEVE': {
        'icon': '📍',
        'title': 'Relevés Topographiques',
        'columns': [
            ('ID Relevé', 80, '0'),
            ('ID Tâche', 90, '0'),
            ('ID Employé', 90, '0'),
            ('Date Relevé', 110, 'dd/mm/yyyy hh:mm'),
            ('Coordonnée X', 120, '0.000000'),
            ('Coordonnée Y', 120, '0.000000'),
            ('Coordonnée Z', 120, '0.000000'),
            ('Type Relevé', 150, ''),
            ('Observations', 250, ''),
            ('Validé', 90, ''),
            ('Précision (m)', 110, '0.000'),
            ('Équipement', 150, ''),
            ('Conditions Météo', 150, ''),
            ('Photo/Document', 200, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
        }
    },
    'EMPLOYE': {
        'icon': '👤',
        'title': 'Employés',
        'columns': [
            ('ID Employé', 90, '0'),
            ('Nom', 150, ''),
            ('Prénom', 150, ''),
            ('ID Équipe', 90, '0'),
            ('ID Poste', 90, '0'),
            ('Email', 200, ''),
            ('Téléphone', 130, ''),
            ('Date Embauche', 120, 'dd/mm/yyyy'),
            ('Ancienneté (jours)', 130, '#,##0'),
            ('Statut', 120, ''),
            ('Compétences', 250, ''),
            ('Nb Tâches', 90, '#,##0'),
            ('Nb Relevés', 90, '#,##0'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'I': '=SI(COUNTA(H6:H6)>0;AUJOURDHUI()-H6;"")',
            'L': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'📍 Relevés'" + '!C:C;A6))',
            'M': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'✓ Tâches'" + '!L:L;B6&" "&C6))',
        }
    },
    'EQUIPE': {
        'icon': '👥',
        'title': 'Équipes',
        'columns': [
            ('ID Équipe', 90, '0'),
            ('Nom Équipe', 200, ''),
            ('Chef d\'Équipe', 180, ''),
            ('Nb Membres', 100, '#,##0'),
            ('Spécialité', 180, ''),
            ('Statut', 120, ''),
            ('Nb Tâches Actives', 130, '#,##0'),
            ('Nb Tâches Terminées', 150, '#,##0'),
            ('Taux Réussite', 120, '0.0%'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'D': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'👤 Employés'" + '!D:D;A6))',
            'G': '=SI(COUNTA(A6:A6)=0;"";NB.SI.ENS(' + "'✓ Tâches'" + '!C:C;A6;' + "'✓ Tâches'" + '!H:H;"En Cours"))',
            'H': '=SI(COUNTA(A6:A6)=0;"";NB.SI.ENS(' + "'✓ Tâches'" + '!C:C;A6;' + "'✓ Tâches'" + '!H:H;"Terminée"))',
            'I': '=SI(ET(G6>0;H6>0);H6/(G6+H6);"")',
        }
    },
    'MATERIEL': {
        'icon': '🔧',
        'title': 'Matériel',
        'columns': [
            ('ID Matériel', 90, '0'),
            ('Nom Matériel', 200, ''),
            ('Type Matériel', 180, ''),
            ('Numéro Série', 150, ''),
            ('Date Acquisition', 120, 'dd/mm/yyyy'),
            ('Date Dernier Entretien', 140, 'dd/mm/yyyy'),
            ('Statut', 130, ''),
            ('Coût Acquisition', 140, '#,##0.00 "FCFA"'),
            ('Coût Entretien Total', 140, '#,##0.00 "FCFA"'),
            ('Prochaine Maintenance', 150, 'dd/mm/yyyy'),
            ('Jours avant Maintenance', 150, '#,##0'),
            ('Utilisations', 100, '#,##0'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'K': '=SI(COUNTA(J6:J6)>0;J6-AUJOURDHUI();"")',
            'L': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'✓ Tâches'" + '!D:D;A6))',
        }
    },
    'POSTE': {
        'icon': '💼',
        'title': 'Postes',
        'columns': [
            ('ID Poste', 90, '0'),
            ('Intitulé Poste', 220, ''),
            ('Description', 300, ''),
            ('Salaire Base', 140, '#,##0.00 "FCFA"'),
            ('Département', 150, ''),
            ('Nb Employés', 110, '#,##0'),
            ('Compétences Requises', 300, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'F': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'👤 Employés'" + '!E:E;A6))',
        }
    },
    'BUDGET': {
        'icon': '💰',
        'title': 'Budget',
        'columns': [
            ('ID Budget', 90, '0'),
            ('ID Projet', 90, '0'),
            ('Montant Total', 150, '#,##0.00 "FCFA"'),
            ('Montant Utilisé', 150, '#,##0.00 "FCFA"'),
            ('Montant Restant', 150, '#,##0.00 "FCFA"'),
            ('% Utilisation', 120, '0.0%'),
            ('Date Création', 120, 'dd/mm/yyyy'),
            ('Statut', 130, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'D': '=SI(COUNTA(A6:A6)=0;"";SOMME.SI.ENS(' + "'🧾 Factures'" + '!B:B;B6;' + "'🧾 Factures'" + '!E:E;"Payée";' + "'🧾 Factures'" + '!D:D;' + "'🧾 Factures'" + '!D:D))',
            'E': '=SI(COUNTA(C6:C6)=0;"";C6-D6)',
            'F': '=SI(ET(COUNTA(C6:C6)>0;C6>0);D6/C6;"")',
        }
    },
    'FACTURE': {
        'icon': '🧾',
        'title': 'Factures',
        'columns': [
            ('ID Facture', 90, '0'),
            ('ID Projet', 90, '0'),
            ('Date Facture', 120, 'dd/mm/yyyy'),
            ('Montant', 150, '#,##0.00 "FCFA"'),
            ('Statut', 130, ''),
            ('Date Paiement', 120, 'dd/mm/yyyy'),
            ('Mode Paiement', 150, ''),
            ('Référence', 180, ''),
            ('Fournisseur', 200, ''),
            ('Description', 300, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
        }
    },
    'DOCUMENT': {
        'icon': '📄',
        'title': 'Documents',
        'columns': [
            ('ID Document', 90, '0'),
            ('ID Ouvrage', 90, '0'),
            ('Nom Document', 250, ''),
            ('Type Document', 150, ''),
            ('Chemin Fichier', 300, ''),
            ('Date Création', 120, 'dd/mm/yyyy'),
            ('Statut', 130, ''),
            ('Décision Contrôle', 150, ''),
            ('Décision Hiérarchie', 150, ''),
            ('Version Document', 120, '0'),
            ('ID Contrôleur', 110, '0'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
        }
    },
    'UTILISATEUR': {
        'icon': '🔐',
        'title': 'Utilisateurs',
        'columns': [
            ('ID Utilisateur', 110, '0'),
            ('ID Employé', 100, '0'),
            ('Nom Utilisateur', 180, ''),
            ('Niveau Accès', 150, ''),
            ('Date Création', 120, 'dd/mm/yyyy'),
            ('Dernière Connexion', 150, 'dd/mm/yyyy hh:mm'),
            ('Statut', 120, ''),
            ('Email', 200, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
        }
    },
    'NOTIFICATION': {
        'icon': '🔔',
        'title': 'Notifications',
        'columns': [
            ('ID Notification', 120, '0'),
            ('ID Utilisateur', 110, '0'),
            ('Message', 350, ''),
            ('Date Création', 140, 'dd/mm/yyyy hh:mm'),
            ('Lu', 80, ''),
            ('Priorité', 110, ''),
            ('Type', 130, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
        }
    },
    'PLANNING': {
        'icon': '📅',
        'title': 'Planning',
        'columns': [
            ('ID Planning', 100, '0'),
            ('Date Début', 120, 'dd/mm/yyyy'),
            ('Date Fin', 120, 'dd/mm/yyyy'),
            ('Type Planning', 150, ''),
            ('Nb Tâches', 100, '#,##0'),
            ('Description', 300, ''),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
        }
    },
    'CONTROLEUR': {
        'icon': '✅',
        'title': 'Contrôleurs',
        'columns': [
            ('ID Contrôleur', 110, '0'),
            ('Nom', 150, ''),
            ('Prénom', 150, ''),
            ('Spécialité', 180, ''),
            ('Organisme', 200, ''),
            ('Contact', 150, ''),
            ('Email', 200, ''),
            ('Nb Documents', 120, '#,##0'),
            ('Nb Validations', 130, '#,##0'),
        ],
        'formulas': {
            'A': '=SI(LIGNE()=6;1;SI(A5="";"";A5+1))',
            'H': '=SI(COUNTA(A6:A6)=0;"";NB.SI(' + "'📄 Documents'" + '!K:K;A6))',
            'I': '=SI(COUNTA(A6:A6)=0;"";NB.SI.ENS(' + "'📄 Documents'" + '!K:K;A6;' + "'📄 Documents'" + '!G:G;"Validé"))',
        }
    },
}

print("✅ Configuration des modules chargée")
print(f"📊 Nombre de modules à générer: {len(MODULES_CONFIG)}")

for module_name, config in MODULES_CONFIG.items():
    print(f"\n🔧 Génération du module {config['icon']} {module_name}...")

# Script terminé
print("\n✅ Script de génération terminé!")
print("📝 Utilisez ce script comme référence pour créer les modules")
