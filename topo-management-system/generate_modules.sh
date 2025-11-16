#!/bin/bash

# Ce script génère rapidement tous les modules manquants
# Il sera utilisé pour créer les fichiers de base de chaque module

echo "Génération des modules en cours..."

# Liste des modules à générer
modules=(
  "OUVRAGE" 
  "TACHE" 
  "RELEVE" 
  "EQUIPE" 
  "EMPLOYE" 
  "MATERIEL" 
  "POSTE" 
  "UTILISATEUR" 
  "JOURNAL_ACTIONS" 
  "NOTIFICATION" 
  "DOCUMENT" 
  "PLANNING" 
  "BUDGET" 
  "FACTURE" 
  "CONTROLEUR"
  "STATS"
)

for module in "${modules[@]}"; do
  echo "Création du module $module..."
  
  # Le contenu sera créé séparément pour chaque module
  touch "/home/user/freecodecamp_projects/topo-management-system/${module}/${module}Module.gs"
  touch "/home/user/freecodecamp_projects/topo-management-system/${module}/${module}Sidebar.html"
  touch "/home/user/freecodecamp_projects/topo-management-system/${module}/${module}Modal.html"
done

echo "Modules créés avec succès!"
