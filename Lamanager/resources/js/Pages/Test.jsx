import React from 'react';
import Header from '../Components/Header';
import ListeEnseignements from '@/Components/ListeEnseignements';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';
import BarreOutils from '@/Components/BarreOutils';
import { usePage } from '@inertiajs/react';

export default function Test() {
    const [selectedEnseignements, setSelectedEnseignements] = React.useState([]);
    
    // Récupérer le paramètre BUT depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const promoId = urlParams.get('promo_id');
    const anneeId = urlParams.get('annee_id');
    console.log(promoId);
    console.log(anneeId);
    const handleEnseignementSelect = (enseignement) => {
        if (enseignement && !selectedEnseignements.find(e => e.id === enseignement.id)) {
            setSelectedEnseignements([...selectedEnseignements, enseignement]);
        }
    };

    const handleRemoveEnseignement = (enseignementId) => {
        setSelectedEnseignements(selectedEnseignements.filter(e => e.id !== enseignementId));
    };

    const ListeEnseignementsWithProps = () => (
        <ListeEnseignements 
            promoId={promoId} 
            anneeId={anneeId}
            onEnseignementSelect={handleEnseignementSelect} 
        />
    );

    const TableauWithProps = () => (
        <Tableau 
            selectedEnseignements={selectedEnseignements}
            onRemoveEnseignement={handleRemoveEnseignement}
        />
    );

    return (
        <>
            <Header ComposantProp={BarreOutils} />
            <div className="app">
                <LeftPart ComposantProp={ListeEnseignementsWithProps}/>
                <RightPart ComposantProp={TableauWithProps}/>
            </div>
        </>
    );
}