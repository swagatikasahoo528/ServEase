import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import StarRating from "../components/common/StarRating";
import { useServiceCatalog } from "../context/ServiceCatalogContext";

export default function ProviderDetailsPage() {
  const { providerId } = useParams();
  const { resolveProviderByListingId } = useServiceCatalog();

  const provider = useMemo(
    () => resolveProviderByListingId(decodeURIComponent(providerId ?? "")),
    [providerId, resolveProviderByListingId]
  );

  if (!provider) return <section className="container py-5">Provider not found.</section>;

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="fw-bold">{provider.name}</h2>
            <p className="mb-1">{provider.serviceType}</p>
            <p className="text-muted">{provider.location}</p>
            <p className="mb-2">Services offered: installation, servicing, maintenance and repairs.</p>
            <p className="fw-semibold">{provider.price}</p>
            <StarRating rating={provider.rating} />
            <h5 className="mt-4">Reviews</h5>
            <ul className="list-group mb-4">
              {(provider.reviews ?? []).map((review) => (
                <li className="list-group-item" key={review}>
                  {review}
                </li>
              ))}
            </ul>
            <Link to={`/book/${encodeURIComponent(provider.id)}`} className="btn btn-success">
              Book Service
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
