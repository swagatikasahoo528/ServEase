import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";
import { useServiceCatalog } from "../../context/ServiceCatalogContext";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { setOfferingsForUser, getOfferingsForUser } = useServiceCatalog();
  const { requests, acceptRequest, rejectRequest, providerNotifications, markNotificationsReadForProvider } =
    useBookings();

  const myServices = user?.id ? getOfferingsForUser(user.id) : [];

  const myRequests = useMemo(
    () => [...requests].filter((r) => r.providerAccountId === user?.id).sort((a, b) => b.createdAt - a.createdAt),
    [requests, user?.id]
  );

  const myNotifications = useMemo(() => {
    if (!user?.id) return [];
    return [...providerNotifications]
      .filter((n) => n.providerAccountId === user.id)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [providerNotifications, user?.id]);

  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setServiceName("");
    setPrice("");
    setEditingId(null);
  };

  const persistServices = (nextList) => {
    if (!user?.id) return;
    setOfferingsForUser(user.id, nextList);
  };

  const onSubmitService = (event) => {
    event.preventDefault();
    if (!user?.id || !serviceName.trim() || !price.trim()) return;
    if (editingId != null) {
      persistServices(
        myServices.map((item) =>
          item.id === editingId ? { ...item, name: serviceName.trim(), price: price.trim() } : item
        )
      );
    } else {
      persistServices([...myServices, { id: Date.now(), name: serviceName.trim(), price: price.trim() }]);
    }
    resetForm();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setServiceName(item.name);
    setPrice(item.price);
  };

  const deleteService = (id) => {
    persistServices(myServices.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  const pendingRequests = myRequests.filter((r) => r.status === "New" || r.status === "Pending").length;

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-1">Provider Dashboard</h2>
      <p className="text-muted small mb-4">Manage your offerings and respond to booking requests.</p>

      {myNotifications.length > 0 && (
        <div className="card border-0 shadow-sm p-3 mb-4 border-start border-primary border-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
            <h5 className="mb-0">Notifications</h5>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => markNotificationsReadForProvider(user.id)}
              >
                Mark all as read ({unreadCount})
              </button>
            )}
          </div>
          <ul className="list-group list-group-flush">
            {myNotifications.map((n) => (
              <li
                key={n.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${!n.read ? "fw-semibold bg-light" : ""}`}
              >
                <span>{n.message}</span>
                <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">My services</h6>
            <h4 className="mb-0">{myServices.length}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Incoming requests</h6>
            <h4 className="mb-0">{pendingRequests}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Signed in as</h6>
            <p className="mb-0 fw-semibold">{user?.name}</p>
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3 mb-4">
            <h5 className="mb-3">My Services</h5>
            {myServices.length === 0 ? (
              <p className="text-muted small mb-0">No services yet. Add your first service using the form.</p>
            ) : (
              myServices.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                >
                  <div>
                    <p className="mb-0 fw-semibold">{item.name}</p>
                    <small className="text-muted">{item.price}</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteService(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card border-0 shadow-sm p-3">
            <h5 className="mb-3">{editingId != null ? "Edit service" : "Add / edit services"}</h5>
            <p className="small text-muted">
              Services you add appear on the public Services list. Matching names join built-in categories (e.g.
              Electrician).
            </p>
            <form onSubmit={onSubmitService}>
              <div className="mb-3">
                <label className="form-label">Service name</label>
                <input
                  className="form-control"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                  {editingId != null ? "Save changes" : "Add service"}
                </button>
                {editingId != null && (
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3">
            <h5 className="mb-3">Incoming Requests</h5>
            {myRequests.length === 0 && <p className="text-muted small mb-0">No requests for your account yet.</p>}
            {myRequests.map((request) => (
              <div key={request.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                  <div>
                    <p className="mb-1 fw-semibold">{request.customerName}</p>
                    <p className="mb-1">
                      <strong>Service:</strong> {request.service}
                    </p>
                    <p className="mb-1 small text-muted">
                      {request.houseNo}, {request.street} - {request.pinCode}
                    </p>
                    <p className="mb-1 small">
                      <strong>Date:</strong> {request.date}
                    </p>
                    <p className="mb-1 small">
                      <strong>Problem:</strong> {request.problem}
                    </p>
                    <p className="mb-0 small">
                      <strong>Status:</strong> {request.status}
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      type="button"
                      onClick={() => acceptRequest(request.bookingId)}
                      disabled={request.status !== "New" && request.status !== "Pending"}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                      onClick={() => rejectRequest(request.bookingId)}
                      disabled={request.status !== "New" && request.status !== "Pending"}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
