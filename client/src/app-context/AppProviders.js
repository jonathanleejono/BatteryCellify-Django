import PropTypes from 'prop-types';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'simplebar/src/simplebar.css';
import { store } from 'store';

AppProviders.propTypes = {
  children: PropTypes.node,
};

export default function AppProviders({ children }) {
  return (
    <HelmetProvider>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar transition={Slide} />
      <Provider store={store}>{children}</Provider>
    </HelmetProvider>
  );
}
