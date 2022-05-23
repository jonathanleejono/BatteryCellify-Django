import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/BatteryCell';
import { useDispatch } from 'react-redux';
import BatteryCellInfo from './BatteryCellInfo';
import moment from 'moment';
import { deleteBatteryCell, setEditBatteryCell } from '../features/batteryCell/batteryCellSlice';
const BatteryCell = ({
  id,
  cell_name_id,
  cycles,
  cathode,
  anode,
  capacity_ah,
  type,
  source,
  temperature_c,
  max_state_of_charge,
  min_state_of_charge,
  depth_of_discharge,
  charge_capacity_rate,
  discharge_capacity_rate,
  createdAt,
}) => {
  const dispatch = useDispatch();

  const date = moment(createdAt).format('MMM Do, YYYY');

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{cell_name_id.charAt(0)}</div>
        <div className="info">
          <h5>{cell_name_id}</h5>
          <p>{type}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <BatteryCellInfo icon={<FaLocationArrow />} text={cycles} />
          <BatteryCellInfo icon={<FaCalendarAlt />} text={date} />
          <BatteryCellInfo icon={<FaBriefcase />} text={cathode} />
          <BatteryCellInfo icon={<FaBriefcase />} text={anode} />
          <BatteryCellInfo icon={<FaBriefcase />} text={capacity_ah} />
          <BatteryCellInfo icon={<FaBriefcase />} text={type} />
          <BatteryCellInfo icon={<FaBriefcase />} text={source} />
          <BatteryCellInfo icon={<FaBriefcase />} text={temperature_c} />
          <BatteryCellInfo icon={<FaBriefcase />} text={max_state_of_charge} />
          <BatteryCellInfo icon={<FaBriefcase />} text={min_state_of_charge} />
          <BatteryCellInfo icon={<FaBriefcase />} text={depth_of_discharge} />
          <BatteryCellInfo icon={<FaBriefcase />} text={charge_capacity_rate} />
          <BatteryCellInfo icon={<FaBriefcase />} text={discharge_capacity_rate} />
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
                    id,
                    cell_name_id,
                    cycles,
                    cathode,
                    anode,
                    capacity_ah,
                    type,
                    source,
                    temperature_c,
                    max_state_of_charge,
                    min_state_of_charge,
                    depth_of_discharge,
                    charge_capacity_rate,
                    discharge_capacity_rate,
                  })
                )
              }
            >
              Edit
            </Link>
            <button type="button" className="btn delete-btn" onClick={() => dispatch(deleteBatteryCell(id))}>
              delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};
export default BatteryCell;
