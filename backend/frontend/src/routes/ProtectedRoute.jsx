import { Navigate, useLocation } from "react-router-dom";
import LoadingIcon from "../components/general/LoadingIcon/LoadingIcon";
import useAuth from "../contexts/auth/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const loadingStyle = {
    position: "absolute",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: "50%",
  };

  if (isLoading)
    return (
      <div style={loadingStyle}>
        <LoadingIcon />
      </div>
    );
  if (!user) {
    localStorage.setItem("lastVisited", location.pathname);
    return <Navigate to="/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
