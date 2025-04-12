import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import Image1 from '../assets/image.jpg';

const Hero = () => {
  return (
    <Container className="py-4">
      {/* Removed 'fade' prop for slide effect */}
      <Carousel controls indicators className="rounded-4 overflow-hidden shadow">
        <Carousel.Item>
          <img
            src={Image1}
            alt="Slide 1"
            className="d-block w-100"
            style={{ height: '400px', objectFit: 'cover' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={Image1}
            alt="Slide 2"
            className="d-block w-100"
            style={{ height: '400px', objectFit: 'cover' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={Image1}
            alt="Slide 3"
            className="d-block w-100"
            style={{ height: '400px', objectFit: 'cover' }}
          />
        </Carousel.Item>
      </Carousel>
    </Container>
  );
};

export default Hero;
