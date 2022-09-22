import { createSlice } from '@reduxjs/toolkit';
import { createBatteryCell, deleteBatteryCell, editBatteryCell } from 'features/battery-cell/batteryCellThunk';

const initialState = {
  id: '',
  isLoading: false,
  cell_name_id: '',
  cycles: '',
  cathode: 'LCO',
  anode: 'graphite',
  capacity_ah: '',
  type: '18650',
  source: 'HNEI',
  temperature_c: '',
  max_state_of_charge: '',
  min_state_of_charge: '',
  depth_of_discharge: '',
  charge_capacity_rate: '',
  discharge_capacity_rate: '',
  editBatteryCellId: '',
};

const batteryCellSlice = createSlice({
  name: 'batteryCell',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearBatteryCellState: (state) => ({ ...state, ...initialState }),
    setEditBatteryCell: (state, { payload }) => ({ ...state, ...payload }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBatteryCell.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBatteryCell.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createBatteryCell.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteBatteryCell.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBatteryCell.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteBatteryCell.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editBatteryCell.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editBatteryCell.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editBatteryCell.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { handleChange, clearBatteryCellState, setEditBatteryCell } = batteryCellSlice.actions;

export default batteryCellSlice.reducer;
