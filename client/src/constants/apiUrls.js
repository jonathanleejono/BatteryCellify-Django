export const baseApiUrl = process.env.REACT_APP_API_URL;

export const apiAuthUrl = `/api/auth`;
export const registerUserUrl = `${apiAuthUrl}/register`;
export const loginUserUrl = `${apiAuthUrl}/login`;
export const authUserUrl = `${apiAuthUrl}/user`;

export const apiBatteryCellsUrl = `/api/battery-cells`;
export const getAllBatteryCellsListUrl = `${apiBatteryCellsUrl}/list`;
export const getAllBatteryCellsStatsUrl = `${apiBatteryCellsUrl}/stats`;
export const createBatteryCellUrl = `${apiBatteryCellsUrl}/create`;

export const apiCsvUrl = `/api/battery-cells/csv`;
export const cycleDataUrl = `${apiCsvUrl}/cycle-data`;
export const timeSeriesDataUrl = `${apiCsvUrl}/time-series-data`;
