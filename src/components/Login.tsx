import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useSignUpModal } from "../contexts/SignUpModalContext";
import "./Login.css";

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const { openSignUp } = useSignUpModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(phoneNumber, password);
    if (success) {
      showNotification(
        "success",
        "Welcome Back!",
        "You have successfully signed in to your account.",
        3000
      );
      onClose();
    } else {
      setError("Invalid phone number or password");
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          <img src="/images/logo.png" alt="logo" />
          <h2>Welcome Back</h2>
          <p>Sign in to your BookMyDoctor account</p>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                pattern="[0-9]*"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Signing in...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                onClose();
                openSignUp();
              }}
            >
              Sign up here
            </a>
          </p>
          <p>
            Or{" "}
            <a href="#guest" onClick={onClose}>
              Continue as guest
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
