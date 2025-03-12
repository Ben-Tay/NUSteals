import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GeneralNavBar from '../../layout/GeneralNavBar'

function ControlledForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  {/* Role Selection Field */ }
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

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault(); // Prevent default form submission
      // Handle form submission logic here (e.g., API call)
      navigate("/Login"); // Navigate only if the form is valid
    }
    setValidated(true);
  };

  return (
    <>  <GeneralNavBar />
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-center text-2xl font-bold mb-4">Sign up</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>

            {/* This is for name field */}
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>


            {/* This is for email field */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email" // Use type="email" for default email validation
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </Form.Group>


            {/* This is for password field */}
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
            </Form.Group>

            {/* Role Selection Field */}
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
    </>
  );
}

export default ControlledForm;