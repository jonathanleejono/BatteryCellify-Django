import { Button, Container, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Page from 'components/Page';
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsSlice';
import { getCycleData, getTimeSeriesData, handleChange } from 'features/csv-data/csvDataSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CycleDecayGraph from 'sections/dashboard/battery-cell-graphs/CycleDecayGraph';
import EfficenciesGraph from 'sections/dashboard/battery-cell-graphs/EfficenciesGraph';
import TimeSeriesDecayGraph from 'sections/dashboard/battery-cell-graphs/TimeSeriesDecayGraph';
import VoltageByCycleStepsGraph from 'sections/dashboard/battery-cell-graphs/VoltageByCycleStepsGraph';

export default function Graphs() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { battery_cells } = useSelector((store) => store.allBatteryCells);

  const {
    isLoading,
    selectedBatteryCell,
    cycle_numbers,
    cycle_discharge_capacity_ah,
    cycle_discharge_energy_wh,
    energy_efficiency,
    coulombic_efficiency,
    cycle_numbers_capacity,
    cycle_numbers_energy,
    test_time_seconds,
    time_series_discharge_capacity_ah,
    time_series_discharge_energy_wh,
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
  } = useSelector((store) => store.csvData);

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
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Graphs
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
              {battery_cells.map((option) => (
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
              cycle_numbers={cycle_numbers}
              cycle_discharge_capacity_ah={cycle_discharge_capacity_ah}
              cycle_discharge_energy_wh={cycle_discharge_energy_wh}
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
              test_time_seconds={test_time_seconds}
              time_series_discharge_capacity_ah={time_series_discharge_capacity_ah}
              time_series_discharge_energy_wh={time_series_discharge_energy_wh}
              battery_cell_name_id={selectedBatteryCell.cell_name_id}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <VoltageByCycleStepsGraph
              voltage_cycles_100_step={voltage_cycles_100_step}
              voltage_cycles_200_step={voltage_cycles_200_step}
              voltage_cycles_300_step={voltage_cycles_300_step}
              voltage_cycles_400_step={voltage_cycles_400_step}
              voltage_cycles_500_step={voltage_cycles_500_step}
              voltage_cycles_600_step={voltage_cycles_600_step}
              voltage_cycles_700_step={voltage_cycles_700_step}
              voltage_cycles_800_step={voltage_cycles_800_step}
              voltage_cycles_900_step={voltage_cycles_900_step}
              voltage_cycles_1000_step={voltage_cycles_1000_step}
              voltage_cycles_1100_step={voltage_cycles_1100_step}
              charge_capacity_cycles_100_step={charge_capacity_cycles_100_step}
              charge_capacity_cycles_200_step={charge_capacity_cycles_200_step}
              charge_capacity_cycles_300_step={charge_capacity_cycles_300_step}
              charge_capacity_cycles_400_step={charge_capacity_cycles_400_step}
              charge_capacity_cycles_500_step={charge_capacity_cycles_500_step}
              charge_capacity_cycles_600_step={charge_capacity_cycles_600_step}
              charge_capacity_cycles_700_step={charge_capacity_cycles_700_step}
              charge_capacity_cycles_800_step={charge_capacity_cycles_800_step}
              charge_capacity_cycles_900_step={charge_capacity_cycles_900_step}
              charge_capacity_cycles_1000_step={charge_capacity_cycles_1000_step}
              charge_capacity_cycles_1100_step={charge_capacity_cycles_1100_step}
              discharge_capacity_cycles_100_step={discharge_capacity_cycles_100_step}
              discharge_capacity_cycles_200_step={discharge_capacity_cycles_200_step}
              discharge_capacity_cycles_300_step={discharge_capacity_cycles_300_step}
              discharge_capacity_cycles_400_step={discharge_capacity_cycles_400_step}
              discharge_capacity_cycles_500_step={discharge_capacity_cycles_500_step}
              discharge_capacity_cycles_600_step={discharge_capacity_cycles_600_step}
              discharge_capacity_cycles_700_step={discharge_capacity_cycles_700_step}
              discharge_capacity_cycles_800_step={discharge_capacity_cycles_800_step}
              discharge_capacity_cycles_900_step={discharge_capacity_cycles_900_step}
              discharge_capacity_cycles_1000_step={discharge_capacity_cycles_1000_step}
              discharge_capacity_cycles_1100_step={discharge_capacity_cycles_1100_step}
              battery_cell_name_id={selectedBatteryCell.cell_name_id}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
