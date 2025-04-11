import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralNavBar from '../../../layout/GeneralNavBar';
import { Row, Col, Container, Card } from 'react-bootstrap';
import GeneralCoupon from '../../../layout/GeneralCoupon';

const ManageCoupon = () => {
    const navigate = useNavigate();
    const [merchantName] = useState('John Doe');
    const [loading, setLoading] = useState(true);
    const [coupons, setCoupons] = useState([]);

    // SHOW ALL COUPONS
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/coupons", {
                    method: "GET",
                    credentials: "include",
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
    }, []);

    // GO TO EDIT COUPON
    const handleEditClick = (coupon) => {
        navigate('/addCoupon', {
            state: {
                editingCoupon: coupon
            }
        });
    };

    return (
        <>
            <GeneralNavBar userRole="merchant" />
            <div className="content-wrapper mb-4">
                <Row className="g-5">
                    {/* LEFT SIDE */}
                    <Col md={4}>
                        <Container className="mb-4">
                            <h3>My Store</h3>
                        </Container>
                        <Card className="mb-4" style={{ width: '210px' }}>
                            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
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
                                    discount={`${coupon.discount}`}
                                    discountBottom={coupon.discountType}
                                    descriptionHeader={coupon.couponName}
                                    description={coupon.description}
                                    redeemedNum={coupon.redeemedNum}
                                    totalNum={coupon.totalNum}
                                    disabled={coupon.disable}
                                    children="merchant"
                                    onEditClick={() => handleEditClick(coupon)}
                                />
                            ))
                        )}
                        <div className="d-flex justify-content-end mt-4">
                            <a href="/addCoupon">
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