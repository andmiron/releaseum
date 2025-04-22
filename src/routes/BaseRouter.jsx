import { Routes, Route } from "react-router-dom";
import { BaseLayout } from "../layouts/BaseLayout";
import { HomePage } from "../pages/root/HomePage";
import { LoginPage } from "../pages/root/LoginPage";
import { RegisterPage } from "../pages/root/RegisterPage";
import { OverviewPage } from "../pages/root/OverviewPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProjectsPage } from "../pages/projects/ProjectsPage";
import { NewProjectPage } from "../pages/projects/NewProjectPage";
import { ProjectViewPage } from "../pages/projects/ProjectViewPage";
import { EditProjectPage } from "../pages/projects/EditProjectPage";
import { DocumentPage } from "../pages/documents/DocumentPage";
import { EditDocumentPage } from "../pages/documents/EditDocumentPage";
import { NewDocumentPage } from "../pages/documents/NewDocumentPage";

export function BaseRouter() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>

      <Route path="/dashboard">
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />

            <Route path="projects">
              <Route index element={<ProjectsPage />} />
              <Route path="new" element={<NewProjectPage />} />
              <Route path=":projectSlug">
                <Route index element={<ProjectViewPage />} />
                <Route path="new-document" element={<NewDocumentPage />} />
                <Route path="edit" element={<EditProjectPage />} />
                <Route path=":documentId">
                  <Route index element={<DocumentPage />} />
                  <Route path="edit" element={<EditDocumentPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="profile" element={<div>Profile Page</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
