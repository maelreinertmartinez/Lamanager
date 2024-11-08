// resources/js/Pages/Home.jsx
import React from 'react';
import Header from '../Components/Header';
import LeftPart from '../Components/LeftPart';
import RightPart from '../Components/RightPart';
import PromoRightPart from '@/Components/PromoRightPart';

const Home = () => {
    return (
        <>
        <Header />
        <div className="app">
                <LeftPart />
                <RightPart ComposantProp={PromoRightPart}/>
        </div>
        </>
    );
};

export default Home;