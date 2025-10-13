import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Schedule {
  id: number;
  doctor: string;
  gender: string;
  phone: string;
  email: string;
  workDate: string;
  start: string;
  end: string;
  status?: "available" | "unavailable";
}

const mockSchedules: Schedule[] = [
  {
    id: 1,
    doctor: "Dr. Nguyễn Văn B",
    gender: "Male",
    phone: "0988888888",
    email: "doctorb@example.com",
    workDate: "2025-10-10",
    start: "08:00",
    end: "17:00",
    status: "available",
  },
  {
    id: 2,
    doctor: "Dr. Trần Thị C",
    gender: "Female",
    phone: "0911222333",
    email: "doctorc@example.com",
    workDate: "2025-10-11",
    start: "09:00",
    end: "16:00",
    status: "unavailable",
  },
];

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    }
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

  return (
    <div className="admin-table-container">
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
          <h2>Schedule Management</h2>
        </div>
      </div>
      <div className="appointment">
        <div className="appointment-controls">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by doctor name, email, or phone..."
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
            {schedules
              .filter((schedule) => {
                const matchesSearch =
                  schedule.doctor
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  schedule.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  schedule.phone.includes(searchQuery);

                const matchesDate =
                  !selectedDate ||
                  new Date(schedule.workDate).toDateString() ===
                    selectedDate.toDateString();

                return matchesSearch && matchesDate;
              })
              .map((schedule, index) => (
                <tr key={schedule.id}>
                  <td>{index + 1}</td>
                  <td>{schedule.doctor}</td>
                  <td>{schedule.workDate}</td>
                  <td>{schedule.start}</td>
                  <td>{schedule.end}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        schedule.status === "available"
                          ? "verified"
                          : "unverified"
                      }`}
                    >
                      {schedule.status === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDelete(schedule.id)}
                      title="Delete Schedule"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManagement;
