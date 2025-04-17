import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import NavLink for navigation
import "./ManageCoupon.css"; // Reuse styles from ManageCoupon.css
import Coupon from "../../../layout/GeneralCoupon"; // Import general coupon template
import StudentCouponNavbar from "../../../layout/StudentCouponNavbar";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import FilterDropdown from "../components/FilterDropdown";

const apiURL = "https://nusteals-express.onrender.com"; // API URL

const StudentCouponHistory = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const itemsPerPage = 5;

  // Extract unique brands and categories
  const extractFilters = (couponData) => {
    const brands = [
      ...new Set(couponData.map((coupon) => coupon.merchant?.name)),
    ].sort();
    const categories = [
      ...new Set(couponData.map((coupon) => coupon.category)),
    ].sort();
    setAvailableBrands(brands);
    setAvailableCategories(categories);
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Fetch token from local storage and check if user is logged in
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const role = localStorage.getItem("userRole");

        if (role === "admin") {
          navigate("/adminLogin");
        } else if (role === "merchant") {
          navigate("/merchantLogin");
        }

        // Fetch coupons from the API
        const response = await fetch(
          `${apiURL}/api/coupons/student?type=history`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch coupon data");
          setIsLoading(false);
          return;
        }

        // Cache all valid coupons
        const couponData = await response.json();
        setCoupons(couponData);
        extractFilters(couponData); // Extract filters from coupon data
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

  // Add a single filter change handler
  const handleFilterChange = ({
    discountType = discountTypeFilter,
    brands = selectedBrands,
    categories = selectedCategories,
    search = searchTerm,
  }) => {
    setDiscountTypeFilter(discountType);
    setSelectedBrands(brands);
    setSelectedCategories(categories);
    setSearchTerm(search);
    setCurrentPage(1);
  };

  // Handle Search
  const handleSearch = (e) => {
    handleFilterChange({ search: e.target.value });
  };

  // Handle discount type filter change
  const handleDiscountTypeChange = (type) => {
    handleFilterChange({ discountType: type });
  };

  // Handle brand filter change
  const handleBrandChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    handleFilterChange({ brands: updatedBrands });
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    handleFilterChange({ categories: updatedCategories });
  };

  // Clear filters handler
  const handleClearFilters = () => {
    handleFilterChange({
      discountType: "all",
      brands: [],
      categories: [],
      search: "",
    });
    setShowFilterDropdown(false);
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

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(coupon.merchant?.name);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(coupon.category);

    return (
      matchesSearch && matchesDiscountType && matchesBrand && matchesCategory
    );
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = filteredCoupons.slice(
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
          <FilterDropdown
            discountTypeFilter={discountTypeFilter}
            selectedBrands={selectedBrands}
            selectedCategories={selectedCategories}
            availableBrands={availableBrands}
            availableCategories={availableCategories}
            onDiscountTypeChange={handleDiscountTypeChange}
            onBrandChange={handleBrandChange}
            onCategoryChange={handleCategoryChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Coupons List */}
        <div className="coupon-list">
          {filteredCoupons.length === 0 ? (
            <div className="text-center text-muted my-5">
              <h4>No redeemed coupons found with search criteria.</h4>
            </div>
          ) : (
            paginatedCoupons.map((coupon) => (
              <Coupon key={coupon._id} coupon={coupon} />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {filteredCoupons.length > 0 && (
          <div className="d-flex justify-content-center mt-4 mb-4">
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

export default StudentCouponHistory;
