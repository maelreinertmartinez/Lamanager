import React, { useState, useEffect } from "react";
import axios from 'axios';
import ChoixPromo from "./ChoixPromo";
import AjoutPromo from "@/Components/AjoutPromo.jsx";
import BoutonModificationsPromos from "./BoutonsModificationsPromos";
import { Trash2, Edit } from "lucide-react";
import { Link } from '@inertiajs/react';
import PopupModifPromo from "./PopupModifPromo";
import PopupSuppression from "./popupSuppression";

function PromoRightPart({ selectedAnnee }) {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showCustomPopup, setShowCustomPopup] = useState(false);

    const fetchPromos = async () => {
        if (!selectedAnnee) return;
        try {
            const response = await axios.get(`/api/promos/${selectedAnnee.id}`);
            setPromos(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erreur lors du chargement des promos');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, [selectedAnnee]);

    const handleDelete = async (promoId) => {
        try {
            await axios.delete(`/api/promos/${promoId}`);
            await fetchPromos(); // Refresh the promos list
        } catch (err) {
            console.error("Erreur lors de la suppression de la promo", err);
        }
    };

    const handlePromoAdded = (updatedPromos) => {
        setPromos(updatedPromos);
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    let temp = [];
    for (let i = 0; i < promos.length; i++) {
        if (!promos[i].alternant) {
            temp.push(promos[i]);
        }
    }

    return (
        <>
            <div className="Promos">
                <ul className="promos-list">
                    {temp.map((promo) => (
                        <li key={promo.id}>
                            <Link href={`/tableau?promo_id=${promo.id}&annee_id=${selectedAnnee.id}`}>
                                <ChoixPromo className="but-class" title={promo.nom} />
                            </Link>
                        </li>
                    ))}
                    <li onClick={() => setShowCustomPopup(true)}>
                        <ChoixPromo className="but-class" title="+" />
                    </li>
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

            {showCustomPopup && (
                <AjoutPromo
                    selectedAnnee={selectedAnnee}
                    onClose={() => setShowCustomPopup(false)}
                    onPromoAdded={handlePromoAdded}
                />
            )}

            {showDeletePopup && (
                <PopupSuppression
                    onClose={() => setShowDeletePopup(false)}
                    promos={promos}
                    onDelete={handleDelete}
                />
            )}

            {showEditPopup && (
                <PopupModifPromo
                    onClose={() => setShowEditPopup(false)}
                    promos={promos}
                    selectedYear={selectedAnnee.annee}
                    onPromoUpdated={fetchPromos}
                />
            )}
        </>
    );
}

export default PromoRightPart;
