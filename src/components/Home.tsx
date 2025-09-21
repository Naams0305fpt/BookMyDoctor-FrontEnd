import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Hero from "./Hero";
import DoctorsCarousel from "./DoctorsCarousel";
import AppointmentManagement from "./AppointmentManagement";
import BookingForm from "./BookingForm";

const Home: React.FC = () => {
  const { user } = useAuth();
  const isDoctor = user?.userType === "doctor";

  return (
    <>
      <Hero />
      {isDoctor ? (
        <AppointmentManagement />
      ) : (
        <>
          <DoctorsCarousel />
          <BookingForm />
        </>
      )}
    </>
  );
};

export default Home;
