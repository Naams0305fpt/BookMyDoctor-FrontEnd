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
import ResetPassword from "./ResetPassword";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useSignUpModal } from "../../contexts/SignUpModalContext";
import "./Login.css";

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const { openSignUp } = useSignUpModal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      await login(identifier, password);
      showNotification(
        "success",
        "Welcome Back!",
        "You have successfully signed in to your account.",
        3000
      );
      onClose();
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-overlay">
      {!showResetPassword ? (
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
            <div className="form-group-login">
              <div className="login-input-header">
                <label htmlFor="identifier">Username, Phone or Email</label>
              </div>

              <div className="input-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your phone or email"
                  required
                />
              </div>
            </div>

            <div className="form-group-login">
              <div className="login-input-header">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();

                    setShowResetPassword(true);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
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
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  openSignUp();
                }}
              >
                Sign up here
              </button>
            </p>
            <p>
              Or <a onClick={onClose}>Continue as guest</a>
            </p>
          </div>
        </div>
      ) : (
        <ResetPassword
          onClose={onClose}
          onBack={() => setShowResetPassword(false)}
        />
      )}
    </div>
  );
};

export default Login;
