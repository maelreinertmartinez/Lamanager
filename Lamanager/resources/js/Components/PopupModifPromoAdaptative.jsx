import React, { useState, useEffect } from "react";
import axios from "axios";
import InputModifPromo from "./InputModifPromo.jsx";
import ConfirmModifPromo from "./ConfirmModifPromo.jsx";
import "../../css/modifpromoadapt.css";

function PopupModifPromoAdaptative({ onClose, promoName, onSubmit }) {
    const [groupesData, setGroupesData] = useState([]);
    const [liaisons, setLiaisons] = useState([]);
    const [isInputModalOpen, setInputModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [tdGroupName, setTdGroupName] = useState("");
    const [tdGroupToDelete, setTdGroupToDelete] = useState(null);
    const [promo, setPromo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch promo data
                const promoResponse = await axios.get(`/api/promos/by-name/${promoName}`);
                const promoData = promoResponse.data;
                setPromo(promoData);

                // Fetch groupes
                const groupesResponse = await axios.get(`/api/groupes/${promoData.id}`);
                setGroupesData(groupesResponse.data);

                // Fetch liaisons
                const liaisonsResponse = await axios.get(`/api/liaison_groupes`);
                setLiaisons(liaisonsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (promoName) {
            fetchData();
        }
    }, [promoName]);

    const isGroupNameExists = (name) => {
        return groupesData.some(groupe => groupe.nom === name);
    };

    const handleInputChange = async (id, field, value) => {
        try {
            await axios.patch(`/api/groupes/${id}`, { [field]: value });
            const newGroupesData = groupesData.map(groupe =>
                groupe.id === id ? { ...groupe, [field]: value } : groupe
            );
            setGroupesData(newGroupesData);
        } catch (error) {
            console.error("Error updating group:", error);
        }
    };

    const handleAddGroup = async (type) => {
        if (!promo) return;

        let newGroupName = 'amodifier';
        let counter = 1;
        while (isGroupNameExists(newGroupName)) {
            newGroupName = `amodifier${counter}`;
            counter++;
        }

        try {
            const payload = { promo_id: promo.id, type, nom: newGroupName };
            const response = await axios.post('/api/groupes', payload);
            const newGroup = response.data;
            setGroupesData(prevData => [...prevData, newGroup]);
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Error adding group:", error);
        }
    };

    const handleAddTPGroup = async (tdGroupName) => {
        if (!promo) return;

        const tdGroup = groupesData.find(groupe => groupe.nom === tdGroupName && groupe.type === 'TD');
        if (!tdGroup) {
            alert("Groupe TD non trouvé.");
            return;
        }

        let newGroupName = 'amodifier';
        let counter = 1;
        while (isGroupNameExists(newGroupName)) {
            newGroupName = `amodifier${counter}`;
            counter++;
        }

        try {
            // Create TP group
            const groupPayload = { promo_id: promo.id, type: 'TP', nom: newGroupName };
            const groupResponse = await axios.post('/api/groupes', groupPayload);
            const newGroup = groupResponse.data;

            // Create liaison
            const liaisonPayload = { groupe_td_id: tdGroup.id, groupe_tp_id: newGroup.id };
            await axios.post('/api/liaison_groupes', liaisonPayload);

            // Update state
            setGroupesData(prevData => [...prevData, newGroup]);
            setLiaisons(prevLiaisons => [...prevLiaisons, { groupe_td_id: tdGroup.id, groupe_tp_id: newGroup.id }]);
            
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Error adding TP group:", error);
        }
    };

    const handleDeleteGroup = async (type, groupNameToDelete) => {
        if (!promo) return;

        const group = groupesData.find(groupe => groupe.type === type && groupe.nom === groupNameToDelete);
        if (!group) {
            console.error("Group not found");
            return;
        }

        try {
            await axios.delete(`/api/groupes/${group.id}`);
            setGroupesData(prevData => prevData.filter(g => g.id !== group.id));
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Error deleting group:", error);
        }
    };

    const handleOpenInputModal = (type) => {
        setModalType(type);
        setInputModalOpen(true);
    };

    const handleCloseInputModal = () => {
        setInputModalOpen(false);
        setModalType("");
    };

    const handleOpenConfirmModal = (type, groupName) => {
        setModalType(type);
        setTdGroupToDelete(groupName);
        setConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false);
        setModalType("");
        setTdGroupToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (modalType && tdGroupToDelete) {
            await handleDeleteGroup(modalType, tdGroupToDelete);
            handleCloseConfirmModal();
        }
    };

    if (!promo) return null;

    const tdGroups = groupesData.filter(groupe => groupe.type === 'TD');
    const tpGroups = groupesData.filter(groupe => groupe.type === 'TP');

    return (
        <div className="custom-popup-overlay-adapt" onClick={onClose}>
            <div className="custom-popup-content-adapt" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h2>Modification de {promoName}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="groups-container">
                    <div className="group-section">
                        <h3>Groupes TD</h3>
                        <button onClick={() => handleAddGroup('TD')}>Ajouter TD</button>
                        {tdGroups.map((groupe) => (
                            <div key={groupe.id} className="group-item">
                                <input
                                    type="text"
                                    value={groupe.nom}
                                    onChange={(e) => handleInputChange(groupe.id, 'nom', e.target.value)}
                                />
                                <button onClick={() => handleOpenConfirmModal('TD', groupe.nom)}>
                                    Supprimer
                                </button>
                                <button onClick={() => {
                                    setTdGroupName(groupe.nom);
                                    handleOpenInputModal('TP');
                                }}>
                                    Ajouter TP
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="group-section">
                        <h3>Groupes TP</h3>
                        {tpGroups.map((groupe) => {
                            const liaison = liaisons.find(l => l.groupe_tp_id === groupe.id);
                            const parentTD = liaison ? groupesData.find(g => g.id === liaison.groupe_td_id) : null;

                            return (
                                <div key={groupe.id} className="group-item">
                                    <input
                                        type="text"
                                        value={groupe.nom}
                                        onChange={(e) => handleInputChange(groupe.id, 'nom', e.target.value)}
                                    />
                                    <span className="parent-td">
                                        {parentTD ? `(${parentTD.nom})` : ''}
                                    </span>
                                    <button onClick={() => handleOpenConfirmModal('TP', groupe.nom)}>
                                        Supprimer
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isInputModalOpen && (
                    <InputModifPromo
                        type={modalType}
                        onClose={handleCloseInputModal}
                        onSubmit={(newName) => {
                            if (modalType === 'TP') {
                                handleAddTPGroup(tdGroupName);
                            }
                            handleCloseInputModal();
                        }}
                    />
                )}

                {isConfirmModalOpen && (
                    <ConfirmModifPromo
                        type={modalType}
                        groupName={tdGroupToDelete}
                        onClose={handleCloseConfirmModal}
                        onConfirm={handleConfirmDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default PopupModifPromoAdaptative;
