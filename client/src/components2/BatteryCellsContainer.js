import { useEffect } from 'react';
import BatteryCell from './BatteryCell';
import Wrapper from '../assets/wrappers/BatteryCellsContainer';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';
import { getAllBatteryCells } from '../features/allBatteryCells/allBatteryCellsSlice';
import PageBtnContainer from './PageBtnContainer';
const BatteryCellsContainer = () => {
  const {
    battery_cells,
    isLoading,
    page,
    total_battery_cells,
    numOfPages,
    search,
    searchCathode,
    searchAnode,
    searchType,
    searchSource,
  } = useSelector((store) => store.allBatteryCells);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, page, search, searchCathode, searchAnode, searchType, searchSource]);

  if (isLoading) {
    return <Loading />;
  }

  if (battery_cells.length === 0) {
    return (
      <Wrapper>
        <h2>No battery cells to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {total_battery_cells} battery cell{battery_cells.length > 1 && 's'} found
      </h5>
      <div className="battery-cells">
        {battery_cells.map((batteryCell) => {
          return <BatteryCell key={batteryCell.id} {...batteryCell} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default BatteryCellsContainer;
