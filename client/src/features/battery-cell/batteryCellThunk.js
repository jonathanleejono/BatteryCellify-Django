import { createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'features/all-battery-cells/allBatteryCellsSlice';
import { getAllBatteryCells } from 'features/all-battery-cells/allBatteryCellsThunk';
import { clearBatteryCellState } from 'features/battery-cell/batteryCellSlice';
import customFetch from 'utils/axios';
import { checkForUnauthorizedResponse } from 'utils/checkForUnauthorizedResponse';

export const createBatteryCell = createAsyncThunk(
  'batteryCell/createBatteryCell',
  async ({ batteryCell }, thunkAPI) => {
    try {
      const resp = await customFetch.post('/api/battery-cells/create', batteryCell);
      thunkAPI.dispatch(clearBatteryCellState());
      return resp.data;
    } catch (err) {
      const errorResponse = err.response.data;
      return (
        checkForUnauthorizedResponse(err, thunkAPI),
        thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
      );
    }
  }
);

export const deleteBatteryCell = createAsyncThunk('batteryCell/deleteBatteryCell', async (id, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/api/battery-cells/${id}`);
    thunkAPI.dispatch(getAllBatteryCells());
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

export const editBatteryCell = createAsyncThunk(
  'batteryCell/editBatteryCell',
  async ({ id, batteryCell }, thunkAPI) => {
    try {
      const resp = await customFetch.patch(`/api/battery-cells/${id}`, batteryCell);
      thunkAPI.dispatch(clearBatteryCellState());
      return resp.data;
    } catch (err) {
      const errorResponse = err.response.data;
      return (
        checkForUnauthorizedResponse(err, thunkAPI),
        thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
      );
    }
  }
);
