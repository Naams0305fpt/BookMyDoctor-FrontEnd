import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faPhone,
  faTimes,
  faUserMd,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../contexts/NotificationContext";
import "./CreateDoctorModal.css";

interface CreateDoctorModalProps {
  onClose: () => void;
  onSubmit: (doctorData: any) => void;
}

const CreateDoctorModal: React.FC<CreateDoctorModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "Doctor@123",
    role: "doctor",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "" };

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log("Creating doctor account:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification(
        "success",
        "Account Created",
        `Doctor account for ${formData.username} has been created successfully. An activation email has been sent to ${formData.email}.`,
        5000
      );

      // Call the onSubmit prop with the new doctor data
      onSubmit({
        fullName: formData.username,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone || "N/A",
        dob: "N/A",
        gender: "N/A",
        address: "N/A",
        department: "N/A",
        experience: "0 years",
      });

      onClose();
    } catch (error) {
      showNotification(
        "error",
        "Creation Failed",
        "Failed to create doctor account. Please try again.",
        4000
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content create-doctor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="modal-header">
          <FontAwesomeIcon icon={faUserMd} className="modal-icon" />
          <h2>Create Doctor Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-group">
            <label htmlFor="username">
              <FontAwesomeIcon icon={faUser} />
              Username <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className={errors.username ? "error" : ""}
              />
            </div>

            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} />
              Email <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="doctor@example.com"
                className={errors.email ? "error" : ""}
              />
            </div>

            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <span className="field-note">
              An activation link will be sent to this email
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FontAwesomeIcon icon={faPhone} />
              Phone <span className="optional">(Optional)</span>
            </label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter doctor's phone number"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} />
              Default Password
            </label>
            <div className="password-input-wrapper">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                readOnly
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <span className="field-note">
              Doctor can change this password after first login
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <FontAwesomeIcon icon={faUserMd} />
              Role
            </label>
            <div className="input-wrapper">
              <FontAwesomeIcon icon={faUserMd} className="input-icon" />
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                readOnly
                className="readonly-field"
              />
            </div>
          </div>

          <div className="info-box">
            <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
            <div className="info-content">
              <strong>Email Activation Required</strong>
              <p>
                The doctor will receive an activation email at the provided
                address. They must click the activation link to complete the
                account setup.
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              <FontAwesomeIcon icon={faUserMd} />
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctorModal;
