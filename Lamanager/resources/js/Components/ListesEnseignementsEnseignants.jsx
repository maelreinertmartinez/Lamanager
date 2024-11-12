import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListesEnseignementsEnseignants({ butLevel, onEnseignementSelect, selectedEnseignant, onEnseignantSelect }) {
    const [enseignements, setEnseignements] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [loadingEnseignements, setLoadingEnseignements] = useState(true);
    const [loadingEnseignants, setLoadingEnseignants] = useState(true);
    const [errorEnseignements, setErrorEnseignements] = useState(null);
    const [errorEnseignants, setErrorEnseignants] = useState(null);

    useEffect(() => {
        const fetchEnseignements = async () => {
            try {
                const response = await axios.get(`/api/enseignements/${butLevel}`);
                setEnseignements(response.data);
            } catch (err) {
                setErrorEnseignements('Erreur lors du chargement des enseignements');
            } finally {
                setLoadingEnseignements(false);
            }
        };

        if (butLevel) {
            fetchEnseignements();
        }
    }, [butLevel]);

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                const response = await axios.get('/api/enseignants');
                setEnseignants(response.data);

                // Sélectionne par défaut le premier enseignant si aucun n'est sélectionné
                if (response.data.length > 0 && !selectedEnseignant) {
                    onEnseignantSelect(response.data[0]);
                }
            } catch (err) {
                setErrorEnseignants('Erreur lors du chargement des enseignants');
            } finally {
                setLoadingEnseignants(false);
            }
        };

        fetchEnseignants();
    }, [selectedEnseignant]);

    if (!butLevel) return null;

    return (
        <>
            {loadingEnseignements ? (
                <div>Chargement des enseignements...</div>
            ) : errorEnseignements ? (
                <div>{errorEnseignements}</div>
            ) : (
                <div className="select-container">
                    <select 
                        className="w-full p-2 rounded-md border border-gray-300 focus:border-[#564787] focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            const selectedEnseignement = enseignements.find(e => e.id === selectedId);
                            if (selectedEnseignement) {
                                onEnseignementSelect(selectedEnseignement);
                            }
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>Sélectionnez un enseignement</option>
                        {enseignements.map((enseignement) => (
                            <option key={enseignement.id} value={enseignement.id}>
                                {enseignement.nom}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="menu-wrapper">
                <h2 className="menu-title">Enseignants</h2>
                {loadingEnseignants ? (
                    <div>Chargement des enseignants...</div>
                ) : errorEnseignants ? (
                    <div>{errorEnseignants}</div>
                ) : (
                    <div className="menu-container">
                        {enseignants.map((enseignant) => (
                            <div 
                                key={enseignant.id} 
                                className={`menu-item cursor-pointer ${selectedEnseignant?.id === enseignant.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                                onClick={() => onEnseignantSelect(enseignant)}
                            >
                                {enseignant.nom} {enseignant.prenom}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default ListesEnseignementsEnseignants;
