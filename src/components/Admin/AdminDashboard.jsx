import React , {useEffect, useState} from 'react'
import { IoPersonCircleOutline } from "react-icons/io5";
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode'; // Importing jwtDecode
import { Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SignupsChart from './Charts/SignupsChart';

const AdminDashboard = () => {
    const [user, setUser] = useState({}); 
    const [userList, setUserList] = useState([]);
    const [monthlySignups, setMonthlySignups] = useState(0);
    const [growthRate, setGrowthRate] = useState(0);
    const [growthLabel, setGrowthLabel] = useState("");
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state
    const year = moment().year();      // e.g., 2025
    const month = moment().month() + 1; // 0-indexed, so add 1
    const navigate = useNavigate();

    // Called by SignUps chart
    const handleGrowthUpdate = (rate, label) => {
        setGrowthRate(rate);
        setGrowthLabel(label);
    };

    useEffect(() => {
        const fetchUser = async () => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            navigate('/login'); // prevent access admin route if not logged in
        }

        try {

            if (!token) {
                setError("No access token found");
                setIsLoading(false);
                return;
            }

            // Decode JWT token to get User ID
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.uid; // Access the user ID from the decoded token
    
            const findUser = await fetch(`https://nusteals-express.onrender.com/api/users/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                method: "GET",
            });
    
            if (!findUser.ok) {
                // Handle error response (e.g., user not found, server error)
                const errorData = await findUser.json();
                setError(errorData.message || 'User not found');
                setIsLoading(false);
                return;
            } 
    
            const foundUser = await findUser.json();
            setUser(foundUser);

             // Fetch all users
            const allUsersRes = await fetch(`https://nusteals-express.onrender.com/api/users`, {
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
        } catch(err) {
            console.error('Error')
        } finally {
            setIsLoading(false); // Hide loading spinner after data fetch is done
        }
    }
    fetchUser();

}, []);

useEffect(() => {
    const fetchData = async() => {


        try {
            const getSignUps = await fetch(`https://nusteals-express.onrender.com/api/users/user-signups?year=${year}&month=${month}`, {
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

    const today = moment().format('MMMM, YYYY'); 

    return (
        <>
                <Card className="w-full max-w-7xl mx-auto p-4 min-h-[800px]">                
                    <Card.Body className="m-3">
                    <div className="flex justify-between">
                        <Card.Title className="flex">
                            <div className="flex bg-white p-2 shadow-md border w-fit">
                            <h5 className="d-flex items-center gap-2 font-semibold ">
                                {!error && (
                                    
                                    // * Show Spinner while Loading *//
                                    isLoading ? (
                                        <div className="d-flex justify-content-center">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : (
                                        <div>
                                            Welcome,  {user.name}  {/* Dynamic user based on authentication */}
                                        </div>
                                    )
                                )} 
                                <IoPersonCircleOutline className="mt-1"/>
                            </h5>
                        </div>
                        </Card.Title>
                        <h5 className="text-primary">{today}</h5>

                       
                    </div>


                    <Row>
                        <div className="flex flex-col mt-3 justify-center space-x-0 space-y-8 md:flex-row md:space-x-16 md:space-y-0">
                            <Card className="p-3 text-center w-full max-w-xs md:max-w-xs">
                                <Card.Title className="fw-semibold text-2xl">Total Users</Card.Title>
                                <Card.Body>
                                <Card.Text className="text-xl">{userList.length}</Card.Text>
                                </Card.Body>
                            </Card>

                            <Card className="p-3 text-center w-full max-w-xs md:max-w-xs">
                                <Card.Title className="fw-semibold text-2xl"> {today} Sign Ups</Card.Title>
                                <Card.Body>
                                <Card.Text className="text-xl">{monthlySignups}</Card.Text>
                                </Card.Body>
                            </Card>

                            <Card className="p-3 text-center w-full max-w-xs md:max-w-xs">
                                <Card.Title className="fw-semibold text-2xl ">User Growth Rate</Card.Title>
                                <Card.Body>
                                    <Card.Text className="text-xl">{growthLabel} : {growthRate}%</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </Row>

                    <Row>
                        <SignupsChart onGrowthUpdate={handleGrowthUpdate} />                            
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}

export default AdminDashboard