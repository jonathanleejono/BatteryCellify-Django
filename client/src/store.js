import { configureStore } from '@reduxjs/toolkit';
import allBatteryCellsSlice from 'features/all-battery-cells/allBatteryCellsSlice';
import batteryCellSlice from 'features/battery-cell/batteryCellSlice';
import csvDataSlice from 'features/csv-data/csvDataSlice';
import userSlice from 'features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    batteryCell: batteryCellSlice,
    allBatteryCells: allBatteryCellsSlice,
    csvData: csvDataSlice,
  },
});
