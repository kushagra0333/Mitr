import React from 'react';
import { Container, Carousel } from 'react-bootstrap';
import Image1 from "../assets/image.jpg";

const Hero = () => {
  return (
    <div className="m-3 ">
      
        <Carousel controls={true} indicators={true}>
          <Carousel.Item>
            <img
              src={Image1}
              className="d-block w-100 rounded-4" // rounded edges and shrink size
              alt="Slide 1"
              style={{ height: '400px', objectFit: 'cover' }} // Shrink the size
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={Image1}
              className="d-block w-100 rounded-4"
              alt="Slide 2"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={Image1}
              className="d-block w-100 rounded-4"
              alt="Slide 3"
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Carousel.Item>
        </Carousel>
      
    </div>
  );
};

export default Hero;
