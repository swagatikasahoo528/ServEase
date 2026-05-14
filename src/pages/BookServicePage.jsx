import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getDashboardPath, useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useServiceCatalog } from "../context/ServiceCatalogContext";

const emptyForm = {
  name: "",
  email: "",
  street: "",
  houseNo: "",
  pinCode: "",
  date: "",
  problem: "",
};

export default function BookServicePage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const { resolveProviderByListingId } = useServiceCatalog();

  const provider = useMemo(
    () => resolveProviderByListingId(decodeURIComponent(providerId ?? "")),
    [providerId, resolveProviderByListingId]
  );

  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const canBook = useMemo(() => {
    const required = ["name", "email", "street", "houseNo", "pinCode", "date", "problem"];
    return required.every((k) => String(form[k] ?? "").trim().length > 0);
  }, [form]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "consumer") {
    return (
      <section className="container py-5">
        <div className="alert alert-warning mb-0">
          Only <strong>Service Consumers</strong> can create bookings. Please login as Service Consumer.
        </div>
      </section>
    );
  }

  if (!provider) return <section className="container py-5">Provider not found.</section>;

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!canBook) return;
    createBooking({ provider, form, consumer: user });
    navigate(getDashboardPath(user.role));
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4">
            <h3 className="fw-bold mb-1">Book Service</h3>
            <p className="text-muted mb-4">
              <strong>{provider.serviceType}</strong> with <strong>{provider.name}</strong> ({provider.location})
            </p>

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input className="form-control" name="name" value={form.name} onChange={onChange} />
                  {submitted && !form.name && <div className="text-danger small mt-1">Name is required.</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email ID</label>
                  <input className="form-control" type="email" name="email" value={form.email} onChange={onChange} />
                  {submitted && !form.email && <div className="text-danger small mt-1">Email is required.</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Street Address</label>
                  <input className="form-control" name="street" value={form.street} onChange={onChange} />
                  {submitted && !form.street && <div className="text-danger small mt-1">Street is required.</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">House No.</label>
                  <input className="form-control" name="houseNo" value={form.houseNo} onChange={onChange} />
                  {submitted && !form.houseNo && <div className="text-danger small mt-1">House No. is required.</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Pin Code</label>
                  <input className="form-control" name="pinCode" value={form.pinCode} onChange={onChange} />
                  {submitted && !form.pinCode && <div className="text-danger small mt-1">Pin code is required.</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preferred Date</label>
                  <input className="form-control" type="date" name="date" value={form.date} onChange={onChange} />
                  {submitted && !form.date && <div className="text-danger small mt-1">Date is required.</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Problems</label>
                  <textarea
                    className="form-control"
                    name="problem"
                    rows="3"
                    value={form.problem}
                    onChange={onChange}
                    placeholder="Describe your issue..."
                  />
                  {submitted && !form.problem && <div className="text-danger small mt-1">Problem is required.</div>}
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-success" type="submit">
                  Confirm Booking
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}>
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
