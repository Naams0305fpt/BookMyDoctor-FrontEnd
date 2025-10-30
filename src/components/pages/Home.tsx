import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Hero from "../common/Hero";
import DoctorsCarousel from "../common/DoctorsCarousel";
import DoctorDashboard from "../dashboard/DoctorDashboard";
import BookingForm from "../booking/BookingForm";
import AdminDashboard from "../dashboard/AdminDashboard";

const Home: React.FC = () => {
  const { user } = useAuth();
  const isDoctor = user?.userType === "doctor";
  const isAdmin = user?.userType === "admin";

  return (
    <>
      <Hero />
      {isAdmin ? (
        <AdminDashboard />
      ) : isDoctor ? (
        <DoctorDashboard />
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
