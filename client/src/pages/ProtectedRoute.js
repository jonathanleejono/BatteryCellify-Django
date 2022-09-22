import { landingRoute } from 'constants/routes';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default function ProtectedRoute({ children }) {
  const { userAuthenticated } = useSelector((store) => store.user);
  if (!userAuthenticated) {
    return <Navigate to={landingRoute} />;
  }
  return children;
}
