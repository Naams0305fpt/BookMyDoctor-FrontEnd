import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faTrash,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Patient {
  id: number;
  fullname: string;
  username: string;
  dob: string; // Date of Birth
  gender: string;
  phone: string;
  email?: string;
  address: string;
  appointmentDate: string; // Appointment Date
  status: "Completed" | "Pending" | "Cancelled";
  symptom: string;
  prescription: string;
  isActive?: boolean;
}

const mockPatients: Patient[] = [
  // October 6, 2025 - 2 patients
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    username: "nguyenvana",
    dob: "2000-03-14",
    gender: "Male",
    phone: "0987123456",
    email: "nguynvana@gmail.com",
    address: "Hà Nội",
    appointmentDate: "2025-10-06",
    status: "Completed",
    symptom: "Fever",
    prescription: "Paracetamol 500mg",
  },
  {
    id: 2,
    fullname: "Trần Thị B",
    username: "tranthib",
    dob: "1998-07-22",
    gender: "Female",
    phone: "0905123456",
    address: "TP. HCM",
    appointmentDate: "2025-10-06",
    status: "Completed",
    symptom: "Headache",
    prescription: "Ibuprofen 400mg",
  },
  // October 7, 2025 - 2 patients
  {
    id: 3,
    fullname: "Lê Minh C",
    username: "leminhc",
    dob: "1995-11-08",
    gender: "Male",
    phone: "0912345678",
    address: "Đà Nẵng",
    appointmentDate: "2025-10-07",
    status: "Completed",
    symptom: "Cough and cold",
    prescription: "Amoxicillin 250mg",
  },
  {
    id: 4,
    fullname: "Phạm Thu D",
    username: "phamthud",
    dob: "2002-05-19",
    gender: "Female",
    phone: "0923456789",
    email: "phamthud@gmail.com",
    address: "Hải Phòng",
    appointmentDate: "2025-10-07",
    status: "Pending",
    symptom: "Stomach pain",
    prescription: "-",
  },
  // October 8, 2025 - 2 patients
  {
    id: 5,
    fullname: "Hoàng Văn E",
    username: "hoangvane",
    dob: "1992-09-25",
    gender: "Male",
    phone: "0934567890",
    address: "Cần Thơ",
    appointmentDate: "2025-10-08",
    status: "Completed",
    symptom: "Back pain",
    prescription: "Diclofenac 50mg",
  },
  {
    id: 6,
    fullname: "Đỗ Thị F",
    username: "dothif",
    dob: "1999-12-30",
    gender: "Female",
    phone: "0945678901",
    email: "dothif@gmail.com",
    address: "Huế",
    appointmentDate: "2025-10-08",
    status: "Cancelled",
    symptom: "Allergic reaction",
    prescription: "-",
  },
  // October 9, 2025 - 2 patients
  {
    id: 7,
    fullname: "Vũ Minh G",
    username: "vuminhg",
    dob: "1997-04-15",
    gender: "Male",
    phone: "0956789012",
    address: "Nha Trang",
    appointmentDate: "2025-10-09",
    status: "Completed",
    symptom: "Sore throat",
    prescription: "Azithromycin 500mg",
  },
  {
    id: 8,
    fullname: "Bùi Thu H",
    username: "buithuh",
    dob: "2001-08-07",
    gender: "Female",
    phone: "0967890123",
    email: "buithuh@gmail.com",
    address: "Vũng Tàu",
    appointmentDate: "2025-10-09",
    status: "Pending",
    symptom: "Dizziness",
    prescription: "-",
  },
  // October 10, 2025 - 2 patients
  {
    id: 9,
    fullname: "Ngô Văn I",
    username: "ngovani",
    dob: "1994-06-12",
    gender: "Male",
    phone: "0978901234",
    email: "ngovani@gmail.com",
    address: "Biên Hòa",
    appointmentDate: "2025-10-10",
    status: "Pending",
    symptom: "Chest pain",
    prescription: "-",
  },
  {
    id: 10,
    fullname: "Lý Thị K",
    username: "lythik",
    dob: "2000-10-28",
    gender: "Female",
    phone: "0989012345",
    email: "lythik@gmail.com",
    address: "Quy Nhơn",
    appointmentDate: "2025-10-10",
    status: "Pending",
    symptom: "Skin rash",
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
              <th>Full Name</th>
              <th>Username</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Symptom</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {patients
              .filter((patient) => {
                const matchesSearch =
                  patient.fullname
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  patient.phone.includes(searchQuery);

                const matchesDate =
                  !selectedDate ||
                  new Date(patient.appointmentDate).toDateString() ===
                    selectedDate.toDateString();

                return matchesSearch && matchesDate;
              })
              .map((patient, index) => (
                <tr key={patient.id}>
                  <td>{index + 1}</td>
                  <td>{patient.fullname}</td>
                  <td>{patient.username}</td>
                  <td>{patient.dob}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email || "N/A"}</td>
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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientManagement;
