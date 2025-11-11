import React, { useState, useEffect } from "react";
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
  faHospital,
  faVenusMars,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { api } from "../../services/api";
import "../pages/Profile.css";

interface ProfileData {
  UserId: number;
  Username: string;
  RoleId: string;
  DoctorId?: number;
  Name: string;
  Gender: string;
  DateOfBirth: string;
  Phone: string;
  Email: string;
  Address: string | null;
  Department?: string;
  ExperienceYears?: number;
  Identification?: string;
}

const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    department: "",
    experienceYears: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProfileMe();
      setProfileData(data);

      // Cập nhật formData với dữ liệu từ API
      setFormData({
        name: data.Name || "",
        email: data.Email || "",
        phone: data.Phone || "",
        gender: data.Gender || "",
        dateOfBirth: data.DateOfBirth || "",
        address: data.Address || "",
        department: data.Department || "",
        experienceYears: data.ExperienceYears || 0,
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      showNotification(
        "error",
        "Error",
        error.message || "Failed to load profile data",
        3000
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experienceYears" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.updateProfileMe({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        department: formData.department,
        experienceYears: formData.experienceYears,
      });

      showNotification(
        "success",
        "Profile Updated",
        "Your profile has been successfully updated.",
        3000
      );

      setIsEditing(false);
      // Refresh profile data
      await fetchProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showNotification(
        "error",
        "Update Failed",
        error.message || "Failed to update profile. Please try again.",
        3000
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values from profileData
    if (profileData) {
      setFormData({
        name: profileData.Name || "",
        email: profileData.Email || "",
        phone: profileData.Phone || "",
        gender: profileData.Gender || "",
        dateOfBirth: profileData.DateOfBirth || "",
        address: profileData.Address || "",
        department: profileData.Department || "",
        experienceYears: profileData.ExperienceYears || 0,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          Failed to load profile data
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar doctor">
          <FontAwesomeIcon icon={faUserMd} />
        </div>
        <div className="profile-info">
          <h1>{profileData.Name}</h1>
          <p className="profile-type doctor">Verified Doctor</p>
          {profileData.Department && (
            <span className="profile-status">
              <FontAwesomeIcon icon={faHospital} />
              {profileData.Department}
            </span>
          )}
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              disabled={isSaving}
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faSave} />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={handleCancel}
                disabled={isSaving}
              >
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
                Username
              </label>
              <span>{profileData.Username}</span>
            </div>

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
                <FontAwesomeIcon icon={faVenusMars} />
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{formData.gender || "Not specified"}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faCalendarAlt} />
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
                <span>{formatDate(formData.dateOfBirth)}</span>
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

            <div className="profile-field full-width">
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
                  placeholder="Enter your address"
                />
              ) : (
                <span>{formData.address || "Not provided"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Professional Information</h3>
          <div className="profile-grid">
            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faHospital} />
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter department/specialty"
                />
              ) : (
                <span>{formData.department || "Not specified"}</span>
              )}
            </div>

            <div className="profile-field">
              <label>
                <FontAwesomeIcon icon={faCalendarAlt} />
                Experience (Years)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  min="0"
                />
              ) : (
                <span>{formData.experienceYears} years</span>
              )}
            </div>

            {profileData.Identification && (
              <div className="profile-field">
                <label>Identification Number</label>
                <span>{profileData.Identification}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
