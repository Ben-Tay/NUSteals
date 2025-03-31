import React, { useState } from 'react';
import GeneralNavBar from '../../../layout/GeneralNavBar';
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
import GeneralCoupon from '../../../layout/GeneralCoupon';


const ManageCoupon = () => {
    const [merchantName, setMerchantName] = useState('John Doe');
    return (
        <>
          <GeneralNavBar userRole="merchant" />
          <div className="content-wrapper mb-4">
            <Row className="g-5">
                    {/* LEFT SIDE */}
                    <Col>
                    <h3>My Store</h3>
                        <Col md={6} className="d-flex flex-column align-items-center justify-content-center">
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
                        <Button variant="secondary">Change Photo</Button>
                        </Col>
                    </Col>
                    {/* RIGHT SIDE */}
                    <Col md={8}>
                        <h3>All Coupons</h3>
                        <GeneralCoupon children="merchant"/>
                    </Col>
                    <h1>Related Stores</h1>
                </Row>
            
                <Row>
                <h1>Related Stores</h1>
                </Row>
            
            
            <br />
        </div>

        </>
      );
};
export default ManageCoupon;