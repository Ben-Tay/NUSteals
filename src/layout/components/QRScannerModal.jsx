import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { Html5Qrcode } from 'html5-qrcode';

const QRScannerModal = ({ show, handleClose, onCodeScanned }) => {
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);

    // Ensure scanned QR contains expected data
    const validateQRData = (data) => {
        const requiredFields = ['code', 'studentId', 'couponId'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error();
        }
        
        return true;
    };

    useEffect(() => {
        let html5QrCode = null;

        const initializeScanner = async () => {
            if (show && !isScanning) {
                try {
                    html5QrCode = new Html5Qrcode("qr-reader");
                    scannerRef.current = html5QrCode;
                    setIsScanning(true);

                    await html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1.0
                        },
                        (decodedText) => {
                            try {
                                const data = JSON.parse(decodedText);
                                validateQRData(data);
                                stopScanner();
                                onCodeScanned(data);
                            } catch (err) {
                                setError("Invalid QR code format");
                            }
                        },
                        (errorMessage) => {
                            // Suppress frequent "No QR code found" messages
                            if (!errorMessage.includes("No MultiFormat Readers")) {
                                console.error(errorMessage);
                            }
                        }
                    );
                } catch (err) {
                    setError("Error accessing camera");
                    console.error(err);
                }
            }
        };

        const stopScanner = async () => {
            if (scannerRef.current && isScanning) {
                try {
                    await scannerRef.current.stop();
                    scannerRef.current = null;
                    setIsScanning(false);
                } catch (err) {
                    console.error("Error stopping scanner:", err);
                }
            }
        };

        initializeScanner();

        return () => {
            stopScanner();
        };
    }, [show, onCodeScanned]);

    const handleModalClose = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Scan Coupon QR Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}
                <div className="qr-scanner-container">
                    <div id="qr-reader" style={{ width: '100%' }}></div>
                    <div className="scan-overlay mt-3 text-center text-muted">
                        <p>Position the QR code within the frame to scan</p>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default QRScannerModal;