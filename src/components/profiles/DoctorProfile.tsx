import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faSave,
  faTimes,
  faUserMd,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faStethoscope,
  faCrown,
  faHospital,
  faGraduationCap,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import "../Profile.css";

const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialization: user?.specialization || "General Medicine",
    licenseNumber: "MD-2023-5678",
    hospital: "BookMyDoctor Medical Center",
    education: "Harvard Medical School",
    experience: "8 years",
    consultationFee: "$50",
    bio: "Experienced medical professional dedicated to providing excellent patient care with a focus on preventive medicine and patient education.",
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
    console.log("Saving doctor profile:", formData);
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
      specialization: user?.specialization || "General Medicine",
      licenseNumber: "MD-2023-5678",
      hospital: "BookMyDoctor Medical Center",
      education: "Harvard Medical School",
      experience: "8 years",
      consultationFee: "$50",
      bio: "Experienced medical professional dedicated to providing excellent patient care with a focus on preventive medicine and patient education.",
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar doctor">
          <FontAwesomeIcon icon={faUserMd} />
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p className="profile-type doctor">
            {user?.isVerified && (
              <FontAwesomeIcon icon={faCrown} className="verified-icon" />
            )}
            Verified Doctor
          </p>
          <span className="profile-status">
            <FontAwesomeIcon icon={faStethoscope} />
            {formData.specialization}
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
                <FontAwesomeIcon icon={faStethoscope} />
                Specialization
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.specialization}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Professional Information</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faCalendarAlt} />
                License Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.licenseNumber}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faHospital} />
                Hospital/Clinic
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.hospital}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faGraduationCap} />
                Education
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.education}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faClock} />
                Experience
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.experience}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Consultation Fee</label>
              {isEditing ? (
                <input
                  type="text"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.consultationFee}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>About</h3>
          <div className="profile-field full-width">
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell patients about your experience and approach to medicine..."
              />
            ) : (
              <p className="bio-text">{formData.bio}</p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Patients</h4>
              <span className="stat-number">156</span>
            </div>
            <div className="stat-card">
              <h4>Appointments Today</h4>
              <span className="stat-number">8</span>
            </div>
            <div className="stat-card">
              <h4>Patient Rating</h4>
              <span className="stat-number">4.8/5</span>
            </div>
            <div className="stat-card">
              <h4>Years of Practice</h4>
              <span className="stat-number">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
