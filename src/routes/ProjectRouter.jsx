import { Routes, Route } from "react-router-dom";
import { PublicDocumentPage } from "../pages/documents/PublicDocumentPage";

export function ProjectRouter({ projectSlug }) {
  return (
    <Routes>
      <Route
        path="/:documentId"
        element={<PublicDocumentPage projectSlug={projectSlug} />}
      />
    </Routes>
  );
}
