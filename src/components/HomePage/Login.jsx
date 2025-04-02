import React, { useState } from 'react';
import GeneralNavBar from '../../layout/GeneralNavBar';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Footer from './Footer';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    // Trigger form validation
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setIsLoading(true); // Show the spinner while loading

      try {
        // Fetch all users from the backend
        const response = await fetch('https://nusteals-express.onrender.com/api/users/login', {
           method: 'POST',
           headers: {
              'Content-Type': 'application/json',
           },
           body: JSON.stringify({
              email, 
              password,
           }),
           credentials: 'include', // Allow sending cookies or tokens
        });

        // Handle internal server error
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error during login:', errorData);
          setError(errorData.message || 'Unable to fetch users');
          setIsLoading(false);
          return;
        }

        const data = await response.json(); // Get acces token

        console.log(`is + ${data.accessToken}`);
        if (data.accessToken) {
           // store access token in localStorage
           localStorage.setItem('accessToken', data.accessToken);
        }

        // Decode JWT token to get User ID
        const decodedToken = jwtDecode(data.accessToken);
        const userId = decodedToken.uid; // Access the user ID from the decoded token

        const token = localStorage.getItem('accessToken');
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

        const user = await findUser.json();

        if (user) {
          // If user is found, navigate based on their role
          if (user.role === 'student') {
            navigate('/studentLogin');
          } else if (user.role === 'merchant') {
            navigate('/merchantLogin');
          } else if (user.role === 'admin') {
            navigate('/adminLogin');
          }
        } 

        setIsLoading(false); // Hide loading spinner after processing everything
      } catch (error) {
        console.error('Error during login:', error);
        setError(error.message || 'An unexpected error occurred while trying to log in.');
        setIsLoading(false);
      }
    }
    setValidated(true); // Set validated to true for form feedback
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <GeneralNavBar />
        <section id="hero" className="flex-1">
          <div className="container flex flex-col items-center px-6 py-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row">
            <div className="flex flex-col mb-10 md:w-1/2">
              <h2 className="max-w-md text-4xl font-bold text-center md:text-4xl md:text-left">
                Come get the best NUS deals here!
              </h2>
              <p className="max-w-sm text-center md:text-left">
                NUSteals helps make it easier for NUS merchants to reach out to our students and vice versa!
              </p>
            </div>
            <div className="flex flex-col mb-10 md:w-1/2">
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a correct email address
                  </Form.Control.Feedback>

                  <Form.Label htmlFor="inputPassword">Password</Form.Label>
                  <Form.Control
                      type="password"
                      id="inputPassword"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={password.length < 6}
                      minLength={6}
                      required
                      autoComplete="new-password"
                    />
                  <Form.Control.Feedback type="invalid">
                    {password.length < 6 ? "Password must be at least 6 characters long" : "Please enter a valid password"}
                  </Form.Control.Feedback>
                 
                  {/* Display Error Message */}
                  {error && <div className="text-danger text-center mb-3">{error}</div>}
                </Form.Group>

                <div className="d-flex flex-col justify-content-between text-blue-600 md:flex-row md:mb-3">
                  <Alert.Link href="/create">Create an account</Alert.Link>
                  <Alert.Link href="/forgetpassword">Forgot password?</Alert.Link>
                </div>

                {/* Show Spinner while Loading */}
                {isLoading ? (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Button className="block w-full" type="submit">
                      Login
                    </Button>
                  </div>
                )}
              </Form>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Login;