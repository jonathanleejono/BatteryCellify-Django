import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllBatteryCellsThunk } from 'allBatteryCellsThunk';
import { toast } from 'react-toastify';

const initialFiltersState = {
  search: '',
  searchCathode: '',
  searchAnode: '',
  searchType: '',
  searchSource: '',
};

const initialState = {
  isLoading: true,
  battery_cells: [],
  total_battery_cells: 0,
  avg_capacity: 0,
  avg_depth_of_discharge: 0,
  avg_temperature_c: 0,
  total_cathode_lco_cells: 0,
  total_cathode_lfp_cells: 0,
  total_cathode_nca_cells: 0,
  total_cathode_nmc_cells: 0,
  total_cathode_nmclco_cells: 0,
  avg_cycles_lco_cells: 0,
  avg_cycles_lfp_cells: 0,
  avg_cycles_nca_cells: 0,
  avg_cycles_nmc_cells: 0,
  avg_cycles_nmclco_cells: 0,
  page: 1,
  monthlyApplications: [],
  ...initialFiltersState,
};

export const getAllBatteryCells = createAsyncThunk('allBatteryCells/getBatteryCells', getAllBatteryCellsThunk);

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
      state.battery_cells = payload.battery_cells;
      state.total_battery_cells = payload.total_battery_cells;
      state.avg_capacity = payload.avg_capacity;
      state.avg_depth_of_discharge = payload.avg_depth_of_discharge;
      state.avg_temperature_c = payload.avg_temperature_c;
      state.total_cathode_lco_cells = payload.total_cathode_lco_cells;
      state.total_cathode_lfp_cells = payload.total_cathode_lfp_cells;
      state.total_cathode_nca_cells = payload.total_cathode_nca_cells;
      state.total_cathode_nmc_cells = payload.total_cathode_nmc_cells;
      state.total_cathode_nmclco_cells = payload.total_cathode_nmclco_cells;
      state.avg_cycles_lco_cells = payload.avg_cycles_lco_cells;
      state.avg_cycles_lfp_cells = payload.avg_cycles_lfp_cells;
      state.avg_cycles_nca_cells = payload.avg_cycles_nca_cells;
      state.avg_cycles_nmc_cells = payload.avg_cycles_nmc_cells;
      state.avg_cycles_nmclco_cells = payload.avg_cycles_nmclco_cells;
    },
    [getAllBatteryCells.rejected]: (state, { payload }) => {
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
