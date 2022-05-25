import { useState } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { AddBatteryCellForm } from '../sections/@dashboard/batteryCell';

// ----------------------------------------------------------------------

export default function AddBatteryCell() {
  return (
    <Page title="Dashboard: Products">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add Battery Cell
        </Typography>

        <AddBatteryCellForm />
      </Container>
    </Page>
  );
}
