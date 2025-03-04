import React, {useState} from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock "database" for user data (dummy data) - use express js later
  const mockUser = [
    { email: 'Bob@example.com', password: 'password123', role: 'student'},
    { email: 'Alice@example.com', password: 'password123', role: 'merchant'},
  ];

  
  const handleSubmit = async (event) => {
    const form = event.currentTarget; 
    event.preventDefault(); // prevent default refresh behaviour of button

   // Trigger form validation
    if (form.checkValidity() === false) {
      event.stopPropagation(); // prevent the form from submitting if not valid
    } else {
      setIsLoading(true); // Show the spinner while loading

      setTimeout(() => {
        // Check if the email and password match any of the mock users
        const user = mockUser.find(u => u.email === email && u.password === password);

        if (user) {
          // If a matching user is found, navigate based on the role
          if (user.role === "student") {
            navigate('/studentLogin'); // Navigate to student profile
          } else if (user.role === "merchant") {
            navigate('/merchantLogin'); // Navigate to merchant profile
          }
        } else {
          setError('Invalid email or password');
        }

        setIsLoading(false); // Hide the spinner after processing
      }, 1000); // Simulating a 1-second delay (can be replaced with an actual API request)
    }

    setValidated(true); // Set validated to true for form feedback
  };

  return (
    <>
        <GeneralNavBar/>
          <section id="hero">
            <div className="container flex flex-col items-center px-6 py-6 mx-auto mt-10 space-y-0 md:space-y-0 md:flex-row ">
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
                        <Form.Control type="email"
                                      placeholder="name@example.com"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      required/>
                        <Form.Control.Feedback type="invalid">
                          Please enter a correct email address
                        </Form.Control.Feedback>
                        <Form.Label htmlFor="inputPassword">Password</Form.Label>
                        <Form.Control
                            type="password"
                            id="inputPassword"
                            placeholder = "********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        <Form.Control.Feedback type="invalid">
                          Invalid password
                        </Form.Control.Feedback>
                        {/* Display Error Message */}
                        {error && (
                          <div className="text-danger text-center mb-3">
                            {error}
                          </div>
                        )}
                        </Form.Group>
                        <div className="d-flex flex-col justify-content-between text-blue-600 md:flex-row md:mb-3">
                            <Alert.Link href="#">Create an account</Alert.Link>
                            <Alert.Link href="#">Forgot password?</Alert.Link>
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
          
    </>
  )
}

export default login