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
  avgTemp18650Cells: 0,
  avgMaxSoC18650Cells: 0,
  avgMinSoC18650Cells: 0,
  avgDoD18650Cells: 0,
  avgChargeCRate18650Cells: 0,
  avgDischargeCRate18650Cells: 0,
  avgTempPouchCells: 0,
  avgMaxSoCPouchCells: 0,
  avgMinSoCPouchCells: 0,
  avgDoDPouchCells: 0,
  avgChargeCRatePouchCells: 0,
  avgDischargeCRatePouchCells: 0,
  avgTempPrismaticCells: 0,
  avgMaxSoCPrismaticCells: 0,
  avgMinSoCPrismaticCells: 0,
  avgDoDPrismaticCells: 0,
  avgChargeCRatePrismaticCells: 0,
  avgDischargeCRatePrismaticCells: 0,
  numOfPages: 1,
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
      state.avgTemp18650Cells = payload.avgTemp18650Cells;
      state.avgMaxSoC18650Cells = payload.avgMaxSoC18650Cells;
      state.avgMinSoC18650Cells = payload.avgMinSoC18650Cells;
      state.avgDoD18650Cells = payload.avgDoD18650Cells;
      state.avgChargeCRate18650Cells = payload.avgChargeCRate18650Cells;
      state.avgDischargeCRate18650Cells = payload.avgDischargeCRate18650Cells;
      state.avgTempPouchCells = payload.avgTempPouchCells;
      state.avgMaxSoCPouchCells = payload.avgMaxSoCPouchCells;
      state.avgMinSoCPouchCells = payload.avgMinSoCPouchCells;
      state.avgDoDPouchCells = payload.avgDoDPouchCells;
      state.avgChargeCRatePouchCells = payload.avgChargeCRatePouchCells;
      state.avgDischargeCRatePouchCells = payload.avgDischargeCRatePouchCells;
      state.avgTempPrismaticCells = payload.avgTempPrismaticCells;
      state.avgMaxSoCPrismaticCells = payload.avgMaxSoCPrismaticCells;
      state.avgMinSoCPrismaticCells = payload.avgMinSoCPrismaticCells;
      state.avgDoDPrismaticCells = payload.avgDoDPrismaticCells;
      state.avgChargeCRatePrismaticCells = payload.avgChargeCRatePrismaticCells;
      state.avgDischargeCRatePrismaticCells = payload.avgDischargeCRatePrismaticCells;
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
