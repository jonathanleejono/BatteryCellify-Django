import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';

import EnhancedTableHeader from './EnhancedTableHeader';
import EnhancedTableToolbar from './EnhancedTableToolbar';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { getAllBatteryCells } from '../features/allBatteryCells/allBatteryCellsSlice';
import { deleteBatteryCell, setEditBatteryCell } from '../features/batteryCell/batteryCellSlice';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTable = () => {
  const {
    batteryCells,
    isLoading,
    total_battery_cells,
    numOfPages,
    search,
    searchCathode,
    searchAnode,
    searchType,
    searchSource,
  } = useSelector((store) => store.allBatteryCells);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, search, searchCathode, searchAnode, searchType, searchSource]);

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = batteryCells.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleDeleteMany = () => {
    console.log(selected);
    for (let id in selected) {
      dispatch(deleteBatteryCell(selected[id]));
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - batteryCells.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
            <EnhancedTableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={batteryCells.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(batteryCells, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((batteryCell, index) => {
                  const isItemSelected = isSelected(batteryCell.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, batteryCell.id, batteryCell.cell_name_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={batteryCell.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="normal" align="left">
                        {' '}
                        <Box
                          sx={{
                            // backgroundColor: "whitesmoke",
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'left',
                          }}
                        >
                          {' '}
                          <Link to="/edit-battery-cell">
                            <IconButton
                              onClick={() => {
                                dispatch(
                                  setEditBatteryCell({
                                    id: batteryCell.id,
                                    cell_name_id: batteryCell.cell_name_id,
                                    cycles: batteryCell.cycles,
                                    cathode: batteryCell.cathode,
                                    anode: batteryCell.anode,
                                    capacity_ah: batteryCell.capacity_ah,
                                    type: batteryCell.type,
                                    source: batteryCell.source,
                                    temperature_c: batteryCell.temperature_c,
                                    max_state_of_charge: batteryCell.max_state_of_charge,
                                    min_state_of_charge: batteryCell.min_state_of_charge,
                                    depth_of_discharge: batteryCell.depth_of_discharge,
                                    charge_capacity_rate: batteryCell.charge_capacity_rate,
                                    discharge_capacity_rate: batteryCell.discharge_capacity_rate,
                                  })
                                );
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => {
                              setOpenDialog(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
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
                              <DialogContentText id="alert-dialog-description">
                                {JSON.stringify(selected)}
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  handleClose();
                                  handleDeleteMany();
                                }}
                                color="primary"
                              >
                                Confirm
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        // padding="none"
                        align="left"
                      >
                        {batteryCell.id}
                      </TableCell>
                      <TableCell align="left">{batteryCell.cell_name_id}</TableCell>
                      <TableCell align="left">{batteryCell.cycles}</TableCell>
                      <TableCell align="left">{batteryCell.cathode}</TableCell>
                      <TableCell align="left">{batteryCell.anode}</TableCell>
                      <TableCell align="left">{batteryCell.capacity_ah}</TableCell>
                      <TableCell align="left">{batteryCell.type}</TableCell>
                      <TableCell align="left">{batteryCell.source}</TableCell>
                      <TableCell align="left">{batteryCell.temperature_c}</TableCell>
                      <TableCell align="left">{batteryCell.max_state_of_charge}</TableCell>
                      <TableCell align="left">{batteryCell.min_state_of_charge}</TableCell>
                      <TableCell align="left">{batteryCell.depth_of_discharge}</TableCell>
                      <TableCell align="left">{batteryCell.charge_capacity_rate}</TableCell>
                      <TableCell align="left">{batteryCell.discharge_capacity_rate}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={batteryCells.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            //   backgroundColor: "primary.main",
            '& .MuiTablePagination-spacer': {
              flex: '0 0 0%',
            },
          }}
        />
      </Paper>
      <div>
        <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
        <Button
          onClick={() => {
            selected.length > 0 ? setOpenDialog(true) : toast.error('Please select battery cell(s)');
          }}
          style={{ margin: '20px', background: 'white', color: 'black' }}
          className="btn"
        >
          Delete Selected
        </Button>
      </div>
    </Box>
  );
};

export default EnhancedTable;
