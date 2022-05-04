import NavLinks from "./NavLinks";
import Logo from "../components/Logo";
import Wrapper from "../assets/wrappers/BigSidebar";
import { useSelector, useDispatch } from "react-redux";
import { setCreateJob } from "../features/job/jobSlice";

const BigSidebar = () => {
  const { user, isSidebarOpen } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(
      setCreateJob({
        position: "",
        company: "",
        jobLocation: user.location,
        jobType: "full-time",
        status: "pending",
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
