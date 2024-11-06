// resources/js/Pages/Home.jsx
import React from 'react';
import Header from '../Components/Header';
import LeftPart from '../Components/LeftPart';
import RightPart from '../Components/RightPart';

const Home = () => {
    return (
        <>
        <Header />
        <div className="app">
                <LeftPart />
                <RightPart/>
        </div>
        </>
    );
};

export default Home;