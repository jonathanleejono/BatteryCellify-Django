import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { store } from './store';
import batteryCellSlice from './features/batteryCell/batteryCellSlice';
import userSlice from './features/user/userSlice';
import allBatteryCellsSlice from './features/allBatteryCells/allBatteryCellsSlice';
import csvDataSlice from './features/csvData/csvDataSlice';
import AppProviders from './context/app-providers';

function render(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        user: userSlice,
        batteryCell: batteryCellSlice,
        allBatteryCells: allBatteryCellsSlice,
        csvData: csvDataSlice,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  // function Wrapper({ children }) {
  //   return <Provider store={store}>{children}</Provider>;
  // }

  return rtlRender(ui, { wrapper: AppProviders, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
