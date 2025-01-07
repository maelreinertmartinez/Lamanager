import React, { useState, useEffect } from "react";
import axios from "axios";

function PopupModifPromoAdaptative({ onClose, promoName, promos, updatePromoData, refreshPromoData }) {
    const promo = promos.find(promo => promo.nom === promoName);
    const [groupesData, setGroupesData] = useState([]);
    const [liaisons, setLiaisons] = useState([]);

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await axios.get(`/api/groupes/${promo.id}`);
                setGroupesData(response.data);
            } catch (error) {
                console.error("Error fetching groupes:", error);
            }
        };

        const fetchLiaisons = async () => {
            try {
                const response = await axios.get(`/api/liaison_groupes`);
                setLiaisons(response.data);
            } catch (error) {
                console.error("Error fetching liaisons:", error);
            }
        };

        fetchGroupes();
        fetchLiaisons();
    }, [promo.id]);

    const handleInputChange = (id, field, value) => {
        const newGroupesData = groupesData.map(groupe =>
            groupe.id === id ? { ...groupe, [field]: value } : groupe
        );
        setGroupesData(newGroupesData);
    };

    const handleAddGroup = async (type) => {
        try {
            const payload = { promo_id: promo.id, type, nom: 'amodifier' };
            console.log("Request payload:", payload);
            const response = await axios.post('/api/groupes', payload);
            const newGroup = response.data;
            setGroupesData([...groupesData, newGroup]);
            updatePromoData(promo.id, type, groupesData.length + 1);
        } catch (error) {
            console.error("Error adding group:", error);
        }
    };

    const handleAddTPGroup = async () => {
        const tdGroupName = prompt("Entrez le nom du groupe TD auquel ajouter le groupe TP :");
        const tdGroup = groupesData.find(groupe => groupe.nom === tdGroupName && groupe.type === 'TD');
        if (!tdGroup) {
            alert("Groupe TD non trouvé.");
            return;
        }
        try {
            const payload = { promo_id: promo.id, type: 'TP', nom: 'amodifier' }; // Ensure 'nom' is included
            console.log("Request payload:", payload);
            const response = await axios.post('/api/groupes', payload);
            const newGroup = response.data;
            await axios.post('/api/liaison_groupes', { groupe_td_id: tdGroup.id, groupe_tp_id: newGroup.id });
            setGroupesData(prevGroupesData => [...prevGroupesData, newGroup]);
            setLiaisons(prevLiaisons => [...prevLiaisons, { groupe_td_id: tdGroup.id, groupe_tp_id: newGroup.id }]);
            updatePromoData(promo.id, 'TP', groupesData.length + 1);
        } catch (error) {
            console.error("Error adding TP group:", error);
        }
    };

    const handleDeleteGroup = async (type) => {
        const groupNames = groupesData.filter(groupe => groupe.type === type).map(groupe => groupe.nom);
        const groupsToDelete = prompt(`Entrez le nom des groupes à supprimer (avec un espace entre chaque) :\n${groupNames.join('\n')}`);
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

    const handleDeleteTPGroup = async () => {
        const tdGroupName = prompt("Entrez le nom du groupe TD auquel appartient le groupe TP à supprimer :");
        const tdGroup = groupesData.find(groupe => groupe.nom === tdGroupName && groupe.type === 'TD');
        if (!tdGroup) {
            alert("Groupe TD non trouvé.");
            return;
        }
        const tpGroupNames = groupesData.filter(groupe => groupe.type === 'TP' && liaisons.some(liaison => liaison.groupe_td_id === tdGroup.id && liaison.groupe_tp_id === groupe.id)).map(groupe => groupe.nom);
        const groupToDelete = prompt(`Entrez le nom du groupe TP à supprimer :\n${tpGroupNames.join('\n')}`);
        const group = groupesData.find(groupe => groupe.nom === groupToDelete && groupe.type === 'TP');

        if (group) {
            try {
                await axios.delete(`/api/groupes/${group.id}`);
                setGroupesData(groupesData.filter(groupe => groupe.id !== group.id));
                updatePromoData(promo.id, 'TP', groupesData.length - 1);
            } catch (error) {
                console.error("Error deleting TP group:", error);
            }
        } else {
            alert("Groupe TP non trouvé.");
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post('/api/update-groupes', { groupes: groupesData });
            refreshPromoData();
            onClose();
        } catch (error) {
            console.error("Error updating groupes:", error);
        }
    };

    return (
        <div className="custom-popup-overlay-modif" onClick={onClose}>
            <div className="custom-popup-content-modif-voir" onClick={(e) => e.stopPropagation()}>
                <div className="popupmodifpromo-header">
                    <h2>Modification de {promo.nom}</h2>
                </div>

                <div className="input-with-icon">
                    <label>CM</label>
                    {groupesData.filter(groupe => groupe.type === 'CM').map((groupe) => (
                        <div key={groupe.id}>
                            <input
                                type="text"
                                value={groupe.nom}
                                onChange={(e) => handleInputChange(groupe.id, 'nom', e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {groupesData.filter(groupe => groupe.type === 'TD').map((groupeTD, index) => (
                    <div key={index} className="input-with-icon">
                        <label>TD/TP</label>
                        <input
                            type="text"
                            value={groupeTD.nom}
                            onChange={(e) => handleInputChange(groupeTD.id, 'nom', e.target.value)}
                        />
                        <div className="subgroups">
                            {liaisons.filter(liaison => liaison.groupe_td_id === groupeTD.id).map((liaison) => (
                                groupesData.filter(groupe => groupe.id === liaison.groupe_tp_id).map((groupeTP) => (
                                    <div key={groupeTP.id} className="input-with-icon">
                                        <input
                                            type="text"
                                            value={groupeTP.nom}
                                            onChange={(e) => handleInputChange(groupeTP.id, 'nom', e.target.value)}
                                        />
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                ))}
                <div className="custom-button-container">
                    <button onClick={() => handleAddGroup('TD')}>Ajouter TD</button>
                    <button onClick={() => handleDeleteGroup('TD')}>Supprimer TD</button>
                    <button onClick={handleAddTPGroup}>Ajouter TP</button>
                    <button onClick={handleDeleteTPGroup}>Supprimer TP</button>
                </div>
                <div className="custom-button-container-but">
                    <button onClick={handleSubmit}>Valider</button>
                    <button onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}

export default PopupModifPromoAdaptative;
