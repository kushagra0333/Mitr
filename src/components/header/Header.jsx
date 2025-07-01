import React, { useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { FaHome, FaMobileAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import Logo from "../../assets/logo-2.png";
import NoHeaderPath from "./NoHeaderPath";

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (NoHeaderPath().includes(location.pathname)) return null;

  return (
    <>
      <Navbar expand="lg" className="custom-navbar shadow-sm">
        <Container fluid className="px-4 d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Navbar.Brand href="#" className="d-flex align-items-center brand-text">
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 text-white">
            <img src={Logo} alt="MITR Logo" className="logo-img" />
            <h4 className="mb-0 fw-bold">MITR</h4>
            </Link>
          </Navbar.Brand>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <div className="d-flex gap-4 nav-links">
              <Link to="/" className={`nav-icon ${location.pathname === '/' ? 'active-link' : ''}`}>
                <FaHome size={18} />
                <div>Home</div>
              </Link>
              <Link to="/dashboard" className={`nav-icon ${location.pathname === '/dashboard' ? 'active-link' : ''}`}>
                <FaMobileAlt size={18} />
                <div>Dashboard</div>
              </Link>
            </div>
            <div className="d-flex gap-3">
              <Link to="/login" className="auth-btn login-btn text-decoration-none">Login</Link>
              <Link to="/signup" className="auth-btn signup-btn text-decoration-none">Signup</Link>
            </div>
          </div>

          {/* Hamburger for Mobile */}
          <div className="d-lg-none hamburger-icon" onClick={() => setMenuOpen(true)}>
            <FaBars size={22} color="#fff" />
          </div>
        </Container>
      </Navbar>

      {/* Slide-In Menu */}
      <div className={`slide-menu ${menuOpen ? 'open' : ''}`}>
        <div className="slide-header d-flex justify-content-between align-items-center px-3 py-3">
          <h5 className="m-0 text-white">Menu</h5>
          <FaTimes size={20} color="#fff" onClick={() => setMenuOpen(false)} style={{ cursor: 'pointer' }} />
        </div>
        <div className="slide-links d-flex flex-column gap-3 px-4 mt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className={`nav-icon ${location.pathname === '/' ? 'active-link' : ''}`}>
            <FaHome /> <span className="ms-2">Home</span>
          </Link>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`nav-icon ${location.pathname === '/dashboard' ? 'active-link' : ''}`}>
            <FaMobileAlt /> <span className="ms-2">dashboard</span>
          </Link>
          <hr className="bg-secondary" />
          <Link to="/login" onClick={() => setMenuOpen(false)} className="auth-btn login-btn">Login</Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)} className="auth-btn signup-btn">Signup</Link>
        </div>
      </div>

      {/* Optional Overlay */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
    </>
  );
};

export default Header;
