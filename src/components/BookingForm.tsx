import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css";

interface TimeSlot {
  time: string;
  isBusy: boolean;
}

interface FormData {
  fullName: string;
  phone: string;
  date: Date | null;
  time: string;
  dateOfBirth: Date | null;
  gender: string;
  doctor: string;
  symptom: string;
}

interface FormErrors {
  [key: string]: string;
}

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "Tran Thi M",
    phone: "0123456789",
    date: new Date(),
    time: "17:00",
    dateOfBirth: new Date("2005-10-06"),
    gender: "Female",
    doctor: "Nguyen Van A",
    symptom: "blablabla",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [notification, setNotification] = useState<string>("");

  // Mock busy slots per doctor (you would typically get this from an API)
  const [busySlotsByDoctor] = useState<{ [key: string]: TimeSlot[] }>({
    "Nguyen Van A": [
      { time: "09:00", isBusy: true },
      { time: "10:30", isBusy: true },
    ],
    "Nguyen Van B": [
      { time: "14:00", isBusy: true },
      { time: "15:30", isBusy: true },
    ],
    "Nguyen Van C": [
      { time: "08:30", isBusy: true },
      { time: "16:00", isBusy: true },
    ],
  });

  const doctors = [
    "Nguyen Van A",
    "Nguyen Van B",
    "Nguyen Van C",
    "Nguyen Van D",
    "Nguyen Van E",
  ];

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const genders = ["Male", "Female", "Other"];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{9,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone number must be 9-11 digits";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else if (formData.date < new Date(new Date().setHours(0, 0, 0, 0))) {
      newErrors.date = "Date cannot be in the past";
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.doctor) {
      newErrors.doctor = "Please choose a doctor";
    }

    if (formData.symptom.length > 500) {
      newErrors.symptom = "Symptom description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus("success");

      // Show success message
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (field: string) => {
    let className = "input";
    if (errors[field]) className += " error";
    if (formData[field as keyof FormData] && !errors[field])
      className += " success";
    return className;
  };

  return (
    <section id="booking-section" className="booking-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>Booking now</h2>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="booking-card">
          <div className="booking-background">
            {/* Medical background image with overlay */}
            <div className="background-overlay"></div>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-columns">
              {/* Left Column */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    type="text"
                    className={getInputClass("fullName")}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    type="tel"
                    className={getInputClass("phone")}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <DatePicker
                    id="date"
                    selected={formData.date}
                    onChange={(date) => handleInputChange("date", date)}
                    className={getInputClass("date")}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    placeholderText="Select date"
                  />
                  {errors.date && (
                    <span className="error-message">{errors.date}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of birth</label>
                  <DatePicker
                    id="dateOfBirth"
                    selected={formData.dateOfBirth}
                    onChange={(date) => handleInputChange("dateOfBirth", date)}
                    className={getInputClass("dateOfBirth")}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    placeholderText="Select date of birth"
                    showYearDropdown
                    yearDropdownItemNumber={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    className={getInputClass("gender")}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <option value="">Select gender</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <span className="error-message">{errors.gender}</span>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="doctor">Choose doctor</label>
                  <select
                    id="doctor"
                    className={getInputClass("doctor")}
                    onChange={(e) => {
                      handleInputChange("doctor", e.target.value);
                      // Reset time when doctor changes
                      handleInputChange("time", "");
                    }}
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                  </select>
                  {errors.doctor && (
                    <span className="error-message">{errors.doctor}</span>
                  )}
                </div>

                {formData.doctor && (
                  <div className="form-group">
                    <label htmlFor="time">Available Hours</label>
                    <div className="time-slots-grid">
                      {timeSlots.map((time) => {
                        const isBusy =
                          busySlotsByDoctor[formData.doctor]?.some(
                            (slot: TimeSlot) => slot.time === time
                          ) || false;
                        return (
                          <div
                            key={time}
                            className={`time-slot ${isBusy ? "busy" : "free"} ${
                              formData.time === time ? "selected" : ""
                            }`}
                            onClick={() => {
                              if (isBusy) {
                                setNotification(
                                  "This time slot is already booked!"
                                );
                                setTimeout(() => setNotification(""), 3000);
                              } else {
                                handleInputChange("time", time);
                              }
                            }}
                          >
                            {time}
                          </div>
                        );
                      })}
                    </div>
                    {errors.time && (
                      <span className="error-message">{errors.time}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="symptom">Symptom (short)</label>
                  <textarea
                    id="symptom"
                    className={`${getInputClass("symptom")} symptom-textarea`}
                    onChange={(e) =>
                      handleInputChange("symptom", e.target.value)
                    }
                    placeholder="Describe your symptoms..."
                    rows={8}
                    maxLength={500}
                  />
                  <div className="character-counter">
                    {formData.symptom.length}/500 characters
                  </div>
                  {errors.symptom && (
                    <span className="error-message">{errors.symptom}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-submit">
              <button
                type="submit"
                className={`btn btn-primary booking-submit ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "BOOKING..." : "BOOKING"}
              </button>
            </div>
          </form>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="status-message success">
              ✅ Your appointment has been booked successfully!
            </div>
          )}

          {submitStatus === "error" && (
            <div className="status-message error">
              ❌ Something went wrong. Please try again.
            </div>
          )}

          {notification && (
            <div className="status-message warning">⚠️ {notification}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
