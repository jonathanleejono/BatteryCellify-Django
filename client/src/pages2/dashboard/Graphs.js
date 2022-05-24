import { useEffect } from 'react';
import { Loading, ChartsContainer, PlotlyComponent, PlotTest } from '../../components2';
import { useDispatch, useSelector } from 'react-redux';

const Graphs = () => {
  const { isLoading, monthlyApplications } = useSelector((store) => store.allBatteryCells);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(showStats());
  // }, [dispatch]);
  return (
    <>
      <h2>Graphs</h2>
      <PlotlyComponent />
      <PlotTest />
      {/* <StatsContainer />s
      {monthlyApplications.length > 0 && <ChartsContainer />} */}
    </>
  );
};
export default Graphs;
