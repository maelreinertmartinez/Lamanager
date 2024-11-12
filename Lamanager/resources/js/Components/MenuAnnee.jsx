import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, usePage } from '@inertiajs/react';

function MenuAnnee({ onAnneeSelect }) {
    const [annees, setAnnees] = useState([]);
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnees = async () => {
            try {
                const response = await axios.get('/api/annees');
                setAnnees(response.data);
                // Sélectionne par défaut la première année
                if (response.data.length > 0) {
                    setSelectedAnnee(response.data[0]);
                    onAnneeSelect && onAnneeSelect(response.data[0].id);
                }
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des années');
                setLoading(false);
            }
        };

        fetchAnnees();
    }, []);

    const handleAnneeClick = (annee) => {
        setSelectedAnnee(annee);
        onAnneeSelect && onAnneeSelect(annee.id);
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="menu-wrapper">
            <h2 className="menu-title">Année Scolaire</h2>
            <div className="menu-container">
                {annees.map((annee) => (
                    <div 
                        key={annee.id} 
                        className={`menu-item cursor-pointer ${selectedAnnee?.id === annee.id ? 'bg-[#564787] text-white' : 'hover:bg-purple-100'}`}
                        onClick={() => handleAnneeClick(annee)}
                    >
                        {annee.annee_scolaire}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuAnnee;