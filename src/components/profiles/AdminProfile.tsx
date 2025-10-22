import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faSave,
  faTimes,
  faUserShield,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import "../pages/Profile.css";

const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: "System Administration",
    role: "Admin",
    joinDate: "2023-01-15",
    permissions: "Full Access",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically call an API to update the profile
    console.log("Saving admin profile:", formData);
    setIsEditing(false);
    showNotification(
      "success",
      "Profile Updated",
      "Your profile has been successfully updated.",
      3000
    );
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      department: "System Administration",
      role: "Super Admin",
      joinDate: "2023-01-15",
      permissions: "Full Access",
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar admin">
          <FontAwesomeIcon icon={faUserShield} />
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p className="profile-type admin">System Administrator</p>
          <span className="profile-status">
            <FontAwesomeIcon icon={faShieldAlt} />
            Administrator Access
          </span>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} />
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faUser} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.name}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faEnvelope} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.email}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faPhone} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.phone}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faCalendarAlt} />
                Join Date
              </label>
              <span>{formData.joinDate}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Administrative Information</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Department</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.department}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Role</label>
              {isEditing ? (
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.role}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Permissions Level</label>
              <span>{formData.permissions}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>System Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Users</h4>
              <span className="stat-number">1,234</span>
            </div>
            <div className="stat-card">
              <h4>Active Doctors</h4>
              <span className="stat-number">89</span>
            </div>
            <div className="stat-card">
              <h4>Pending Verifications</h4>
              <span className="stat-number">12</span>
            </div>
            <div className="stat-card">
              <h4>System Uptime</h4>
              <span className="stat-number">99.9%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="delete-btn">
        <button className="btn">Delete Account</button>
      </div>
    </div>
  );
};

export default AdminProfile;
