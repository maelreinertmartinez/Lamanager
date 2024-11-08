import React, { useState } from "react";
import ChoixPromo from "./ChoixPromo";
import BoutonModificationsPromos from "./BoutonsModificationsPromos";
import { Trash2, Edit } from "lucide-react";
import { Link } from '@inertiajs/react';

function PromoRightPart() {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);

    return (
        <>
        <div className="Promos">
            <ul className="promos-list">
            <li><Link href="/test?promo=BUT 1"><ChoixPromo className="but-class" title="BUT 1" /></Link></li>
            <li><Link href="/test?promo=BUT 2"><ChoixPromo className="but-class" title="BUT 2" /></Link></li>
            <li><Link href="/test?promo=BUT 3"><ChoixPromo className="but-class" title="BUT 3" /></Link></li>
            <li onClick={() => setShowAddPopup(true)}><ChoixPromo className="but-class" title="+"/></li>
            </ul>
        </div>
        <div className="ModificationsPromos">
            <BoutonModificationsPromos 
            className="btn-modif-class" 
            Icon={Trash2} 
            onClick={() => setShowDeletePopup(true)}
            />
            <BoutonModificationsPromos 
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

        {/* Popup d'ajout */}
        {showAddPopup && (
            <div className="popup-overlay">
            <div className="popup-content">
                <h2>Ajout</h2>
                <p>Message de test pour l'ajout</p>
                <button onClick={() => setShowAddPopup(false)}>Fermer</button>
            </div>
            </div>
        )}
    </>
    );
}

export default PromoRightPart;