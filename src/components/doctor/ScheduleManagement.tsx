import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DoctorSchedule.css";
// --- THAY ĐỔI: Import thêm Doctor và ScheduleResponseItem (từ file api.ts) ---
import { api, Doctor, ScheduleResponseItem } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

// --- XÓA INTERFACE NÀY (Vì ScheduleResponseItem trong api.ts đã đúng) ---
// interface DoctorScheduleSlot { ... }

const ScheduleManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  // --- THAY ĐỔI: Dùng type ScheduleResponseItem từ api.ts ---
  const [busySlots, setBusySlots] = useState<ScheduleResponseItem[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const { user } = useAuth();

  // --- THÊM MỚI: State để lưu DoctorId tìm được ---
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  // --- EFFECT 1: Chạy khi USER thay đổi, để tìm DoctorId ---
  useEffect(() => {
    // Chỉ chạy nếu có user đăng nhập
    if (user && user.id) {
      const findDoctorId = async () => {
        try {
          // 1. Lấy UserId (dạng số) từ AuthContext
          const currentUserId = Number(user.id);
          if (Number.isNaN(currentUserId)) {
            console.error("User ID không hợp lệ:", user.id);
            setCurrentDoctorId(null);
            return;
          }

          // 2. Gọi API lấy tất cả bác sĩ
          const allDoctors = await api.getDoctors();

          // 3. Tìm bác sĩ khớp với UserId
          const matchingDoctor = allDoctors.find(
            (doc) => doc.UserId === currentUserId
          );

          // 4. Lưu DoctorId (nếu tìm thấy)
          if (matchingDoctor) {
            setCurrentDoctorId(matchingDoctor.DoctorId);
          } else {
            console.error("User đã đăng nhập không có trong danh sách bác sĩ.");
            setCurrentDoctorId(null);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách bác sĩ:", error);
          setCurrentDoctorId(null);
        }
      };

      findDoctorId();
    } else {
      // Nếu user đăng xuất
      setCurrentDoctorId(null);
    }
  }, [user]); // Phụ thuộc vào 'user'

  // --- EFFECT 2: Chạy khi NGÀY hoặc BÁC SĨ (currentDoctorId) thay đổi ---
  useEffect(() => {
    // Chỉ chạy khi có ngày VÀ đã tìm thấy DoctorId
    if (selectedDate && currentDoctorId) {
      const fetchSchedule = async () => {
        setIsLoadingSchedule(true);
        try {
          const data = await api.getDoctorSchedule(
            currentDoctorId, // <-- Đã dùng DoctorId (number)
            selectedDate
          );
          setBusySlots(data); // <-- Dùng type từ api.ts
        } catch (error) {
          console.error("Failed to fetch doctor schedule:", error);
          setBusySlots([]);
        }
        setIsLoadingSchedule(false);
      };

      fetchSchedule();
    } else {
      // Nếu không chọn ngày hoặc không có DoctorId, dọn dẹp lịch
      setBusySlots([]);
    }
  }, [selectedDate, currentDoctorId]); // <-- Phụ thuộc vào 'selectedDate' và 'currentDoctorId'

  // ... (Các hàm handleDateChange, handlePrevDay, handleNextDay giữ nguyên) ...
  const handleDateChange = (date: Date | null) => {
    // Vẫn còn Vấn đề 2 ở đây (if date)
    if (date) {
      setSelectedDate(date);
    }
  };

  const handlePrevDay = () => {
    if (selectedDate) {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(selectedDate.getDate() - 1);
      setSelectedDate(prevDay);
    }
  };

  const handleNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      setSelectedDate(nextDay);
    }
  };

  return (
    <div className="schedule-management-container">
      {/* ... (JSX cho Date Navigation giữ nguyên) ... */}
      <div className="appointment-controls">
        <div className="search-container" style={{ visibility: "hidden" }}>
          {/* Placeholder */}
        </div>

        <div className="date-navigation">
          <button
            className="date-nav-btn"
            onClick={handlePrevDay}
            title="Previous Day"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className="date-picker">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              className="date-picker-input"
            />
          </div>
          <button
            className="date-nav-btn"
            onClick={handleNextDay}
            title="Next Day"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>

      {/* Schedule View */}
      <div className="schedule-view">
        {isLoadingSchedule ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading schedule...
          </div>
        ) : (
          <div className="time-slot-schedule">
            {/* Morning Section */}
            <div>
              <h3 className="time-slots-section-title">Morning Schedule</h3>
              <div className="time-slots-section">
                {timeSlots.slice(0, 8).map((time) => {
                  const matchingSlot = busySlots.find((slot) =>
                    slot.AppointHour.startsWith(time)
                  );

                  // Vẫn còn Vấn đề 4 ở đây (type 'waiting')
                  let statusClass: "free" | "busy" | "cancelled" | "scheduled" =
                    "free";
                  if (matchingSlot) {
                    if (matchingSlot.Status === "Scheduled") {
                      statusClass = "scheduled";
                    } else if (matchingSlot.Status === "Completed") {
                      statusClass = "busy";
                    } else if (matchingSlot.Status === "Cancelled") {
                      statusClass = "cancelled";
                    }
                  }

                  return (
                    <div key={time} className={`time-slot ${statusClass}`}>
                      <div className="time">{time}</div>
                      {/* Đã sửa logic hiển thị 'cancelled' (từ lần trước) */}
                      {matchingSlot && statusClass !== "free" && (
                        <div className="patient-info">
                          <div className="patient-name">
                            {matchingSlot.Name}
                          </div>
                          <div>{matchingSlot.Phone}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Afternoon Section */}
            <div>
              <h3 className="time-slots-section-title">Afternoon Schedule</h3>
              <div className="time-slots-section">
                {timeSlots.slice(8).map((time) => {
                  const matchingSlot = busySlots.find((slot) =>
                    slot.AppointHour.startsWith(time)
                  );

                  // Vẫn còn Vấn đề 4 ở đây (type 'waiting')
                  let statusClass:
                    | "free"
                    | "waiting"
                    | "busy"
                    | "cancelled"
                    | "scheduled" = "free";
                  if (matchingSlot) {
                    if (matchingSlot.Status === "Scheduled") {
                      statusClass = "scheduled";
                    } else if (matchingSlot.Status === "Completed") {
                      statusClass = "busy";
                    } else if (matchingSlot.Status === "Cancelled") {
                      statusClass = "cancelled";
                    }
                  }

                  return (
                    <div key={time} className={`time-slot ${statusClass}`}>
                      <div className="time">{time}</div>
                      {/* Đã sửa logic hiển thị 'cancelled' (từ lần trước) */}
                      {matchingSlot && statusClass !== "free" && (
                        <div className="patient-info">
                          <div className="patient-name">
                            {matchingSlot.Name}
                          </div>
                          <div>{matchingSlot.Phone}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;
