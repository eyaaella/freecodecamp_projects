# 🚀 PLATEFORME WARAP - PRODUCTION

**WARAP** est une plateforme complète de mise en relation clients-prestataires avec marketplace intégrée, 100% Google Sheets/Apps Script, optimisée pour le Cameroun.

## 📋 Caractéristiques

- ✅ **20 feuilles Google Sheets** avec formules avancées
- ✅ **49 fichiers Apps Script** (.gs) - Architecture microservices
- ✅ **48 fichiers HTML** - Interfaces modernes et intuitives
- ✅ **Identifiants alphanumériques 14 caractères** (CLI, PRE, ANN, TRA, MAT, etc.)
- ✅ **Matching IA** - Score 0-100 basé sur 5 critères pondérés
- ✅ **Sécurité multi-niveaux** - Authentification par email avec 5 rôles
- ✅ **Données Cameroun** - 358 communes, formats téléphone (+237), CFA
- ✅ **Système de fiches navigables** - Alternative moderne aux tableaux

## 🏗️ Architecture

```
WARAP/
├── src/                          # Code Apps Script (.gs)
│   ├── core/                     # Modules Core (8 fichiers)
│   ├── business/                 # Modules Métier (13 fichiers)
│   ├── services/                 # Services Support (12 fichiers)
│   ├── analytics/                # Analytics Avancés (6 fichiers)
│   ├── integrations/             # Intégrations Externes (4 fichiers)
│   └── admin/                    # Administration (4 fichiers)
├── html/                         # Interfaces HTML
│   ├── sidebars/                 # Sidebars (25 fichiers)
│   └── modals/                   # Modals CRUD (23 fichiers)
├── data/                         # Données de référence
│   ├── communes_cameroun.json
│   ├── quartiers.json
│   └── templates/
├── docs/                         # Documentation
│   ├── INSTALLATION.md
│   ├── USER_GUIDE.md
│   └── API_REFERENCE.md
└── tests/                        # Tests

```

## 🚀 Installation

### Prérequis
- Compte Google Workspace ou Gmail
- Accès Google Sheets
- Connexion Internet stable

### Étapes

1. **Créer un nouveau Google Sheet**
   ```
   Nom: WARAP - Production
   ```

2. **Ouvrir l'éditeur Apps Script**
   ```
   Extensions > Apps Script
   ```

3. **Copier les fichiers**
   - Copier tous les fichiers .gs du dossier `src/`
   - Copier tous les fichiers .html du dossier `html/`

4. **Exécuter l'installation**
   ```javascript
   // Dans Apps Script, exécuter:
   installWARAP()
   ```

5. **Actualiser la page**
   - Le menu "🚀 WARAP" apparaît en haut

6. **Configuration initiale**
   - 🚀 WARAP > ⚙️ Paramètres
   - Configurer les emails de notification
   - Définir les taux de commission

## 👥 Utilisateurs par Défaut

| Email | Rôle | Accès |
|-------|------|-------|
| warapservices@gmail.com | SUPERADMIN | Total |
| noeabichaganna@gmail.com | ADMIN_NATIONAL | National |
| eyaaellatheophile@gmail.com | ADMIN_FRANCHISE | Franchise Lagdo |
| eyaellatheophile@gmail.com | AGENT | Commune Lagdo |

## 🔧 Configuration

### Paramètres Principaux

- **Commission Plateforme**: 15%
- **Commission Franchise**: 10%
- **Commission Prestataire**: 75%
- **Score Auto-Validation Matching**: 85/100
- **Délai Matching**: 2 minutes
- **SLA SAV**: 48 heures

## 📊 Modules Disponibles

1. **Clients** - Gestion clients avec segmentation RFM
2. **Prestataires** - Gestion prestataires avec badges performance
3. **Annonces** - Publication et suivi des demandes de service
4. **Matching IA** - Attribution automatique intelligente
5. **Transactions** - Gestion financière et facturation
6. **Analytics** - Tableaux de bord et prévisions
7. **Produits** - Catalogue et gestion stocks
8. **Livraisons** - Logistique et optimisation tournées
9. **Rendez-vous** - Calendrier intelligent
10. **Litiges** - Médiation et résolution
11. **SAV** - Service après-vente
12. **Administration** - Gestion utilisateurs et configuration

## 🆔 Identifiants Alphanumériques

Format: **[PREFIX 3 LETTRES][11 CHIFFRES ALÉATOIRES]**

| Préfixe | Type | Exemple |
|---------|------|---------|
| CLI | Client | CLI12345678901 |
| PRE | Prestataire | PRE98765432109 |
| ANN | Annonce | ANN11223344556 |
| TRA | Transaction | TRA55667788990 |
| MAT | Matching | MAT99887766554 |
| PRD | Produit | PRD44556677889 |
| LIV | Livraison | LIV22334455667 |
| RDV | Rendez-vous | RDV88776655443 |
| LIT | Litige | LIT33445566778 |
| SAV | Ticket SAV | SAV66778899001 |

## 🎯 Matching IA

### Algorithme de Scoring (0-100)

1. **Compétences** (30%) - Correspondance domaines
2. **Localisation** (25%) - Proximité géographique
3. **Disponibilité** (20%) - Calendrier et horaires
4. **Expérience** (15%) - Années + missions
5. **Réputation** (10%) - Note + taux completion

### Décisions Automatiques

- **Score ≥ 85** : Auto-validé
- **Score 50-84** : Revue agent requise
- **Score < 50** : Rejeté

## 📍 Données Cameroun

- **358 communes** (10 régions)
- **Format téléphone**: +237 6XX XX XX XX
- **Devise**: FCFA (XAF)
- **Langues**: Français, Anglais

## 🔒 Sécurité

### Rôles et Permissions

1. **SUPERADMIN** - Accès total
2. **ADMIN_NATIONAL** - Toutes franchises
3. **ADMIN_FRANCHISE** - Une franchise
4. **SUPERVISEUR** - Une zone
5. **AGENT** - Une commune

### Logs et Audit

Tous les événements sont enregistrés :
- Connexions
- Créations/Modifications/Suppressions
- Erreurs et alertes
- Événements sécurité

## 📖 Documentation

- [Guide Installation](docs/INSTALLATION.md)
- [Guide Utilisateur](docs/USER_GUIDE.md)
- [Référence API](docs/API_REFERENCE.md)
- [FAQ](docs/FAQ.md)

## 🆘 Support

- **Email**: warapservices@gmail.com
- **Issues**: Utiliser le système de tickets intégré
- **Documentation**: Consulter le guide utilisateur

## 📝 Changelog

### Version 1.0.0 (2024)
- ✅ Système complet opérationnel
- ✅ 20 feuilles avec formules
- ✅ 49 fichiers .gs
- ✅ 48 fichiers .html
- ✅ Matching IA fonctionnel
- ✅ Sécurité multi-niveaux
- ✅ Données Cameroun intégrées

## 📜 Licence

Propriétaire - WARAP Services
Tous droits réservés © 2024

---

**Développé avec ❤️ pour le Cameroun**
