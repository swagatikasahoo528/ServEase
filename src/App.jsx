import { Navigate, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/layout/AppNavbar";
import Footer from "./components/layout/Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "consumer") return <ConsumerDashboard />;
  if (user.role === "provider") return <ProviderDashboard />;
  return <AdminDashboard />;
}

function AppShell() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/providers/:serviceId" element={<ProviderListingPage />} />
          <Route path="/provider/:providerId" element={<ProviderDetailsPage />} />
          <Route path="/book/:providerId" element={<BookServicePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/booking-history" element={<BookingHistoryPage />} />
          <Route path="/manage-services" element={<ManageServicesPage />} />
          <Route path="/become-provider" element={<RegisterPage forceProvider />} />
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
      <BookingProvider>
        <AppShell />
      </BookingProvider>
    </AuthProvider>
  );
}
