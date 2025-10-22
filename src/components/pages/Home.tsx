import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Hero from "../common/Hero";
import DoctorsCarousel from "../common/DoctorsCarousel";
import AppointmentManagement from "../dashboard/AppointmentManagement";
import BookingForm from "../booking/BookingForm";
import AdminDashboard from "../dashboard/AdminDashboard";

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
