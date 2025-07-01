import React from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import Logo from '../assets/logo-2.png';
import './auth.css';
import { Link } from 'react-router-dom';
const Login = () => {
  return (
    <div className="auth-background">
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center mb-4">
            <img src={Logo} alt="MITR Logo" className="auth-logo" />
            <h4 className="text-white">Login to MITR</h4>
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button type="submit" className="w-100 text-dark fw-bold auth-btn">
              Login
            </Button>
          </Form>
          <Container className="text-center d-flex justify-content-center align-items-center mt-3">
  <div>
    if you don't have an account?{' '}
    <Link to="/signup" className="text-decoration-none text-primary fw-semibold">
      signup
    </Link>
  </div>
</Container>
        </Card.Body>
        
      </Card>
      
    </Container>
    </div>
  );
};

export default Login;
