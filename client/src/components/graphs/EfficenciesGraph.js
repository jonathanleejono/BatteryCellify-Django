import React from 'react';
import Plot from 'react-plotly.js';

const EfficenciesGraph = ({
  cycleNumbersAdjustedCapacity,
  cycleNumbersAdjustedEnergy,
  energyEfficiency,
  coulombicEfficiency,
  batteryCellNameId,
}) => {
  // cycle numbers and the effiencies do not have the same length right now

  return (
    <div>
      <Plot
        divId="EfficenciesGraph"
        data={[
          {
            type: 'line',
            x: cycleNumbersAdjustedCapacity,
            y: coulombicEfficiency,
            marker: { color: 'blue' },
            text: `ah_eff: ${batteryCellNameId}`,
            name: `ah_eff: ${batteryCellNameId}`,
          },
          {
            type: 'line',
            x: cycleNumbersAdjustedEnergy,
            y: energyEfficiency,
            marker: { color: 'red' },
            text: `wh_eff: ${batteryCellNameId}`,
            name: `wh_eff: ${batteryCellNameId}`,
          },
        ]}
        // -------------------------------------------------
        layout={{
          autosize: true,
          title: 'Efficencies',
          font: {
            family: 'Public Sans, sans-serif',
          },
          xaxis: {
            title: 'Cycle Number',
            titlefont: {
              size: 14,
              color: '#000000',
            },
          },
          yaxis: {
            title: 'Energy and Coulombic Efficencies',
            titlefont: {
              size: 14,
              color: '#000000',
            },
          },
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.5,
            xanchor: 'right',
            x: 1,
          },
        }}
        useResizeHandler
        style={{
          width: '100%',
          height: '100%',

          borderRadius: '5px',
          boxShadow: '0 4px 9px -3px rgb(102 136 153 / 15%)',
        }}
      />
    </div>
  );
};

export default EfficenciesGraph;
