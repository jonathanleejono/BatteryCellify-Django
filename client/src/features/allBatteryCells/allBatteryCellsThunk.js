import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";

export const getAllBatteryCellsThunk = async (_, thunkAPI) => {
  const { page, search, searchCathode, searchAnode, searchType, searchSource } =
    thunkAPI.getState().allBatteryCells;

  // do not push query params on to separate lines or the query param functionality won't work properly
  let url = `/battery-cells?cathode=${searchCathode}&anode=${searchAnode}&type=${searchType}&source=${searchSource}&page=${page}`;

  if (search) {
    url = url + `&search=${search}`;
  }

  try {
    const resp = await customFetch.get(url);
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};

export const showStatsThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get("/stats");

    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
