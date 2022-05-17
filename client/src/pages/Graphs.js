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
import CycleDecayGraph from '../components/graphs/CycleDecayGraph';

// ----------------------------------------------------------------------

export default function Graphs() {
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Graphs2
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={12} xl={6}>
            <CycleDecayGraph />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <PlotTest />
          </Grid>
          <Grid item xs={12} md={6} lg={12} xl={6}>
            <PlotTest />
          </Grid>

          <Grid item xs={12} md={6} lg={12} xl={6}>
            <PlotTest />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
