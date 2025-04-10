import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./components/header/Header";
import SubHeader from "./components/sub-header/subHeader";
import Home from "./pages/home";
import Footer from "./components/footer/footer"
function App() {
  return (
    <Router basename="/">
      <Header />
      <SubHeader />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
