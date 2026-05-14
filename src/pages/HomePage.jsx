import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaLock, FaRocket, FaStar } from "react-icons/fa";
import ServiceCard from "../components/common/ServiceCard";
import { useServiceCatalog } from "../context/ServiceCatalogContext";

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
  const { mergedBrowseServices } = useServiceCatalog();
  const [search, setSearch] = useState("");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const serviceData = mergedBrowseServices;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(intervalId);
  }, []);

  const filteredServices = useMemo(
    () => serviceData.filter((service) => service.name.toLowerCase().includes(search.toLowerCase())),
    [serviceData, search]
  );

  return (
    <>
      <section className="hero-section text-white py-5 overflow-hidden">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow text-uppercase">Premium service discovery</span>
              <h1 className="display-4 fw-bold mt-3">
                Book trusted experts from an elegant dark experience.
              </h1>
              <p className="lead opacity-75 mt-4">
                Discover verified providers, compare ratings, and book confidently with a sleek interface inspired by modern award-winning design.
              </p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/services" className="btn btn-outline-light btn-lg">
                  Explore services
                </Link>
              </div>
              <div className="hero-stats d-flex flex-wrap gap-3 mt-5">
                <div className="stat-card">
                  <strong>12K+</strong>
                  <span>Verified Providers</span>
                </div>
                <div className="stat-card">
                  <strong>4.9/5</strong>
                  <span>Average Rating</span>
                </div>
                <div className="stat-card">
                  <strong>99%</strong>
                  <span>Client Satisfaction</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image-panel rounded-4 overflow-hidden shadow-lg">
                <img
                  src={heroImages[activeHeroIndex].src}
                  className="img-fluid hero-toggle-image"
                  alt={heroImages[activeHeroIndex].alt}
                />
                <div className="hero-image-overlay p-4">
                  <p className="small text-muted mb-2">Featured provider</p>
                  <h5 className="mb-1">Pro Home Care</h5>
                  <p className="small opacity-75 mb-3">Top-rated cleaning and repair service with fast response.</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge badge-pill bg-success text-white">Live now</span>
                    <span className="small text-muted">Best choice</span>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-4">
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
        <div className="row g-4">{filteredServices.map((s) => <ServiceCard key={s.id} service={s} />)}</div>
      </section>

      <section className="section-surface py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Why Choose ServEase?</h2>
          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-md-6 col-lg-3" key={feature.title}>
                <div className="p-4 rounded-4 h-100 text-center feature-card">
                  <div className="fs-3 text-cyan mb-3">{feature.icon}</div>
                  <h6>{feature.title}</h6>
                  <p className="small text-muted mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section py-5">
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
