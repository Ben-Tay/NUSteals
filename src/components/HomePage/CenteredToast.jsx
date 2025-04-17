import React, { useEffect } from 'react';

const CenteredToast = ({ show, message, duration = 3000, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onClose(), duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                backgroundColor: 'white',
                color: 'black',
                padding: '16px 24px',
                border: '2px solid #007bff', // classic blue
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                fontSize: '16px',
                fontWeight: '500',
                maxWidth: '90%',
                textAlign: 'center',
            }}
        >
            {message}
        </div>
    );
};

export default CenteredToast;