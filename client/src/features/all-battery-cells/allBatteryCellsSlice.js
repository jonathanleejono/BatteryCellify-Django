import { createSlice } from '@reduxjs/toolkit';
import { getAllBatteryCells, getAllBatteryCellsStats } from 'features/all-battery-cells/allBatteryCellsThunk';

const initialFiltersState = {
  cathode: '',
  anode: '',
  type: '',
  source: '',
};

const initialQueryParamsState = {
  cell_name_id: '',
  offset_skip: 0,
  limit: 20,
  sort_by: '',
  sort_direction: '',
  ...initialFiltersState,
};

const batteryCellTableState = {
  tableSelectedBatteryCells: [],
};

const batteryCellStatsState = {
  avg_capacity_ah: 0,
  avg_depth_of_discharge: 0,
  avg_temperature_c: 0,
  cell_stats_by_cathode: [],
};

const initialState = {
  isLoading: true,
  all_battery_cells: [],
  ...batteryCellStatsState,
  ...initialQueryParamsState,
  ...batteryCellTableState,
};

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
      state[name] = value;
    },
    clearFilters: (state) => ({ ...state, ...initialFiltersState }),
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    clearAllBatteryCellsState: (state) => ({ ...state, ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBatteryCells.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBatteryCells.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        // make this only payload and not payload.all_battery_cells
        // because there's no key to destructure
        state.all_battery_cells = payload;
      })
      .addCase(getAllBatteryCells.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllBatteryCellsStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBatteryCellsStats.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.avg_capacity_ah = payload.avg_capacity_ah;
        state.avg_depth_of_discharge = payload.avg_depth_of_discharge;
        state.avg_temperature_c = payload.avg_temperature_c;
        state.cell_stats_by_cathode = payload.cell_stats_by_cathode;
      })
      .addCase(getAllBatteryCellsStats.rejected, (state) => {
        state.isLoading = false;
      });
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
