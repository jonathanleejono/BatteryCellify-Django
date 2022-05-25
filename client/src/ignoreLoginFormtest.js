// import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { rest, setupWorker } from 'msw';
// import { setupServer } from 'msw/node';
// // import { render, screen } from '../test-utils';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { LoginForm } from '../sections/auth/login';
// import Router from '../routes';
// import { Provider } from 'react-redux';
// import { store } from '../store';

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

// const server = setupServer(...handlers);

// // const worker = setupWorker(...handlers);

// // worker.start();

// // Enable API mocking before tests.
// beforeAll(() => server.listen());

// // Reset any runtime request handlers we may add during the tests.
// afterEach(() => server.resetHandlers());

// // Disable API mocking after the tests are done.
// afterAll(() => server.close());

// describe('LoginForm', () => {
//   it('should allow a user to log in', async () => {
//     render(
//       <BrowserRouter>
//         <Provider store={store}>
//           <Router>
//             <LoginForm />
//           </Router>
//         </Provider>
//       </BrowserRouter>
//     );

//     await userEvent.type(screen.getByLabelText(/email/i), 'silasw1@gmail.com');

//     userEvent.click(screen.getByRole('button', { name: /Login/i }));

//     expect(await screen.findByText('Welcome')).toBeInTheDocument();
//     expect(await screen.findByText('Back')).toBeInTheDocument();
//     expect(await screen.findByText('silas')).toBeInTheDocument();
//   });
// });
