import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Import từ API service
import { api, Schedule } from "../../services/api";

// Bỏ interface cũ và mock data
// interface Schedule { ... }
// const mockSchedules: Schedule[] = [ ... ];

const ScheduleManagement = () => {
  // State: dùng Schedule từ API
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // State loading và error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm fetch data - ADMIN: Lấy tất cả lịch của tất cả bác sĩ
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // THAY ĐỔI: Dùng getAllSchedulesForAdmin thay vì getAllSchedules
      // Admin xem tất cả lịch, không filter theo doctor hay date ở API
      const data = await api.getAllSchedulesForAdmin();
      setSchedules(data);
    } catch (err: any) {
      setError(err.message || "Failed to load schedules.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Hàm này không thay đổi dependency

  // Gọi API khi component mount (chỉ 1 lần)
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Client-side filtering
  const filteredSchedules = schedules.filter((schedule) => {
    // Filter by doctor name
    if (searchQuery && schedule.DoctorName) {
      const nameMatch = schedule.DoctorName.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
      if (!nameMatch) return false;
    }

    // Filter by date
    if (selectedDate) {
      const scheduleDate = new Date(schedule.WorkDate).toDateString();
      const filterDate = selectedDate.toDateString();
      if (scheduleDate !== filterDate) return false;
    }

    // Filter active only
    return schedule.IsActive === true;
  });

  // Bỏ hàm handleDelete (nếu không cần)
  /*
  const handleDelete = (id: number) => {
    // ... logic gọi API xóa schedule
  };
  */

  // Date navigation (Giữ nguyên)
  const goToPreviousDay = () => {
    const date = selectedDate || new Date();
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const date = selectedDate || new Date();
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Helper định dạng giờ HH:mm (bỏ giây)
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "N/A";
    try {
      return timeString.substring(0, 5); // Lấy HH:mm
    } catch {
      return timeString;
    }
  };

  return (
    <div className="admin-table-container">
      {/* Header */}
      <div className="section-header">
        <div className="section-title">
          <svg
            data-prefix="fas"
            data-icon="plus"
            className="svg-inline--fa fa-plus title-icon"
            role="img"
            viewBox="0 0 448 512"
            aria-hidden="true"
            style={{ width: "1em", marginRight: "0.5rem" }}
          >
            <path
              fill="currentColor"
              d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
            ></path>
          </svg>
          <h2>Schedule Management</h2>
        </div>
      </div>
      <div className="appointment">
        {/* Controls */}
        <div className="appointment-controls">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by doctor name..."
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>
          <div className="date-navigation">
            <button
              className="date-nav-btn"
              onClick={goToPreviousDay}
              title="Previous Day"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="date-picker">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                placeholderText="Select date" // Hoặc "All Dates" nếu API hỗ trợ date rỗng
                isClearable // Cho phép xóa ngày
              />
            </div>
            <button
              className="date-nav-btn"
              onClick={goToNextDay}
              title="Next Day"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
        {/* Bảng Dữ liệu */}
        <table className="appointments-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Doctor</th>
              <th>Work Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {/* Hiển thị loading */}
            {isLoading && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}
            {/* Hiển thị lỗi */}
            {error && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "red" }}>
                  {error}
                </td>
              </tr>
            )}
            {/* Hiển thị dữ liệu */}
            {!isLoading &&
              !error &&
              filteredSchedules.length > 0 &&
              filteredSchedules.map((schedule, index) => (
                <tr
                  key={`${schedule.ScheduleId}-${schedule.DoctorId}-${schedule.WorkDate}`}
                >
                  <td>{index + 1}</td>
                  {/* Dùng đúng tên trường từ API */}
                  <td>
                    {schedule.DoctorName || `Doctor ID: ${schedule.DoctorId}`}
                  </td>
                  <td>
                    {new Date(schedule.WorkDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>{formatTime(schedule.StartTime)}</td>
                  <td>{formatTime(schedule.EndTime)}</td>
                  <td>
                    {/* Hiển thị status từ API, có thể thêm class CSS */}
                    <span
                      className={`status-${schedule.Status?.toLowerCase()}`}
                    >
                      {schedule.Status}
                    </span>
                  </td>
                  {/*
                <td className="action-buttons">
                   <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => handleDelete(schedule.ScheduleId)} />
                </td>
                */}
                </tr>
              ))}
            {/* Hiển thị khi không có dữ liệu sau khi filter */}
            {!isLoading && !error && filteredSchedules.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No schedules found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManagement;
