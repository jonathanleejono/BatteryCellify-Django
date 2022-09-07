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
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsSlice';
import {
  deleteCycleData,
  deleteTimeSeriesData,
  handleChange,
  uploadCycleData,
  uploadTimeSeriesData,
} from 'features/csv-data/csvDataSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function ManageCsvForm() {
  const dispatch = useDispatch();

  const { battery_cells, search, searchCathode, searchAnode, searchType, searchSource } = useSelector(
    (store) => store.allBatteryCells
  );

  const { selectedBatteryCell, isLoading } = useSelector((store) => store.csvData);

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, search, searchCathode, searchAnode, searchType, searchSource]);

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
    formData.delete('upload_file');
    if (e.target.files) setCsvFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBatteryCell) {
      return toast.error('No Battery Cell Selected');
    }

    if (!csvFile) {
      return toast.error('No CSV File Attached');
    }

    formData.append('upload_file', csvFile);

    if (selectedCsvType === 'cycleData') {
      dispatch(uploadCycleData({ id: selectedBatteryCell.id, upload_file: formData }));
    }
    if (selectedCsvType === 'timeSeriesData') {
      dispatch(uploadTimeSeriesData({ id: selectedBatteryCell.id, upload_file: formData }));
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();

    if (!selectedBatteryCell) {
      return toast.error('No Battery Cell Selected');
    }

    if (selectedCsvType === 'cycleData') {
      dispatch(deleteCycleData(selectedBatteryCell.id));
      handleClose();
    }
    if (selectedCsvType === 'timeSeriesData') {
      dispatch(deleteTimeSeriesData(selectedBatteryCell.id));
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
          {battery_cells.map((option) => (
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
            <input type="file" hidden accept=".csv" onChange={handleFile} key="upload_file" />
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
                return toast.error('No Battery Cell Selected');
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
