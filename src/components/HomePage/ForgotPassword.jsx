import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Footer from './Footer';

const ForgotPassword = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
      <GeneralNavBar/>
        <div className="flex-1 mt-5">
          <Card className="mx-auto w-1/2">
            <Card.Body>
              <Card.Title className="!font-bold !text-blue-500 !text-center">Password Reset Form</Card.Title>
                <Card.Text>
                  <Form>
                      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label column sm="4">
                          Email
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control type="email" placeholder="email@example.com" />
                        </Col>
                      </Form.Group>
                      <Form.Group as= {Row} className="mb-3" controlId="forgotPasswordForm">
                        <Form.Label column sm = "4">Reset your password</Form.Label>
                        <Col sm="8">
                          <Form.Control type="password" placeholder="********" />
                        </Col>
                      </Form.Group>
                  </Form>
                  
                  <div className="flex items-center justify-center">
                      <Button variant="primary" className="mx-auto d-block">Confirm Reset</Button>
                  </div>            
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        <Footer/>
      </div>
    </>
  )
}

export default ForgotPassword