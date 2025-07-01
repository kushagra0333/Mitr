import React from 'react';
import { Container } from 'react-bootstrap';
import './hero.css';
import HeroImage from '../assets/hero.jpg'; // use correct path based on your folder

const Hero = () => {
  return (
    <section className="hero d-flex align-items-center justify-content-center">
      <Container className="text-center">
        <img src={HeroImage} className="hero-img img-fluid" alt="MITR Hero" />
      </Container>
    </section>
  );
};

export default Hero;
