import {
  BatteryCellsContainer,
  SearchContainer,
  EnhancedTable,
  DataGridTable,
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
      {/* <h1>Battery Cell List</h1> */}
      <Link
        to="/add-battery-cell"
        className="btn btn-hero"
        onClick={() => dispatch(clearValues())}
      >
        Add Battery Cell
      </Link>
      <div>&nbsp;</div>
      {/* its here */} <EnhancedTable />
    </>
  );
};
export default AllBatteryCells;
