import { filter } from 'lodash';
import { sentenceCase, capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// material
import {
  Card,
  Grid,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Box,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import {
  BatteryCellListHead,
  BatteryCellListToolbar,
  BatteryCellMoreMenu,
} from '../sections/@dashboard/batteryCellTable';
import { BatteryCellsSort, BatteryCellsFilter } from '../sections/@dashboard/batteryCell';
// mock
import {
  getAllBatteryCells,
  handleChangeAllBatteryCells,
  clearFilters,
} from '../features/allBatteryCells/allBatteryCellsSlice';
import {
  deleteBatteryCell,
  setEditBatteryCell,
  setCreateBatteryCell,
  handleChange,
} from '../features/batteryCell/batteryCellSlice';
// import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: 'more', label: 'more', alignRight: false },
  { id: 'edit', label: 'Edit', alignRight: false },
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'cellNameId', label: 'Cell Name Id', alignRight: false },
  { id: 'cycles', label: 'Cycles', alignRight: false },
  { id: 'cathode', label: 'Cathode', alignRight: false },
  { id: 'anode', label: 'Anode', alignRight: false },
  { id: 'capacityAh', label: 'Capacity (Ah)', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'source', label: 'Source', alignRight: false },
  { id: 'temperatureC', label: 'Temp (C)', alignRight: false },
  { id: 'maxStateOfCharge', label: 'Max SoC', alignRight: false },
  { id: 'minStateOfCharge', label: 'Min SoC', alignRight: false },
  { id: 'depthOfDischarge', label: 'DoD', alignRight: false },
  { id: 'chargeCapacityRate', label: 'Charge C Rate', alignRight: false },
  { id: 'dischargeCapacityRate', label: 'Discharge C Rate', alignRight: false },
];

// ----------------------------------------------------------------------

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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_batteryCell) => _batteryCell.cellNameId.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function AllBatteryCells() {
  const { batteryCells, search, searchCathode, searchAnode, searchType, searchSource } = useSelector(
    (store) => store.allBatteryCells
  );

  const { cathode, cathodeOptions, anode, anodeOptions, type, typeOptions, source, sourceOptions } = useSelector(
    (store) => store.batteryCell
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, search, searchCathode, searchAnode, searchType, searchSource]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - batteryCells.length) : 0;

  const filteredUsers = applySortFilter(batteryCells, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSearch = (event) => {
    const { name, value } = event.target;
    dispatch(handleChangeAllBatteryCells({ name, value }));
  };

  return (
    <Page title="All Battery Cells">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Battery Cell List
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* ------------------------------------------------------------- */}
          <Grid item xs={12} md={8}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/app/add-battery-cell"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Add Battery Cell
            </Button>
          </Grid>
          {/* ------------------------------------------------------------- */}
          <Grid item xs={12} md={8}>
            <Stack mb={3} direction="row" alignItems="right" justifyContent="space-between">
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
                  Cathode:
                </Typography>
                <TextField select size="small" name="searchCathode" value={searchCathode} onChange={handleSearch}>
                  {cathodeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
                  Anode:
                </Typography>
                <TextField select size="small" name="searchAnode" value={searchAnode} onChange={handleSearch}>
                  {anodeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
                  Type:
                </Typography>
                <TextField select size="small" name="searchType" value={searchType} onChange={handleSearch}>
                  {typeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle" sx={{ color: 'text.secondary' }}>
                  Source:
                </Typography>
                <TextField select size="small" name="searchSource" value={searchSource} onChange={handleSearch}>
                  {sourceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Button variant="outlined" onClick={() => dispatch(clearFilters())}>
                Clear Filters
              </Button>
            </Stack>
          </Grid>
          {/* ------------------------------------------------------------- */}
        </Grid>

        <Card>
          <BatteryCellListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BatteryCellListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={batteryCells.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
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
                    } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none" align="center">
                          <IconButton
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
                            <Iconify icon="eva:edit-fill" width={24} height={24} />
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none" align="center">
                          <Typography variant="subtitle2" noWrap>
                            {id}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{cellNameId}</TableCell>
                        <TableCell align="left">{cycles}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={(cathode === 'LCO' && 'error') || 'success'}>
                            {/* {capitalCase(cathode)} */}
                            {cathode.toUpperCase()}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{capitalCase(anode)}</TableCell>
                        <TableCell align="left">{capacityAh}</TableCell>
                        <TableCell align="left">{capitalCase(type)}</TableCell>
                        <TableCell align="left">{source.toUpperCase()}</TableCell>
                        <TableCell align="left">{temperatureC}</TableCell>
                        <TableCell align="left">{maxStateOfCharge}</TableCell>
                        <TableCell align="left">{minStateOfCharge}</TableCell>
                        <TableCell align="left">{depthOfDischarge}</TableCell>
                        <TableCell align="left">{chargeCapacityRate}</TableCell>
                        <TableCell align="left">{dischargeCapacityRate}</TableCell>
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={batteryCells.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
