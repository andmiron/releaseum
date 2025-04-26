import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function GuestRoute() {
  const session = useAuthStore((state) => state.session);

  return session ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
