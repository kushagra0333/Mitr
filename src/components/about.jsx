import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { FaArrowAltCircleRight } from "react-icons/fa";
import sampleImage from "../assets/product 4.avif";

const text = {
  description: (
    <>
      <strong>Mitr SOS</strong> is a smart emergency alert system designed to provide <strong>silent, fast, and secure help</strong> in critical situations.
      Paired with a compact wearable device, the platform enables users to trigger SOS alerts using <strong>personalized voice commands</strong> without drawing attention.
      It ensures <strong>real-time communication</strong> with trusted contacts while keeping the user's <strong>location constantly updated</strong> during emergencies.
      <br />
      Through this website, users can <strong>manage their SOS device</strong> by customizing trigger words, updating emergency contacts, enabling/disabling location tracking, and securely resetting the device.
      The platform is designed with <strong>safety</strong>, <strong>privacy</strong>, and <strong>ease of use</strong> in mind, making it ideal for anyone seeking a reliable personal security solution.
    </>
  ),
};

function About() {
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Text Section */}
        <Col md={6}>
          <div className="text-secondary text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>
            Welcome to RegisterKaro.in
          </div>
          <h2 className="text-primary font-weight-bold mb-4">
            About <span className="text-primary">Register Karo</span>
          </h2>
          <p className="mt-3 mb-4 text-dark">{text.description}</p>
          <Button variant="primary" className="d-flex align-items-center py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
            <span>Learn More</span>
            <FaArrowAltCircleRight className="ml-2" />
          </Button>
        </Col>

        {/* Image Section */}
        <Col md={6} className="d-flex justify-content-center mt-4 mt-md-0">
          <img
            src={sampleImage}
            alt="Example"
            className="img-fluid rounded"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default About;
