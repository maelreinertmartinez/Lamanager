import React from 'react';
import Header from '../Components/Header';
import ListeEnseignements from '@/Components/ListeEnseignements';
import LeftPart from '@/Components/LeftPart';
import RightPart from '@/Components/RightPart';
import Tableau from '@/Components/Tableau';

export default function Test() {
  return (
    <>
    <Header />
        <div className="app">
            <LeftPart ComposantProp={ListeEnseignements}/>
            <RightPart ComposantProp={Tableau}/>
        </div>
    </>
  );
} 