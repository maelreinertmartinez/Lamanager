import React, { useEffect, useState } from 'react';
import EnseignementSelect from './TableauLeftPart/EnseignementSelect';
import MenuAnnee from '@/Components/MenuAnnee';

export default function VersionProfLeftPart() {
    const [selectedAnnee, setSelectedAnnee] = useState(null);
    
        const handleAnneeSelect = (annee) => {
            setSelectedAnnee(annee);
        };

    
    return ( 
        <div>  
            <MenuAnnee 
            selectedAnnee={selectedAnnee} 
            onAnneeSelect={handleAnneeSelect} 
        />  
        <div className="button-container"><button>Groupes</button></div> 
        <div className="button-container"><button>Semaines</button></div>
        <div className="button-container"><button>Tableau</button></div>
        <div className="button-container"><button>Alertes</button></div>
        </div>
    );
} 