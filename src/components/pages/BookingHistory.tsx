import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingHistory.css";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { api, MyHistoryResponse } from "../../services/api";
import { useNotification } from "../../contexts/NotificationContext";

interface Booking {
  id: number;
  patientName: string;
  doctorName: string;
  doctorPhone: string;
  department: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: "completed" | "scheduled" | "cancelled";
  symptom: string;
  prescription?: string;
}

const BookingHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "scheduled" | "cancelled"
  >("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // --- Helper function: Check if booking can be cancelled (24h policy) ---
  const canCancelBooking = (
    appointDate: Date,
    appointTime: string
  ): boolean => {
    // Combine date and time
    const [hours, minutes] = appointTime.split(":").map(Number);
    const appointmentDateTime = new Date(appointDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    // Calculate hours difference
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Must be at least 24 hours before appointment
    return diffHours >= 24;
  };

  // --- THÊM MỚI ---
  // Hàm helper để map Status từ API (vd: "Scheduled") sang Status của component
  const mapApiStatus = (apiStatus: string): Booking["status"] => {
    const lowerStatus = apiStatus.toLowerCase();
    switch (lowerStatus) {
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      case "scheduled": // API trả về "Scheduled"
        return "scheduled"; // Component dùng "scheduled"
      default:
        return "scheduled"; // Mặc định là scheduled
    }
  };

  // Hàm fetch history (reusable)
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiData = await api.getMyHistory();

      // Chuyển đổi dữ liệu từ API sang format component
      const formattedBookings: Booking[] = apiData.map((item, index) => ({
        id: item.AppointId,
        patientName: item.NamePatient,
        doctorName: item.NameDoctor,
        doctorPhone: item.PhoneDoctor,
        department: item.Department,
        appointmentDate: new Date(item.AppointDate),
        appointmentTime: item.AppointHour.substring(0, 5),
        status: mapApiStatus(item.Status),
        symptom: item.Symptoms,
        prescription:
          item.Prescription && item.Prescription.toLowerCase() !== "không có"
            ? item.Prescription
            : undefined,
      }));

      setBookings(formattedBookings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load booking history";
      setError(errorMessage);
      console.error("Error loading booking history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Cancel booking with 24h policy check
  const handleCancelBooking = async (
    appointId: number,
    appointDate: Date,
    appointTime: string,
    doctorName: string
  ) => {
    // ✅ CHECK 24H POLICY FIRST
    if (!canCancelBooking(appointDate, appointTime)) {
      showNotification(
        "warning",
        "Cannot Cancel Appointment",
        "Appointments can only be cancelled at least 24 hours in advance. Please contact the clinic directly for urgent changes.",
        6000
      );
      return;
    }

    // Confirm with user
    const appointmentInfo = `${appointDate.toLocaleDateString(
      "en-GB"
    )} at ${appointTime} with Dr. ${doctorName}`;
    if (
      !window.confirm(
        `Are you sure you want to cancel this appointment?\n\n${appointmentInfo}\n\nNote: Cancellations must be made at least 24 hours before the scheduled time.`
      )
    ) {
      return;
    }

    try {
      // Call API to cancel (PUT /api/Patients/CancelAppointment?appointId={appointId})
      const response = await api.cancelBooking(appointId);

      // Show success notification with message from API
      showNotification(
        "success",
        "Appointment Cancelled",
        response.message || "Your appointment has been successfully cancelled.",
        4000
      );

      // Refresh booking list
      fetchHistory();
    } catch (err) {
      // Handle error with detailed message
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to cancel appointment. Please try again.";

      showNotification("error", "Cancellation Failed", errorMessage, 5000);
      console.error("Error cancelling booking:", err);
    }
  };

  // Dùng useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchHistory();
  }, []);
  // --- KẾT THÚC THÊM MỚI ---

  // Redirect if not patient
  if (!isAuthenticated || user?.userType !== "patient") {
    return <Navigate to="/" replace />;
  }

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return faCheckCircle;
      case "scheduled":
        return faHourglassHalf;
      case "cancelled":
        return faTimesCircle;
      default:
        return faCalendarAlt;
    }
  };

  const getStatusClass = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "scheduled":
        return "status-scheduled";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const goToPreviousDay = () => {
    const currentDate = selectedDate || new Date();
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const currentDate = selectedDate || new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      const matchesDate =
        !selectedDate ||
        booking.appointmentDate.toDateString() === selectedDate.toDateString();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sort by appointment date (newest first)
      return b.appointmentDate.getTime() - a.appointmentDate.getTime();
    });

  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === "completed").length,
    scheduled: bookings.filter((b) => b.status === "scheduled").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <section className="appointment-management">
      <h1 className="admin-title">Booking History</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state">
          <p>Loading booking history...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <div className="admin-table-container">
          {/* Statistics Cards */}
          <div className="stats-overview">
            <div className="stat-card total">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="stat-info">
                <h3>{stats.completed}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faHourglassHalf} />
              </div>
              <div className="stat-info">
                <h3>{stats.scheduled}</h3>
                <p>Scheduled</p>
              </div>
            </div>
            <div className="stat-card cancelled">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="stat-info">
                <h3>{stats.cancelled}</h3>
                <p>Cancelled</p>
              </div>
            </div>
          </div>

          <div className="appointment">
            {/* Filters */}
            <div className="appointment-controls">
              <div className="search-container">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filter-controls">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as
                        | "all"
                        | "completed"
                        | "scheduled"
                        | "cancelled"
                    )
                  }
                  className="status-filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                    placeholderText="Select date"
                    isClearable
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

            {/* Booking Table */}
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Doctor Phone</th>
                  <th>Department</th>
                  <th>Appointment Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Symptom</th>
                  <th>Prescription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="no-data-cell">
                      <div className="no-data">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="no-data-icon"
                        />
                        <h3>No bookings found</h3>
                        <p>Try adjusting your filters or search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => {
                    const canCancel = canCancelBooking(
                      booking.appointmentDate,
                      booking.appointmentTime
                    );
                    const isCancellable =
                      booking.status === "scheduled" && canCancel;

                    return (
                      <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.patientName}</td>
                        <td>{booking.doctorName}</td>
                        <td>{booking.doctorPhone}</td>
                        <td>{booking.department}</td>
                        <td>
                          {booking.appointmentDate.toLocaleDateString("en-GB")}
                        </td>
                        <td>{booking.appointmentTime}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              booking.status === "completed"
                                ? "verified"
                                : booking.status === "scheduled"
                                ? "scheduled"
                                : "unverified"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </td>
                        <td>{booking.symptom}</td>
                        <td>{booking.prescription || "-"}</td>
                        <td>
                          {booking.status === "scheduled" ? (
                            <button
                              className={`action-btn cancel-btn ${
                                !isCancellable ? "disabled" : ""
                              }`}
                              onClick={() =>
                                handleCancelBooking(
                                  booking.id,
                                  booking.appointmentDate,
                                  booking.appointmentTime,
                                  booking.doctorName
                                )
                              }
                              disabled={!isCancellable}
                              title={
                                isCancellable
                                  ? "Cancel this appointment"
                                  : "Cannot cancel: Must be at least 24 hours before appointment"
                              }
                            >
                              <FontAwesomeIcon icon={faBan} />
                              Cancel
                            </button>
                          ) : (
                            <span className="no-action">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingHistory;
