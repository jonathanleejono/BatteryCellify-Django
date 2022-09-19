import { clearStore } from 'features/user/userThunk';

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401 || error.response.status === 403 || error.response.status === 500) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue('Session Expired! Logging Out...');
  }
  const errorResponse = error.response.data;
  return thunkAPI.rejectWithValue(errorResponse.detail || errorResponse.error || errorResponse.errors[0].message);
};
