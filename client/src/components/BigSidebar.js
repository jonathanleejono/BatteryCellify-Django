import NavLinks from "./NavLinks";
import Logo from "../components/Logo";
import Wrapper from "../assets/wrappers/BigSidebar";
import { useSelector, useDispatch } from "react-redux";
import { setCreateBatteryCell } from "../features/batteryCell/batteryCellSlice";

const BigSidebar = () => {
  const { user, isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const toggle = () => {
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
          isSidebarOpen
            ? "sidebar-container "
            : "sidebar-container show-sidebar"
        }
      >
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
