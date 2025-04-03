import React, { useEffect, useState } from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const API_URL = 'https://nusteals-express.onrender.com';

  // State to control loading and authorization
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to verify user');
        }
        const data = await response.json();
        // Immediately redirect if the user role is not 'merchant'
        if (data.role !== 'merchant') {
          alert('Access denied. You do not have permission to view this page.');
          navigate('/');
          return; // exit the function so no further state is updated
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token, userId, API_URL, navigate]);

  // While verifying, show a spinner
  if (loading) {
    return (
      <>
        <GeneralNavBar userRole="merchant" />
        <div className="container mt-4 d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  // If not authorized, render nothing (redirection already occurred)
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <div className="container mt-4">
        <h1>Merchant Dashboard</h1>
        <p>This is the Merchant Dashboard content.</p>
        {/* Add additional dashboard content here */}
      </div>
    </>
  );
};

export default MerchantDashboard;
