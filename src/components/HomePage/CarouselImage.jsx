import React from 'react'
import { Image } from 'react-bootstrap';

const CarouselImage = ({text}) => {

  const getImageSrc = () => {
    if (text === "First slide") return '/assets/students.jpg';
    if (text === "Second slide") return '/assets/frontier.jpg';
    return '/assets/savings.jpg';
  };

  return (
    <> 
      <Image
        className="w-full h-full object-cover"
        src={getImageSrc()}
        alt={text}
      />
    </>
  );
}

export default CarouselImage