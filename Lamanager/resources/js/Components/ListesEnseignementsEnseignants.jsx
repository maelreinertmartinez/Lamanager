import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListesEnseignementsEnseignants({ promoId, anneeId, onEnseignementSelect, selectedEnseignant, onEnseignantSelect, onTimeSelect, defaultTime }) {
    const [enseignements, setEnseignements] = useState([]);
    const [enseignants, setEnseignants] = useState([]);
    const [loadingEnseignants, setLoadingEnseignants] = useState(true);
    const [errorEnseignants, setErrorEnseignants] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTime, setSelectedTime] = useState(defaultTime);

    useEffect(() => {
        const fetchEnseignements = async () => {
            try {
                const response = await axios.get(`/api/enseignements/${promoId}/${anneeId}`);
                setEnseignements(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des enseignements');
                setLoading(false);
            }
        };

        if (promoId && anneeId) {
            fetchEnseignements();
        }
    }, [promoId, anneeId]);

    useEffect(() => {
        const fetchEnseignants = async () => {
            try {
                const response = await axios.get('/api/enseignants');
                setEnseignants(response.data);

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
    }, []);

    const updateUrlWithEnseignant = (enseignant) => {
        const url = new URL(window.location);
        url.searchParams.set('enseignant', enseignant.id);
        window.history.pushState({}, '', url);
    };

    if (!promoId || !anneeId) return null;
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    const validateTimeFormat = (value) => {
        // Regex pour valider le format HH:mm (00:00 à 23:59)
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(value);

    };

    const handleTimeChange = (e) => {
        const value = e.target.value;
        
        // Si l'utilisateur tape ":", on ne fait rien
        if (value === ':') return;
    
        // Nettoyer la valeur de tout caractère non numérique sauf ":"
        let cleanValue = value.replace(/[^\d:]/g, '');
        
        // Si la longueur est 2 et il n'y a pas de ":", on l'ajoute
        if (cleanValue.length === 2 && !cleanValue.includes(':')) {
            cleanValue = cleanValue + ':';
        }
        
        // Limiter à 5 caractères (format XX:XX)
        if (cleanValue.length > 5) {
            cleanValue = cleanValue.slice(0, 5);
        }
    
        // Mettre à jour le state avec la nouvelle valeur
        setSelectedTime(cleanValue);
    };

    return (
        <>
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
                                id={enseignant.id}
                                className={`menu-item cursor-pointer ${selectedEnseignant?.id === enseignant.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                                onClick={() => {
                                    onEnseignantSelect(enseignant);
                                    updateUrlWithEnseignant(enseignant);  // Met à jour l'URL avec l'ID du prof
                                }}
                            >
                                {enseignant.nom} {enseignant.prenom}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-full">
                    <input
                        type="text"
                        placeholder="HH:MM"
                        maxLength="5"
                        className="mt-2 w-full p-2 rounded-md border border-gray-300 focus:border-[#564787] focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                        value={selectedTime}
                        onChange={handleTimeChange}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
                <button
                    className="mt-2 px-4 py-2 bg-[#564787] text-white rounded-md hover:bg-[#453a6b] focus:outline-none focus:ring focus:ring-[#564787] focus:ring-opacity-50"
                    onClick={() => {
                        if (selectedTime) {
                            if (validateTimeFormat(selectedTime)) {
                                onTimeSelect(selectedTime);
                                setError('');
                            } else {
                                setError('Format invalide. Utilisez HH:mm (ex: 02:00)');
                            }
                        }
                    }}
                    disabled={!!error}
                >
                    Valider
                </button>
            </div>
        </>
    );
}

export default ListesEnseignementsEnseignants;
