import React, { useState } from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const MerchantProfile = () => {
  // Example state variables for profile info
  const [merchantName, setMerchantName] = useState('John Doe');
  const [businessName, setBusinessName] = useState('Doe’s Delights');
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Main St, Springfield');

  const handleUpdateProfile = () => {
    // Logic for updating profile data goes here
    console.log({
      merchantName,
      businessName,
      email,
      phone,
      address
    });
    alert('Profile updated!');
  };

  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <Container className="mt-4 mb-4">
        <h1>Merchant Profile</h1>
        <Row className="mt-3">
          {/* Left Column: Display or edit personal info */}
          <Col md={6}>
            <Form>
              {/* Merchant Name */}
              <Form.Group className="mb-3" controlId="formMerchantName">
                <Form.Label>Merchant Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                />
              </Form.Group>

              {/* Business Name */}
              <Form.Group className="mb-3" controlId="formBusinessName">
                <Form.Label>Business Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              {/* Phone */}
              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>

              {/* Address */}
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Business Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter business address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleUpdateProfile}>
                Update Profile
              </Button>
            </Form>
          </Col>

          {/* Right Column: Could be used for an avatar, or extra details */}
          <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
            {/* Placeholder for a profile image or additional info */}
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
                marginBottom: '1rem'
              }}
            >
              {/* Display first letters or an icon */}
              {merchantName.split(' ').map((part) => part[0]).join('')}
            </div>
            <p>Upload your profile picture here</p>
            <Button variant="secondary">Change Photo</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MerchantProfile;