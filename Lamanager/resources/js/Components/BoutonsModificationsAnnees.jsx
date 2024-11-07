import React from "react";

function BoutonModificationsAnnees({ className, Icon, onClick }) {
  return (
    <div className={className} onClick={onClick}>
      <Icon width={50} height={50} color="#564787" />
    </div>
  );
}

export default BoutonModificationsAnnees;