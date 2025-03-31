import React, { useState, useEffect } from 'react';
import GeneralNavBar from '../../../layout/GeneralNavBar';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './AddCoupon.css';

const AddCoupon = () => {
  const [couponName, setCouponName] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('flat'); // 'flat' or 'percentage'
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [category, setCategory] = useState('');
  const [totalCoupons, setTotalCoupons] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Standard T&C template string; adjust as needed
  const standardTemplate = `Standard Terms & Conditions:
1. Offer valid until the expiry date.
2. Applicable only on select items.
3. Cannot be combined with any other offer.
4. Subject to change without prior notice.`;

  const handleCreateCoupon = () => {
    // Handle coupon creation logic
    console.log({
      couponName,
      discount,
      discountType,
      description,
      terms,
      category,
      totalCoupons,
      expiryDate,
    });
  };

  // Function to fill in standard T&C
  const fillTemplate = () => {
    setTerms(standardTemplate);
  };

  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <div className="content-wrapper mb-4">
        <h1>ADD COUPON</h1>
        <br />

        <Row className="g-5">
          {/* LEFT SIDE */}
          <Col>
            {/* Coupon Name */}
            <Row className="mb-4">
              <div className="box-orange">
                <h3>Coupon Name:</h3>
                <Form.Control
                  type="text"
                  placeholder="Enter coupon name"
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                />
              </div>
            </Row>

            {/* Discount with two options */}
            <Row className="mb-4">
              <div className="box-orange">
                <h2>DISCOUNT:</h2>
                <Form>
                  <Form.Group>
                    <Form.Check
                      inline
                      type="radio"
                      label="Flat Value"
                      name="discountType"
                      id="flatDiscount"
                      value="flat"
                      checked={discountType === 'flat'}
                      onChange={(e) => setDiscountType(e.target.value)}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Percentage"
                      name="discountType"
                      id="percentageDiscount"
                      value="percentage"
                      checked={discountType === 'percentage'}
                      onChange={(e) => setDiscountType(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Control
                    type="number"
                    placeholder={
                      discountType === 'flat'
                        ? 'Enter flat discount amount (e.g., 5 for $5 off)'
                        : 'Enter discount percentage (e.g., 10 for 10% off)'
                    }
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </Form>
              </div>
            </Row>

            {/* Description */}
            <Row className="mb-4">
              <div className="box-orange">
                <h2>DESCRIPTION:</h2>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter a short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </Row>

            {/* Terms & Conditions with Template Button */}
            <Row className="mb-4">
              <div className="box-orange">
                <h2>TERMS & CONDITIONS:</h2>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter terms & conditions"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                />
                <Button variant="secondary" size="sm" className="mt-2" onClick={fillTemplate}>
                  Use Standard Template
                </Button>
              </div>
            </Row>

            {/* Create Button */}
            <Button variant="warning" onClick={handleCreateCoupon}>
              Create
            </Button>
          </Col>

          {/* RIGHT SIDE */}
          <Col>
            <div className="bigger-box-orange">
              <Row className="mb-4">
                <div className="box-orange">
                  <p>Coupon Category:</p>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Electronics, Clothing, etc."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </Row>
              <Row className="mb-4">
                <div className="box-orange">
                  <p>Total Number of Coupons:</p>
                  <Form.Control
                    type="number"
                    placeholder="Enter total coupons"
                    value={totalCoupons}
                    onChange={(e) => setTotalCoupons(e.target.value)}
                  />
                  <br />
                  <p>Expiry Date:</p>
                  <Form.Control
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AddCoupon;