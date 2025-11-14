import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import GlobalStyles from "./styles/GlobalStyles";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import {
  LoginModalProvider,
  useLoginModal,
} from "./contexts/LoginModalContext";
import {
  SignUpModalProvider,
  useSignUpModal,
} from "./contexts/SignUpModalContext";
import ModernHeader from "./components/layout/ModernHeader";
import ModernFooter from "./components/layout/ModernFooter";
import ModernLogin from "./components/auth/ModernLogin";
import ModernSignUp from "./components/auth/ModernSignUp";
import {
  ErrorBoundary,
  BookingErrorFallback,
  ProfileErrorFallback,
  PageErrorFallback,
  LoadingSpinner,
} from "./components/common";

// Lazy load page components for better performance
const Home = lazy(() => import("./components/pages/Home"));
const About = lazy(() => import("./components/pages/ModernAbout"));
const Information = lazy(() => import("./components/pages/ModernInformation"));
const Profile = lazy(() => import("./components/pages/Profile"));
const BookingHistory = lazy(() => import("./components/pages/ModernBookingHistory"));
const Settings = lazy(() => import("./components/pages/ModernSettings"));

// Main App Content
const AppContent: React.FC = () => {
  const { showLogin, closeLogin } = useLoginModal();
  const { showSignUp, closeSignUp } = useSignUpModal();

  return (
    <>
      <GlobalStyles />
      <div className="App">
        <Router>
          <ModernHeader />
          <ErrorBoundary fallback={<PageErrorFallback />}>
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/information" element={<Information />} />

                {/* Profile with dedicated error boundary */}
                <Route
                  path="/profile"
                  element={
                    <ErrorBoundary fallback={<ProfileErrorFallback />}>
                      <Profile />
                    </ErrorBoundary>
                  }
                />

                {/* Booking History with dedicated error boundary */}
                <Route
                  path="/booking-history"
                  element={
                    <ErrorBoundary fallback={<BookingErrorFallback />}>
                      <BookingHistory />
                    </ErrorBoundary>
                  }
                />

                {/* Settings with dedicated error boundary */}
                <Route
                  path="/settings"
                  element={
                    <ErrorBoundary fallback={<ProfileErrorFallback />}>
                      <Settings />
                    </ErrorBoundary>
                  }
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <ModernFooter />
        </Router>{" "}
        {/* Modals at App level for proper positioning */}
        {showLogin && <ModernLogin onClose={closeLogin} />}
        {showSignUp && <ModernSignUp onClose={closeSignUp} />}
      </div>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <LoginModalProvider>
            <SignUpModalProvider>
              <AppContent />
            </SignUpModalProvider>
          </LoginModalProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
