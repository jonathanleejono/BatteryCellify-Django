import { Card, Container, Grid, TablePagination } from '@mui/material';
import Page from 'components/Page';
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsThunk';
import { handleToastErrors } from 'notifications/toast';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddBatteryCellButton from 'sections/all-battery-cells/AddBatteryCellButton';
import AllBatteryCellsFilters from 'sections/all-battery-cells/AllBatteryCellsFilters';
import AllBatteryCellsHeader from 'sections/all-battery-cells/AllBatteryCellsHeader';
import BatteryCellTable from 'sections/all-battery-cells/battery-cell-table/BatteryCellTable';
import BatteryCellTableToolbar from 'sections/all-battery-cells/battery-cell-table/BatteryCellTableToolbar';

export default function AllBatteryCells() {
  const dispatch = useDispatch();

  const { all_battery_cells, tableSelectedBatteryCells } = useSelector((store) => store.allBatteryCells);

  const handleFetchBatteryCells = useCallback(async () => {
    const resultAction = await dispatch(getAllBatteryCells());

    handleToastErrors(resultAction, getAllBatteryCells, 'Error fetching battery cells');
  }, [dispatch]);

  useEffect(() => {
    handleFetchBatteryCells();
  }, [handleFetchBatteryCells, dispatch]);

  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  return (
    <Page title="All Battery Cells">
      <Container>
        <AllBatteryCellsHeader />

        <Grid container spacing={3}>
          <AddBatteryCellButton />
          <AllBatteryCellsFilters />
        </Grid>

        <Card>
          <BatteryCellTableToolbar
            numSelected={tableSelectedBatteryCells.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={tableSelectedBatteryCells}
          />

          <BatteryCellTable
            rowsPerPage={rowsPerPage}
            page={page}
            filterName={filterName}
            all_battery_cells={all_battery_cells}
          />

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={all_battery_cells.length}
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
