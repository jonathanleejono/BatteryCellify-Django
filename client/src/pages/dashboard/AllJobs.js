import {
  JobsContainer,
  SearchContainer,
  EnhancedTable,
} from "../../components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  handleChange,
  clearValues,
  createJob,
  editJob,
  setEditJob,
} from "../../features/job/jobSlice";

const AllJobs = () => {
  const dispatch = useDispatch();
  return (
    <>
      <SearchContainer />
      {/* <Link
        to="/add-job"
        className="btn btn-hero"
        onClick={() => dispatch(clearValues())}
      >
        Create Job
      </Link> */}
      {/* its here */}
      <EnhancedTable />
      <JobsContainer />
    </>
  );
};
export default AllJobs;
