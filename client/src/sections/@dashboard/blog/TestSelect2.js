import PropTypes from 'prop-types';
// material
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

TestSelect.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
};

export default function TestSelect({ options, onSort, value }) {
  return (
    <TextField select size="small" value={value} onChange={onSort}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
