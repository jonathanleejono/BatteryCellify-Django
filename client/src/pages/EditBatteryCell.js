import { useState } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import { EditBatteryCellForm } from '../sections/@dashboard/batteryCell';
// mock
import PRODUCTS from '../_mock/products';

// ----------------------------------------------------------------------

export default function EditBatteryCell() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

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
