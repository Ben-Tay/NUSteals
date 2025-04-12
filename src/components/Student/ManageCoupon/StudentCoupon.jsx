import React, { useState, useEffect, use } from "react";
import { Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink for navigation
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
import "./ManageCoupon.css"; // Reuse styles from ManageCoupon.css
import Coupon from "../../../layout/GeneralCoupon"; // Import general coupon template
import RedemptionModal from "../components/RedemptionModal"; // Import RedemptionModal component
import StudentCouponNavbar from "../../../layout/StudentCouponNavbar";

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
    if (!Array.isArray(coupons)) return [];

    switch (sortType) {
      case "recent":
        return [...coupons].sort((a, b) => {
          // Remove isHistoryView since it's not defined
          const dateA = new Date(a?.createdAt || 0);
          const dateB = new Date(b?.createdAt || 0);
          return dateB - dateA;
        });

      case "popular":
        return [...coupons].sort(
          (a, b) =>
            // Fix syntax error in comparison
            (b?.redeemedNum || 0) - (a?.redeemedNum || 0)
        );

      case "percentageHigh":
        return [...coupons].sort((a, b) => {
          if (
            a?.discountType === "percentage" &&
            b?.discountType === "percentage"
          ) {
            // Fix syntax error in comparison
            return (b?.discount || 0) - (a?.discount || 0);
          }
          return a?.discountType === "percentage" ? -1 : 1;
        });

      case "flatHigh":
        return [...coupons].sort((a, b) => {
          if (a?.discountType === "flat" && b?.discountType === "flat") {
            // Fix syntax error in comparison
            return (b?.discount || 0) - (a?.discount || 0);
          }
          return a?.discountType === "flat" ? -1 : 1;
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
    if (!coupon) return false;

    const matchesSearch =
      coupon?.description?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      coupon?.couponName?.toLowerCase()?.includes(searchTerm.toLowerCase());

    const matchesDiscountType =
      discountTypeFilter === "all" ||
      coupon?.discountType?.toLowerCase() === discountTypeFilter.toLowerCase();

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

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCoupon(null);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code:", err);
        alert("Failed to copy code. Please try again.");
      });
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
          <StudentCouponNavbar />
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

        {/* Coupons List */}
        <div className="coupon-list">
          {coupons.length === 0 ? (
            <div className="text-center text-muted my-5">
              <h4>No available coupons</h4>
            </div>
          ) : (
            sortCoupons(
              // Replace this filter with filteredCoupons
              filteredCoupons,
              sortBy
            ).map((coupon) => (
              <Coupon
                key={coupon._id}
                brandName="Unknown"
                coupon={coupon}
                role="student"
                onRedeemClick={handleRedeemClick}
              />
            ))
          )}
        </div>

        {/* Coupon Redemption Modal */}
        {selectedCoupon && (
          <RedemptionModal
            selectedCoupon={selectedCoupon}
            showModal={showModal}
            handleClose={handleCloseModal}
            handleCopyCode={handleCopyCode}
          />
        )}
      </div>
    </>
  );
};

export default StudentCoupon;
