import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logo.jpg"; // replace with your logo path

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <Container>
        <Row className="gy-4">
          {/* Logo & About */}
          <Col md={4}>
            <div className="d-flex align-items-center mb-3">
              <img src={logo} alt="Mitr Logo" style={{ height: "40px", marginRight: "10px" }} />
              <h5 className="m-0">MITR</h5>
            </div>
            <p className="">
              A smart SOS platform designed for safety, privacy & real-time emergency response.
            </p>
          </Col>

          {/* Contact Info */}
          <Col md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <p><FaEnvelope className="me-2" /> support@mitr.com</p>
            <p><FaPhone className="me-2" /> +91 98765 43210</p>
            <p><FaMapMarkerAlt className="me-2" /> Pune, Maharashtra, India</p>
          </Col>

          {/* Useful Links */}
          <Col md={4}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className=" text-decoration-none">Home</a></li>
              <li><a href="#" className=" text-decoration-none">Live Tracking</a></li>
              <li><a href="#" className=" text-decoration-none">Device</a></li>
              <li><a href="#" className=" text-decoration-none">My Account</a></li>
              <li><a href="#" className=" text-decoration-none">Support</a></li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        <Row>
          <Col className="text-center ">
            © {new Date().getFullYear()} MITR SOS. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
