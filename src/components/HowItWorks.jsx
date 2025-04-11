import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaShoppingCart, FaQrcode, FaUserShield, FaRunning, FaBullhorn, FaLock, FaArrowDown } from "react-icons/fa";
import "./HowItWorks.css"
const steps = [
  {
    icon: <FaShoppingCart size={28} className="text-primary" />,
    title: "Purchase & Setup",
    description:
      "Buy the MITR device from our website. Receive it with a QR code, install the app or visit the website, and register with Gmail. Link your device using the QR code.",
  },
  {
    icon: <FaUserShield size={28} className="text-primary" />,
    title: "Add Emergency Contacts",
    description:
      "Add trusted contacts via app or website. Set up personalized trigger words or phrases for the SOS feature.",
  },
  {
    icon: <FaRunning size={28} className="text-primary" />,
    title: "Daily Usage",
    description:
      "Carry your compact, keychain-sized MITR device. It runs silently without depending on your phone. Charges wirelessly.",
  },
  {
    icon: <FaBullhorn size={28} className="text-primary" />,
    title: "In Case of Emergency",
    description:
      "Speak your custom trigger word. Device sends SMS, WhatsApp, and real-time location to emergency contacts — updating as you move.",
  },
  {
    icon: <FaLock size={28} className="text-primary" />,
    title: "Post-Emergency Security",
    description:
      "Only the registered user can reset or disable tracking via password-protected access in the app or website.",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-White py-5">
      <Container>
        <div className="text-center mb-5">
          <h5 className="text-primary text-uppercase">How It Works</h5>
          <h2 className="text-dark fw-bold">MITR SOS User Journey</h2>
          <p className="text-muted">Understand each step from purchase to emergency usage with your MITR device.</p>
        </div>

        <Row className="justify-content-center">
          <Col md={10}>
            <div className="timeline">
              {steps.map((step, index) => (
                <div className="timeline-step text-center mb-5" key={index}>
                  <div className="icon-circle mb-3 mx-auto">{step.icon}</div>
                  <h5 className="text-dark fw-semibold">{index + 1}. {step.title}</h5>
                  <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>{step.description}</p>
                  {index !== steps.length - 1 && (
                    <div className="arrow-icon text-primary mt-4 mb-2">
                      <FaArrowDown size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HowItWorks;
