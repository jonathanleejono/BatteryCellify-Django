import React from 'react';
import Plot from 'react-plotly.js';

const TimeSeriesDecayGraph = () => {
  const test = [2, 10, 3];
  const statusOptions = ['interview', 'denied', 'huh?'];

  return (
    <div>
      <Plot
        divId="TimeSeriesDecayGraph"
        data={[
          {
            x: statusOptions,
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
          {
            type: 'bar',
            x: statusOptions,
            y: [2, 5, 3],
            text: ['Text A', 'Text B', 'Text C'],
          },
          {
            type: 'bar',
            x: statusOptions,
            y: test,
            marker: { color: 'green' },
            text: ['Text A', 'Text B', 'Text C'],
            name: 'Lines, Markers and Text',
          },
        ]}
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
          xaxis: {
            title: 'Wh/Ah',
            titlefont: {
              size: 14,
              color: '#000000',
            },
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
