import React from "react";

function PopupModifPromo({ onClose, promos }) {

    console.log(promos);
    return (
        <div className="custom-popup-overlay" onClick={onClose}>
            <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="modif-promo-name-container">
                    <label>Nom de la promo :</label>
                    {promos.map((promo, index) => (
                        <input key={index} type="text" value={promo.nom}  />
                    ))}
                </div>

                <div className="modif-promo-numbertd-container">
                    <label>Nombre de groupe TD :</label>
                    {promos.map((promo, index) => (
                        <input key={index} type="text" value={promo.nombre_td} />
                    ))}

                    <button>Voir</button>
                </div>

                <div className="modif-promo-numbertp-container">
                    <label>Nombre de groupe TP :</label>
                    {promos.map((promo, index) => (
                        <input key={index} type="text" value={promo.nombre_tp} />
                    ))}
                    <button>Voir</button>
                </div>

                <div className="custom-button-container">
                    <button>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default PopupModifPromo;
