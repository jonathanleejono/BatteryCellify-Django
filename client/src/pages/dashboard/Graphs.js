import { useEffect } from "react";
import {
  StatsContainer,
  Loading,
  ChartsContainer,
  PlotlyComponent,
  PlotTest,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { showStats } from "../../features/allBatteryCells/allBatteryCellsSlice";

const Graphs = () => {
  const { isLoading, monthlyApplications } = useSelector(
    (store) => store.allBatteryCells
  );

  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(showStats());
  // }, [dispatch]);
  return (
    <>
      <h2>Graphs</h2>
      <PlotlyComponent />
      <PlotTest />
      {/* <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />} */}
    </>
  );
};
export default Graphs;
