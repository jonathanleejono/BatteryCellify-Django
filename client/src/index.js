// scroll bar
// import 'simplebar/src/simplebar.css';
// import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer, Slide } from 'react-toastify';

import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import AppProviders from './context/app-providers';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <AppProviders>
    <App />
  </AppProviders>
);
