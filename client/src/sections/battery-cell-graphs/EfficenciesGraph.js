import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

EfficenciesGraph.propTypes = {
  cycle_numbers_capacity: PropTypes.array,
  cycle_numbers_energy: PropTypes.array,
  energy_efficiency: PropTypes.array,
  coulombic_efficiency: PropTypes.array,
  battery_cell_name_id: PropTypes.string,
};

export default function EfficenciesGraph({
  cycle_numbers_capacity,
  cycle_numbers_energy,
  energy_efficiency,
  coulombic_efficiency,
  battery_cell_name_id,
}) {
  return (
    <div>
      <Plot
        divId="EfficenciesGraph"
        data={[
          {
            type: 'line',
            x: cycle_numbers_capacity,
            y: coulombic_efficiency,
            marker: { color: 'blue' },
            text: `ah_eff: ${battery_cell_name_id}`,
            name: `ah_eff: ${battery_cell_name_id}`,
          },
          {
            type: 'line',
            x: cycle_numbers_energy,
            y: energy_efficiency,
            marker: { color: 'red' },
            text: `wh_eff: ${battery_cell_name_id}`,
            name: `wh_eff: ${battery_cell_name_id}`,
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
}
