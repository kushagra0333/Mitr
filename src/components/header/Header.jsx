import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import Logo from '../../assets/logo-2.png';
import NoHeaderPath from './NoHeaderPath';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (NoHeaderPath().includes(location.pathname)) return null;

  return (
    <div className='nav-main'>
      <header className="butter-navbar">
        <div className="navbar-container">
          <Link to="/" className="logo-area">
            <img src={Logo} alt="MITR Logo" className="logo-img" />
            <h4 className="logo-text">MITR</h4>
          </Link>

          <nav className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-glow">Signup</Link>
          </nav>

          <div className="hamburger" onClick={() => setMenuOpen(true)}>
            ☰
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-header">
          <span>Menu</span>
          <span className="close" onClick={() => setMenuOpen(false)}>✕</span>
        </div>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-glow">Signup</Link>
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </div>
  );
};

export default Header;
