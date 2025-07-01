import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaMicrophoneAlt,
  FaMapMarkerAlt,
  FaSms,
  FaBatteryFull,
  FaMobileAlt,
  FaChargingStation,
} from "react-icons/fa";
import "./Feature.css";

const features = [
  {
    icon: <FaMicrophoneAlt size={30} className="feature-icon mb-3" />,
    title: "Voice-Triggered SOS",
    description: "Activate emergency alerts with custom voice commands silently and instantly.",
  },
  {
    icon: <FaMapMarkerAlt size={30} className="feature-icon mb-3" />,
    title: "Live GPS Tracking",
    description: "Real-time location tracking during emergencies, constantly updating.",
  },
  {
    icon: <FaSms size={30} className="feature-icon mb-3" />,
    title: "SMS + WhatsApp Alerts",
    description: "Sends alerts via SMS and WhatsApp to emergency contacts automatically.",
  },
  {
    icon: <FaBatteryFull size={30} className="feature-icon mb-3" />,
    title: "Long Battery Life",
    description: "Reliable performance with extended battery life for everyday use.",
  },
  {
    icon: <FaMobileAlt size={30} className="feature-icon mb-3" />,
    title: "App-Controlled Setup",
    description: "Full device control via app or website — manage contacts, triggers, and settings.",
  },
  {
    icon: <FaChargingStation size={30} className="feature-icon mb-3" />,
    title: "Wireless Charging",
    description: "Recharge with MagSafe or wireless pads — no cables needed.",
  },
];

const KeyFeatures = () => {
  return (
    <section className="feature-section py-5">
      <hr className="border-secondary my-4" />
      <Container>
        <div className="text-center mb-5">
          <h5 className="section-subtitle text-uppercase">Key Features</h5>
          <h2 className="text-white fw-bold">Why Choose <span className="text-gradient">MITR</span>?</h2>
          <p className="text-light">Our powerful features ensure your safety and peace of mind, every day.</p>
        </div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} sm={12} md={6} lg={4}>
              <Card className="feature-card h-100 text-center p-4">
                <div>{feature.icon}</div>
                <h5 className="fw-semibold text-white mt-3">{feature.title}</h5>
                <p className="text-light">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <hr className="border-secondary my-4" />
    </section>
  );
};

export default KeyFeatures;
