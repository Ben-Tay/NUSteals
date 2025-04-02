import React, { useState, useEffect, useRef } from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const MerchantProfile = () => {
  const navigate = useNavigate();

  // Retrieve token and userId from localStorage (set by Login.jsx)
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
    // If no userId is found, redirect to login
    navigate('/login');
    return null;
  }

  // Use the deployed API URL (must match the login endpoint)
  const API_URL = 'https://nusteals-express.onrender.com';

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // State variables for the user profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // For updating only
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Ref for the hidden file input (for photo upload)
  const fileInputRef = useRef(null);

  // Fetch the user's profile data when the component mounts
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
        // Check if the user's role is merchant
        if (data.role !== 'merchant') {
          alert("Access denied. You do not have permission to view this page.");
          navigate("/");
          return;
        }
        setName(data.name || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setPhoto(data.photo || '');
        if (data.password) {
          setPassword(data.password);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId, token, API_URL, navigate]);

  // Handle file selection (convert the selected image file to Base64)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger the hidden file input dialog
  const handleChangePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Update profile data by sending a PATCH request
  const handleUpdateProfile = async () => {
    if (!token || !userId) {
      alert('No token or userId found; cannot update profile.');
      return;
    }
    const updatedProfile = {
      name,
      email,
      password, // If left blank, backend should ignore updating the password
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

  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <Container className="mt-4 mb-4">
        <h1>Merchant Profile</h1>
        <Row className="mt-3">
          {/* Left Column: Profile Form */}
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
              {/* Hidden file input for photo upload */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button variant="primary" onClick={handleUpdateProfile}>
                Update Profile
              </Button>
            </Form>
          </Col>
          {/* Right Column: Display Photo or Placeholder */}
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
    </>
  );
};

export default MerchantProfile;
