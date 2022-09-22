import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

TimeSeriesDecayGraph.propTypes = {
  test_time_seconds_list: PropTypes.array,
  time_series_discharge_capacity_ah_list: PropTypes.array,
  time_series_discharge_energy_wh_list: PropTypes.array,
  battery_cell_name_id: PropTypes.string,
};

export default function TimeSeriesDecayGraph({
  test_time_seconds_list,
  time_series_discharge_capacity_ah_list,
  time_series_discharge_energy_wh_list,
  battery_cell_name_id,
}) {
  return (
    <div>
      <Plot
        divId="TimeSeriesDecayGraph"
        data={[
          {
            type: 'scatter',
            x: test_time_seconds_list,
            y: time_series_discharge_capacity_ah_list,
            mode: 'markers',
            marker: { color: 'blue' },
            text: `ah_d: ${battery_cell_name_id}`,
            name: `ah_d: ${battery_cell_name_id}`,
          },
          {
            type: 'scatter',
            x: test_time_seconds_list,
            y: time_series_discharge_energy_wh_list,
            mode: 'markers',
            marker: { color: 'red' },
            text: `wh_d: ${battery_cell_name_id}`,
            name: `wh_d: ${battery_cell_name_id}`,
          },
        ]}
        // -------------------------------------------------
        layout={{
          autosize: true,
          title: 'Time Series - Data Energy and Capacity Decay',
          font: {
            family: 'Public Sans, sans-serif',
          },
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
}
