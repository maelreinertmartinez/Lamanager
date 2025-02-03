import React from "react";
import { Link } from '@inertiajs/react';
import BoutonProfil from "@/Components/Boutons/BoutonProfilComposant.jsx";


function HeaderNeutre({ }) {
    return (
        <>
        <Link href="/">
          <div className="header-content">
            <img src="/testlogo.png" alt="Logo" className="logo" />
            <h1 className="title">Lamanager</h1>
          </div>
        </Link>
        <BoutonProfil />
      </>
    )
}

export default HeaderNeutre;