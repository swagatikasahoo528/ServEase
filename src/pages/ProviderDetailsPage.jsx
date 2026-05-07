import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import StarRating from "../components/common/StarRating";
import { fetchProviderById } from "../services/mockApi";

export default function ProviderDetailsPage() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderById(providerId)
      .then((res) => setProvider(res.data))
      .finally(() => setLoading(false));
  }, [providerId]);

  if (loading) return <LoadingSpinner />;
  if (!provider) return <section className="container py-5">Provider not found.</section>;

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4">
          <h2 className="fw-bold">{provider.name}</h2>
          <p className="mb-1">{provider.serviceType}</p>
          <p className="text-muted">{provider.location}</p>
          <p className="mb-2">Services offered: Installation, servicing, maintenance and repairs.</p>
          <p className="fw-semibold">{provider.price}</p>
          <StarRating rating={provider.rating} />
          <h5 className="mt-4">Reviews</h5>
          <ul className="list-group mb-4">
            {provider.reviews.map((review) => (
              <li className="list-group-item" key={review}>
                {review}
              </li>
            ))}
          </ul>
          <Link to={`/book/${provider.id}`} className="btn btn-success">
            Book Service
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
