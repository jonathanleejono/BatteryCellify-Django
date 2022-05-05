import {
  showLoading,
  hideLoading,
  getAllBatteryCells,
} from "../allBatteryCells/allBatteryCellsSlice";
import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";
import { clearValues } from "./batteryCellSlice";

export const createBatteryCellThunk = async (
  {
    cellNameId,
    cycles,
    cathode,
    anode,
    capacityAh,
    type,
    source,
    temperatureC,
    maxStateOfCharge,
    minStateOfCharge,
    depthOfDischarge,
    chargeCapacityRate,
    dischargeCapacityRate,
  },
  thunkAPI
) => {
  try {
    const resp = await customFetch.post("/battery-cells", {
      cellNameId,
      cycles,
      cathode,
      anode,
      capacityAh,
      type,
      source,
      temperatureC,
      maxStateOfCharge,
      minStateOfCharge,
      depthOfDischarge,
      chargeCapacityRate,
      dischargeCapacityRate,
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
export const deleteBatteryCellThunk = async (id, thunkAPI) => {
  thunkAPI.dispatch(showLoading());
  try {
    const resp = await customFetch.delete(`/battery-cells/${id}`);
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
export const editBatteryCellThunk = async ({ id, batteryCell }, thunkAPI) => {
  try {
    const resp = await customFetch.patch(`/battery-cells/${id}`, batteryCell);
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
