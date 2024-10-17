import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isLoaggedIn = localStorage.getItem("token");

  return isLoaggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
