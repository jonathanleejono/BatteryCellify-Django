import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  { id: 1, text: "stats", path: "/", icon: <IoBarChartSharp /> },
  {
    id: 2,
    text: "all battery cells",
    path: "all-battery-cells",
    icon: <MdQueryStats />,
  },
  {
    id: 3,
    text: "add battery cell",
    path: "add-battery-cell",
    icon: <FaWpforms />,
  },
  { id: 4, text: "graphs", path: "graphs", icon: <FaWpforms /> },
  { id: 5, text: "profile", path: "profile", icon: <ImProfile /> },
];

export default links;
