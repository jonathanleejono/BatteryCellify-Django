// import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { rest, setupWorker } from 'msw';
import { setupServer } from 'msw/node';
import { ToastContainer, Slide } from 'react-toastify';
import { render, screen } from '../test-utils';
import userEvent from '@testing-library/user-event';
import Landing from '../pages/Landing';
import App from '../App';

describe('Landing page', () => {
  it('should say BatteryCellify', async () => {
    render(
      // the most important thing is to put on your helmet
      // <HelmetProvider>
      /* // <Provider store={store}> */
      <>
        <App />
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar transition={Slide} />
      </>
      /* // </Provider> */
      // </HelmetProvider>
      // </BrowserRouter>
    );

    expect(await screen.findByText('BatteryCellify')).toBeInTheDocument();
  });
});
