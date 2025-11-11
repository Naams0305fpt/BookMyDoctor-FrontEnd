import React, { useState, useEffect, useCallback } from "react"; // <-- Thêm hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faCheck,
  faTimes,
  faChevronLeft, // <-- Thêm icon
  faChevronRight, // <-- Thêm icon
  faSave,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker"; // <-- Thêm DatePicker
import "react-datepicker/dist/react-datepicker.css";
// --- THAY ĐỔI: Import API, types, helpers ---
import {
  api,
  Patient,
  formatDateForAPI,
  UpdatePatientRequest,
} from "../../services/api";
import "./DoctorSchedule.css"; // <-- Đổi tên CSS nếu cần

// --- Interface Appointment và TableRowProps giữ nguyên ---
interface Appointment {
  id: number; // Cần ID để sửa/xóa
  fullName: string;
  dateOfBirth: Date; // TableRow dùng Date object
  gender: string;
  phone: string;
  symptom: string;
  prescription: string;
  status: "pending" | "completed" | "cancelled"; // Map từ API status
  time?: string; // API getPatients chưa có time?
  appointHour?: string; // Thêm trường giờ hẹn
  appointDate?: string; // Thêm trường ngày hẹn (YYYY-MM-DD)
}

interface TableRowProps {
  appointment: Appointment;
  onUpdate: (
    id: number,
    symptom: string,
    prescription: string,
    status: Appointment["status"]
  ) => void;
  onDelete: (id: number) => void;
}

// --- Component TableRow với chế độ Edit ---
const TableRow: React.FC<TableRowProps> = ({
  appointment,
  onUpdate,
  onDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempSymptom, setTempSymptom] = useState(appointment.symptom);
  const [tempPrescription, setTempPrescription] = useState(
    appointment.prescription
  );
  const [tempStatus, setTempStatus] = useState(appointment.status);

  // Cập nhật temp values khi appointment thay đổi
  useEffect(() => {
    setTempSymptom(appointment.symptom);
    setTempPrescription(appointment.prescription);
    setTempStatus(appointment.status);
  }, [appointment]);

  const handleSave = () => {
    onUpdate(appointment.id, tempSymptom, tempPrescription, tempStatus);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    // Reset về giá trị gốc
    setTempSymptom(appointment.symptom);
    setTempPrescription(appointment.prescription);
    setTempStatus(appointment.status);
    setIsEditMode(false);
  };

  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "completed":
        return (
          <FontAwesomeIcon
            icon={faCheck}
            className="status-icon status-completed"
            title="Completed"
          />
        );
      case "cancelled":
        return (
          <FontAwesomeIcon
            icon={faTimes}
            className="status-icon status-cancelled"
            title="Cancelled"
          />
        );
      case "pending":
      default:
        return (
          <span className="status-icon status-pending" title="Pending">
            ⏳
          </span>
        );
    }
  };

  return (
    <tr className={isEditMode ? "edit-mode" : ""}>
      <td>{appointment.fullName}</td>
      <td>{appointment.dateOfBirth.toLocaleDateString("en-GB")}</td>
      <td>{appointment.gender}</td>
      <td>{appointment.phone}</td>
      <td>{appointment.appointHour}</td>

      {/* Symptom */}
      <td>
        {isEditMode ? (
          <input
            type="text"
            className="edit-input"
            value={tempSymptom}
            onChange={(e) => setTempSymptom(e.target.value)}
          />
        ) : (
          appointment.symptom || "N/A"
        )}
      </td>

      {/* Prescription */}
      <td>
        {isEditMode ? (
          <input
            type="text"
            className="edit-input"
            value={tempPrescription}
            onChange={(e) => setTempPrescription(e.target.value)}
          />
        ) : (
          appointment.prescription || "N/A"
        )}
      </td>

      {/* Status */}
      <td>
        {isEditMode ? (
          <select
            className="edit-select"
            value={tempStatus}
            onChange={(e) =>
              setTempStatus(e.target.value as Appointment["status"])
            }
          >
            <option value="pending">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        ) : (
          getStatusIcon(appointment.status)
        )}
      </td>

      {/* Actions */}
      <td>
        <div className="action-buttons">
          {isEditMode ? (
            <>
              <button
                className="btn-save"
                onClick={handleSave}
                title="Save changes"
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button
                className="btn-cancel"
                onClick={handleCancel}
                title="Cancel"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-edit"
                onClick={() => setIsEditMode(true)}
                title="Edit"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(appointment.id)}
                title="Delete"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// --- Component Chính: AppointmentTable ---
const AppointmentTable: React.FC = () => {
  // --- THAY ĐỔI: State dùng Patient từ API ---
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho bộ lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Bắt đầu là null (tất cả ngày)
  const [selectedStatus, setSelectedStatus] = useState(""); // Bắt đầu là rỗng (tất cả status)

  // Hàm fetch data
  const fetchPatients = useCallback(
    async (name: string, date: Date | null, status: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const formattedDate = date ? formatDateForAPI(date) : "";
        const data = await api.getPatients(name, formattedDate, status);
        setPatients(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch patients.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Gọi API khi component mount và khi bộ lọc thay đổi
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchPatients(searchQuery, selectedDate, selectedStatus);
    }, 500); // Debounce
    return () => clearTimeout(timerId);
  }, [searchQuery, selectedDate, selectedStatus, fetchPatients]); // <-- Thêm fetchPatients vào dependency array

  // --- Handler để update tất cả thông tin cùng lúc ---
  const handleUpdate = async (
    id: number,
    symptom: string,
    prescription: string,
    status: Appointment["status"]
  ) => {
    try {
      // Tìm patient để lấy appointDate và appointHour
      const patient = patients.find((p) => p.id === id);
      if (!patient) {
        console.error(`Patient with ID ${id} not found`);
        return;
      }

      // Map status từ component sang API
      const apiStatus =
        status === "pending"
          ? "Scheduled"
          : status === "completed"
          ? "Completed"
          : "Cancelled";

      // Chuẩn bị data để update
      const updateData: UpdatePatientRequest = {
        Status: apiStatus,
        Symptoms: symptom,
        Prescription: prescription,
      };

      // Gọi API
      await api.updatePatientAppointment(
        id,
        patient.AppointDate,
        patient.AppointHour || "00:00",
        updateData
      );

      // Cập nhật local state sau khi API thành công
      setPatients((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                Symptoms: symptom,
                Prescription: prescription,
                Status: apiStatus,
              }
            : p
        )
      );

      console.log(`✅ Updated patient ID ${id} successfully`);
    } catch (error: any) {
      console.error(`❌ Failed to update patient:`, error.message);
      setError(error.message || "Failed to update patient information");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      // TODO: Implement delete API when available
      console.log(`TODO: Call API to delete appointment with ID ${id}`);

      // Tạm thời cập nhật local state
      setPatients((prev) => prev.filter((p) => p.id !== id));

      console.log(`✅ Deleted appointment ID ${id}`);
    } catch (error: any) {
      console.error(`❌ Failed to delete appointment:`, error.message);
      setError(error.message || "Failed to delete appointment");
    }
  };

  // Hàm điều hướng ngày (giống PatientManagement)
  const goToPreviousDay = () => {
    const date = selectedDate || new Date();
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const date = selectedDate || new Date();
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // --- Hàm map Status từ API sang Status của component ---
  const mapApiStatusToComponentStatus = (
    apiStatus: Patient["Status"]
  ): Appointment["status"] => {
    switch (apiStatus) {
      case "Completed":
        return "completed";
      case "Cancelled":
        return "cancelled";
      case "Scheduled": // Hoặc các trạng thái khác?
      default:
        return "pending";
    }
  };

  return (
    <div className="appointment-table-container">
      {" "}
      {/* Đổi class gốc nếu cần */}
      {/* --- THÊM MỚI: Bộ lọc Controls --- */}
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

        {/* Date Navigation */}
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
              className="date-picker-input" // Sử dụng class từ CSS dùng chung
              placeholderText="All Dates"
              isClearable
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

        {/* Status Filter */}
        <div className="status-filter">
          {" "}
          {/* Cần CSS cho class này */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="search-input" // Tạm dùng class này
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>{" "}
            {/* Dùng value giống API */}
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {/* --- KẾT THÚC BỘ LỌC --- */}
      {/* Bảng Dữ liệu */}
      <table className="appointments-table">
        <thead>
          <tr>
            {/* --- SỬA: Bỏ cột No. và Username nếu không cần --- */}
            <th>Full Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Slot</th>
            <th>Symptom</th>
            <th>Prescription</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", color: "red" }}>
                {error}
              </td>
            </tr>
          )}
          {!isLoading &&
            !error &&
            patients.length > 0 &&
            patients.map((patient) => {
              // --- ÁNH XẠ (MAP) TỪ Patient -> Appointment ---
              const appointmentData: Appointment = {
                // Giả sử API trả về 'id' trong object Patient, nếu không cần tìm cách tạo key/id duy nhất
                id: patient.id || Date.now() + Math.random(), // <-- Cần ID duy nhất
                fullName: patient.FullName,
                dateOfBirth: new Date(patient.DateOfBirth), // Chuyển string -> Date
                gender: patient.Gender,
                phone: patient.PhoneNumber, // Đổi tên trường
                appointHour: patient.AppointHour || "N/A", // Lấy giờ hẹn nếu có
                appointDate: patient.AppointDate, // Lưu ngày hẹn để gọi API
                symptom: patient.Symptoms, // Đổi tên trường
                prescription: patient.Prescription,
                status: mapApiStatusToComponentStatus(patient.Status), // Map status
              };
              return (
                <TableRow
                  key={appointmentData.id}
                  appointment={appointmentData}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              );
            })}
          {!isLoading && !error && patients.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
