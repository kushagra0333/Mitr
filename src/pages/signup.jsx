import React from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import Logo from '../assets/logo-2.png';
import './auth.css';
import { Link } from 'react-router-dom';
const Signup = () => {
  return (
    <div className="auth-background">
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center mb-4">
            <img src={Logo} alt="MITR Logo" className="auth-logo" />
            <h4 className="text-white">Create your MITR account</h4>
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

            <Button type="submit" className="w-100 text-dark fw-bold auth-btn">
              Signup
            </Button>
          </Form>
          <Container className="text-center d-flex justify-content-center align-items-center mt-3">
  <div>
    Already have an account?{' '}
    <Link to="/login" className="text-decoration-none text-primary fw-semibold">
      Login
    </Link>
  </div>
</Container>
        </Card.Body>
        
      </Card>
      
    </Container>
    </div>
  );
};

export default Signup;
