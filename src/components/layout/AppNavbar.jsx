import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { getDashboardPath, useAuth } from "../../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="brand-logo-shell">
            <span className="brand-logo">
              <span className="brand-logo-text">SE</span>
            </span>
            <span className="brand-logo-spark">
              <FaStar />
            </span>
          </span>
          <span className="brand-name">ServEase</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto ms-lg-4">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About Us
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <span className="badge rounded-pill text-bg-dark small">Admin Panel</span>
                )}
                <Link to={getDashboardPath(user.role)} className="btn btn-primary btn-sm">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-secondary btn-sm"
                  type="button"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
