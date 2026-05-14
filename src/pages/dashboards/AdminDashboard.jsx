import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { users, setProviderApproval, setUserAccountStatus, removeUser } = useAuth();

  const consumers = users.filter((u) => u.role === "consumer");
  const providers = users.filter((u) => u.role === "provider");
  const pendingProviders = providers.filter((u) => u.approvalStatus === "pending");
  const approvedProviders = providers.filter((u) => u.approvalStatus === "approved");
  const blockedCount = users.filter((u) => (u.accountStatus ?? "active") === "blocked").length;

  return (
    <section className="container py-5 admin-dashboard-root">
      <p className="small text-uppercase text-muted fw-semibold mb-1 letter-spacing-tight">Admin Panel</p>
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Total users</h6>
            <h4 className="mb-0">{users.length}</h4>
            <small className="text-muted">Consumers + providers</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Blocked accounts</h6>
            <h4 className="mb-0">{blockedCount}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Pending provider approvals</h6>
            <h4 className="mb-0">{pendingProviders.length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 h-100">
            <h6 className="text-muted mb-1">Active providers</h6>
            <h4 className="mb-0">{approvedProviders.length}</h4>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4">
        <h5 className="mb-3">Approve providers</h5>
        {pendingProviders.length === 0 ? (
          <p className="text-muted small mb-0">No pending provider registrations.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingProviders.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-success me-2"
                        onClick={() => setProviderApproval(item.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setProviderApproval(item.id, "rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card border-0 shadow-sm p-3">
        <h5 className="mb-3">All registered users</h5>
        <p className="small text-muted">
          Remove deletes the account from the system. Block prevents login until unblocked.
        </p>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account</th>
                <th>Provider</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const blocked = (item.accountStatus ?? "active") === "blocked";
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td className="text-capitalize">{item.role}</td>
                    <td>
                      <span className={`badge ${blocked ? "text-bg-danger" : "text-bg-success"}`}>
                        {blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="text-capitalize">
                      {item.role === "provider" ? item.approvalStatus ?? "approved" : "—"}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {blocked ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => setUserAccountStatus(item.id, "active")}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => setUserAccountStatus(item.id, "blocked")}
                          >
                            Block
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (window.confirm(`Remove user ${item.email}? This cannot be undone.`)) {
                              removeUser(item.id);
                            }
                          }}
                        >
                          Remove
                        </button>
                        {item.role === "provider" && item.approvalStatus === "pending" && (
                          <>
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              onClick={() => setProviderApproval(item.id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setProviderApproval(item.id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {item.role === "provider" && item.approvalStatus === "rejected" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => setProviderApproval(item.id, "approved")}
                          >
                            Reinstate provider
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="small text-muted mb-0 mt-2">
          Overview: {consumers.length} consumer(s), {providers.length} provider account(s).
        </p>
      </div>
    </section>
  );
}
