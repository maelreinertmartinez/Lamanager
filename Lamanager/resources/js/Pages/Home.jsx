import React, { useState } from 'react';
import Header from '../Components/Header';
import LeftPart from '../Components/LeftPart';
import RightPart from '../Components/RightPart';
import PromoRightPart from '@/Components/Promotion/PartieDroitePromoComposant';
import HeaderNeutre from '@/Components/MiseEnPage/EnteteComposantNeutre';
import MenuAnnee from '@/Components/Commun/MenuAnneeComposant';
import AddAnneeForm from '@/Components/Formulaires/FormulaireAjoutAnneeComposant';



const Home = () => {
    const [selectedAnnee, setSelectedAnnee] = useState(null);

    const handleAnneeSelect = (annee) => {
        setSelectedAnnee(annee);
    };

    const MenuAnneeWithProps = () => (
        <MenuAnnee 
            selectedAnnee={selectedAnnee} 
            onAnneeSelect={handleAnneeSelect} 
        />
    );

    const AddAnneeFormWithProps = () => (
        <AddAnneeForm 
            onAnneeAdded={handleAnneeSelect} 
            onClose={() => {}}
        />
    );

    const CombinedLeftComponents = () => (
        <>
            <MenuAnneeWithProps />
            <AddAnneeFormWithProps />
        </>
    );

    return (
        <>
            <Header ComposantProp={HeaderNeutre}/>
            <div className="app">
                <LeftPart ComposantProp={CombinedLeftComponents} />
                <RightPart ComposantProp={() => <PromoRightPart selectedAnnee={selectedAnnee} />}/>
            </div>
        </>
    );
};

export default Home;