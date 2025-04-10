import React from 'react';
import { Navbar, Nav ,Container } from 'react-bootstrap';
import { FaHome, FaRunning, FaMobileAlt, FaUserAlt } from 'react-icons/fa'; // Replaced FaDevice with FaMobileAlt

const Subheader = () => {
  return (
    <Navbar  className="bg-light justify-content-around">
      <Container>
      <Nav className="w-100 d-flex justify-content-between">
        <Nav.Item>
          <Nav.Link href="#" className="text-center text-primary">
            <FaHome size={20} />
            <div>Home</div>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-center">
            <FaRunning size={20} />
            <div>Live Tracking</div>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-center">
            <FaMobileAlt size={20} />  {/* Updated Icon */}
            <div>Device</div>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-center">
            <FaUserAlt size={20} />
            <div>My</div>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="text-center">
            <FaUserAlt size={20} />
            <div>Products</div>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      </Container>
    </Navbar>
  );
};

export default Subheader;
