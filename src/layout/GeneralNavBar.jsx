import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const GeneralNavBar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-blue py-3 px-3 no-underline'
      : 'text-black py-3 px-3 no-underline'

  return (
    <>
      <div>
        <header className="bg-orange-400 h-7"> 
        </header>
        <Navbar expand="lg" className="bg-white shadow-lg">
          <Container>
            <Navbar.Brand href="#home" className="text-warning">NUSteals</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Item>
                  <NavLink to="/" className={linkClass}>
                    Home
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/aboutUs" className={linkClass}>
                    About Us
                  </NavLink>
                </Nav.Item>
                <Nav.Item>
                  <NavLink to="/login" className={linkClass}>
                    Login
                  </NavLink>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default GeneralNavBar;
