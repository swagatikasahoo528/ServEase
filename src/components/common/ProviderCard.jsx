import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function ProviderCard({ provider }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body provider-detail-card">
          <h5>{provider.name}</h5>
          <p className="mb-1 text-muted">{provider.serviceType}</p>
          <p className="mb-1 small"><strong>Location:</strong> {provider.location}</p>
          <p className="mb-2 small"><strong>Starting Price:</strong> {provider.price}</p>
          <StarRating rating={provider.rating} />
          <Link to={`/provider/${provider.id}`} className="btn btn-primary mt-3 w-100">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
