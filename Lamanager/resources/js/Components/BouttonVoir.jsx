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

                        {groupes.filter(groupe => groupe.promo_id === promo.id && groupe.type === 'TP').map((groupe, i) => {
                           // console.log(groupe); // Log the groupe object
                            return (
                                <input
                                    key={i}
                                    type="text"
                                    value={groupe.nom}
                                    readOnly
                                />
                            );
                        })}
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
