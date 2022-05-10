import Wrapper from "../assets/wrappers/SmallSidebar";
import { FaTimes } from "react-icons/fa";
import Logo from "./Logo";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/user/userSlice";
import { setCreateBatteryCell } from "../features/batteryCell/batteryCellSlice";
import NavLinks from "./NavLinks";
const SmallSidebar = () => {
  const { user, isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());

    dispatch(
      setCreateBatteryCell({
        cellNameId: "",
        cycles: "",
        cathode: "LCO",
        anode: "graphite",
        capacityAh: "",
        type: "18650",
        source: "HNEI",
        temperatureC: "",
        maxStateOfCharge: "",
        minStateOfCharge: "",
        depthOfDischarge: "",
        chargeCapacityRate: "",
        dischargeCapacityRate: "",
      })
    );
  };

  return (
    <Wrapper>
      <div
        className={
          isSidebarOpen ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button className="close-btn" onClick={toggle}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks toggleSidebar={toggle} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
