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
  faPhone,
  faClock,
  faEdit,
  faCalendar,
  faExclamationTriangle,
  faBell,
  faCog,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Navigate, useNavigate } from "react-router-dom";
import authApi from "../../services/api/auth.api";
import "./Settings.css";

const Settings: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Tab states
  const [activeTab, setActiveTab] = useState<
    "account" | "password" | "preferences"
  >("account");

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

  // Preferences states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

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
      await authApi.changePasswordAfterLogin({
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
            className={`tab-button ${
              activeTab === "preferences" ? "active" : ""
            }`}
            onClick={() => setActiveTab("preferences")}
          >
            <FontAwesomeIcon icon={faCog} />
            Preferences
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
                  <label>
                    <FontAwesomeIcon icon={faEnvelope} /> Email Address
                  </label>
                  <div className="info-value">{user?.email || "N/A"}</div>
                </div>

                <div className="info-item">
                  <label>
                    <FontAwesomeIcon icon={faUser} /> Full Name
                  </label>
                  <div className="info-value">{user?.name || "N/A"}</div>
                </div>

                <div className="info-item">
                  <label>
                    <FontAwesomeIcon icon={faPhone} /> Phone Number
                  </label>
                  <div className="info-value">{user?.phone || "Not set"}</div>
                </div>

                <div className="info-item">
                  <label>
                    <FontAwesomeIcon icon={faShieldAlt} /> Account Type
                  </label>
                  <div className="info-value">
                    <span className={`badge ${user?.userType || ""}`}>
                      {user?.userType
                        ? user.userType.charAt(0).toUpperCase() +
                          user.userType.slice(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <label>
                    <FontAwesomeIcon icon={faClock} /> Account Status
                  </label>
                  <div className="info-value">
                    <span className="badge verified">Active</span>
                  </div>
                </div>

                <div className="info-item">
                  <label>
                    <FontAwesomeIcon icon={faCalendar} /> Member Since
                  </label>
                  <div className="info-value">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Action: Edit Full Profile */}
              <div className="info-note">
                <FontAwesomeIcon icon={faEdit} />
                <span>
                  Want to update your personal information?{" "}
                  <button
                    className="link-button"
                    onClick={() => navigate("/profile")}
                  >
                    Go to Full Profile
                  </button>
                </span>
              </div>

              {/* Account Actions */}
              <div style={{ marginTop: "2rem" }}>
                <h3 className="section-title">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Account Actions
                </h3>
                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Edit Profile</h3>
                      <p>Update your personal information and preferences</p>
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate("/profile")}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit Profile
                    </button>
                  </div>

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

              {/* Danger Zone */}
              <div style={{ marginTop: "2rem" }}>
                <h3 className="section-title danger">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  Danger Zone
                </h3>
                <div className="danger-zone">
                  <div className="setting-info">
                    <h3>Delete Account</h3>
                    <p>
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete your account? This action cannot be undone!"
                        )
                      ) {
                        showNotification(
                          "info",
                          "Feature Not Available",
                          "Account deletion is not yet implemented. Please contact support.",
                          4000
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="settings-section">
              <h2 className="section-title">
                <FontAwesomeIcon icon={faCog} />
                Preferences
              </h2>

              {/* Language & Region */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 className="section-subtitle">
                  <FontAwesomeIcon icon={faGlobe} />
                  Language & Region
                </h3>
                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Language</h3>
                      <p>Choose your preferred language</p>
                    </div>
                    <select
                      className="select-input"
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                        const langName =
                          e.target.value === "en" ? "English" : "Tiếng Việt";
                        showNotification(
                          "success",
                          "🌐 Language Updated",
                          `Display language changed to ${langName}. Please refresh the page to see changes.`,
                          3500
                        );
                      }}
                    >
                      <option value="en">English</option>
                      <option value="vi">Tiếng Việt</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Timezone</h3>
                      <p>Set your local timezone for appointments</p>
                    </div>
                    <select
                      className="select-input"
                      value={timezone}
                      onChange={(e) => {
                        setTimezone(e.target.value);
                        const tzName =
                          e.target.options[e.target.selectedIndex].text;
                        showNotification(
                          "success",
                          "🕐 Timezone Updated",
                          `Your timezone is now set to ${tzName}. All appointment times will reflect this timezone.`,
                          3500
                        );
                      }}
                    >
                      <option value="Asia/Ho_Chi_Minh">
                        (GMT+7) Ho Chi Minh
                      </option>
                      <option value="Asia/Bangkok">(GMT+7) Bangkok</option>
                      <option value="Asia/Singapore">(GMT+8) Singapore</option>
                      <option value="Asia/Tokyo">(GMT+9) Tokyo</option>
                      <option value="America/New_York">(GMT-5) New York</option>
                      <option value="America/Los_Angeles">
                        (GMT-8) Los Angeles
                      </option>
                      <option value="Europe/London">(GMT+0) London</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 className="section-subtitle">
                  <FontAwesomeIcon icon={faBell} />
                  Notifications
                </h3>
                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Email Notifications</h3>
                      <p>Receive updates and reminders via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => {
                          setEmailNotifications(e.target.checked);
                          showNotification(
                            "success",
                            e.target.checked
                              ? "✅ Email Notifications Enabled"
                              : "❌ Email Notifications Disabled",
                            e.target.checked
                              ? "You will receive appointment updates and reminders via email"
                              : "You will no longer receive email notifications",
                            3000
                          );
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>SMS Notifications</h3>
                      <p>Get text messages for important updates</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => {
                          setSmsNotifications(e.target.checked);
                          showNotification(
                            "success",
                            e.target.checked
                              ? "📱 SMS Notifications Enabled"
                              : "📵 SMS Notifications Disabled",
                            e.target.checked
                              ? `Important updates will be sent to ${
                                  user?.phone || "your phone"
                                }`
                              : "You will no longer receive SMS alerts",
                            3000
                          );
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Appointment Reminders</h3>
                      <p>Get reminded 24 hours before appointments</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appointmentReminders}
                        onChange={(e) => {
                          setAppointmentReminders(e.target.checked);
                          showNotification(
                            "success",
                            e.target.checked
                              ? "🔔 Appointment Reminders Enabled"
                              : "🔕 Appointment Reminders Disabled",
                            e.target.checked
                              ? "You will be reminded 24 hours before your appointments"
                              : "You will not receive appointment reminders",
                            3000
                          );
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
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
