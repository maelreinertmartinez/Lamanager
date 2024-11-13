import React, { useState, useEffect } from 'react';
import { CircleX } from "lucide-react";

function EnseignementComponent({ selectedEnseignements, onRemoveEnseignement }) {
    const [clickedCells, setClickedCells] = useState({});
    const [activeTableau, setActiveTableau] = useState(null);
    const [semaines, setSemaines] = useState([]);

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
        const fetchSemaines = async () => {
            try {
                const response = await fetch('/api/semaines');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des semaines');
                }
                const data = await response.json();
                console.log("Données des semaines:", data);
                
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
                const isRowFullyColored = [1, 2, 3, 4, 5, 6, 7].every(
                    (col) => updatedCells[`${rowIndex}-${col}`] && updatedCells[`${rowIndex}-${col}`].clicked
                );
    
                if (isRowFullyColored) {
                    for (let i = 1; i <= 7; i++) {
                        updatedCells[`${rowIndex}-${i}`] = { clicked: false, text: "" };
                    }
                } else {
                    for (let i = 1; i <= 7; i++) {
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
        if (colIndex === 2 || colIndex === 3) return 'bg-red-300';
        if (colIndex >= 4 && colIndex <= 7) return 'bg-blue-300';
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
                                        <th className="border border-black p-2" style={{ width: '70px', height: '70px' }}>{enseignement.nom}</th>
                                        <th className="border border-black p-2" style={{ width: '13%' }}>CM</th>
                                        <th className="border border-black p-2" style={{ width: '26%' }} colSpan="2">TD</th>
                                        <th className="border border-black p-2" style={{ width: '52%' }} colSpan="4">TP</th>
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
                                            {[1, 2, 3, 4, 5, 6, 7].map((colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className={`border border-black p-2 ${clickedCells[`${rowIndex}-${colIndex}`]?.clicked ? getColorClass(colIndex) : ''} `}
                                                    style={{ cursor: 'pointer', width: '13%' }}
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
                                    <col style={{ width: '70px' }} />
                                    <col style={{ width: '13%' }} />
                                    <col style={{ width: '26%' }} />
                                    <col style={{ width: '52%' }} />
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
