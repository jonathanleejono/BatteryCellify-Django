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
  cycleNumbers: [],
  cycleDischargeCapacityAh: [],
  cycleDischargeEnergyWh: [],
  energyEfficiency: [],
  coulombicEfficiency: [],
  cycleNumbersAdjustedCapacity: [],
  cycleNumbersAdjustedEnergy: [],
  testTime: [],
  timeSeriesDischargeCapacityAh: [],
  timeSeriesDischargeEnergyWh: [],
  voltageCycles100Step: [],
  voltageCycles200Step: [],
  voltageCycles300Step: [],
  voltageCycles400Step: [],
  voltageCycles500Step: [],
  voltageCycles600Step: [],
  voltageCycles700Step: [],
  voltageCycles800Step: [],
  voltageCycles900Step: [],
  voltageCycles1000Step: [],
  voltageCycles1100Step: [],
  chargeCapacityCycles100Step: [],
  chargeCapacityCycles200Step: [],
  chargeCapacityCycles300Step: [],
  chargeCapacityCycles400Step: [],
  chargeCapacityCycles500Step: [],
  chargeCapacityCycles600Step: [],
  chargeCapacityCycles700Step: [],
  chargeCapacityCycles800Step: [],
  chargeCapacityCycles900Step: [],
  chargeCapacityCycles1000Step: [],
  chargeCapacityCycles1100Step: [],
  dischargeCapacityCycles100Step: [],
  dischargeCapacityCycles200Step: [],
  dischargeCapacityCycles300Step: [],
  dischargeCapacityCycles400Step: [],
  dischargeCapacityCycles500Step: [],
  dischargeCapacityCycles600Step: [],
  dischargeCapacityCycles700Step: [],
  dischargeCapacityCycles800Step: [],
  dischargeCapacityCycles900Step: [],
  dischargeCapacityCycles1000Step: [],
  dischargeCapacityCycles1100Step: [],
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
      state.cycleNumbers = payload.cycleNumbers;
      state.cycleDischargeCapacityAh = payload.cycleDischargeCapacityAh;
      state.cycleDischargeEnergyWh = payload.cycleDischargeEnergyWh;
      state.energyEfficiency = payload.energyEfficiency;
      state.coulombicEfficiency = payload.coulombicEfficiency;
      state.cycleNumbersAdjustedCapacity = payload.cycleNumbersAdjustedCapacity;
      state.cycleNumbersAdjustedEnergy = payload.cycleNumbersAdjustedEnergy;
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
      state.testTime = payload.testTime;
      state.timeSeriesDischargeCapacityAh = payload.timeSeriesDischargeCapacityAh;
      state.timeSeriesDischargeEnergyWh = payload.timeSeriesDischargeEnergyWh;
      state.voltageCycles100Step = payload.voltageCycles100Step;
      state.voltageCycles200Step = payload.voltageCycles200Step;
      state.voltageCycles300Step = payload.voltageCycles300Step;
      state.voltageCycles400Step = payload.voltageCycles400Step;
      state.voltageCycles500Step = payload.voltageCycles500Step;
      state.voltageCycles600Step = payload.voltageCycles600Step;
      state.voltageCycles700Step = payload.voltageCycles700Step;
      state.voltageCycles800Step = payload.voltageCycles800Step;
      state.voltageCycles900Step = payload.voltageCycles900Step;
      state.voltageCycles1000Step = payload.voltageCycles1000Step;
      state.voltageCycles1100Step = payload.voltageCycles1100Step;
      state.chargeCapacityCycles100Step = payload.chargeCapacityCycles100Step;
      state.chargeCapacityCycles200Step = payload.chargeCapacityCycles200Step;
      state.chargeCapacityCycles300Step = payload.chargeCapacityCycles300Step;
      state.chargeCapacityCycles400Step = payload.chargeCapacityCycles400Step;
      state.chargeCapacityCycles500Step = payload.chargeCapacityCycles500Step;
      state.chargeCapacityCycles600Step = payload.chargeCapacityCycles600Step;
      state.chargeCapacityCycles700Step = payload.chargeCapacityCycles700Step;
      state.chargeCapacityCycles800Step = payload.chargeCapacityCycles800Step;
      state.chargeCapacityCycles900Step = payload.chargeCapacityCycles900Step;
      state.chargeCapacityCycles1000Step = payload.chargeCapacityCycles1000Step;
      state.chargeCapacityCycles1100Step = payload.chargeCapacityCycles1100Step;
      state.dischargeCapacityCycles100Step = payload.dischargeCapacityCycles100Step;
      state.dischargeCapacityCycles200Step = payload.dischargeCapacityCycles200Step;
      state.dischargeCapacityCycles300Step = payload.dischargeCapacityCycles300Step;
      state.dischargeCapacityCycles400Step = payload.dischargeCapacityCycles400Step;
      state.dischargeCapacityCycles500Step = payload.dischargeCapacityCycles500Step;
      state.dischargeCapacityCycles600Step = payload.dischargeCapacityCycles600Step;
      state.dischargeCapacityCycles700Step = payload.dischargeCapacityCycles700Step;
      state.dischargeCapacityCycles800Step = payload.dischargeCapacityCycles800Step;
      state.dischargeCapacityCycles900Step = payload.dischargeCapacityCycles900Step;
      state.dischargeCapacityCycles1000Step = payload.dischargeCapacityCycles1000Step;
      state.dischargeCapacityCycles1100Step = payload.dischargeCapacityCycles1100Step;
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
