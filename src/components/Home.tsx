import React from 'react';
import Hero from './Hero';
import DoctorsCarousel from './DoctorsCarousel';
import BookingForm from './BookingForm';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <DoctorsCarousel />
      <BookingForm />
    </>
  );
};

export default Home;