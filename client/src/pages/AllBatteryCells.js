import { Container, Grid } from '@mui/material';
import Page from 'components/Page';
import AddBatteryCellButton from 'sections/all-battery-cells/AddBatteryCellButton';
import AllBatteryCellsFilters from 'sections/all-battery-cells/AllBatteryCellsFilters';
import AllBatteryCellsHeader from 'sections/all-battery-cells/AllBatteryCellsHeader';
import BatteryCellTable from 'sections/all-battery-cells/battery-cell-table/BatteryCellTable';

export default function AllBatteryCells() {
  return (
    <Page title="All Battery Cells">
      <Container>
        <AllBatteryCellsHeader />

        <Grid container spacing={3}>
          <AddBatteryCellButton />
          <AllBatteryCellsFilters />
        </Grid>

        <BatteryCellTable />
      </Container>
    </Page>
  );
}
