import { Link } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";

export default function ProviderDashboard() {
  const { requests, acceptRequest, rejectRequest } = useBookings();
  const ordered = [...requests].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Provider Dashboard</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-3">
            <h5>Service Requests</h5>
            {ordered.length === 0 && <p className="text-muted small mb-0">No new requests yet.</p>}
            {ordered.map((request) => (
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
                      onClick={() => acceptRequest(request.bookingId)}
                      disabled={request.status !== "New" && request.status !== "Pending"}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
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
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-3">
            <h5>Profile Summary</h5>
            <p className="small text-muted">Profile completion: 85%</p>
            <p className="small mb-3">Response rate: 93%</p>
            <Link to="/manage-services" className="btn btn-primary btn-sm w-100">
              Manage Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
