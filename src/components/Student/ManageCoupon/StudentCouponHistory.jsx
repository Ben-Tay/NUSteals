import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Modal, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink for navigation
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
import "./ManageCoupon.css"; // Reuse styles from ManageCoupon.css
import Coupon from "../../../layout/GeneralCoupon"; // Import general coupon template
import StudentCouponNavbar from "../../../layout/StudentCouponNavbar";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

const apiURL = "https://nusteals-express.onrender.com"; // API URL

const StudentCoupon = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // State for search bar and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when filters or search are changed
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, discountTypeFilter, sortBy]);

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
        const response = await fetch(`${apiURL}/api/coupons/`, {
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

        // Filter for coupns redeemed by logged in user then cache them
        const couponData = await response.json();
        const usedCoupons = couponData.filter((coupon) =>
          coupon.uniqueCodes?.some((code) => code.usedBy === userId)
        );
        setCoupons(usedCoupons);
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

  const sortedCoupons = sortCoupons(filteredCoupons, sortBy);
  const totalPages = Math.ceil(sortedCoupons.length / itemsPerPage);
  const paginatedCoupons = sortedCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {paginatedCoupons.length === 0 ? (
            <div className="text-center text-muted my-5">
              <h4>No coupons redeemed yet. Check back later!</h4>
            </div>
          ) : (
            paginatedCoupons.map((coupon) => (
              <Coupon key={coupon._id} brandName="Unknown" coupon={coupon} />
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {sortedCoupons.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <Button
              className="pagination-button me-2 px-4"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <BiSolidLeftArrow className="me-2" /> Prev
            </Button>

            <span className="align-self-center mx-3">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              className="pagination-button ms-2 px-4"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next <BiSolidRightArrow className="ms-2" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentCoupon;
