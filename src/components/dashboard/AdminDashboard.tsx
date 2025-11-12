import React, { useState } from "react";
import PatientManagement from "../admin/PatientManagement";
import DoctorManagement from "../admin/DoctorManagement";
import AdminScheduleView from "../admin/AdminScheduleView";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [view, setView] = useState("patients");

  return (
    <section className="appointment-management">
      <h1 className="admin-title">Owner Dashboard</h1>

      <div className="view-toggles">
        <button
          className={`view-toggle-button ${view === "doctors" ? "active" : ""}`}
          onClick={() => setView("doctors")}
        >
          Doctors
        </button>
        <button
          className={`view-toggle-button ${
            view === "patients" ? "active" : ""
          }`}
          onClick={() => setView("patients")}
        >
          Patients
        </button>

        <button
          className={`view-toggle-button ${
            view === "schedules" ? "active" : ""
          }`}
          onClick={() => setView("schedules")}
        >
          Schedules
        </button>
      </div>

      <div className="admin-content">
        {view === "doctors" && <DoctorManagement />}
        {view === "patients" && <PatientManagement />}
        {view === "schedules" && <AdminScheduleView />}
      </div>
    </section>
  );
};

export default AdminDashboard;
