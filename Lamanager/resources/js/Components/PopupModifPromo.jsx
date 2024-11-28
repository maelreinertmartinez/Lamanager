import React, { useState, useEffect } from "react";
import axios from "axios";
import PopupModifBut1 from "./PopupModifBut1.jsx";
import PopupModifBut2 from "./PopupModifBut2.jsx";
import PopupModifBut3 from "./PopupModifBut3.jsx";

function PopupModifPromo({ onClose, promos, selectedYear }) {
    const [promoData, setPromoData] = useState(promos);
    const [showBouttonVoirPopup1, setShowBouttonVoirPopup1] = useState(false);
    const [showBouttonVoirPopup2, setShowBouttonVoirPopup2] = useState(false);
    const [showBouttonVoirPopup3, setShowBouttonVoirPopup3] = useState(false);
    const [groupes, setGroupes] = useState([]);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const responses = await Promise.all(promos.slice(0, 3).map(promo => axios.get(`/api/groupes/${promo.id}`)));
                const allGroupes = responses.flatMap(response => response.data);
                console.log(allGroupes);
                setGroupes(allGroupes);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };

        if (showBouttonVoirPopup1 || showBouttonVoirPopup2 || showBouttonVoirPopup3) {
            fetchGroupes();
        }
    }, [showBouttonVoirPopup1, showBouttonVoirPopup2, showBouttonVoirPopup3, promos]);

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
        <div className="custom-popup-overlay-modif" onClick={onClose}>
            <div className="custom-popup-content-modif" onClick={(e) => e.stopPropagation()}>
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
                </div>

                <div className="custom-button-modif-container">
                    <button onClick={() => setShowBouttonVoirPopup3(true)}>Modifier But3</button>
                    <button onClick={() => setShowBouttonVoirPopup2(true)}>Modifier But2</button>
                    <button onClick={() => setShowBouttonVoirPopup1(true)}>Modifier But1</button>

                </div>

                <div className="custom-button-container">
                    <button onClick={handleSubmit}>Valider</button>
                </div>

                {showBouttonVoirPopup1 && (
                    <PopupModifBut1
                        onClose={() => setShowBouttonVoirPopup1(false)}
                        promos={promoData}
                        groupes={groupes}
                        selectedYear={selectedYear}
                    />
                )}
                {showBouttonVoirPopup2 && (
                    <PopupModifBut2
                        onClose={() => setShowBouttonVoirPopup2(false)}
                        promos={promoData}
                        groupes={groupes}
                        selectedYear={selectedYear}
                    />
                )}
                {showBouttonVoirPopup3 && (
                    <PopupModifBut3
                        onClose={() => setShowBouttonVoirPopup3(false)}
                        promos={promoData}
                        groupes={groupes}
                        selectedYear={selectedYear}
                    />
                )}
            </div>
        </div>
    );
}

export default PopupModifPromo;
