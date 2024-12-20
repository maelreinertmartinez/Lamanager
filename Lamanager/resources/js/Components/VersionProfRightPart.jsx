import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

export default function VersionProfRightPart() {
  const [casesResponse, setCasesResponse] = useState([]);
  const [dataForChart, setDataForChart] = useState([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get('/api/session');
        const userId = response.data.userId;
        console.log(response.data.userId);
        
        const casesResponse = await axios.get(`/api/cases/${userId}`);
        setCasesResponse(casesResponse.data);
        console.log(casesResponse.data);
        
        processData(casesResponse.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des données', err);
      }
    };

    fetchSessionData();
  }, []);

  const processData = (cases) => {
    const weeksData = {};

    cases.forEach((caseItem) => {
      const weekId = caseItem.semaine_id;
      const hours = caseItem.nombre_heure;
      const minutes = caseItem.nombre_minute || 0;

      if (!weeksData[weekId]) {
        weeksData[weekId] = { total: 0 };
      }

      // Ajouter les heures et les minutes à la semaine correspondante
      weeksData[weekId].total += hours + minutes / 60; // Convertir les minutes en heures
    });

    // Transformer l'objet weeksData en un format compatible avec le graphique
    const formattedData = [['Semaines', 'Heures']];
    for (const weekId in weeksData) {
      formattedData.push([`${weekId}`, weeksData[weekId].total]);
    }

    setDataForChart(formattedData);
  };

  return (
    <div className='histogramme'>
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
    </div>
  );
}