import React from 'react';
import Header from '@/Components/Header';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import BarreOutils from '@/Components/BarreOutils';
import VersionProfLeftPart from '@/Components/VersionProfLeftPart';
import VersionProfRightPart from '@/Components/VersionProfRightPart';


export default function PageVersionProf() {
    return (
        <>
            <Header ComposantProp={BarreOutils} />
            <div className="app">
                <LeftPart ComposantProp={VersionProfLeftPart}/>
                <RightPart ComposantProp={VersionProfRightPart}/>
            </div>
        </>
    );
}