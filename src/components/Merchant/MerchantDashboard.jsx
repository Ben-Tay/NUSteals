import React, { useEffect } from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import { useNavigate } from 'react-router-dom';

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const API_URL = 'https://nusteals-express.onrender.com';

  useEffect(() => {
    // If no token, redirect to login
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user details to check role
    fetch(`${API_URL}/api/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to verify user');
        }
        return res.json();
      })
      .then(data => {
        if (data.role !== 'merchant') {
          alert('Access denied. You do not have permission to view this page.');
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error verifying user:', error);
        navigate('/login');
      });
  }, [token, userId, API_URL, navigate]);

  return (
    <>
      <GeneralNavBar userRole="merchant" />
      <div className="container mt-4">
        {/* Add dashboard content here */}
      </div>
    </>
  );
};

export default MerchantDashboard;
