import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow-sm">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo and Brand */}
        <Navbar.Brand href="#" className="d-flex align-items-center text-white">
          <img src="/logo.png" alt="MITR Logo" style={{ height: '40px', marginRight: '10px' }} />
          <h4 className="mb-0">MITR</h4>
        </Navbar.Brand>

        {/* Login Button */}
        <Button variant="light" className="text-primary fw-semibold">
          Login
        </Button>
      </Container>
    </Navbar>
  );
};

export default Header;
