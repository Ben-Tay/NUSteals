import React from 'react'
import { IoPersonCircleOutline } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Card } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode'; // Importing jwtDecode


const DashboardHeader = ({today}) => {

    const [user, setUser] = useState({}); 
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
                
            } catch(err) {
                console.error('Error')
            } finally {
                setIsLoading(false); // Hide loading spinner after data fetch is done
            }
        }
        fetchUser();

    }, []);

    return (
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
    )
}

export default DashboardHeader