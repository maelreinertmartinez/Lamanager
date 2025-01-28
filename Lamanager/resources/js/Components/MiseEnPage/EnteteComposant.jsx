import React from "react";
import BoutonProfil from "@/Components/BoutonProfil";

function Header({ ComposantProp }) {
  return (
    <header>
      <ComposantProp/>
      <BoutonProfil />
    </header>

  );
}

export default Header;
