import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircleX } from "lucide-react";
import TableHeader from './TableauComponents/TableHeader';
import TableTotal from './TableauComponents/TableTotal';
import TableBody from './TableauComponents/TableBody';


function EnseignementComponent({promoId, selectedEnseignements, onRemoveEnseignement, selectedTime }) {
    const [clickedCells, setClickedCells] = useState({});
    const [activeTableau, setActiveTableau] = useState(null);
    const [semainesID, setSemainesID] = useState([]);
    const [semaines, setSemaines] = useState([]);
    const [groupesID, setGroupesID] = useState([]);
    const [nbTP, setNbTP] = useState(0);
    const [nbTD, setNbTD] = useState(0);
    const [nbGroupe, setNbGroupe] = useState(0);
    const [groupNames, setGroupNames] = useState([]);
    const [enseignantCode, setEnseignantCode] = useState('');
    const [nbCM, setNbCM] = useState(0);
    const [heures, setHeures] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [casesData, setCasesData] = useState([]);

    const longueurSemaines = semaines.length;

    const params = new URLSearchParams(window.location.search);
    const enseignantId = params.get('enseignant');

    useEffect(() => {
        if (selectedTime) {
            const [h, m] = selectedTime.split(':').map(Number);
            setHeures(h);
            setMinutes(m);
        }
    }, [selectedTime]);
    

    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    useEffect(() => {
        if (selectedEnseignements.length > 0) {
            const dernierEnseignement = selectedEnseignements[selectedEnseignements.length - 1];
            setActiveTableau(dernierEnseignement.nom);
        }
    }, [selectedEnseignements]);

    const handleTableauClick = (nom) => {
            setActiveTableau(nom);
    };

    useEffect(() => {
        const fetchGroupes = async () => {
            try {
                const response = await fetch(`/api/groupes/${promoId}`);
                const data = await response.json();
    
                const countCM = data.filter((groupe) => groupe.type === 'CM').length;
                const countTP = data.filter((groupe) => groupe.type === 'TP').length;
                const countTD = data.filter((groupe) => groupe.type === 'TD').length;
                const countGroupe = data.length;
    
                const cmGroups = data.filter((groupe) => groupe.type === 'CM');
                const tdGroups = data.filter((groupe) => groupe.type === 'TD');
                const tpGroups = data.filter((groupe) => groupe.type === 'TP');
    
                // Supprimer les unshift(0) qui causent le problème
                const ids = [...cmGroups.map(g => g.id), ...tdGroups.map(g => g.id), ...tpGroups.map(g => g.id)];
                const names = [...cmGroups.map(g => g.nom), ...tdGroups.map(g => g.nom), ...tpGroups.map(g => g.nom)];
    
                setNbCM(countCM);
                setNbTP(countTP);
                setNbTD(countTD);
                setNbGroupe(countGroupe);
                setGroupesID(ids);
                setGroupNames(names);
    
            } catch (error) {
                console.error("Erreur lors de la récupération des groupes:", error);
            }
        }
        fetchGroupes();
    }, []);

    useEffect(() => {
        const fetchSemaines = async () => {
            try {
                const response = await fetch('/api/semaines');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des semaines');
                }
                const data = await response.json();
                
                const numerosSemaines = data.map((semaine) => semaine.numero);
                const idsSemaines = data.map((semaine) => semaine.id);
                setSemainesID(idsSemaines);
                setSemaines(numerosSemaines);
            } catch (error) {
                console.error("Erreur lors de la récupération des semaines :", error);
            }
        };
    
        fetchSemaines();
    }, []);

    useEffect(() => {
        const fetchEnseignant = async () => {
            try {
                
                const response = await fetch(`/api/enseignant/${enseignantId}`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de l\'enseignant');
                }
                
                const data = await response.json();
                
                if (data && data.code) {
                    setEnseignantCode(data.code);
                } else {
                    throw new Error('Code non trouvé pour l\'enseignant');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'enseignant :", error);
            }
        };
    
        fetchEnseignant();
    }, []);

    useEffect(() => {
        const fetchCases = async () => {
            if (selectedEnseignements.length > 0) {
                try {
                    const enseignementId = selectedEnseignements.find(e => e.nom === activeTableau)?.id;
                    if (enseignementId) {
                        const response = await axios.get(`/cases/${enseignementId}`);
                        if (response.data) {
                            setCasesData(response.data);
                            // Update clickedCells state based on the fetched data
                            const newClickedCells = {};
                            
                            // Récupérer tous les codes des enseignants en une seule fois
                            const enseignantIds = [...new Set(response.data.map(item => item.enseignant_id))];
                            const codesResponse = await Promise.all(
                                enseignantIds.map(id => axios.get(`/api/enseignant/${id}`))
                            );
                            const enseignantCodes = Object.fromEntries(
                                enseignantIds.map((id, index) => [id, codesResponse[index].data.code])
                            );

                            response.data.forEach(caseItem => {
                                const semaineIndex = semainesID.indexOf(caseItem.semaine_id);
                                const groupeIndex = groupesID.indexOf(caseItem.groupe_id);
                                if (semaineIndex !== -1 && groupeIndex !== -1) {
                                    const key = `${semaineIndex}-${groupeIndex}`;
                                    newClickedCells[key] = {
                                        clicked: true,
                                        text: `${caseItem.nombre_heure}h${caseItem.nombre_minute ? caseItem.nombre_minute : ''}  - ${enseignantCodes[caseItem.enseignant_id]}`
                                    };
                                }
                            });
                            setClickedCells(newClickedCells);
                        }
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des cases:", error);
                    if (error.response?.status === 404) {
                        console.log("Aucune case trouvée pour cet enseignement");
                    }
                }
            }
        };

        fetchCases();
    }, [activeTableau, semainesID, groupesID, enseignantCode, selectedEnseignements]);

    return (
        <>
            <div className="liste-ressources">
                {selectedEnseignements.map((enseignement) => enseignement && (
                    <div 
                        key={enseignement.id}
                        className={`tab-item ${activeTableau === enseignement.nom ? 'active' : ''}`}
                        onClick={() => handleTableauClick(enseignement.nom)}
                    >
                        <span style={{ display: 'flex', justifyContent: 'center', width: '45px'}} className="mr-2">{enseignement.nom || 'Sans nom'}</span>
                            <CircleX size={28} className="circle-x" onClick={(e) => {
                                e.stopPropagation();
                                onRemoveEnseignement(enseignement.id);
                            }}/>
                    </div>
                ))}
            </div>
            
            {selectedEnseignements.map((enseignement) => enseignement && (
                <div 
                    key={enseignement.id}
                    className="Tableau"
                    id={enseignement.nom}
                    style={{ display: activeTableau === enseignement.nom ? 'block' : 'none' }}
                >
                    <div className="flex flex-col">
                        <div className="mb-4 relative">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                <TableHeader 
                                    enseignement={enseignement}
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    nbTP={nbTP}
                                    groupNames={groupNames}
                                />
                                </thead>
                                <TableBody 
                                    semaines={semaines}
                                    semainesID={semainesID}
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    clickedCells={clickedCells}
                                    enseignantId={enseignantId}
                                    enseignement={enseignement}
                                    groupesID={groupesID}
                                    enseignantCode={enseignantCode}
                                    heures={heures}
                                    minutes={minutes}
                                    setClickedCells={setClickedCells}   
                                />
                            </table>
                            <table className="w-full border-collapse border border-black sticky bottom-0 bg-white">
                            <TableTotal 
                                    nbGroupe={nbGroupe}
                                    nbCM={nbCM}
                                    nbTD={nbTD}
                                    nbTP={nbTP}
                                    longueurSemaines={longueurSemaines}
                                    clickedCells={clickedCells}
                                />
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default EnseignementComponent;