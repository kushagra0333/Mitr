import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { FaArrowAltCircleRight } from "react-icons/fa";
import sampleImage from "../assets/product 4.avif";
import './about.css';

const About = () => {
  return (
    <section className="about-section">
      <hr className="border-secondary my-4" />
      <Container>
        <Row className="align-items-center">
          {/* Text Section */}
          <Col md={6} className="mb-4 mb-md-0">
            <div className="about-tag">Welcome to mitr.com</div>
            <h2 className="about-title">
              About <span className="highlight">MITR</span>
            </h2>
            <p className="about-text">
              <strong>Mitr SOS</strong> is a smart emergency alert system designed to provide
              <strong> silent, fast, and secure help</strong> in critical situations.
              Our wearable devices use <strong>voice triggers</strong> and real-time location tracking
              to notify trusted contacts instantly—keeping you safe without drawing attention.
            </p>
            <p className="about-text">
              You can manage your device, update contacts, and customize triggers directly from our platform.
              With MITR, personal safety meets seamless technology.
            </p>
            <Button className="learn-btn d-flex align-items-center">
              Learn More <FaArrowAltCircleRight className="ms-2" />
            </Button>
          </Col>

          {/* Image Section */}
          <Col md={6} className="text-center">
            <img
              src={sampleImage}
              alt="MITR SOS Device"
              className="about-img img-fluid"
            />
          </Col>
        </Row>
      </Container>
      <hr className="border-secondary my-4" />
    </section>
  );
};

export default About;
