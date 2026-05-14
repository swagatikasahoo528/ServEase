import { Navigate } from "react-router-dom";

/** Standalone URL kept for bookmarks; provider tools live on the provider dashboard. */
export default function ManageServicesPage() {
  return <Navigate to="/provider-dashboard" replace />;
}
