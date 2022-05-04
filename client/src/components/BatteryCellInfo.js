import Wrapper from "../assets/wrappers/BatteryCellInfo";

const BatteryCellInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="icon">{icon} </span>
      <span className="text">{text} </span>
    </Wrapper>
  );
};
export default BatteryCellInfo;
