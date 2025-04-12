import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container, Card } from 'react-bootstrap';
import GeneralCoupon from '../../../layout/GeneralCoupon';

const ManageCoupon = () => {
    const navigate = useNavigate();
    const [photo, setPhoto] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState([]);
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

    // SHOW ALL COUPONS
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch(`${API_URL}/api/coupons`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch coupons");
                }

                const data = await response.json();
                setCoupons(data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, [API_URL, token]);

    // GO TO EDIT COUPON
    const handleEditClick = (coupon) => {
        navigate('/merchantLogin/addCoupon', {
            state: {
                editingCoupon: coupon
            }
        });
    };

    // FETCH MERCHANT PROFILE
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

    return (
        <>
            <div className="content-wrapper mb-4">
                <Row className="g-5">
                    {/* LEFT SIDE */}
                    <Col md={4}>
                        <Container className="mb-4">
                            <h3>My Store</h3>
                        </Container>
                        <Card className="mb-4" style={{ width: '210px' }}>
                            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
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
                                ): (
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
                                    {merchantName ? merchantName.split(' ').map((part) => part[0]).join('') : ''}
                                </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* RIGHT SIDE */}
                    <Col md={8}>
                        <Container className="mb-4">
                            <h3>All Coupons</h3>
                        </Container>

                        {loading ? (
                            <p>Loading...</p>
                        ) : coupons.length === 0 ? (
                            <p>No coupons found</p>
                        ) : (
                            coupons.map((coupon) => (
                                <GeneralCoupon
                                    key={coupon._id}
                                    coupon = {coupon}
                                    role="merchant"
                                    onEditClick={() => handleEditClick(coupon)}
                                />
                            ))
                        )}
                        <div className="d-flex justify-content-end mt-4">
                            <a href="/merchantLogin/addCoupon">
                                <button className="px-10 py-2 bg-[#F88B2C] text-white border-none rounded text-center" >Add Coupon</button>
                            </a>

                        </div>

                    </Col>
                </Row>


                <br />
            </div>

        </>
    );
};
export default ManageCoupon;