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

          {/* Dropdown Menu without arrow */}
          <NavDropdown
            title={<ThreeDotsVertical />} // Three dots for the dropdown icon
            id="navbar-dropdown"
            align="end"
            menuVariant="light"
            className="no-arrow animated-dropdown" // Adding custom class to remove the arrow
            drop="down" // Ensures dropdown opens downward
            popperConfig={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 10], // Adjust offset to ensure it stays outside
                  },
                },
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport', // Makes dropdown stay within the viewport
                  },
                },
              ],
            }}
          >
            <NavDropdown.Item href="#">Item 1</NavDropdown.Item>
            <NavDropdown.Item href="#">Item 2</NavDropdown.Item>
            <NavDropdown.Item href="#">Item 3</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
