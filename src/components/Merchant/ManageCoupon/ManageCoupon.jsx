import React from 'react'
import GeneralNavBar from '../../../layout/GeneralNavBar'
import { Row, Col, Button } from 'react-bootstrap';
import './ManageCoupon.css'

const ManageCoupon = () => {

  return (
    <>
      <GeneralNavBar userRole="merchant"/>
      <div className="content-wrapper">
        
        <h1> ADD COUPON </h1>

        
        <Row className="g-4">
          {/* LEFT SIDE */}
          <Col>
            <Row className="mb-4">
              <div className="box-orange">
                <h3>Coupon Name: </h3>
              </div>
            </Row>
            <Row className="mb-4">
              <div className="box-orange">
                <h2>DISCOUNT:</h2>
              </div>
            </Row>
            <Row className="mb-4">
              <div className="box-orange">
                <h2>DESCRIPTION:</h2>
              </div>
            </Row>
            <Row className="mb-4">
              <div className="box-orange">
                <h2>TERMS & CONDITIONS:</h2>
              </div>
            </Row>
              <Button variant="warning">
              Submit
              </Button>
          </Col>

          {/* RIGHT SIDE */}
          <Col>
            <div className="bigger-box-orange">
              <Row className="mb-4">
                  <div className="box-orange">
                    <p>Coupon Category:</p>
                  </div>
              </Row>
              <Row className="mb-4">
                  <div className="box-orange">
                    <p>Total Number of Coupons: </p>
                    <p>Expiry Date:</p>
                  </div>
              </Row>
            </div>
          </Col>
        </Row>
       
      </div>
    </>
  );
}

export default ManageCoupon