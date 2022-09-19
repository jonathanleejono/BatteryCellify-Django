import { Box, List } from '@mui/material';
import { clearState } from 'features/all-battery-cells/allBatteryCellsSlice';
import { clearCsvFormValues } from 'features/csv-data/csvDataSlice';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { matchPath, useLocation } from 'react-router-dom';
import NavItem from 'sections/dashboard/navbar/NavItem';

NavSection.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  const dispatch = useDispatch();

  return (
    <Box {...other}>
      <List
        disablePadding
        sx={{ p: 1 }}
        onClick={() => {
          dispatch(clearState());
          dispatch(clearCsvFormValues());
        }}
      >
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}
