import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserMd, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import CreateDoctorModal from "./CreateDoctorModal";
import { api, Doctor } from "../../services/api";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { exportDoctorsToExcel } from "../../utils/excelExport";

// Component hiển thị loading
const LoadingSpinner = () => (
  <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>
    Loading doctors...
  </div>
);

// Component ErrorDisplay không cần nữa vì lỗi hiển thị trong bảng

const DoctorManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu là true ban đầu
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Tách hàm fetch data
  const fetchDoctors = useCallback(async () => {
    setIsLoading(true); // Bắt đầu loading mỗi khi fetch
    setError(null); // Xóa lỗi cũ
    try {
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || "Could not load doctor list.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  }, []); // Hàm fetch không cần dependency

  // Lấy dữ liệu lần đầu
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Mở modal
  const handleCreateDoctor = () => {
    setShowCreateModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  // Xử lý sau khi tạo thành công (từ modal)
  const handleDoctorCreated = () => {
    fetchDoctors(); // Gọi lại API để làm mới danh sách
  };

  // Xử lý xóa
  const handleDelete = async (doctorId: number) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }
    try {
      await api.deleteDoctor(doctorId);
      // Cập nhật state sau khi xóa thành công
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.DoctorId !== doctorId)
      );
    } catch (err: any) {
      console.error("Failed to delete doctor:", err);
      alert(`Error: ${err.message}`); // Hiển thị lỗi
    }
  };

  // Lọc dữ liệu
  const filteredDoctors = useMemo(() => {
    if (isLoading || error) return [];
    return doctors.filter((doctor) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        doctor.Name?.toLowerCase().includes(searchLower) ||
        doctor.Department?.toLowerCase().includes(searchLower) ||
        doctor.Phone?.includes(searchQuery) ||
        doctor.Email?.toLowerCase().includes(searchLower)
      );
    });
  }, [doctors, searchQuery, isLoading, error]);

  // Pagination hook
  const pagination = usePagination(filteredDoctors, 10);

  return (
    <div className="admin-table-container">
      {/* Header */}
      <div className="section-header">
        <div className="section-title">
          <svg
            data-prefix="fas"
            data-icon="plus"
            className="svg-inline--fa fa-plus title-icon"
            role="img"
            viewBox="0 0 448 512"
            aria-hidden="true"
            style={{ width: "1em", marginRight: "0.5rem" }}
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
        {/* Controls */}
        <div className="appointment-controls">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name, email, department, phone..."
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
          <button
            className="export-btn"
            onClick={() => exportDoctorsToExcel(filteredDoctors, 'danh_sach_bac_si')}
            title="Export to Excel"
            disabled={filteredDoctors.length === 0}
          >
            <FontAwesomeIcon icon={faFileExcel} /> Export Excel
          </button>
        </div>

        {/* Bảng */}
        <table className="appointments-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Full Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Email</th>
              <th>Department</th>
              <th>Experience</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Hiển thị loading bên trong tbody */}
            {isLoading && (
              <tr>
                <td
                  colSpan={11}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Loading doctors...
                </td>
              </tr>
            )}
            {/* Hiển thị lỗi bên trong tbody */}
            {error && (
              <tr>
                <td
                  colSpan={11}
                  style={{ textAlign: "center", color: "red", padding: "2rem" }}
                >
                  Error: {error}
                </td>
              </tr>
            )}
            {/* Hiển thị dữ liệu với pagination */}
            {!isLoading &&
              !error &&
              pagination.currentItems.map((d, index) => (
                <tr key={d.DoctorId}>
                  <td>{pagination.startIndex + index}</td>
                  <td>{d.Name}</td>
                  <td>{new Date(d.DateOfBirth).toLocaleDateString("en-GB")}</td>
                  <td>{d.Gender}</td>
                  <td>{d.Phone}</td>
                  <td>{d.Address}</td>
                  <td>{d.Email}</td>
                  <td>{d.Department}</td>
                  <td>{d.Experience_year} years</td>
                  <td className="action-buttons">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDelete(d.DoctorId)}
                      title="Delete Doctor"
                      style={{
                        cursor: "pointer",
                        color: "#dc3545",
                        fontSize: "1.1rem",
                      }}
                    />
                  </td>
                </tr>
              ))}
            {/* Thông báo không có dữ liệu */}
            {!isLoading &&
              !error &&
              doctors.length > 0 &&
              filteredDoctors.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    style={{ textAlign: "center", padding: "1.5rem" }}
                  >
                    No doctors found matching your criteria.
                  </td>
                </tr>
              )}
          </tbody>
        </table>

        {/* Pagination Component */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPreviousPage={pagination.goToPreviousPage}
          onNextPage={pagination.goToNextPage}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          itemName="doctors"
        />
      </div>

      {/* Modal */}
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
