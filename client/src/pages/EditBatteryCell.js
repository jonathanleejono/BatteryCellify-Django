import { useState } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { EditBatteryCellForm } from '../sections/@dashboard/batteryCell';

// ----------------------------------------------------------------------

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
