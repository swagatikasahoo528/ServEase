import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";

export default function BookingHistoryPage() {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const items = bookings.filter((b) => b.consumerEmail === user?.email);

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Booking History</h2>
      <div className="table-responsive bg-white rounded-4 shadow-sm p-3">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Service</th>
              <th>Provider</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.date}</td>
                <td>{booking.service}</td>
                <td>{booking.provider}</td>
                <td>
                  <span className="badge text-bg-light border">{booking.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
