import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createBatteryCellThunk, deleteBatteryCellThunk, editBatteryCellThunk } from 'batteryCellThunk';
import { toast } from 'react-toastify';

const initialState = {
  id: '',
  isLoading: false,
  cell_name_id: '',
  cycles: '',
  // cathodeOptions: ['LCO', 'LFP', 'NCA', 'NMC', 'NMC-LCO'],
  cathodeOptions: [
    {
      value: 'LCO',
      label: 'LCO',
    },
    {
      value: 'LFP',
      label: 'LFP',
    },
    {
      value: 'NCA',
      label: 'NCA',
    },
    {
      value: 'NMC-LCO',
      label: 'NMC-LCO',
    },
  ],
  cathode: 'LCO',
  anodeOptions: [
    {
      value: 'graphite',
      label: 'Graphite',
    },
  ],
  anode: 'graphite',
  capacity_ah: '',
  // typeOptions: ['18650', 'pouch', 'prismatic'],
  typeOptions: [
    {
      value: '18650',
      label: '18650',
    },
    {
      value: 'pouch',
      label: 'Pouch',
    },
    {
      value: 'prismatic',
      label: 'Prismatic',
    },
  ],
  type: '18650',
  // sourceOptions: ['HNEI', 'UL-PUR', 'calce', 'oxford', 'snl'],
  sourceOptions: [
    {
      value: 'HNEI',
      label: 'HNEI',
    },
    {
      value: 'UL-PUR',
      label: 'UL-PUR',
    },
    {
      value: 'calce',
      label: 'Calce',
    },
    {
      value: 'oxford',
      label: 'Oxford',
    },
    {
      value: 'snl',
      label: 'Snl',
    },
  ],
  source: 'HNEI',
  temperature_c: '',
  max_state_of_charge: '',
  min_state_of_charge: '',
  depth_of_discharge: '',
  charge_capacity_rate: '',
  discharge_capacity_rate: '',
  editBatteryCellId: '',
};

export const createBatteryCell = createAsyncThunk('batteryCell/createBatteryCell', createBatteryCellThunk);

export const deleteBatteryCell = createAsyncThunk('batteryCell/deleteBatteryCell', deleteBatteryCellThunk);

export const editBatteryCell = createAsyncThunk('batteryCell/editBatteryCell', editBatteryCellThunk);

const batteryCellSlice = createSlice({
  name: 'batteryCell',
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: () => {
      return {
        ...initialState,
      };
    },
    setEditBatteryCell: (state, { payload }) => {
      return { ...state, ...payload };
    },
  },
  extraReducers: {
    [createBatteryCell.pending]: (state) => {
      state.isLoading = true;
    },
    [createBatteryCell.fulfilled]: (state) => {
      state.isLoading = false;
      toast.success('Battery Cell Created');
    },
    [createBatteryCell.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
    [deleteBatteryCell.fulfilled]: (state, { payload }) => {
      toast.success(payload);
    },
    [deleteBatteryCell.rejected]: (state, { payload }) => {
      toast.error(payload);
    },
    [editBatteryCell.pending]: (state) => {
      state.isLoading = true;
    },
    [editBatteryCell.fulfilled]: (state) => {
      state.isLoading = false;
      toast.success('Battery Cell Modified...');
    },
    [editBatteryCell.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload);
    },
  },
});

export const { handleChange, clearValues, setEditBatteryCell } = batteryCellSlice.actions;

export default batteryCellSlice.reducer;
