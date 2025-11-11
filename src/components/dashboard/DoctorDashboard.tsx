import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ScheduleManagement, AppointmentTable } from "../doctor";
import "../doctor/DoctorSchedule.css";

const DoctorDashboard: React.FC = () => {
  const [view, setView] = useState<"schedule" | "appointment">("schedule");

  return (
    <section className="appointment-management">
      <div className="container">
        {/* View Toggle Buttons */}
        <div className="view-toggle">
          <button
            className={`view-toggle-button ${
              view === "schedule" ? "active" : ""
            }`}
            onClick={() => setView("schedule")}
          >
            <FontAwesomeIcon icon={faCalendar} />
            Schedule Management
          </button>
          <button
            className={`view-toggle-button ${
              view === "appointment" ? "active" : ""
            }`}
            onClick={() => setView("appointment")}
          >
            <FontAwesomeIcon icon={faUsers} />
            Appointment Management
          </button>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <div className="section-title">
            <FontAwesomeIcon icon={faPlus} className="title-icon" />
            <h2>
              {view === "schedule"
                ? "My Work Schedule"
                : "Appointment Management"}
            </h2>
          </div>
        </div>

        {/* Content */}
        {view === "schedule" ? <ScheduleManagement /> : <AppointmentTable />}
      </div>
    </section>
  );
};

export default DoctorDashboard;
