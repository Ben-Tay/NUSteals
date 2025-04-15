import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import GeneralCoupon from '../../../layout/GeneralCoupon';
import { jwtDecode } from 'jwt-decode';

const ManageCoupon = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const API_URL = 'https://nusteals-express.onrender.com';

  // Retrieve token and user ID
  let token = localStorage.getItem('accessToken');
  let userId = localStorage.getItem('userId');

  if (!userId && token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.uid || decoded.userId || decoded._id;
      localStorage.setItem('userId', userId);
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  if (!userId) {
    navigate('/login');
    return null;
  }

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(`${API_URL}/api/coupons`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }

        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [API_URL]);

  // Fetch user profile (allow merchants and admins only)
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

        if (data.role === 'student') {
          alert('Access denied. You do not have permission to view this page.');
          navigate('/studentLogin');
          return;
        }

        setMerchantName(data.name || '');
        setPhoto(data.photo || '');

      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, token, API_URL, navigate]);

  // Edit coupon click
  const handleEditClick = (coupon) => {
    navigate('/adminLogin/adminAddCoupons', {
      state: {
        editingCoupon: coupon
      }
    });
  };

  return (
    <>
      <div className="content-wrapper mb-4">
        <Container>
          <Row className="justify-content-center g-5">
            <Col md={8}>
              <Container className="mb-4">
                <h3 className="text-center">All Coupons</h3>
              </Container>

              {loading ? (
                <p>Loading...</p>
              ) : coupons.length === 0 ? (
                <p>No coupons found</p>
              ) : (
                coupons.map((coupon) => (
                  <GeneralCoupon
                    key={coupon._id}
                    coupon={coupon}
                    role="admin"
                    onEditClick={() => handleEditClick(coupon)}
                  />
                ))
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ManageCoupon;