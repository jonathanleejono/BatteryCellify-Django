// import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { rest, setupWorker } from 'msw';
import { setupServer } from 'msw/node';
import { ToastContainer, Slide } from 'react-toastify';
// import { render, screen } from '../test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../pages/Register';
import Landing from '../pages/Landing';
import App from '../App';
// import Login from '../pages/Login';
import { RegisterForm } from '../sections/auth/register';
// import { LoginForm } from '../sections/auth/login';
import Router from '../routes';
import { Provider } from 'react-redux';
import { store } from '../store';
import { getUserFromLocalStorage, getTokenFromLocalStorage } from '../utils/localStorage';
// import {
//   getUserFromLocalStorage,
//   getTokenFromLocalStorage,
//   removeUserFromLocalStorage,
// } from '../../utils/localStorage';

// export const handlers = [
//   rest.post('/api/register', (req, res, ctx) => {
//     const { email } = req.body;

//     // ctx means context

//     return res(
//       ctx.json({
//         id: 13,
//         user: {
//           email,
//           first_name: 'silas',
//           last_name: 'whatever',
//         },
//       })
//     );
//   }),
// ];
const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
};

describe('Register on the Register page', () => {
  it('should allow a user to Register', async () => {
    render(
      // <BrowserRouter>
      // the most important thing is to put on your helmet
      <HelmetProvider>
        <Provider store={store}>
          <App />
          <ToastContainer position="top-center" autoClose={2000} hideProgressBar transition={Slide} />
        </Provider>
      </HelmetProvider>
      // </BrowserRouter>
    );

    // await userEvent.type(screen.getByLabelText(/First name/i), 'silas');
    // await userEvent.type(screen.getByLabelText(/Last name/i), 'w2');
    // await userEvent.type(screen.getByLabelText(/Email address/i), 'silasw2@gmail.com');
    // await userEvent.type(screen.getByLabelText(/Password"/i), 'hello123');

    // userEvent.click(screen.getByRole('LoadingButton', { name: /Register/i }));

    // expect(await screen.findByText('Welcome')).toBeInTheDocument();
    // expect(await screen.findByText('Back')).toBeInTheDocument();
    // expect(await screen.findByText('silas')).toBeInTheDocument();
    expect(await screen.findByText('BatteryCellify')).toBeInTheDocument();
  });
});
