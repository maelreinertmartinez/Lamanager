import React from 'react';
import Header from '../Components/Header';
import ListeEnseignements from '@/Components/ListeEnseignements';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';
import BarreOutils from '@/Components/BarreOutils';

export default function Test() {
  return (
    <>
    <Header ComposantProp={BarreOutils} />
        <div className="app">
            <LeftPart ComposantProp={ListeEnseignements}/>
            <RightPart ComposantProp={Tableau}/>
        </div>
    </>
  );
}