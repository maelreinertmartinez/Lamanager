import React, { useState, useEffect } from "react";
import axios from "axios";
import BouttonVoir from "./BouttonVoir";

function PopupModifPromo({ onClose, promos }) {
    const [promoData, setPromoData] = useState(promos);
    const [showBouttonVoirPopup, setShowBouttonVoirPopup] = useState(false);
    const [groupes, setGroupes] = useState([]);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await axios.get(`/api/groupes/${promos[0].id}`);
                console.log(response.data);
                setGroupes(response.data);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };


        if (showBouttonVoirPopup) {
            fetchGroupes();
        }
    }, [showBouttonVoirPopup, promos]);

    const handleInputChange = (index, field, value) => {
        const newPromoData = [...promoData];
        newPromoData[index][field] = value;
        setPromoData(newPromoData);
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/update-promos', { promos: promoData });
            onClose();
        } catch (error) {
            console.error("Error updating promos:", error);
        }
    };

    return (
        <div className="custom-popup-overlay" onClick={onClose}>
            <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="modif-promo-name-container">
                    <label>Nom de la promo :</label>
                    {promoData.map((promo, index) => (
                        <input
                            key={index}
                            type="text"
                            value={promo.nom}
                            onChange={(e) => handleInputChange(index, 'nom', e.target.value)}
                        />
                    ))}
                </div>

                <div className="modif-promo-numbertd-container">
                    <label>Nombre de groupe TD :</label>
                    {promoData.map((promo, index) => (
                        <input
                            key={index}
                            type="text"
                            value={promo.nombre_td}
                            onChange={(e) => handleInputChange(index, 'nombre_td', e.target.value)}
                        />
                    ))}
                    <button onClick={() => setShowBouttonVoirPopup(true)}>Voir</button>
                </div>

                <div className="modif-promo-numbertp-container">
                    <label>Nombre de groupe TP :</label>
                    {promoData.map((promo, index) => (
                        <input
                            key={index}
                            type="text"
                            value={promo.nombre_tp}
                            onChange={(e) => handleInputChange(index, 'nombre_tp', e.target.value)}
                        />
                    ))}
                    <button onClick={() => setShowBouttonVoirPopup(true)}>Voir</button>
                </div>

                <div className="custom-button-container">
                    <button onClick={handleSubmit}>Valider</button>
                </div>

                {showBouttonVoirPopup && (
                    <BouttonVoir
                        onClose={() => setShowBouttonVoirPopup(false)}
                        promos={promoData}
                        groupes={groupes}
                    />
                )}
            </div>
        </div>
    );
}

export default PopupModifPromo;
