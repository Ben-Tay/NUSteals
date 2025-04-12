import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const API_URL = 'https://nusteals-express.onrender.com';

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If no token, redirect to login
    if (!token || !userId) {
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
          if (response.status === 401) {
            console.error('Unauthorized response');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log("Fetched user data:", data);
        if (data.role === 'merchant') {
          setAuthorized(true);
        } else if (data.role === 'admin') {
          alert("Access denied. You are an admin. Redirecting to Admin Dashboard.");
          navigate('/adminLogin');
          return;
        } else if (data.role === 'student') {
          alert("Access denied. You are a student. Redirecting to Student Dashboard.");
          navigate('/studentLogin');
          return;
        } else {
          alert("Access denied. Redirecting back.");
          navigate(-1);
          return;
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        // On error, simply go back to previous page
        navigate(-1);
        return;
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token, userId, API_URL, navigate]);

  if (loading) {
    return (
      <>
        <div className="container mt-4 d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <>
      <div className="container mt-4">
        <h1>Merchant Dashboard</h1>
        <p>This is the Merchant Dashboard content.</p>
        {/* Add your merchant dashboard content here */}
      </div>
    </>
  );
};

export default MerchantDashboard;
