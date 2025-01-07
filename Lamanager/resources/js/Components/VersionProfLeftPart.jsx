import React, { useEffect, useState } from 'react';
import EnseignementListeVersionProf from '@/Components/EnseignementListeVersionProf';
import MenuAnnee from '@/Components/MenuAnnee';

export default function VersionProfLeftPart({ onSelectionChange }) {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedEnseignement, setSelectedEnseignement] = useState(null);  
    const [isAllEnseignementsSelected, setIsAllEnseignementsSelected] = useState(false);
    const [showGroupes, setShowGroupes] = useState(false);

    useEffect(() => {
        if (selectedAnnee && selectedEnseignement) {    
            console.log('showGroupes:', showGroupes);
            onSelectionChange({ selectedAnnee, selectedEnseignement, showGroupes });
        }
    }, [selectedAnnee, selectedEnseignement, showGroupes, onSelectionChange]);

    const handleGroupesClick = () => {
        setShowGroupes(prevShowGroupes => !prevShowGroupes);
    };

    useEffect(() => {
        if (isAllEnseignementsSelected) {
            const all = "all";
            onSelectionChange({selectedAnnee, all});
        }
    }, [isAllEnseignementsSelected]);

    return (
        <div>
            <MenuAnnee 
                selectedAnnee={selectedAnnee} 
                onAnneeSelect={setSelectedAnnee} 
            />
            {selectedAnnee && (
                <EnseignementListeVersionProf 
                    anneeId={selectedAnnee.id} 
                    onEnseignementSelect={setSelectedEnseignement} 
                    setIsAllEnseignementsSelected={setIsAllEnseignementsSelected}
                />
            )}
            <div className="button-container">
                <button onClick={handleGroupesClick}>Groupes</button>
                <button> Tableau </button>
                <button> Alertes </button>
            </div> 
        </div>
    );
} 