import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RedemptionModal = ({ 
    selectedCoupon, 
    showModal, 
    handleClose,
    handleCopyCode 
}) => {
    return (
        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Coupon Redemption</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Coupon Details */}
                <h5>
                    {selectedCoupon.couponName} - {selectedCoupon.discount}
                    {selectedCoupon.discountType === 'percentage' ? '%' : '$'} off
                </h5>
                <p>{selectedCoupon.description}</p>

                {/* Terms & Conditions */}
                <div className="mt-4 mb-3">
                    <h6 className="text-secondary">Terms & Conditions</h6>
                    <div className="p-3 bg-light rounded border">
                        <small className="text-muted">
                            {selectedCoupon.termsConditions || 'No terms and conditions specified.'}
                        </small>
                    </div>
                </div>

                {/* Redemption Code */}
                <div className="mt-4">
                    <h6>Your Redemption Code</h6>
                    <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center">
                        <code className="h5 mb-0">{selectedCoupon.code}</code>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleCopyCode(selectedCoupon.code)}
                        >
                            Copy Code
                        </Button>
                    </div>
                    <p className="mt-2 text-muted">
                        <i className="bi bi-info-circle me-2"></i>
                        Please inform staff to enter the code at checkout.
                    </p>
                </div>

                {/* Expiry Information */}
                <div className="mt-3">
                    <small className="text-danger">
                        Expires: {new Date(selectedCoupon.expiryDate).toLocaleDateString()}
                    </small>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RedemptionModal;