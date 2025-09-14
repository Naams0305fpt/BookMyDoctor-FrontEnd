import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Information from './components/Information';
import GetPro from './components/GetPro';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/information" element={<Information />} />
          <Route path="/get-pro" element={<GetPro />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
