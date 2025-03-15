import React, { useState } from 'react';
import GeneralNavBar from '../../../layout/GeneralNavBar'
import { Row, Col, Button, Form, Modal } from 'react-bootstrap';
import './ManageCoupon.css'; // Reuse styles from ManageCoupon.css
import Coupon from '../../../layout/GeneralCoupon'; //Import general coupon template
import StudentCouponNavbar from '../../../layout/StudentCouponNavbar';

// Define RedeemButton component
const RedeemButton = ({ onClick }) => {
  return (
    <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={onClick}>
      Redeem
    </button>
  );
};

const StudentCoupon = () => {
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

  // State for search bar and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Open Coupon Redemption Modal
  const handleRedeemClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  return (
    <>
      <GeneralNavBar userRole="student" />
      <StudentCouponNavbar />

      {/* Search & Filter Section */}
      <div className="content-wrapper">
        <Row className="mb-3 align-items-center">
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

        {/* Filter Dropdown */}
        {showFilterDropdown && (
          <div className="box-orange">
            <h5>Filter by:</h5>
            <Form.Check
              type="checkbox"
              label="Starbucks"
              onChange={() => setSelectedFilters([...selectedFilters, 'Starbucks'])}
            />
            <Form.Check
              type="checkbox"
              label="Netflix"
              onChange={() => setSelectedFilters([...selectedFilters, 'Netflix'])}
            />
            <Form.Check
              type="checkbox"
              label="Percentage Discount"
              onChange={() => setSelectedFilters([...selectedFilters, 'Percentage Discount'])}
            />
          </div>
        )}

        {/* Coupons List */}
        <div className="coupon-list">
          {coupons
            .filter(coupon => coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((coupon) => (
              <Coupon
                key={coupon.id}
                brandLogo={coupon.logo}
                brandName={coupon.brand}
                discount={coupon.discount}
                descriptionHeader={coupon.brand}
                description={coupon.description}
              >
                {coupon.status === "redeemed" ? (
                  <Button variant="danger" disabled>Already Redeemed</Button>
                ) : (
                  <div className="flex flex-col items-center">
                    <RedeemButton onClick={() => handleRedeemClick(coupon)} />
                    <p className="text-sm text-gray-500 mt-2">{coupon.usage}</p>
                  </div>
                )}
              </Coupon>
            ))}
        </div>

        {/* Pagination */}
        <div className="text-center mt-3">
          <Button variant="light">1</Button> <Button variant="light">2</Button> ... <Button variant="light">9</Button>
        </div>

        {/* Coupon Redemption Modal */}
        {selectedCoupon && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Coupon Redemption</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>{selectedCoupon.brand} - {selectedCoupon.discount}</h5>
              <p>{selectedCoupon.description}</p>
              <p><strong>Code:</strong> {selectedCoupon.code}</p>
              <p><i>Please inform staff to enter the code at checkout.</i></p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => navigator.clipboard.writeText(selectedCoupon.code)}>
                Copy Code
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
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