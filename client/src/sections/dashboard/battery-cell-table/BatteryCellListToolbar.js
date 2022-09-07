import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Iconify from 'components/Iconify';
import { deleteBatteryCell } from 'features/battery-cell/batteryCellSlice';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

BatteryCellListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function BatteryCellListToolbar({ numSelected, filterName, onFilterName, selected }) {
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <RootStyle
        sx={{
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search cell name id..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
        )}
        <Tooltip title="Delete">
          <IconButton
            data-cy="delete-icon"
            onClick={() => {
              if (numSelected === 0) {
                toast.error('Please Select Battery Cells');
              } else setOpenDialog(true);
            }}
          >
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      </RootStyle>
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
        <DialogTitle id="form-dialog-title"> Delete the selected battery cell(s)? </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{JSON.stringify(selected)}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            data-cy="modal-delete-confirm"
            onClick={() => {
              Object.keys(selected).forEach((id) => {
                dispatch(deleteBatteryCell(selected[id]));
              });

              handleClose();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
