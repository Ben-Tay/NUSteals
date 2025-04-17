import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Modal} from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const MerchantProfile = () => {
  const navigate = useNavigate();

  let token = localStorage.getItem('accessToken');
  let userId = localStorage.getItem('userId');
  if (!userId && token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.uid;
      localStorage.setItem('userId', userId);
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }
  if (!userId) {
    navigate('/login');
    return null;
  }

  const API_URL = 'https://nusteals-express.onrender.com';

  // Loading and authorization state
  const [loading, setLoading] = useState(true);
  const [isMerchant, setIsMerchant] = useState(false);

  // State for profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef(null);

  // confirmation of update
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !userId) {
        console.warn('No token or userId found.');
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        // Check if the user's role is "merchant"
        if (data.role !== 'merchant') {
          alert('Access denied. You do not have permission to view this page.');
          if (data.role === 'admin') {
            navigate('/adminLogin');
          } else if (data.role === 'student') {
            navigate('/studentLogin');
          } else {
            navigate('/login');
          }
          return;
        }
        setIsMerchant(true);
        setName(data.name || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setPhoto(data.photo || '');
        if (data.password) {
          setPassword(data.password);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token, API_URL, navigate]);

  // File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger the file input dialog
  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Update profile data via PATCH request
  const handleUpdateProfile = async () => {
    if (!token || !userId) {
      alert('No token or userId found; cannot update profile.');
      return;
    }
    const updatedProfile = {
      name,
      email,
      password,
      address,
      photo,
    };

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      console.log('Profile updated:', data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Check console for details.');
    }
  };

  if (loading) {
    return (
      <>
        <div className="container mt-4 d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (!isMerchant) {
    return null;
  }

  return (
    <>
      <Container className="mt-4 mb-4">
        <h1>Merchant Profile</h1>
        <Row className="mt-3">
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    id="passwordInput"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password (leave blank to keep current)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </div>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button variant="primary" onClick={() => setShowConfirmModal(true)}>
                Update Profile
              </Button>
            </Form>
          </Col>
          <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '1rem',
                }}
              />
            ) : (
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: '#666',
                  marginBottom: '1rem',
                }}
              >
                {name ? name.split(' ').map((part) => part[0]).join('') : ''}
              </div>
            )}
            <Button variant="secondary" onClick={handleChangePhoto}>
              Change Photo
            </Button>
          </Col>
        </Row>
      </Container>

      {/* CONFIRMATION MODAL */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update your profile?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {setShowConfirmModal(false); handleUpdateProfile();}}>
            Yes, Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MerchantProfile;
