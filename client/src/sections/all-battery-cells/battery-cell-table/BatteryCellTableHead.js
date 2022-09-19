import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import PropTypes from 'prop-types';

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

const headLabel = [
  { id: 'edit', label: 'Edit', alignRight: false },
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'cell_name_id', label: 'Cell Name Id', alignRight: false },
  { id: 'cycles', label: 'Cycles', alignRight: false },
  { id: 'cathode', label: 'Cathode', alignRight: false },
  { id: 'anode', label: 'Anode', alignRight: false },
  { id: 'capacity_ah', label: 'Capacity (Ah)', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'source', label: 'Source', alignRight: false },
  { id: 'temperature_c', label: 'Temp (C)', alignRight: false },
  { id: 'max_state_of_charge', label: 'Max SoC', alignRight: false },
  { id: 'min_state_of_charge', label: 'Min SoC', alignRight: false },
  { id: 'depth_of_discharge', label: 'DoD', alignRight: false },
  { id: 'charge_capacity_rate', label: 'Charge C Rate', alignRight: false },
  { id: 'discharge_capacity_rate', label: 'Discharge C Rate', alignRight: false },
];

BatteryCellTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export default function BatteryCellTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
