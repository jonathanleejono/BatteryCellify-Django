import { useRef, useState } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider, resetForm } from 'formik';

// material
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
// component
import Iconify from '../../../components/Iconify';
import { deleteBatteryCell, setEditBatteryCell } from '../../../features/batteryCell/batteryCellSlice';

// ----------------------------------------------------------------------

export default function BatteryCellMoreMenu(
  id,
  cellNameId,
  cycles,
  cathode,
  anode,
  capacityAh,
  type,
  source,
  temperatureC,
  maxStateOfCharge,
  minStateOfCharge,
  depthOfDischarge,
  chargeCapacityRate,
  dischargeCapacityRate
) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    console.log(id);
    dispatch(deleteBatteryCell(id));
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={RouterLink}
          to="/app/edit-battery-cell"
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            dispatch(
              setEditBatteryCell({
                id,
                cellNameId,
                cycles,
                cathode,
                anode,
                capacityAh,
                type,
                source,
                temperatureC,
                maxStateOfCharge,
                minStateOfCharge,
                depthOfDischarge,
                chargeCapacityRate,
                dischargeCapacityRate,
              })
            );
          }}
        >
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
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
          <DialogContentText id="alert-dialog-description">{JSON.stringify(id)}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              handleDelete(id.id);
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
