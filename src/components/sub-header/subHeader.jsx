import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaMobileAlt, FaUserAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Subheader = () => {
  const location = useLocation();

  return (
    <Navbar bg="light" className="shadow-sm sticky-top border-top border-primary">
      <Container className="justify-content-around">
        <Nav className="w-100 d-flex justify-content-between text-center">

          <Nav.Item>
            <Link
              to="/"
              className={`fw-medium text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/' ? 'text-primary' : 'text-dark'}`}
            >
              <FaHome size={18} />
              <div>Home</div>
            </Link>
          </Nav.Item>
          
          <Nav.Item>
            <Link
              to="/products"
              className={`fw-medium text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/products' ? 'text-primary' : 'text-dark'}`}
            >
              <FaUserAlt size={18} />
              <div>Products</div>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/device"
              className={`fw-medium text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/device' ? 'text-primary' : 'text-dark'}`}
            >
              <FaMobileAlt size={18} />
              <div>Device</div>
            </Link>
          </Nav.Item>

          <Nav.Item>
            <Link
              to="/my-profile"
              className={`fw-medium text-decoration-none d-flex flex-column align-items-center ${location.pathname === '/my-profile' ? 'text-primary' : 'text-dark'}`}
            >
              <FaUserAlt size={18} />
              <div>My</div>
            </Link>
          </Nav.Item>

        </Nav>
      </Container>
    </Navbar>
  );
};

export default Subheader;
