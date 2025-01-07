import React, { useState } from 'react';
import axios from 'axios';

const AddAnneeForm = ({ onAnneeAdded, onClose }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAnnee, setNewAnnee] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/annees', { annee: newAnnee });
            onAnneeAdded(response.data);
            setNewAnnee('');
            onClose();
        } catch (err) {
            setError('Erreur lors de l\'ajout de l\'année');
        }
    };

    return (
        <>
        <div style={{ width: '100%',padding: '0rem 1rem' }}>
            <button 
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer btn-add-year"
            style={{ width: '100%', marginTop: '1vh', borderRadius: '10px', padding: '0.5rem 1rem' , boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            >
            + Ajouter une année
            </button>
        </div>

        {showAddForm && (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Ajouter une année</h2>
                {error && <div className="error-message">{error}</div>}
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
                            onClick={onClose}
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
        </>
    );
};

export default AddAnneeForm;
