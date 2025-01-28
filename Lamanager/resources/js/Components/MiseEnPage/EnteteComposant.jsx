import React from "react";
import BoutonProfil from "@/Components/Boutons/BoutonProfilComposant";

function Header({ ComposantProp }) {
  return (
    <header>
      <ComposantProp/>
      <BoutonProfil />
    </header>

  );
}

export default Header;
