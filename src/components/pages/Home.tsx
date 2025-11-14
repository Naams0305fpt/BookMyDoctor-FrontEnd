import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import ModernHero from "../common/ModernHero";
import DoctorsCarousel from "../common/DoctorsCarousel";
import DoctorDashboard from "../dashboard/DoctorDashboard";
import ModernBookingForm from "../booking/ModernBookingForm";
import AdminDashboard from "../dashboard/AdminDashboard";
import {
  ErrorBoundary,
  BookingErrorFallback,
  DashboardErrorFallback,
} from "../common";

const Home: React.FC = () => {
  const { user } = useAuth();
  const isDoctor = user?.userType === "doctor";
  const isAdmin = user?.userType === "admin";

  return (
    <>
      <ModernHero />
      {isAdmin ? (
        <ErrorBoundary fallback={<DashboardErrorFallback />}>
          <AdminDashboard />
        </ErrorBoundary>
      ) : isDoctor ? (
        <ErrorBoundary fallback={<DashboardErrorFallback />}>
          <DoctorDashboard />
        </ErrorBoundary>
      ) : (
        <>
          <DoctorsCarousel />
          <ErrorBoundary fallback={<BookingErrorFallback />}>
            <ModernBookingForm />
          </ErrorBoundary>
        </>
      )}
    </>
  );
};

export default Home;
