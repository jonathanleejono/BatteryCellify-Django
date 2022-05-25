// import React from 'react';
// import { rest } from 'msw';
// import { setupServer } from 'msw/node';

// // We're using our own custom render function and not RTL's render.
// // Our custom utils also re-export everything from RTL
// // so we can import fireEvent and screen here as well
// import { render, fireEvent, screen } from '../test-utils';
// // import App from '../../containers/App';
// import DashboardApp from '../pages/DashboardApp';

// // We use msw to intercept the network request during the test,
// // and return the response 'John Smith' after 150ms
// // when receiving a get request to the `/api/user` endpoint
// export const handlers = [
//   rest.get('/api/battery-cells/', (req, res, ctx) => {
//     return res(
//       ctx.json({
//         total_battery_cells: 1,
//         avg_capacity: 2.35,
//         avg_depth_of_discharge: 100.0,
//         avg_temperature_c: 25.0,
//         total_cathode_lco_cells: 1,
//         total_cathode_lfp_cells: 0,
//         total_cathode_nca_cells: 0,
//         total_cathode_nmc_cells: 0,
//         total_cathode_nmclco_cells: 0,
//         avg_cycles_lco_cells: 1014.0,
//         avg_cycles_lfp_cells: 0.0,
//         avg_cycles_nca_cells: 0.0,
//         avg_cycles_nmc_cells: 0.0,
//         avg_cycles_nmclco_cells: 0.0,
//       }),
//       ctx.delay(150)
//     );
//   }),
// ];

// const server = setupServer(...handlers);

// // Enable API mocking before tests.
// beforeAll(() => server.listen());

// // Reset any runtime request handlers we may add during the tests.
// afterEach(() => server.resetHandlers());

// // Disable API mocking after the tests are done.
// afterAll(() => server.close());

// test('fetches & receives a user after clicking the fetch user button', async () => {
//   render(<DashboardApp />);

//   // should show no user initially, and not be fetching a user
//   //   expect(screen.getByText(/no user/i)).toBeInTheDocument();
//   //   expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument();
//   expect(screen.getByText(/25.0/i)).toBeInTheDocument();
//   //   expect(screen.queryByText(/2.35\.\.\./i)).toBeInTheDocument();

//   // after clicking the 'Fetch user' button, it should now show that it is fetching the user
//   //   fireEvent.click(screen.getByRole('button', { name: /Fetch user/i }));
//   //   expect(screen.getByText(/no user/i)).toBeInTheDocument();

//   // after some time, the user should be received
//   //   expect(await screen.findByText(/John Smith/i)).toBeInTheDocument();
//   //   expect(screen.queryByText(/no user/i)).not.toBeInTheDocument();
//   //   expect(screen.queryByText(/Fetching user\.\.\./i)).not.toBeInTheDocument();
// });
