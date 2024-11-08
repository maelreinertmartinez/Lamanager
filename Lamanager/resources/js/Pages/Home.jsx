// resources/js/Pages/Home.jsx
import React from 'react';
import Header from '../Components/Header';
import LeftPart from '../Components/LeftPart';
import RightPart from '../Components/RightPart';
import AnneeRightPart from '@/Components/AnneeRightPart';

const Home = () => {
    return (
        <>
        <Header />
        <div className="app">
                <LeftPart />
                <RightPart ComposantProp={AnneeRightPart}/>
        </div>
        </>
    );
};

export default Home;