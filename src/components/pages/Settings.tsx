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

  // Password change states (using changePasswordAfterLogin API)
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI control states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  console.log("Settings rendered - User:", user);
  console.log("Settings rendered - isAuthenticated:", isAuthenticated);
  console.log("Settings rendered - activeTab:", activeTab);

  // --- Change Password (Simple - with old password) ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation - Backend will handle detailed validation
    if (!CurrentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.changePasswordAfterLogin({
        CurrentPassword: CurrentPassword,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });

      showNotification(
        "success",
        "Password Changed Successfully",
        "Your password has been updated. You will be redirected to the home page.",
        3000
      );

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to home page after successful password change
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      // Handle validation error from backend
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.field && errorData.message) {
          setError(errorData.message);
        } else if (typeof errorData === "string") {
          setError(errorData);
        } else {
          setError(err.message || "Failed to change password.");
        }
      } else {
        setError(err.message || "Failed to change password.");
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
              setCurrentPassword("");
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

              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label>
                    Current Password <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faLock} className="input-icon" />
                    <input
                      type={showOld ? "text" : "password"}
                      className="input"
                      value={CurrentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      style={{ paddingLeft: "48px", paddingRight: "48px" }}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowOld(!showOld)}
                    >
                      <FontAwesomeIcon icon={showOld ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    New Password <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faKey} className="input-icon" />
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

                <div style={{ marginTop: "1.5rem" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      isChangingPassword ||
                      !CurrentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    style={{ width: "100%" }}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
