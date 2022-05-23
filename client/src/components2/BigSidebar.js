import NavLinks from './NavLinks';
import Logo from './Logo';
import Wrapper from '../assets/wrappers/BigSidebar';
import { useSelector, useDispatch } from 'react-redux';
import { setCreateBatteryCell } from '../features/batteryCell/batteryCellSlice';

const BigSidebar = () => {
  const { user, isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(
      setCreateBatteryCell({
        cell_name_id: '',
        cycles: '',
        cathode: 'LCO',
        anode: 'graphite',
        capacity_ah: '',
        type: '18650',
        source: 'HNEI',
        temperature_c: '',
        max_state_of_charge: '',
        min_state_of_charge: '',
        depth_of_discharge: '',
        charge_capacity_rate: '',
        discharge_capacity_rate: '',
      })
    );
  };
  return (
    <Wrapper>
      <div className={isSidebarOpen ? 'sidebar-container ' : 'sidebar-container show-sidebar'}>
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
