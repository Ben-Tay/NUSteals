import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container, Button } from 'react-bootstrap';
import GeneralCoupon from '../../../layout/GeneralCoupon';
import { jwtDecode } from 'jwt-decode';

const ManageCoupon = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 5;

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
        setCoupons(prev => [...prev, ...data]);
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

  // Pagination logic
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(coupons.length / couponsPerPage);

  return (
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
              <>
                {currentCoupons.map((coupon) => (
                  <GeneralCoupon
                    key={coupon._id}
                    coupon={coupon}
                    role="admin"
                    onEditClick={() => handleEditClick(coupon)}
                  />
                ))}

                {/* Pagination Controls */}
                <div className="pagination-controls text-center mt-3">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={i + 1 === currentPage ? 'primary' : 'outline-primary'}
                      onClick={() => setCurrentPage(i + 1)}
                      className="mx-1"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageCoupon;