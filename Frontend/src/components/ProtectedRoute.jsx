import React from "react";
import { Navigate } from "react-router-dom";
import { setAuthToken } from "../api";

export default function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("scrumbot_token");
  const role = localStorage.getItem("scrumbot_role");

  if (!token) return <Navigate to="/" replace />;

  setAuthToken(token);

  if (roleRequired && role !== roleRequired)
    return <Navigate to="/" replace />;

  return children;
}
