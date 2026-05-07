import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container py-5 text-center">
      <h2 className="fw-bold">Page Not Found</h2>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  );
}
