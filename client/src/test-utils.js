// / test-utils.jsx
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
// Import your own reducer
// import userReducer from './featuresuserSlice'
import batteryCellSlice from './features/batteryCell/batteryCellSlice';
import userSlice from './features/user/userSlice';
import allBatteryCellsSlice from './features/allBatteryCells/allBatteryCellsSlice';
import csvDataSlice from './features/csvData/csvDataSlice';

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
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
