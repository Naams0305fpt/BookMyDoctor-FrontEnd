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
  faVenusMars,
  faCalendarAlt,
  faIdCard,
  faBriefcase,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateDoctorModal.css";
import doctorApi from "../../services/api/doctor.api";
import { formatDateForAPI } from "../../services/http-client";
import type { CreateDoctorRequest } from "../../types";

interface CreateDoctorModalProps {
  onClose: () => void;
  onSubmit: () => void; // Chỉ báo hiệu thành công
}

const CreateDoctorModal: React.FC<CreateDoctorModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [notification, setNotification] = useState<string>("");

  // State khớp với CreateDoctorRequest
  const [formData, setFormData] = useState<CreateDoctorRequest>({
    // Bắt buộc
    Username: "",
    Email: "",
    Password: "Doctor@123", // Mật khẩu mặc định
    Phone: "",
    Name: "",
    Identification: "",
    Gender: "",
    DateOfBirth: "",
    Department: "", // Bắt buộc - khởi tạo rỗng
    ExperienceYears: 0, // Bắt buộc - khởi tạo 0
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Xử lý ExperienceYears: Nếu input trống thì vẫn là chuỗi rỗng để validate
    const finalValue =
      name === "ExperienceYears"
        ? value // Giữ là string để validate isEmpty, sẽ convert thành number khi submit
        : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    setFormData((prev) => ({ ...prev, DateOfBirth: formatDateForAPI(date) }));
    if (errors.DateOfBirth) {
      setErrors((prev) => ({ ...prev, DateOfBirth: "" }));
    }
  };

  // SỬA ĐỔI: Thêm validation cho Department và ExperienceYears
  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Kiểm tra các trường bắt buộc
    if (!formData.Username.trim()) newErrors.Username = "Username is required";
    if (!formData.Email.trim()) newErrors.Email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email))
      newErrors.Email = "Invalid email format";
    if (!formData.Password.trim()) newErrors.Password = "Password is required";
    if (!formData.Name.trim()) newErrors.Name = "Full Name is required";
    if (!formData.Identification.trim())
      newErrors.Identification = "Identification (ID Card) is required";
    if (!formData.Phone.trim()) newErrors.Phone = "Phone number is required";
    if (!formData.Gender) newErrors.Gender = "Gender is required";
    if (!formData.DateOfBirth)
      newErrors.DateOfBirth = "Date of Birth is required";
    // Thêm kiểm tra
    if (!formData.Department.trim())
      newErrors.Department = "Department is required";
    // Kiểm tra ExperienceYears không rỗng và không âm
    const expYearsString = String(formData.ExperienceYears).trim(); // Convert to string for trim check
    if (expYearsString === "") {
      newErrors.ExperienceYears = "Experience is required";
    } else {
      const expYearsNum = Number(expYearsString);
      if (isNaN(expYearsNum) || expYearsNum < 0) {
        newErrors.ExperienceYears = "Experience must be a non-negative number";
      }
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  // Gọi API createDoctor
  // Gọi API createDoctor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus("error");
      setNotification("Please check all required fields.");
      setTimeout(() => {
        setSubmitStatus("idle");
        setNotification("");
      }, 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setNotification("");

    try {
      // Chuẩn bị data
      const dataToSend: CreateDoctorRequest = {
        ...formData,
        ExperienceYears: Number(formData.ExperienceYears),
      };

      const response = await doctorApi.createDoctor(dataToSend);

      // ✅ Backend đã sửa: 200 = thành công, 400 = lỗi
      // Nếu code chạy đến đây = API đã trả về 200 (thành công)
      // Mọi lỗi 400 sẽ được interceptor bắt và throw vào catch block
      setSubmitStatus("success");
      setNotification(
        response?.Message ||
          `Doctor account for ${formData.Name} has been created successfully!`
      );

      // Đóng modal sau 2 giây
      setTimeout(() => {
        onSubmit();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Create doctor failed:", err);

      let detailedMessage = "Failed to create doctor account.";

      // Kiểm tra lỗi validation từ .NET
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors;
        const messages: string[] = [];

        for (const field in validationErrors) {
          if (validationErrors.hasOwnProperty(field)) {
            messages.push(`${field}: ${validationErrors[field].join(", ")}`);
          }
        }

        detailedMessage = messages.join(" | ");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        // Lỗi từ API (response có message)
        detailedMessage = err.response.data.message;
      } else if (err.message) {
        detailedMessage = err.message;
      }

      setSubmitStatus("error");
      setNotification(detailedMessage);

      setTimeout(() => {
        setSubmitStatus("idle");
        setNotification("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // JSX Render
  return (
    <div className="modal-overlay">
      <div
        className="modal-content create-doctor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="modal-header create-doctor-header">
          <FontAwesomeIcon icon={faUserMd} className="modal-icon" />
          <h2>Create Doctor Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-grid">
            {/* Cột 1 */}
            <div className="form-group-column">
              {/* --- BẮT BUỘC --- */}
              <div className="form-group">
                <label htmlFor="Name">
                  Full Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    id="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    placeholder="Nguyen Van A"
                    className={errors.Name ? "error" : ""}
                  />
                </div>
                {errors.Name && (
                  <span className="error-message">{errors.Name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="Username">
                  Username <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    id="Username"
                    name="Username"
                    value={formData.Username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className={errors.Username ? "error" : ""}
                  />
                </div>
                {errors.Username && (
                  <span className="error-message">{errors.Username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="Password">
                  Password <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <input
                    type="password"
                    id="Password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    className={errors.Password ? "error" : ""}
                  />
                </div>
                {errors.Password && (
                  <span className="error-message">{errors.Password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="Identification">
                  Identification (ID) <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                  <input
                    type="text"
                    id="Identification"
                    name="Identification"
                    value={formData.Identification}
                    onChange={handleInputChange}
                    placeholder="Enter ID Card Number"
                    className={errors.Identification ? "error" : ""}
                  />
                </div>
                {errors.Identification && (
                  <span className="error-message">{errors.Identification}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="DateOfBirth">
                  Date of Birth <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="input-icon"
                  />
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    id="DateOfBirth"
                    name="DateOfBirth"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select date"
                    className={errors.DateOfBirth ? "error" : ""}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={70}
                    isClearable={false}
                  />
                </div>
                {errors.DateOfBirth && (
                  <span className="error-message">{errors.DateOfBirth}</span>
                )}
              </div>
            </div>

            {/* Cột 2 */}
            <div className="form-group-column">
              {/* --- BẮT BUỘC --- */}
              <div className="form-group">
                <label htmlFor="Email">
                  Email <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                    className={errors.Email ? "error" : ""}
                  />
                </div>
                {errors.Email && (
                  <span className="error-message">{errors.Email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="Phone">
                  Phone <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faPhone} className="input-icon" />
                  <input
                    type="tel"
                    id="Phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className={errors.Phone ? "error" : ""}
                  />
                </div>
                {errors.Phone && (
                  <span className="error-message">{errors.Phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="Gender">
                  Gender <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faVenusMars} className="input-icon" />
                  <select
                    id="Gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    className={errors.Gender ? "error" : ""}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.Gender && (
                  <span className="error-message">{errors.Gender}</span>
                )}
              </div>

              {/* --- SỬA ĐỔI: Department BẮT BUỘC --- */}
              <div className="form-group">
                <label htmlFor="Department">
                  Department <span className="required">*</span>{" "}
                  {/* Sửa label */}
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faBuilding} className="input-icon" />
                  <input
                    type="text"
                    id="Department"
                    name="Department"
                    value={formData.Department}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiology"
                    className={errors.Department ? "error" : ""} // Sửa placeholder
                  />
                </div>
                {/* Hiển thị lỗi */}
                {errors.Department && (
                  <span className="error-message">{errors.Department}</span>
                )}
              </div>

              {/* --- SỬA ĐỔI: ExperienceYears BẮT BUỘC --- */}
              <div className="form-group">
                <label htmlFor="ExperienceYears">
                  Experience (Years) <span className="required">*</span>{" "}
                  {/* Sửa label */}
                </label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faBriefcase} className="input-icon" />
                  <input
                    type="number"
                    id="ExperienceYears"
                    name="ExperienceYears"
                    value={formData.ExperienceYears}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={errors.ExperienceYears ? "error" : ""}
                    min="0" // Sửa placeholder
                  />
                </div>
                {/* Hiển thị lỗi */}
                {errors.ExperienceYears && (
                  <span className="error-message">
                    {errors.ExperienceYears}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faUserMd} />
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {submitStatus === "success" && notification && (
          <div className="status-message success">✅ {notification}</div>
        )}

        {submitStatus === "error" && notification && (
          <div className="status-message error">❌ {notification}</div>
        )}
      </div>
    </div>
  );
};

export default CreateDoctorModal;
