import React from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import Logo from '../assets/logo-2.png';
import './auth.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="auth-background">
      <div className="auth-overlay-glow" />
      <Container className="auth-container">
        <Card className="auth-card glass-effect animate-slide-up">
          <Card.Body>
            <div className="text-center mb-4">
              <img src={Logo} alt="MITR Logo" className="auth-logo glow-pulse" />
              <h4 className="text-white mt-3">Login to <span className="text-gradient">MITR</span></h4>
            </div>
            <Form>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Button type="submit" className="w-100 text-dark fw-bold auth-btn neon-btn">
                Login
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-light">Don’t have an account?{' '}
                <Link to="/signup" className="auth-link">Signup</Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
