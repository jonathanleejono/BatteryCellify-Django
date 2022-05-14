import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// material
import { MenuItem, TextField } from '@mui/material';
import { handleChange, createBatteryCell } from '../../../features/batteryCell/batteryCellSlice';
//
// import { useDispatch, useSelector } from 'react-redux';
// import { handleChange, createBatteryCell } from '../../../features/batteryCell/batteryCellSlice';

// ----------------------------------------------------------------------

BatteryCellsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
  queryParam: PropTypes.string,
};

export default function BatteryCellsSort({ options, onSort, queryParam }) {
  const dispatch = useDispatch();
  const handleBatteryCellInput = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({ name, value }));
  };
  return (
    <TextField select size="small" name={queryParam} value={queryParam} onChange={handleBatteryCellInput}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.value}
        </MenuItem>
      ))}
    </TextField>
  );
}
