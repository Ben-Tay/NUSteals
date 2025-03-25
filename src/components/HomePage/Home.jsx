import React from 'react'
import GeneralNavBar from '../../layout/GeneralNavBar'
import Carousel from 'react-bootstrap/Carousel';
import CarouselImage from './CarouselImage';
import Card from 'react-bootstrap/Card';
import Footer from './Footer';
import HeroSection from './HeroSection';
import "./styles/home.css";

const Home = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <GeneralNavBar />
          <Card className="border-gray-500 flex-1">
              <Carousel interval={4000}>
                <Carousel.Item className="h-[600px] md:h-[400px] sm:h-[250px]">
                  <CarouselImage text="First slide" />
                </Carousel.Item>
                <Carousel.Item className="h-[600px] md:h-[400px] sm:h-[250px]">
                  <CarouselImage text="Second slide" />
                </Carousel.Item>
                <Carousel.Item className="h-[600px] md:h-[400px] sm:h-[250px]">
                  <CarouselImage text="Third slide" />
                </Carousel.Item>
              </Carousel>
          </Card>
          <HeroSection/>
        <Footer/>
      </div>
    </>
  )
}

export default Home