// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../components/Page';
import { ManageCsvForm } from '../sections/@dashboard/manage-csv';

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
