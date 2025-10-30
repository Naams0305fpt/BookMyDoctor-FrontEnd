import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faPhone,
  faSpinner,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./Login.css"; // Base styles
import "./SignUp.css"; // Additional signup-specific styles
import { useLoginModal } from "../../contexts/LoginModalContext";

interface SignUpProps {
  onClose: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const { openLogin } = useLoginModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (Object.values(formData).some((value) => !value)) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.Password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!/^\d{10}$/.test(formData.Phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      // THAY ĐỔI: Ánh xạ (map) state (chữ thường)
      // sang payload (chữ hoa) mà API yêu cầu
      const result = await register({
        Username: formData.Username,
        Password: formData.Password,
        ConfirmPassword: formData.ConfirmPassword,
        Email: formData.Email,
        Phone: formData.Phone,
      });

      if (result.success) {
        showNotification(
          "success",
          "Welcome!",
          "Your account has been successfully created.",
          3000
        );
        onClose();
        openLogin();
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-header">
          {/* <img src="/images/logo.png" alt="logo" /> */}
          <h2>Create Account</h2>
          <p>Join BookMyDoctor today</p>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />

              <input
                type="text"
                id="username"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="email"
                id="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
              <input
                type="tel"
                id="phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit phone number"
                pattern="[0-9]*"
                maxLength={10}
                minLength={10}
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
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Create password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="ConfirmPassword"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Creating Account...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                openLogin();
              }}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
