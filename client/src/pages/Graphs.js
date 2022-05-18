import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button, Stack, TextField, MenuItem } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import CycleDecayGraph from '../components/graphs/CycleDecayGraph';
import TimeSeriesDecayGraph from '../components/graphs/TimeSeriesDecayGraph';
import EfficenciesGraph from '../components/graphs/EfficenciesGraph';
import VoltageByCycleStepsGraph from '../components/graphs/VoltageByCycleStepsGraph';

import { getAllBatteryCells } from '../features/allBatteryCells/allBatteryCellsSlice';
import { clearValues, handleChange, getCycleData, getTimeSeriesData } from '../features/csvData/csvDataSlice';
// ----------------------------------------------------------------------

export default function Graphs() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const { batteryCells } = useSelector((store) => store.allBatteryCells);

  const {
    isLoading,
    selectedBatteryCell,
    cycleNumbers,
    cycleDischargeCapacityAh,
    cycleDischargeEnergyWh,
    energyEfficiency,
    coulombicEfficiency,
    cycleNumbersAdjustedCapacity,
    cycleNumbersAdjustedEnergy,
    testTime,
    timeSeriesDischargeCapacityAh,
    timeSeriesDischargeEnergyWh,
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
              {batteryCells.map((option) => (
                <MenuItem key={option.id} value={option}>
                  {option.cellNameId}
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
              cycleNumbers={cycleNumbers}
              cycleDischargeCapacityAh={cycleDischargeCapacityAh}
              cycleDischargeEnergyWh={cycleDischargeEnergyWh}
              batteryCellNameId={selectedBatteryCell.cellNameId}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <EfficenciesGraph
              cycleNumbersAdjustedCapacity={cycleNumbersAdjustedCapacity}
              cycleNumbersAdjustedEnergy={cycleNumbersAdjustedEnergy}
              energyEfficiency={energyEfficiency}
              coulombicEfficiency={coulombicEfficiency}
              batteryCellNameId={selectedBatteryCell.cellNameId}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <TimeSeriesDecayGraph
              testTime={testTime}
              timeSeriesDischargeCapacityAh={timeSeriesDischargeCapacityAh}
              timeSeriesDischargeEnergyWh={timeSeriesDischargeEnergyWh}
              batteryCellNameId={selectedBatteryCell.cellNameId}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <VoltageByCycleStepsGraph
              voltageCycles100Step={voltageCycles100Step}
              voltageCycles200Step={voltageCycles200Step}
              voltageCycles300Step={voltageCycles300Step}
              voltageCycles400Step={voltageCycles400Step}
              voltageCycles500Step={voltageCycles500Step}
              voltageCycles600Step={voltageCycles600Step}
              voltageCycles700Step={voltageCycles700Step}
              voltageCycles800Step={voltageCycles800Step}
              voltageCycles900Step={voltageCycles900Step}
              voltageCycles1000Step={voltageCycles1000Step}
              voltageCycles1100Step={voltageCycles1100Step}
              chargeCapacityCycles100Step={chargeCapacityCycles100Step}
              chargeCapacityCycles200Step={chargeCapacityCycles200Step}
              chargeCapacityCycles300Step={chargeCapacityCycles300Step}
              chargeCapacityCycles400Step={chargeCapacityCycles400Step}
              chargeCapacityCycles500Step={chargeCapacityCycles500Step}
              chargeCapacityCycles600Step={chargeCapacityCycles600Step}
              chargeCapacityCycles700Step={chargeCapacityCycles700Step}
              chargeCapacityCycles800Step={chargeCapacityCycles800Step}
              chargeCapacityCycles900Step={chargeCapacityCycles900Step}
              chargeCapacityCycles1000Step={chargeCapacityCycles1000Step}
              chargeCapacityCycles1100Step={chargeCapacityCycles1100Step}
              dischargeCapacityCycles100Step={dischargeCapacityCycles100Step}
              dischargeCapacityCycles200Step={dischargeCapacityCycles200Step}
              dischargeCapacityCycles300Step={dischargeCapacityCycles300Step}
              dischargeCapacityCycles400Step={dischargeCapacityCycles400Step}
              dischargeCapacityCycles500Step={dischargeCapacityCycles500Step}
              dischargeCapacityCycles600Step={dischargeCapacityCycles600Step}
              dischargeCapacityCycles700Step={dischargeCapacityCycles700Step}
              dischargeCapacityCycles800Step={dischargeCapacityCycles800Step}
              dischargeCapacityCycles900Step={dischargeCapacityCycles900Step}
              dischargeCapacityCycles1000Step={dischargeCapacityCycles1000Step}
              dischargeCapacityCycles1100Step={dischargeCapacityCycles1100Step}
              batteryCellNameId={selectedBatteryCell.cellNameId}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
