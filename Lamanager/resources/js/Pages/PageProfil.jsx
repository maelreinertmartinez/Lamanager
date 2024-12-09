import React from 'react';
import Header from '@/Components/Header';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import BarreOutils from '@/Components/BarreOutils';
import ProfilLeftPart from '@/Components/ProfilLeftPart';
import ProfilRightPart from '@/Components/ProfilRightPart';

export default function PageProfil() {
    const userData = {
        nom: "Onete",
        prenom: "Cristina",
        email: "example.onete@unilim.com"
    };

    return (
        <>
            <Header ComposantProp={BarreOutils} />
            <div className="app">
                <LeftPart ComposantProp={ProfilLeftPart} userName="Madame Onete" />
                <RightPart ComposantProp={ProfilRightPart} userData={userData} />
            </div>
        </>
    );
}
