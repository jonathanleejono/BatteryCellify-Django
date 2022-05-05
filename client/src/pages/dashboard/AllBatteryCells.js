import {
  BatteryCellsContainer,
  SearchContainer,
  EnhancedTable,
} from "../../components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  handleChange,
  clearValues,
  createBatteryCell,
  editBatteryCell,
  setEditBatteryCell,
} from "../../features/batteryCell/batteryCellSlice";

const AllBatteryCells = () => {
  const dispatch = useDispatch();
  return (
    <>
      <SearchContainer />
      <Link
        to="/add-battery-cell"
        className="btn btn-hero"
        onClick={() => dispatch(clearValues())}
      >
        Create BatteryCell
      </Link>
      {/* its here */}
      <EnhancedTable />
      <BatteryCellsContainer />
    </>
  );
};
export default AllBatteryCells;
