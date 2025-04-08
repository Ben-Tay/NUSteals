import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Container, Card } from 'react-bootstrap';
import AdminCoupon from '../../../layout/AdminCoupon';

const ManageCoupon = () => {
  const navigate = useNavigate();
  const [merchantName] = useState('John Doe');
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);

  // SHOW ALL COUPONS
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/coupons", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // GO TO EDIT COUPON
  const handleEditClick = (coupon) => {
    navigate('/adminLogin/adminAddCoupons', {
      state: {
        editingCoupon: coupon
      }
    });
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center content-wrapper mb-4">
        <Container className="mb-4 text-center">
          <h3>Coupon Management</h3>
        </Container>

        {loading ? (
          <p>Loading...</p>
        ) : coupons.length === 0 ? (
          <p>No coupons found</p>
        ) : (
          coupons.map((coupon) => (
            <AdminCoupon
              key={coupon._id}
              coupon={coupon}
              discount={`${coupon.discount}`}
              discountBottom={coupon.discountType}
              descriptionHeader={coupon.couponName}
              description={coupon.description}
              children="merchant"
              onEditClick={() => handleEditClick(coupon)}
              disabled={coupon.isDisabled}
              onToggleClick={() => handleEditClick(coupon)}
            />
          ))
        )}
      </div>
    </>
  );
};
export default ManageCoupon;