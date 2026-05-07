import { FaCheckCircle, FaUsers, FaUserShield } from "react-icons/fa";

const highlights = [
  {
    icon: <FaUsers />,
    title: "10,000+ Happy Customers",
    description: "Trusted by users across multiple cities for daily service needs.",
  },
  {
    icon: <FaUserShield />,
    title: "Verified Professionals",
    description: "Every provider profile is reviewed for quality and reliability.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Easy & Secure Booking",
    description: "Simple booking flow with clear pricing and transparent reviews.",
  },
];

export default function AboutUsPage() {
  return (
    <section className="container py-5">
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8 text-center">
          <h2 className="fw-bold mb-3">About ServEase</h2>
          <p className="text-muted mb-3">
            ServEase is a smart service marketplace that connects consumers with skilled and trusted professionals for
            home and personal services.
          </p>
          <p className="text-muted mb-0">
            Our mission is to make service booking simple, transparent, and reliable with a modern user-first
            experience.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {highlights.map((item) => (
          <div className="col-md-4" key={item.title}>
            <div className="card border-0 shadow-sm h-100 p-3 text-center">
              <div className="fs-3 text-primary mb-2">{item.icon}</div>
              <h5>{item.title}</h5>
              <p className="text-muted small mb-0">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
