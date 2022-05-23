import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  uploadCycleDataThunk,
  deleteCycleDataThunk,
  getCycleDataThunk,
  uploadTimeSeriesDataThunk,
  deleteTimeSeriesDataThunk,
  getTimeSeriesDataThunk,
} from './csvDataThunk';

const initialState = {
  isLoading: false,
  selectedBatteryCell: '',
  cycle_numbers: [],
  cycle_discharge_capacity_ah: [],
  cycle_discharge_energy_wh: [],
  energy_efficiency: [],
  coulombic_efficiency: [],
  cycle_numbers_capacity: [],
  cycle_numbers_energy: [],
  test_time_seconds: [],
  time_series_discharge_capacity_ah: [],
  time_series_discharge_energy_wh: [],
  voltage_cycles_100_step: [],
  voltage_cycles_200_step: [],
  voltage_cycles_300_step: [],
  voltage_cycles_400_step: [],
  voltage_cycles_500_step: [],
  voltage_cycles_600_step: [],
  voltage_cycles_700_step: [],
  voltage_cycles_800_step: [],
  voltage_cycles_900_step: [],
  voltage_cycles_1000_step: [],
  voltage_cycles_1100_step: [],
  charge_capacity_cycles_100_step: [],
  charge_capacity_cycles_200_step: [],
  charge_capacity_cycles_300_step: [],
  charge_capacity_cycles_400_step: [],
  charge_capacity_cycles_500_step: [],
  charge_capacity_cycles_600_step: [],
  charge_capacity_cycles_700_step: [],
  charge_capacity_cycles_800_step: [],
  charge_capacity_cycles_900_step: [],
  charge_capacity_cycles_1000_step: [],
  charge_capacity_cycles_1100_step: [],
  discharge_capacity_cycles_100_step: [],
  discharge_capacity_cycles_200_step: [],
  discharge_capacity_cycles_300_step: [],
  discharge_capacity_cycles_400_step: [],
  discharge_capacity_cycles_500_step: [],
  discharge_capacity_cycles_600_step: [],
  discharge_capacity_cycles_700_step: [],
  discharge_capacity_cycles_800_step: [],
  discharge_capacity_cycles_900_step: [],
  discharge_capacity_cycles_1000_step: [],
  discharge_capacity_cycles_1100_step: [],
};

export const uploadCycleData = createAsyncThunk('csvData/uploadCycleData', uploadCycleDataThunk);

export const deleteCycleData = createAsyncThunk('csvData/deleteCycleData', deleteCycleDataThunk);

export const getCycleData = createAsyncThunk('csvData/getCycleData', getCycleDataThunk);

export const uploadTimeSeriesData = createAsyncThunk('csvData/uploadTimeSeriesData', uploadTimeSeriesDataThunk);

export const deleteTimeSeriesData = createAsyncThunk('csvData/deleteTimeSeriesData', deleteTimeSeriesDataThunk);

export const getTimeSeriesData = createAsyncThunk('csvData/getTimeSeriesData', getTimeSeriesDataThunk);

const csvDataSlice = createSlice({
  name: 'csvData',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: {
    [uploadCycleData.pending]: (state) => {
      state.isLoading = true;
      toast.loading('Please wait...');
    },
    [uploadCycleData.fulfilled]: (state) => {
      state.isLoading = false;
      toast.dismiss();
      toast.success('Upload successful!');
    },
    [uploadCycleData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [deleteCycleData.pending]: (state) => {
      state.isLoading = true;
      toast.loading('Please wait...');
    },
    [deleteCycleData.fulfilled]: (state, { payload }) => {
      toast.dismiss();
      toast.success(payload);
    },
    [deleteCycleData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [getCycleData.pending]: (state) => {
      state.isLoading = true;
      toast.loading('Please wait...');
    },
    [getCycleData.fulfilled]: (state, { payload }) => {
      toast.dismiss();
      state.isLoading = false;
      state.cycle_numbers = payload.cycle_numbers;
      state.cycle_discharge_capacity_ah = payload.cycle_discharge_capacity_ah;
      state.cycle_discharge_energy_wh = payload.cycle_discharge_energy_wh;
      state.energy_efficiency = payload.energy_efficiency;
      state.coulombic_efficiency = payload.coulombic_efficiency;
      state.cycle_numbers_capacity = payload.cycle_numbers_capacity;
      state.cycle_numbers_energy = payload.cycle_numbers_energy;
    },
    [getCycleData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [uploadTimeSeriesData.pending]: (state) => {
      state.isLoading = true;
      toast.loading('Please wait...');
    },
    [uploadTimeSeriesData.fulfilled]: (state) => {
      state.isLoading = false;
      toast.dismiss();
      toast.success('Upload successful!');
    },
    [uploadTimeSeriesData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [deleteTimeSeriesData.pending]: (state) => {
      state.isLoading = true;
      toast.loading('Please wait...');
    },
    [deleteTimeSeriesData.fulfilled]: (state, { payload }) => {
      toast.dismiss();
      toast.success(payload);
    },
    [deleteTimeSeriesData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
    [getTimeSeriesData.pending]: (state) => {
      state.isLoading = true;
      toast.loading('Please wait...');
    },
    [getTimeSeriesData.fulfilled]: (state, { payload }) => {
      toast.dismiss();
      state.isLoading = false;
      state.test_time_seconds = payload.test_time_seconds;
      state.time_series_discharge_capacity_ah = payload.time_series_discharge_capacity_ah;
      state.time_series_discharge_energy_wh = payload.time_series_discharge_energy_wh;
      state.voltage_cycles_100_step = payload.voltage_cycles_100_step;
      state.voltage_cycles_200_step = payload.voltage_cycles_200_step;
      state.voltage_cycles_300_step = payload.voltage_cycles_300_step;
      state.voltage_cycles_400_step = payload.voltage_cycles_400_step;
      state.voltage_cycles_500_step = payload.voltage_cycles_500_step;
      state.voltage_cycles_600_step = payload.voltage_cycles_600_step;
      state.voltage_cycles_700_step = payload.voltage_cycles_700_step;
      state.voltage_cycles_800_step = payload.voltage_cycles_800_step;
      state.voltage_cycles_900_step = payload.voltage_cycles_900_step;
      state.voltage_cycles_1000_step = payload.voltage_cycles_1000_step;
      state.voltage_cycles_1100_step = payload.voltage_cycles_1100_step;
      state.charge_capacity_cycles_100_step = payload.charge_capacity_cycles_100_step;
      state.charge_capacity_cycles_200_step = payload.charge_capacity_cycles_200_step;
      state.charge_capacity_cycles_300_step = payload.charge_capacity_cycles_300_step;
      state.charge_capacity_cycles_400_step = payload.charge_capacity_cycles_400_step;
      state.charge_capacity_cycles_500_step = payload.charge_capacity_cycles_500_step;
      state.charge_capacity_cycles_600_step = payload.charge_capacity_cycles_600_step;
      state.charge_capacity_cycles_700_step = payload.charge_capacity_cycles_700_step;
      state.charge_capacity_cycles_800_step = payload.charge_capacity_cycles_800_step;
      state.charge_capacity_cycles_900_step = payload.charge_capacity_cycles_900_step;
      state.charge_capacity_cycles_1000_step = payload.charge_capacity_cycles_1000_step;
      state.charge_capacity_cycles_1100_step = payload.charge_capacity_cycles_1100_step;
      state.discharge_capacity_cycles_100_step = payload.discharge_capacity_cycles_100_step;
      state.discharge_capacity_cycles_200_step = payload.discharge_capacity_cycles_200_step;
      state.discharge_capacity_cycles_300_step = payload.discharge_capacity_cycles_300_step;
      state.discharge_capacity_cycles_400_step = payload.discharge_capacity_cycles_400_step;
      state.discharge_capacity_cycles_500_step = payload.discharge_capacity_cycles_500_step;
      state.discharge_capacity_cycles_600_step = payload.discharge_capacity_cycles_600_step;
      state.discharge_capacity_cycles_700_step = payload.discharge_capacity_cycles_700_step;
      state.discharge_capacity_cycles_800_step = payload.discharge_capacity_cycles_800_step;
      state.discharge_capacity_cycles_900_step = payload.discharge_capacity_cycles_900_step;
      state.discharge_capacity_cycles_1000_step = payload.discharge_capacity_cycles_1000_step;
      state.discharge_capacity_cycles_1100_step = payload.discharge_capacity_cycles_1100_step;
    },
    [getTimeSeriesData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.dismiss();
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues } = csvDataSlice.actions;

export default csvDataSlice.reducer;
