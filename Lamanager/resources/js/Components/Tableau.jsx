import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircleX } from "lucide-react";

function EnseignementComponent({promoId, selectedEnseignements, onRemoveEnseignement }) {
    const [clickedCells, setClickedCells] = useState({});
    const [activeTableau, setActiveTableau] = useState(null);
    const [semainesID, setSemainesID] = useState([]);
    const [semaines, setSemaines] = useState([]);

    const [groupesID, setGroupesID] = useState(0);
    const [nbTP, setNbTP] = useState(0);
    const [nbTD, setNbTD] = useState(0);
    const [nbGroupe, setNbGroupe] = useState(0);
    const [groupNames, setGroupNames] = useState([]);
    const [enseignantCode, setEnseignantCode] = useState('');
    const [nbCM, setNbCM] = useState(0);
    

    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    const idEnseignements = selectedEnseignements.map((enseignement) => enseignement.id);

    useEffect(() => {
        if (selectedEnseignements.length > 0) {
            const dernierEnseignement = selectedEnseignements[selectedEnseignements.length - 1];
            setActiveTableau(dernierEnseignement.nom);
        }
    }, [selectedEnseignements]);

    const handleTableauClick = (nom) => {
            setActiveTableau(nom);
    };

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await fetch(`/api/groupes/${promoId}`);
                const data = await response.json();
    
                const countCM = data.filter((groupe) => groupe.type === 'CM').length;
                const countTP = data.filter((groupe) => groupe.type === 'TP').length;
                const countTD = data.filter((groupe) => groupe.type === 'TD').length;
                const countGroupe = data.length;
    
                const cmGroups = data.filter((groupe) => groupe.type === 'CM');
                const tdGroups = data.filter((groupe) => groupe.type === 'TD');
                const tpGroups = data.filter((groupe) => groupe.type === 'TP');
    
                // Supprimer les unshift(0) qui causent le problème
                const ids = [...cmGroups.map(g => g.id), ...tdGroups.map(g => g.id), ...tpGroups.map(g => g.id)];
                const names = [...cmGroups.map(g => g.nom), ...tdGroups.map(g => g.nom), ...tpGroups.map(g => g.nom)];
    
                setNbCM(countCM);
                setNbTP(countTP);
                setNbTD(countTD);
                setNbGroupe(countGroupe);
                setGroupesID(ids);
                setGroupNames(names);
    
            } catch (error) {
                console.error("Erreur lors de la récupération des groupes:", error);
            }
        }
        fetchGroupes();
    }, []);

    useEffect(() => {
        const fetchSemaines = async () => {
            try {
                const response = await fetch('/api/semaines');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des semaines');
                }
                const data = await response.json();
                
                const numerosSemaines = data.map((semaine) => semaine.numero);
                const idsSemaines = data.map((semaine) => semaine.id);
                setSemainesID(idsSemaines);
                setSemaines(numerosSemaines);
            } catch (error) {
                console.error("Erreur lors de la récupération des semaines :", error);
            }
        };
    
        fetchSemaines();
    }, []);

    const longueurSemaines = semaines.length;

    const params = new URLSearchParams(window.location.search);
    const enseignantId = params.get('enseignant');

    useEffect(() => {
        const fetchEnseignant = async () => {
            try {
                
                const response = await fetch(`/api/enseignant/${enseignantId}`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de l\'enseignant');
                }
                
                const data = await response.json();
                
                if (data && data.code) {
                    setEnseignantCode(data.code);
                } else {
                    throw new Error('Code non trouvé pour l\'enseignant');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'enseignant :", error);
            }
        };
    
        fetchEnseignant();
    }, []);

    const handleCellClick = async (rowIndex, colIndex, semaineId, enseignantId, enseignementId, groupeID) => {
        const key = `${rowIndex}-${colIndex}`;
        const enseignantIdInt = Number(enseignantId);

        setClickedCells((prev) => {
            const updatedCells = { ...prev };

            if (!updatedCells[key]) {
                updatedCells[key] = { clicked: false, text: "" };
            }

            const cell = updatedCells[key];
            if (cell.text === "") {
                updatedCells[key] = { clicked: true, text: `2h - ${enseignantCode}` };
                // Ajouter la cellule à la BDD
                addCellToDatabase(semaineId, enseignantIdInt, enseignementId, groupeID);
            } else {
                updatedCells[key] = { clicked: false, text: "" };
                // Supprimer la cellule de la BDD en utilisant les mêmes paramètres que pour l'ajout
                deleteCellFromDatabase(semaineId, enseignantIdInt, enseignementId, groupeID);
            }

            return updatedCells;
        });
    };
    
    const addCellToDatabase = async (semaineID, enseignantId, enseignementId, groupeId) => {
        try {
            if (!semaineID || !enseignantId || !enseignementId || !groupeId) {
                console.error('Paramètres invalides:', {
                    semaineID,
                    enseignantId,
                    enseignementId,
                    groupeId,
                    'semaineID valide?': Boolean(semaineID),
                    'enseignantId valide?': Boolean(enseignantId),
                    'enseignementId valide?': Boolean(enseignementId),
                    'groupeId valide?': Boolean(groupeId)
                });
                throw new Error('Tous les paramètres sont requis et doivent être non nuls');
            }
    
            const response = await axios.post('/api/cases', {
                semaine_id: semaineID,
                enseignant_id: enseignantId,
                enseignement_id: enseignementId,
                groupe_id: groupeId,
                nombre_heure: 2,
            });
    
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la base de données:', error);
            throw error;
        }
    };

    const deleteCellFromDatabase = async (semaineId, enseignantId, enseignementId, groupeId) => {
        try {
            const response = await axios.delete('/api/cases', {
                data: {
                    semaine_id: semaineId,
                    enseignant_id: enseignantId,
                    enseignement_id: enseignementId,
                    groupe_id: groupeId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la suppression de la base de données:', error);
            throw error;
        }
    };

    const getColorClass = (colIndex) => {
        if (colIndex < nbCM) return 'bg-yellow-300';  // CM en jaune
        if (colIndex >= nbCM && colIndex < nbCM + nbTD) return 'bg-red-300';  // TD
        if (colIndex >= nbCM + nbTD) return 'bg-blue-300';  // TP
        return '';
    };


    return (
        <>
            <div className="liste-ressources">
                {selectedEnseignements.map((enseignement) => enseignement && (
                    <div 
                        key={enseignement.id}
                        className={`tab-item ${activeTableau === enseignement.nom ? 'active' : ''}`}
                        onClick={() => handleTableauClick(enseignement.nom)}
                    >
                        <span style={{ display: 'flex', justifyContent: 'center', width: '45px'}} className="mr-2">{enseignement.nom || 'Sans nom'}</span>
                            <CircleX size={28} className="circle-x" onClick={(e) => {
                                e.stopPropagation();
                                onRemoveEnseignement(enseignement.id);
                            }}/>
                    </div>
                ))}
            </div>
            
            {selectedEnseignements.map((enseignement) => enseignement && (
                <div 
                    key={enseignement.id}
                    className="Tableau"
                    id={enseignement.nom}
                    style={{ display: activeTableau === enseignement.nom ? 'block' : 'none' }}
                >
                    <div className="flex flex-col">
                        <div className="mb-4 relative">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)}%`, height: '100px' }} rowSpan="2">{enseignement.nom}</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbCM)}%` }} colSpan={nbCM}>CM</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbTD)}%` }} colSpan={nbTD}>TD</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbTP)}%` }} colSpan={nbTP}>TP</th>
                                    </tr>
                                    <tr>
                                        {groupNames.map((nom, index) => (
                                            <th
                                                key={index}
                                                className="border border-black p-2"
                                                style={{ height: '50px', width: `${100 / (nbGroupe + 2)}%` }}
                                            >
                                                {nom}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {semaines.map((semaine, rowIndex) => (
                                        <tr key={semaine}>
                                            <td
                                                className="border border-black p-2"
                                                style={{ height: '70px', cursor: 'pointer' }}
                                                onClick={() => handleCellClick(rowIndex, 0)}
                                            >
                                                {semaine}
                                            </td>
                                            {Array.from({ length: nbGroupe }, (_, index) => (
                                                <td
                                                    key={index}
                                                    className={`border border-black p-2 ${clickedCells[`${rowIndex}-${index}`]?.clicked ? getColorClass(index) : ''}`}
                                                    style={{ cursor: 'pointer', width: `${100 / (nbGroupe+2)}%` }}
                                                    onClick={() => handleCellClick(
                                                        rowIndex, 
                                                        index, 
                                                        semainesID[rowIndex], 
                                                        enseignantId, 
                                                        enseignement.id, 
                                                        groupesID[index]
                                                    )}
                                                >
                                                    {clickedCells[`${rowIndex}-${index}`]?.text && <h3>{clickedCells[`${rowIndex}-${index}`].text}</h3>}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="w-full border-collapse border border-black sticky bottom-0 bg-white">
                                <colgroup>
                                    <col style={{ width: `${100 / (nbGroupe + 2)}%` }} />
                                    <col style={{ width: `${100 / (nbGroupe + 2)}%`}} />
                                    <col style={{ width: `${100 / (nbGroupe + 2)*(nbTD)}%`  }} />
                                    <col style={{ width: `${100 / (nbGroupe + 2)*(nbTP)}%`  }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td className="border border-black p-2" style={{ height: '70px' }}>Total</td>
                                        {[1, 2, 3].map((colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`border border-black p-2 ${clickedCells[`${longueurSemaines}-${colIndex}`]?.clicked ? getColorClass(colIndex) : ''}`}
                                            >
                                                {clickedCells[`${longueurSemaines}-${colIndex}`]?.text && <span>{clickedCells[`${longueurSemaines}-${colIndex}`].text}</span>}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default EnseignementComponent;
