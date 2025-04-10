import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons'; // Using ThreeDots for the icon
import './Header.css';

const Header = () => {
  return (
    <Navbar expand="lg" bg="primary" variant="primary">
      <Container>
        {/* Logo and Image Section */}
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <img src="" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <h4 className="m-0">MITR</h4>
        </Navbar.Brand>

        {/* Right-side navigation and buttons */}
        <Nav className="ml-auto d-flex align-items-center flex-row">
          {/* Login Button */}
          <Button variant="outline-dark mr-5" className="">
            Login
          </Button>

         
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
