import { createSlice } from '@reduxjs/toolkit';
import {
  deleteCycleData,
  deleteTimeSeriesData,
  getCycleData,
  getTimeSeriesData,
  uploadCycleData,
  uploadTimeSeriesData,
} from 'features/csv-data/csvDataThunk';

const cycleDataState = {
  all_cycle_numbers: [],
  cycle_discharge_capacity_ah_list: [],
  cycle_discharge_energy_wh_list: [],
  energy_efficiency: [],
  coulombic_efficiency: [],
  cycle_numbers_capacity: [],
  cycle_numbers_energy: [],
};

const timeSeriesDataState = {
  test_time_seconds_list: [],
  time_series_discharge_capacity_ah_list: [],
  time_series_discharge_energy_wh_list: [],
  voltage_cycle_steps: {
    steps_100: [0],
    steps_200: [0],
    steps_300: [0],
    steps_400: [0],
    steps_500: [0],
    steps_600: [0],
    steps_700: [0],
    steps_800: [0],
    steps_900: [0],
    steps_1000: [0],
    steps_1100: [0],
  },
  charge_capacity_cycles_steps: {
    steps_100: [0],
    steps_200: [0],
    steps_300: [0],
    steps_400: [0],
    steps_500: [0],
    steps_600: [0],
    steps_700: [0],
    steps_800: [0],
    steps_900: [0],
    steps_1000: [0],
    steps_1100: [0],
  },
  discharge_capacity_cycles_steps: {
    steps_100: [0],
    steps_200: [0],
    steps_300: [0],
    steps_400: [0],
    steps_500: [0],
    steps_600: [0],
    steps_700: [0],
    steps_800: [0],
    steps_900: [0],
    steps_1000: [0],
    steps_1100: [0],
  },
};

const initialState = {
  isLoading: false,
  selectedBatteryCell: '',
  ...cycleDataState,
  ...timeSeriesDataState,
};

const csvDataSlice = createSlice({
  name: 'csvData',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearCsvFormValues: () => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCycleData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadCycleData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadCycleData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCycleData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCycleData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCycleData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getCycleData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCycleData.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.all_cycle_numbers = payload.all_cycle_numbers;
        state.cycle_discharge_capacity_ah_list = payload.cycle_discharge_capacity_ah_list;
        state.cycle_discharge_energy_wh_list = payload.cycle_discharge_energy_wh_list;
        state.energy_efficiency = payload.energy_efficiency;
        state.coulombic_efficiency = payload.coulombic_efficiency;
        state.cycle_numbers_capacity = payload.cycle_numbers_capacity;
        state.cycle_numbers_energy = payload.cycle_numbers_energy;
      })
      .addCase(getCycleData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadTimeSeriesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadTimeSeriesData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadTimeSeriesData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteTimeSeriesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTimeSeriesData.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteTimeSeriesData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getTimeSeriesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTimeSeriesData.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.test_time_seconds_list = payload.test_time_seconds_list;
        state.time_series_discharge_capacity_ah_list = payload.time_series_discharge_capacity_ah_list;
        state.time_series_discharge_energy_wh_list = payload.time_series_discharge_energy_wh_list;
        state.voltage_cycle_steps = payload.voltage_cycle_steps;
        state.charge_capacity_cycles_steps = payload.charge_capacity_cycles_steps;
        state.discharge_capacity_cycles_steps = payload.discharge_capacity_cycles_steps;
      })
      .addCase(getTimeSeriesData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { handleChange, clearCsvFormValues } = csvDataSlice.actions;

export default csvDataSlice.reducer;
