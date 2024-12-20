  import React, { useEffect, useState } from 'react';
  import { Chart } from 'react-google-charts';
  import axios from 'axios';

  export default function VersionProfRightPart({ selections }) {
    const [dataForChart, setDataForChart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (selections.selectedAnnee && selections.selectedEnseignement) {
        fetchCaseTableauData(selections.selectedAnnee.id, selections.selectedEnseignement.id);
      }
    }, [selections]);

    const fetchCaseTableauData = async (anneeId, enseignementId) => {
      setLoading(true);
      try {
        const sessionResponse = await axios.get('/api/session');
        const userId = sessionResponse.data.userId;
        console.log('User ID:', userId);
        console.log('Année ID:', anneeId);
        console.log('Enseignement ID:', enseignementId);

        const response = await axios.get(`/api/cases/recherche/${anneeId}/${enseignementId}/${userId}`);
        console.log('Cases Response:', response.data);
        processData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données', err);
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    const processData = (cases) => {
      const weeksData = {};

      cases.forEach((caseItem) => {
        const weekId = caseItem.semaine_id;
        const hours = caseItem.nombre_heure;
        const minutes = caseItem.nombre_minute || 0;

        if (!weeksData[weekId]) {
          weeksData[weekId] = { total: 0 };
        }

        weeksData[weekId].total += hours + minutes / 60; // Convertir les minutes en heures
      });

      const formattedData = [['Semaines', 'Heures']];
      for (const weekId in weeksData) {
        formattedData.push([`Semaine ${weekId}`, weeksData[weekId].total]);
      }

      setDataForChart(formattedData);
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div className='histogramme'>
        {dataForChart.length > 1 && (
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
        )}
      </div>
    );
  }