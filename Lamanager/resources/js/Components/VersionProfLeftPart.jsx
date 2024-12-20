import React, { useEffect, useState } from 'react';
import EnseignementListeVersionProf from '@/Components/EnseignementListeVersionProf';
import MenuAnnee from '@/Components/MenuAnnee';

export default function VersionProfLeftPart({ onSelectionChange }) {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    const [selectedEnseignement, setSelectedEnseignement] = useState(null);

    

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
                />
            )}
        </div>
    );
} 