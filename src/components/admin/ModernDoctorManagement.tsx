import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Search, UserPlus, Trash2, FileDown, UserCog } from "lucide-react";
import ModernCreateDoctorModal from "./ModernCreateDoctorModal";
import { api } from "../../services/api";
import doctorApi from "../../services/api/doctor.api";
import type { Doctor } from "../../types";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../common/Pagination";
import { exportDoctorsToExcel } from "../../utils/excelExport";
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
  gap: ${theme.spacing[4]};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
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
  white-space: nowrap;
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
        left: 60px;
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
          left: 60px;
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

  &:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.1);
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

const ModernDoctorManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await doctorApi.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Could not load doctor list.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleCreateDoctor = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleDoctorCreated = () => {
    fetchDoctors();
  };

  const handleDelete = async (doctorId: number) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) {
      return;
    }
    try {
      await api.deleteDoctor(doctorId);
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.DoctorId !== doctorId)
      );
    } catch (err) {
      const error = err as Error;
      alert(`Error: ${error.message}`);
    }
  };

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

  const pagination = usePagination(filteredDoctors, 10);

  if (isLoading && doctors.length === 0) {
    return (
      <Container>
        <LoadingState>Loading doctors...</LoadingState>
      </Container>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <Container>
        <ErrorState>Error: {error}</ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <ControlsCard>
        <SearchWrapper>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search by name, email, department, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchWrapper>
        <CreateButton
          onClick={handleCreateDoctor}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus />
          Create Doctor
        </CreateButton>
      </ControlsCard>

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
                <th>Address</th>
                <th>Email</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagination.currentItems.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState>
                      <UserCog />
                      <h3>No doctors found</h3>
                      <p>Try adjusting your search criteria</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                pagination.currentItems.map((d, index) => (
                  <tr key={d.DoctorId}>
                    <td>{pagination.startIndex + index}</td>
                    <td>{d.Name}</td>
                    <td>
                      {new Date(d.DateOfBirth).toLocaleDateString("en-GB")}
                    </td>
                    <td>{d.Gender}</td>
                    <td>{d.Phone}</td>
                    <td>{d.Address}</td>
                    <td>{d.Email}</td>
                    <td>{d.Department}</td>
                    <td>{d.Experience_year} years</td>
                    <td>
                      <ActionButton
                        onClick={() => handleDelete(d.DoctorId)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete Doctor"
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
              exportDoctorsToExcel(filteredDoctors, "danh_sach_bac_si")
            }
            disabled={filteredDoctors.length === 0}
            whileHover={{ scale: filteredDoctors.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: filteredDoctors.length > 0 ? 0.98 : 1 }}
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
            itemName="doctors"
          />
        </TableFooter>
      </TableCard>

      {showCreateModal && (
        <ModernCreateDoctorModal
          onClose={handleCloseModal}
          onSubmit={handleDoctorCreated}
        />
      )}
    </Container>
  );
};

export default ModernDoctorManagement;
