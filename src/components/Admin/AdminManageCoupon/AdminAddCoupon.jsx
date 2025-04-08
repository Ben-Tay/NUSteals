import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './AddCoupon.css';

const AddCoupon = () => {
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
  const [isDisabled, setIsDisabled] = useState(editingCoupon?.isDisabled || false);

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
      setIsDisabled(editingCoupon.isDisabled || false);

      if (editingCoupon.expiryDate) {
        const date = new Date(editingCoupon.expiryDate);
        const formattedDate = date.toISOString().split('T')[0];
        setExpiryDate(formattedDate);
      }
    }
  }, [editingCoupon]);

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create coupon');
      }

      await response.json();
      navigate('/manageCoupons');
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    }
  };

  const handleSaveChanges = async () => {
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

      alert('Coupon updated successfully!');
      setEditingCoupon(null);
      setShowModal(false);
      navigate('/adminLogin/adminManageCoupon');
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Failed to update coupon');
    }
  };

  const handleToggleDisable = async () => {
    if (!editingCoupon || !editingCoupon._id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/coupons/${editingCoupon._id}/toggleDisable`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDisabled: !isDisabled }),
      });

      if (!response.ok) throw new Error('Toggle failed');

      setIsDisabled(!isDisabled);
      alert(`Coupon ${!isDisabled ? 'disabled' : 'enabled'} successfully!`);
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

          <Button variant="warning" onClick={editingCoupon ? handleSaveChanges : handleCreateCoupon}>
            {editingCoupon ? 'Save Changes' : 'Create'}
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

export default AddCoupon;
