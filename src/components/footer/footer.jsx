import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import logo from "../../assets/logo-2.png"; // replace with your logo path
import NoFooterPath from "./NoFooterPath";
import "./footer.css";

const Footer = () => {
  const location = useLocation();
  if (NoFooterPath().includes(location.pathname)) return null;

  return (
    <footer className="custom-footer text-light pt-5 pb-3 pt-5">
      <hr className="border-secondary my-4" />
      <Container>
        <Row className="gy-4">
          {/* Logo & About */}
          <Col md={4}>
            <div className="d-flex align-items-center mb-3 footer-logo-area">
              <img src={logo} alt="MITR Logo" className="footer-logo" />
              <h5 className="m-0 fw-bold">MITR</h5>
            </div>
            <p className="footer-description">
              A smart SOS platform designed for safety, privacy & real-time emergency response.
            </p>
          </Col>

          {/* Contact Info */}
          <Col md={4}>
            <h5 className="mb-3 fw-semibold">Contact Us</h5>
            <p className="footer-contact"><FaEnvelope className="me-2" /> support@mitr.com</p>
            <p className="footer-contact"><FaPhone className="me-2" /> +91 98765 43210</p>
            <p className="footer-contact"><FaMapMarkerAlt className="me-2" /> Pune, Maharashtra, India</p>
          </Col>

          {/* Useful Links */}
          <Col md={4}>
            <h5 className="mb-3 fw-semibold">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/tracking" className="footer-link">Live Tracking</Link></li>
              <li><Link to="/device" className="footer-link">Device</Link></li>
              <li><Link to="/account" className="footer-link">My Account</Link></li>
              <li><Link to="/support" className="footer-link">Support</Link></li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <Row>
          <Col className="text-center">
            <small>© {new Date().getFullYear()} MITR SOS. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
