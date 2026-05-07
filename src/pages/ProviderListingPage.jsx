import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProviderCard from "../components/common/ProviderCard";
import { fetchProvidersByService } from "../services/mockApi";

export default function ProviderListingPage() {
  const { serviceId } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProvidersByService(serviceId)
      .then((res) => setProviders(res.data || []))
      .finally(() => setLoading(false));
  }, [serviceId]);

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-3 text-capitalize">{serviceId} Providers</h2>
      <p className="text-muted mb-4">Choose a provider based on ratings, service, and location.</p>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="row g-4">
          {providers.length > 0 ? providers.map((p) => <ProviderCard key={p.id} provider={p} />) : <p>No providers found.</p>}
        </div>
      )}
    </section>
  );
}
