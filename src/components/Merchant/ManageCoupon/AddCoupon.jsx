import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import GeneralNavBar from '../../../layout/GeneralNavBar';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './AddCoupon.css';

const AddCoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [couponName, setCouponName] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('flat'); // 'flat' or 'percentage'
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [category, setCategory] = useState('');
  const [totalCoupons, setTotalCoupons] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [editingCoupon, setEditingCoupon] = useState(location.state?.editingCoupon || null);
  const [showModal, setShowModal] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponNameError, setCouponNameError] = useState("");
  const [disable, setDisable] = useState(false);

  // Standard T&C template string; adjust as needed
  const standardTemplate = `Standard Terms & Conditions:
1. Offer valid until the expiry date.
2. Applicable only on select items.
3. Cannot be combined with any other offer.
4. Subject to change without prior notice.`;

  useEffect(() => {
    if (editingCoupon) {
      setCouponName(editingCoupon.couponName);
      setDiscount(editingCoupon.discount);
      setDiscountType(editingCoupon.discountType);
      setDescription(editingCoupon.description);
      setTerms(editingCoupon.termsConditions);
      setCategory(editingCoupon.category);
      setTotalCoupons(editingCoupon.totalNum);

      // Convert ISO date to yyyy-mm-dd
      if (editingCoupon.expiryDate) {
        const date = new Date(editingCoupon.expiryDate);
        const formattedDate = date.toISOString().split('T')[0];
        setExpiryDate(formattedDate);
      }
    }
  }, [editingCoupon]);

  // CREATE COUPON
  const handleCreateCoupon = async () => {
    if (!couponName || !discount || !expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/coupons', {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponName,
          discount: Number(discount),
          discountType,
          description,
          termsConditions: terms,
          category,
          totalNum: Number(totalCoupons),
          expiryDate,
            disable,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create coupon');
      }

      const newCoupon = await response.json();
      navigate('/manageCoupons'); // Redirect after success
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    }
  };

  // EDIT COUPON
  const handleSaveChanges = async (couponId) => {
    console.log("Editing coupon data:", editingCoupon);
    if (!editingCoupon || !editingCoupon._id) {
      console.error("No coupon ID available for updating");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/coupons/${editingCoupon._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponName,
          discount,
          discountType,
          description,
          termsConditions: terms,
          category,
          totalNum: totalCoupons,
          expiryDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update coupon');
      }

      const updatedCoupon = await response.json();
      alert('Coupon updated successfully!');
      setEditingCoupon(null);
      setShowModal(false);
      navigate('/manageCoupons'); // Redirect after success
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Failed to update coupon');
    }
  };

  // DELETE COUPON
  const handleCouponDelete = async (couponId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete coupon');
      }

      alert('Coupon deleted successfully!');
      setShowDeleteModal(false);
      setCouponToDelete(null);
      navigate('/manageCoupons'); // Redirect after delete
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setShowDeleteModal(true);
  };

  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <div className="content-wrapper mb-4">
        <h1>{editingCoupon ? 'EDIT COUPON' : 'ADD COUPON'}</h1>
        <br />

        <Row className="g-5">
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
                {couponNameError && <div className="error">{couponNameError}</div>}
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
                    placeholder={discountType === 'flat' ? 'Flat discount amount' : 'Percentage'}
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

            {/* Terms & Conditions */}
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
                <Button variant="secondary" size="sm" className="mt-2" onClick={() => setTerms(standardTemplate)}>
                  Use Standard Template
                </Button>
              </div>
            </Row>

            <Button variant="warning" onClick={editingCoupon ? handleSaveChanges : handleCreateCoupon}>
              {editingCoupon ? 'Save Changes' : 'Create'}
            </Button>

            {editingCoupon && (
              <Button variant="danger" className="ms-2" onClick={() => handleDeleteClick(editingCoupon)}>
                Delete Coupon
              </Button>
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Coupon</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this coupon?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => handleCouponDelete(couponToDelete._id)}>Delete</Button>
              </Modal.Footer>
            </Modal>

          </Col>

          {/* Right Side */}
          <Col>
            <div className="bigger-box-orange">
              {/* Category, Total Coupons, Expiry Date */}
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
