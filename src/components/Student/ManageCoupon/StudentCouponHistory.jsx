import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom"; // Import NavLink for navigation
import "./ManageCoupon.css"; // Reuse styles from ManageCoupon.css
import Coupon from "../../../layout/GeneralCoupon"; // Import general coupon template

const StudentCouponHistory = () => {
  // Sample coupons (could be replaced with API fetch)
  const coupons = [
    {
      id: 1,
      brand: "Denny's",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Denny%27s_Logo.svg/2560px-Denny%27s_Logo.svg.png",
      discount: "20% off",
      description: "20% off your next visit when you join the Rewards Program!",
      usage: "422 used today",
      status: "redeemed", // or "available"
      code: "RX89ggG9430",
    },
    {
      id: 2,
      brand: "Denny's",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Denny%27s_Logo.svg/2560px-Denny%27s_Logo.svg.png",
      discount: "$5 off",
      description: "Get $5 off online orders of $25 or more!",
      usage: "312 used today",
      status: "available",
      code: "ABC123XYZ",
    },
  ];

  // State for search bar
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {/* Search & Navigation Section */}
      <div className="content-wrapper">
        <Row className="mb-3 align-items-center">
          <Col xs={12} className="text-center mb-3">
            {/* Navigation Buttons */}
            <NavLink
              to="/studentLogin/studentCoupon"
              end
              className={({ isActive }) =>
                `px-4 py-2 mx-2 ${
                  isActive ? "text-orange-500 font-bold" : "text-black"
                }`
              }
            >
              All Coupons
            </NavLink>
            <NavLink
              to="/studentLogin/studentCoupon/history"
              className={({ isActive }) =>
                `px-4 py-2 mx-2 ${
                  isActive ? "text-orange-500 font-bold" : "text-black"
                }`
              }
            >
              View My History
            </NavLink>
          </Col>
          <Col xs={9}>
            {/* Search Bar */}
            <Form.Control
              type="text"
              placeholder="Search Coupons..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Col>
          <Col xs={3} className="text-end">
            <Button variant="outline-secondary">🔍 Filter</Button>
          </Col>
        </Row>

        {/* Coupons List */}
        <div className="coupon-list">
          {coupons
            .filter((coupon) =>
              coupon.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((coupon) => (
              <Coupon
                key={coupon.id}
                brandLogo={coupon.logo}
                brandName={coupon.brand}
                discount={coupon.discount}
                descriptionHeader={coupon.brand}
                description={coupon.description}
              ></Coupon>
            ))}
        </div>

        {/* Pagination */}
        <div className="text-center mt-3">
          <Button variant="light">1</Button> <Button variant="light">2</Button>{" "}
          ... <Button variant="light">9</Button>
        </div>
      </div>
    </>
  );
};

export default StudentCouponHistory;
