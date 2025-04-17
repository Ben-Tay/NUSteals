import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const MerchantProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  let userId = localStorage.getItem('userId');

  // Decode token if we don't yet have a userId
  if (!userId && token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.uid;
      localStorage.setItem('userId', userId);
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  // 1️⃣ Redirect immediately if not logged in
  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
    }
  }, [token, userId, navigate]);

  const API_URL = 'https://nusteals-express.onrender.com';

  // Loading & role state
  const [loading, setLoading] = useState(true);
  const [isMerchant, setIsMerchant] = useState(false);

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fileInputRef = useRef(null);

  // 2️⃣ Fetch profile and gate by role
  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        switch (data.role) {
          case 'merchant':
            setIsMerchant(true);
            setName(data.name || '');
            setEmail(data.email || '');
            setAddress(data.address || '');
            setPhoto(data.photo || '');
            // populate password if returned (unlikely)
            if (data.password) setPassword(data.password);
            break;
          case 'student':
            navigate('/studentLogin');
            return;
          case 'admin':
            navigate('/adminLogin');
            return;
          default:
            navigate('/login');
            return;
        }
      } catch (err) {
        console.error(err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, userId, navigate]);

  // File change handler
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };
  const handleChangePhoto = () => fileInputRef.current?.click();

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(p => !p);

  // Field validation
  const validateFields = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errs.email = 'Invalid email address';
    if (!password.trim()) errs.password = 'Password is required';
    if (!address.trim()) errs.address = 'Address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit update
  const handleUpdateProfile = async () => {
    if (!token || !userId) {
      alert('Cannot update profile.');
      return;
    }
    const updatedProfile = { name, email, password, address, photo };
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      if (!res.ok) throw new Error('Update failed');
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  if (!isMerchant) {
    // Either we redirected away or it's not a merchant
    return null;
  }

  return (
    <>
      <Container className="mt-4 mb-4">
        <h1>Merchant Profile</h1>
        <Row className="mt-3">
          <Col md={6}>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  isInvalid={!!errors.name}
                  onChange={e => setName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  isInvalid={!!errors.email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    isInvalid={!!errors.password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Form.Group controlId="formAddress" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  isInvalid={!!errors.address}
                  onChange={e => setAddress(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <Button
                variant="primary"
                onClick={() => {
                  if (validateFields()) {
                    setShowConfirmModal(true);
                  }
                }}
              >
                Update Profile
              </Button>
            </Form>
          </Col>

          <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                style={{ width: 150, height: 150, borderRadius: '50%' }}
              />
            ) : (
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                }}
              />
            )}
            <Button variant="secondary" onClick={handleChangePhoto} className="mt-3">
              Change Photo
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update your profile?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmModal(false);
              handleUpdateProfile();
            }}
          >
            Yes, Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MerchantProfile;
