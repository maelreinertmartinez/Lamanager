import React, { useState, useEffect } from 'react';
import { CircleX } from "lucide-react";

function EnseignementComponent({ selectedEnseignements, onRemoveEnseignement }) {
    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    const [activeTableau, setActiveTableau] = useState(null);

    // Met à jour le tableau actif pour afficher automatiquement le dernier ajouté
    useEffect(() => {
        if (selectedEnseignements.length > 0) {
            const dernierEnseignement = selectedEnseignements[selectedEnseignements.length - 1];
            setActiveTableau(dernierEnseignement.nom);
        }
    }, [selectedEnseignements]);

    // Gère l'affichage et le masquage des tableaux au clic
    const handleTableauClick = (nom) => {
            setActiveTableau(nom); // Activer le tableau correspondant
    };

    return (
        <>
            <div className="liste-ressources">
                {selectedEnseignements.map((enseignement) => enseignement && (
                    <div 
                        key={enseignement.id}
                        className={enseignement.nom}
                        onClick={() => handleTableauClick(enseignement.nom)}
                    >
                        <span style={{ display: 'flex', justifyContent: 'center', width: '45px'}} className="mr-2">{enseignement.nom || 'Sans nom'}</span>
                            <CircleX size={28} className="circle-x" onClick={(e) => {
                                e.stopPropagation(); // Empêche le clic de se propager à la div parente
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
                    style={{ display: activeTableau === enseignement.nom ? 'block' : 'none' }} // Affiche seulement si actif
                >
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr>
                                        <th className="border border-black p-2" style={{ width: '70px', height: '70px' }}>{enseignement.nom}</th>
                                        <th className="border border-black p-2" style={{ width: '300px' }}>CM</th>
                                        <th className="border border-black p-2" colSpan="2" style={{ width: '600px' }}>TD</th>
                                        <th className="border border-black p-2" colSpan="4" style={{ width: '900px' }}>TP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Total'].map((row) => (
                                        <tr key={row}>
                                            <td className="border border-black p-2" style={{ height: '70px' }}>{row}</td>
                                            <td className="border border-black p-2"></td>
                                            <td className="border border-black p-2"></td>
                                            <td className="border border-black p-2"></td>
                                            <td className="border border-black p-2"></td>
                                            <td className="border border-black p-2"></td>
                                            <td className="border border-black p-2"></td>
                                            <td className="border border-black p-2"></td>
                                        </tr>
                                    ))}
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
