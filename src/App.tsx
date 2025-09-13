import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import DoctorsCarousel from './components/DoctorsCarousel';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <DoctorsCarousel />
      <BookingForm />
      <Footer />
    </div>
  );
}

export default App;
