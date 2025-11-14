import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import ModernHero from "../common/ModernHero";
import ModernDoctorsCarousel from "../common/ModernDoctorsCarousel";
import ModernDoctorDashboard from "../dashboard/ModernDoctorDashboard";
import ModernBookingForm from "../booking/ModernBookingForm";
import ModernAdminDashboard from "../dashboard/ModernAdminDashboard";
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
          <ModernAdminDashboard />
        </ErrorBoundary>
      ) : isDoctor ? (
        <ErrorBoundary fallback={<DashboardErrorFallback />}>
          <ModernDoctorDashboard />
        </ErrorBoundary>
      ) : (
        <>
          <ModernDoctorsCarousel />
          <ErrorBoundary fallback={<BookingErrorFallback />}>
            <ModernBookingForm />
          </ErrorBoundary>
        </>
      )}
    </>
  );
};

export default Home;
