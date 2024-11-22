import React from "react";
import { Pencil } from "lucide-react";

function BouttonVoir({ onClose, promos, groupes }) {
    return (
        <div className="custom-popup-overlay" onClick={onClose}>
            <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
                {promos.map((promo, index) => (
                    <div key={index} className="input-with-icon">
                        <input
                            type="text"
                            value={promo.nom}
                            readOnly
                        />
                        <input
                            type="text"
                            value={groupes.filter(groupe => groupe.promo_id === promo.id).map(groupe => groupe.nom).join(', ')}
                            readOnly
                        />
                        <Pencil className="icon-right" />
                    </div>
                ))}
                <div className="custom-button-container">
                    <button onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}

export default BouttonVoir;
