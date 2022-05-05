import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/BatteryCell";
import { useDispatch } from "react-redux";
import BatteryCellInfo from "./BatteryCellInfo";
import moment from "moment";
import {
  deleteBatteryCell,
  setEditBatteryCell,
} from "../features/batteryCell/batteryCellSlice";
const BatteryCell = ({
  id,
  cellNameId,
  cycles,
  cathode,
  anode,
  capacityAh,
  type,
  source,
  temperatureC,
  maxStateOfCharge,
  minStateOfCharge,
  depthOfDischarge,
  chargeCapacityRate,
  dischargeCapacityRate,
  createdAt,
}) => {
  const dispatch = useDispatch();

  const date = moment(createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{cellNameId.charAt(0)}</div>
        <div className="info">
          <h5>{cellNameId}</h5>
          <p>{type}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <BatteryCellInfo icon={<FaLocationArrow />} text={cycles} />
          <BatteryCellInfo icon={<FaCalendarAlt />} text={date} />
          <BatteryCellInfo icon={<FaBriefcase />} text={cathode} />
          <BatteryCellInfo icon={<FaBriefcase />} text={anode} />
          <BatteryCellInfo icon={<FaBriefcase />} text={capacityAh} />
          <BatteryCellInfo icon={<FaBriefcase />} text={type} />
          <BatteryCellInfo icon={<FaBriefcase />} text={source} />
          <BatteryCellInfo icon={<FaBriefcase />} text={temperatureC} />
          <BatteryCellInfo icon={<FaBriefcase />} text={maxStateOfCharge} />
          <BatteryCellInfo icon={<FaBriefcase />} text={minStateOfCharge} />
          <BatteryCellInfo icon={<FaBriefcase />} text={depthOfDischarge} />
          <BatteryCellInfo icon={<FaBriefcase />} text={chargeCapacityRate} />
          <BatteryCellInfo
            icon={<FaBriefcase />}
            text={dischargeCapacityRate}
          />
          <div className={`type ${type}`}>{type}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/edit-battery-cell"
              className="btn edit-btn"
              onClick={() =>
                dispatch(
                  setEditBatteryCell({
                    editBatteryCellId: id,
                    cellNameId,
                    cycles,
                    cathode,
                    anode,
                    capacityAh,
                    type,
                    source,
                    temperatureC,
                    maxStateOfCharge,
                    minStateOfCharge,
                    depthOfDischarge,
                    chargeCapacityRate,
                    dischargeCapacityRate,
                  })
                )
              }
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn delete-btn"
              onClick={() => dispatch(deleteBatteryCell(id))}
            >
              delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default BatteryCell;
