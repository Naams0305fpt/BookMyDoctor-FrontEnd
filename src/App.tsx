import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
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
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import { 
  ErrorBoundary, 
  BookingErrorFallback, 
  ProfileErrorFallback, 
  PageErrorFallback,
  LoadingSpinner
} from "./components/common";

// Lazy load page components for better performance
const Home = lazy(() => import("./components/pages/Home"));
const About = lazy(() => import("./components/pages/About"));
const Information = lazy(() => import("./components/pages/Information"));
const Demo = lazy(() => import("./components/pages/Demo"));
const Profile = lazy(() => import("./components/pages/Profile"));
const BookingHistory = lazy(() => import("./components/pages/BookingHistory"));
const Settings = lazy(() => import("./components/pages/Settings"));

// Main App Content
const AppContent: React.FC = () => {
  const { showLogin, closeLogin } = useLoginModal();
  const { showSignUp, closeSignUp } = useSignUpModal();

  return (
    <div className="App">
      <Router>
        <Header />
        <ErrorBoundary fallback={<PageErrorFallback />}>
          <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/information" element={<Information />} />
              <Route path="/demo" element={<Demo />} />
              
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
        <Footer />
      </Router>

      {/* Modals at App level for proper positioning */}
      {showLogin && <Login onClose={closeLogin} />}
      {showSignUp && <SignUp onClose={closeSignUp} />}
    </div>
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
