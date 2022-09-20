import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

VoltageByCycleStepsGraph.propTypes = {
  voltage_cycle_steps: PropTypes.object,
  charge_capacity_cycles_steps: PropTypes.object,
  discharge_capacity_cycles_steps: PropTypes.object,
  battery_cell_name_id: PropTypes.string,
};

export default function VoltageByCycleStepsGraph({
  voltage_cycle_steps,
  charge_capacity_cycles_steps,
  discharge_capacity_cycles_steps,
  battery_cell_name_id,
}) {
  return (
    <div>
      <Plot
        divId="VoltageByCycleStepsGraph"
        data={[
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_100,
            y: voltage_cycle_steps.steps_100,
            text: `${battery_cell_name_id} c: 100`,
            name: `${battery_cell_name_id} c: 100`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_100,
            y: voltage_cycle_steps.steps_100,
            text: `${battery_cell_name_id} d: 100`,
            name: `${battery_cell_name_id} d: 100`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_200,
            y: voltage_cycle_steps.steps_200,
            text: `${battery_cell_name_id} c: 200`,
            name: `${battery_cell_name_id} c: 200`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_200,
            y: voltage_cycle_steps.steps_200,
            text: `${battery_cell_name_id} d: 200`,
            name: `${battery_cell_name_id} d: 200`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_300,
            y: voltage_cycle_steps.steps_300,
            text: `${battery_cell_name_id} c: 300`,
            name: `${battery_cell_name_id} c: 300`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_300,
            y: voltage_cycle_steps.steps_300,
            text: `${battery_cell_name_id} d: 300`,
            name: `${battery_cell_name_id} d: 300`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_400,
            y: voltage_cycle_steps.steps_400,
            text: `${battery_cell_name_id} c: 400`,
            name: `${battery_cell_name_id} c: 400`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_400,
            y: voltage_cycle_steps.steps_400,
            text: `${battery_cell_name_id} d: 400`,
            name: `${battery_cell_name_id} d: 400`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_500,
            y: voltage_cycle_steps.steps_500,
            text: `${battery_cell_name_id} c: 500`,
            name: `${battery_cell_name_id} c: 500`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_500,
            y: voltage_cycle_steps.steps_500,
            text: `${battery_cell_name_id} d: 500`,
            name: `${battery_cell_name_id} d: 500`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_600,
            y: voltage_cycle_steps.steps_600,
            text: `${battery_cell_name_id} c: 600`,
            name: `${battery_cell_name_id} c: 600`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_600,
            y: voltage_cycle_steps.steps_600,
            text: `${battery_cell_name_id} d: 600`,
            name: `${battery_cell_name_id} d: 600`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_700,
            y: voltage_cycle_steps.steps_700,
            text: `${battery_cell_name_id} c: 700`,
            name: `${battery_cell_name_id} c: 700`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_700,
            y: voltage_cycle_steps.steps_700,
            text: `${battery_cell_name_id} d: 700`,
            name: `${battery_cell_name_id} d: 700`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_800,
            y: voltage_cycle_steps.steps_800,
            text: `${battery_cell_name_id} c: 800`,
            name: `${battery_cell_name_id} c: 800`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_800,
            y: voltage_cycle_steps.steps_800,
            text: `${battery_cell_name_id} d: 800`,
            name: `${battery_cell_name_id} d: 800`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_900,
            y: voltage_cycle_steps.steps_900,
            text: `${battery_cell_name_id} c: 900`,
            name: `${battery_cell_name_id} c: 900`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_900,
            y: voltage_cycle_steps.steps_900,
            text: `${battery_cell_name_id} d: 900`,
            name: `${battery_cell_name_id} d: 900`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_1000,
            y: voltage_cycle_steps.steps_1000,
            text: `${battery_cell_name_id} c: 1000`,
            name: `${battery_cell_name_id} c: 1000`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_1000,
            y: voltage_cycle_steps.steps_1000,
            text: `${battery_cell_name_id} d: 1000`,
            name: `${battery_cell_name_id} d: 1000`,
          },
          {
            type: 'line',
            x: charge_capacity_cycles_steps.steps_1100,
            y: voltage_cycle_steps.steps_1100,
            text: `${battery_cell_name_id} c: 1100`,
            name: `${battery_cell_name_id} c: 1100`,
          },
          {
            type: 'line',
            x: discharge_capacity_cycles_steps.steps_1100,
            y: voltage_cycle_steps.steps_1100,
            text: `${battery_cell_name_id} d: 1100`,
            name: `${battery_cell_name_id} d: 1100`,
          },
        ]}
        // -------------------------------------------------
        layout={{
          autosize: true,
          title: { text: 'Cycle Quantities By Step' },
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
          // optionally use a legend
          // legend: {
          //   orientation: 'h',
          //   yanchor: 'top',
          //   y: -1,
          //   xanchor: 'right',
          //   x: 1,
          // },
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
}
