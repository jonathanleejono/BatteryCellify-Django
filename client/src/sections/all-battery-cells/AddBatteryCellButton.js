import { Button, Grid } from '@mui/material';
import Iconify from 'components/Iconify';
import { addBatteryCellRoute } from 'constants/routes';
import { Link as RouterLink } from 'react-router-dom';

export default function AddBatteryCellButton() {
  return (
    <Grid item xs={12} md={8}>
      <Button
        variant="contained"
        component={RouterLink}
        to={addBatteryCellRoute}
        startIcon={<Iconify icon="eva:plus-fill" />}
      >
        Add Battery Cell
      </Button>
    </Grid>
  );
}
