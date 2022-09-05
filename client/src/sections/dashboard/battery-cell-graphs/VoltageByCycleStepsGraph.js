import React from 'react';
import Plot from 'react-plotly.js';

const VoltageByCycleStepsGraph = ({
  voltage_cycles_100_step,
  voltage_cycles_200_step,
  voltage_cycles_300_step,
  voltage_cycles_400_step,
  voltage_cycles_500_step,
  voltage_cycles_600_step,
  voltage_cycles_700_step,
  voltage_cycles_800_step,
  voltage_cycles_900_step,
  voltage_cycles_1000_step,
  voltage_cycles_1100_step,
  charge_capacity_cycles_100_step,
  charge_capacity_cycles_200_step,
  charge_capacity_cycles_300_step,
  charge_capacity_cycles_400_step,
  charge_capacity_cycles_500_step,
  charge_capacity_cycles_600_step,
  charge_capacity_cycles_700_step,
  charge_capacity_cycles_800_step,
  charge_capacity_cycles_900_step,
  charge_capacity_cycles_1000_step,
  charge_capacity_cycles_1100_step,
  discharge_capacity_cycles_100_step,
  discharge_capacity_cycles_200_step,
  discharge_capacity_cycles_300_step,
  discharge_capacity_cycles_400_step,
  discharge_capacity_cycles_500_step,
  discharge_capacity_cycles_600_step,
  discharge_capacity_cycles_700_step,
  discharge_capacity_cycles_800_step,
  discharge_capacity_cycles_900_step,
  discharge_capacity_cycles_1000_step,
  discharge_capacity_cycles_1100_step,
  battery_cell_name_id,
}) => {
  return (
    <div>
      <Plot
        divId="VoltageByCycleStepsGraph"
        data={[
          {
            type: 'line',
            x: charge_capacity_cycles_100_step,
            y: voltage_cycles_100_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 100`,
            name: `${battery_cell_name_id} c: 100`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_100_step,
            y: voltage_cycles_100_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 100`,
            name: `${battery_cell_name_id} d: 100`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_200_step,
            y: voltage_cycles_200_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 200`,
            name: `${battery_cell_name_id} c: 200`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_200_step,
            y: voltage_cycles_200_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 200`,
            name: `${battery_cell_name_id} d: 200`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_300_step,
            y: voltage_cycles_300_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 300`,
            name: `${battery_cell_name_id} c: 300`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_300_step,
            y: voltage_cycles_300_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 300`,
            name: `${battery_cell_name_id} d: 300`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_400_step,
            y: voltage_cycles_400_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 400`,
            name: `${battery_cell_name_id} c: 400`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_400_step,
            y: voltage_cycles_400_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 400`,
            name: `${battery_cell_name_id} d: 400`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_500_step,
            y: voltage_cycles_500_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 500`,
            name: `${battery_cell_name_id} c: 500`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_500_step,
            y: voltage_cycles_500_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 500`,
            name: `${battery_cell_name_id} d: 500`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_600_step,
            y: voltage_cycles_600_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 600`,
            name: `${battery_cell_name_id} c: 600`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_600_step,
            y: voltage_cycles_600_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 600`,
            name: `${battery_cell_name_id} d: 600`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_700_step,
            y: voltage_cycles_700_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 700`,
            name: `${battery_cell_name_id} c: 700`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_700_step,
            y: voltage_cycles_700_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 700`,
            name: `${battery_cell_name_id} d: 700`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_800_step,
            y: voltage_cycles_800_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 800`,
            name: `${battery_cell_name_id} c: 800`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_800_step,
            y: voltage_cycles_800_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 800`,
            name: `${battery_cell_name_id} d: 800`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_900_step,
            y: voltage_cycles_900_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 900`,
            name: `${battery_cell_name_id} c: 900`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_900_step,
            y: voltage_cycles_900_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 900`,
            name: `${battery_cell_name_id} d: 900`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_1000_step,
            y: voltage_cycles_1000_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 1000`,
            name: `${battery_cell_name_id} c: 1000`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_1000_step,
            y: voltage_cycles_1000_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 1000`,
            name: `${battery_cell_name_id} d: 1000`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_1100_step,
            y: voltage_cycles_1100_step,
            // marker: { color: 'blue' },
            text: `${battery_cell_name_id} c: 1100`,
            name: `${battery_cell_name_id} c: 1100`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_1100_step,
            y: voltage_cycles_1100_step,
            // marker: { color: 'red' },
            text: `${battery_cell_name_id} d: 1100`,
            name: `${battery_cell_name_id} d: 1100`,
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
