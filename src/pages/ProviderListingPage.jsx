import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProviderCard from "../components/common/ProviderCard";
import { useServiceCatalog } from "../context/ServiceCatalogContext";

export default function ProviderListingPage() {
  const { serviceId } = useParams();
  const decodedId = decodeURIComponent(serviceId ?? "");
  const { mergedBrowseServices, getProvidersForService } = useServiceCatalog();

  const providers = useMemo(() => getProvidersForService(decodedId), [decodedId, getProvidersForService]);

  const serviceTitle = useMemo(() => {
    const s = mergedBrowseServices.find((x) => x.id === decodedId);
    return s?.name ?? decodedId.replace(/^custom-/, "").replace(/-/g, " ");
  }, [mergedBrowseServices, decodedId]);

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-3 text-capitalize">{serviceTitle} — Providers</h2>
      <p className="text-muted mb-4">Choose a provider based on ratings, service, and location.</p>
      <div className="row g-4">
        {providers.length > 0 ? providers.map((p) => <ProviderCard key={p.id} provider={p} />) : <p>No providers found.</p>}
      </div>
    </section>
  );
}
