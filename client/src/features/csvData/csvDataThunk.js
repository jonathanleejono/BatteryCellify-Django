import { toast } from 'react-toastify';
import { showLoading, hideLoading, getAllBatteryCells } from '../allBatteryCells/allBatteryCellsSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';

export const uploadCycleDataThunk = async ({ id, uploadFile }, thunkAPI) => {
  try {
    const resp = await customFetch.post(`/csv-data/cycleData/${id}`, uploadFile);

    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};

export const deleteCycleDataThunk = async (id, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/csv-data/cycleData/${id}`);
    return resp.data.msg;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};
export const getCycleDataThunk = async (id, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/csv-data/cycleData/${id}`);
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};

export const uploadTimeSeriesDataThunk = async ({ id, uploadFile }, thunkAPI) => {
  try {
    const resp = await customFetch.post(`/csv-data/timeSeriesData/${id}`, uploadFile);
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};
export const deleteTimeSeriesDataThunk = async (id, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/csv-data/timeSeriesData/${id}`);
    return resp.data.msg;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};
export const getTimeSeriesDataThunk = async (id, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/csv-data/timeSeriesData/${id}`);
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};
