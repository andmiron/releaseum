import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoadingOverlay } from "@mantine/core";

export function ProtectedRoute() {
  const session = useAuthStore((state) => state.session);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <LoadingOverlay visible />;
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
}
