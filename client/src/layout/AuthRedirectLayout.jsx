import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthRedirectLayout = () => {
  const { user, loading } = useUser();

  if (loading) return <LoadingSpinner />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRedirectLayout;
