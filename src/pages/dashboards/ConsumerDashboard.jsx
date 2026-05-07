import { Link } from "react-router-dom";
import { services } from "../../services/mockData";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingContext";

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  const myBookings = bookings.filter((b) => b.consumerEmail === user?.email);

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Consumer Dashboard</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-3">
            <h5>Available Services</h5>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {services.slice(0, 6).map((service) => (
                <Link key={service.id} to={`/providers/${service.id}`} className="badge bg-info-subtle text-dark p-2">
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm p-3 mt-4">
            <h5 className="mb-2">Your Bookings</h5>
            {myBookings.length === 0 ? (
              <p className="text-muted small mb-0">No bookings yet. Choose a service and book a provider.</p>
            ) : (
              myBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="border rounded p-3 mb-2">
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                    <div>
                      <p className="mb-1 fw-semibold">
                        {booking.service} with {booking.provider}
                      </p>
                      <p className="mb-1 small text-muted">
                        {booking.address.houseNo}, {booking.address.street} - {booking.address.pinCode}
                      </p>
                      <p className="mb-1 small">
                        <strong>Preferred Date:</strong> {booking.preferredDate}
                      </p>
                      <p className="mb-0 small">
                        <strong>Status:</strong> {booking.status}
                      </p>
                    </div>
                    {booking.status === "Pending" && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => cancelBooking(booking.id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div className="mt-2">
              <Link to="/booking-history" className="btn btn-outline-primary btn-sm">
                View Booking History
              </Link>
            </div>
          </div>
          <div className="card border-0 shadow-sm p-3 mt-4">
            <h5>Booking History Preview</h5>
            <p className="text-muted small">Track your previous and upcoming service bookings.</p>
            <Link to="/booking-history" className="btn btn-outline-primary btn-sm">
              View Booking History
            </Link>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-3">
            <h5>Notifications</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Booking accepted for cleaning service</li>
              <li className="list-group-item">Reminder: Upcoming service tomorrow</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
