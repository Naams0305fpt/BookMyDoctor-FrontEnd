import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import doctorApi from "../../services/api/doctor.api";
import { formatDateForAPI } from "../../services/http-client";
import type { DoctorAppointment, UpdateAppointmentRequest } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { theme } from "../../styles/theme";
import * as XLSX from "xlsx";

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
  grid-template-columns: 1fr 1fr auto auto auto;
  gap: ${theme.spacing[4]};
  align-items: end;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
`;

const SearchInputWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: ${theme.spacing[4]};
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${theme.colors.text.secondary};
    pointer-events: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]} 48px;
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
  align-items: end;
  gap: ${theme.spacing[2]};
`;

const NavButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
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

const ExportButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  background: white;
  color: ${theme.colors.primary.teal};
  border: 2px solid ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};
  white-space: nowrap;

  &:hover {
    background: ${theme.colors.primary.teal};
    color: white;
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
  max-height: 600px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;

  thead {
    background: ${theme.colors.gray[50]};
    border-bottom: 2px solid ${theme.colors.gray[200]};
    position: sticky;
    top: 0;
    z-index: 3;

    th {
      padding: ${theme.spacing[4]} ${theme.spacing[3]};
      text-align: left;
      font-size: ${theme.typography.fontSize.sm};
      font-weight: ${theme.typography.fontWeight.semibold};
      color: ${theme.colors.text.secondary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;

      &:first-of-type {
        position: sticky;
        left: 0;
        z-index: 2;
        background: ${theme.colors.gray[50]};
        min-width: 60px;
      }

      &:nth-of-type(2) {
        position: sticky;
        left: 60px;
        z-index: 2;
        background: ${theme.colors.gray[50]};
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
        min-width: 180px;
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
      }

      &.edit-mode {
        background: ${theme.colors.primary.teal}10;
      }

      td {
        padding: ${theme.spacing[4]} ${theme.spacing[3]};
        font-size: ${theme.typography.fontSize.sm};
        color: ${theme.colors.text.primary};

        &:first-of-type {
          position: sticky;
          left: 0;
          z-index: 1;
          background: white;
          font-weight: ${theme.typography.fontWeight.semibold};
        }

        &:nth-of-type(2) {
          position: sticky;
          left: 60px;
          z-index: 1;
          background: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
          font-weight: ${theme.typography.fontWeight.medium};
        }
      }

      &:hover td:first-of-type,
      &:hover td:nth-of-type(2) {
        background: ${theme.colors.gray[50]};
      }

      &.edit-mode td:first-of-type,
      &.edit-mode td:nth-of-type(2) {
        background: ${theme.colors.primary.teal}10;
      }
    }
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 2px solid ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
  }
`;

const EditSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border: 2px solid ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
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
      case "completed":
        return `
          background: #10B98115;
          color: #10B981;
        `;
      case "scheduled":
      case "pending":
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

const ActionButton = styled(motion.button)<{
  $variant?: "edit" | "delete" | "save" | "cancel";
}>`
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

  ${({ $variant }) => {
    switch ($variant) {
      case "delete":
      case "cancel":
        return `
          background: #EF444415;
          color: #EF4444;
          &:hover:not(:disabled) {
            background: #EF4444;
            color: white;
          }
        `;
      case "save":
        return `
          background: #10B98115;
          color: #10B981;
          &:hover:not(:disabled) {
            background: #10B981;
            color: white;
          }
        `;
      default:
        return `
          background: ${theme.colors.primary.teal}15;
          color: ${theme.colors.primary.teal};
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.teal};
            color: white;
          }
        `;
    }
  }}

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

interface Appointment {
  id: number;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  symptom: string;
  prescription: string;
  status: "pending" | "completed" | "cancelled";
  appointHour?: string;
  appointDate?: string;
}

interface TableRowProps {
  appointment: Appointment;
  index: number;
  onUpdate: (
    id: number,
    symptom: string,
    prescription: string,
    status: Appointment["status"]
  ) => void;
  onDelete: (id: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  appointment,
  index,
  onUpdate,
  onDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempSymptom, setTempSymptom] = useState(appointment.symptom);
  const [tempPrescription, setTempPrescription] = useState(
    appointment.prescription
  );
  const [tempStatus, setTempStatus] = useState(appointment.status);

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
    setTempSymptom(appointment.symptom);
    setTempPrescription(appointment.prescription);
    setTempStatus(appointment.status);
    setIsEditMode(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle />;
      case "cancelled":
        return <XCircle />;
      default:
        return <Clock />;
    }
  };

  return (
    <tr className={isEditMode ? "edit-mode" : ""}>
      <td>{index + 1}</td>
      <td>{appointment.fullName}</td>
      <td>{appointment.dateOfBirth.toLocaleDateString("en-GB")}</td>
      <td>{appointment.gender}</td>
      <td>{appointment.phone}</td>
      <td>{appointment.appointHour || "N/A"}</td>
      <td>
        {isEditMode ? (
          <EditInput
            type="text"
            value={tempSymptom}
            onChange={(e) => setTempSymptom(e.target.value)}
          />
        ) : (
          appointment.symptom || "N/A"
        )}
      </td>
      <td>
        {isEditMode ? (
          <EditInput
            type="text"
            value={tempPrescription}
            onChange={(e) => setTempPrescription(e.target.value)}
          />
        ) : (
          appointment.prescription || "N/A"
        )}
      </td>
      <td>
        {isEditMode ? (
          <EditSelect
            value={tempStatus}
            onChange={(e) =>
              setTempStatus(e.target.value as Appointment["status"])
            }
          >
            <option value="pending">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </EditSelect>
        ) : (
          <StatusBadge $status={appointment.status}>
            {getStatusIcon(appointment.status)}
            {appointment.status}
          </StatusBadge>
        )}
      </td>
      <td>
        <ActionButtons>
          {isEditMode ? (
            <>
              <ActionButton
                $variant="save"
                onClick={handleSave}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Save />
              </ActionButton>
              <ActionButton
                $variant="cancel"
                onClick={handleCancel}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                $variant="edit"
                onClick={() => setIsEditMode(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit />
              </ActionButton>
              <ActionButton
                $variant="delete"
                onClick={() => onDelete(appointment.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 />
              </ActionButton>
            </>
          )}
        </ActionButtons>
      </td>
    </tr>
  );
};

const ModernAppointmentTable: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchAppointments = useCallback(
    async (patientName: string, date: Date | null, status: string) => {
      setIsLoading(true);
      try {
        const doctorIdParam =
          user?.userType === "doctor" && user?.doctorId
            ? user.doctorId
            : undefined;

        const data = await doctorApi.getDoctorAppointments(
          doctorIdParam,
          patientName || undefined,
          undefined
        );

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
      } catch (err) {
        const error = err as Error;
        showNotification(
          "error",
          "Error",
          error.message || "Failed to load appointments"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [user, showNotification]
  );

  const pagination = usePagination(appointments, 10);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchAppointments(searchQuery, selectedDate, selectedStatus);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery, selectedDate, selectedStatus, fetchAppointments]);

  const handleUpdate = async (
    id: number,
    symptom: string,
    prescription: string,
    status: Appointment["status"]
  ) => {
    try {
      const appointment = appointments.find((apt) => apt.AppointId === id);
      if (!appointment) return;

      const apiStatus =
        status === "pending"
          ? "Scheduled"
          : status === "completed"
          ? "Completed"
          : "Cancelled";

      const updateData: UpdateAppointmentRequest = {
        Status: apiStatus,
        Symptoms: symptom,
        Prescription: prescription,
      };

      await doctorApi.updateAppointment(
        appointment.PatientId,
        appointment.AppointDate,
        appointment.AppointHour,
        appointment.AppointId,
        updateData
      );

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

      showNotification(
        "success",
        "Updated Successfully",
        "Appointment information has been updated."
      );
    } catch (err) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMessage = error.response?.data?.message || error.message || "";

      if (
        errorMessage.includes("Không có thông tin nào để cập nhật") ||
        errorMessage.includes("No information to update")
      ) {
        showNotification(
          "warning",
          "No Changes Detected",
          "No changes were made to the appointment information."
        );
      } else {
        showNotification(
          "error",
          "Update Failed",
          errorMessage || "Failed to update appointment information"
        );
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      setAppointments((prev) => prev.filter((apt) => apt.AppointId !== id));
      showNotification(
        "success",
        "Deleted Successfully",
        "Appointment has been deleted."
      );
    } catch (err) {
      const error = err as Error;
      showNotification(
        "error",
        "Delete Failed",
        error.message || "Failed to delete appointment"
      );
    }
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

  const exportToExcel = () => {
    const exportData = appointments.map((apt, index) => ({
      No: index + 1,
      "Full Name": apt.FullName,
      "Date of Birth": new Date(apt.DateOfBirth).toLocaleDateString("en-GB"),
      Gender: apt.Gender,
      Phone: apt.PhoneNumber,
      "Appointment Hour": apt.AppointHour,
      Symptoms: apt.Symptoms || "N/A",
      Prescription: apt.Prescription || "N/A",
      Status: apt.Status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

    const fileName = `Appointments_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);

    showNotification(
      "success",
      "Export Successful",
      `Appointments exported to ${fileName}`
    );
  };

  const mapApiStatusToComponentStatus = (
    apiStatus: DoctorAppointment["Status"]
  ): Appointment["status"] => {
    switch (apiStatus) {
      case "Completed":
        return "completed";
      case "Cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const mappedAppointments: Appointment[] = appointments.map((apt) => ({
    id: apt.AppointId,
    fullName: apt.FullName,
    dateOfBirth: new Date(apt.DateOfBirth),
    gender: apt.Gender,
    phone: apt.PhoneNumber,
    symptom: apt.Symptoms || "",
    prescription: apt.Prescription || "",
    status: mapApiStatusToComponentStatus(apt.Status),
    appointHour: apt.AppointHour,
    appointDate: apt.AppointDate,
  }));

  const paginatedAppointments = mappedAppointments.slice(
    pagination.startIndex - 1,
    pagination.endIndex
  );

  if (isLoading && appointments.length === 0) {
    return (
      <Container>
        <LoadingState>Loading appointments...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <FiltersCard>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Search Patient</FilterLabel>
            <SearchInputWrapper>
              <Search />
              <SearchInput
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Filter by Status</FilterLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </FilterGroup>

          <DateNavigation>
            <NavButton
              onClick={goToPreviousDay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft />
            </NavButton>
            <FilterGroup>
              <FilterLabel>Appointment Date</FilterLabel>
              <DatePickerWrapper>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="All dates"
                  isClearable
                />
              </DatePickerWrapper>
            </FilterGroup>
            <NavButton
              onClick={goToNextDay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight />
            </NavButton>
          </DateNavigation>

          <div style={{ alignSelf: "end" }}>
            <ExportButton
              onClick={exportToExcel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download />
              Export
            </ExportButton>
          </div>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Appointment Hour</th>
                <th>Symptoms</th>
                <th>Prescription</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState>
                      <Calendar />
                      <h3>No appointments found</h3>
                      <p>No appointments match your current filters</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map(
                  (appointment: Appointment, index: number) => (
                    <TableRow
                      key={appointment.id}
                      appointment={appointment}
                      index={pagination.startIndex - 1 + index}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  )
                )
              )}
            </tbody>
          </Table>
        </TableContainer>

        {mappedAppointments.length > 0 && (
          <div style={{ padding: theme.spacing[6] }}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPreviousPage={pagination.goToPreviousPage}
              onNextPage={pagination.goToNextPage}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              itemName="appointments"
            />
          </div>
        )}
      </TableCard>
    </Container>
  );
};

export default ModernAppointmentTable;
