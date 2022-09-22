import { Button, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { anodeOptions, cathodeOptions, sourceOptions, typeOptions } from 'constants/options';
import { clearFilters, handleChangeAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsSlice';
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsThunk';
import { handleToastErrors } from 'notifications/toast';
import { useDispatch, useSelector } from 'react-redux';

export default function AllBatteryCellsFilters() {
  const dispatch = useDispatch();

  const { cathode, anode, type, source } = useSelector((store) => store.allBatteryCells);

  const handleSearch = async (event) => {
    const { name, value } = event.target;
    dispatch(handleChangeAllBatteryCells({ name, value }));

    const resultAction = await dispatch(getAllBatteryCells());
    handleToastErrors(resultAction, getAllBatteryCells, 'Error fetching battery cells');
  };

  return (
    <Grid item xs={12} md={8}>
      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
            Cathode:
          </Typography>
          <TextField select size="small" name="cathode" value={cathode} onChange={handleSearch}>
            {cathodeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
            Anode:
          </Typography>
          <TextField select size="small" name="anode" value={anode} onChange={handleSearch}>
            {anodeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
            Type:
          </Typography>
          <TextField select size="small" name="type" value={type} onChange={handleSearch}>
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
            Source:
          </Typography>
          <TextField select size="small" name="source" value={source} onChange={handleSearch}>
            {sourceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(clearFilters());
            dispatch(getAllBatteryCells());
          }}
        >
          Clear Filters
        </Button>
      </Stack>
    </Grid>
  );
}
