import React, { useState, useEffect } from "react";
import axios from "axios";

function PopupModifPromoAdaptative({ onClose, promoName, promos, updatePromoData }) {
    const promo = promos.find(promo => promo.nom === promoName);
    const [groupesData, setGroupesData] = useState([]);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await axios.get(`/api/groupes/${promo.id}`);
                setGroupesData(response.data);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };


        fetchGroupes();

    }, [promo.id]);

    const handleInputChange = (id, field, value) => {
        const newGroupesData = groupesData.map(groupe =>
            groupe.id === id ? { ...groupe, [field]: value } : groupe
        );
        setGroupesData(newGroupesData);
    };

    const handleAddGroup = async (type) => {
        try {
            const response = await axios.post('/api/groupes', { promo_id: promo.id, type });
            const newGroup = response.data;
            setGroupesData([...groupesData, newGroup]);
            updatePromoData(promo.id, type, groupesData.length + 1);
        } catch (error) {
            console.error("Error adding group:", error);
        }
    };

    const handleDeleteLastGroup = async (type) => {
        const lastGroup = groupesData.filter(groupe => groupe.type === type).pop();
        if (lastGroup) {
            try {
                await axios.delete(`/api/groupes/${lastGroup.id}`);
                setGroupesData(groupesData.filter(groupe => groupe.id !== lastGroup.id));
                updatePromoData(promo.id, type, groupesData.length - 1);
            } catch (error) {
                console.error("Error deleting group:", error);
            }
        }
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
                <h2>Modification de {promo.nom}</h2>
                {types.map((type, index) => (
                    <div key={index} className="input-with-icon">
                        <label>{type}</label>
                        {groupesData.filter(groupe => groupe.type === type).map((groupe) => (
                            <div key={groupe.id}>
                                <input
                                    type="text"
                                    value={groupe.nom}
                                    onChange={(e) => handleInputChange(groupe.id, 'nom', e.target.value)}
                                />
                            </div>
                        ))}
                        <button onClick={() => handleAddGroup(type)}>Add</button>
                        <button onClick={() => handleDeleteLastGroup(type)}>Delete</button>
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

export default PopupModifPromoAdaptative;
