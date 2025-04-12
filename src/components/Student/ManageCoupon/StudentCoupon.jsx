import React, { useState, useEffect, use } from "react";
import { Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink for navigation
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
import "./ManageCoupon.css"; // Reuse styles from ManageCoupon.css
import Coupon from "../../../layout/GeneralCoupon"; // Import general coupon template

const apiURL = "http://localhost:3000"; // API URL

// Define RedeemButton component
const RedeemButton = ({ onClick }) => {
  return (
    <button
      className="bg-green-500 text-white py-2 px-4 rounded"
      onClick={onClick}
    >
      Redeem
    </button>
  );
};

const StudentCoupon = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // State for search bar and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");

  // Sorting
  const sortCoupons = (coupons, sortType) => {
    switch (sortType) {
      case "recent":
        return [...coupons].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "popular":
        return [...coupons].sort((a, b) => b.redeemedNum - a.redeemedNum);
      case "percentageHigh":
        return [...coupons].sort((a, b) => {
          if (
            a.discountType === "percentage" &&
            b.discountType === "percentage"
          ) {
            return b.discount - a.discount;
          }
          return a.discountType === "percentage" ? -1 : 1;
        });
      case "flatHigh":
        return [...coupons].sort((a, b) => {
          if (a.discountType === "flat" && b.discountType === "flat") {
            return b.discount - a.discount;
          }
          return a.discountType === "flat" ? -1 : 1;
        });
      default:
        return coupons;
    }
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Fetch token from local storage and decode it to get logged in user ID
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.uid;

        // Fetch coupons from the API
        const response = await fetch(`${apiURL}/api/coupons/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch coupon data");
          setIsLoading(false);
          return;
        }

        // Cache all valid coupons
        const couponData = await response.json();
        console.log(couponData);
        setCoupons(couponData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching coupon data:", err);
        setError("Failed to fetch coupon data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle discount type filter change
  const handleDiscountTypeChange = (type) => {
    setDiscountTypeFilter(type);
  };

  // Filter coupons based on search term and discount type
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDiscountType =
      discountTypeFilter === "all" ||
      coupon.discountType.toLowerCase() === discountTypeFilter.toLowerCase();

    return matchesSearch && matchesDiscountType;
  });

  // Open Coupon Redemption Modal
  const handleRedeemClick = async (coupon) => {
    try {
      console.log("Redeeming coupon:", coupon._id);
      // Call API to get a unique code
      const response = await fetch(
        `${apiURL}/api/coupons/${coupon._id}/get-code`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get coupon code");
      }

      const { code } = await response.json();

      // Set the selected coupon with the retrieved code
      setSelectedCoupon({
        ...coupon,
        code: code,
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error getting coupon code:", error);
      setError(error.message || "Failed to get coupon code");
    }
  };

  // Render loading spinner
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  //Render error message if any
  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <>
      {/* Search & Navigation Section */}
      <div className="content-wrapper">
        <Row className="mb-3 align-items-center">
          <Col xs={12} className="text-center mb-3">
            {/* Navigation Buttons */}
            <NavLink
              to="/studentLogin/studentCoupon"
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
            <Button
              variant="outline-secondary"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              🔍 Filter
            </Button>
          </Col>
        </Row>

        {/* Updated Filter Dropdown */}
        {showFilterDropdown && (
          <div className="box-orange">
            <h5>Filter by Discount Type:</h5>
            <Form.Check
              type="radio"
              name="discountType"
              label="All Discounts"
              checked={discountTypeFilter === "all"}
              onChange={() => handleDiscountTypeChange("all")}
            />
            <Form.Check
              type="radio"
              name="discountType"
              label="Flat Discount"
              checked={discountTypeFilter === "flat"}
              onChange={() => handleDiscountTypeChange("flat")}
            />
            <Form.Check
              type="radio"
              name="discountType"
              label="Percentage Discount"
              checked={discountTypeFilter === "percentage"}
              onChange={() => handleDiscountTypeChange("percentage")}
            />
          </div>
        )}

        {/* Sort Buttons */}
        <Row className="mb-3">
          <Col>
            <div className="sort-buttons">
              <Button
                variant={sortBy === "recent" ? "primary" : "outline-primary"}
                onClick={() => setSortBy("recent")}
              >
                Most Recent
              </Button>
              <Button
                variant={sortBy === "popular" ? "primary" : "outline-primary"}
                onClick={() => setSortBy("popular")}
              >
                Most Popular
              </Button>
              <Button
                variant={
                  sortBy === "percentageHigh" ? "primary" : "outline-primary"
                }
                onClick={() => setSortBy("percentageHigh")}
              >
                Highest % Discount
              </Button>
              <Button
                variant={sortBy === "flatHigh" ? "primary" : "outline-primary"}
                onClick={() => setSortBy("flatHigh")}
              >
                Highest $ Discount
              </Button>
            </div>
          </Col>
        </Row>

        {/* Update Coupons List */}
        <div className="coupon-list">
          {sortCoupons(
            coupons.filter((coupon) =>
              coupon.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ),
            sortBy
          ).map((coupon) => (
            <Coupon
              key={coupon._id}
              brandName="Unknown"
              coupon={coupon}
              role="student"
              onRedeemClick={() => handleRedeemClick(coupon)}
            />
          ))}
        </div>

        {/* Coupon Redemption Modal */}
        {selectedCoupon && (
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Coupon Redemption</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Coupon Details */}
              <h5>
                {selectedCoupon.couponName} - {selectedCoupon.discount}
                {selectedCoupon.discountType === 'percentage' ? '%' : '$'} off
              </h5>
              <p>{selectedCoupon.description}</p>

              {/* Terms & Conditions */}
              <div className="mt-4 mb-3">
                <h6 className="text-secondary">Terms & Conditions</h6>
                <div className="p-3 bg-light rounded border">
                  <small className="text-muted">
                    {selectedCoupon.termsConditions || 'No terms and conditions specified.'}
                  </small>
                </div>
              </div>

              {/* Redemption Code */}
              <div className="mt-4">
                <h6>Your Redemption Code</h6>
                <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center">
                  <code className="h5 mb-0">{selectedCoupon.code}</code>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(selectedCoupon.code)}
                  >
                    Copy Code
                  </Button>
                </div>
                <p className="mt-2 text-muted">
                  <i className="bi bi-info-circle me-2"></i>
                  Please inform staff to enter the code at checkout.
                </p>
              </div>

              {/* Expiry Information */}
              <div className="mt-3">
                <small className="text-danger">
                  Expires: {new Date(selectedCoupon.expiryDate).toLocaleDateString()}
                </small>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                setShowModal(false);
                setSelectedCoupon(null);
              }}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};

export default StudentCoupon;
