import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Footer from './Footer';
import { Row, Col, Container } from 'react-bootstrap';


const AboutUs = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <div className="flex-1"> 
        <GeneralNavBar/>
        <Container className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <h2 className="text-center fw-semibold mb-4">About Us</h2>

          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-sm border-0 p-3 text-start">
                <Card.Body>
                  <Card.Title className="fw-bold mb-3 text-center">Why NUSteals?</Card.Title>
                  <Card.Text className="mb-2">
                    We are a group of NUS students who created NUSteals to offer the best discounts and 
                    deals to our peers.
                  </Card.Text>
                  <Card.Text>
                    We noticed that students often struggle to keep track of existing coupon deals from NUS merchants,
                    while merchants seek greater exposure.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow-sm border-0 p-3 text-start">
                <Card.Body>
                  <Card.Title className="fw-bold mb-3 text-center">Our Vision</Card.Title>
                  <Card.Text className="mb-2">
                    Apart from partnering with NUS merchants, we hope to be able to extend our services
                    to the 6 universities in Singapore in the near future.
                  </Card.Text>
                  <Card.Text>
                    Our motivations stem from wanting to be able to provide our students with greater
                    outreach to savings and deals and help our partner merchants to hit their monthly KPIs.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer/>
      </div>
    </>
  )
}

export default AboutUs