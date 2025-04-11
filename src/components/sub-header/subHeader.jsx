import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaRunning, FaMobileAlt, FaUserAlt } from 'react-icons/fa';

const Subheader = () => {
  return (
    <Navbar bg="light" className="shadow-sm sticky-top border-top border-primary">
      <Container className="justify-content-around">
        <Nav className="w-100 d-flex justify-content-between text-center">
          <Nav.Link href="#" className="text-primary fw-medium">
            <FaHome size={18} /><div>Home</div>
          </Nav.Link>
          <Nav.Link href="#" className="text-dark fw-medium">
            <FaRunning size={18} /><div>Tracking</div>
          </Nav.Link>
          <Nav.Link href="#" className="text-dark fw-medium">
            <FaMobileAlt size={18} /><div>Device</div>
          </Nav.Link>
          <Nav.Link href="#" className="text-dark fw-medium">
            <FaUserAlt size={18} /><div>My</div>
          </Nav.Link>
          <Nav.Link href="#" className="text-dark fw-medium">
            <FaUserAlt size={18} /><div>Products</div>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Subheader;
