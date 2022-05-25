import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { rest, setupWorker } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '../test-utils';
// import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../sections/auth/login';
import Router from '../routes';
import { Provider } from 'react-redux';
import { store } from '../store';

// export const handlers = [
//   rest.post('/api/login', (req, res, ctx) => {
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

describe('LoginForm', () => {
  it('should allow a user to log in', async () => {
    render(
      <BrowserRouter>
        {/* <Provider store={store}> */}
        <Router>
          <LoginForm />
        </Router>
        {/* </Provider> */}
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'silasw2@gmail.com');

    userEvent.click(screen.getByRole('LoadingButton', { name: /Login/i }));

    expect(await screen.findByText('Welcome')).toBeInTheDocument();
    expect(await screen.findByText('Back')).toBeInTheDocument();
    expect(await screen.findByText('silas')).toBeInTheDocument();
  });
});
