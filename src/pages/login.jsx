import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';
import Logo from '../assets/logo-2.png';
import './auth.css';

const mockUsers = [
  {
    email: 'kushagrapandey0333@gmail.com',
    password: '12345678d',
    name: 'Kushagra',
    phone: '+91 9310022664',
    deviceId: 'Device1'
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('mitr-token', 'mock-token');
      localStorage.setItem('mitr-user', JSON.stringify(user));
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

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
            
            {error && <div className="error-message">{error}</div>}
            
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" className="w-100 text-dark fw-bold auth-btn neon-btn">
                Login
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-light">Don't have an account?{' '}
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