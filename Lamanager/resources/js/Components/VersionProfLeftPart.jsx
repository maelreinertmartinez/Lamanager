import React, { useState, useEffect } from 'react';
import MenuAnnee from './MenuAnnee';
import EnseignementListeVersionProf from './EnseignementListeVersionProf';
import TableauVersionProf from './TableauVersionProf';

export default function VersionProfLeftPart({ onSelectionChange }) {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedEnseignement, setSelectedEnseignement] = useState(null);  
    const [isAllEnseignementsSelected, setIsAllEnseignementsSelected] = useState(false);
    const [showGroupes, setShowGroupes] = useState(false);
    const [showTableauPopup, setShowTableauPopup] = useState(false);

    useEffect(() => {
        if (selectedAnnee && selectedEnseignement) {    
            onSelectionChange({ selectedAnnee, selectedEnseignement, showGroupes });
        }
    }, [selectedAnnee, selectedEnseignement, showGroupes, onSelectionChange]);

    const handleGroupesClick = () => {
        setShowGroupes(prevShowGroupes => !prevShowGroupes);
        if (selectedAnnee && selectedEnseignement) {
          onSelectionChange({ selectedAnnee, selectedEnseignement, showGroupes: !showGroupes });
        }
      };

    const handleTableauClick = () => {
        setShowTableauPopup(true);
    };

    const handleCloseTableauPopup = () => {
        setShowTableauPopup(false);
    };

    useEffect(() => {
        if (isAllEnseignementsSelected) {
            onSelectionChange({selectedAnnee, all: "all"});
        }
    }, [isAllEnseignementsSelected]);

    return (
        <div>
            <MenuAnnee 
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
                <button onClick={handleTableauClick}>Tableau</button>
                <button>Alertes</button>
            </div> 

            {showTableauPopup && selectedAnnee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                        <button 
                            onClick={handleCloseTableauPopup} 
                            className="absolute top-4 right-4 text-2xl font-bold hover:text-red-600"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Tableau des Enseignements</h2>
                        <TableauVersionProf anneeId={selectedAnnee.id} />
                    </div>
                </div>
            )}
        </div>
    );
}