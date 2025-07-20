import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import Logo from '../assets/logo-2.png';
import './auth.css';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const newUser = {
      ...formData,
      deviceId: `MITR-${Math.floor(Math.random() * 10000)}`
    };
    
    localStorage.setItem('mitr-token', 'mock-token');
    localStorage.setItem('mitr-user', JSON.stringify(newUser));
    navigate('/dashboard');
  };

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
            
            {error && <div className="error-message">{error}</div>}
            
            <Form onSubmit={handleSignup}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      placeholder="Enter full name" 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone"
                      placeholder="Enter phone number" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="signupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  placeholder="Enter email" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="signupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="Password" 
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4" controlId="signupConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="confirmPassword"
                      placeholder="Confirm Password" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
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