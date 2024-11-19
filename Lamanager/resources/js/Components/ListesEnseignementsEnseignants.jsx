import React from 'react';
import EnseignementSelect from './EnseignementSelect';
import EnseignantList from './EnseignantList';
import TimeSelector from './TimeSelector';

function ListesEnseignementsEnseignants({ 
    promoId, 
    anneeId, 
    onEnseignementSelect, 
    selectedEnseignant, 
    onEnseignantSelect, 
    onTimeSelect, 
    defaultTime 
}) {
    return (
        <>
            <EnseignementSelect 
                promoId={promoId} 
                anneeId={anneeId} 
                onEnseignementSelect={onEnseignementSelect} 
            />
            <EnseignantList 
                selectedEnseignant={selectedEnseignant} 
                onEnseignantSelect={onEnseignantSelect} 
            />
            <TimeSelector 
                defaultTime={defaultTime} 
                onTimeSelect={onTimeSelect} 
            />
        </>
    );
}

export default ListesEnseignementsEnseignants;