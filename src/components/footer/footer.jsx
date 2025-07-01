import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo-2.png";
import NoFooterPath from "./NoFooterPath";
import "./footer.css";

const Footer = () => {
  const location = useLocation();
  if (NoFooterPath().includes(location.pathname)) return null;

  return (
    <footer className="footer-hero text-light">
      <Container>
        <Row className="gy-5 align-items-center">
          {/* Logo and Brand */}
          <Col md={4} className="text-center text-md-start">
            <div className="footer-logo-wrapper">
              <img src={logo} alt="MITR" className="footer-hero-logo" />
              <h3 className="footer-brand-title mt-3">MITR SOS</h3>
              <p className="footer-brand-tagline">
                Because help should be just a word away.
              </p>
            </div>
          </Col>

          {/* Contact */}
          {/* Contact */}
<Col md={4} className="footer-contact text-center text-md-start">
  <h5 className="footer-heading">Contact</h5>
  <div className="footer-contact-item">
    <FaEnvelope className="me-2 footer-icon" />
    <span>support@mitr.com</span>
  </div>
  <div className="footer-contact-item">
    <FaPhone className="me-2 footer-icon" />
    <span>+91 98765 43210</span>
  </div>
  <div className="footer-contact-item">
    <FaMapMarkerAlt className="me-2 footer-icon" />
    <span>Pune, Maharashtra, India</span>
  </div>
</Col>


          {/* Links */}
          <Col md={4} className="text-center text-md-start">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tracking">Live Tracking</Link></li>
              <li><Link to="/device">Device</Link></li>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row>
          <Col className="text-center">
            <small className="footer-copy">
              © {new Date().getFullYear()} MITR SOS. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
