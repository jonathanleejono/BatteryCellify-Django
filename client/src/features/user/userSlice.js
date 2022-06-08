import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  getUserFromLocalStorage,
  getTokenFromLocalStorage,
  removeUserFromLocalStorage,
} from '../../utils/localStorage';
import { loginUserThunk, registerUserThunk, updateUserThunk, clearStoreThunk } from './userThunk';

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
  token: getTokenFromLocalStorage(),
};

export const registerUser = createAsyncThunk('user/registerUser', async (user, thunkAPI) => {
  return registerUserThunk('/api/register', user, thunkAPI);
});

export const loginUser = createAsyncThunk('user/loginUser', async (user, thunkAPI) => {
  return loginUserThunk('/api/login', user, thunkAPI);
});

export const updateUser = createAsyncThunk('user/updateUser', async (user, thunkAPI) => {
  return updateUserThunk('/api/updateUser', user, thunkAPI);
});

export const clearStore = createAsyncThunk('user/clearStore', clearStoreThunk);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }) => {
      state.user = null;
      state.token = null;
      state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      toast.success(`Hello there ${user.first_name}`);
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      removeUserFromLocalStorage();
      toast.error(payload);
    },
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      toast.success(`Hello there ${user.first_name}`);
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      removeUserFromLocalStorage();
      toast.error(payload);
    },
    [updateUser.pending]: (state) => {
      state.isLoading = true;
    },
    [updateUser.fulfilled]: (state, { payload }) => {
      const { user, token } = payload;
      state.isLoading = false;
      state.user = user;
      state.token = token;
      toast.success(`Profile Updated!`);
    },
    [updateUser.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [clearStore.rejected]: () => {
      toast.error('There was an error..');
    },
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;
