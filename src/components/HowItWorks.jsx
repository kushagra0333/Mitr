import React from "react";
import {
  FaShoppingCart,
  FaUserShield,
  FaRunning,
  FaBullhorn,
  FaLock,
  FaArrowDown,
} from "react-icons/fa";
import "./HowItWorks.css";

const steps = [
  {
    icon: <FaShoppingCart className="step-icon" />,
    title: "Purchase & Setup",
    description:
      "Buy the MITR device from our website. Use the QR code to connect via the app or website, and register with Gmail.",
  },
  {
    icon: <FaUserShield className="step-icon" />,
    title: "Add Emergency Contacts",
    description:
      "Add trusted contacts. Set custom trigger words or phrases for the SOS feature through the app or website.",
  },
  {
    icon: <FaRunning className="step-icon" />,
    title: "Daily Usage",
    description:
      "Carry your keychain-sized MITR device. Runs silently, phone-free, and charges wirelessly.",
  },
  {
    icon: <FaBullhorn className="step-icon" />,
    title: "In Case of Emergency",
    description:
      "Say your trigger word. Instantly sends SMS, WhatsApp & live location to your emergency contacts.",
  },
  {
    icon: <FaLock className="step-icon" />,
    title: "Post-Emergency Security",
    description:
      "Only the owner can reset or disable tracking with password-protected access.",
  },
];

const HowItWorks = () => {
  return (
    <section className="howitworks-section">
      <div className="howitworks-container">
        <div className="howitworks-header">
          <h5 className="section-subtitle">How It Works</h5>
          <h2 className="section-title">MITR SOS User Journey</h2>
          <p className="section-desc">
            Understand each step from purchase to real-world usage.
          </p>
        </div>

        <div className="timeline">
          {steps.map((step, index) => (
            <div className="timeline-step" key={index}>
              <div className="icon-circle">{step.icon}</div>
              <h4 className="step-title">{index + 1}. {step.title}</h4>
              <p className="step-desc">{step.description}</p>
              {index !== steps.length - 1 && (
                <div className="arrow-icon">
                  <FaArrowDown />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
