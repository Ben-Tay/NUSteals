import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CouponDistPieChart = () => {

    const [couponList, setCouponList] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchCouponList = async() => {

            try {
                const response = await fetch("https://nusteals-express.onrender.com/api/coupons");
                const data = await response.json();

                if (!response.ok) {
                    setError(data.details);

                    throw new Error(error);
                }

                // if alls good
                setCouponList(data);
            }
            catch(error) {
                console.log(error);
            }
        }

        fetchCouponList();

    }, []);

    const totalActive = couponList
        .filter(coupon => !coupon.disable)
        .reduce((sum, coupon) => sum + coupon.totalNum, 0);

    const totalDisabled = couponList
        .filter(coupon => coupon.disable)
        .reduce((sum, coupon) => sum + coupon.totalNum, 0);

    const totalRedeemed = couponList
        .reduce((sum, coupon) => sum + coupon.redeemedNum, 0);

    const chartData = [
        { name: 'Active', value: totalActive },
        { name: 'Disabled', value: totalDisabled },
        { name: 'Redeemed', value: totalRedeemed },
    ];

    const COLORS = ['#4CAF50', '#F44336', '#2196F3']; 

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
                dataKey="value"
                nameKey="name"
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </>
      );
}

export default CouponDistPieChart