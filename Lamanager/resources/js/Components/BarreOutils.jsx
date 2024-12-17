import React, { useState, useEffect } from "react";
import logo from '../../img/testlogo.png';
import { Link } from '@inertiajs/react';
import { Table, ChartColumnIncreasing, MousePointer2, Settings, BookUser, FileUser, Download } from "lucide-react";
import axios from 'axios';
import ImportPopup from "@/Components/ImportPopup.jsx";

function BarreOutils({ toggleIcons }) {
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [promoName, setPromoName] = useState('');
    const params = new URLSearchParams(window.location.search);
    const promoId = params.get('promo_id');

    useEffect(() => {
        const fetchPromoName = async () => {
            if (promoId) {
                try {
                    const response = await axios.get(`/api/promo/${promoId}`);
                    setPromoName(response.data.nom);
                } catch (error) {
                    console.error('Erreur lors de la récupération du nom de la promo:', error);
                }
            }
        };

        fetchPromoName();
    }, [promoId]);

    return (
        <>
            <Link href="/">
                <div className="header-content">
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="title">Lamanager</h1>
                </div>
            </Link>
            <div className="NomPromo">
                <h2>{promoName}</h2>
            </div>
            <div className="BarreOutils">
                <ul className="barre-outils-list">
                    <li className="barre-outils-item" onClick={() => setShowCustomPopup(true)}><Table/></li>
                    <li className="barre-outils-item"><ChartColumnIncreasing /></li>
                    <li className="barre-outils-item" onClick={toggleIcons}><MousePointer2 /></li>
                    <li className="barre-outils-item"><Settings /></li>
                    <li className="barre-outils-item"><BookUser /></li>
                    <li className="barre-outils-item"><FileUser /></li>
                    <li className="barre-outils-item"><Download /></li>
                </ul>
            </div>
            {showCustomPopup && (
                <ImportPopup
                    onClose={() => setShowCustomPopup(false)}
                />
            )}
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

export default BarreOutils;