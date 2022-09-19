import { createSlice } from '@reduxjs/toolkit';
import { getUser, loginUser, registerUser, updateUser } from 'features/user/userThunk';

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: { name: '', email: '' },
  userAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state) => {
      state.userAuthenticated = false;
      state.isSidebarOpen = false;
    },
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
      });
  },
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;
