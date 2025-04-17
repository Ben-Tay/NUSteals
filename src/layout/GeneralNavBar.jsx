import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { TbLogout, TbScan } from "react-icons/tb";
import QRScannerModal from "./components/QRScannerModal.jsx";
import logo from "../assets/NUSteals logo.png";

const GeneralNavBar = ({ userRole }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue py-1 px-2 no-underline text-sm"
      : "text-black py-1 px-2 no-underline text-sm";

  const apiURL = "https://nusteals-express.onrender.com"; // API URL

  const handleLogout = () => {
    // Clear the access token from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  };

  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = async (data) => {
    try {
      const response = await fetch(`${apiURL}/api/coupons/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          code: data.code,
          studentId: data.studentId,
          couponId: data.couponId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.details || "Redemption failed.");
        return;
      }

      const result = await response.json();
      const { coupon } = result;

      // ✅ Display coupon name and details in alert
      alert(
        `✅ Coupon Redeemed Successfully!\n\n` +
          `🧾 Coupon: ${coupon.couponName}\n` +
          `💬 Description: ${coupon.description}\n` +
          `🎯 Discount: ${
            coupon.discountType === "flat"
              ? `$${coupon.discount}`
              : `${coupon.discount}%`
          }\n` +
          `📆 Expiry: ${new Date(coupon.expiryDate).toLocaleDateString()}`
      );

      setShowScanner(false);
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      alert("An unexpected error occurred. Please try again.");
    }
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
                <NavLink
                  to="/merchantLogin/manageCoupons"
                  className={linkClass}
                >
                  Manage Coupons
                </NavLink>
              </Nav.Item>
              <Nav.Item className="flex">
                <NavLink
                  to="/merchantLogin/merchantProfile"
                  className={linkClass}
                >
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
                <NavLink
                  to="/"
                  className={linkClass}
                  style={{ marginTop: "3px" }}
                  onClick={handleLogout}
                >
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
                <NavLink
                  to="/"
                  className={linkClass}
                  style={{ marginTop: "3px" }}
                  onClick={handleLogout}
                >
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
                <NavLink
                  to="/"
                  className={linkClass}
                  style={{ marginTop: "3px" }}
                  onClick={handleLogout}
                >
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
          className="bg-white shadow-sm"
          style={{
            marginBottom: "24px",
            minHeight: "48px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          <Container fluid>
            {/* Make the NUSteals logo clickable */}
            <Navbar.Brand
              as={Link}
              to="/"
              className="d-flex align-items-center ps-16"
            >
              <img
                src={logo}
                alt="NUSteals logo"
                height="28" // try reducing to 24 or 20
                style={{ maxWidth: "100px", objectFit: "contain" }}
              />
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
