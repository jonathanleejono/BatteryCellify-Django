import { Container, Typography } from '@mui/material';
import Page from 'components/Page';
import { EditBatteryCellForm } from 'sections/dashboard/battery-cell-form';

export default function EditBatteryCell() {
  return (
    <Page title="Dashboard: Products">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Edit Battery Cell
        </Typography>

        <EditBatteryCellForm />
      </Container>
    </Page>
  );
}
