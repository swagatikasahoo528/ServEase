import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ServiceCard from "../components/common/ServiceCard";
import { fetchServices } from "../services/mockApi";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then((res) => setServices(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Our Services</h2>
        <p className="text-muted mb-0">Explore verified categories and find providers near you.</p>
      </div>
      {loading ? <LoadingSpinner /> : <div className="row g-4">{services.map((item) => <ServiceCard key={item.id} service={item} />)}</div>}
    </section>
  );
}
