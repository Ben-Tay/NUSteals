import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { TbLogout, TbScan } from "react-icons/tb";
import QRScannerModal from "./components/QRScannerModal.jsx";

const GeneralNavBar = ({ userRole }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue py-3 px-3 no-underline"
      : "text-black py-3 px-3 no-underline";

  const handleLogout = () => {
    // Clear the access token from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = (data) => {
    // Handle the scanned QR code data
    console.log('Scanned data:', data);
    // TODO: Call your redemption API here
    setShowScanner(false);
  };

  const renderLinks = () => {
    switch (userRole) {
      // MERCHANT NAVBAR
      case "merchant":
        return (
          <>
            <div className="flex justify-content-end">
              <Nav.Item className="flex">
                <NavLink to="/merchantLogin" className={linkClass} end>
                  Dashboard
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/merchantLogin/manageCoupons" className={linkClass}>
                  Manage Coupons
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/merchantLogin/merchantProfile" className={linkClass}>
                  Profile
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/merchantLogin/merchantFaqs" className={linkClass}>
                  FAQs
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <Button
                  variant="link"
                  className={linkClass}
                  onClick={() => setShowScanner(true)}
                >
                  <TbScan className="mr-2" />
                </Button>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/" className={linkClass} style={{ marginTop: "3px" }} onClick={handleLogout}>
                  <TbLogout className="mr-3 text-xl" />
                </NavLink>
              </Nav.Item>
            </div>
            <QRScannerModal
              show={showScanner}
              handleClose={() => setShowScanner(false)}
              onCodeScanned={handleScanComplete}
            />
          </>
        );
      // STUDENT NAVBAR
      case "student":
        return (
          <>
            <div className="flex justify-content-end">
              <Nav.Item className="flex">
                <NavLink to="/studentLogin/studentCoupon" className={linkClass}>
                  Redeem Coupons
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/studentLogin/profile" className={linkClass}>
                  Profile
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/studentLogin/faq" className={linkClass}>
                  FAQs
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/" className={linkClass} style={{ marginTop: "3px" }} onClick={handleLogout}>
                  <TbLogout className="mr-3 text-xl" />
                </NavLink>
              </Nav.Item>
            </div>
          </>
        );
      // ADMIN NAVBAR
      case "admin":
        return (
          <>
            <div className="flex justify-content-end">
              <Nav.Item className="flex">
                <NavLink to="/adminLogin" className={linkClass} end>
                  Dashboard
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink
                  to="/adminLogin/adminManageUsers"
                  className={linkClass}
                >
                  Manage Users
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink
                  to="/adminLogin/adminManageCoupon"
                  className={linkClass}
                >
                  Manage Coupons
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink to="/" className={linkClass} style={{ marginTop: "3px" }} onClick={handleLogout}>
                  <TbLogout className="mr-3 text-xl" />
                </NavLink>
              </Nav.Item>
            </div>
          </>
        );
      // LOGIN NAVBAR
      case "create":
        return (
          <>
            <Nav.Item>
              <NavLink to="/create" className={linkClass} end>
                Student
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/create/merchant" className={linkClass}>
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
        );
    }
  };
  return (
    <>
      <div>
        <header className="bg-orange-400 h-7"></header>
        <Navbar
          expand="lg"
          className="bg-white shadow-lg"
          style={{ marginBottom: "40px" }}
        >
          <Container>
            {/* Make the NUSteals logo clickable */}
            <Navbar.Brand as={Link} to="/" className="text-warning">
              NUSteals
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">{renderLinks()}</Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
};

export default GeneralNavBar;
