import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Hero from "./Hero";
import DoctorsCarousel from "./DoctorsCarousel";
import AppointmentManagement from "./AppointmentManagement";
import BookingForm from "./BookingForm";
import AdminDashboard from "./AdminDashboard";

const Home: React.FC = () => {
  const { user } = useAuth();
  const isDoctor = user?.userType === "doctor";
  const isAdmin = user?.userType === "admin";

  return (
    <>
      <Hero />
      {isAdmin ? ( // 🩵 Ưu tiên admin trước
        <AdminDashboard />
      ) : isDoctor ? ( // 🩵 Nếu không phải admin thì kiểm tra doctor
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
