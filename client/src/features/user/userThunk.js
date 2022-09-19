import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearAllBatteryCellsState } from 'features/all-battery-cells/allBatteryCellsSlice';
import { clearValues } from 'features/battery-cell/batteryCellSlice';
import { logoutUser } from 'features/user/userSlice';
import customFetch from 'utils/axios';
import { checkForUnauthorizedResponse } from 'utils/checkForUnauthorizedResponse';
import { removeUserFromLocalStorage } from 'utils/localStorage';

export const registerUser = createAsyncThunk('user/registerUser', async (newUser, thunkAPI) => {
  try {
    const resp = await customFetch.post('/api/auth/register', newUser);

    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message);
  }
});

export const loginUser = createAsyncThunk('user/loginUser', async (loginUser, thunkAPI) => {
  try {
    const resp = await customFetch.post('/api/auth/login', loginUser);

    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message);
  }
});

export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get('/api/auth/user');

    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message);
  }
});

export const updateUser = createAsyncThunk('user/updateUser', async (updatedUser, thunkAPI) => {
  try {
    const resp = await customFetch.patch('/api/auth/user', updatedUser);

    return resp.data;
  } catch (err) {
    const errorResponse = err.response.data;
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message)
    );
  }
});

export const clearStore = createAsyncThunk('user/clearStore', async (message, thunkAPI) => {
  try {
    removeUserFromLocalStorage();
    thunkAPI.dispatch(logoutUser(message));
    thunkAPI.dispatch(clearAllBatteryCellsState());
    thunkAPI.dispatch(clearValues());
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
});
