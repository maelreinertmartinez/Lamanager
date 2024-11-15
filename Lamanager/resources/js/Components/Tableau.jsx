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

                const countTP = data.filter((groupe) => groupe.type === 'TP').length;
                const countTD = data.filter((groupe) => groupe.type === 'TD').length;
                const countGroupe = data.length;
                const ids = data.map((groupe) => groupe.id);
                ids.unshift(0);
                ids.unshift(0);

                setNbTP(countTP);
                setNbTD(countTD);
                setNbGroupe(countGroupe);
                setGroupesID(ids);

                const names = data.map((groupe) => groupe.nom);

                setGroupNames(names);


                console.log(ids);

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

    const handleCellClick = async (rowIndex, colIndex, semaineId, enseignantId, enseignementId, groupeID ) => {
        const key = `${rowIndex}-${colIndex}`;

        const enseignantIdInt = Number(enseignantId);

        setClickedCells((prev) => {
            const updatedCells = { ...prev };
    
            if (colIndex === 0) {
                const isRowFullyColored = Array.from({ length: nbGroupe + 1 }, (_, index) => index + 1).every(
                    (col) => updatedCells[`${rowIndex}-${col}`] && updatedCells[`${rowIndex}-${col}`].clicked
                );
    
                if (isRowFullyColored) {
                    for (let i = 1; i <= nbGroupe + 1; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: false, text: "" };
                        // Si on décoche toute la ligne, on doit supprimer la ligne de la BDD
                        deleteCellFromDatabase(rowIndex, i);
                    }
                } else {
                    for (let i = 1; i <= nbGroupe + 1; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: true, text: `2h - ${enseignantCode}` };
                        // Si on coche une cellule, on doit l'ajouter à la BDD
                        addCellToDatabase(rowIndex, i, enseignantCode);
                    }
                }
            } else {
                if (!updatedCells[key]) {
                    updatedCells[key] = { clicked: false, text: "" };
                }
    
                const cell = updatedCells[key];
                if (cell.text === "") {
                    updatedCells[key] = { clicked: true, text: `2h - ${enseignantCode}` };
                    // Ajouter la cellule à la BDD
                    addCellToDatabase(semainesID[rowIndex], enseignantIdInt, enseignementId, groupeID[colIndex]);
                } else {
                    updatedCells[key] = { clicked: false, text: "" };
                    // Supprimer la cellule de la BDD
                    deleteCellFromDatabase(rowIndex, colIndex);
                }
            }
    
            return updatedCells;
        });
    };
    
    const addCellToDatabase = async (semaineID, enseignantId, enseignementId, groupeId) => {
        try {
            console.log(semaineID, enseignantId, enseignementId, groupeId);
            const response = await axios.post('/api/cases', {
                semaine_id: semaineID,
                enseignant_id: enseignantId,
                enseignement_id: enseignementId,
                groupe_id: groupeId,
                nombre_heure: 2,
            });
    
            console.log('Cellule ajoutée à la BDD:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'ajout à la base de données:', error);
        }
    };

    const getColorClass = (colIndex) => {
        if (colIndex === 1) return 'bg-yellow-300';
        if (colIndex >= 2 && colIndex <= nbTD+1) return 'bg-red-300';
        if (colIndex >= nbTD+2 && colIndex <= nbGroupe+1) return 'bg-blue-300';
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
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)}%` }} rowSpan="2">CM</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbTD)}%` }} colSpan={nbTD}>TD</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbTP)}%` }} colSpan={nbTP}>TP</th>
                                    </tr>
                                        {groupNames.map((nom, index) => (
                                            <th
                                                key={index}
                                                className="border border-black p-2"
                                                style={{ height: '50px', width: `${100 / (nbGroupe + 2)}%` }}
                                            >
                                                {nom}
                                            </th>
                                        ))}
                                
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
                                            {Array.from({ length: nbGroupe + 1 }, (_, index) => index + 1).map((colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className={`border border-black p-2 ${clickedCells[`${rowIndex}-${colIndex}`]?.clicked ? getColorClass(colIndex) : ''}`}
                                                    style={{ cursor: 'pointer', width: `${100 / (nbGroupe+2)}%` }}
                                                    onClick={() => handleCellClick(rowIndex, colIndex, semainesID, enseignantId, enseignement.id, groupesID)}
                                                >
                                                    {clickedCells[`${rowIndex}-${colIndex}`]?.text && <h3>{clickedCells[`${rowIndex}-${colIndex}`].text}</h3>}
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
