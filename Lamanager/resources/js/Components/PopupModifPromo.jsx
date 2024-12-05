import React, { useState, useEffect } from "react";
import PopupModifPromoAdaptative from "./PopupModifPromoAdaptative.jsx";
import axios from "axios";
function PopupModifPromo({ onClose, promos }) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [promoData, setPromoData] = useState(promos);

    useEffect(() => {
        const fetchGroupesForPromos = async () => {
            const updatedPromos = await Promise.all(promoData.map(async (promo) => {
                try {
                    const response = await axios.get(`/api/groupes/${promo.id}`);
                    return { ...promo, groupes: response.data };
                } catch (error) {
                    console.error(`Error fetching groupes for promo ${promo.id}:`, error);
                    return { ...promo, groupes: [] };
                }
            }));
            setPromoData(updatedPromos);
        };

        fetchGroupesForPromos();
    }, []);

    const handleButtonClick = (promoName) => {
        setSelectedPromo(promoName);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedPromo(null);
    };

    const handleInputChange = (index, field, value) => {
        const newPromoData = [...promoData];
        newPromoData[index][field] = value;
        setPromoData(newPromoData);
    };
    
    const updatePromoData = (promoId, type, newCount) => {
        const newPromoData = promoData.map(promo => {
            if (promo.id === promoId) {
                if (type === 'TD') {
                    promo.nombre_td = newCount;
                } else if (type === 'TP') {
                    promo.nombre_tp = newCount;
                }
            }
            return promo;
        });
        setPromoData(newPromoData);
    };

    const handleSubmit = async () => {
        try {
            console.log(promoData);
            await axios.post('/api/promos/update', { promos: promoData });
            onClose();
        } catch (error) {
            console.error("Error updating promos:", error);
        }
    };

    const calculateGroupCounts = (promo) => {
        const tdCount = promo.groupes ? promo.groupes.filter(groupe => groupe.type === 'TD').length : 0;
        const tpCount = promo.groupes ? promo.groupes.filter(groupe => groupe.type === 'TP').length : 0;
        return { tdCount, tpCount };
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
                    {promoData.map((promo, index) => {
                        const { tdCount } = calculateGroupCounts(promo);
                        return (
                            <input
                                key={index}
                                type="text"
                                value={tdCount}
                                onChange={(e) => handleInputChange(index, 'nombre_td', e.target.value)}
                            />
                        );
                    })}
                </div>

                <div className="modif-promo-numbertp-container">
                    <label>Nombre de groupe TP :</label>
                    {promoData.map((promo, index) => {
                        const { tpCount } = calculateGroupCounts(promo);
                        return (
                            <input
                                key={index}
                                type="text"
                                value={tpCount}
                                onChange={(e) => handleInputChange(index, 'nombre_tp', e.target.value)}
                            />
                        );
                    })}
                </div>

                <div className="custom-button-modif-container">
                    {promos.map((promo, index) => (
                        <button key={index} onClick={() => handleButtonClick(promo.nom)}>
                            Modifier {promo.nom}
                        </button>
                    ))}
                </div>

                <div className="custom-button-container">
                    <button onClick={handleSubmit}>Valider</button>
                </div>

                {showPopup && (
                    <PopupModifPromoAdaptative
                        onClose={handleClosePopup}
                        promoName={selectedPromo}
                        promos={promos}
                        updatePromoData={updatePromoData}
                    />
                )}
            </div>
        </div>
    );
}

export default PopupModifPromo;
