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
        const newPromo = await handlePromos(); // Obtenir la promo créée
        if (newPromo) {
            await handleGroupes(newPromo); // Passer la promo directement
        }
    }


    const handlePromos = async () => {
        try {
            const promo = await axios.post('/api/promos', {
                annee_id: selectedAnnee.id,
                alternant_id: null,
                nom: promoName,
                nombre_td: tdNbr,
                nombre_tp: tpNbr,
                alternant: false,
            });
            if(isAlternant){
                const alternant_promo = await axios.post('/api/promos', {
                    annee_id: selectedAnnee.id,
                    alternant_id: promo.data.id,
                    nom: promoName,
                    nombre_td: tdNbr,
                    nombre_tp: tpNbr,
                    alternant: true,
                })
                
                try{
                    await axios.post(`/api/update-promos/${promo.data.id}`,  {
                        alternant_id: alternant_promo.data.id,
                    });

                }catch(error){
                    console.log("Erreur dans l'update de la promo");
                }
                
            };
            
            console.log("Promo créée :", promo.data);
            return promo.data; // Retourne la promo créée
        } catch (err) {
            console.error("Erreur lors de la création de la promo", err);
            return null; // En cas d'erreur
        }
    };

    const handleGroupes = async (promo) => {
        let temp = 0;
        await axios.post('/api/groupes', {
            promo_id: promo.id,
            nom: "CM",
            type: "CM",
        });
        for (let i = 0; i < promo.nombre_td; i++) {

            const nomTD = "TD" + i;
            const td = await axios.post('/api/groupes', {
                promo_id: promo.id,
                nom: nomTD,
                type: "TD",
            });
            for (let j = 1; j <= promo.nombre_tp/promo.nombre_td; j++) {
                temp = temp+1;
                const nomTP = "TP" + temp;

                const tp = await axios.post('/api/groupes', {
                    promo_id: promo.id,
                    nom: nomTP,
                    type: "TP",
                });

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