import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { FaArrowAltCircleRight } from "react-icons/fa";
import sampleImage from "../assets/product 4.avif";

const About = () => {
  return (
    <div className="bg-white py-5">
      <Container>
        <Row className="align-items-center">
          {/* Text Section */}
          <Col md={6}>
            <div className="text-uppercase text-secondary mb-2" style={{ fontSize: '0.85rem' }}>
              Welcome to mitr.com
            </div>
            <h2 className="text-dark fw-bold mb-4">
              About <span className="text-primary">Mitr</span>
            </h2>
            <p className="text-dark">
              <strong>Mitr SOS</strong> is a smart emergency alert system designed to provide 
              <strong> silent, fast, and secure help</strong> in critical situations.
              Our wearable devices use <strong>voice triggers</strong> and real-time location tracking 
              to notify trusted contacts instantly—keeping you safe without drawing attention.
            </p>
            <p className="text-dark">
              You can manage your device, update contacts, and customize triggers directly from our platform.
              With MITR, personal safety meets seamless technology.
            </p>
            <Button variant="primary" className="d-flex align-items-center">
              Learn More <FaArrowAltCircleRight className="ms-2" />
            </Button>
          </Col>

          {/* Image Section */}
          <Col md={6} className="mt-4 mt-md-0 text-center">
            <img
              src={sampleImage}
              alt="MITR SOS Device"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
