import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './header.css';
import Logo from '../../assets/logo-2.png';
import NoHeaderPath from './NoHeaderPath';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('mitr-token');
  const user = JSON.parse(localStorage.getItem('mitr-user'));

  if (NoHeaderPath().includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem('mitr-token');
    localStorage.removeItem('mitr-user');
    navigate('/');
    setMenuOpen(false);
  };

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
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                  Dashboard
                </Link>
                <span className="user-greeting" style={{ margin: '0 15px' }}>
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                <button onClick={handleLogout} className="btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/signup" className="btn-glow">Signup</Link>
              </>
            )}
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
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <div className="mobile-user-info">
              Logged in as: {user?.name || 'User'}
            </div>
            <button onClick={handleLogout} className="mobile-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-glow">
              Signup
            </Link>
          </>
        )}
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </div>
  );
};

export default Header;