import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'components/Iconify';
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsThunk';
import { clearCsvState, handleChange } from 'features/csv-data/csvDataSlice';
import {
  deleteCycleData,
  deleteTimeSeriesData,
  uploadCycleData,
  uploadTimeSeriesData,
} from 'features/csv-data/csvDataThunk';
import { handleToast, handleToastErrors } from 'notifications/toast';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function ManageCsvForm() {
  const dispatch = useDispatch();

  const { all_battery_cells } = useSelector((store) => store.allBatteryCells);

  const { selectedBatteryCell, isLoading } = useSelector((store) => store.csvData);

  const handleFetchBatteryCells = useCallback(async () => {
    dispatch(clearCsvState());

    const resultAction = await dispatch(getAllBatteryCells());

    handleToastErrors(resultAction, getAllBatteryCells, 'Error fetching battery cells');
  }, [dispatch]);

  useEffect(() => {
    handleFetchBatteryCells();
  }, [handleFetchBatteryCells, dispatch]);

  const [selectedCsvType, setSelectedCsvType] = useState('cycleData');
  const [csvFile, setCsvFile] = useState('');

  const formData = new FormData();

  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSelect = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({ name, value }));
  };

  const handleFile = (e) => {
    formData.delete('file');
    if (e.target.files) setCsvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBatteryCell) {
      return toast.error('No Battery Cell Selected');
    }

    if (!csvFile) {
      return toast.error('No CSV File Attached');
    }

    formData.append('file', csvFile);

    if (selectedCsvType === 'cycleData') {
      const resultAction = await dispatch(uploadCycleData({ id: selectedBatteryCell.id, file: formData }));

      handleToast(resultAction, uploadCycleData, 'Uploaded cycle data!', 'Error uploading cycle data');
    }
    if (selectedCsvType === 'timeSeriesData') {
      const resultAction = await dispatch(uploadTimeSeriesData({ id: selectedBatteryCell.id, file: formData }));

      handleToast(resultAction, uploadTimeSeriesData, 'Uploaded time series data!', 'Error uploading time series data');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!selectedBatteryCell) {
      return toast.error('No Battery Cell Selected');
    }

    if (selectedCsvType === 'cycleData') {
      const resultAction = await dispatch(deleteCycleData(selectedBatteryCell.id));

      handleToast(resultAction, deleteCycleData, 'Deleted cycle data!', 'Error deleting cycle data');

      handleClose();
    }
    if (selectedCsvType === 'timeSeriesData') {
      const resultAction = await dispatch(deleteTimeSeriesData(selectedBatteryCell.id));

      handleToast(resultAction, deleteTimeSeriesData, 'Deleted time series data!', 'Error deleting time series data');

      handleClose();
    }
  };

  const theme = useTheme();

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          select
          name="selectedBatteryCell"
          value={selectedBatteryCell}
          onChange={handleSelect}
          label="Select Battery Cell"
        >
          {all_battery_cells.map((option) => (
            <MenuItem key={option.id} value={option}>
              {option.cell_name_id}
            </MenuItem>
          ))}
        </TextField>

        <FormControl>
          <FormLabel id="csv-radio-buttons-group-label">CSV Data Type</FormLabel>
          <RadioGroup
            aria-labelledby="csv-radio-buttons-group-label"
            defaultValue="cycleData"
            name="csv-data-type"
            onChange={(e) => {
              setSelectedCsvType(e.target.value);
            }}
          >
            <FormControlLabel value="cycleData" control={<Radio />} label="Cycle Data" />
            <FormControlLabel value="timeSeriesData" control={<Radio />} label="Time Series Data" />
          </RadioGroup>
        </FormControl>

        {csvFile ? (
          <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5} spacing={1}>
            <Iconify
              icon="eva:checkmark-circle-2-outline"
              sx={{ color: theme.palette.success.main, width: 20, height: 20 }}
            />
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              CSV File Attached: {csvFile.name}
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="flex-start" mb={5} spacing={1}>
            <Iconify icon="akar-icons:circle-x" sx={{ color: theme.palette.error.main, width: 20, height: 20 }} />
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              No CSV File Attached
            </Typography>
          </Stack>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} spacing={2}>
          <Button fullWidth size="large" variant="contained" component="label" disabled={isLoading} padding={5}>
            Attach CSV
            <input type="file" hidden accept=".csv" onChange={handleFile} key="file" />
          </Button>
          <Button fullWidth size="large" variant="contained" type="submit" disabled={isLoading} ml={5}>
            Upload CSV
          </Button>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            disabled={isLoading}
            ml={5}
            onClick={() => {
              if (!selectedBatteryCell) {
                toast.error('No Battery Cell Selected');
                return;
              }
              setOpenDialog(true);
            }}
          >
            Delete Stored CSV
          </Button>
        </Stack>
      </Stack>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          elevation: 0,
        }}
        BackdropProps={{
          style: {
            backgroundColor: alpha('#080808', 0.25),
            boxShadow: 'none',
            opacity: 50,
          },
        }}
      >
        <DialogTitle id="form-dialog-title"> Delete the stored CSV data? </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {JSON.stringify(selectedBatteryCell.cell_name_id)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
