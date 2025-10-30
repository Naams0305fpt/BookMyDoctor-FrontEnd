import React, { useState, useEffect, useCallback } from "react"; // <-- Thêm hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faCheck,
  faTimes,
  faChevronLeft, // <-- Thêm icon
  faChevronRight, // <-- Thêm icon
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker"; // <-- Thêm DatePicker
import "react-datepicker/dist/react-datepicker.css";
// --- THAY ĐỔI: Import API, types, helpers ---
import { api, Patient, formatDateForAPI } from "../../services/api"; // <-- Đường dẫn có thể cần sửa
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

// --- Component TableRow giữ nguyên ---
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
      {/* --- SỬA: Hiển thị đúng dữ liệu từ props --- */}
      <td>{appointment.fullName}</td>
      <td>{appointment.dateOfBirth.toLocaleDateString("en-GB")}</td>
      <td>{appointment.gender}</td>
      <td>{appointment.phone}</td>
      <td>
        <div className="editable-field">
          {isEditingSymptom ? (
            <input
              type="text"
              value={tempSymptom}
              onChange={(e) => setTempSymptom(e.target.value)}
              onBlur={() =>
                handleEditSave("symptom", tempSymptom, setIsEditingSymptom)
              }
              autoFocus
            />
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
        {/* --- SỬA: Hiển thị icon dựa trên status đã map --- */}
        {appointment.status === "completed" && (
          <FontAwesomeIcon
            icon={faCheck}
            className="status-icon status-completed" // CSS class này cần tồn tại
            title="Completed"
          />
        )}
        {appointment.status === "cancelled" && (
          <FontAwesomeIcon
            icon={faTimes}
            className="status-icon status-cancelled" // CSS class này cần tồn tại
            title="Cancelled"
          />
        )}
        {appointment.status === "pending" && (
          <span className="status-icon status-pending" title="Pending">
            {" "}
            {/* Có thể dùng icon khác */}⏳ {/* Hoặc dùng text */}
          </span>
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

// --- Bỏ mockAppointments ---
// const mockAppointments: Appointment[] = [ ... ];

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

  // --- Cần API để sửa/xóa/đổi status ---
  const handleEdit = (
    id: number,
    field: "symptom" | "prescription",
    value: string
  ) => {
    console.log(
      `TODO: Call API to update ${field} for ID ${id} with value "${value}"`
    );
    // Tạm thời cập nhật local state (không lý tưởng)
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field === "symptom" ? "Symptoms" : "Prescription"]: value }
          : p
      )
    );
  };

  const handleDelete = (id: number) => {
    console.log(`TODO: Call API to delete appointment with ID ${id}`);
    // Tạm thời cập nhật local state
    // Nên có confirm modal ở đây
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const handleStatusChange = (id: number, status: Appointment["status"]) => {
    console.log(`TODO: Call API to update status for ID ${id} to ${status}`);
    // Tạm thời cập nhật local state (cần map ngược status lại?)
    const apiStatus =
      status === "pending"
        ? "Scheduled"
        : status === "completed"
        ? "Completed"
        : "Cancelled";
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, Status: apiStatus } : p))
    );
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
              <td colSpan={8} style={{ textAlign: "center" }}>
                Loading...
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", color: "red" }}>
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
                symptom: patient.Symptoms, // Đổi tên trường
                prescription: patient.Prescription,
                status: mapApiStatusToComponentStatus(patient.Status), // Map status
                // time: ??? // API getPatients hiện không có giờ hẹn
              };
              return (
                <TableRow
                  key={appointmentData.id} // <-- Dùng ID đã map
                  appointment={appointmentData}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              );
            })}
          {!isLoading && !error && patients.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
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
