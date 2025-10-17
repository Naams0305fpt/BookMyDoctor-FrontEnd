import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserMd } from "@fortawesome/free-solid-svg-icons";
import CreateDoctorModal from "./CreateDoctorModal";

interface Doctor {
  id: number;
  fullName: string;
  username: string;
  dob: Date;
  gender: string;
  phone: string;
  email?: string;
  department: string;
  experience: string;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn B",
    username: "doctorb",
    dob: new Date("1985-06-20"),
    gender: "Male",
    phone: "0988888888",
    email: "doctorb@example.com",
    department: "Cardiology",
    experience: "10 years",
  },
  {
    id: 2,
    fullName: "Trần Thị C",
    username: "doctorc",
    dob: new Date("1990-09-15"),
    gender: "Female",
    phone: "0911222333",
    email: "doctorc@example.com",
    department: "Neurology",
    experience: "6 years",
  },
];

const DoctorManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorList, setDoctorList] = useState(mockDoctors);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateDoctor = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleDoctorCreated = (newDoctor: any) => {
    // Add the new doctor to the list with a new ID
    const newId = Math.max(...doctorList.map((d) => d.id)) + 1;
    setDoctorList([...doctorList, { ...newDoctor, id: newId }]);
    setShowCreateModal(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setDoctorList(doctorList.filter((doctor) => doctor.id !== id));
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
          <h2>Doctor Management</h2>
        </div>
      </div>
      <div className="appointment">
        <div className="appointment-controls">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by doctor name, email, or department..."
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
          </div>
          <button className="create-doctor-btn" onClick={handleCreateDoctor}>
            <FontAwesomeIcon icon={faUserMd} />
            <span>Create Doctor Account</span>
          </button>
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
              <th>Department</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctorList
              .filter((doctor) => {
                const searchLower = searchQuery.toLowerCase();
                return (
                  doctor.fullName.toLowerCase().includes(searchLower) ||
                  doctor.department.toLowerCase().includes(searchLower) ||
                  doctor.phone.includes(searchQuery)
                );
              })
              .map((d, index) => (
                <tr key={d.id}>
                  <td>{index + 1}</td>
                  <td>{d.fullName}</td>
                  <td>{d.username}</td>
                  <td>{d.dob.toLocaleDateString("en-GB")}</td>
                  <td>{d.gender}</td>
                  <td>{d.phone}</td>
                  <td>{d.email}</td>
                  <td>{d.department}</td>
                  <td>{d.experience}</td>
                  <td className="action-buttons">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDelete(d.id)}
                      title="Delete Doctor"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <CreateDoctorModal
          onClose={handleCloseModal}
          onSubmit={handleDoctorCreated}
        />
      )}
    </div>
  );
};

export default DoctorManagement;
