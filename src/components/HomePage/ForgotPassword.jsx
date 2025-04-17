import React, { useState } from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import CenteredToast from './CenteredToast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (event) => {
    event.preventDefault(); // prevent default action of button

    const form = event.currentTarget;

    // Reset error message && alert false
    setError('');
    setToast(false);

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await fetch("https://nusteals-express.onrender.com/api/users/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        })


      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
      }

      // Handle successful reset
      if (response.status === 200) {
        setToast(true);
        setTimeout(() => {
          navigate('/login');  // After 3 seconds, navigate to the login page
        }, 1000);  // Delay of 3 seconds
      }
    }
    catch (error) {
      console.error("Error reseting password:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <GeneralNavBar />
        <div className="flex-1 mt-5">
          <Card className="mx-auto w-1/3">
            <Card.Body>
              <Card.Title className="!font-bold !text-blue-500 !text-center">Password Reset Form</Card.Title>
              <Form noValidate validated={validated} onSubmit={handleForgotPassword}>
                <Form.Group className="mb-3" controlId="formPlaintextEmail">
                  <Form.Label>
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    isInvalid={!!error || !email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {error || "Please enter a valid email address"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="forgotPasswordForm">
                  <Form.Label>
                    Reset your password
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    autoComplete="new-password"
                    isInvalid={!password || password.length < 6}
                  />
                  <Form.Control.Feedback type="invalid">
                    {password.length < 6 ? "Password must be at least 6 characters long"
                      : "Please enter a valid password"}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-full">Confirm Reset</Button>
              </Form>
            </Card.Body>
          </Card>
          {toast && (
            <CenteredToast
              show={toast}
              message="Password Resetted Successfully!"
              duration={2000}
              onClose={() => setToast(false)}
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  )
}

export default ForgotPassword