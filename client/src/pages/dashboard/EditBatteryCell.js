import { FormRow, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  handleChange,
  clearValues,
  editBatteryCell,
} from "../../features/batteryCell/batteryCellSlice";

const EditBatteryCell = () => {
  const {
    isLoading,
    cellNameId,
    cycles,
    cathode,
    cathodeOptions,
    anode,
    anodeOptions,
    capacityAh,
    type,
    typeOptions,
    source,
    sourceOptions,
    temperatureC,
    maxStateOfCharge,
    minStateOfCharge,
    depthOfDischarge,
    chargeCapacityRate,
    dischargeCapacityRate,
  } = useSelector((store) => store.batteryCell);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!position || !company || !batteryCellLocation) {
      toast.error("Please fill out all fields");
      return;
    }
    dispatch(
      editBatteryCell({
        cellNameId,
        cycles,
        cathode: cathode ? cathode : "LCO",
        anode: anode ? anode : "graphite",
        capacityAh,
        type: type ? type : "18650",
        source: source ? source : "HNEI",
        temperatureC,
        maxStateOfCharge,
        minStateOfCharge,
        depthOfDischarge,
        chargeCapacityRate,
        dischargeCapacityRate,
      })
    );
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
            name="cellNameId"
            labelText="Cell Name Id"
            value={cellNameId}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
            name="cycles"
            labelText="Cycles"
            value={cycles}
            handleChange={handleBatteryCellInput}
          />
          <FormRow
            type="text"
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
          <FormRowSelect
            name="capacityAh"
            labelText="Capacity (Ah)"
            value={capacityAh}
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
          <FormRowSelect
            name="temperatureC"
            labelText="Temperature (C)"
            value={temperatureC}
            handleChange={handleBatteryCellInput}
          />
          <FormRowSelect
            name="maxStateOfCharge"
            labelText="Max State of Charge"
            value={maxStateOfCharge}
            handleChange={handleBatteryCellInput}
          />
          <FormRowSelect
            name="minStateOfCharge"
            labelText="Min State of Charge"
            value={minStateOfCharge}
            handleChange={handleBatteryCellInput}
          />
          <FormRowSelect
            name="depthOfDischarge"
            labelText="Depth of Discharge"
            value={depthOfDischarge}
            handleChange={handleBatteryCellInput}
          />
          <FormRowSelect
            name="chargeCapacityRate"
            labelText="Charge Capacity Rate"
            value={chargeCapacityRate}
            handleChange={handleBatteryCellInput}
          />
          <FormRowSelect
            name="dischargeCapacityRate"
            labelText="Discharge Capacity Rate"
            value={dischargeCapacityRate}
            handleChange={handleBatteryCellInput}
          />
          <div className="btn-container">
            <button
              type="button"
              className="btn btn-block clear-btn"
              onClick={() => dispatch(clearValues())}
            >
              clear
            </button>
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default EditBatteryCell;
