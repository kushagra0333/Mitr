import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaHome, FaRunning, FaMobileAlt, FaUserAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'; // useLocation to detect current path

const Subheader = () => {
  const location = useLocation();

  const links = [
    { to: '/', icon: <FaHome size={18} />, label: 'Home' },
    { to: '/tracking', icon: <FaRunning size={18} />, label: 'Tracking' },
    { to: '/device', icon: <FaMobileAlt size={18} />, label: 'Device' },
    { to: '/my-profile', icon: <FaUserAlt size={18} />, label: 'My' },
    { to: '/products', icon: <FaUserAlt size={18} />, label: 'Products' },
  ];

  return (
    <Navbar bg="light" className="shadow-sm sticky-top border-top border-primary">
      <Container className="justify-content-around">
        <Nav className="w-100 d-flex justify-content-between text-center">
          {links.map(({ to, icon, label }) => {
            const isActive = location.pathname === to;

            return (
              <Nav.Item key={to}>
                <Link
                  to={to}
                  className={`fw-medium text-decoration-none d-flex flex-column align-items-center ${
                    isActive ? 'text-primary' : 'text-dark'
                  }`}
                >
                  <span className={isActive ? 'text-primary' : 'text-dark'}>
                    {icon}
                  </span>
                  <div>{label}</div>
                </Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Subheader;
