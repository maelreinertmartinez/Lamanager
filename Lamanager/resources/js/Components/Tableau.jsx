import React, { useState, useEffect } from 'react';
import { CircleX } from "lucide-react";

function EnseignementComponent({promoId, selectedEnseignements, onRemoveEnseignement }) {
    const [clickedCells, setClickedCells] = useState({});
    const [activeTableau, setActiveTableau] = useState(null);
    const [semaines, setSemaines] = useState([]);

    const [nbTP, setNbTP] = useState(0);
    const [nbTD, setNbTD] = useState(0);
    const [nbGroupe, setNbGroupe] = useState(0);
    const [groupNames, setGroupNames] = useState([]);
    

    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

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

                setNbTP(countTP);
                setNbTD(countTD);
                setNbGroupe(countGroupe);

                const names = data
                .sort((a, b) => {
                  if (a.type === 'TD' && b.type === 'TP') return -1;
                  if (a.type === 'TP' && b.type === 'TD') return 1;
                  return a.nom.localeCompare(b.nom, 'fr', { numeric: true });
                })
                .map((groupe) => groupe.nom);

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
                setSemaines(numerosSemaines);
            } catch (error) {
                console.error("Erreur lors de la récupération des semaines :", error);
            }
        };
    
        fetchSemaines();
    }, []);

    const longueurSemaines = semaines.length;

    const handleCellClick = (rowIndex, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const params = new URLSearchParams(window.location.search);
        const enseignant = params.get('enseignant') || '';
    
        setClickedCells((prev) => {
            const updatedCells = { ...prev };
    
            if (colIndex === 0) {
                const isRowFullyColored = Array.from({ length: nbGroupe + 1 }, (_, index) => index + 1).every(
                    (col) => updatedCells[`${rowIndex}-${col}`] && updatedCells[`${rowIndex}-${col}`].clicked
                );
    
                if (isRowFullyColored) {
                    for (let i = 1; i <= nbGroupe+1; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: false, text: "" };
                    }
                } else {
                    for (let i = 1; i <= nbGroupe+1; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: true, text: `2h - ${enseignant}` };
                    }
                }
            } else {
                if (!updatedCells[key]) {
                    updatedCells[key] = { clicked: false, text: "" };
                }
    
                const cell = updatedCells[key];
                if (cell.text === "") {
                    updatedCells[key] = { clicked: true, text: `2h - ${enseignant}` };
                } else {
                    updatedCells[key] = { clicked: false, text: "" };
                }
            }
    
            return updatedCells;
        });
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
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)}%`, height: '70px' }} rowSpan="2">{enseignement.nom}</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)}%` }} rowSpan="2">CM</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbTD)}%` }} colSpan={nbTD}>TD</th>
                                        <th className="border border-black p-2" style={{ width: `${100 / (nbGroupe + 2)*(nbTP)}%` }} colSpan={nbTP}>TP</th>
                                    </tr>
                                        {groupNames.map((nom, index) => (
                                            <th
                                                key={index}
                                                className="border border-black p-2"
                                                style={{ height: '70px', width: `${100 / (nbGroupe + 2)}%` }}
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
                                                    className={`border border-black p-2 ${clickedCells[`${rowIndex}-${colIndex}`]?.clicked ? getColorClass(colIndex) : ''} `}
                                                    style={{ cursor: 'pointer', width: `${100 / (nbGroupe+2)}%` }}
                                                    onClick={() => handleCellClick(rowIndex, colIndex)}
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
