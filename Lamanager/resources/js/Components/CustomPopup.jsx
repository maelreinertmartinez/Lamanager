import React, { useState } from "react";
import axios from "axios";

function CustomPopup({ onClose, selectedAnnee }) {
    const [promoName, setPromoName] = useState("");
    const [tdName, setTdName] = useState("");
    const [tpName, setTpName] = useState("");
    const [isAlternant, setIsAlternant] = useState(false);

    async function creationPromo() {
        const newPromo = await handlePromos();
        if (newPromo) {
            await handleGroupes(newPromo);
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
            return reponse.data;
        } catch (err) {
            console.error("Erreur lors de la création de la promo", err);
            return null;
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
        onClose();
    };

    return (
        <div className="custom-popup-overlay-unique" onClick={onClose}>
            <div className="custom-popup-content-unique" onClick={(e) => e.stopPropagation()}>
                <div className="custom-promo-name-container-unique">
                    <p>Nom de la promo :</p>
                    <input
                        type="text"
                        value={promoName}
                        onChange={(e) => setPromoName(e.target.value)}
                    />
                </div>
                <div className="custom-input-container-unique">
                    <div className="custom-input-group-unique">
                        <label>Nom de groupe TD :</label>
                        <input
                            type="text"
                            value={tdName}
                            onChange={(e) => setTdName(e.target.value)}
                        />
                    </div>
                    <div className="custom-input-group-unique">
                        <label>Nom de groupe TP :</label>
                        <input
                            type="text"
                            value={tpName}
                            onChange={(e) => setTpName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="custom-input-group-unique">
                    <label>Alternant :</label>
                    <input
                        type="checkbox"
                        checked={isAlternant}
                        onChange={(e) => setIsAlternant(e.target.checked)}
                    />
                </div>
                <div className="custom-button-container-unique">
                    <button onClick={creationPromo}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default CustomPopup;
