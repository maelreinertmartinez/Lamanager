import React from "react";
import ChoixAnnee from "./ChoixAnnee";
import BoutonModificationsAnnees from "./BoutonsModificationsAnnees";
import { Trash2, Edit } from "lucide-react";

function RightPart() {
  return (
    <div className="Right">
      <div className="Annees">
        <ul className="annees-list">
          <li><ChoixAnnee className="but-class" title="BUT 1" /></li>
          <li><ChoixAnnee className="but-class" title="BUT 2" /></li>
          <li><ChoixAnnee className="but-class" title="BUT 3" /></li>
          <li><ChoixAnnee className="but-class" title="+" /></li>
        </ul>
      </div>
      <div className="ModificationsAnnees">
        <BoutonModificationsAnnees className="btn-modif-class" Icon={Trash2} />
        <BoutonModificationsAnnees className="btn-modif-class" Icon={Edit} />
      </div>
    </div>
  );
}

export default RightPart;