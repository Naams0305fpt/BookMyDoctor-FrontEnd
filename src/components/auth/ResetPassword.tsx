import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
  faEnvelope,
  faShieldAlt, // Icons mới
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../contexts/NotificationContext";
// Đảm bảo bạn import đúng đường dẫn api
import { api } from "../../services/api";
import "./Login.css"; // Dùng chung style
import "./ResetPassword.css"; // Dùng chung style

interface ResetPasswordProps {
  onClose: () => void;
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onClose, onBack }) => {
  // States cho các trường
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States cho UI control
  const [step, setStep] = useState<"email" | "password">("email"); // Step 1: email/code, Step 2: password
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // --- HÀM GỬI OTP ---
  const handleSendOtp = async () => {
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSendingCode(true);
    setError("");
    try {
      // Gọi API request-otp
      await api.sendVerificationCode({
        Destination: email,
        Purpose: "ResetPassword",
        Channel: "email",
      });
      setCodeSent(true);
      setCountdown(60);
      showNotification("success", "Code Sent", `OTP sent to ${email}`, 4000);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setSendingCode(false);
    }
  };

  // --- HÀM XÁC THỰC CODE VÀ CHUYỂN SANG BƯỚC 2 ---
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !otpCode) {
      setError("Please enter email and verification code.");
      return;
    }

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    // Move to password step (actual verification happens when submitting new password)
    setStep("password");
    showNotification(
      "success",
      "Code Accepted",
      "Please enter your new password",
      3000
    );
  };

  // --- HÀM SUBMIT FORM RESET CUỐI CÙNG ---
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- Validation (cho tất cả các trường) ---
    if (!email || !otpCode || !newPassword || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (otpCode.length !== 6) {
      // Giả sử OTP 6 số
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Validation mật khẩu chi tiết (đã có từ code cũ của bạn)
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passRegex.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, and one number."
      );
      return;
    }
    // --- Kết thúc Validation ---

    setIsLoading(true); // Bắt đầu loading cho nút Reset
    try {
      // Gọi API reset-password-otp
      await api.resetPasswordWithOtp({
        Destination: email,
        Purpose: "ResetPassword", // Dùng cùng purpose
        OtpCode: otpCode,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });

      showNotification(
        "success",
        "Success!",
        "Password reset successfully. Please log in.",
        4000
      );
      setTimeout(() => {
        onBack(); // Gọi onBack() sau 1 giây (1000ms)
      }, 1000);
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to reset password. Please check your OTP and try again."
      );
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  return (
    // Modal container
    <div className="login-overlay">
      <div
        className="reset-password-modal login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="reset-password-header login-header">
          <button
            className="back-button"
            onClick={step === "password" ? () => setStep("email") : onBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />{" "}
            {step === "password" ? "Back to Verification" : "Back to Login"}
          </button>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <h2>Reset Password</h2>
          <p>
            {step === "email"
              ? "Verify your email with OTP code"
              : "Enter your new password"}
          </p>
        </div>

        {/* STEP 1: Email & Verification Code */}
        {step === "email" && (
          <form
            className="reset-password-form login-form"
            onSubmit={handleVerifyCode}
          >
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="reset-email">EMAIL ADDRESS</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={codeSent}
                />
              </div>
            </div>

            {/* OTP Section */}
            <div className="form-group">
              <label htmlFor="otpCode">
                <FontAwesomeIcon icon={faShieldAlt} /> VERIFICATION CODE
              </label>
              <div className="verification-input-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="otpCode"
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 6) setOtpCode(val);
                    }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    className="verification-code-input"
                  />
                  <button
                    type="button"
                    className="send-code-btn"
                    onClick={handleSendOtp}
                    disabled={sendingCode || countdown > 0 || !email}
                  >
                    {sendingCode ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : countdown > 0 ? (
                      `Resend (${countdown}s)`
                    ) : codeSent ? (
                      "Resend Code"
                    ) : (
                      "Send Code"
                    )}
                  </button>
                </div>
              </div>
              {!codeSent && (
                <small className="verification-info">
                  Click 'Send Code' to receive OTP via email
                </small>
              )}
            </div>

            {/* Hiển thị lỗi */}
            {error && <div className="error-message">{error}</div>}

            {/* Nút Continue */}
            <button
              type="submit"
              className="reset-btn login-btn"
              disabled={verifyingCode || !codeSent || otpCode.length !== 6}
            >
              {verifyingCode ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        )}

        {/* STEP 2: New Password */}
        {step === "password" && (
          <form
            className="reset-password-form login-form"
            onSubmit={handleResetSubmit}
          >
            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">NEW PASSWORD</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showNew ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNew(!showNew)}
                >
                  <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">CONFIRM NEW PASSWORD</label>
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={newPassword.length >= 8 ? "valid" : ""}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? "valid" : ""}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(newPassword) ? "valid" : ""}>
                  One lowercase letter
                </li>
                <li className={/\d/.test(newPassword) ? "valid" : ""}>
                  One number
                </li>
                <li
                  className={
                    newPassword && newPassword === confirmPassword
                      ? "valid"
                      : ""
                  }
                >
                  Passwords match
                </li>
              </ul>
            </div>

            {/* Hiển thị lỗi */}
            {error && <div className="error-message">{error}</div>}

            {/* Nút Reset Password */}
            <button
              type="submit"
              className="reset-btn login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Resetting...
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
