import { Link, Navigate, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/layout/AppNavbar";
import Footer from "./components/layout/Footer";
import { AuthProvider, getDashboardPath, useAuth } from "./context/AuthContext";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ManageServicesPage from "./pages/ManageServicesPage";
import ProviderDetailsPage from "./pages/ProviderDetailsPage";
import ProviderListingPage from "./pages/ProviderListingPage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";
import AboutUsPage from "./pages/AboutUsPage";
import BookServicePage from "./pages/BookServicePage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ConsumerDashboard from "./pages/dashboards/ConsumerDashboard";
import ProviderDashboard from "./pages/dashboards/ProviderDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles/app.css";
import { BookingProvider } from "./context/BookingContext";
import { ServiceCatalogProvider } from "./context/ServiceCatalogContext";

function AccessDenied() {
  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              <h4 className="fw-bold text-danger">Access Denied</h4>
              <p className="text-muted mb-4">You do not have permission to view this page.</p>
              <Link to="/login" className="btn btn-primary me-2">
                Go to Login
              </Link>
              <Link to="/" className="btn btn-outline-secondary">
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <AccessDenied />;
  return children;
}

/** Logged-in providers and admins are sent to their dashboard (consumer marketplace). */
function ConsumerMarketplace({ children }) {
  const { user } = useAuth();
  if (user?.role === "provider") return <Navigate to="/provider-dashboard" replace />;
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  return children;
}

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getDashboardPath(user.role)} replace />;
}

function BecomeProviderRoute() {
  const { user } = useAuth();
  if (user?.role === "provider") return <Navigate to="/provider-dashboard" replace />;
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  return <RegisterPage forceProvider />;
}

function AppShell() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ConsumerMarketplace>
                <HomePage />
              </ConsumerMarketplace>
            }
          />
          <Route
            path="/services"
            element={
              <ConsumerMarketplace>
                <ServicesPage />
              </ConsumerMarketplace>
            }
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route
            path="/providers/:serviceId"
            element={
              <ConsumerMarketplace>
                <ProviderListingPage />
              </ConsumerMarketplace>
            }
          />
          <Route
            path="/provider/:providerId"
            element={
              <ConsumerMarketplace>
                <ProviderDetailsPage />
              </ConsumerMarketplace>
            }
          />
          <Route
            path="/book/:providerId"
            element={
              <ConsumerMarketplace>
                <BookServicePage />
              </ConsumerMarketplace>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route
            path="/admin-dashboard"
            element={
              <RequireRole role="admin">
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <RequireRole role="consumer">
                <ConsumerDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/provider-dashboard"
            element={
              <RequireRole role="provider">
                <ProviderDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/booking-history"
            element={
              <RequireRole role="consumer">
                <BookingHistoryPage />
              </RequireRole>
            }
          />
          <Route
            path="/manage-services"
            element={
              <RequireRole role="provider">
                <ManageServicesPage />
              </RequireRole>
            }
          />
          <Route path="/become-provider" element={<BecomeProviderRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ServiceCatalogProvider>
        <BookingProvider>
          <AppShell />
        </BookingProvider>
      </ServiceCatalogProvider>
    </AuthProvider>
  );
}
