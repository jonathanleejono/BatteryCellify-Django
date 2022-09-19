import { Stack, Typography } from '@mui/material';

export default function AllBatteryCellsHeader() {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h4" gutterBottom>
        Battery Cell List
      </Typography>
    </Stack>
  );
}
