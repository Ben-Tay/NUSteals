import React , {useEffect, useState} from 'react'
import { IoPersonCircleOutline } from "react-icons/io5";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode'; // Importing jwtDecode
import { Spinner } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [user, setUser] = useState({}); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Initialize loading state
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

    const today = moment().format('MMMM D, YYYY'); 

    return (
        <>
            <div className="mx-3">
                <div className="flex justify-between">
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
                                        Hello,  {user.name}  {/* Dynamic user based on authentication */}
                                    </div>
                                )
                            )} 
                            <IoPersonCircleOutline className="mt-1"/>
                        </h5>
                    </div>
                    <p className="text-primary">{today}</p>
                </div>
            
                <Card className="w-18 mt-3">
                    <Card.Body>
                        <Card.Title>Admin Dashboard</Card.Title>
                        <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            </div>  
        </>
    )
}

export default AdminDashboard