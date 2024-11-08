import React, { useState } from "react";
import ChoixAnnee from "./ChoixAnnee";
import BoutonModificationsAnnees from "./BoutonsModificationsAnnees";
import { Trash2, Edit } from "lucide-react";
import { Link } from '@inertiajs/react';

function AnneeRightPart() {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);

    return (
        <>
        <div className="Annees">
            <ul className="annees-list">
            <li><Link href="/test"><ChoixAnnee className="but-class" title="BUT 1" /></Link></li>
            <li><Link href="/test"><ChoixAnnee className="but-class" title="BUT 2" /></Link></li>
            <li><Link href="/test"><ChoixAnnee className="but-class" title="BUT 3" /></Link></li>
            <li><Link href="/test"><ChoixAnnee className="but-class" title="+" /></Link></li>
            </ul>
        </div>
        <div className="ModificationsAnnees">
            <BoutonModificationsAnnees 
            className="btn-modif-class" 
            Icon={Trash2} 
            onClick={() => setShowDeletePopup(true)}
            />
            <BoutonModificationsAnnees 
            className="btn-modif-class" 
            Icon={Edit} 
            onClick={() => setShowEditPopup(true)}
            />
        </div>

        {/* Popup de suppression */}
        {showDeletePopup && (
            <div className="popup-overlay">
            <div className="popup-content">
                <h2>Suppression</h2>
                <p>Message de test pour la suppression</p>
                <button onClick={() => setShowDeletePopup(false)}>Fermer</button>
            </div>
            </div>
        )}

        {/* Popup d'édition */}
        {showEditPopup && (
            <div className="popup-overlay">
            <div className="popup-content">
                <h2>Édition</h2>
                <p>Message de test pour l'édition</p>
                <button onClick={() => setShowEditPopup(false)}>Fermer</button>
            </div>
            </div>
        )}
    </>
    );
}

export default AnneeRightPart;