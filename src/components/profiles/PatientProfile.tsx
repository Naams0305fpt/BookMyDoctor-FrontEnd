import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faSave,
  faTimes,
  faUserInjured,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faBirthdayCake,
  faMapMarkerAlt,
  faWeight,
  faRuler,
  faHeartbeat,
  faAllergies,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import "../Profile.css";

const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: "123 Main Street, City, State 12345",
    emergencyContact: "+1 (555) 987-6543",
    bloodType: "O+",
    height: "175 cm",
    weight: "70 kg",
    allergies: "None",
    medicalConditions: "None",
    insurance: "Blue Cross Blue Shield",
    insuranceNumber: "BC123456789",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically call an API to update the profile
    console.log("Saving patient profile:", formData);
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
      dateOfBirth: "1990-05-15",
      gender: "Male",
      address: "123 Main Street, City, State 12345",
      emergencyContact: "+1 (555) 987-6543",
      bloodType: "O+",
      height: "175 cm",
      weight: "70 kg",
      allergies: "None",
      medicalConditions: "None",
      insurance: "Blue Cross Blue Shield",
      insuranceNumber: "BC123456789",
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar patient">
          <FontAwesomeIcon icon={faUserInjured} />
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p className="profile-type patient">Patient</p>
          <span className="profile-status">
            <FontAwesomeIcon icon={faHeartbeat} />
            Active Member since 2023
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
                <FontAwesomeIcon icon={faBirthdayCake} />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              ) : (
                <span>
                  {new Date(formData.dateOfBirth).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="profile-field">
              <label>Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{formData.gender}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.address}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Emergency Contact</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faPhone} />
                Emergency Contact
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.emergencyContact}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Medical Information</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faHeartbeat} />
                Blood Type
              </label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <span>{formData.bloodType}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faRuler} />
                Height
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.height}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faWeight} />
                Weight
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.weight}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faAllergies} />
                Allergies
              </label>
              {isEditing ? (
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={2}
                />
              ) : (
                <span>{formData.allergies}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Medical Conditions</label>
              {isEditing ? (
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows={2}
                />
              ) : (
                <span>{formData.medicalConditions}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Insurance Information</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Insurance Provider</label>
              {isEditing ? (
                <input
                  type="text"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.insurance}</span>
              )}
            </div>

            <div className="profile-field">
              <label>Insurance Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.insuranceNumber}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Health Summary</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Appointments</h4>
              <span className="stat-number">24</span>
            </div>
            <div className="stat-card">
              <h4>Upcoming Appointments</h4>
              <span className="stat-number">2</span>
            </div>
            <div className="stat-card">
              <h4>Last Visit</h4>
              <span className="stat-number">Oct 5, 2025</span>
            </div>
            <div className="stat-card">
              <h4>Health Score</h4>
              <span className="stat-number">85/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
