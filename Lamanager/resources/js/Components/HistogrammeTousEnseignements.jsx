import React from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLabel } from 'victory';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const HistogrammeTousEnseignements = ({ data }) => {
  
  const formattedData = data.map(item => ({
    semaine: item.semaine,
    ...item.enseignements,
  }));

  const enseignements = Object.keys(formattedData[0]).filter(key => key !== 'semaine');


  const colors = enseignements.reduce((acc, enseignement) => {
    acc[enseignement] = getRandomColor();
    return acc;
  }, {});

  return (
    <VictoryChart theme={VictoryTheme.material} domainPadding={35} containerComponent={<VictoryVoronoiContainer />} width={window.innerWidth * 0.9} height={window.innerHeight * 0.9}>
      <VictoryAxis
        tickValues={formattedData.map(item => item.semaine)}
        tickFormat={formattedData.map(item => item.semaine)}
        style={{
            grid: { stroke: "none" } // Supprimer les lignes verticales
        }}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(x) => `${x}h`}
      />
      <VictoryLabel
        x={225}
        y={25}
        textAnchor="middle"
        text="Répartition des heures par enseignement"
      />
      <VictoryStack>
        {enseignements.map((enseignement, index) => (
          <VictoryBar
            key={index}
            data={formattedData}
            x="semaine"
            y={enseignement}
            style={{ data: { fill: "#000000" } }}
            labels={({ datum }) => `${enseignement} : ${datum[enseignement]}h`}
            labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  );
};

export default HistogrammeTousEnseignements;