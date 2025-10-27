import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUsers,
  faPlus,
  faPencil,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AppointmentManagement.css";

// Types
interface Appointment {
  id: number;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  symptom: string;
  prescription: string;
  status: "pending" | "completed" | "cancelled";
  time?: string;
}

interface TableRowProps {
  appointment: Appointment;
  onEdit: (
    id: number,
    field: "symptom" | "prescription",
    value: string
  ) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Appointment["status"]) => void;
}

// Table Row Component
const TableRow: React.FC<TableRowProps> = ({
  appointment,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isEditingSymptom, setIsEditingSymptom] = useState(false);
  const [isEditingPrescription, setIsEditingPrescription] = useState(false);
  const [tempSymptom, setTempSymptom] = useState(appointment.symptom);
  const [tempPrescription, setTempPrescription] = useState(
    appointment.prescription
  );

  const handleEditSave = (
    field: "symptom" | "prescription",
    value: string,
    setEditing: (value: boolean) => void
  ) => {
    onEdit(appointment.id, field, value);
    setEditing(false);
  };

  return (
    <tr>
      <td>{appointment.fullName}</td>
      <td>{appointment.dateOfBirth.toLocaleDateString()}</td>
      <td>{appointment.gender}</td>
      <td>{appointment.phone}</td>
      <td>
        <div className="editable-field">
          {isEditingSymptom ? (
            <>
              <input
                type="text"
                value={tempSymptom}
                onChange={(e) => setTempSymptom(e.target.value)}
                onBlur={() =>
                  handleEditSave("symptom", tempSymptom, setIsEditingSymptom)
                }
                autoFocus
              />
            </>
          ) : (
            <>
              {appointment.symptom}
              <FontAwesomeIcon
                icon={faPencil}
                className="edit-icon"
                onClick={() => setIsEditingSymptom(true)}
              />
            </>
          )}
        </div>
      </td>
      <td>
        <div className="editable-field">
          {isEditingPrescription ? (
            <>
              <input
                type="text"
                value={tempPrescription}
                onChange={(e) => setTempPrescription(e.target.value)}
                onBlur={() =>
                  handleEditSave(
                    "prescription",
                    tempPrescription,
                    setIsEditingPrescription
                  )
                }
                autoFocus
              />
            </>
          ) : (
            <>
              {appointment.prescription}
              <FontAwesomeIcon
                icon={faPencil}
                className="edit-icon"
                onClick={() => setIsEditingPrescription(true)}
              />
            </>
          )}
        </div>
      </td>
      <td>
        {appointment.status === "completed" && (
          <FontAwesomeIcon
            icon={faCheck}
            className="status-icon status-completed"
          />
        )}
        {appointment.status === "cancelled" && (
          <FontAwesomeIcon
            icon={faTimes}
            className="status-icon status-cancelled"
          />
        )}
      </td>
      <td>
        <FontAwesomeIcon
          icon={faTrash}
          className="delete-icon"
          onClick={() => onDelete(appointment.id)}
        />
      </td>
    </tr>
  );
};

// Mock Data
const mockAppointments: Appointment[] = [
  {
    id: 1,
    fullName: "John Doe",
    dateOfBirth: new Date("1990-05-15"),
    gender: "Male",
    phone: "0123456789",
    symptom: "Headache and fever",
    prescription: "Paracetamol 500mg",
    status: "completed",
    time: "09:00",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    dateOfBirth: new Date("1985-08-22"),
    gender: "Female",
    phone: "0987654321",
    symptom: "Sore throat",
    prescription: "Amoxicillin 250mg",
    status: "pending",
    time: "10:30",
  },
  {
    id: 3,
    fullName: "Mike Johnson",
    dateOfBirth: new Date("1978-12-03"),
    gender: "Male",
    phone: "0123498765",
    symptom: "Back pain",
    prescription: "Ibuprofen 400mg",
    status: "cancelled",
    time: "14:00",
  },
];

const AppointmentManagement: React.FC = () => {
  const [view, setView] = useState<"schedule" | "appointment">("appointment");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");

  // Available time slots
  const timeSlots = [
    // Morning slots (8 slots)
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    // Afternoon slots (8 slots)
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const handleEdit = (
    id: number,
    field: "symptom" | "prescription",
    value: string
  ) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [field]: value } : app))
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    }
  };

  const handleStatusChange = (id: number, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

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
                ? "Schedule Management"
                : "Appointment Management"}
            </h2>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="appointment-controls">
          {view === "appointment" && (
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
          )}
          <div className="date-picker">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              className="date-picker"
            />
          </div>
        </div>
        {view === "appointment" && (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Symptom</th>
                <th>Prescription</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments
                .filter(
                  (appointment) =>
                    appointment.fullName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    appointment.phone.includes(searchQuery)
                )
                .map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </tbody>
          </table>
        )}

        {/* Schedule View */}
        {view === "schedule" && (
          <div className="schedule-view">
            <div className="time-slot-schedule">
              {/* Morning Section */}
              <div>
                <h3 className="time-slots-section-title">Morning Schedule</h3>
                <div className="time-slots-section">
                  {timeSlots.slice(0, 8).map((time) => {
                    const matchingAppointment = appointments.find(
                      (app) =>
                        app.time === time &&
                        selectedDate?.toDateString() ===
                          new Date().toDateString()
                    );
                    let status: "free" | "waiting" | "busy" = "free";
                    if (matchingAppointment) {
                      status =
                        matchingAppointment.status === "pending"
                          ? "waiting"
                          : matchingAppointment.status === "completed"
                          ? "busy"
                          : "free";
                    }
                    return (
                      <div key={time} className={`time-slot ${status}`}>
                        <div className="time">{time}</div>
                        {matchingAppointment && (
                          <div className="patient-info">
                            <div className="patient-name">
                              {matchingAppointment.fullName}
                            </div>
                            <div>{matchingAppointment.phone}</div>
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
                    const matchingAppointment = appointments.find(
                      (app) =>
                        app.time === time &&
                        selectedDate?.toDateString() ===
                          new Date().toDateString()
                    );
                    let status: "free" | "waiting" | "busy" = "free";
                    if (matchingAppointment) {
                      status =
                        matchingAppointment.status === "pending"
                          ? "waiting"
                          : matchingAppointment.status === "completed"
                          ? "busy"
                          : "free";
                    }
                    return (
                      <div key={time} className={`time-slot ${status}`}>
                        <div className="time">{time}</div>
                        {matchingAppointment && (
                          <div className="patient-info">
                            <div className="patient-name">
                              {matchingAppointment.fullName}
                            </div>
                            <div>{matchingAppointment.phone}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppointmentManagement;
