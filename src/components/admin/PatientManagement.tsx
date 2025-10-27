import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api, Patient, formatDateForAPI } from "../../services/api"; // <-- Import API

// (Component Loading/Error có thể thêm vào đây)
const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "2rem" }}>
    Loading patients...
  </div>
);

const PatientManagement: React.FC = () => {
  // State cho dữ liệu
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho bộ lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // <-- Sửa: Bắt đầu là null
  const [selectedStatus, setSelectedStatus] = useState(""); // <-- Thêm: Bộ lọc status

  // Hàm fetch data chính
  const fetchPatients = async (
    name: string,
    date: Date | null,
    status: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Chuyển đổi Date object thành string "YYYY-MM-DD"
      const formattedDate = date ? formatDateForAPI(date) : "";

      const data = await api.getPatients(name, formattedDate, status);
      setPatients(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch patients.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API khi component mount và khi bộ lọc thay đổi
  useEffect(() => {
    // Sử dụng debounce để tránh gọi API liên tục khi gõ search
    const timerId = setTimeout(() => {
      fetchPatients(searchQuery, selectedDate, selectedStatus);
    }, 500); // <-- Chờ 500ms sau khi gõ xong

    return () => clearTimeout(timerId); // Hủy timer nếu user gõ tiếp
  }, [searchQuery, selectedDate, selectedStatus]);

  // Các hàm điều khiển (giữ nguyên)
  const goToPreviousDay = () => {
    const date = selectedDate || new Date(); // Bắt đầu từ hôm nay nếu null
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const date = selectedDate || new Date(); // Bắt đầu từ hôm nay nếu null
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const getStatusClass = (status: Patient["Status"]) => {
    switch (status) {
      case "Completed":
        return "verified";
      case "Scheduled":
        return "pending";
      case "Cancelled":
        return "unverified";
      default:
        return "";
    }
  };

  return (
    <div className="admin-table-container">
      {/* (Phần SVG title của bạn) */}
      <div className="section-header">
        <div className="section-title">
          <svg
            data-prefix="fas"
            data-icon="plus"
            className="svg-inline--fa fa-plus title-icon"
            role="img"
            viewBox="0 0 448 512"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"
            ></path>
          </svg>
          <h2>Patient Management</h2>
        </div>
      </div>

      <div className="appointment">
        <div className="appointment-controls">
          {/* Search Bar (Giữ nguyên) */}
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by patient name or phone..."
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>

          {/* Date Navigation (Giữ nguyên) */}
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
                placeholderText="All Dates" // <-- Sửa
                isClearable // Cho phép xóa
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

          {/* THÊM: Bộ lọc Status */}
          <div className="status-filter">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="search-input" // Tận dụng class cũ
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bảng Dữ liệu */}
        <table className="appointments-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Symptom</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center", color: "red" }}>
                  {error}
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              patients.length > 0 &&
              patients.map((patient, index) => (
                <tr key={patient.Username}>
                  {" "}
                  {/* Dùng Username hoặc key duy nhất */}
                  <td>{index + 1}</td>
                  {/* SỬA: Dùng đúng tên thuộc tính (viết hoa) */}
                  <td>{patient.FullName}</td>
                  <td>{patient.Username}</td>
                  <td>
                    {new Date(patient.DateOfBirth).toLocaleDateString("en-GB")}
                  </td>
                  <td>{patient.Gender}</td>
                  <td>{patient.PhoneNumber}</td>
                  <td>{patient.Email || "N/A"}</td>
                  {/* SỬA: Đổi thứ tự 2 cột này */}
                  <td>{patient.Address}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        patient.Status
                      )}`}
                    >
                      {patient.Status}
                    </span>
                  </td>
                  <td>{patient.Symptoms}</td>
                  <td>{patient.Prescription}</td>
                </tr>
              ))}
            {/* {!isLoading && !error && patients.length === 0 && (
              <tr>
                <td colSpan={11} style={{ textAlign: "center" }}>
                  No patients found.
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientManagement;
