import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DoctorSchedule.css";
import scheduleApi from "../../services/api/schedule.api";
import doctorApi from "../../services/api/doctor.api";
import type { Schedule, UpdateScheduleRequest } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import ScheduleFormModal from "../common/ScheduleFormModal";

const DoctorScheduleView: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // State for schedules (Doctor's work schedule, not patient appointments)
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingSchedule, setEditingSchedule] = useState<
    UpdateScheduleRequest | undefined
  >(undefined);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current doctor info
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);

  // Find current doctor ID from user
  useEffect(() => {
    if (user && user.id) {
      const findDoctorId = async () => {
        try {
          const currentUserId = Number(user.id);
          if (Number.isNaN(currentUserId)) {
            setCurrentDoctorId(null);
            return;
          }

          const allDoctors = await doctorApi.getAllDoctors();
          const matchingDoctor = allDoctors.find(
            (doc) => doc.UserId === currentUserId
          );

          if (matchingDoctor) {
            setCurrentDoctorId(matchingDoctor.DoctorId);
          } else {
            setCurrentDoctorId(null);
          }
        } catch (error) {
          setCurrentDoctorId(null);
        }
      };

      findDoctorId();
    } else {
      setCurrentDoctorId(null);
    }
  }, [user]);

  // Fetch doctor's schedules
  const fetchSchedules = useCallback(async () => {
    if (!currentDoctorId) return;

    setIsLoading(true);
    setError(null);
    try {
      // Get all schedules, will filter client-side
      const data = await scheduleApi.getAllSchedulesForAdmin();
      // Filter by current doctor
      const doctorSchedules = data.filter(
        (schedule) => schedule.DoctorId === currentDoctorId
      );
      setSchedules(doctorSchedules);
    } catch (err: any) {
      setError(err.message || "Failed to load schedules.");
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentDoctorId]);

  // Fetch schedules when doctor ID changes
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Client-side filtering
  const filteredSchedules = schedules.filter((schedule) => {
    // Filter by date
    if (selectedDate) {
      const scheduleDate = new Date(schedule.WorkDate).toDateString();
      const filterDate = selectedDate.toDateString();
      if (scheduleDate !== filterDate) return false;
    }

    // Filter active only
    return schedule.IsActive === true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  // Handle Create Schedule
  const handleCreate = () => {
    setModalMode("create");
    setEditingSchedule(undefined);
    setShowModal(true);
  };

  // Handle Edit Schedule
  const handleEdit = (schedule: Schedule) => {
    if (!schedule.ScheduleId) {
      showNotification("error", "Error", "Schedule ID is missing");
      return;
    }

    setModalMode("edit");
    setEditingSchedule({
      ScheduleId: schedule.ScheduleId,
      DoctorId: schedule.DoctorId,
      WorkDate: schedule.WorkDate,
      StartTime: schedule.StartTime || "",
      EndTime: schedule.EndTime || "",
      Status: schedule.Status || "Scheduled",
    });
    setShowModal(true);
  };

  // Handle Delete Schedule
  const handleDelete = async (scheduleId: number, workDate: string) => {
    const confirmMessage = `Are you sure you want to delete this schedule?\n\nDate: ${new Date(
      workDate
    ).toLocaleDateString("en-GB")}\n\nThis action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(scheduleId);
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      showNotification("success", "Success", "Schedule deleted successfully");
      await fetchSchedules();
    } catch (err: any) {
      showNotification(
        "error",
        "Delete Failed",
        err.message || "Failed to delete schedule. Please try again."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle Modal Submit
  const handleModalSubmit = () => {
    setShowModal(false);
    fetchSchedules();
  };

  // Date navigation
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

  // Helper định dạng giờ HH:mm
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "N/A";
    try {
      return timeString.substring(0, 5);
    } catch {
      return timeString;
    }
  };

  return (
    <div className="schedule-management-container">
      <div className="appointment">
        {/* Controls - Create Button + Date Navigation */}
        <div className="appointment-controls">
          <button className="btn-create" onClick={handleCreate}>
            <FontAwesomeIcon icon={faPlus} /> Create Schedule
          </button>

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
        </div>

        {/* Table View */}
        <table className="appointments-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Work Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading state */}
            {isLoading && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}

            {/* Error state */}
            {error && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "red" }}>
                  {error}
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              !error &&
              currentSchedules.length > 0 &&
              currentSchedules.map((schedule, index) => (
                <tr
                  key={`${schedule.ScheduleId}-${schedule.DoctorId}-${schedule.WorkDate}`}
                >
                  <td>{startIndex + index + 1}</td>
                  <td>
                    {new Date(schedule.WorkDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>{formatTime(schedule.StartTime)}</td>
                  <td>{formatTime(schedule.EndTime)}</td>
                  <td>
                    <span
                      className={`status-${schedule.Status?.toLowerCase()}`}
                    >
                      {schedule.Status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {/* Edit button */}
                    <button
                      className="edit-icon"
                      onClick={() => handleEdit(schedule)}
                      title="Edit Schedule"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        color: "#0ea5e9",
                        marginRight: "1rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#0284c7";
                        e.currentTarget.style.transform = "scale(1.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#0ea5e9";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    {/* Delete button */}
                    <button
                      className="delete-icon"
                      onClick={() => {
                        if (schedule.ScheduleId) {
                          handleDelete(schedule.ScheduleId, schedule.WorkDate);
                        }
                      }}
                      disabled={
                        isDeleting === schedule.ScheduleId ||
                        !schedule.ScheduleId
                      }
                      title={
                        schedule.ScheduleId
                          ? "Delete Schedule"
                          : "Schedule ID missing"
                      }
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor:
                          isDeleting === schedule.ScheduleId ||
                          !schedule.ScheduleId
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          isDeleting === schedule.ScheduleId ||
                          !schedule.ScheduleId
                            ? 0.5
                            : 1,
                        fontSize: "1.1rem",
                        color: "#dc2626",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          isDeleting !== schedule.ScheduleId &&
                          schedule.ScheduleId
                        ) {
                          e.currentTarget.style.color = "#991b1b";
                          e.currentTarget.style.transform = "scale(1.15)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#dc2626";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        spin={isDeleting === schedule.ScheduleId}
                      />
                    </button>
                  </td>
                </tr>
              ))}

            {/* Empty state */}
            {!isLoading && !error && filteredSchedules.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No schedules found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && !error && filteredSchedules.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages} ({filteredSchedules.length}{" "}
              total)
            </span>
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <ScheduleFormModal
          mode={modalMode}
          initialData={editingSchedule}
          currentDoctorId={currentDoctorId || undefined}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default DoctorScheduleView;
