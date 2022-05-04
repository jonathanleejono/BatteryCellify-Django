import { useEffect } from "react";
import { StatsContainer, Loading, ChartsContainer } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { showStats } from "../../features/allJobs/allJobsSlice";

const Graphs = () => {
  const { isLoading, monthlyApplications } = useSelector(
    (store) => store.allJobs
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showStats());
  }, [dispatch]);
  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};
export default Graphs;
