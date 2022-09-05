import { clearAllBatteryCellsState } from 'allBatteryCells/allBatteryCellsSlice';
import { clearValues } from 'batteryCell/batteryCellSlice';
import { logoutUser } from 'userSlice';
import customFetch, { checkForUnauthorizedResponse } from 'utils/axios';
import { addUserToLocalStorage } from 'utils/localStorage';

export const registerUserThunk = async (url, newUser, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, newUser);
    const { user, token } = resp.data;
    addUserToLocalStorage({ user, token });
    return resp.data;
  } catch (err) {
    // the "error.response.data.detail" needs to have the word "detail" in it to make the
    // HTTPException message work (because 'detail' is destructured from it)
    // the "err.response.data.error" is for the slowapi rate limiting error message
    return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error);
  }
};

export const loginUserThunk = async (url, loginUser, thunkAPI) => {
  try {
    const resp = await customFetch.post(url, loginUser);
    const { user, token } = resp.data;
    addUserToLocalStorage({ user, token });
    return resp.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error);
  }
};

export const updateUserThunk = async (url, updatedUser, thunkAPI) => {
  try {
    const resp = await customFetch.patch(url, updatedUser);
    const { user, token } = resp.data;
    addUserToLocalStorage({ user, token });
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};

export const clearStoreThunk = async (message, thunkAPI) => {
  try {
    thunkAPI.dispatch(logoutUser(message));
    thunkAPI.dispatch(clearAllBatteryCellsState());
    thunkAPI.dispatch(clearValues());
    return Promise.resolve();
  } catch (error) {
    return Promise.reject();
  }
};
