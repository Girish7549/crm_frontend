import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const storedUser = localStorage.getItem("user");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  // console.log("User from Context:", user);
  // console.log("User from LocalStorage:", storedUser);

  if (!currentUser) return <Navigate to="/" />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/404" />;

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
