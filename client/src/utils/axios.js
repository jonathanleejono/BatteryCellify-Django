import axios from "axios";
import { clearStore } from "../features/user/userSlice";
import { getTokenFromLocalStorage } from "./localStorage";

const customFetch = axios.create({
  // baseURL: "https://jobify-prod.herokuapp.com/api/v1/toolkit",
  baseURL: "http://localhost:3000",
  // baseURL: "https://cryptic-harbor-02513.herokuapp.com/",
  // headers: {
  //   "Content-type": "application/json",
  // },
});

customFetch.interceptors.request.use((config) => {
  // const result = localStorage.getItem("user");
  // const user = result ? JSON.parse(result) : null;
  const token = getTokenFromLocalStorage();
  if (token) {
    config.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const checkForUnauthorizedResponse = (error, thunkAPI) => {
  if (error.response.status === 401) {
    thunkAPI.dispatch(clearStore());
    return thunkAPI.rejectWithValue("Unauthorized! Logging Out...");
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};

export default customFetch;
