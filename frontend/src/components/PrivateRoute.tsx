import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
  requiredRole?: string;
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { token, roles } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

