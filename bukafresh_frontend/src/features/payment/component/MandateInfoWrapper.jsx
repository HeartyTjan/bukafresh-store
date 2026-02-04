import { useLocation, useNavigate } from "react-router-dom";
import MandateInfo from "./MandateInfoPage";
const MandateInfoWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryDay = location.state?.deliveryDay || "Saturday";

  return (
    <MandateInfo
      deliveryDay={deliveryDay}
      onGoToDashboard={() => navigate("/dashboard")}
    />
  );
};

export default MandateInfoWrapper;
