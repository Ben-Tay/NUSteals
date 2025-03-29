import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GeneralNavBar from '../../layout/GeneralNavBar';
import Footer from './Footer';

function ControlledForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [role, setRole] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Reset error messages
    setNameError("");
    setEmailError("");
    setError("");

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const response = await fetch("https://nusteals-express.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, address: address || null }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 201) {
        navigate("/Login"); // Redirect on success
      } else if (response.status === 400 && data.details) {
        const details = data.details;

        if (details.includes("dup key: { email:")) {
          setEmailError("This email is already registered. Please use a different email.");
        } else if (details.includes("dup key: { name:")) {
          setNameError("This name is already taken. Please choose a different name.");
        } else {
          setError("Signup failed. Please try again.");
        }
      } else {
        setError("Unexpected error occurred.");
      }

    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <GeneralNavBar />
          <div className="flex justify-center items-center py-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-center text-2xl font-bold mb-2">Sign up</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>

                {/* Name Field */}
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    isInvalid={!!nameError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {nameError || "Please enter a valid name"}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Address Field */}
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError || "Please enter a valid email address"}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid password
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Role Selection */}
                <Form.Group className="mb-3" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="merchant">Merchant</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a role.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-full">
                  Sign up
                </Button>
              </Form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default ControlledForm;