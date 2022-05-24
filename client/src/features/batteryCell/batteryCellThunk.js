import { showLoading, hideLoading, getAllBatteryCells } from '../allBatteryCells/allBatteryCellsSlice';
import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';
import { clearValues } from './batteryCellSlice';

export const createBatteryCellThunk = async (
  {
    cell_name_id,
    cycles,
    cathode,
    anode,
    capacity_ah,
    type,
    source,
    temperature_c,
    max_state_of_charge,
    min_state_of_charge,
    depth_of_discharge,
    charge_capacity_rate,
    discharge_capacity_rate,
  },
  thunkAPI
) => {
  // very important to add slashs at end of path (eg. '/battery-cells/')
  // this is so urls can navigate properly
  try {
    const resp = await customFetch.post('/battery-cells/', {
      cell_name_id,
      cycles,
      cathode,
      anode,
      capacity_ah,
      type,
      source,
      temperature_c,
      max_state_of_charge,
      min_state_of_charge,
      depth_of_discharge,
      charge_capacity_rate,
      discharge_capacity_rate,
    });
    thunkAPI.dispatch(clearValues());
    return resp.data;
  } catch (err) {
    return (
      checkForUnauthorizedResponse(err, thunkAPI),
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
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
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
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
      thunkAPI.rejectWithValue(err.response.data.detail || err.response.data.error)
    );
  }
};
