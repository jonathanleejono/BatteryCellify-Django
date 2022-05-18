import React from 'react';
import Plot from 'react-plotly.js';

const TimeSeriesDecayGraph = ({
  testTime,
  timeSeriesDischargeCapacityAh,
  timeSeriesDischargeEnergyWh,
  batteryCellNameId,
}) => {
  return (
    <div>
      <Plot
        divId="TimeSeriesDecayGraph"
        data={[
          {
            type: 'scatter',
            x: testTime,
            y: timeSeriesDischargeCapacityAh,
            mode: 'markers',
            marker: { color: 'blue' },
            text: `ah_d: ${batteryCellNameId}`,
            name: `ah_d: ${batteryCellNameId}`,
          },
          {
            type: 'scatter',
            x: testTime,
            y: timeSeriesDischargeEnergyWh,
            mode: 'markers',
            marker: { color: 'red' },
            text: `wh_d: ${batteryCellNameId}`,
            name: `wh_d: ${batteryCellNameId}`,
          },
        ]}
        // -------------------------------------------------
        layout={{
          autosize: true,
          title: 'Time Series - Data Energy and Capacity Decay',
          xaxis: {
            title: 'Time (s)',
            titlefont: {
              size: 14,
              color: '#000000',
            },
          },
          yaxis: {
            title: 'Wh/Ah',
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

export default TimeSeriesDecayGraph;
