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
  dischargeCapacityAh: [],
  dischargeEnergyWh: [],
  energyEfficiency: [],
  coulombicEfficiency: [],
  testTime: [],
  dischargeCapacityAh: [],
  dischargeEnergyWh: [],
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
      state.dischargeCapacityAh = payload.dischargeCapacityAh;
      state.dischargeEnergyWh = payload.dischargeEnergyWh;
      state.energyEfficiency = payload.energyEfficiency;
      state.coulombicEfficiency = payload.coulombicEfficiency;
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
    [getTimeSeriesData.fulfilled]: (state) => {
      toast.dismiss();
      state.isLoading = false;
      state.testTime = payload.testTime;
      state.dischargeCapacityAh = payload.dischargeCapacityAh;
      state.dischargeEnergyWh = payload.dischargeEnergyWh;
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
      state.chargeCapacity100Step = payload.chargeCapacity100Step;
      state.chargeCapacity200Step = payload.chargeCapacity200Step;
      state.chargeCapacity300Step = payload.chargeCapacity300Step;
      state.chargeCapacity400Step = payload.chargeCapacity400Step;
      state.chargeCapacity500Step = payload.chargeCapacity500Step;
      state.chargeCapacity600Step = payload.chargeCapacity600Step;
      state.chargeCapacity700Step = payload.chargeCapacity700Step;
      state.chargeCapacity800Step = payload.chargeCapacity800Step;
      state.chargeCapacity900Step = payload.chargeCapacity900Step;
      state.chargeCapacity1000Step = payload.chargeCapacity1000Step;
      state.chargeCapacity1100Step = payload.chargeCapacity1100Step;
      state.dischargeCapacity100Step = payload.dischargeCapacity100Step;
      state.dischargeCapacity200Step = payload.dischargeCapacity200Step;
      state.dischargeCapacity300Step = payload.dischargeCapacity300Step;
      state.dischargeCapacity400Step = payload.dischargeCapacity400Step;
      state.dischargeCapacity500Step = payload.dischargeCapacity500Step;
      state.dischargeCapacity600Step = payload.dischargeCapacity600Step;
      state.dischargeCapacity700Step = payload.dischargeCapacity700Step;
      state.dischargeCapacity800Step = payload.dischargeCapacity800Step;
      state.dischargeCapacity900Step = payload.dischargeCapacity900Step;
      state.dischargeCapacity1000Step = payload.dischargeCapacity1000Step;
      state.dischargeCapacity1100Step = payload.dischargeCapacity1100Step;
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
