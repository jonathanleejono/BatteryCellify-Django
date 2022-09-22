import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

CycleDecayGraph.propTypes = {
  all_cycle_numbers: PropTypes.array,
  cycle_discharge_capacity_ah_list: PropTypes.array,
  cycle_discharge_energy_wh_list: PropTypes.array,
  battery_cell_name_id: PropTypes.string,
};

export default function CycleDecayGraph({
  all_cycle_numbers,
  cycle_discharge_capacity_ah_list,
  cycle_discharge_energy_wh_list,
  battery_cell_name_id,
}) {
  return (
    <div>
      <Plot
        divId="CycleDecayGraph"
        data={[
          {
            type: 'line',
            x: all_cycle_numbers,
            y: cycle_discharge_capacity_ah_list,
            marker: { color: 'blue' },
            text: `ah_d: ${battery_cell_name_id}`,
            name: `ah_d: ${battery_cell_name_id}`,
          },
          {
            type: 'line',
            x: all_cycle_numbers,
            y: cycle_discharge_energy_wh_list,
            marker: { color: 'red' },
            text: `wh_d: ${battery_cell_name_id}`,
            name: `wh_d: ${battery_cell_name_id}`,
          },
        ]}
        // -------------------------------------------------
        layout={{
          autosize: true,
          title: 'Cycle Number Data - Energy and Capacity Decay',
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
}
