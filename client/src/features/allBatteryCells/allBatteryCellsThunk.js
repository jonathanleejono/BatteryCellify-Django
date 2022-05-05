import customFetch, { checkForUnauthorizedResponse } from "../../utils/axios";

export const getAllBatteryCellsThunk = async (_, thunkAPI) => {
  const { page, search, searchCathode, searchAnode, searchtype, searchSource } =
    thunkAPI.getState().allBatteryCells;

  let url = `/battery-cells?cathode=${searchCathode}
  &anode=${searchAnode}
  &type=${searchtype}
  &source=${searchSource}`;

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
