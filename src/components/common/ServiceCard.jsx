import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm service-card">
        <img
          src={
            service.image ||
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80"
          }
          className="card-img-top service-image"
          alt={service.name}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{service.name}</h5>
          <p className="text-muted small flex-grow-1">{service.description}</p>
          <Link to={`/providers/${encodeURIComponent(service.id)}`} className="btn btn-outline-primary w-100">
            View Providers
          </Link>
        </div>
      </div>
    </div>
  );
}
