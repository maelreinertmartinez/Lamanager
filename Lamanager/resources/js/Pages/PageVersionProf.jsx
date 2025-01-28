import React, { useState, useCallback } from 'react';
import Header from '@/Components/MiseEnPage/EnteteComposant';
import LeftPart from '@/Components/MiseEnPage/PartieGaucheComposant';
import RightPart from '@/Components/MiseEnPage/PartieDroiteComposant';
import BarreOutils from '@/Components/MiseEnPage/BarreOutilsComposant';
import VersionProfLeftPart from '@/Components/Tableaux/PartieGaucheProfesseurComposant';
import VersionProfRightPart from '@/Components/Tableaux/PartieDroiteProfesseurComposant';

export default function PageVersionProf() {
  const [selections, setSelections] = useState({});

  const handleSelectionChange = useCallback((newSelections) => {
    setSelections(newSelections);
  }, []);

  return (
    <>
      <Header ComposantProp={BarreOutils} />
      <div className="app">
        <LeftPart ComposantProp={() => <VersionProfLeftPart onSelectionChange={handleSelectionChange} />} />
        <RightPart ComposantProp={() => <VersionProfRightPart selections={selections} />} />
      </div>
    </>
  );
}