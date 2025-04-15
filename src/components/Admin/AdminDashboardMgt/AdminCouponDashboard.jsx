import React, { useState, useEffect} from 'react'
import { Card, Row } from 'react-bootstrap';
import CouponDistPieChart from '../Charts/CouponDistributionPieChart';
import moment from 'moment';
import RedeemedCouponCat from '../Charts/RedeemedCouponCat';


const AdminCouponDashboard = ({today}) => {

    const [couponList, setCouponList] = useState([]);
    const [totalCoupons, setTotalCoupons] = useState('');
    const [totalRedeemed, setTotalRedeemed] = useState('');
    const [monthlyRedeemed, setMonthlyRedeemed] = useState('');
    const [error, setError] = useState('');
  
    
    useEffect(() => {
        const fetchCouponList = async() => {
            try {
                const response = await fetch ("https://nusteals-express.onrender.com/api/coupons");
                const data = await response.json();

                // Fail scenario
                if (!response.ok) {
                  
                    setError(data.details);
                }
                // Pass scenario, add the data to be the couponList 
                setCouponList(data);
                const couponTotal = data.reduce((sum, coupon) => sum + coupon.totalNum, 0);
                setTotalCoupons(couponTotal);

                const totalCouponsRedeemed = data.reduce((sum, coupon) => sum + coupon.redeemedNum, 0);
                setTotalRedeemed(totalCouponsRedeemed);

                // Count the total redeemed coupons for the month
                const redeemedThisMonth = data
                .filter(coupon => moment(coupon.uniqueCodes.usedAt).isSame(moment(), 'month'))
                .reduce((sum, coupon) => sum + coupon.redeemedNum, 0);
                setMonthlyRedeemed(redeemedThisMonth);

            }
            catch(error) {
                console.log(error);
            }
        }
        fetchCouponList();
    }, [])

    const categoryData = couponList.reduce((acc, { category = 'Others', redeemedNum }) => {
        if (redeemedNum === 0) {
          category = 'Others';  // Group all 0 redeem categories under 'Uncategorized'
        }
        acc[category] = (acc[category] || 0) + redeemedNum;
        return acc;
      }, {});
      
    const chartData = Object.entries(categoryData)
    .map(([name, Redeemed]) => ({ name, Redeemed }))
    .sort((a, b) => b.Redeemed - a.Redeemed)
    .slice(0, 5);  // Take the top 5 categories

    return (
        <>
            <Card.Body className="m-3">
                <Row>
                    <div className="flex flex-col mt-3 justify-center space-x-0 space-y-8 md:flex-row md:space-x-16 md:space-y-0">
                        <Card className="p-3 text-center w-full font-roboto max-w-s md:max-w-md !bg-gray-50">
                            <Card.Title className="fw-semibold text-2xl !text-blue-700">Total Coupons</Card.Title>
                            <Card.Body>
                            <Card.Text className="text-xl !text-orange-600">{totalCoupons}</Card.Text>
                            </Card.Body>
                        </Card>

                        <Card className="p-3 text-center w-full font-roboto max-w-s md:max-w-md !bg-gray-50">
                            <Card.Title className="fw-semibold text-2xl !text-blue-700">Total Redeemed </Card.Title>
                            <Card.Body>
                            <Card.Text className="text-xl !text-orange-600">{totalRedeemed}</Card.Text>
                            </Card.Body>
                        </Card>

                        <Card className="p-3 text-center w-full font-roboto max-w-s md:max-w-md !bg-gray-50">
                            <Card.Title className="fw-semibold text-2xl !text-blue-700">Redeemed in {today}</Card.Title>
                            <Card.Body>
                                <Card.Text className="text-xl !text-orange-600">{monthlyRedeemed}</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Row>

                <Row>
                    <div className="flex flex-col md:flex-row justify-center mt-5">
                        <div className="w-full mb-4 md:w-1/2">
                            <h3 className="text-2xl font-bold mb-2 text-center">Coupon Status Summary</h3>
                            <CouponDistPieChart />
                        </div>
                        <div className="w-full md:w-1/2">                            
                            <h3 className="text-2xl font-bold mb-2 text-center space-y-8 mb-4 md:mt-0 md: space-y-0">
                                Top 5 Redeemed Coupons By Category
                            </h3>

                            <div className="w-[100%] max-w-[800px] mx-auto">
                                <RedeemedCouponCat data={chartData} />
                            </div>
                        </div>
                    </div>
                </Row>
            </Card.Body>
        </>
    )
}

export default AdminCouponDashboard