import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './AddCoupon.css';

const AdminAddCoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [couponName, setCouponName] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('flat');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [category, setCategory] = useState('');
  const [totalCoupons, setTotalCoupons] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [editingCoupon, setEditingCoupon] = useState(location.state?.editingCoupon || null);
  const [showModal, setShowModal] = useState(false);
  const [couponNameError, setCouponNameError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); // default to false

  const standardTemplate = `Standard Terms & Conditions:
1. Offer valid until the expiry date.
2. Applicable only on select items.
3. Cannot be combined with any other offer.
4. Subject to change without prior notice.`;

  useEffect(() => {
    if (!editingCoupon) {
      console.warn('No coupon found in location.state. Redirecting.');
      navigate('/admin-dashboard'); // or wherever
      return;
    }

    // Populate fields
    setCouponName(editingCoupon.couponName || '');
    setDiscount(editingCoupon.discount || '');
    setDiscountType(editingCoupon.discountType || 'flat');
    setDescription(editingCoupon.description || '');
    setTerms(editingCoupon.termsConditions || '');
    setCategory(editingCoupon.category || '');
    setTotalCoupons(editingCoupon.totalNum || '');

    // Use `disable` from backend
    setIsDisabled(editingCoupon.disable ?? false);

    if (editingCoupon.expiryDate) {
      const date = new Date(editingCoupon.expiryDate);
      const formattedDate = date.toISOString().split('T')[0];
      setExpiryDate(formattedDate);
    }
  }, [editingCoupon]);

  const handleToggleDisable = async () => {
    if (!editingCoupon || !editingCoupon._id) return;

    try {
      const response = await fetch(`https://nusteals-express.onrender.com/api/coupons/${editingCoupon._id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Toggle failed');

      const updated = await response.json();

      // ✅ Backend returns full coupon object in `updated.coupon`
      const updatedCoupon = updated.coupon;

      setIsDisabled(updatedCoupon.disable);
      setEditingCoupon(prev => ({ ...prev, disable: updatedCoupon.disable }));

      alert(`Coupon ${updatedCoupon.disable ? 'disabled' : 'enabled'} successfully!`);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      alert('Failed to update coupon status');
    }
  };

  return (
    <div className="content-wrapper mb-4">
      <h1>{editingCoupon ? 'EDIT COUPON' : 'ADD COUPON'}</h1>
      <br />
      <Row className="g-5">
        <Col>
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
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          {editingCoupon && (
            <Button
              variant={isDisabled ? "success" : "danger"}
              className="ms-2"
              onClick={handleToggleDisable}
            >
              {isDisabled ? "Enable Coupon" : "Disable Coupon"}
            </Button>
          )}
        </Col>

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
  );
};

export default AdminAddCoupon;