import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllBatteryCellsThunk, showStatsThunk } from './allBatteryCellsThunk';

const initialFiltersState = {
  search: '',
  searchCathode: '',
  searchAnode: '',
  searchType: '',
  searchSource: '',
};

const initialState = {
  isLoading: true,
  batteryCells: [],
  totalBatteryCells: 0,
  averageCapacity: 0,
  averageDepthOfDischarge: 0,
  averageTemperatureC: 0,
  totalCathodeLCOCells: 0,
  totalCathodeLFPCells: 0,
  totalCathodeNCACells: 0,
  totalCathodeNMCCells: 0,
  totalCathodeNMCLCOCells: 0,
  avgCyclesLC0Cells: 0,
  avgCyclesLFPCells: 0,
  avgCyclesNCACells: 0,
  avgCyclesNMCCells: 0,
  avgCyclesNMCLCOCells: 0,
  page: 1,
  stats: {},
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllBatteryCells = createAsyncThunk('allBatteryCells/getBatteryCells', getAllBatteryCellsThunk);

export const showStats = createAsyncThunk('allBatteryCells/showStats', showStatsThunk);

const allBatteryCellsSlice = createSlice({
  name: 'allBatteryCells',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChangeAllBatteryCells: (state, { payload: { name, value } }) => {
      state.page = 1;
      state[name] = value;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    clearState: (state) => {
      return { ...state, ...initialState };
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
      state.totalBatteryCells = payload.totalBatteryCells;
      state.averageCapacity = payload.averageCapacity;
      state.averageDepthOfDischarge = payload.averageDepthOfDischarge;
      state.averageTemperatureC = payload.averageTemperatureC;
      state.totalCathodeLCOCells = payload.totalCathodeLCOCells;
      state.totalCathodeLFPCells = payload.totalCathodeLFPCells;
      state.totalCathodeNCACells = payload.totalCathodeNCACells;
      state.totalCathodeNMCCells = payload.totalCathodeNMCCells;
      state.totalCathodeNMCLCOCells = payload.totalCathodeNMCLCOCells;
      state.avgCyclesLC0Cells = payload.avgCyclesLC0Cells;
      state.avgCyclesLFPCells = payload.avgCyclesLFPCells;
      state.avgCyclesNCACells = payload.avgCyclesNCACells;
      state.avgCyclesNMCCells = payload.avgCyclesNMCCells;
      state.avgCyclesNMCLCOCells = payload.avgCyclesNMCLCOCells;
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
  handleChangeAllBatteryCells,
  clearFilters,
  clearState,
  changePage,
  clearAllBatteryCellsState,
} = allBatteryCellsSlice.actions;

export default allBatteryCellsSlice.reducer;
