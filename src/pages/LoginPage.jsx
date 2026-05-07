import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "consumer" });
  const [error, setError] = useState("");

  const onChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();
    const result = login(form);
    if (!result.success) return setError(result.message);
    navigate("/dashboard");
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-3">Login</h3>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Login As</label>
                  <select className="form-select" name="role" value={form.role} onChange={onChange}>
                    <option value="consumer">Service Consumer</option>
                    <option value="provider">Service Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" name="email" type="email" required onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input className="form-control" name="password" type="password" required onChange={onChange} />
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  Login
                </button>
              </form>
              <p className="small text-center mt-3 mb-0">
                New user? <Link to="/register">Create account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
