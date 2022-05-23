import { FormRow, FormRowSelect } from '../../components2';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { handleChange, clearValues, editBatteryCell } from '../../features/batteryCell/batteryCellSlice';

const EditBatteryCell = () => {
  const {
    isLoading,
    cell_name_id,
    cycles,
    cathode,
    cathodeOptions,
    anode,
    anodeOptions,
    capacity_ah,
    type,
    typeOptions,
    source,
    sourceOptions,
    temperature_c,
    max_state_of_charge,
    min_state_of_charge,
    depth_of_discharge,
    charge_capacity_rate,
    discharge_capacity_rate,
    id,
  } = useSelector((store) => store.batteryCell);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !cell_name_id ||
      !cycles ||
      !capacity_ah ||
      !temperature_c ||
      !max_state_of_charge ||
      !min_state_of_charge ||
      !depth_of_discharge ||
      !charge_capacity_rate ||
      !discharge_capacity_rate
    ) {
      toast.error('Please fill out all fields');
      return;
    }
    dispatch(
      editBatteryCell({
        id,
        batteryCell: {
          cell_name_id,
          cycles,
          cathode,
          anode,
          capacity_ah,
          type,
          source,
          temperature_c,
          max_state_of_charge,
          min_state_of_charge,
          depth_of_discharge,
          charge_capacity_rate,
          discharge_capacity_rate,
        },
      })
    );
    console.log('id: ', id);
    console.log('cell_name_id, cycles: ', cell_name_id, cycles);
  };

  const handleBatteryCellInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>Edit Battery Cell</h3>
        <div className="form-center">
          <FormRow
            type="text"
            name="cell_name_id"
            labelText="Cell Name Id"
            value={cell_name_id}
            handleChange={handleBatteryCellInput}
          />
          <FormRow type="text" name="cycles" labelText="Cycles" value={cycles} handleChange={handleBatteryCellInput} />
          <FormRowSelect
            name="cathode"
            labelText="Cathode"
            value={cathode}
            handleChange={handleBatteryCellInput}
            list={cathodeOptions}
          />
          <FormRowSelect
            name="anode"
            labelText="Anode"
            value={anode}
            handleChange={handleBatteryCellInput}
            list={anodeOptions}
          />
          <FormRow
            type="text"
            name="capacity_ah"
            labelText="Capacity (Ah)"
            value={capacity_ah}
            handleChange={handleBatteryCellInput}
          />
          <FormRowSelect
            name="type"
            labelText="Type"
            value={type}
            handleChange={handleBatteryCellInput}
            list={typeOptions}
          />
          <FormRowSelect
            name="source"
            labelText="Source"
            value={source}
            handleChange={handleBatteryCellInput}
            list={sourceOptions}
          />
          <FormRow
            type="text"
            name="temperature_c"
            labelText="Temperature (C)"
            value={temperature_c}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
            name="max_state_of_charge"
            labelText="Max State of Charge"
            value={max_state_of_charge}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
            name="min_state_of_charge"
            labelText="Min State of Charge"
            value={min_state_of_charge}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
            name="depth_of_discharge"
            labelText="Depth of Discharge"
            value={depth_of_discharge}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
            name="charge_capacity_rate"
            labelText="Charge Capacity Rate"
            value={charge_capacity_rate}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
            name="discharge_capacity_rate"
            labelText="Discharge Capacity Rate"
            value={discharge_capacity_rate}
            handleChange={handleBatteryCellInput}
          />
          <div className="btn-container">
            <button type="button" className="btn btn-block clear-btn" onClick={() => dispatch(clearValues())}>
              clear
            </button>
            <button type="submit" className="btn btn-block submit-btn" onClick={handleSubmit} disabled={isLoading}>
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default EditBatteryCell;
