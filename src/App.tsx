import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  NotificationProvider,
  useNotification,
} from "./contexts/NotificationContext";
import {
  LoginModalProvider,
  useLoginModal,
} from "./contexts/LoginModalContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Home from "./components/Home";
import About from "./components/About";
import Information from "./components/Information";
import GetPro from "./components/GetPro";
import Demo from "./components/Demo";

// Protected Route Component for Get Pro (only doctors can access)
const ProtectedGetPro: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification(
        "warning",
        "Login Required",
        "Please sign in to access the Get Pro features.",
        4000
      );
    } else if (user?.userType !== "doctor") {
      showNotification(
        "info",
        "Doctor Access Only",
        "The Get Pro features are exclusively available for verified doctors.",
        5000
      );
    }
  }, [isAuthenticated, user, showNotification, location]);

  if (!isAuthenticated || user?.userType !== "doctor") {
    return <Navigate to="/" replace />;
  }

  return <GetPro />;
};

// Main App Content
const AppContent: React.FC = () => {
  const { showLogin, closeLogin } = useLoginModal();

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/information" element={<Information />} />
          <Route path="/get-pro" element={<ProtectedGetPro />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
        <Footer />
      </Router>

      {/* Login Modal at App level for proper positioning */}
      {showLogin && <Login onClose={closeLogin} />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <LoginModalProvider>
          <AppContent />
        </LoginModalProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
