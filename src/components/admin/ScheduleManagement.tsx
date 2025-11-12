import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTrash,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import scheduleApi from "../../services/api/schedule.api";
import type { Schedule } from "../../types";
import { useNotification } from "../../contexts/NotificationContext";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { exportSchedulesToExcel } from "../../utils/excelExport";

const ScheduleManagement = () => {
  const { showNotification } = useNotification();

  // State: dùng Schedule từ API
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // State loading và error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Hàm fetch data - ADMIN: Lấy tất cả lịch của tất cả bác sĩ
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // THAY ĐỔI: Dùng getAllSchedulesForAdmin thay vì getAllSchedules
      // Admin xem tất cả lịch, không filter theo doctor hay date ở API
      const data = await scheduleApi.getAllSchedulesForAdmin();
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

  // Handle Delete Schedule
  const handleDelete = async (
    scheduleId: number,
    doctorName: string | undefined,
    workDate: string
  ) => {
    // Confirmation dialog
    const confirmMessage = `Are you sure you want to delete this schedule?\n\nDoctor: ${
      doctorName || `ID ${scheduleId}`
    }\nDate: ${new Date(workDate).toLocaleDateString(
      "en-GB"
    )}\n\nThis action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(scheduleId);
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      showNotification("success", "Success", "Schedule deleted successfully");
      // Refresh table
      await fetchSchedules();
    } catch (err: any) {
      console.error("Delete error:", err);
      showNotification(
        "error",
        "Delete Failed",
        err.message || "Failed to delete schedule. Please try again."
      );
    } finally {
      setIsDeleting(null);
    }
  };

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

  // Pagination hook
  const pagination = usePagination(filteredSchedules, 10);

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Hiển thị loading */}
            {isLoading && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}
            {/* Hiển thị lỗi */}
            {error && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "red" }}>
                  {error}
                </td>
              </tr>
            )}
            {/* Hiển thị dữ liệu với pagination */}
            {!isLoading &&
              !error &&
              pagination.currentItems.length > 0 &&
              pagination.currentItems.map((schedule, index) => (
                <tr
                  key={`${schedule.ScheduleId}-${schedule.DoctorId}-${schedule.WorkDate}`}
                >
                  <td>{pagination.startIndex + index}</td>
                  <td>
                    {schedule.DoctorName || `Doctor ID: ${schedule.DoctorId}`}
                  </td>
                  <td>
                    {new Date(schedule.WorkDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>{formatTime(schedule.StartTime)}</td>
                  <td>{formatTime(schedule.EndTime)}</td>
                  <td>
                    <span
                      className={`status-${schedule.Status?.toLowerCase()}`}
                    >
                      {schedule.Status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="delete-icon"
                      onClick={() => {
                        if (schedule.ScheduleId) {
                          handleDelete(
                            schedule.ScheduleId,
                            schedule.DoctorName,
                            schedule.WorkDate
                          );
                        }
                      }}
                      disabled={
                        isDeleting === schedule.ScheduleId ||
                        !schedule.ScheduleId
                      }
                      title={
                        schedule.ScheduleId
                          ? "Delete Schedule"
                          : "Schedule ID missing"
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor:
                          isDeleting === schedule.ScheduleId ||
                          !schedule.ScheduleId
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          isDeleting === schedule.ScheduleId ||
                          !schedule.ScheduleId
                            ? 0.5
                            : 1,
                        fontSize: "1.1rem",
                        color: "#dc2626",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          isDeleting !== schedule.ScheduleId &&
                          schedule.ScheduleId
                        ) {
                          e.currentTarget.style.color = "#991b1b";
                          e.currentTarget.style.transform = "scale(1.15)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#dc2626";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        spin={isDeleting === schedule.ScheduleId}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            {/* Hiển thị khi không có dữ liệu sau khi filter */}
            {!isLoading && !error && filteredSchedules.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  No schedules found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Export & Pagination Section */}
        <div className="table-footer-controls">
          {/* Export Excel Button - Left */}
          <button
            className="export-btn"
            onClick={() =>
              exportSchedulesToExcel(filteredSchedules, "lich_lam_viec")
            }
            title="Export to Excel"
            disabled={filteredSchedules.length === 0}
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
          </button>

          {/* Pagination Component - Right */}
          <div className="pagination-wrapper">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPreviousPage={pagination.goToPreviousPage}
              onNextPage={pagination.goToNextPage}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              itemName="schedules"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
