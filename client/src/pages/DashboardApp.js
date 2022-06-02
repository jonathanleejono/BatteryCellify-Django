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
    total_battery_cells,
    avg_capacity,
    avg_depth_of_discharge,
    avg_temperature_c,
    total_cathode_lco_cells,
    total_cathode_lfp_cells,
    total_cathode_nca_cells,
    total_cathode_nmc_cells,
    total_cathode_nmclco_cells,
    avg_cycles_lco_cells,
    avg_cycles_lfp_cells,
    avg_cycles_nca_cells,
    avg_cycles_nmc_cells,
    avg_cycles_nmclco_cells,
  } = useSelector((store) => store.allBatteryCells);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, total_battery_cells, avg_capacity, avg_depth_of_discharge, avg_temperature_c]);

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
              total={total_battery_cells}
              icon={'ic:round-battery-charging-full'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Avg. Capacity (Ah)"
              total={avg_capacity}
              color="info"
              icon={'ic:baseline-battery-3-bar'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Avg. Depth of Discharge"
              total={avg_depth_of_discharge}
              color="warning"
              icon={'carbon:observed-lightning'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Avg. Temperature (C)"
              total={avg_temperature_c}
              color="error"
              icon={'bi:thermometer-half'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Average Cycles Per Cathode"
              // subheader="(+43%) than last year"
              chartData={[
                { label: 'LCO', value: avg_cycles_lco_cells },
                { label: 'LFP', value: avg_cycles_lfp_cells },
                { label: 'NCA', value: avg_cycles_nca_cells },
                { label: 'NMC', value: avg_cycles_nmc_cells },
                { label: 'NMC-LCO', value: avg_cycles_nmclco_cells },
              ]}
            />
          </Grid>

          {/* the cathode */}

          <Grid item xs={12} md={6} lg={6}>
            <AppCurrentVisits
              title="Battery Cell Cathodes"
              chartData={[
                { label: 'LCO', value: total_cathode_lco_cells },
                { label: 'LFP', value: total_cathode_lfp_cells },
                { label: 'NCA', value: total_cathode_nca_cells },
                { label: 'NMC', value: total_cathode_nmc_cells },
                { label: 'NMC-LCO', value: total_cathode_nmclco_cells },
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
