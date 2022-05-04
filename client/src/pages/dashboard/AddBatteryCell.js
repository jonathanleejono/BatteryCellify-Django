import { FormRow, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  handleChange,
  clearValues,
  createBatteryCell,
  editBatteryCell,
} from "../../features/batteryCell/batteryCellSlice";

const AddBatteryCell = () => {
  const {
    isLoading,
    position,
    company,
    batteryCellLocation,
    batteryCellType,
    batteryCellTypeOptions,
    status,
    statusOptions,
    editBatteryCellId,
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
      createBatteryCell({
        position: position,
        company: company,
        batteryCellLocation: batteryCellLocation
          ? batteryCellLocation
          : "my city",
        batteryCellType: batteryCellType ? batteryCellType : "full-time",
        status: status ? status : "pending",
      })
    );
    console.log("does submit work?");
  };

  const handleBatteryCellInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({ name, value }));
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>Add BatteryCell</h3>
        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleBatteryCellInput}
          />
          {/* company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleBatteryCellInput}
          />
          {/* batteryCellLocation */}
          <FormRow
            type="text"
            name="batteryCellLocation"
            labelText="batteryCell location"
            value={batteryCellLocation}
            handleChange={handleBatteryCellInput}
          />
          {/* status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleBatteryCellInput}
            list={statusOptions}
          />
          {/* batteryCell type*/}
          <FormRowSelect
            name="batteryCellType"
            labelText="batteryCell type"
            value={batteryCellType}
            handleChange={handleBatteryCellInput}
            list={batteryCellTypeOptions}
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
export default AddBatteryCell;
