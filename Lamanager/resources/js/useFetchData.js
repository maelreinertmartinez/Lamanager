import { useState, useEffect } from 'react';
import axios from 'axios';

function useSemainesData(selectedTime, selectedEnseignements, promoId, enseignantId, activeTableau, setActiveTableau) {
    const [semainesID, setSemainesID] = useState([]);
    const [semaines, setSemaines] = useState([]);
    const [groupesID, setGroupesID] = useState([]);
    const [groupNames, setGroupNames] = useState([]);
    const [nbCM, setNbCM] = useState(0);
    const [nbTP, setNbTP] = useState(0);
    const [nbTD, setNbTD] = useState(0);
    const [nbGroupe, setNbGroupe] = useState(0);
    const [enseignantCode, setEnseignantCode] = useState('');
    const [heures, setHeures] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [casesData, setCasesData] = useState([]);
    const [clickedCells, setClickedCells] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (typeof selectedTime === 'string' && selectedTime.includes(':')) {
                    const [h, m] = selectedTime.split(':').map(Number);
                    setHeures(h);
                    setMinutes(m);
                } else {
                    setHeures(0);
                    setMinutes(0);
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

    return {
        semainesID,
        semaines,
        groupesID,
        groupNames,
        nbCM,
        nbTP,
        nbTD,
        nbGroupe,
        enseignantCode,
        heures,
        minutes,
        clickedCells,
        setClickedCells,
    };
}

export default useSemainesData;
