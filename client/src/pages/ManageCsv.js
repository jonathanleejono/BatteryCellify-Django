import { Container, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import { ManageCsvForm } from 'sections/dashboard/manage-csv';

export default function ManageCsv() {
  return (
    <Page title="ManageCsv">
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
