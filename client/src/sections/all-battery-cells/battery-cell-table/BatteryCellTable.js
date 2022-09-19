import { Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { capitalCase } from 'change-case';
import Iconify from 'components/Iconify';
import Label from 'components/Label';
import Scrollbar from 'components/Scrollbar';
import { editBatteryCellRoute } from 'constants/routes';
import { handleChangeAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsSlice';
import { setEditBatteryCell } from 'features/battery-cell/batteryCellSlice';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import BatteryCellTableHead from 'sections/all-battery-cells/battery-cell-table/BatteryCellTableHead';
import { applySortFilter, getComparator } from 'sections/all-battery-cells/utils';

AllBatteryCellsTable.propTypes = {
  filterName: PropTypes.string,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  all_battery_cells: PropTypes.array,
};

export default function AllBatteryCellsTable({ filterName, page, rowsPerPage, all_battery_cells }) {
  const dispatch = useDispatch();

  const [tableSortOrder, setTableSortOrder] = useState('desc');
  const [tableOrderByProperty, setTableOrderByProperty] = useState('id');
  // const [tableSelectedBatteryCells, setTableSelectedBatteryCells] = useState([]);

  const { tableSelectedBatteryCells } = useSelector((store) => store.allBatteryCells);

  const handleRequestSort = (_, property) => {
    const isAsc = tableOrderByProperty === property && tableSortOrder === 'asc';

    setTableSortOrder(isAsc ? 'desc' : 'asc');
    setTableOrderByProperty(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = all_battery_cells.map((n) => n.id);

      // setTableSelectedBatteryCells(newSelected);
      dispatch(handleChangeAllBatteryCells({ name: tableSelectedBatteryCells, value: newSelected }));
    }
  };

  const handleCheckboxSelect = (_, id) => {
    const selectedIndex = tableSelectedBatteryCells.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(tableSelectedBatteryCells, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(tableSelectedBatteryCells.slice(1));
    } else if (selectedIndex === tableSelectedBatteryCells.length - 1) {
      newSelected = newSelected.concat(tableSelectedBatteryCells.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        tableSelectedBatteryCells.slice(0, selectedIndex),
        tableSelectedBatteryCells.slice(selectedIndex + 1)
      );
    }

    // setTableSelectedBatteryCells(newSelected);
    dispatch(handleChangeAllBatteryCells({ name: tableSelectedBatteryCells, value: newSelected }));
  };

  const filteredBatteryCells = applySortFilter(
    all_battery_cells,
    getComparator(tableSortOrder, tableOrderByProperty),
    filterName
  );

  // const isUserNotFound = filteredBatteryCells.length === 0;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - all_battery_cells.length) : 0;

  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table data-cy="battery-cells-table">
          <BatteryCellTableHead
            order={tableSortOrder}
            orderBy={tableOrderByProperty}
            rowCount={all_battery_cells.length}
            numSelected={tableSelectedBatteryCells.length}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
          />
          <TableBody>
            {filteredBatteryCells.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const {
                id,
                cell_name_id,
                cycles,
                cathode,
                anode,
                capacity_ah,
                type,
                source,
                temperature_c,
                max_state_of_charge,
                min_state_of_charge,
                depth_of_discharge,
                charge_capacity_rate,
                discharge_capacity_rate,
              } = row;

              const isItemSelected = tableSelectedBatteryCells.indexOf(id) !== -1;

              return (
                <TableRow
                  hover
                  key={id}
                  tabIndex={-1}
                  role="checkbox"
                  selected={isItemSelected}
                  aria-checked={isItemSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      data-cy="battery-cell-checkbox"
                      checked={isItemSelected}
                      onChange={(event) => handleCheckboxSelect(event, id)}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none" align="center">
                    <IconButton
                      component={RouterLink}
                      data-cy="edit-battery-cell"
                      to={editBatteryCellRoute}
                      sx={{ color: 'text.secondary' }}
                      onClick={() => {
                        dispatch(
                          setEditBatteryCell({
                            id,
                            cell_name_id,
                            cycles,
                            cathode,
                            anode,
                            capacity_ah,
                            type,
                            source,
                            temperature_c,
                            max_state_of_charge,
                            min_state_of_charge,
                            depth_of_discharge,
                            charge_capacity_rate,
                            discharge_capacity_rate,
                          })
                        );
                      }}
                    >
                      <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row" padding="none" align="center">
                    <Typography variant="subtitle2" noWrap>
                      {id}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-cell_name_id">
                    {cell_name_id}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-cycles">
                    {cycles}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-cathode">
                    {cathode.toUpperCase()}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-anode">
                    {capitalCase(anode)}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-capacity_ah">
                    {capacity_ah}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-type">
                    {capitalCase(type)}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-source">
                    {source.toUpperCase()}
                  </TableCell>

                  <TableCell align="left" data-cy="table-cell-temperature_c">
                    <Label variant="ghost" color={(temperature_c >= '25.00' && 'error') || 'warning'}>
                      {temperature_c}
                    </Label>
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-max_state_of_charge">
                    {max_state_of_charge}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-min_state_of_charge">
                    {min_state_of_charge}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-depth_of_discharge">
                    {depth_of_discharge}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-charge_capacity_rate">
                    {charge_capacity_rate}
                  </TableCell>
                  <TableCell align="left" data-cy="table-cell-discharge_capacity_rate">
                    {discharge_capacity_rate}
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          {/* {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )} */}
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}
