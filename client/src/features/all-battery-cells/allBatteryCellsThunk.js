import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBatteryCellsListUrl, getAllBatteryCellsStatsUrl } from 'constants/apiUrls';
import customFetch from 'utils/axios';
import { checkForUnauthorizedResponse } from 'utils/checkForUnauthorizedResponse';

export const getAllBatteryCells = createAsyncThunk('allBatteryCells/getBatteryCells', async (_, thunkAPI) => {
  const { cathode, anode, type, source, cell_name_id, sort_by, sort_direction, offset_skip, limit } =
    thunkAPI.getState().allBatteryCells;

  try {
    const resp = await customFetch.get(`${getAllBatteryCellsListUrl}`, {
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
    const resp = await customFetch.get(`${getAllBatteryCellsStatsUrl}`);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
});
