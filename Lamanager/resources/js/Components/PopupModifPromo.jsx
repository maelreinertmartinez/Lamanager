import React from "react";

function PopupModifPromo({ onClose }) {
    return (
        <div className="custom-popup-overlay" onClick={onClose}>
            <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="modif-promo-name-container">
                    <label>Nom de la promo :</label>
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />



                </div>

                <div className="modif-promo-numbertd-container">
                    <label>Nombre de groupe TD :</label>
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <button>Voir</button>
                </div>

                <div className="modif-promo-numbertp-container">
                    <label>Nombre de groupe TP :</label>
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
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
