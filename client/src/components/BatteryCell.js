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
  position,
  company,
  batteryCellLocation,
  batteryCellType,
  createdAt,
  status,
}) => {
  const dispatch = useDispatch();

  const date = moment(createdAt).format("MMM Do, YYYY");

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>
        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <BatteryCellInfo
            icon={<FaLocationArrow />}
            text={batteryCellLocation}
          />
          <BatteryCellInfo icon={<FaCalendarAlt />} text={date} />
          <BatteryCellInfo icon={<FaBriefcase />} text={batteryCellType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link
              to="/edit-batteryCell"
              className="btn edit-btn"
              onClick={() =>
                dispatch(
                  setEditBatteryCell({
                    editBatteryCellId: id,
                    position,
                    company,
                    batteryCellLocation,
                    batteryCellType,
                    status,
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
