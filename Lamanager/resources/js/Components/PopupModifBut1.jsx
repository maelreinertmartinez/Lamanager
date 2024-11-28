import React, { useState, useEffect } from "react";
import axios from "axios";

function PopupModifBut1({ onClose, promos, selectedYear }) {
    const but1Promo = promos.find(promo => promo.nom === 'BUT 1');
    const [groupesData, setGroupesData] = useState([]);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await axios.get(`/api/groupes/${but1Promo.id}`);
                setGroupesData(response.data);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };

        fetchGroupes();
    }, [but1Promo.id]);

    const handleInputChange = (id, field, value) => {
        const newGroupesData = groupesData.map(groupe =>
            groupe.id === id ? { ...groupe, [field]: value } : groupe
        );
        setGroupesData(newGroupesData);
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/update-groupes', { groupes: groupesData });
            onClose();
        } catch (error) {
            console.error("Error updating groupes:", error);
        }
    };

    const types = [...new Set(groupesData.map(groupe => groupe.type))];

    return (
        <div className="custom-popup-overlay-modif" onClick={onClose}>
            <div className="custom-popup-content-modif-voir" onClick={(e) => e.stopPropagation()}>
                {types.map((type, index) => (
                    <div key={index} className="input-with-icon">
                        <label>{type}</label>
                        {groupesData.filter(groupe => groupe.type === type).map((groupe) => (
                            <input
                                key={groupe.id}
                                type="text"
                                value={groupe.nom}
                                onChange={(e) => handleInputChange(groupe.id, 'nom', e.target.value)}
                            />
                        ))}
                    </div>
                ))}
                <div className="custom-button-container-but">
                    <button onClick={handleSubmit}>Valider</button>
                    <button onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}

export default PopupModifBut1;
