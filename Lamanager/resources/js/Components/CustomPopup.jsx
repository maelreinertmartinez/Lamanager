import React from "react";

function CustomPopup({ onClose }) {
    return (
        <div className="custom-popup-overlay" onClick={onClose}>
            <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>

                <div className="custom-promo-name-container">
                    <p>Nom de la promo :</p>
                    <input type="text" />
                </div>

                <div className="custom-input-container">
                    <div className="custom-input-group">
                        <label>Nom de groupe TD :</label>
                        <input type="text" />
                    </div>

                    <div className="custom-input-group">
                        <label>Nom de groupe TP :</label>
                        <input type="text" />
                    </div>
                </div>

                <div className="custom-input-group">
                    <label>Alternant :</label>
                    <input type="checkbox" />
                </div>

                <div className="custom-button-container">
                    <button>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default CustomPopup;
