import React, {useEffect, useState} from "react";
import axios from "axios";

function CustomPopup({ onClose, selectedAnnee }) {
    // États pour stocker les données
    const [promoName, setPromoName] = useState("");
    const [tdName, setTdName] = useState("");
    const [tpName, setTpName] = useState("");
    const [isAlternant, setIsAlternant] = useState(false);

    // Fonction pour gérer la soumission
    async function creationPromo() {
        const newPromo = await handlePromos(); // Obtenir la promo créée
        if (newPromo) {
            await handleGroupes(newPromo); // Passer la promo directement
        }
    }


    const handlePromos = async () => {
        try {
            const reponse = await axios.post('/api/promos', {
                annee_id: selectedAnnee.id,
                nom: promoName,
                nombre_td: tdName,
                nombre_tp: tpName,
                alternant: isAlternant,
            });
            console.log("Promo créée :", reponse.data);
            return reponse.data; // Retourne la promo créée
        } catch (err) {
            console.error("Erreur lors de la création de la promo", err);
            return null; // En cas d'erreur
        }
    };

    const handleGroupes = async (promo) => {

        await axios.post('/api/groupes', {
            promo_id: promo.id,
            nom: "CM",
            type: "CM",
        });
        for (let i = 1; i <= promo.nombre_td; i++) {
            const nomTD = "TD" + i;
            await axios.post('/api/groupes', {
                promo_id: promo.id,
                nom: nomTD,
                type: "TD",
            });
        }

        for (let j = 1; j <= promo.nombre_tp; j++) {
            const nomTP = "TP" + j;

            await axios.post('/api/groupes', {
                promo_id: promo.id,
                nom: nomTP,
                type: "TP",
            });
        }


        onClose(); // Fermer la popup après soumission
    };

    return (
        <div className="custom-popup-overlay" onClick={onClose}>
            <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="custom-promo-name-container">
                    <p>Nom de la promo :</p>
                    <input
                        type="text"
                        value={promoName}
                        onChange={(e) => setPromoName(e.target.value)} // Mise à jour de l'état
                    />
                </div>

                <div className="custom-input-container">
                    <div className="custom-input-group">
                        <label>Nom de groupe TD :</label>
                        <input
                            type="text"
                            value={tdName}
                            onChange={(e) => setTdName(e.target.value)} // Mise à jour de l'état
                        />
                    </div>

                    <div className="custom-input-group">
                        <label>Nom de groupe TP :</label>
                        <input
                            type="text"
                            value={tpName}
                            onChange={(e) => setTpName(e.target.value)} // Mise à jour de l'état
                        />
                    </div>
                </div>

                <div className="custom-input-group">
                    <label>Alternant :</label>
                    <input
                        type="checkbox"
                        checked={isAlternant}
                        onChange={(e) => setIsAlternant(e.target.checked)} // Mise à jour de l'état
                    />
                </div>

                <div className="custom-button-container">
                    <button onClick={creationPromo}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default CustomPopup;
