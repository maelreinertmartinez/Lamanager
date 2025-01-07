import React from 'react';
import { VictoryChart, VictoryStack, VictoryBar, VictoryAxis, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryLabel } from 'victory';

const HistogrammeGroupe = ({ data }) => {
  const formattedData = data.map(item => ({
    semaine: item.semaine,
    CM: item.CM,
    TD: item.TD,
    TP: item.TP,
  }));

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
        text="Répartition des heures par type de cours"
      />
      <VictoryStack>
      <VictoryBar
          data={formattedData}
          x="semaine"
          y="CM"
          style={{ data: { fill: "#FFCE6E" } }}
          labels={({ datum }) => `CM : ${datum.CM}h`}
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
        />
        <VictoryBar
          data={formattedData}
          x="semaine"
          y="TD"
          style={{ data: { fill: "#FF6D88" } }}
          labels={({ datum }) => `TD : ${datum.TD}h`}
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
        />
        <VictoryBar
          data={formattedData}
          x="semaine"
          y="TP"
          style={{ data: { fill: "#62C4FB" } }}
          labels={({ datum }) => `TP : ${datum.TP}h`}
          labelComponent={<VictoryTooltip style={{ fontSize: 15 }} />}
        />

      </VictoryStack>
    </VictoryChart>
  );
};

export default HistogrammeGroupe;