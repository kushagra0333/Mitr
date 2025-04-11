import React from 'react';
import Hero from '../components/hero';
import Products from '../components/products';
import About from '../components/about'
import FeedBack from "../components/feedback"
import HowItWorks from "../components/HowItWorks"
import KeyFeatures from '../components/Feature';
import ContactUs from '../components/contact';
import UseCase from '../components/useCase';
const Home = ()=>{
    return (
        <div>
            <Hero />
            
            <Products />
            <About />
            <UseCase />
            <KeyFeatures />
            <FeedBack />
            <HowItWorks />
            <ContactUs />
            
        </div>
    )
}
export default Home;