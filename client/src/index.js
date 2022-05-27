// scroll bar
import 'simplebar/src/simplebar.css';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './store';
//
import App from './App';
// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser');
//   worker.start();
// }

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HelmetProvider>
    {/* <BrowserRouter> */}
    <Provider store={store}>
      <App />
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar transition={Slide} />
    </Provider>
    {/* </BrowserRouter> */}
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
// serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
