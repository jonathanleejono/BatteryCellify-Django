import React from 'react';
import Plot from 'react-plotly.js';
// import Plotly from "plotly.js";

const PlotTest = () => {
  const test = [2, 10, 3];
  const statusOptions = ['interview', 'denied', 'huh?'];

  return (
    <div>
      <Plot
        divId="plotlyChart"
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
          title: 'A Fancy Plot',
          xaxis: {
            title: 'testing',
            titlefont: {
              size: 18,
              color: '#7f7f7f',
            },
          },
        }}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default PlotTest;
