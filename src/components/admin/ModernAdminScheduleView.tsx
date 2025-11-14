import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileDown,
  Calendar,
  Clock,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import scheduleApi from "../../services/api/schedule.api";
import type { Schedule } from "../../types";
import { useNotification } from "../../contexts/NotificationContext";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { exportSchedulesToExcel } from "../../utils/excelExport";
import { theme } from "../../styles/theme";

const Container = styled.div`
  width: 100%;
`;

const FiltersCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
  box-shadow: ${theme.colors.shadow.sm};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${theme.spacing[4]};
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.tertiary};
  width: 20px;
  height: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]}
    calc(${theme.spacing[4]} + 32px);
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
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

const TableCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.colors.shadow.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing[6]};
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

      /* Sticky first column (No.) */
      &:first-of-type {
        position: sticky;
        left: 0;
        z-index: 2;
        background: ${theme.colors.gray[50]};
      }

      /* Sticky second column (Doctor) */
      &:nth-of-type(2) {
        position: sticky;
        left: 60px;
        z-index: 2;
        background: ${theme.colors.gray[50]};
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${theme.colors.gray[200]};
      transition: background ${theme.transitions.duration.fast}
        ${theme.transitions.easing.default};

      &:hover {
        background: ${theme.colors.gray[50]};

        td:first-of-type,
        td:nth-of-type(2) {
          background: ${theme.colors.gray[50]};
        }
      }

      td {
        padding: ${theme.spacing[4]} ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
        color: ${theme.colors.text.primary};

        /* Sticky first column (No.) */
        &:first-of-type {
          position: sticky;
          left: 0;
          z-index: 1;
          background: white;
          font-weight: ${theme.typography.fontWeight.medium};
          min-width: 60px;
        }

        /* Sticky second column (Doctor) */
        &:nth-of-type(2) {
          position: sticky;
          left: 60px;
          z-index: 1;
          background: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
          font-weight: ${theme.typography.fontWeight.semibold};
          min-width: 180px;
        }
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
      case "unavailable":
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

const ActionButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: #ef444415;
  color: #ef4444;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: #ef4444;
    color: white;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ExportButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border: 2px solid ${theme.colors.primary.teal};
  background: white;
  color: ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.primary.teal};
    color: white;
    transform: translateY(-2px);
    box-shadow: ${theme.colors.shadow.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[6]};
  border-top: 2px solid ${theme.colors.gray[200]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${theme.spacing[4]};
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

const ErrorState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.error};
  font-size: ${theme.typography.fontSize.lg};
`;

const ModernAdminScheduleView: React.FC = () => {
  const { showNotification } = useNotification();

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await scheduleApi.getAllSchedulesForAdmin();
      setSchedules(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to load schedules.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = async (
    scheduleId: number,
    doctorName: string | undefined,
    workDate: string
  ) => {
    const confirmMessage = `Are you sure you want to delete this schedule?\n\nDoctor: ${
      doctorName || `ID ${scheduleId}`
    }\nDate: ${new Date(workDate).toLocaleDateString(
      "en-GB"
    )}\n\nThis action cannot be undone.`;

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
        error.message || "Failed to delete schedule. Please try again."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // Filter by doctor name
      if (searchQuery && schedule.DoctorName) {
        const nameMatch = schedule.DoctorName.toLowerCase().includes(
          searchQuery.toLowerCase()
        );
        if (!nameMatch) return false;
      }

      // Filter by date
      if (selectedDate) {
        const scheduleDate = new Date(schedule.WorkDate).toDateString();
        const filterDate = selectedDate.toDateString();
        if (scheduleDate !== filterDate) return false;
      }

      // Filter active only
      return schedule.IsActive === true;
    });
  }, [schedules, searchQuery, selectedDate]);

  const pagination = usePagination(filteredSchedules, 10);

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
      return timeString.substring(0, 5); // HH:mm
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

  if (error && schedules.length === 0) {
    return (
      <Container>
        <ErrorState>Error: {error}</ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <FiltersCard>
        <FiltersGrid>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <DateNavigation>
            <NavButton
              onClick={goToPreviousDay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Previous Day"
            >
              <ChevronLeft />
            </NavButton>
            <DatePickerWrapper>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="All Dates"
                isClearable
              />
            </DatePickerWrapper>
            <NavButton
              onClick={goToNextDay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Next Day"
            >
              <ChevronRight />
            </NavButton>
          </DateNavigation>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Doctor</th>
                <th>Work Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState>
                      <Calendar />
                      <h3>No schedules found</h3>
                      <p>Try adjusting your search criteria or date filter</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                pagination.currentItems.map((schedule, index) => (
                  <tr
                    key={`${schedule.ScheduleId}-${schedule.DoctorId}-${schedule.WorkDate}`}
                  >
                    <td>{pagination.startIndex + index}</td>
                    <td>
                      {schedule.DoctorName || `Doctor ID: ${schedule.DoctorId}`}
                    </td>
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
                      <ActionButton
                        onClick={() => {
                          if (schedule.ScheduleId) {
                            handleDelete(
                              schedule.ScheduleId,
                              schedule.DoctorName,
                              schedule.WorkDate
                            );
                          }
                        }}
                        disabled={
                          isDeleting === schedule.ScheduleId ||
                          !schedule.ScheduleId
                        }
                        whileHover={{
                          scale:
                            isDeleting !== schedule.ScheduleId &&
                            schedule.ScheduleId
                              ? 1.1
                              : 1,
                        }}
                        whileTap={{
                          scale:
                            isDeleting !== schedule.ScheduleId &&
                            schedule.ScheduleId
                              ? 0.9
                              : 1,
                        }}
                        title={
                          schedule.ScheduleId
                            ? "Delete Schedule"
                            : "Schedule ID missing"
                        }
                      >
                        <Trash2 />
                      </ActionButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>

        <TableFooter>
          <ExportButton
            onClick={() =>
              exportSchedulesToExcel(filteredSchedules, "lich_lam_viec")
            }
            disabled={filteredSchedules.length === 0}
            whileHover={{
              scale: filteredSchedules.length > 0 ? 1.02 : 1,
            }}
            whileTap={{
              scale: filteredSchedules.length > 0 ? 0.98 : 1,
            }}
          >
            <FileDown />
            Export Excel
          </ExportButton>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPreviousPage={pagination.goToPreviousPage}
            onNextPage={pagination.goToNextPage}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            itemName="schedules"
          />
        </TableFooter>
      </TableCard>
    </Container>
  );
};

export default ModernAdminScheduleView;
