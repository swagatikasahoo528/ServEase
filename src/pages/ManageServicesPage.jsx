import { useState } from "react";

export default function ManageServicesPage() {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [list, setList] = useState([
    { id: 1, name: "Fan Installation", price: "₹300" },
    { id: 2, name: "Switchboard Repair", price: "₹450" },
  ]);

  const addService = (event) => {
    event.preventDefault();
    if (!serviceName || !price) return;
    setList((prev) => [...prev, { id: Date.now(), name: serviceName, price }]);
    setServiceName("");
    setPrice("");
  };

  const deleteService = (id) => setList((prev) => prev.filter((item) => item.id !== id));

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">Manage Services</h2>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-3">
            <h5>Add New Service</h5>
            <form onSubmit={addService}>
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input className="form-control" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Add Service
              </button>
            </form>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-3">
            <h5>Your Services</h5>
            {list.map((item) => (
              <div key={item.id} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                <div>
                  <p className="mb-0 fw-semibold">{item.name}</p>
                  <small className="text-muted">{item.price}</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary">Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteService(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
