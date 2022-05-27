import axios from 'axios';
import { clearStore } from '../features/user/userSlice';
import { getTokenFromLocalStorage } from './localStorage';

const customFetch = axios.create({
  // baseURL: 'https://battery-cellify.herokuapp.com/',
  // baseURL: 'http://localhost:3000/',
  baseURL: 'http://127.0.0.1:8000/',
});

customFetch.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage();
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue('Session Expired! Logging Out...');
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};

export default customFetch;
