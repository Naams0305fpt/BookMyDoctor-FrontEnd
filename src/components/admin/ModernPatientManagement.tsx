import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  Search,
  FileDown,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import patientApi from "../../services/api/patient.api";
import type { Patient } from "../../types";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { exportPatientsToExcel } from "../../utils/excelExport";
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
    background: ${theme.colors.primary.teal};
    border-bottom: 2px solid ${theme.colors.primary.dark};

    th {
      padding: ${theme.spacing[4]} ${theme.spacing[3]};
      text-align: left;
      font-size: ${theme.typography.fontSize.sm};
      font-weight: ${theme.typography.fontWeight.semibold};
      color: ${theme.colors.text.inverse};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;

      /* Sticky first column (No.) */
      &:first-of-type {
        position: sticky;
        left: 0;
        z-index: 2;
        background: ${theme.colors.primary.teal};
      }

      /* Sticky second column (Full Name) */
      &:nth-of-type(2) {
        position: sticky;
        left: 60px; /* Width of No. column */
        z-index: 2;
        background: ${theme.colors.primary.teal};
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

        /* Keep sticky columns background on hover */
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

        /* Sticky second column (Full Name) */
        &:nth-of-type(2) {
          position: sticky;
          left: 60px; /* Width of No. column */
          z-index: 1;
          background: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
          font-weight: ${theme.typography.fontWeight.semibold};
          min-width: 150px;
        }
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
    status === "Completed"
      ? "#10B98115"
      : status === "Scheduled"
      ? "#F59E0B15"
      : "#EF444415"};
  color: ${({ status }) =>
    status === "Completed"
      ? "#10B981"
      : status === "Scheduled"
      ? "#F59E0B"
      : "#EF4444"};

  svg {
    width: 14px;
    height: 14px;
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

const ModernPatientManagement: React.FC = () => {
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Client-side filtering
  const filteredPatients = allPatients.filter((patient) => {
    // Filter by search query (name or phone)
    const matchesSearch =
      !searchQuery ||
      patient.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.PhoneNumber.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus = !selectedStatus || patient.Status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filteredPatients, 10);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all patients without filters
      const data = await patientApi.getAllPatients("", "", "");
      setAllPatients(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to fetch patients.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getStatusIcon = (status: Patient["Status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle />;
      case "Scheduled":
        return <Clock />;
      case "Cancelled":
        return <XCircle />;
      default:
        return <Clock />;
    }
  };

  if (isLoading && allPatients.length === 0) {
    return (
      <Container>
        <LoadingState>Loading patients...</LoadingState>
      </Container>
    );
  }

  if (error && allPatients.length === 0) {
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
              placeholder="Search by patient name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
        </FiltersGrid>
      </FiltersCard>

      <TableCard>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Symptom</th>
                <th>Prescription</th>
              </tr>
            </thead>
            <tbody>
              {pagination.currentItems.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <EmptyState>
                      <User />
                      <h3>No patients found</h3>
                      <p>Try adjusting your filters or search criteria</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                pagination.currentItems.map((patient, index) => (
                  <tr
                    key={patient.id || `patient-${patient.Username}-${index}`}
                  >
                    <td>{pagination.startIndex + index}</td>
                    <td>{patient.FullName}</td>
                    <td>{patient.Username}</td>
                    <td>
                      {new Date(patient.DateOfBirth).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>{patient.Gender}</td>
                    <td>{patient.PhoneNumber}</td>
                    <td>{patient.Email || "N/A"}</td>
                    <td>{patient.Address}</td>
                    <td>
                      <StatusBadge status={patient.Status}>
                        {getStatusIcon(patient.Status)}
                        {patient.Status}
                      </StatusBadge>
                    </td>
                    <td>{patient.Symptoms}</td>
                    <td>{patient.Prescription}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>

        <TableFooter>
          <ExportButton
            onClick={() =>
              exportPatientsToExcel(filteredPatients, "danh_sach_benh_nhan")
            }
            disabled={filteredPatients.length === 0}
            whileHover={{ scale: filteredPatients.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: filteredPatients.length > 0 ? 0.98 : 1 }}
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
            itemName="patients"
          />
        </TableFooter>
      </TableCard>
    </Container>
  );
};

export default ModernPatientManagement;
