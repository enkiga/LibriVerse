import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedLayout = () => {
  const { user, loading } = useUser();

  if (loading) return <LoadingSpinner />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
