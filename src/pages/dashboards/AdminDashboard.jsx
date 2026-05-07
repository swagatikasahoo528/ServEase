import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { users } = useAuth();

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <h6>Total Users</h6>
            <h4>{users.length}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <h6>Pending Providers</h6>
            <h4>8</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <h6>Bookings This Week</h6>
            <h4>42</h4>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm p-3">
        <h5>Manage Users</h5>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td className="text-capitalize">{item.role}</td>
                  <td>
                    <button className="btn btn-sm btn-success me-2">Approve</button>
                    <button className="btn btn-sm btn-outline-danger">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
