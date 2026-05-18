import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ServiceCard from "../components/common/ServiceCard";
import { useServiceCatalog } from "../context/ServiceCatalogContext";

export default function ServicesPage() {
  const { mergedBrowseServices } = useServiceCatalog();
  const [search, setSearch] = useState("");

  const services = useMemo(
    () =>
      mergedBrowseServices.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [mergedBrowseServices, search],
  );

  return (
    <section className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Our Services</h2>
        <p className="text-muted mb-0">
          Explore verified categories and provider-added services.
        </p>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-light"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      <div className="row g-4">
        {services.map((item) => (
          <ServiceCard key={item.id} service={item} />
        ))}
      </div>
    </section>
  );
}
