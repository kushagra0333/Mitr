import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./components/header/Header";
import Home from "./pages/home";
import Footer from "./components/footer/footer"
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import 'leaflet/dist/leaflet.css';
import CustomCursor from "./components/CustomCursor";
import {Navigate} from "react-router-dom"

function App() {
  const isAuthenticated = !!localStorage.getItem('mitr-token');
  return (
    <Router basename="/">
      <CustomCursor />
     <Header />
      <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
