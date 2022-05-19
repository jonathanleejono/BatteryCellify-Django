import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import {
  getAllBatteryCells,
  handleChangeAllBatteryCells,
  clearFilters,
} from '../features/allBatteryCells/allBatteryCellsSlice';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  const {
    totalBatteryCells,
    averageCapacity,
    averageDepthOfDischarge,
    averageTemperatureC,
    totalCathodeLCOCells,
    totalCathodeLFPCells,
    totalCathodeNCACells,
    totalCathodeNMCCells,
    totalCathodeNMCLCOCells,
    avgCyclesLC0Cells,
    avgCyclesLFPCells,
    avgCyclesNCACells,
    avgCyclesNMCCells,
    avgCyclesNMCLCOCells,
  } = useSelector((store) => store.allBatteryCells);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, totalBatteryCells, averageCapacity, averageDepthOfDischarge, averageTemperatureC]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome Back
        </Typography>

        {/* number of batteries, average capacity, average depth of discharge, average temperature */}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total No. Battery Cells"
              total={totalBatteryCells}
              icon={'ant-design:android-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Avg. Capacity (Ah)"
              total={averageCapacity}
              color="info"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Avg. Depth of Discharge"
              total={averageDepthOfDischarge}
              color="warning"
              icon={'ant-design:windows-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Avg. Temperature (C)"
              total={averageTemperatureC}
              color="error"
              icon={'ant-design:bug-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Average Cycles Per Cathode"
              // subheader="(+43%) than last year"
              chartData={[
                { label: 'LCO', value: avgCyclesLC0Cells },
                { label: 'LFP', value: avgCyclesLFPCells },
                { label: 'NCA', value: avgCyclesNCACells },
                { label: 'NMC', value: avgCyclesNMCCells },
                { label: 'NMC-LCO', value: avgCyclesNMCLCOCells },
              ]}
            />
          </Grid>

          {/* the type */}

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Battery Cell Cathodes"
              chartData={[
                { label: 'LCO', value: totalCathodeLCOCells },
                { label: 'LFP', value: totalCathodeLFPCells },
                { label: 'NCA', value: totalCathodeNCACells },
                { label: 'NMC', value: totalCathodeNMCCells },
                { label: 'NMC-LCO', value: totalCathodeNMCLCOCells },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.green[0],
                theme.palette.chart.red[0],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
