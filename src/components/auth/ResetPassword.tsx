import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowLeft,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./ResetPassword.css";
import EmailVerification from "./EmailVerification";
import { useNotification } from "../../contexts/NotificationContext";

interface ResetPasswordProps {
  onClose: () => void;
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onClose, onBack }) => {
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleEmailVerified = () => {
    setIsEmailVerified(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isEmailVerified) {
      setError("Please verify your email first");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-z])/.test(newPassword)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!/(?=.*[A-Z])/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/(?=.*\d)/.test(newPassword)) {
      setError("Password must contain at least one number");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement API call to reset password with email and new password
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      showNotification(
        "success",
        "Password Reset Successful",
        "Your password has been reset successfully. You can now login with your new password.",
        4000
      );
      onClose();
    } catch (err) {
      setError("Failed to reset password. Please try again later.");
      showNotification(
        "error",
        "Reset Failed",
        "Failed to reset password. Please try again.",
        4000
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className="reset-password-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reset-password-header">
          <button className="back-button" onClick={onBack}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
          </button>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <img src="/images/logo.png" alt="logo" />
          <h2>Reset Password</h2>
          <p>Verify your email and create a new password</p>
        </div>

        <form className="reset-password-form" onSubmit={handleResetPassword}>
          {/* Email Verification Section */}
          <EmailVerification
            email={email}
            onVerified={handleEmailVerified}
            mode="reset"
            showEmailInput={true}
            onEmailChange={setEmail}
          />

          {/* New Password Section */}
          <div className="password-reset-section">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  required
                  disabled={!isEmailVerified}
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
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={!isEmailVerified}
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

            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={newPassword.length >= 8 ? "valid" : ""}>
                  At least 8 characters
                </li>
                <li className={/(?=.*[a-z])/.test(newPassword) ? "valid" : ""}>
                  One lowercase letter
                </li>
                <li className={/(?=.*[A-Z])/.test(newPassword) ? "valid" : ""}>
                  One uppercase letter
                </li>
                <li className={/(?=.*\d)/.test(newPassword) ? "valid" : ""}>
                  One number
                </li>
              </ul>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="reset-btn"
            disabled={isLoading || !isEmailVerified}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
