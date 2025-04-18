import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./GeneralCoupon.css";

const Coupon = (props) => {
  const {
    role,
    coupon,
    onEditClick,
    onRedeemClick, // prop for student redeem function
    onViewClick, // new prop for admin view function
  } = props;

  // Debug log (this is fine, but ensure no extra semicolon outside the curly braces)
  {
    console.log("role:", role);
  }

  const discountTop =
    coupon.discountType === "flat"
      ? `$${coupon.discount}`
      : coupon.discountType === "percentage"
      ? `${coupon.discount}%`
      : null;

  const renderButtons = () => {
    switch (role) {
      case "merchant":
        return (
          <div className="d-flex flex-column gap-2">
            <Button variant="warning" onClick={() => onEditClick(coupon)}>
              Edit Coupon
            </Button>
            {coupon.disable ? (
              <Button variant="outline-danger" disabled className="text-center">
                Disabled
              </Button>
            ) : (
              <p className="h5 text-center text-muted">
                Total: {coupon.redeemedNum}/{coupon.totalNum}
              </p>
            )}
          </div>
        );
      case "admin":
        // Update this branch if you want admin to respect the disable flag.
        return (
          <div className="d-flex flex-column gap-2">
            <Button variant="primary" onClick={() => onEditClick(coupon)}>
              View Coupon
            </Button>
            {coupon.disable && (
              <Button variant="outline-danger" disabled className="text-center">
                Disabled
              </Button>
            )}
          </div>
        );
      case "student":
        return (
          <div className="w-100 text-center">
            <Button
              variant="success"
              onClick={() => onRedeemClick(coupon)}
              className="w-100 mb-2"
            >
              Redeem
            </Button>
            <div className="text-muted small">
              Coupons left: {coupon.totalNum - coupon.redeemedNum}/
              {coupon.totalNum}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mb-3">
      <Container fluid>
        <Row className="g-0">
          {/* LEFT: Discount (10%) */}
          <Col xs={2} className="bg-light p-3 text-center">
            <h2 className="discount-amount mb-0">{discountTop}</h2>
            <span className="discount-off">off</span>
          </Col>

          {/* MIDDLE: Description (60%) */}
          <Col xs={7} className="p-3">
            <Card.Title>{coupon.couponName}</Card.Title>
            <Card.Text className="small">{coupon.description}</Card.Text>
          </Col>

          {/* RIGHT: Buttons + Info (30%) */}
          <Col xs={3} className="p-3 d-flex justify-content-end">
            {renderButtons()}
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

export default Coupon;
