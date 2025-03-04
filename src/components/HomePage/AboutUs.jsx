import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const AboutUs = () => {
  return (
    <>  
        <GeneralNavBar/>
        <Card className="text-center">
          <div className="shadow-lg">
            <Card.Header className="text-xl">What is NUSteals?</Card.Header>
            <Card.Body className="">
              <Card.Title>About Us</Card.Title>
                <Card.Text className="text-center">
                  We are a group of NUS students who created NUSteals to offer the best discounts and 
                  deals to our peers. We noticed that students often struggle to keep track of existing coupon deals from NUS merchants, while merchants seek greater exposure. Our platform aims to solve both of these challenges by providing an easy way to discover and access the best student deals, while helping local merchants reach more customers.
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">Copyright &copy; NUSteals, 2025</Card.Footer>
          </div>
        </Card>
    </>
  )
}

export default AboutUs