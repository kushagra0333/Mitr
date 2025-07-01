import React from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import Logo from '../assets/logo-2.png';
import './auth.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="auth-background">
      <div className="auth-overlay-glow" />
      <Container className="auth-container">
        <Card className="auth-card glass-effect animate-slide-up">
          <Card.Body>
            <div className="text-center mb-4">
              <img src={Logo} alt="MITR Logo" className="auth-logo glow-pulse" />
              <h4 className="text-white mt-3">Create Your <span className="text-gradient">MITR</span> Account</h4>
            </div>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" placeholder="Enter phone number" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="signupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signupOtp">
                <Form.Label>Email OTP</Form.Label>
                <Form.Control type="text" placeholder="Enter OTP" />
                <Button variant="link" className="p-0 text-primary text-decoration-none">Send OTP</Button>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4" controlId="signupConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" className="w-100 text-dark fw-bold auth-btn neon-btn">
                Signup
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-light">Already have an account?{' '}
                <Link to="/login" className="auth-link">Login</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Signup;
