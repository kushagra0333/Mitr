import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserCircle, FaStar } from "react-icons/fa";

const feedbacks = [
  {
    name: "Ayesha Khan",
    message: "Mitr gave me peace of mind. I triggered an SOS silently, and my family got my location instantly.",
    rating: 5,
  },
  {
    name: "Rahul Mehra",
    message: "Easy to set up and really responsive in emergencies. A must-have for every solo traveler.",
    rating: 4,
  },
  {
    name: "Sneha Patel",
    message: "The voice activation is genius. It worked without drawing any attention. Love this device!",
    rating: 5,
  },
];

const FeedBack = () => {
  return (
    <div className="bg-light py-5">
      <Container>
        <h2 className="text-center mb-4 text-primary">What People Are Saying</h2>
        <Row className="g-4">
          {feedbacks.map((fb, index) => (
            <Col key={index} md={4}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center mb-3">
                    <FaUserCircle size={40} className="me-2 text-primary" />
                    <div>
                      <h6 className="mb-0">{fb.name}</h6>
                      <div className="text-warning">
                        {[...Array(fb.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Card.Text className="text-muted">{`"${fb.message}"`}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default FeedBack;
