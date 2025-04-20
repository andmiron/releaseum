import { Routes, Route } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Overview } from "../pages/Overview";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Projects } from "../pages/Projects";
import { NewProject } from "../pages/NewProject";

export function BaseRouter() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>

      <Route path="/dashboard">
        <Route element={<DashboardLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Overview />} />

            <Route path="projects">
              <Route index element={<Projects />} />
              <Route path="new" element={<NewProject />} />
            </Route>

            <Route path="documents" element={<div>Documents Page</div>} />
            <Route path="profile" element={<div>Profile Page</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
