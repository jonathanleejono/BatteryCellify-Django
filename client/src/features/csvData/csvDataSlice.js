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
    },
    [getCycleData.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [getCycleData.rejected]: (state, { payload }) => {
      state.isLoading = false;
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
    },
    [getTimeSeriesData.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [getTimeSeriesData.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues } = csvDataSlice.actions;

export default csvDataSlice.reducer;
