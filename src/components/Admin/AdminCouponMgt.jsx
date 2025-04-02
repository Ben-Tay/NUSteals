import React, { useState, useEffect } from 'react';
import GeneralCoupon from '../../layout/GeneralCoupon';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminCouponMgt = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
          navigate('/login'); // prevent access admin route if not logged in
      }
    }
    fetchUser();
},[]);

  const RedeemButton = ({ onClick }) => {
    return (
      <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={onClick}>
        Redeem
      </button>
    );
  };

  const coupons = [
    {
      id: 1,
      brand: "Denny's",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Denny%27s_Logo.svg/2560px-Denny%27s_Logo.svg.png",
      discount: "20% off",
      description: "20% off your next visit when you join the Rewards Program!",
      usage: "422 used today",
      status: "redeemed",
      code: "RX89ggG9430",
    },
    {
      id: 2,
      brand: "Denny's",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Denny%27s_Logo.svg/2560px-Denny%27s_Logo.svg.png",
      discount: "$5 off",
      description: "Get $5 off online orders of $25 or more!",
      usage: "312 used today",
      status: "available",
      code: "ABC123XYZ",
    },
  ];

  const handleRedeemClick = (coupon) => {
    console.log("Redeem clicked for:", coupon);
  };

  return (
    <div className="coupon-list">
      {coupons
        .filter(coupon => coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((coupon) => (
          <GeneralCoupon
            key={coupon.id}
            brandLogo={coupon.logo}
            brandName={coupon.brand}
            discount={coupon.discount}
            descriptionHeader={coupon.brand}
            description={coupon.description}
          >
            {coupon.status === "redeemed" ? (
              <Button variant="danger" disabled>Already Redeemed</Button>
            ) : (
              <div className="flex flex-col items-center">
                <RedeemButton onClick={() => handleRedeemClick(coupon)} />
                <p className="text-sm text-gray-500 mt-2">{coupon.usage}</p>
              </div>
            )}
          </GeneralCoupon>
        ))}
    </div>
  );
};

export default AdminCouponMgt;
