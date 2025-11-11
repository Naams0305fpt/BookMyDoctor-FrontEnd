import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUserMd,
  faCalendarAlt,
  faClock,
  faInfoCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ScheduleFormModal.css";
import {
  api,
  AddScheduleRequest,
  UpdateScheduleRequest,
  formatDateForAPI,
  Doctor,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface ScheduleFormModalProps {
  onClose: () => void;
  onSubmit: () => void;
  mode: "create" | "edit";
  initialData?: UpdateScheduleRequest; // Chỉ có khi edit
}

const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  onClose,
  onSubmit,
  mode,
  initialData,
}) => {
  const { user } = useAuth(); // Get current user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [notification, setNotification] = useState<string>("");
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // Check if user is Doctor (R02) - only doctors can create/edit schedules
  const isDoctorRole = user?.userType === "doctor";

  // Form state
  const [formData, setFormData] = useState<{
    DoctorId: string;
    WorkDate: string;
    StartTime: string;
    EndTime: string;
    Status: string;
  }>({
    DoctorId: initialData?.DoctorId.toString() || "",
    WorkDate: initialData?.WorkDate || "",
    StartTime: initialData?.StartTime || "08:00",
    EndTime: initialData?.EndTime || "17:00",
    Status: initialData?.Status || "Scheduled",
  });

  const [workDate, setWorkDate] = useState<Date | null>(
    initialData?.WorkDate ? new Date(initialData.WorkDate) : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load doctors list
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctors = await api.getDoctors();
        setAllDoctors(doctors);
      } catch (error) {
        console.error("Failed to load doctors:", error);
        setNotification("Failed to load doctors list");
        setSubmitStatus("error");
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setWorkDate(date);
    setFormData((prev) => ({ ...prev, WorkDate: formatDateForAPI(date) }));
    if (errors.WorkDate) {
      setErrors((prev) => ({ ...prev, WorkDate: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.DoctorId) newErrors.DoctorId = "Doctor is required";
    if (!formData.WorkDate) newErrors.WorkDate = "Work date is required";
    if (!formData.StartTime) newErrors.StartTime = "Start time is required";
    if (!formData.EndTime) newErrors.EndTime = "End time is required";
    if (!formData.Status) newErrors.Status = "Status is required";

    // Validate time logic
    if (formData.StartTime && formData.EndTime) {
      const start = formData.StartTime.split(":").map(Number);
      const end = formData.EndTime.split(":").map(Number);
      const startMinutes = start[0] * 60 + (start[1] || 0);
      const endMinutes = end[0] * 60 + (end[1] || 0);

      if (startMinutes >= endMinutes) {
        newErrors.EndTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification("Please fill in all required fields correctly");
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setNotification("");

    try {
      if (mode === "create") {
        // Create new schedule
        const createData: AddScheduleRequest = {
          DoctorId: parseInt(formData.DoctorId),
          WorkDate: formData.WorkDate,
          StartTime: formData.StartTime,
          EndTime: formData.EndTime,
          Status: formData.Status,
        };
        await api.addSchedule(createData);
        setNotification("Schedule created successfully!");
      } else {
        // Update existing schedule
        if (!initialData?.ScheduleId) {
          throw new Error("Schedule ID is missing");
        }
        const updateData: UpdateScheduleRequest = {
          ScheduleId: initialData.ScheduleId,
          DoctorId: parseInt(formData.DoctorId),
          WorkDate: formData.WorkDate,
          StartTime: formData.StartTime,
          EndTime: formData.EndTime,
          Status: formData.Status,
        };
        await api.updateSchedule(updateData);
        setNotification("Schedule updated successfully!");
      }

      setSubmitStatus("success");
      setTimeout(() => {
        onSubmit(); // Refresh parent component
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Submit error:", error);
      setNotification(error.message || "Failed to save schedule");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Time options (30-minute intervals)
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      timeOptions.push(`${hour}:${minute}`);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content create-doctor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faCalendarAlt} className="modal-icon" />
            {mode === "create" ? "Create New Schedule" : "Edit Schedule"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Role Warning for Non-Doctor Users */}
          {!isDoctorRole && (
            <div
              className="notification error"
              style={{ marginBottom: "1.5rem" }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <div>
                <strong>Permission Required:</strong> Only Doctor accounts (R02)
                can create or edit schedules. You are currently logged in as{" "}
                {user?.userType?.toUpperCase() || "UNKNOWN"}. Please login with
                a Doctor account to perform this action.
              </div>
            </div>
          )}

          {/* Doctor Selection */}
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faUserMd} /> Doctor *
              </label>
              <select
                name="DoctorId"
                value={formData.DoctorId}
                onChange={handleInputChange}
                className={errors.DoctorId ? "error" : ""}
                disabled={isLoadingDoctors}
              >
                <option value="">
                  {isLoadingDoctors ? "Loading..." : "Select Doctor"}
                </option>
                {allDoctors.map((doctor) => (
                  <option key={doctor.DoctorId} value={doctor.DoctorId}>
                    {doctor.Name} - {doctor.Department}
                  </option>
                ))}
              </select>
              {errors.DoctorId && (
                <span className="error-message">{errors.DoctorId}</span>
              )}
            </div>
          </div>

          {/* Work Date */}
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faCalendarAlt} /> Work Date *
              </label>
              <DatePicker
                selected={workDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className={`form-input ${errors.WorkDate ? "error" : ""}`}
                placeholderText="Select work date"
                minDate={new Date()} // Không cho chọn ngày quá khứ
              />
              {errors.WorkDate && (
                <span className="error-message">{errors.WorkDate}</span>
              )}
            </div>
          </div>

          {/* Start Time & End Time */}
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faClock} /> Start Time *
              </label>
              <select
                name="StartTime"
                value={formData.StartTime}
                onChange={handleInputChange}
                className={errors.StartTime ? "error" : ""}
              >
                {timeOptions.map((time) => (
                  <option key={`start-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.StartTime && (
                <span className="error-message">{errors.StartTime}</span>
              )}
            </div>

            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faClock} /> End Time *
              </label>
              <select
                name="EndTime"
                value={formData.EndTime}
                onChange={handleInputChange}
                className={errors.EndTime ? "error" : ""}
              >
                {timeOptions.map((time) => (
                  <option key={`end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.EndTime && (
                <span className="error-message">{errors.EndTime}</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faInfoCircle} /> Status *
              </label>
              <select
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className={errors.Status ? "error" : ""}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Available">Available</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.Status && (
                <span className="error-message">{errors.Status}</span>
              )}
            </div>
          </div>

          {/* Notification */}
          {submitStatus !== "idle" && (
            <div
              className={`notification ${
                submitStatus === "success" ? "success" : "error"
              }`}
            >
              {notification}
            </div>
          )}

          {/* Submit Button */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !isDoctorRole}
              title={
                !isDoctorRole
                  ? "Only Doctor accounts can create/edit schedules"
                  : ""
              }
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Schedule"
                : "Update Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormModal;
