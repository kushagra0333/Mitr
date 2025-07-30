import React from 'react';
import Hero from '../components/hero';
import About from '../components/about'
import HowItWorks from "../components/HowItWorks"
import Features from '../components/Feature';
import ContactUs from '../components/contact';
import UseCase from '../components/useCase';
import './home.css';
const Home = ()=>{
    return (
        <div className='home'>
            <Hero />
            <About />
            <UseCase />
            <Features />
            <HowItWorks />
            <ContactUs />
            
        </div>
    )
}
export default Home;