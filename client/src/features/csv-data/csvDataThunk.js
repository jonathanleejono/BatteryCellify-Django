import { createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'features/all-battery-cells/allBatteryCellsSlice';
import customFetch from 'utils/axios';
import { checkForUnauthorizedResponse } from 'utils/checkForUnauthorizedResponse';

export const uploadCycleData = createAsyncThunk('csvData/uploadCycleData', async ({ id, file }, thunkAPI) => {
  try {
    const resp = await customFetch.post(`/api/battery-cells/csv/cycle-data/${id}`, file);

    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});

export const deleteCycleData = createAsyncThunk('csvData/deleteCycleData', async (id, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/api/battery-cells/csv/cycle-data/${id}`);
    return resp.data;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});

export const getCycleData = createAsyncThunk('csvData/getCycleData', async (id, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/api/battery-cells/csv/cycle-data/${id}`);
    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});

export const uploadTimeSeriesData = createAsyncThunk('csvData/uploadTimeSeriesData', async ({ id, file }, thunkAPI) => {
  try {
    const resp = await customFetch.post(`/api/battery-cells/csv/time-series-data/${id}`, file);

    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});

export const deleteTimeSeriesData = createAsyncThunk('csvData/deleteTimeSeriesData', async (id, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/api/battery-cells/csv/time-series-data/${id}`);
    return resp.data;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});

export const getTimeSeriesData = createAsyncThunk('csvData/getTimeSeriesData', async (id, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/api/battery-cells/csv/time-series-data/${id}`);
    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});
