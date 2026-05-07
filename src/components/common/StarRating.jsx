import { FaStar } from "react-icons/fa";

export default function StarRating({ rating }) {
  return (
    <div className="d-flex align-items-center gap-1 text-warning">
      <FaStar />
      <span className="text-dark fw-semibold">{rating}</span>
    </div>
  );
}
