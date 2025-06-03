import { useEffect } from "react";
import { handleLogout } from "../controllers/authController";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    handleLogout().then(() => navigate("/login"));
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
