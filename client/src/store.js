import { configureStore } from "@reduxjs/toolkit";
import batteryCellSlice from "./features/batteryCell/batteryCellSlice";
import userSlice from "./features/user/userSlice";
import allBatteryCellsSlice from "./features/allBatteryCells/allBatteryCellsSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    batteryCell: batteryCellSlice,
    allBatteryCells: allBatteryCellsSlice,
  },
});
