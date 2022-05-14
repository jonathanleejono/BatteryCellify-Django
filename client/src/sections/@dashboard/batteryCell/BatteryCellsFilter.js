import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// material
import { Menu, Button, MenuItem, Typography, TextField } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { handleChange, createBatteryCell } from '../../../features/batteryCell/batteryCellSlice';

// ----------------------------------------------------------------------

// const SORT_BY_OPTIONS = [
//   { value: 'featured', label: 'Featured' },
//   { value: 'newest', label: 'Newest' },
//   { value: 'priceDesc', label: 'Price: High-Low' },
//   { value: 'priceAsc', label: 'Price: Low-High' },
// ];

BatteryCellsFilter.propTypes = {
  options: PropTypes.array,
  queryParam: PropTypes.string,
};

export default function BatteryCellsFilter({ options, queryParam, queryParamName }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleBatteryCellInput = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({ name, value }));
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {queryParamName}
        </Typography>
      </Button>
      {/* <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      > */}
      <TextField
        select
        size="small"
        name={queryParam}
        value={queryParam}
        onChange={() => {
          handleBatteryCellInput();
          handleClose();
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            // selected={option.value === 'all'}
            // onClick={handleClose}
            sx={{ typography: 'body2' }}
          >
            {option.value}
          </MenuItem>
        ))}
      </TextField>
      {/* </Menu> */}
    </>
  );
}
