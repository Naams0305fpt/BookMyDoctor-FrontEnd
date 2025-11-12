import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUser,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faVenusMars,
  faUserMd,
  faClock,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingForm.css";
import { useAuth } from "../../contexts/AuthContext";
import { formatDateForAPI } from "../../services/http-client";
import doctorApi from "../../services/api/doctor.api";
import bookingApi from "../../services/api/booking.api";
import type {
  Doctor,
  BookingRequest,
  ScheduleResponseItem,
} from "../../types";

// --- STATE VÀ INTERFACES ---

interface FormData {
  doctorId: string | ""; // MỚI: Lưu ID bác sĩ (string để dễ lấy từ select)
  fullName: string;
  phone: string;
  email: string;
  date: Date | null;
  time: string;
  dateOfBirth: Date | null;
  gender: string;
  symptom: string;
}

interface FormErrors {
  [key: string]: string;
}

// MỚI: State khởi tạo (để reset form)
const initialFormData: FormData = {
  doctorId: "",
  fullName: "",
  phone: "",
  email: "",
  date: new Date(),
  time: "",
  dateOfBirth: null,
  gender: "",
  symptom: "",
};

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const { user } = useAuth(); // Lấy user từ context

  // State cho việc Gửi Form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [notification, setNotification] = useState<string>("");

  // State cho việc Lấy Bác sĩ
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // State cho việc Lấy Giờ Khám (Slots)
  const [fetchedBusySlots, setFetchedBusySlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Dữ liệu master (cố định)
  const timeSlots = [
    // Sáng
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    // Chiều
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];
  const genders = ["Male", "Female", "Other"];

  // --- HOOKS (EFFECTS) ---

  // MỚI: Effect 1 - Lấy danh sách bác sĩ (chỉ chạy 1 lần)
  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctorsData = await doctorApi.getAllDoctors();
        setAllDoctors(doctorsData);
      } catch (error) {
        console.error("Failed to load doctors", error);
        setErrors((prev) => ({
          ...prev,
          doctor: "Failed to load doctors list.",
        }));
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []); // [] = Chạy 1 lần khi component mount

  // MỚI: Effect 2 - Lấy lịch bận (chạy khi đổi Bác sĩ hoặc Ngày)
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const fetchSchedule = async () => {
        setIsLoadingSlots(true);
        setSlotsError(null);
        setFetchedBusySlots([]);

        try {
          // THAY ĐỔI: Truyền ID (số) vào hàm
          const busySchedule: ScheduleResponseItem[] =
            await bookingApi.getDoctorSchedule(
              parseInt(formData.doctorId), // formData.doctorId bây giờ là ID
              formData.date!
            );
          // --- BẮT ĐẦU LOGIC MỚI (Dùng key chữ hoa) ---
          const busyStrings = busySchedule
            // 1. Lọc status "Scheduled" (dùng 'Status' chữ hoa)
            .filter((item) => item.Status === "Scheduled")
            // 2. Lấy 5 ký tự đầu ("09:00") (dùng 'AppointHour' chữ hoa)
            .map((item) => item.AppointHour.substring(0, 5));
          // --- KẾT THÚC LOGIC MỚI ---

          setFetchedBusySlots(busyStrings);

          // Kiểm tra nếu slot đang chọn bị bận (do đổi ngày)
          if (formData.time && busyStrings.includes(formData.time)) {
            handleInputChange("time", ""); // Reset
            setNotification(
              "Your previously selected time is no longer available."
            );
            setTimeout(() => setNotification(""), 3000);
          }
        } catch (error) {
          console.error("Failed to fetch schedule:", error);
          setSlotsError("Could not load available times. Please try again.");
        } finally {
          setIsLoadingSlots(false);
        }
      };
      fetchSchedule();
    }
  }, [formData.doctorId, formData.date]); // Chạy lại khi 2 giá trị này thay đổi

  // --- THÊM EFFECT 3 VÀO ĐÂY ---
  useEffect(() => {
    // Chỉ chạy nếu user đã đăng nhập
    if (user) {
      console.log("AuthProvider: Auto-filling form with user data", user);

      setFormData((prevData) => ({
        ...prevData,
        // Chỉ điền nếu trường đó đang rỗng (để không ghi đè nếu user tự nhập)
        fullName: prevData.fullName || user.name || "",
        phone: prevData.phone || user.phone || "",
        email: prevData.email || user.email || "",

        // ✅ SỬA: Sử dụng user.gender và user.dateOfBirth từ User interface
        gender: prevData.gender || user.gender || "",

        // ✅ SỬA: Chuyển đổi string dateOfBirth từ user sang Date object
        dateOfBirth:
          prevData.dateOfBirth ||
          (user.dateOfBirth ? new Date(user.dateOfBirth) : null),
      }));
    }
  }, [user]); // <-- Dependency: Chạy lại khi 'user' thay đổi
  // --- KẾT THÚC EFFECT 3 ---

  // --- CÁC HÀM XỬ LÝ (HANDLERS) ---

  // (Giữ nguyên)
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // (Cập nhật validation)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{9,11}$/.test(formData.phone.replace(/\s/g, "")))
      newErrors.phone = "Phone number must be 9-11 digits";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (
      formData.email.trim() &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      newErrors.email = "Invalid email address";
    if (!formData.date) newErrors.date = "Date is required";
    if (
      formData.date &&
      formData.date < new Date(new Date().setHours(0, 0, 0, 0))
    )
      newErrors.date = "Date cannot be in the past";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.doctorId) newErrors.doctor = "Please choose a doctor";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // (VIẾT LẠI HOÀN TOÀN)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!formData.doctorId) {
      setErrors((prev) => ({ ...prev, doctor: "Invalid doctor selected." }));
      return;
    }

    // 2. Kiểm tra null (TypeScript-safe)
    if (!formData.date || !formData.dateOfBirth) {
      setSubmitStatus("error");
      setNotification("Date and Date of Birth must be selected.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    // 3. Tìm thông tin doctor để lấy Department
    const selectedDoctor = allDoctors.find(
      (doctor) => doctor.DoctorId === parseInt(formData.doctorId)
    );

    if (!selectedDoctor) {
      setErrors((prev) => ({ ...prev, doctor: "Selected doctor not found." }));
      return;
    }

    // 4. Tạo payload cho API
    const payload: BookingRequest = {
      DoctorId: parseInt(formData.doctorId), // Dùng ID
      //Department: selectedDoctor.Department, // Thêm Department
      FullName: formData.fullName,
      Phone: formData.phone,
      Email: formData.email,
      Date: formatDateForAPI(formData.date), // Dùng helper "YYYY-MM-DD"

      AppointHour: formData.time, // "HH:mm"
      Gender: formData.gender,
      DateOfBirth: formatDateForAPI(formData.dateOfBirth), // "YYYY-MM-DD"
      Symptom: formData.symptom,
    };

    // 5. Gọi API
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setNotification("");

    try {
      console.log("Dữ liệu gửi đi:", payload);
      await bookingApi.submitBooking(payload); // Gọi API thật

      setSubmitStatus("success");
      setFormData(initialFormData); // Reset form về trạng thái ban đầu

      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmitStatus("error");
      // Hiển thị lỗi từ server
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setNotification(errorMessage);

      setTimeout(() => {
        setSubmitStatus("idle");
        setNotification("");
      }, 5000); // Cho 5s để đọc lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (field: keyof FormData) => {
    let className = "input";
    if (errors[field]) className += " error";
    if (formData[field] && !errors[field]) className += " success";
    return className;
  };

  // --- THÊM HÀM MỚI ---
  /**
   * Kiểm tra xem một khung giờ (vd: "09:00") của một ngày
   * đã trôi qua so với thời gian hiện tại hay chưa.
   */
  const isTimeSlotPassed = (time: string, date: Date | null): boolean => {
    // Nếu không có ngày, hoặc ngày không phải là hôm nay, thì không phải "đã qua"
    if (!date) return false;

    const now = new Date();

    // So sánh ngày (bỏ qua giờ)
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (!isToday) {
      return false; // Nếu là ngày mai hoặc ngày hôm qua, không áp dụng logic "đã qua"
    }

    // Nếu là hôm nay, kiểm tra giờ
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0); // Đặt giờ của slot

      // So sánh với thời gian hiện tại
      // Nếu 9:01 > 9:00, thì slot "09:00" đã qua
      return now.getTime() > slotTime.getTime();
    } catch (e) {
      console.error("Error parsing time slot:", e);
      return false;
    }
  };
  // --- KẾT THÚC HÀM MỚI ---
  // --- RENDER (JSX) ---

  return (
    <section id="booking-section" className="booking-section">
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>Booking Here</h2>
          </div>
        </div>
        <div className="booking-card">
          <div className="booking-background">
            <div className="background-overlay"></div>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-columns">
              {/* === CỘT BÊN TRÁI === */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                    <input
                      id="fullName"
                      type="text"
                      className={getInputClass("fullName")}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Enter your full name"
                      value={formData.fullName}
                    />
                  </div>
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone number <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faPhone} className="input-icon" />
                    <input
                      id="phone"
                      type="tel"
                      className={getInputClass("phone")}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                      value={formData.phone}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      className={getInputClass("email")}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                      value={formData.email}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">
                    Date of birth <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="input-icon"
                    />
                    <DatePicker
                      id="dateOfBirth"
                      selected={formData.dateOfBirth}
                      onChange={(date) =>
                        handleInputChange("dateOfBirth", date)
                      }
                      className={getInputClass("dateOfBirth")}
                      dateFormat="dd/MM/yyyy"
                      maxDate={new Date()}
                      placeholderText="Select date of birth"
                      showYearDropdown
                      yearDropdownItemNumber={50}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <span className="error-message">{errors.dateOfBirth}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="gender">
                    Gender <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      className="input-icon"
                    />
                    <select
                      id="gender"
                      className={getInputClass("gender")}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      value={formData.gender}
                    >
                      <option value="">Select gender</option>
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.gender && (
                    <span className="error-message">{errors.gender}</span>
                  )}
                </div>
              </div>

              {/* === CỘT BÊN PHẢI === */}
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="date">
                    Appointment date <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="input-icon"
                    />
                    <DatePicker
                      id="date"
                      selected={formData.date}
                      onChange={(date) => handleInputChange("date", date)}
                      className={getInputClass("date")}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Select date"
                    />
                  </div>
                  {errors.date && (
                    <span className="error-message">{errors.date}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="doctor">
                    Choose doctor <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon icon={faUserMd} className="input-icon" />
                    <select
                      id="doctor"
                      className={getInputClass("doctorId")}
                      onChange={(e) => {
                        // THAY ĐỔI: Giữ nguyên value là string
                        handleInputChange("doctorId", e.target.value);
                        handleInputChange("time", ""); // Reset time
                      }}
                      value={formData.doctorId} // state bây giờ là string
                      disabled={isLoadingDoctors}
                    >
                      <option value="">
                        {" "}
                        {/* THAY ĐỔI: value mặc định là "" */}
                        {isLoadingDoctors
                          ? "Loading doctors..."
                          : "Select doctor"}
                      </option>

                      {allDoctors.map((doctor) => (
                        // THAY ĐỔI: value là ID (React sẽ tự chuyển sang string)
                        <option key={doctor.DoctorId} value={doctor.DoctorId}>
                          {doctor.Name} ({doctor.Department})
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.doctor && (
                    <span className="error-message">{errors.doctor}</span>
                  )}
                </div>

                {/* MỚI: Khối Lịch Bận (Time Slots) */}
                {formData.doctorId && (
                  <div className="form-group">
                    <label htmlFor="time">
                      <FontAwesomeIcon icon={faClock} /> Available Hours{" "}
                      <span className="required">*</span>
                    </label>
                    {isLoadingSlots && <div>Loading available slots...</div>}
                    {slotsError && (
                      <div className="status-message error">{slotsError}</div>
                    )}
                    {!isLoadingSlots && !slotsError && (
                      <div className="time-slots-grid">
                        {timeSlots.map((time) => {
                          const isBusy = fetchedBusySlots.includes(time);
                          // --- LOGIC MỚI ---
                          const isPassed = isTimeSlotPassed(
                            time,
                            formData.date
                          );
                          // --- KẾT THÚC LOGIC MỚI ---
                          return (
                            <div
                              key={time}
                              className={`time-slot ${
                                isPassed ? "passed" : isBusy ? "busy" : "free"
                              } ${formData.time === time ? "selected" : ""}`}
                              onClick={() => {
                                if (isPassed) {
                                  setNotification(
                                    "This time slot has already passed."
                                  );
                                  setTimeout(() => setNotification(""), 3000);
                                } else if (isBusy) {
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
                    )}
                    {errors.time && (
                      <span className="error-message">{errors.time}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="symptom">
                    <FontAwesomeIcon icon={faNotesMedical} /> Symptom (short)
                  </label>
                  <textarea
                    id="symptom"
                    className={`${getInputClass("symptom")} symptom-textarea`}
                    onChange={(e) =>
                      handleInputChange("symptom", e.target.value)
                    }
                    placeholder="Describe your symptoms..."
                    rows={8}
                    maxLength={500}
                    value={formData.symptom}
                  />
                  <div className="character-counter">
                    {formData.symptom.length}/500
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
                disabled={isSubmitting || isLoadingSlots || isLoadingDoctors}
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

          {/* Lỗi submit (ví dụ 400 bad request) sẽ hiển thị ở notification */}
          {submitStatus === "error" && notification && (
            <div className="status-message error">❌ {notification}</div>
          )}

          {/* Lỗi chọn slot (ví dụ "Slot bận") */}
          {!submitStatus && notification && (
            <div className="status-message warning">⚠️ {notification}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
