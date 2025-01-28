#!/bin/bash

cd /Users/sofiansmimid/Documents/Docs/BUT3/SAE/Lamanager/Lamanager

# Fonction pour remplacer en toute sécurité
safe_replace() {
    local search="$1"
    local replace="$2"
    local file="$3"
    sed -i '' "s|$search|$replace|g" "$file"
}

# Mise à jour des imports pour les composants communs
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/InputError|@/Components/Commun/ErreurChampComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/InputLabel|@/Components/Commun/EtiquetteChampComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/TextInput|@/Components/Commun/ChampTexteComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/PrimaryButton|@/Components/Boutons/BoutonPrimaireComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/SecondaryButton|@/Components/Boutons/BoutonSecondaireComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/DangerButton|@/Components/Boutons/BoutonDangerComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/Modal|@/Components/FenetresModales/FenetreModalComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/MenuAnnee|@/Components/Commun/MenuAnneeComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/ApplicationLogo|@/Components/Commun/LogoApplicationComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/RolePopup|@/Components/FenetresModales/PopupRoleComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/ImportPopup|@/Components/FenetresModales/PopupImportComposant|g' {} +

# Mise à jour des imports pour les composants de mise en page
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/Header|@/Components/MiseEnPage/EnteteComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/HeaderNeutre|@/Components/MiseEnPage/EnteteNeutreComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/LeftPart|@/Components/MiseEnPage/PartieGaucheComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/RightPart|@/Components/MiseEnPage/PartieDroiteComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/BarreOutils|@/Components/MiseEnPage/BarreOutilsComposant|g' {} +

# Mise à jour des imports pour les composants de profil
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/ProfilLeftPart|@/Components/Profil/PartieGaucheProfilComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/ProfilRightPart|@/Components/Profil/PartieDroiteProfilComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/GestionCompte|@/Components/Profil/GestionCompteComposant|g' {} +

# Mise à jour des imports pour les composants de tableau
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/Tableau|@/Components/Tableaux/TableauComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/TableauVersionProf|@/Components/Tableaux/TableauProfesseurComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/TableauVersionProfDetail|@/Components/Tableaux/TableauProfesseurDetailComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/VersionProfLeftPart|@/Components/Tableaux/PartieGaucheProfesseurComposant|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/VersionProfRightPart|@/Components/Tableaux/PartieDroiteProfesseurComposant|g' {} +

# Mise à jour des imports pour les composants de boutons
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/BoutonProfil|@/Components/Boutons/BoutonProfilComposant|g' {} +

# Mise à jour des imports pour les composants de formulaire
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/AddAnneeForm|@/Components/Formulaires/FormulaireAjoutAnneeComposant|g' {} +

# Mise à jour des imports pour les composants de tableau gauche
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/TableauLeftPart/|@/Components/Tableaux/PartieGaucheTableau/|g' {} +

# Mise à jour des imports pour les composants de tableau
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/TableauComponents/|@/Components/Tableaux/ComposantsTableau/|g' {} +

# Mise à jour des imports pour les composants de promo
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|@/Components/PromoRightPart|@/Components/Promotion/PartieDroitePromoComposant|g' {} +

# Correction des chemins incorrects
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|Tableaux/TableauComposantx/|Tableaux/|g' {} +
find resources/js -type f -name "*.jsx" -exec sed -i '' 's|/TableauComposant/|/|g' {} +

# Mise à jour des fichiers manquants
mv resources/js/Components/VersionProfLeftPart.jsx resources/js/Components/Tableaux/PartieGaucheProfesseurComposant.jsx 2>/dev/null || true
mv resources/js/Components/VersionProfRightPart.jsx resources/js/Components/Tableaux/PartieDroiteProfesseurComposant.jsx 2>/dev/null || true
mv resources/js/Components/PromoRightPart.jsx resources/js/Components/Promotion/PartieDroitePromoComposant.jsx 2>/dev/null || true
mv resources/js/Components/ApplicationLogo.jsx resources/js/Components/Commun/LogoApplicationComposant.jsx 2>/dev/null || true
mv resources/js/Components/RolePopup.jsx resources/js/Components/FenetresModales/PopupRoleComposant.jsx 2>/dev/null || true
mv resources/js/Components/ImportPopup.jsx resources/js/Components/FenetresModales/PopupImportComposant.jsx 2>/dev/null || true

echo "Mise à jour des imports terminée"
