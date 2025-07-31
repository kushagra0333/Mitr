import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import DeviceDetails from './pages/DeviceDetails';
import MapPage from './pages/MapPage';
import TriggerHistory from './pages/TriggerHistory';
import Settings from './pages/Settings';
import './App.css';
import CustomCursor from './components/CustomCursor';
import ForgotPassword from './pages/ForgotPassword';
import Footer from './components/footer/footer';
const App = () => {
  return (
    <Router>
      <CustomCursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/device/:deviceId" element={<DeviceDetails />} />
        <Route path="/map/:sessionId" element={<MapPage />} />
        <Route path="/history" element={<TriggerHistory />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;