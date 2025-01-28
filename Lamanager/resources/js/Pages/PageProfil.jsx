import React from 'react';
import Header from '@/Components/MiseEnPage/EnteteComposant';
import LeftPart from '@/Components/MiseEnPage/PartieGaucheComposant';
import RightPart from '@/Components/MiseEnPage/PartieDroiteComposant';
import BarreOutils from '@/Components/MiseEnPage/BarreOutilsComposant';
import ProfilLeftPart from '@/Components/Profil/PartieGaucheProfilComposant';
import ProfilRightPart from '@/Components/Profil/PartieDroiteProfilComposant';
import axios from 'axios';
import { useEffect, useState } from 'react';
import GestionCompte from '@/Components/Profil/GestionCompteComposant';

export default function PageProfil() {
    
    const [userData, setUserData] = useState(null);
    const [id, setId] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await axios.get('/api/session');
                setId(response.data.userId);
            } catch (err) {
                console.error('Erreur lors de la récupération de la session');
            }
        };

        fetchSessionData();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`/api/user/${id}`);
                    setUserData(response.data);
                } catch (err) {
                    console.error('Erreur lors du chargement des données utilisateur');
                }
            };

            fetchUserData();
        }
    }, [id]);

    if (!userData) return <div>Chargement...</div>;

    const nom = userData.nom;
    const prenom = userData.prenom;
    const mail = userData.mail;

    const userProfile = {
        nom : nom,
        prenom : prenom,
        mail : mail
    };
    if(urlParams.get('from') === 'tableau'){
        return (
            <>
                <Header ComposantProp={BarreOutils} />
                <div className="app">
                    <LeftPart ComposantProp={ProfilLeftPart} userName={nom+" "+prenom} />
                    <RightPart ComposantProp={GestionCompte}/>
                </div>
            </>
        );
    }else{
    return (
        <>
            <Header ComposantProp={BarreOutils} />
            <div className="app">
                <LeftPart ComposantProp={ProfilLeftPart} userName={nom+" "+prenom} />
                <RightPart ComposantProp={ProfilRightPart} userData={userProfile} />
            </div>
        </>
    );
}
}
