import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import HistogrammeGroupe from '@/Components/HistogrammeGroupe';
import HistogrammeTousEnseignements from './HistogrammeTousEnseignements';

export default function VersionProfRightPart({ selections }) {
  const [dataForChart, setDataForChart] = useState([]);
  const [dataForGroupes, setDataForGroupes] = useState([]);
  const [dataForEnseignements, setDataForEnseignements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selections.selectedAnnee && selections.selectedEnseignement) {
      console.log('Fetching data for:', selections);
      fetchCaseTableauData(selections.selectedAnnee.id, selections.selectedEnseignement.id);
    }
    if (selections.all === "all") {
      fetchCaseTableauDataAll(selections.selectedAnnee.id);

    }
  }, [selections]);

  const fetchCaseTableauData = async (anneeId, enseignementId) => {
    setLoading(true);
    try {
      const sessionResponse = await axios.get('/api/session');
      const userId = sessionResponse.data.userId;

      const response = await axios.get(`/api/cases/recherche/${anneeId}/${enseignementId}/${userId}`);
      processData(response.data);
      
      console.log('Data:', response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des données', err);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };
  const fetchCaseTableauDataAll = async (anneeId) => {
    console.log('oui');
    setLoading(true);
    try {
      const sessionResponse = await axios.get('/api/session');
      const userId = sessionResponse.data.userId;

      const response = await axios.get(`/api/cases/rechercheComplete/${anneeId}/${userId}`);
      processData(response.data);
      console.log('Data:', response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des données', err);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };

  const processData = (cases, isAllEnseignementsSelected) => {
    const weeksData = {};
    const groupesData = {};
    const enseignements = new Set();
  
    cases.forEach((caseItem) => {
      const weekId = caseItem.semaine_id;
      const hours = caseItem.nombre_heure;
      const minutes = caseItem.nombre_minute || 0;
      const type = caseItem.type;
      const enseignement = caseItem.nom;
  
      if (!weeksData[weekId]) {
        weeksData[weekId] = {};
      }
      if (!weeksData[weekId][enseignement]) {
        weeksData[weekId][enseignement] = 0;
      }
      weeksData[weekId][enseignement] += hours + minutes / 60;
      enseignements.add(enseignement);

      if (!groupesData[weekId]) {
        groupesData[weekId] = { CM: 0, TD: 0, TP: 0 };
      }
      groupesData[weekId][type] += hours + minutes / 60; 

    });
    
  
    const formattedData = [['Semaines', ...enseignements]];
    for (const weekId in weeksData) {
      const row = [`Semaine ${weekId}`];
      enseignements.forEach((enseignement) => {
        row.push(weeksData[weekId][enseignement] || 0);
      });
      formattedData.push(row);
    }

    const formattedGroupesData  = Object.keys(groupesData).map(weekId => ({
      semaine: `S${weekId}`,
      CM: groupesData[weekId].CM,
      TD: groupesData[weekId].TD,
      TP: groupesData[weekId].TP,
    }));

    console.log('Formatted Data:', formattedData);
  
    if (isAllEnseignementsSelected) {
      setDataForEnseignements(formattedData);
    } else {
      setDataForChart(formattedData);
    }
    setDataForGroupes(formattedGroupesData);
  };
  

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='histogramme'>
      {selections.showGroupes ? (
      <HistogrammeGroupe data={dataForGroupes} />
    ) : (
      selections.isAllEnseignementsSelected ? (
      <HistogrammeTousEnseignements data={dataForEnseignements} />
    ) : (
      dataForChart.length > 1 && (
        <Chart
          chartType="Bar"
          width="100%"
          height="100%"
          data={dataForChart}
          options={{
            title: 'Heures par semaine',
            chartArea: { width: '30%' },
            hAxis: {
              title: 'Heures',
            },
            vAxis: {
              title: 'Semaines',
              slantedText: true,
              slantedTextAngle: 90,
            },
            bars: 'vertical',  
            colors: ['#AD71C1'],  
          }}
        />
      )
    )
    )}
    </div>
  );
}