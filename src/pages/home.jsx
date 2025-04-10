import React from 'react';
import Hero from '../components/hero';
import Products from '../components/products';
import About from '../components/about'
const Home = ()=>{
    return (
        <div>
            <Hero />
            <Products />
            <About />
        </div>
    )
}
export default Home;