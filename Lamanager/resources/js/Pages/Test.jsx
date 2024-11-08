import React from 'react';
import Header from '../Components/Header';
import ListeEnseignements from '@/Components/ListeEnseignements';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';
import BarreOutils from '@/Components/BarreOutils';

export default function Test() {
    const [selectedEnseignements, setSelectedEnseignements] = React.useState([]);

    const handleEnseignementSelect = (enseignement) => {
        if (enseignement && !selectedEnseignements.find(e => e.id === enseignement.id)) {
            setSelectedEnseignements([...selectedEnseignements, enseignement]);
        }
    };

    const handleRemoveEnseignement = (enseignementId) => {
        setSelectedEnseignements(selectedEnseignements.filter(e => e.id !== enseignementId));
    };

    const ListeEnseignementsWithProps = () => (
        <ListeEnseignements onEnseignementSelect={handleEnseignementSelect} />
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