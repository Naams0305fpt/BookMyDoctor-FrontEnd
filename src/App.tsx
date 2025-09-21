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
import Demo from "./components/Demo";

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
