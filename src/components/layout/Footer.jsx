import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6>About</h6>
            <p className="small mb-0">ServEase connects users with verified experts for home and learning needs.</p>
          </div>
          <div className="col-md-4">
            <h6>Contact</h6>
            <p className="small mb-0">support@servease.com</p>
            <p className="small mb-0">+91 98765 43210</p>
          </div>
          <div className="col-md-4">
            <h6>Social</h6>
            <div className="d-flex gap-3 fs-5">
              <FaFacebook />
              <FaInstagram />
              <FaLinkedin />
            </div>
          </div>
        </div>
        <hr className="border-secondary my-3" />
        <p className="small mb-0 text-center">© 2026 ServEase. All rights reserved.</p>
      </div>
    </footer>
  );
}
