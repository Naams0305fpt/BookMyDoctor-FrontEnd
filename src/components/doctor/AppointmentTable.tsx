import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./DoctorSchedule.css";

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

const AppointmentTable: React.FC = () => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");

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
    console.log("Delete triggered for", id);
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  const handleStatusChange = (id: number, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  return (
    <div className="appointment-table-container">
      {/* Search Controls */}
      <div className="appointment-controls">
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
      </div>

      {/* Appointments Table */}
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
    </div>
  );
};

export default AppointmentTable;
