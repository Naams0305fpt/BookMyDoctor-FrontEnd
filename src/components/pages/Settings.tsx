import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faKey,
  faEnvelope,
  faShieldAlt,
  faSpinner,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Settings.css";

const Settings: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Tab states
  const [activeTab, setActiveTab] = useState<"account" | "password">("account");

  // Password change states (using OTP flow like ResetPassword)
  const [email, setEmail] = useState(user?.email || "");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI control states
  const [step, setStep] = useState<"email" | "password">("email");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");

  // Update email when user changes
  React.useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  console.log("Settings rendered - User:", user);
  console.log("Settings rendered - isAuthenticated:", isAuthenticated);
  console.log("Settings rendered - activeTab:", activeTab);

  // --- Send OTP ---
  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSendingCode(true);
    setError("");
    try {
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

  // --- Verify OTP ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setVerifyingCode(true);
    try {
      const result = await api.verifyOtp({
        Destination: email,
        Purpose: "ResetPassword",
        OtpCode: otpCode,
        Channel: "email",
      });

      if (result && result.message === "Xác thực OTP thành công.") {
        setStep("password");
        setError("");
        showNotification(
          "success",
          "Code Verified",
          "Please enter your new password",
          3000
        );
      } else {
        throw new Error("Verification failed: Invalid response from server.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setVerifyingCode(false);
    }
  };

  // --- Change Password ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passRegex.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePasswordWithOtp({
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });

      showNotification(
        "success",
        "Password Changed",
        "Your password has been updated successfully.",
        4000
      );

      // Reset form
      setStep("email");
      setCodeSent(false);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("account");
    } catch (err: any) {
      setError(err.message || "Failed to change password. Please try again.");
      if (err.message.includes("token")) {
        setStep("email");
        setCodeSent(false);
        setError(
          "Your verification token has expired. Please verify your email again."
        );
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    showNotification(
      "success",
      "Logged Out",
      "You have been logged out successfully.",
      3000
    );
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* Tabs Navigation */}
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <FontAwesomeIcon icon={faUser} />
            Account Info
          </button>
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("password");
              // Reset password change form when switching to password tab
              setStep("email");
              setCodeSent(false);
              setOtpCode("");
              setNewPassword("");
              setConfirmPassword("");
              setError("");
            }}
          >
            <FontAwesomeIcon icon={faLock} />
            Change Password
          </button>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Account Info Tab */}
          {activeTab === "account" && (
            <div className="settings-section">
              <h2 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                Account Information
              </h2>

              <div className="account-info-grid">
                <div className="info-item">
                  <label>Email Address</label>
                  <div className="info-value">{user?.email || "N/A"}</div>
                </div>

                <div className="info-item">
                  <label>Full Name</label>
                  <div className="info-value">{user?.name || "N/A"}</div>
                </div>

                <div className="info-item">
                  <label>Account Type</label>
                  <div className="info-value">
                    <span className={`badge ${user?.userType || ""}`}>
                      {user?.userType
                        ? user.userType.charAt(0).toUpperCase() +
                          user.userType.slice(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout Section */}
              <div style={{ marginTop: "2rem" }}>
                <h3 className="section-title">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Account Actions
                </h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Logout</h3>
                    <p>Sign out of your account</p>
                  </div>
                  <button className="btn btn-primary" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <div className="settings-section">
              <h2 className="section-title">
                <FontAwesomeIcon icon={faLock} />
                Change Password
              </h2>

              {error && (
                <div
                  className="error-message"
                  style={{
                    background: "#fee",
                    color: "#c33",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    border: "1px solid #fcc",
                  }}
                >
                  {error}
                </div>
              )}

              {/* STEP 1: Email & OTP Verification */}
              {step === "email" && (
                <form onSubmit={handleVerifyCode} className="password-form">
                  <div className="form-group">
                    <label>
                      Email Address <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="input-icon"
                      />
                      <input
                        type="email"
                        className="input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        disabled
                        style={{ paddingLeft: "48px" }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Verification Code <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon
                        icon={faShieldAlt}
                        className="input-icon"
                      />
                      <input
                        type="text"
                        className="input"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        style={{ paddingLeft: "48px" }}
                      />
                    </div>
                    <span className="input-hint">
                      {codeSent
                        ? countdown > 0
                          ? `Code sent! Resend in ${countdown}s`
                          : "Code expired. Click Send Code to get a new one."
                        : "Click 'Send Code' to receive OTP via email"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSendOtp}
                      disabled={sendingCode || (codeSent && countdown > 0)}
                      style={{ flex: 1 }}
                    >
                      {sendingCode ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Sending...
                        </>
                      ) : codeSent && countdown > 0 ? (
                        `Resend in ${countdown}s`
                      ) : (
                        "Send Code"
                      )}
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        verifyingCode || !otpCode || otpCode.length !== 6
                      }
                      style={{ flex: 1 }}
                    >
                      {verifyingCode ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Verifying...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: New Password */}
              {step === "password" && (
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label>
                      New Password <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faLock} className="input-icon" />
                      <input
                        type={showNew ? "text" : "password"}
                        className="input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        style={{ paddingLeft: "48px", paddingRight: "48px" }}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowNew(!showNew)}
                      >
                        <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    <span className="input-hint">
                      Min 8 characters, with uppercase, lowercase, number, and
                      special character
                    </span>
                  </div>

                  <div className="form-group">
                    <label>
                      Confirm New Password <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faKey} className="input-icon" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        style={{ paddingLeft: "48px", paddingRight: "48px" }}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        <FontAwesomeIcon
                          icon={showConfirm ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setStep("email");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError("");
                      }}
                      style={{ flex: 1, background: "#6c757d" }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        isChangingPassword || !newPassword || !confirmPassword
                      }
                      style={{ flex: 2 }}
                    >
                      {isChangingPassword ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faKey} />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
