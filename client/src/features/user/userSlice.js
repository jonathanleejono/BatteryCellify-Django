import { createSlice } from '@reduxjs/toolkit';
import { getUser, loginUser, logoutUser, registerUser, updateUser } from 'features/user/userThunk';
import { getUserFromLocalStorage } from 'utils/localStorage';

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: { name: '', email: '' },
  userAuthenticated: getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    clearUserState: (state) => ({ ...state, ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = { name: payload.name, email: payload.email };
        state.userAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = { name: payload.name, email: payload.email };
        state.userAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = { name: payload.name, email: payload.email };
        state.userAuthenticated = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = { name: payload.name, email: payload.email };
        state.userAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.userAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.userAuthenticated = false;
      });
  },
});

export const { toggleSidebar, clearUserState } = userSlice.actions;
export default userSlice.reducer;
