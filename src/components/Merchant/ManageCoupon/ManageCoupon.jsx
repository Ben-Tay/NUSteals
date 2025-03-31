import React, { useState } from 'react';
import GeneralNavBar from '../../../layout/GeneralNavBar';
import { Row, Col, Container, Card } from 'react-bootstrap';
import GeneralCoupon from '../../../layout/GeneralCoupon';


const ManageCoupon = () => {
    const [merchantName] = useState('John Doe');
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
                        
                        <GeneralCoupon children="merchant"/>

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