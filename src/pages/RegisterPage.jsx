import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage({ forceProvider = false }) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: forceProvider ? "provider" : "consumer",
  });
  const [error, setError] = useState("");

  const onChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();
    const result = register(form);
    if (!result.success) return setError(result.message);
    navigate("/login");
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">{forceProvider ? "Become a Provider" : "Register"}</h3>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input className="form-control" name="name" required onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" name="email" required onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input className="form-control" type="password" name="password" required onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={form.role}
                    onChange={onChange}
                    disabled={forceProvider}
                  >
                    <option value="consumer">Service Consumer</option>
                    <option value="provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Create Account
                </button>
              </form>
              <p className="small text-center mt-3 mb-0">
                Already registered? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
