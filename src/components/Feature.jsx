import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaMicrophoneAlt, FaMapMarkerAlt, FaSms, FaBatteryFull, FaMobileAlt, FaChargingStation } from "react-icons/fa";
import "./Feature.css"
const features = [
  {
    icon: <FaMicrophoneAlt size={30} className="text-primary mb-3" />,
    title: "Voice-Triggered SOS",
    description: "Activate emergency alerts with custom voice commands silently and instantly.",
  },
  {
    icon: <FaMapMarkerAlt size={30} className="text-primary mb-3" />,
    title: "Live GPS Tracking",
    description: "Real-time location tracking during emergencies, constantly updating.",
  },
  {
    icon: <FaSms size={30} className="text-primary mb-3" />,
    title: "SMS + WhatsApp Alerts",
    description: "Sends alerts via SMS and WhatsApp to emergency contacts automatically.",
  },
  {
    icon: <FaBatteryFull size={30} className="text-primary mb-3" />,
    title: "Long Battery Life",
    description: "Reliable performance with extended battery life for everyday use.",
  },
  {
    icon: <FaMobileAlt size={30} className="text-primary mb-3" />,
    title: "App-Controlled Setup",
    description: "Full device control via app or website — manage contacts, triggers, and settings.",
  },
  {
    icon: <FaChargingStation size={30} className="text-primary mb-3" />,
    title: "Wireless Charging",
    description: "Recharge with MagSafe or wireless pads — no cables needed.",
  },
];

const KeyFeatures = () => {
  return (
    <section className="bg-white py-5">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-primary text-uppercase">Key Features</h5>
          <h2 className="text-dark fw-bold">Why Choose MITR?</h2>
          <p className="text-muted">Our powerful features ensure your safety and peace of mind, every day.</p>
        </div>

        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} sm={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0 feature-card text-center p-4">
                <div>{feature.icon}</div>
                <h5 className="fw-semibold text-dark">{feature.title}</h5>
                <p className="text-muted">{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default KeyFeatures;
