import React, { useState } from 'react';
import Entete from '@/Components/MiseEnPage/EnteteComposant';
import PartieGauche from '@/Components/MiseEnPage/PartieGaucheComposant';
import PartieDroite from '@/Components/MiseEnPage/PartieDroiteComposant';
import AjoutPromo from '@/Components/Promotion/AjoutPromoComposant';
import EnteteNeutre from '@/Components/MiseEnPage/EnteteNeutreComposant';
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
            <Entete ComposantProp={EnteteNeutre}/>
            <div className="app">
                <PartieGauche ComposantProp={CombinedLeftComponents} />
                <PartieDroite ComposantProp={() => <AjoutPromo selectedAnnee={selectedAnnee} />}/>
            </div>
        </>
    );
};

export default Home;