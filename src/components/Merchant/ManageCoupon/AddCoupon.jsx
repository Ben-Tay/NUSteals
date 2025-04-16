import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Button, Form } from 'react-bootstrap';
import './AddCoupon.css';

const STANDARD_CATEGORIES = [
  'Clothing',
  'Food & Beverages', 
  'Home & Living',
  'Sports',
  'Others'
];

// Standard T&C template string; adjust as needed
const standardTemplate = `Standard Terms & Conditions:
1. Offer valid until the expiry date.
2. Applicable only on select items.
3. Cannot be combined with any other offer.
4. Subject to change without prior notice.`;

const AddCoupon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = 'https://nusteals-express.onrender.com';

  const [couponName, setCouponName] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('flat');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [totalCoupons, setTotalCoupons] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [editingCoupon, setEditingCoupon] = useState(location.state?.editingCoupon || null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [disable, setDisable] = useState(false);
  const finalCategory = category === 'Others' ? customCategory : category;
  const [errors, setErrors] = useState({
    couponName: '',
    discountType: '',
    discount: '',
    description: '',
    termsConditions: '',
    category: '',
    totalNum: '',
    expiryDate: ''
  });

  // VALIDATE ERRORS (keep original implementation)
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!couponName.trim()) {
      newErrors.couponName = 'Coupon name is required';
      isValid = false;
    }

    if (!discount) {
      newErrors.discount = 'Discount value is required';
      isValid = false;
    } else if (isNaN(discount)) {
      newErrors.discount = 'Discount must be a number';
      isValid = false;
    } else if (discountType === 'percentage' && (discount < 0 || discount > 100)) {
      newErrors.discount = 'Percentage must be between 0-100';
      isValid = false;
    } else if (discountType === 'flat' && discount < 0) {
      newErrors.discount = 'Flat discount cannot be negative';
      isValid = false;
    } 

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!terms.trim()) {
      newErrors.termsConditions = 'Terms & Conditions are required';
      isValid = false;
    }

    if (!totalCoupons || isNaN(totalCoupons) || totalCoupons < 1) {
      newErrors.totalNum = 'Must be a positive integer';
      isValid = false;
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    }

    if (!category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    if (category === 'Others' && !customCategory.trim()) {
      newErrors.category = 'Please specify a custom category';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Keep original useEffect
  useEffect(() => {
    if (editingCoupon) {
      setCouponName(editingCoupon.couponName);
      setDiscount(editingCoupon.discount);
      setDiscountType(editingCoupon.discountType);
      setDescription(editingCoupon.description);
      setTerms(editingCoupon.termsConditions);
      setTotalCoupons(editingCoupon.totalNum);

      const isStandardCategory = STANDARD_CATEGORIES.includes(editingCoupon.category);
      setCategory(isStandardCategory ? editingCoupon.category : 'Others');
      setCustomCategory(isStandardCategory ? '' : editingCoupon.category);

      if (editingCoupon.expiryDate) {
        const date = new Date(editingCoupon.expiryDate);
        const formattedDate = date.toISOString().split('T')[0];
        setExpiryDate(formattedDate);
      }
    }
  }, [editingCoupon]);

  // Keep original handleCreateCoupon
  const handleCreateCoupon = async () => {
    setErrors({});
    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_URL}/api/coupons`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponName,
          discount: Number(discount),
          discountType,
          description,
          termsConditions: terms,
          category: finalCategory,
          totalNum: Number(totalCoupons),
          expiryDate,
          disable,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const validationErrors = {};
          data.errors.forEach(error => {
            validationErrors[error.path] = error.msg;
          });
          setErrors(validationErrors);
        } else {
          throw new Error(data.message || 'Failed to create coupon');
        }
        return;
      }
      navigate('/merchantLogin/manageCoupons');
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert(error.message || 'Failed to create coupon');
    }
  };

  // Keep original handleSaveChanges
  const handleSaveChanges = async () => {
    if (!editingCoupon || !editingCoupon._id) {
      console.error("No coupon ID available for updating");
      return;
    }

    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_URL}/api/coupons/${editingCoupon._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponName,
          discount,
          discountType,
          description,
          termsConditions: terms,
          category: finalCategory,
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
      navigate('/merchantLogin/manageCoupons');
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Failed to update coupon');
    }
  };

  // Keep original delete functionality
  const handleCouponDelete = async (couponId) => {
    try {
      const response = await fetch(`${API_URL}/api/coupons/${couponId}`, {
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
      navigate('/merchantLogin/manageCoupons');
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
    <div className="content-wrapper mb-4">
      <h1>{editingCoupon ? 'EDIT COUPON' : 'ADD COUPON'}</h1>
      <br />

      <Row className="g-4">
        <Col>
          {/* Coupon Name */}
          <div className="box-orange mb-4">
            <h3>Coupon Name:</h3>
            <Form.Control
              type="text"
              placeholder="Enter coupon name"
              value={couponName}
              onChange={(e) => setCouponName(e.target.value)}
              isInvalid={!!errors.couponName}
            />
            {errors.couponName && (
              <div className="floating-error">
                {errors.couponName}
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="box-orange mb-4">
            <h3>DISCOUNT:</h3>
            <Form.Group className="mb-3">
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
              isInvalid={!!errors.discount}
            />
            {errors.discount && (
              <div className="floating-error">
                {errors.discount}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="box-orange mb-4">
            <h3>DESCRIPTION:</h3>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter a short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
            />
            {errors.description && (
              <div className="floating-error">
                {errors.description}
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="box-orange mb-4">
            <h3>TERMS & CONDITIONS:</h3>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter terms & conditions"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              isInvalid={!!errors.termsConditions}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2" 
              onClick={() => setTerms(standardTemplate)}
            >
              Use Standard Template
            </Button>
            {errors.termsConditions && (
              <div className="floating-error">
                {errors.termsConditions}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="box-orange mb-4">
            <h3>CATEGORY:</h3>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              isInvalid={!!errors.category}
            >
              <option value="">Select Category</option>
              {STANDARD_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Form.Select>
            {category === 'Others' && (
              <Form.Control
                type="text"
                placeholder="Specify category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2"
                isInvalid={!!errors.category}
              />
            )}
            {errors.category && (
              <div className="floating-error">
                {errors.category}
              </div>
            )}
          </div>

          {/* Total Coupons */}
          <div className="box-orange mb-4">
            <h3>TOTAL NUMBER OF COUPONS:</h3>
            <Form.Control
              type="number"
              placeholder="Enter total coupons"
              value={totalCoupons}
              onChange={(e) => setTotalCoupons(e.target.value)}
              isInvalid={!!errors.totalNum}
            />
            {errors.totalNum && (
              <div className="floating-error">
                {errors.totalNum}
              </div>
            )}
          </div>

          {/* Expiry Date */}
          <div className="box-orange mb-4">
            <h3>EXPIRY DATE:</h3>
            <Form.Control
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              isInvalid={!!errors.expiryDate}
            />
            {errors.expiryDate && (
              <div className="floating-error">
                {errors.expiryDate}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex mt-4">
            <Button 
              variant="warning" 
              onClick={editingCoupon ? handleSaveChanges : handleCreateCoupon}
              className="me-2"
            >
              {editingCoupon ? 'Save Changes' : 'Create Coupon'}
            </Button>
            
            {editingCoupon && (
              <Button 
                variant="danger" 
                onClick={() => handleDeleteClick(editingCoupon)}
              >
                Delete Coupon
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this coupon?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleCouponDelete(couponToDelete._id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCoupon;