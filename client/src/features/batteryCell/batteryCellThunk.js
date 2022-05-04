import {
  showLoading,
  hideLoading,
  getAllBatteryCells,
} from "../allBatteryCells/allBatteryCellsSlice";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { clearValues } from "./batteryCellSlice";

export const createBatteryCellThunk = async (
  { position, company, batteryCellLocation, batteryCellType, status },
  thunkAPI
) => {
  try {
    const resp = await customFetch.post("/battery-cells", {
      position,
      company,
      batteryCellLocation,
      batteryCellType,
      status,
    });
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
export const deleteBatteryCellThunk = async (batteryCellId, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/battery-cells/${batteryCellId}`);
    thunkAPI.dispatch(getAllBatteryCells());
    return resp.data.msg;
  } catch (err) {
    thunkAPI.dispatch(hideLoading());
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
export const editBatteryCellThunk = async (
  { batteryCellId, batteryCell },
  thunkAPI
) => {
  try {
    const resp = await customFetch.patch(
      `/battery-cells/${batteryCellId}`,
      batteryCell
    );
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(
        err.response.data.detail || err.response.data.error
      )
    );
  }
};
