import React from 'react';
import Header from '../Components/Header';
import LeftPart from '../Components/LeftPart';
import RightPart from '../Components/RightPart';
import PromoRightPart from '@/Components/PromoRightPart';
import HeaderNeutre from '@/Components/HeaderNeutre';
import MenuAnnee from '@/Components/MenuAnnee';

const Home = () => {
    const [selectedAnneeId, setSelectedAnneeId] = React.useState(null);

    const handleAnneeSelect = (anneeId) => {
        setSelectedAnneeId(anneeId);
        // Vous pouvez utiliser anneeId ici ou le passer à d'autres composants
    };

    return (
        <>
            <Header ComposantProp={HeaderNeutre}/>
            <div className="app">
                <LeftPart ComposantProp={() => <MenuAnnee onAnneeSelect={handleAnneeSelect} />} />
                <RightPart ComposantProp={PromoRightPart}/>
            </div>
        </>
    );
};

export default Home;