import { Box, List } from '@mui/material';
import PropTypes from 'prop-types';
import { matchPath, useLocation } from 'react-router-dom';
import NavItem from 'sections/dashboard/navbar/NavItem';

NavSection.propTypes = {
  navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, ...other }) {
  const { pathname } = useLocation();

  const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false);

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} active={match} />
        ))}
      </List>
    </Box>
  );
}
