import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingHistory.css";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface Booking {
  id: number;
  patientName: string;
  doctorName: string;
  doctorPhone: string;
  department: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: string;
  symptom: string;
  prescription?: string;
}

const mockBookings: Booking[] = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    doctorName: "Dr. Nguyễn Văn A",
    doctorPhone: "0123456789",
    department: "Cardiology",
    appointmentDate: new Date("2025-10-06"),
    appointmentTime: "09:00",
    status: "completed",
    symptom: "Chest pain, difficulty breathing",
    prescription: "Aspirin 100mg, Atorvastatin 20mg",
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    doctorName: "Dr. Trần Thị B",
    doctorPhone: "0987654321",
    department: "Dermatology",
    appointmentDate: new Date("2025-10-15"),
    appointmentTime: "14:30",
    status: "pending",
    symptom: "Skin rash, itching",
  },
  {
    id: 3,
    patientName: "Lê Minh C",
    doctorName: "Dr. Lê Minh C",
    doctorPhone: "0123456789",
    department: "Pediatrics",
    appointmentDate: new Date("2025-09-28"),
    appointmentTime: "10:00",
    status: "cancelled",
    symptom: "Fever, cough",
  },
  {
    id: 4,
    patientName: "Phạm Thu D",
    doctorName: "Dr. Phạm Thu D",
    doctorPhone: "0123456789",
    department: "Neurology",
    appointmentDate: new Date("2025-10-20"),
    appointmentTime: "11:00",
    status: "pending",
    symptom: "Headache, dizziness",
  },
  {
    id: 5,
    patientName: "Hoàng Văn E",
    doctorName: "Dr. Hoàng Văn E",
    doctorPhone: "0123456789",
    department: "Orthopedics",
    appointmentDate: new Date("2025-09-15"),
    appointmentTime: "15:30",
    status: "completed",
    symptom: "Back pain, muscle strain",
    prescription: "Diclofenac 50mg, Physical therapy sessions",
  },
];

const BookingHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending" | "cancelled"
  >("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Redirect if not patient
  if (!isAuthenticated || user?.userType !== "patient") {
    return <Navigate to="/" replace />;
  }

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return faCheckCircle;
      case "pending":
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
      case "pending":
        return "status-pending";
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
    if (selectedDate) {
      const previousDay = new Date(selectedDate);
      previousDay.setDate(previousDay.getDate() - 1);
      setSelectedDate(previousDay);
    }
  };

  const goToNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setSelectedDate(nextDay);
    }
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
        new Date(booking.appointmentDate).toDateString() ===
          selectedDate.toDateString();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sort by appointment date (newest first)
      return (
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime()
      );
    });

  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === "completed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <section className="appointment-management">
      <h1 className="admin-title">Booking History</h1>

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
              <h3>{stats.pending}</h3>
              <p>Pending</p>
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
                      | "pending"
                      | "cancelled"
                  )
                }
                className="status-filter-select"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
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
          {filteredBookings.length === 0 ? (
            <div className="no-data">
              <FontAwesomeIcon icon={faCalendarAlt} className="no-data-icon" />
              <h3>No bookings found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
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
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
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
                            : booking.status === "pending"
                            ? "pending"
                            : "unverified"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td>{booking.symptom}</td>
                    <td>{booking.prescription || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingHistory;
