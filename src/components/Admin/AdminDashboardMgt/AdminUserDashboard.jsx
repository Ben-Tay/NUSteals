import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import { Row, Spinner } from 'react-bootstrap';
import SignupsChart from '../Charts/SignupsChart';
import moment from 'moment';

const AdminUserDashboard = ({ today, api }) => {
    const [userList, setUserList] = useState([]);
    const [monthlySignups, setMonthlySignups] = useState(0);
    const [growthRate, setGrowthRate] = useState(0);
    const [growthLabel, setGrowthLabel] = useState("");
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state
    const year = moment().year();      // e.g., 2025
    const month = moment().month() + 1; // 0-indexed, so add 1

    // Called by SignUps chart
    const handleGrowthUpdate = (rate, label) => {
        setGrowthRate(rate);
        setGrowthLabel(label);
    };

    useEffect(() => {
        const fetchUserList = async () => {

            try {


                // Fetch all users
                const allUsersRes = await fetch(`${api}/api/users`, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                console.log("Fetched users:", allUsersRes);

                if (!allUsersRes.ok) {
                    const errorData = await allUsersRes.json();
                    setError(errorData.message || 'Failed to fetch user list');
                    return;
                }

                const allUsers = await allUsersRes.json();
                setUserList(allUsers); //
            } catch (err) {
                console.error('Error')
            } finally {
                setIsLoading(false); // Hide loading spinner after data fetch is done
            }
        }
        fetchUserList();

    }, []);

    useEffect(() => {
        const fetchData = async () => {


            try {
                const getSignUps = await fetch(`${api}/api/users/user-signups?year=${year}&month=${month}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "GET"

                });
                const data = await getSignUps.json();

                if (data.length > 0) {
                    setMonthlySignups(data[0].count); // we expect a single result
                } else {
                    setMonthlySignups(0); // no signups
                }
            } catch (err) {
                console.error('Error fetching signups:', err);
                setMonthlySignups(0);
            }
        }

        fetchData();
    }, [])


    return (
        <>
            <Card.Body className="m-3">

                <Row>
                    <div className="flex flex-col mt-3 justify-center space-x-0 space-y-8 md:flex-row md:space-x-16 md:space-y-0">
                        <Card className="p-3 text-center w-full font-roboto max-w-s md:max-w-md !bg-gray-50">
                            <Card.Title className="fw-semibold text-2xl !text-blue-700">Total Users</Card.Title>
                            <Card.Body>
                                <Card.Text className="text-xl !text-orange-600">{userList.length}</Card.Text>
                            </Card.Body>
                        </Card>

                        <Card className="p-3 text-center w-full font-roboto max-w-s md:max-w-md !bg-gray-50">
                            <Card.Title className="fw-semibold text-2xl !text-blue-700"> {today} Sign Ups</Card.Title>
                            <Card.Body>
                                <Card.Text className="text-xl !text-orange-600">{monthlySignups}</Card.Text>
                            </Card.Body>
                        </Card>

                        <Card className="p-3 text-center w-full font-roboto max-w-s md:max-w-md !bg-gray-50">
                            <Card.Title className="fw-semibold text-2xl !text-blue-700">User Growth Rate</Card.Title>
                            <Card.Body>
                                <Card.Text className="text-xl !text-orange-600">{growthLabel}: {growthRate}%</Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Row>

                <Row>
                    <SignupsChart onGrowthUpdate={handleGrowthUpdate} />
                </Row>
            </Card.Body>
        </>
    )
}

export default AdminUserDashboard