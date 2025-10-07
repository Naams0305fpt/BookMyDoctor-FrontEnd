import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faSpinner,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./ResetPassword.css";

interface ResetPasswordProps {
  onClose: () => void;
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onClose, onBack }) => {
  const [step, setStep] = useState<"verify" | "newPassword">("verify");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setCodeSent(true);
      setError("");
      // Show success message instead of error
      setError("Verification code sent! Please check your email.");
    } catch (err) {
      setError("Failed to send reset code. Please try again later.");
      setCodeSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Verification code must be 6 digits");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement API call to verify code
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setStep("newPassword");
      setError("");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      // TODO: Implement API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
      // TODO: Show success notification via NotificationContext
    } catch (err) {
      setError("Failed to reset password. Please try again later.");
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
          <p>
            {step === "verify" && "Enter your email and the verification code"}
            {step === "newPassword" && "Create your new password"}
          </p>
        </div>

        {step === "verify" && (
          <form className="reset-password-form" onSubmit={handleVerifyCode}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-group">
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                  <button
                    type="button"
                    className="send-code-btn"
                    onClick={handleRequestReset}
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Sending...
                      </>
                    ) : (
                      "Send Code"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="verify-section">
              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <div className="input-wrapper verification-code">
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required={codeSent}
                    disabled={!codeSent}
                  />
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="reset-btn"
              disabled={isLoading || !codeSent}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </form>
        )}

        {step === "newPassword" && (
          <form className="reset-password-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {/* {error && <div className="error-message">{error}</div>} */}

            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
