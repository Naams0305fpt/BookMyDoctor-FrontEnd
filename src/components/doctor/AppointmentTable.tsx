import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faSave,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  api,
  DoctorAppointment,
  formatDateForAPI,
  UpdateAppointmentRequest,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./DoctorSchedule.css";

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
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // --- CẬP NHẬT: State dùng DoctorAppointment từ API mới ---
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho bộ lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Bắt đầu là null (tất cả ngày)
  const [selectedStatus, setSelectedStatus] = useState(""); // Bắt đầu là rỗng (tất cả status)

  // Hàm fetch data với API mới
  const fetchAppointments = useCallback(
    async (patientName: string, date: Date | null, status: string) => {
      setIsLoading(true);
      setError(null);
      try {
        // Nếu là doctor, chỉ lấy appointments của mình
        // Nếu là admin, lấy tất cả (không gửi doctorId)
        const doctorIdParam =
          user?.userType === "doctor" && user?.doctorId
            ? user.doctorId
            : undefined;

        // Gọi API mới
        const data = await api.getDoctorAppointments(
          doctorIdParam,
          patientName || undefined,
          undefined // patientPhone - để undefined vì search bar chỉ search name
        );

        // Filter theo date và status ở frontend (vì API không hỗ trợ)
        let filteredData = data;

        if (date) {
          const formattedDate = formatDateForAPI(date);
          filteredData = filteredData.filter(
            (apt) => apt.AppointDate === formattedDate
          );
        }

        if (status) {
          filteredData = filteredData.filter((apt) => apt.Status === status);
        }

        setAppointments(filteredData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch appointments.");
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // Gọi API khi component mount và khi bộ lọc thay đổi
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchAppointments(searchQuery, selectedDate, selectedStatus);
    }, 500); // Debounce
    return () => clearTimeout(timerId);
  }, [searchQuery, selectedDate, selectedStatus, fetchAppointments]);

  // --- Handler để update tất cả thông tin cùng lúc ---
  const handleUpdate = async (
    id: number,
    symptom: string,
    prescription: string,
    status: Appointment["status"]
  ) => {
    try {
      // Tìm appointment để lấy đầy đủ thông tin
      const appointment = appointments.find((apt) => apt.AppointId === id);
      if (!appointment) {
        console.error(`Appointment with ID ${id} not found`);
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
      const updateData: UpdateAppointmentRequest = {
        Status: apiStatus,
        Symptoms: symptom,
        Prescription: prescription,
      };

      // Gọi API với đầy đủ 4 params
      await api.updateAppointment(
        appointment.PatientId,
        appointment.AppointDate,
        appointment.AppointHour,
        appointment.AppointId,
        updateData
      );

      // Cập nhật local state sau khi API thành công
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.AppointId === id
            ? {
                ...apt,
                Symptoms: symptom,
                Prescription: prescription,
                Status: apiStatus,
              }
            : apt
        )
      );

      // Hiển thị thông báo thành công
      showNotification(
        "success",
        "Updated Successfully",
        "Appointment information has been updated.",
        3000
      );
    } catch (error: any) {
      console.error(`❌ Failed to update appointment:`, error.message);

      // Xử lý lỗi "Không có thông tin nào để cập nhật"
      const errorMessage = error.response?.data?.message || error.message || "";

      if (
        errorMessage.includes("Không có thông tin nào để cập nhật") ||
        errorMessage.includes("No information to update")
      ) {
        // Hiển thị warning thay vì error, KHÔNG set error state
        showNotification(
          "warning",
          "No Changes Detected",
          "No changes were made to the appointment information.",
          3000
        );
        // Không làm gì thêm - giữ nguyên data trong bảng
      } else {
        // Các lỗi khác thì hiển thị error
        showNotification(
          "error",
          "Update Failed",
          errorMessage || "Failed to update appointment information",
          3000
        );
        // Chỉ set error state cho các lỗi thực sự
        setError(errorMessage || "Failed to update appointment information");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      // TODO: Implement delete API when available

      // Tạm thời cập nhật local state
      setAppointments((prev) => prev.filter((apt) => apt.AppointId !== id));
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
    apiStatus: DoctorAppointment["Status"]
  ): Appointment["status"] => {
    switch (apiStatus) {
      case "Completed":
        return "completed";
      case "Cancelled":
        return "cancelled";
      case "Scheduled":
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
            <th>Full Patient Name</th>
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
            appointments.length > 0 &&
            appointments.map((appointment) => {
              // --- ÁNH XẠ (MAP) TỪ DoctorAppointment -> Appointment ---
              const appointmentData: Appointment = {
                id: appointment.AppointId, // Dùng AppointId từ API
                fullName: appointment.FullName,
                dateOfBirth: new Date(appointment.DateOfBirth),
                gender: appointment.Gender,
                phone: appointment.PhoneNumber,
                appointHour: appointment.AppointHour, // Đã có từ API
                appointDate: appointment.AppointDate,
                symptom: appointment.Symptoms,
                prescription: appointment.Prescription || "",
                status: mapApiStatusToComponentStatus(appointment.Status),
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
          {!isLoading && !error && appointments.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center" }}>
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
