import { Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Page from 'components/Page';
import { getAllBatteryCells, getAllBatteryCellsStats } from 'features/all-battery-cells/allBatteryCellsThunk';
import { handleToastErrors } from 'notifications/toast';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HorizontalBarChart from 'sections/dashboard/app/HorizontalBarChart';
import PieChart from 'sections/dashboard/app/PieChart';
import StatsCard from 'sections/dashboard/app/StatsCard';

export default function DashboardApp() {
  const theme = useTheme();

  const { all_battery_cells, avg_capacity_ah, avg_depth_of_discharge, avg_temperature_c, cell_stats_by_cathode } =
    useSelector((store) => store.allBatteryCells);

  const dispatch = useDispatch();

  const handleFetchBatteryCells = useCallback(async () => {
    const resultAction = await dispatch(getAllBatteryCells());

    handleToastErrors(resultAction, getAllBatteryCells, 'Error fetching battery cells');

    const resultActionStats = await dispatch(getAllBatteryCellsStats());

    handleToastErrors(resultActionStats, getAllBatteryCellsStats, 'Error fetching battery cells stats');
  }, [dispatch]);

  useEffect(() => {
    handleFetchBatteryCells();
  }, [handleFetchBatteryCells, dispatch]);

  let avg_cycles_lco_cells = 0;
  let avg_cycles_lfp_cells = 0;
  let avg_cycles_nca_cells = 0;
  let avg_cycles_nmc_cells = 0;
  let avg_cycles_nmclco_cells = 0;

  let total_cathode_lco_cells = 0;
  let total_cathode_lfp_cells = 0;
  let total_cathode_nca_cells = 0;
  let total_cathode_nmc_cells = 0;
  let total_cathode_nmclco_cells = 0;

  Object.keys(cell_stats_by_cathode).forEach((_, index) => {
    const cathodeType = cell_stats_by_cathode[index].cathode;
    const cyclesAvg = cell_stats_by_cathode[index].avg;
    const cathodeTotal = cell_stats_by_cathode[index].total;

    switch (cathodeType) {
      case 'LCO':
        avg_cycles_lco_cells = cyclesAvg;
        total_cathode_lco_cells = cathodeTotal;
        break;
      case 'LFP':
        avg_cycles_lfp_cells = cyclesAvg;
        total_cathode_lfp_cells = cathodeTotal;
        break;
      case 'NCA':
        avg_cycles_nca_cells = cyclesAvg;
        total_cathode_nca_cells = cathodeTotal;
        break;
      case 'NMC':
        avg_cycles_nmc_cells = cyclesAvg;
        total_cathode_nmc_cells = cathodeTotal;
        break;
      case 'NMC-LCO':
        avg_cycles_nmclco_cells = cyclesAvg;
        total_cathode_nmclco_cells = cathodeTotal;
        break;
      default:
        avg_cycles_lco_cells = 0;
        avg_cycles_lfp_cells = 0;
        avg_cycles_nca_cells = 0;
        avg_cycles_nmc_cells = 0;
        avg_cycles_nmclco_cells = 0;

        total_cathode_lco_cells = 0;
        total_cathode_lfp_cells = 0;
        total_cathode_nca_cells = 0;
        total_cathode_nmc_cells = 0;
        total_cathode_nmclco_cells = 0;
    }
  });

  const totalBatteryCells = all_battery_cells ? all_battery_cells.length : 0;

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total No. Battery Cells"
              total={totalBatteryCells}
              icon={'ic:round-battery-charging-full'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg. Capacity (Ah)"
              total={avg_capacity_ah}
              color="info"
              icon={'ic:baseline-battery-3-bar'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg. Depth of Discharge"
              total={avg_depth_of_discharge}
              color="warning"
              icon={'carbon:observed-lightning'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg. Temperature (C)"
              total={avg_temperature_c}
              color="error"
              icon={'bi:thermometer-half'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <HorizontalBarChart
              title="Average Cycles Per Cathode"
              chartData={[
                { label: 'LCO', value: avg_cycles_lco_cells },
                { label: 'LFP', value: avg_cycles_lfp_cells },
                { label: 'NCA', value: avg_cycles_nca_cells },
                { label: 'NMC', value: avg_cycles_nmc_cells },
                { label: 'NMC-LCO', value: avg_cycles_nmclco_cells },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <PieChart
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
