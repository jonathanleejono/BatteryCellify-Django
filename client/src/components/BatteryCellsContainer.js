import { useEffect } from "react";
import BatteryCell from "./BatteryCell";
import Wrapper from "../assets/wrappers/BatteryCellsContainer";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import { getAllBatteryCells } from "../features/allBatteryCells/allBatteryCellsSlice";
import PageBtnContainer from "./PageBtnContainer";
const BatteryCellsContainer = () => {
  const {
    batteryCells,
    isLoading,
    page,
    totalBatteryCells,
    numOfPages,
    search,
    searchStatus,
    searchType,
    sort,
  } = useSelector((store) => store.allBatteryCells);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBatteryCells());
  }, [dispatch, page, search, searchStatus, searchType, sort]);

  if (isLoading) {
    return <Loading />;
  }

  if (batteryCells.length === 0) {
    return (
      <Wrapper>
        <h2>No battery cells to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalBatteryCells} battery cell{batteryCells.length > 1 && "s"} found
      </h5>
      <div className="battery-cells">
        {batteryCells.map((batteryCell) => {
          return <BatteryCell key={batteryCell.id} {...batteryCell} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default BatteryCellsContainer;
