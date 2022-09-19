import { Box } from '@mui/material';
import { landingRoute } from 'constants/routes';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
  const logo = <Box component="img" src="/static/battery_1f50b.png" sx={{ width: 40, height: 40, ...sx }} />;

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to={landingRoute}>{logo}</RouterLink>;
}
