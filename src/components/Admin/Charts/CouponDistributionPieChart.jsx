import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CouponDistPieChart = ({ couponList }) => {

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