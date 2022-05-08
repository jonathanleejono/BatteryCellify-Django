import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getAllBatteryCellsThunk,
  showStatsThunk,
} from "./allBatteryCellsThunk";

const initialFiltersState = {
  search: "",
  searchCathode: "all",
  searchAnode: "all",
  searchType: "all",
  searchSource: "all",
};

const initialState = {
  isLoading: true,
  batteryCells: [],
  totalBatteryCells: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllBatteryCells = createAsyncThunk(
  "allBatteryCells/getBatteryCells",
  getAllBatteryCellsThunk
);

export const showStats = createAsyncThunk(
  "allBatteryCells/showStats",
  showStatsThunk
);

const allBatteryCellsSlice = createSlice({
  name: "allBatteryCells",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    clearAllBatteryCellsState: (state) => initialState,
  },
  extraReducers: {
    [getAllBatteryCells.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllBatteryCells.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.batteryCells = payload.batteryCells;
      state.numOfPages = payload.numOfPages;
      state.totalBatteryCells = payload.totalBatteryCells;
    },
    [getAllBatteryCells.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [showStats.pending]: (state) => {
      state.isLoading = true;
    },
    [showStats.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.stats = payload.defaultStats;
      state.monthlyApplications = payload.monthlyApplications;
    },
    [showStats.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  changePage,
  clearAllBatteryCellsState,
} = allBatteryCellsSlice.actions;

export default allBatteryCellsSlice.reducer;