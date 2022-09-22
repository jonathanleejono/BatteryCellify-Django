import { Container, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import ManageCsvForm from 'sections/manage-csv/ManageCsvForm';

export default function ManageCsv() {
  return (
    <Page title="Manage Csv">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Manage CSV
          </Typography>
        </Stack>
        <ManageCsvForm />
      </Container>
    </Page>
  );
}
