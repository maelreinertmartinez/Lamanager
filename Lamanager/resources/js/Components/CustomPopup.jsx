import React, {useEffect, useState} from "react";
import axios from "axios";
function CustomPopup({ onClose, selectedAnnee }) {
    // États pour stocker les données
    const [promoName, setPromoName] = useState("");
    const [tdNbr, setTdNbr] = useState("");
    const [tpNbr, setTpNbr] = useState("");
    const [isAlternant, setIsAlternant] = useState(false);

    // Fonction pour gérer la soumission
    async function creationPromo() {
        const newPromo = await handlePromos(); // Créer la promo normale
        if (newPromo) {
            await handleGroupes(newPromo); // Créer les groupes pour la promo normale

            if (isAlternant) {
                // Créer la promo alternante
                const alternantPromo = await handlePromosAlternant(newPromo);
                if (alternantPromo) {
                    await handleGroupes(alternantPromo); // Créer les groupes pour la promo alternante
                }
            }
        }
    }

    async function addPromo(selectedAnnee, alternantId, promoName, tdNbr, tpNbr, alternant) {
        return await axios.post('/api/promos', {
            annee_id: selectedAnnee.id,
            alternant_id: alternantId,
            nom: promoName,
            nombre_td: tdNbr,
            nombre_tp: tpNbr,
            alternant: alternant,
        });
    }
    async function addGroupe(promo, nom, type) {
        return await axios.post('/api/groupes', {
            promo_id: promo.id,
            nom: nom,
            type: type,
        });
    }

    const handlePromos = async () => {
        try {
            const promo = await addPromo(selectedAnnee,null, promoName, tdNbr, tpNbr, false);
            console.log("Promo créée :", promo.data);
            return promo.data;
        } catch (err) {
            console.error("Erreur lors de la création de la promo", err);
            return null;
        }
    };

    const handlePromosAlternant = async (promo) => {
        try {
            const alternantPromo = await addPromo
            (selectedAnnee,promo.id, `${promo.nom} Alternant`, promo.nombre_td, promo.nombre_tp, true);

            // Mettre à jour la promo principale avec l'alternant_id
            await axios.post(`/api/update-promos/${promo.id}`, {
                alternant_id: alternantPromo.data.id,
            });

            console.log("Promo alternante créée :", alternantPromo.data);
            return alternantPromo.data;
        } catch (err) {
            console.error("Erreur lors de la création de la promo alternante", err);
            return null;
        }
    };

    const handleGroupes = async (promo) => {
        let num_td = 0;
        console.log("promo actuel", promo);
        await addGroupe(promo, "CM", "CM");

        for (let i = 0; i < promo.nombre_td; i++) {
            const nomTD = "TD" + parseInt(i + 1);
            const td = await addGroupe(promo, nomTD, "TD");

            for (let j = 1; j <= promo.nombre_tp/promo.nombre_td; j++) {
                num_td = num_td+1;
                const nomTP = "TP" + num_td;
                const tp = await addGroupe(promo, nomTP, "TP");
                console.log(td,tp,td.data.id);

                await axios.post('/api/liaison', {
                    groupe_td_id: td.data.id,
                    groupe_tp_id: tp.data.id,
                });
            }
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
                            value={tdNbr}
                            onChange={(e) => setTdNbr(e.target.value)} // Mise à jour de l'état
                        />
                    </div>

                    <div className="custom-input-group">
                        <label>Nom de groupe TP :</label>
                        <input
                            type="text"
                            value={tpNbr}
                            onChange={(e) => setTpNbr(e.target.value)} // Mise à jour de l'état
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
