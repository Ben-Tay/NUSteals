import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const Coupon = (props) => {
    const {
        brandLogo,
        brandName,
        role,
        coupon,
        onEditClick,
        onRedeemClick  // prop for student redeem function
    } = props;

    const discountTop = coupon.discountType === 'flat' 
        ? `$${coupon.discount}`
        : coupon.discountType === 'percentage'
            ? `${coupon.discount}%`
            : null;

    const renderButtons = () => {
        switch (role) {
            case 'merchant':
                return (
                    <div className="d-flex flex-column gap-2">
                        <Button 
                            variant="warning" 
                            onClick={() => onEditClick(coupon)}
                        >
                            Edit Coupon
                        </Button>

                        {coupon.disable ? (
                            <Button 
                                variant="outline-danger" 
                                disabled
                                className="text-center"
                            >
                                Disabled
                            </Button>
                        ) : (
                            <p className="h5 text-center text-muted">
                                Total: {coupon.redeemedNum}/{coupon.totalNum}
                            </p>
                        )}
                    </div>
                );
            case 'student':
                return (
                    <Button 
                        variant="success"
                        onClick={() => onRedeemClick(coupon)}
                        className="w-100"
                    >
                        Redeem
                    </Button>
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
                        <h2 className="text-warning mb-0">{discountTop}</h2>
                        <span className="text-warning">off</span>
                    </Col>

                    {/* MIDDLE: Description (60%) */}
                    <Col xs={7} className="p-3">
                        <Card.Title>{coupon.couponName}</Card.Title>
                        <Card.Text className="small">
                            {coupon.description}
                        </Card.Text>
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