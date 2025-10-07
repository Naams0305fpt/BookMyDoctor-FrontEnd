import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faUserCheck,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import "./AdminTables.css";

const mockDoctors = [
  {
    id: 1,
    fullName: "Dr. Nguyễn Văn B",
    username: "doctorb",
    password: "123456",
    dob: "1985-06-20",
    gender: "Male",
    phone: "0988888888",
    address: "Đà Nẵng",
    email: "doctorb@example.com",
    department: "Cardiology",
    experience: "10 years",
  },
  {
    id: 2,
    fullName: "Dr. Trần Thị C",
    username: "doctorc",
    password: "123456",
    dob: "1990-10-12",
    gender: "Female",
    phone: "0911222333",
    address: "Cần Thơ",
    email: "doctorc@example.com",
    department: "Neurology",
    experience: "6 years",
  },
];

const DoctorManagement = () => {
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
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Email</th>
              <th>Department</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            {mockDoctors.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.fullName}</td>
                <td>{d.username}</td>
                <td>{d.password}</td>
                <td>{d.dob}</td>
                <td>{d.gender}</td>
                <td>{d.phone}</td>
                <td>{d.address}</td>
                <td>{d.email}</td>
                <td>{d.department}</td>
                <td>{d.experience}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagement;
