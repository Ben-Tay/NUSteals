import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';

const RedemptionModal = ({ 
    selectedCoupon, 
    showModal, 
    handleClose,
    userId 
}) => {

    const discount =
    selectedCoupon.discountType === "flat"
      ? `$${selectedCoupon.discount}`
      : selectedCoupon.discountType === "percentage"
        ? `${selectedCoupon.discount}%`
        : null;

    // Create QR code data object
    const qrData = JSON.stringify({
        code: selectedCoupon.code,
        studentId: userId,
        couponId: selectedCoupon._id
    });

    return (
        <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Coupon Redemption</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Coupon Details */}
                <h5>
                    {selectedCoupon.couponName} - {discount} off
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

                {/* QR Code Section */}
                <div className="mt-4 text-center">
                    <h6>Your Redemption QR Code</h6>
                    <div className="p-4 bg-light rounded border d-flex justify-content-center">
                        <QRCodeSVG 
                            value={qrData}
                            size={200}
                            level="H"
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                        />
                    </div>
                    <p className="mt-3 text-muted">
                        <i className="bi bi-info-circle me-2"></i>
                        Show this QR code to the staff for scanning
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