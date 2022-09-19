import { landingRoute } from 'constants/routes';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getUserFromLocalStorage } from 'utils/localStorage';

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default function ProtectedRoute({ children }) {
  const user = getUserFromLocalStorage();
  if (!user) {
    return <Navigate to={landingRoute} />;
  }
  return children;
}
