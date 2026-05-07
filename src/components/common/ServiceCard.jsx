import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm service-card">
        <img src={service.image} className="card-img-top service-image" alt={service.name} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{service.name}</h5>
          <p className="text-muted small flex-grow-1">{service.description}</p>
          <Link to={`/providers/${service.id}`} className="btn btn-outline-primary w-100">
            View Providers
          </Link>
        </div>
      </div>
    </div>
  );
}
