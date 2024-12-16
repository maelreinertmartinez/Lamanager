import React, { useState, useEffect } from "react";
import axios from "axios";

function PopupModifPromoAdaptative({ onClose, promoName, promos, updatePromoData, refreshPromoData }) {
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

    const handleDeleteGroup = async (type) => {
        const groupNames = groupesData.filter(groupe => groupe.type === type).map(groupe => groupe.nom);
        const groupsToDelete = prompt(`Entrez le nom des groupes a supprimer (avec un espace entre chaques) :\n${groupNames.join('\n')}`);
        const groupNamesToDelete = groupsToDelete.split(' ').map(name => name.trim());
        const groups = groupesData.filter(groupe => groupe.type === type && groupNamesToDelete.includes(groupe.nom));

        if (groups.length > 0) {
            try {
                await Promise.all(groups.map(group => axios.delete(`/api/groupes/${group.id}`)));
                setGroupesData(groupesData.filter(groupe => !groupNamesToDelete.includes(groupe.nom)));
                updatePromoData(promo.id, type, groupesData.length - groups.length);
            } catch (error) {
                console.error("Error deleting groups:", error);
            }
        } else {
            alert("No groups found.");
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/update-groupes', { groupes: groupesData });
            refreshPromoData();
            onClose();
        } catch (error) {
            console.error("Error updating groupes:", error);
        }
    };

    const types = [...new Set(groupesData.map(groupe => groupe.type))];

    return (
        <div className="custom-popup-overlay-modif" onClick={onClose}>
            <div className="custom-popup-content-modif-voir" onClick={(e) => e.stopPropagation()}>
                <div className="popupmodifpromo-header">
                    <h2>Modification de {promo.nom}</h2>
                </div>
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
                        {type !== 'CM' && (
                            <>
                                <button onClick={() => handleAddGroup(type)}>+</button>
                                <button onClick={() => handleDeleteGroup(type)}>-</button>
                            </>
                        )}
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
