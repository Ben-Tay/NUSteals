import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const GeneralNavBar = ({ userRole }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-blue py-3 px-3 no-underline'
      : 'text-black py-3 px-3 no-underline';

  const renderLinks = () => {
    switch(userRole) {
      // MERCHANT NAVBAR
      case 'merchant':
        return (
          <>
            <Nav.Item>
              <NavLink to="/merchantDashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/manageCoupons" className={linkClass}>
                Manage Coupons
              </NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/merchantProfile" className={linkClass}>
                Profile
                </NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/merchantFaqs" className={linkClass}>
                FAQs
                </NavLink>
            </Nav.Item>
          </>
        );
      // STUDENT NAVBAR
      case 'student':
        return (
          <>
            <Nav.Item>
              <NavLink to="/#" className={linkClass}>
                Redeem Coupons
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/#" className={linkClass}>
                Profile
              </NavLink>
            </Nav.Item>
            <Nav.Item>
                <NavLink to="/#" className={linkClass}>
                FAQs
                </NavLink>
            </Nav.Item>
          </>
        );
        // ADMIN NAVBAR
        case 'admin':
          return (
            <>
              <Nav.Item>
              <NavLink to="/adminDashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </Nav.Item>
              <NavLink to="/manageUsers" className={linkClass}>
                Manage Users
              </NavLink>
              <Nav.Item>
                <NavLink to="/manageCoupons" className={linkClass}>
                Manage Coupons
                </NavLink>
              </Nav.Item>
            </>
          );
        // LOGIN NAVBAR
        case 'login':
          return (
            <>
              <Nav.Item>
                <NavLink to="/studentLogin" className={linkClass}>
                  Student
                </NavLink>
              </Nav.Item>
              <Nav.Item>
              <NavLink to="/merchantLogin" className={linkClass}>
                Merchant
              </NavLink>
              </Nav.Item>
            </>
          );

        // DEFAULT NAVBAR
        default:
          return (
            <>
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
            </>
          )
    }
  }
  return (
    <>
      <div>
        <header className="bg-orange-400 h-7"> 
        </header>
        <Navbar expand="lg" className="bg-white shadow-lg" style={{ marginBottom: '80px' }}>
          <Container>
            <Navbar.Brand href="#home" className="text-warning">NUSteals</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {renderLinks()}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
}

export default GeneralNavBar;
