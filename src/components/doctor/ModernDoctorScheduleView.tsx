import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import scheduleApi from "../../services/api/schedule.api";
import doctorApi from "../../services/api/doctor.api";
import type { Schedule, UpdateScheduleRequest } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import ScheduleFormModal from "../common/ScheduleFormModal";
import { theme } from "../../styles/theme";

const Container = styled.div`
  width: 100%;
`;

const ControlsCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
  box-shadow: ${theme.colors.shadow.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing[4]};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const NavButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid ${theme.colors.gray[300]};
  background: white;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    border-color: ${theme.colors.primary.teal};
    color: ${theme.colors.primary.teal};
    background: ${theme.colors.primary.teal}10;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .react-datepicker-wrapper {
    width: 200px;
  }

  input {
    width: 100%;
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    border: 2px solid ${theme.colors.gray[300]};
    border-radius: ${theme.borderRadius.lg};
    font-size: ${theme.typography.fontSize.base};
    cursor: pointer;
    transition: all ${theme.transitions.duration.fast}
      ${theme.transitions.easing.default};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.teal};
      box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
    }
  }
`;

const CreateButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: ${theme.colors.primary.teal};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    background: ${theme.colors.primary.dark};
    transform: translateY(-2px);
    box-shadow: ${theme.colors.shadow.md};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.colors.shadow.sm};
  overflow: hidden;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background: ${theme.colors.gray[50]};
    border-bottom: 2px solid ${theme.colors.gray[200]};

    th {
      padding: ${theme.spacing[4]} ${theme.spacing[3]};
      text-align: left;
      font-size: ${theme.typography.fontSize.sm};
      font-weight: ${theme.typography.fontWeight.semibold};
      color: ${theme.colors.text.secondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${theme.colors.gray[200]};
      transition: background ${theme.transitions.duration.fast}
        ${theme.transitions.easing.default};

      &:hover {
        background: ${theme.colors.gray[50]};
      }

      td {
        padding: ${theme.spacing[4]} ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
        color: ${theme.colors.text.primary};
      }
    }
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: capitalize;

  ${({ $status }) => {
    switch ($status?.toLowerCase()) {
      case "scheduled":
      case "available":
        return `
          background: #10B98115;
          color: #10B981;
        `;
      case "booked":
        return `
          background: #F59E0B15;
          color: #F59E0B;
        `;
      case "cancelled":
        return `
          background: #EF444415;
          color: #EF4444;
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.text.secondary};
        `;
    }
  }}

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ActionButton = styled(motion.button)<{ $variant?: "edit" | "delete" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  ${({ $variant }) =>
    $variant === "delete"
      ? `
    background: #EF444415;
    color: #EF4444;
    &:hover:not(:disabled) {
      background: #EF4444;
      color: white;
    }
  `
      : `
    background: ${theme.colors.primary.teal}15;
    color: ${theme.colors.primary.teal};
    &:hover:not(:disabled) {
      background: ${theme.colors.primary.teal};
      color: white;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]} ${theme.spacing[6]};
  color: ${theme.colors.text.secondary};

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: ${theme.spacing[4]};
    opacity: 0.3;
  }

  h3 {
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing[2]};
  }

  p {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.lg};
`;

const ModernDoctorScheduleView: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingSchedule, setEditingSchedule] = useState<
    UpdateScheduleRequest | undefined
  >(undefined);
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);

  // Find current doctor ID
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
        } catch {
          setCurrentDoctorId(null);
        }
      };

      findDoctorId();
    } else {
      setCurrentDoctorId(null);
    }
  }, [user]);

  const fetchSchedules = useCallback(async () => {
    if (!currentDoctorId) return;

    setIsLoading(true);
    try {
      const data = await scheduleApi.getAllSchedulesForAdmin();
      const doctorSchedules = data.filter(
        (schedule) => schedule.DoctorId === currentDoctorId
      );
      setSchedules(doctorSchedules);
    } catch (err) {
      const error = err as Error;
      showNotification(
        "error",
        "Error",
        error.message || "Failed to load schedules"
      );
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentDoctorId, showNotification]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const filteredSchedules = schedules.filter((schedule) => {
    if (selectedDate) {
      const scheduleDate = new Date(schedule.WorkDate).toDateString();
      const filterDate = selectedDate.toDateString();
      if (scheduleDate !== filterDate) return false;
    }
    return schedule.IsActive === true;
  });

  const handleCreate = () => {
    setModalMode("create");
    setEditingSchedule(undefined);
    setShowModal(true);
  };

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
    } catch (err) {
      const error = err as Error;
      showNotification(
        "error",
        "Delete Failed",
        error.message || "Failed to delete schedule"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const handleModalSubmit = () => {
    setShowModal(false);
    fetchSchedules();
  };

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

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "N/A";
    try {
      return timeString.substring(0, 5);
    } catch {
      return timeString;
    }
  };

  if (isLoading && schedules.length === 0) {
    return (
      <Container>
        <LoadingState>Loading schedules...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <ControlsCard>
        <DateNavigation>
          <NavButton
            onClick={goToPreviousDay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft />
          </NavButton>
          <DatePickerWrapper>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date"
              isClearable
            />
          </DatePickerWrapper>
          <NavButton
            onClick={goToNextDay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight />
          </NavButton>
        </DateNavigation>

        <CreateButton
          onClick={handleCreate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus />
          Create Schedule
        </CreateButton>
      </ControlsCard>

      <TableCard>
        <TableContainer>
          <Table>
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
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState>
                      <Calendar />
                      <h3>No schedules found</h3>
                      <p>Create a new schedule to get started</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule, index) => (
                  <tr key={schedule.ScheduleId}>
                    <td>{index + 1}</td>
                    <td>
                      {new Date(schedule.WorkDate).toLocaleDateString("en-GB")}
                    </td>
                    <td>{formatTime(schedule.StartTime)}</td>
                    <td>{formatTime(schedule.EndTime)}</td>
                    <td>
                      <StatusBadge $status={schedule.Status || ""}>
                        <Clock />
                        {schedule.Status}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton
                          $variant="edit"
                          onClick={() => handleEdit(schedule)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit />
                        </ActionButton>
                        <ActionButton
                          $variant="delete"
                          onClick={() =>
                            schedule.ScheduleId &&
                            handleDelete(schedule.ScheduleId, schedule.WorkDate)
                          }
                          disabled={isDeleting === schedule.ScheduleId}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 />
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
      </TableCard>

      {showModal && (
        <ScheduleFormModal
          mode={modalMode}
          initialData={editingSchedule}
          currentDoctorId={currentDoctorId || undefined}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </Container>
  );
};

export default ModernDoctorScheduleView;
