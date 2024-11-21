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

    if (!selectedEnseignements || selectedEnseignements.length === 0) {
        return <h1 className="Select-enseignement">Veuillez selectionner un enseignement</h1>;
    }

    const handleTableauClick = (nom) => {
        setActiveTableau(nom);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedTime) {
                    const [h, m] = selectedTime.split(':').map(Number);
                    setHeures(h);
                    setMinutes(m);
                }
    
                if (!selectedEnseignements || selectedEnseignements.length === 0) {
                    return;
                }

                if (selectedEnseignements.length > 0 && !activeTableau) {
                    const dernierEnseignement = selectedEnseignements[selectedEnseignements.length - 1];
                    setActiveTableau(dernierEnseignement.nom);
                }
    
                const groupesResponse = await fetch(`/api/groupes/${promoId}`);
                const groupesData = await groupesResponse.json();
    
                const countCM = groupesData.filter((g) => g.type === 'CM').length;
                const countTP = groupesData.filter((g) => g.type === 'TP').length;
                const countTD = groupesData.filter((g) => g.type === 'TD').length;
    
                const cmGroups = groupesData.filter((g) => g.type === 'CM');
                const tdGroups = groupesData.filter((g) => g.type === 'TD');
                const tpGroups = groupesData.filter((g) => g.type === 'TP');
    
                const ids = [...cmGroups.map((g) => g.id), ...tdGroups.map((g) => g.id), ...tpGroups.map((g) => g.id)];
                const names = [...cmGroups.map((g) => g.nom), ...tdGroups.map((g) => g.nom), ...tpGroups.map((g) => g.nom)];
    
                setNbCM(countCM);
                setNbTP(countTP);
                setNbTD(countTD);
                setNbGroupe(groupesData.length);
                setGroupesID(ids);
                setGroupNames(names);
    
                const semainesResponse = await fetch('/api/semaines');
                const semainesData = await semainesResponse.json();
    
                setSemainesID(semainesData.map((s) => s.id));
                setSemaines(semainesData.map((s) => s.numero));
    
                const enseignantResponse = await fetch(`/api/enseignant/${enseignantId}`);
                const enseignantData = await enseignantResponse.json();
    
                if (enseignantData && enseignantData.code) {
                    setEnseignantCode(enseignantData.code);
                }
    
                if (activeTableau) {
                    const enseignementId = selectedEnseignements.find((e) => e.nom === activeTableau)?.id;
    
                    if (enseignementId) {
                        const casesResponse = await axios.get(`/cases/${enseignementId}`);
                        const casesData = casesResponse.data;
    
                        const enseignantIds = [...new Set(casesData.map((item) => item.enseignant_id))];
                        const codesResponse = await Promise.all(
                            enseignantIds.map((id) => axios.get(`/api/enseignant/${id}`))
                        );
                        const enseignantCodes = Object.fromEntries(
                            enseignantIds.map((id, index) => [id, codesResponse[index].data.code])
                        );
    
                        const newClickedCells = {};
                        casesData.forEach((caseItem) => {
                            const semaineIndex = semainesData.findIndex((s) => s.id === caseItem.semaine_id);
                            const groupeIndex = ids.findIndex((g) => g === caseItem.groupe_id);
    
                            if (semaineIndex !== -1 && groupeIndex !== -1) {
                                const key = `${semaineIndex}-${groupeIndex}`;
                                newClickedCells[key] = {
                                    clicked: true,
                                    text: `${caseItem.nombre_heure}h${caseItem.nombre_minute || ''} - ${
                                        enseignantCodes[caseItem.enseignant_id]
                                    }`,
                                };
                            }
                        });
    
                        setCasesData(casesData);
                        setClickedCells(newClickedCells);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
    
        fetchData();
    }, [selectedTime, selectedEnseignements, activeTableau, promoId, enseignantId]);
    
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