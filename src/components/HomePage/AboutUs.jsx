import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <div className="flex-1"> 
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
          </div>
        </Card>
      </div>
      <Footer/>
      </div>
    </>
  )
}

export default AboutUs