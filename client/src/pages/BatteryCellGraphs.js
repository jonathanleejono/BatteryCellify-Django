import { Button, Container, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Page from 'components/Page';
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsThunk';
import { handleChange } from 'features/csv-data/csvDataSlice';
import { getCycleData, getTimeSeriesData } from 'features/csv-data/csvDataThunk';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CycleDecayGraph from 'sections/battery-cell-graphs/CycleDecayGraph';
import EfficenciesGraph from 'sections/battery-cell-graphs/EfficenciesGraph';
import TimeSeriesDecayGraph from 'sections/battery-cell-graphs/TimeSeriesDecayGraph';
import VoltageByCycleStepsGraph from 'sections/battery-cell-graphs/VoltageByCycleStepsGraph';

export default function BatteryCellGraphs() {
  const dispatch = useDispatch();

  const { all_battery_cells } = useSelector((store) => store.allBatteryCells);

  const {
    isLoading,
    selectedBatteryCell,
    all_cycle_numbers,
    cycle_discharge_capacity_ah_list,
    cycle_discharge_energy_wh_list,
    energy_efficiency,
    coulombic_efficiency,
    cycle_numbers_capacity,
    cycle_numbers_energy,
    test_time_seconds_list,
    time_series_discharge_capacity_ah_list,
    time_series_discharge_energy_wh_list,
    voltage_cycle_steps,
    charge_capacity_cycles_steps,
    discharge_capacity_cycles_steps,
  } = useSelector((store) => store.csvData);

  console.log('voltage_cycle_stepsg:  ', voltage_cycle_steps);

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch]);

  const handleSelect = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({ name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBatteryCell) {
      return toast.error('No Battery Cell Selected');
    }

    dispatch(getCycleData(selectedBatteryCell.id));
    dispatch(getTimeSeriesData(selectedBatteryCell.id));
  };

  return (
    <Page title="Battery Cell Graphs">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Battery Cell Graphs
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3} mb={5}>
            <TextField
              select
              name="selectedBatteryCell"
              value={selectedBatteryCell}
              onChange={handleSelect}
              label="Select Battery Cell"
            >
              {all_battery_cells.map((option) => (
                <MenuItem key={option.id} value={option}>
                  {option.cell_name_id}
                </MenuItem>
              ))}
            </TextField>
            <Button fullWidth size="large" variant="contained" type="submit" disabled={isLoading} ml={5}>
              Get Data
            </Button>
          </Stack>
        </form>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12} xl={6}>
            <CycleDecayGraph
              all_cycle_numbers={all_cycle_numbers}
              cycle_discharge_capacity_ah_list={cycle_discharge_capacity_ah_list}
              cycle_discharge_energy_wh_list={cycle_discharge_energy_wh_list}
              battery_cell_name_id={selectedBatteryCell.cell_name_id}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <EfficenciesGraph
              cycle_numbers_capacity={cycle_numbers_capacity}
              cycle_numbers_energy={cycle_numbers_energy}
              energy_efficiency={energy_efficiency}
              coulombic_efficiency={coulombic_efficiency}
              battery_cell_name_id={selectedBatteryCell.cell_name_id}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <TimeSeriesDecayGraph
              test_time_seconds_list={test_time_seconds_list}
              time_series_discharge_capacity_ah_list={time_series_discharge_capacity_ah_list}
              time_series_discharge_energy_wh_list={time_series_discharge_energy_wh_list}
              battery_cell_name_id={selectedBatteryCell.cell_name_id}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <VoltageByCycleStepsGraph
              voltage_cycle_steps={voltage_cycle_steps}
              charge_capacity_cycles_steps={charge_capacity_cycles_steps}
              discharge_capacity_cycles_steps={discharge_capacity_cycles_steps}
              battery_cell_name_id={selectedBatteryCell.cell_name_id}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
