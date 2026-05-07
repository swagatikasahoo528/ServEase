import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaLock, FaRocket, FaStar } from "react-icons/fa";
import ServiceCard from "../components/common/ServiceCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { fetchServices } from "../services/mockApi";

const features = [
  { icon: <FaCheckCircle />, title: "Verified Providers", desc: "Background-checked professionals." },
  { icon: <FaRocket />, title: "Fast Booking", desc: "Book trusted experts in minutes." },
  { icon: <FaStar />, title: "Ratings & Reviews", desc: "Choose based on real customer feedback." },
  { icon: <FaLock />, title: "Secure Platform", desc: "Safe and reliable payment-ready workflow." },
];

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=80",
    alt: "Home cleaning professional at work",
  },
  {
    src: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1100&q=80",
    alt: "AC repairing service technician at work",
  },
  {
    src: "/ac-repair.png",
    alt: "AC repairing technician servicing an indoor unit",
  },
];

export default function HomePage() {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    fetchServices()
      .then((res) => setServiceData(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  const filteredServices = serviceData.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero-section text-white py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold">Find Trusted Service Providers Near You</h1>
              <p className="lead opacity-75 mt-3">
                Discover skilled professionals for household and personal services with transparent ratings and pricing.
              </p>
              <div className="d-flex gap-2 mt-4 flex-wrap">
                <Link to="/register" className="btn btn-light btn-lg">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src={heroImages[activeHeroIndex].src}
                className="img-fluid rounded-4 shadow-lg hero-toggle-image"
                alt={heroImages[activeHeroIndex].alt}
              />
              <div className="d-flex justify-content-center gap-2 mt-3">
                {heroImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`hero-toggle-dot ${activeHeroIndex === index ? "active" : ""}`}
                    onClick={() => setActiveHeroIndex(index)}
                    aria-label={`Show hero image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Popular Services</h2>
            <p className="text-muted mb-0">Browse categories and connect with trusted providers.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <input
              className="form-control"
              placeholder="Search service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? <LoadingSpinner /> : <div className="row g-4">{filteredServices.map((s) => <ServiceCard key={s.id} service={s} />)}</div>}
      </section>

      <section className="bg-white py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Why Choose ServEase?</h2>
          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-md-6 col-lg-3" key={feature.title}>
                <div className="p-4 bg-light rounded-4 h-100 text-center feature-card">
                  <div className="fs-3 text-primary mb-2">{feature.icon}</div>
                  <h6>{feature.title}</h6>
                  <p className="small text-muted mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="cta-box p-4 p-md-5 rounded-4 text-center">
            <h3 className="fw-bold">Ready to book your next service?</h3>
            <p className="mb-4">Join now to discover verified professionals in your city.</p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Link to="/register" className="btn btn-primary">
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
