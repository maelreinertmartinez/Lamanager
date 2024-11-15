import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MenuAnnee({ selectedAnnee, onAnneeSelect }) {
    const [annees, setAnnees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAnnee, setNewAnnee] = useState('');

    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const response = await axios.get('/api/annees');
                setAnnees(response.data);
                // Sélectionne par défaut la première année si aucune n'est sélectionnée
                if (response.data.length > 0 && !selectedAnnee) {
                    onAnneeSelect(response.data[0]);
                }
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des années');
                setLoading(false);
            }
        };

        fetchAnnees();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/annees', { annee: newAnnee });
            setAnnees([...annees, response.data]);
            setNewAnnee('');
            setShowAddForm(false);
        } catch (err) {
            setError('Erreur lors de l\'ajout de l\'année');
        }
    };

    return (
        <div className="menu-wrapper">
            <h2 className="menu-title">Année Scolaire</h2>
            <div className="menu-container">
                {annees.map((annee) => (
                    <div 
                        key={annee.id} 
                        className={`menu-item cursor-pointer ${selectedAnnee?.id === annee.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                        onClick={() => onAnneeSelect(annee)}
                    >
                        {annee.annee_scolaire}
                    </div>
                ))}
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="menu-item cursor-pointer hover:bg-purple-100"
                >
                    + Ajouter une année
                </button>
            </div>

            {showAddForm && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Ajouter une année</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={newAnnee}
                                onChange={(e) => setNewAnnee(e.target.value)}
                                placeholder="Format: xx/xx"
                                pattern="\d{2}/\d{2}"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#564787] focus:ring focus:ring-[#564787]"
                                required
                            />
                            <div className="button-container">
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddForm(false)}
                                    className="mr-2"
                                >
                                    Annuler
                                </button>
                                <button type="submit">
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuAnnee;