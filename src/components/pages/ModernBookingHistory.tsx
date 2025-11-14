import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Ban,
  FileDown,
  Search,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import bookingApi from "../../services/api/booking.api";
import type { MyHistoryResponse } from "../../types";
import { useNotification } from "../../contexts/NotificationContext";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { exportBookingHistoryToExcel } from "../../utils/excelExport";
import { theme } from "../../styles/theme";
import { Card } from "../../styles/components";

interface Booking {
  id: number;
  patientName: string;
  doctorName: string;
  doctorPhone: string;
  department: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: "completed" | "scheduled" | "cancelled";
  symptom: string;
  prescription?: string;
}

const PageContainer = styled.div`
  max-width: ${theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
  padding-top: calc(80px + ${theme.spacing[8]});
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: ${theme.spacing[6]} ${theme.spacing[4]};
    padding-top: calc(70px + ${theme.spacing[6]});
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing[8]};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize["4xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.accent.navy};
  margin-bottom: ${theme.spacing[2]};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing[4]};
  }
`;

const StatCard = styled(motion.div)<{ variant: string }>`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.colors.shadow.sm};
  border-left: 4px solid
    ${({ variant }) =>
      variant === "total"
        ? theme.colors.primary.teal
        : variant === "completed"
        ? "#10B981"
        : variant === "scheduled"
        ? "#F59E0B"
        : "#EF4444"};
  transition: all ${theme.transitions.duration.normal}
    ${theme.transitions.easing.default};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.colors.shadow.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
`;

const StatIcon = styled.div<{ variant: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ variant }) =>
    variant === "total"
      ? `${theme.colors.primary.teal}15`
      : variant === "completed"
      ? "#10B98115"
      : variant === "scheduled"
      ? "#F59E0B15"
      : "#EF444415"};
  color: ${({ variant }) =>
    variant === "total"
      ? theme.colors.primary.teal
      : variant === "completed"
      ? "#10B981"
      : variant === "scheduled"
      ? "#F59E0B"
      : "#EF4444"};
`;

const StatValue = styled.h3`
  font-size: ${theme.typography.fontSize["3xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  line-height: 1;
`;

const StatLabel = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const FiltersCard = styled(Card)`
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: ${theme.spacing[4]};
  align-items: end;

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

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  background: white;
  cursor: pointer;
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
  gap: ${theme.spacing[2]};
`;

const DateButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  border: 2px solid ${theme.colors.gray[300]};
  background: white;
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    border-color: ${theme.colors.primary.teal};
    background: ${theme.colors.primary.teal}10;
    color: ${theme.colors.primary.teal};
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

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.teal};
      box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
    }
  }
`;

const TableCard = styled(Card)`
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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.pill};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  background: ${({ status }) =>
    status === "completed"
      ? "#10B98115"
      : status === "scheduled"
      ? "#F59E0B15"
      : "#EF444415"};
  color: ${({ status }) =>
    status === "completed"
      ? "#10B981"
      : status === "scheduled"
      ? "#F59E0B"
      : "#EF4444"};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButton = styled(motion.button)<{ variant?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  background: ${({ variant }) =>
    variant === "danger" ? "#EF4444" : theme.colors.primary.teal};
  color: white;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: ${({ variant }) =>
      variant === "danger" ? "#DC2626" : theme.colors.primary.dark};
    transform: translateY(-2px);
    box-shadow: ${theme.colors.shadow.md};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
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

const ModernBookingHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "scheduled" | "cancelled"
  >("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const canCancelBooking = (
    appointDate: Date,
    appointTime: string
  ): boolean => {
    const [hours, minutes] = appointTime.split(":").map(Number);
    const appointmentDateTime = new Date(appointDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  const mapApiStatus = (apiStatus: string): Booking["status"] => {
    const lowerStatus = apiStatus.toLowerCase();
    switch (lowerStatus) {
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      case "scheduled":
        return "scheduled";
      default:
        return "scheduled";
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiData = await bookingApi.getMyHistory();
      const formattedBookings: Booking[] = apiData.map(
        (item: MyHistoryResponse) => ({
          id: item.AppointId,
          patientName: item.NamePatient,
          doctorName: item.NameDoctor,
          doctorPhone: item.PhoneDoctor,
          department: item.Department,
          appointmentDate: new Date(item.AppointDate),
          appointmentTime: item.AppointHour.substring(0, 5),
          status: mapApiStatus(item.Status),
          symptom: item.Symptoms,
          prescription:
            item.Prescription && item.Prescription.toLowerCase() !== "không có"
              ? item.Prescription
              : undefined,
        })
      );
      setBookings(formattedBookings);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load booking history";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (
    appointId: number,
    appointDate: Date,
    appointTime: string,
    doctorName: string
  ) => {
    if (!canCancelBooking(appointDate, appointTime)) {
      showNotification(
        "warning",
        "Cannot Cancel Appointment",
        "Appointments can only be cancelled at least 24 hours in advance. Please contact the clinic directly for urgent changes.",
        6000
      );
      return;
    }

    const appointmentInfo = `${appointDate.toLocaleDateString(
      "en-GB"
    )} at ${appointTime} with Dr. ${doctorName}`;
    if (
      !window.confirm(
        `Are you sure you want to cancel this appointment?\n\n${appointmentInfo}\n\nNote: Cancellations must be made at least 24 hours before the scheduled time.`
      )
    ) {
      return;
    }

    try {
      const response = await bookingApi.cancelBooking(appointId);
      showNotification(
        "success",
        "Appointment Cancelled",
        response.message || "Your appointment has been successfully cancelled.",
        4000
      );
      fetchHistory();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to cancel appointment. Please try again.";
      showNotification("error", "Cancellation Failed", errorMessage, 5000);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesDate =
        !selectedDate ||
        booking.appointmentDate.toDateString() === selectedDate.toDateString();
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime());

  const pagination = usePagination(filteredBookings, 10);

  if (!isAuthenticated || user?.userType !== "patient") {
    return <Navigate to="/" replace />;
  }

  const goToPreviousDay = () => {
    const currentDate = selectedDate || new Date();
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const currentDate = selectedDate || new Date();
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const stats = {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === "completed").length,
    scheduled: bookings.filter((b) => b.status === "scheduled").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle />;
      case "scheduled":
        return <Clock />;
      case "cancelled":
        return <XCircle />;
      default:
        return <Calendar />;
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState>Loading booking history...</LoadingState>
      </PageContainer>
    );
  }

  if (error && !isLoading) {
    return (
      <PageContainer>
        <ErrorState>Error: {error}</ErrorState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Booking History</PageTitle>
        <PageSubtitle>View and manage your medical appointments</PageSubtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard variant="total" whileHover={{ scale: 1.02 }}>
          <StatHeader>
            <StatIcon variant="total">
              <Calendar size={24} />
            </StatIcon>
            <StatValue>{stats.total}</StatValue>
          </StatHeader>
          <StatLabel>Total Bookings</StatLabel>
        </StatCard>

        <StatCard variant="completed" whileHover={{ scale: 1.02 }}>
          <StatHeader>
            <StatIcon variant="completed">
              <CheckCircle size={24} />
            </StatIcon>
            <StatValue>{stats.completed}</StatValue>
          </StatHeader>
          <StatLabel>Completed</StatLabel>
        </StatCard>

        <StatCard variant="scheduled" whileHover={{ scale: 1.02 }}>
          <StatHeader>
            <StatIcon variant="scheduled">
              <Clock size={24} />
            </StatIcon>
            <StatValue>{stats.scheduled}</StatValue>
          </StatHeader>
          <StatLabel>Scheduled</StatLabel>
        </StatCard>

        <StatCard variant="cancelled" whileHover={{ scale: 1.02 }}>
          <StatHeader>
            <StatIcon variant="cancelled">
              <XCircle size={24} />
            </StatIcon>
            <StatValue>{stats.cancelled}</StatValue>
          </StatHeader>
          <StatLabel>Cancelled</StatLabel>
        </StatCard>
      </StatsGrid>

      <FiltersCard>
        <FiltersGrid>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by doctor name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "all"
                  | "completed"
                  | "scheduled"
                  | "cancelled"
              )
            }
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <DateNavigation>
            <DateButton onClick={goToPreviousDay}>
              <ChevronLeft size={20} />
            </DateButton>
            <DatePickerWrapper>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                isClearable
              />
            </DatePickerWrapper>
            <DateButton onClick={goToNextDay}>
              <ChevronRight size={20} />
            </DateButton>
          </DateNavigation>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Symptom</th>
                <th>Prescription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.currentItems.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <EmptyState>
                      <Calendar />
                      <h3>No bookings found</h3>
                      <p>Try adjusting your filters or search criteria</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                pagination.currentItems.map((booking, index) => {
                  const canCancel = canCancelBooking(
                    booking.appointmentDate,
                    booking.appointmentTime
                  );
                  const isCancellable =
                    booking.status === "scheduled" && canCancel;

                  return (
                    <tr key={booking.id}>
                      <td>{pagination.startIndex + index}</td>
                      <td>{booking.patientName}</td>
                      <td>{booking.doctorName}</td>
                      <td>{booking.doctorPhone}</td>
                      <td>{booking.department}</td>
                      <td>
                        {booking.appointmentDate.toLocaleDateString("en-GB")}
                      </td>
                      <td>{booking.appointmentTime}</td>
                      <td>
                        <StatusBadge status={booking.status}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td>{booking.symptom}</td>
                      <td>{booking.prescription || "-"}</td>
                      <td>
                        {booking.status === "scheduled" ? (
                          <ActionButton
                            variant="danger"
                            onClick={() =>
                              handleCancelBooking(
                                booking.id,
                                booking.appointmentDate,
                                booking.appointmentTime,
                                booking.doctorName
                              )
                            }
                            disabled={!isCancellable}
                            whileHover={{ scale: isCancellable ? 1.05 : 1 }}
                            whileTap={{ scale: isCancellable ? 0.95 : 1 }}
                            title={
                              isCancellable
                                ? "Cancel this appointment"
                                : "Cannot cancel: Must be at least 24 hours before appointment"
                            }
                          >
                            <Ban size={16} />
                            Cancel
                          </ActionButton>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableContainer>

        <TableFooter>
          <ExportButton
            onClick={() => {
              const exportData: MyHistoryResponse[] = filteredBookings.map(
                (b) => ({
                  AppointId: b.id,
                  NamePatient: b.patientName,
                  NameDoctor: b.doctorName,
                  PhoneDoctor: b.doctorPhone,
                  Department: b.department,
                  AppointDate: b.appointmentDate.toISOString().split("T")[0],
                  AppointHour: b.appointmentTime,
                  Status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                  Symptoms: b.symptom,
                  Prescription: b.prescription || "",
                })
              );
              exportBookingHistoryToExcel(exportData, "lich_su_dat_kham");
            }}
            disabled={filteredBookings.length === 0}
            whileHover={{ scale: filteredBookings.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: filteredBookings.length > 0 ? 0.98 : 1 }}
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
            itemName="bookings"
          />
        </TableFooter>
      </TableCard>
    </PageContainer>
  );
};

export default ModernBookingHistory;
