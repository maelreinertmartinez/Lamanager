import React from 'react';
import EnseignementSelect from './EnseignementSelect';
import EnseignantList from './EnseignantList';
import TimeSelector from './TimeSelector';
import SwitchAlternant from './SwitchAlternant';

function ListesEnseignementsEnseignants({ 
    promoId, 
    anneeId, 
    onEnseignementSelect, 
    selectedEnseignant, 
    onEnseignantSelect, 
    onTimeSelect, 
    defaultTime,
    isAlternant,
    onAlternantChange 
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
            <SwitchAlternant 
                    promoId={promoId}
                    onSwitchChange={onAlternantChange}
            />
        </>
    );
}

export default ListesEnseignementsEnseignants;