import { createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from 'utils/axios';
import { checkForUnauthorizedResponse } from 'utils/checkForUnauthorizedResponse';

export const getAllBatteryCells = createAsyncThunk('allBatteryCells/getBatteryCells', async (_, thunkAPI) => {
  const { cathode, anode, type, source, cell_name_id, sort_by, sort_direction, offset_skip, limit } =
    thunkAPI.getState().allBatteryCells;

  try {
    const resp = await customFetch.get('/api/battery-cells/list', {
      params: {
        cathode,
        anode,
        type,
        source,
        cell_name_id,
        sort_by,
        sort_direction,
        offset_skip,
        limit,
      },
    });
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
});

export const getAllBatteryCellsStats = createAsyncThunk('allBatteryCells/getBatteryCellsStats', async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get('/api/battery-cells/stats');
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
});
