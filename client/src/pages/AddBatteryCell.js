import { Container, Typography } from '@mui/material';
import Page from 'components/Page';
import { AddBatteryCellForm } from 'sections/dashboard/battery-cell-form';

export default function AddBatteryCell() {
  return (
    <Page title="Add Battery Cell">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add Battery Cell
        </Typography>

        <AddBatteryCellForm />
      </Container>
    </Page>
  );
}
