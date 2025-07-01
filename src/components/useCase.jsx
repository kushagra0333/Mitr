import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaChild,
  FaFemale,
  FaUserShield,
  FaWalking,
  FaMapMarkedAlt,
  FaHeadset,
} from "react-icons/fa";
import "./usecase.css";

const useCases = [
  {
    title: "For Children",
    icon: <FaChild size={40} className="icon mb-3" />,
    description:
      "Ensure your child’s safety on their way to school or in outdoor activities — even when they don’t carry a phone.",
  },
  {
    title: "For Women",
    icon: <FaFemale size={40} className="icon mb-3" />,
    description:
      "Protect yourself during commutes, while jogging, or in uncomfortable public encounters with a discreet safety solution.",
  },
  {
    title: "For Senior Citizens",
    icon: <FaUserShield size={40} className="icon mb-3" />,
    description:
      "Give elderly family members a secure way to call for help during medical emergencies or unsafe conditions at home or outside.",
  },
  {
    title: "For Travelers & Solo Workers",
    icon: <FaWalking size={40} className="icon mb-3" />,
    description:
      "Stay safe in unfamiliar places. Ideal for field agents, delivery staff, cab drivers, or anyone traveling alone.",
  },
  {
    title: "When Phones Can’t Be Used",
    icon: <FaMapMarkedAlt size={40} className="icon mb-3" />,
    description:
      "Mitr activates through voice alone — perfect in situations where phones are out of reach, confiscated, or too risky to use.",
  },
  {
    title: "24/7 Emergency Response",
    icon: <FaHeadset size={40} className="icon mb-3" />,
    description:
      "Works round the clock, silently listening for trigger words and sending alerts even if you're physically restrained or unconscious.",
  },
];

const UseCase = () => {
  return (
    <section className="usecase-section py-5">
      <hr className="border-secondary my-4" />
      <Container>
        <div className="text-center mb-5">
          <h5 className="usecase-subtitle text-uppercase">Real-Life Scenarios</h5>
          <h2 className="fw-bold text-white">
            Who Needs <span className="text-gradient">MITR</span>?
          </h2>
          <p className="text-muted">
            From kids to commuters, Mitr is your invisible ally in emergencies.
          </p>
        </div>

        <Row>
          {useCases.map((caseItem, index) => (
            <Col md={6} lg={4} className="mb-4" key={index}>
              <Card className="usecase-card h-100 text-center p-3">
                <div>{caseItem.icon}</div>
                <h5 className="fw-bold mt-3 text-white">{caseItem.title}</h5>
                <p className="text-light">{caseItem.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <hr className="border-secondary my-4" />
    </section>
  );
};

export default UseCase;
