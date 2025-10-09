import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faTrash } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";

interface Patient {
  id: number;
  fullname: string;
  username: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
  symptom: string;
  prescription: string;
  isActive?: boolean;
}

const mockPatients: Patient[] = [
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    username: "nguyenvana",
    dob: "2000-03-14",
    gender: "Male",
    phone: "0987123456",
    address: "Hà Nội",
    date: "2025-10-06",
    status: "Completed",
    symptom: "Fever",
    prescription: "Paracetamol",
  },
  {
    id: 2,
    fullname: "Trần Thị B",
    username: "tranthib",
    dob: "1998-07-22",
    gender: "Female",
    phone: "0905123456",
    address: "TP. HCM",
    date: "2025-10-05",
    status: "Pending",
    symptom: "Headache",
    prescription: "-",
  },
];

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter((patient) => patient.id !== id));
    }
  };
  const [view, setView] = useState("appointment");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusClass = (status: Patient["status"]) => {
    switch (status) {
      case "Completed":
        return "verified";
      case "Pending":
        return "pending";
      case "Cancelled":
        return "unverified";
      default:
        return "";
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
          <h2>Patient Management</h2>
        </div>
      </div>

      <div className="appointment">
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
        <table className="appointments-table">
          <thead>
            <tr>
              <th></th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Date</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Symptom</th>
              <th>Prescription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients
              .filter(
                (patient) =>
                  patient.fullname
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  patient.phone.includes(searchQuery)
              )
              .map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.fullname}</td>
                  <td>{patient.username}</td>
                  <td>{patient.date}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>

                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        patient.status
                      )}`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td>{patient.symptom}</td>
                  <td>{patient.prescription}</td>
                  <td className="action-buttons">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDelete(patient.id)}
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

export default PatientManagement;
