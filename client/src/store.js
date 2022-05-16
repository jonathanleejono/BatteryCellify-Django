import { configureStore } from '@reduxjs/toolkit';
import batteryCellSlice from './features/batteryCell/batteryCellSlice';
import userSlice from './features/user/userSlice';
import allBatteryCellsSlice from './features/allBatteryCells/allBatteryCellsSlice';
import csvDataSlice from './features/csvData/csvDataSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    batteryCell: batteryCellSlice,
    allBatteryCells: allBatteryCellsSlice,
    csvData: csvDataSlice,
  },
});
