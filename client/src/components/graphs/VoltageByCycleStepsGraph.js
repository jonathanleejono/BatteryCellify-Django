import React from 'react';
import Plot from 'react-plotly.js';

const VoltageByCycleStepsGraph = ({
  voltageCycles100Step,
  voltageCycles200Step,
  voltageCycles300Step,
  voltageCycles400Step,
  voltageCycles500Step,
  voltageCycles600Step,
  voltageCycles700Step,
  voltageCycles800Step,
  voltageCycles900Step,
  voltageCycles1000Step,
  voltageCycles1100Step,
  chargeCapacityCycles100Step,
  chargeCapacityCycles200Step,
  chargeCapacityCycles300Step,
  chargeCapacityCycles400Step,
  chargeCapacityCycles500Step,
  chargeCapacityCycles600Step,
  chargeCapacityCycles700Step,
  chargeCapacityCycles800Step,
  chargeCapacityCycles900Step,
  chargeCapacityCycles1000Step,
  chargeCapacityCycles1100Step,
  dischargeCapacityCycles100Step,
  dischargeCapacityCycles200Step,
  dischargeCapacityCycles300Step,
  dischargeCapacityCycles400Step,
  dischargeCapacityCycles500Step,
  dischargeCapacityCycles600Step,
  dischargeCapacityCycles700Step,
  dischargeCapacityCycles800Step,
  dischargeCapacityCycles900Step,
  dischargeCapacityCycles1000Step,
  dischargeCapacityCycles1100Step,
  batteryCellNameId,
}) => {
  return (
    <div>
      <Plot
        divId="VoltageByCycleStepsGraph"
        data={[
          {
            type: 'line',
            x: chargeCapacityCycles100Step,
            y: voltageCycles100Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 100`,
            name: `${batteryCellNameId} c: 100`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles100Step,
            y: voltageCycles100Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 100`,
            name: `${batteryCellNameId} d: 100`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles200Step,
            y: voltageCycles200Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 200`,
            name: `${batteryCellNameId} c: 200`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles200Step,
            y: voltageCycles200Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 200`,
            name: `${batteryCellNameId} d: 200`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles300Step,
            y: voltageCycles300Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 300`,
            name: `${batteryCellNameId} c: 300`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles300Step,
            y: voltageCycles300Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 300`,
            name: `${batteryCellNameId} d: 300`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles400Step,
            y: voltageCycles400Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 400`,
            name: `${batteryCellNameId} c: 400`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles400Step,
            y: voltageCycles400Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 400`,
            name: `${batteryCellNameId} d: 400`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles500Step,
            y: voltageCycles500Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 500`,
            name: `${batteryCellNameId} c: 500`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles500Step,
            y: voltageCycles500Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 500`,
            name: `${batteryCellNameId} d: 500`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles600Step,
            y: voltageCycles600Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 600`,
            name: `${batteryCellNameId} c: 600`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles600Step,
            y: voltageCycles600Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 600`,
            name: `${batteryCellNameId} d: 600`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles700Step,
            y: voltageCycles700Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 700`,
            name: `${batteryCellNameId} c: 700`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles700Step,
            y: voltageCycles700Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 700`,
            name: `${batteryCellNameId} d: 700`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles800Step,
            y: voltageCycles800Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 800`,
            name: `${batteryCellNameId} c: 800`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles800Step,
            y: voltageCycles800Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 800`,
            name: `${batteryCellNameId} d: 800`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles900Step,
            y: voltageCycles900Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 900`,
            name: `${batteryCellNameId} c: 900`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles900Step,
            y: voltageCycles900Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 900`,
            name: `${batteryCellNameId} d: 900`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles1000Step,
            y: voltageCycles1000Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 1000`,
            name: `${batteryCellNameId} c: 1000`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles1000Step,
            y: voltageCycles1000Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 1000`,
            name: `${batteryCellNameId} d: 1000`,
          },
          {
            type: 'line',
            x: chargeCapacityCycles1100Step,
            y: voltageCycles1100Step,
            // marker: { color: 'blue' },
            text: `${batteryCellNameId} c: 1100`,
            name: `${batteryCellNameId} c: 1100`,
          },
          {
            type: 'line',
            x: dischargeCapacityCycles1100Step,
            y: voltageCycles1100Step,
            // marker: { color: 'red' },
            text: `${batteryCellNameId} d: 1100`,
            name: `${batteryCellNameId} d: 1100`,
          },
        ]}
        // -------------------------------------------------
        layout={{
          autosize: true,
          title: 'Cycle Quantities By Step',
          font: {
            family: 'Public Sans, sans-serif',
          },
          xaxis: {
            title: 'Capacity (Ah)',
            titlefont: {
              size: 14,
              color: '#000000',
            },
          },
          yaxis: {
            title: 'Voltage (V)',
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

export default VoltageByCycleStepsGraph;
