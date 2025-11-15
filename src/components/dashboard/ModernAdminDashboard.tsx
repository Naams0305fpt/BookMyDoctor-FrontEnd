import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Users, UserCog, Calendar } from "lucide-react";
import ModernPatientManagement from "../admin/ModernPatientManagement";
import ModernDoctorManagement from "../admin/ModernDoctorManagement";
import ModernAdminScheduleView from "../admin/ModernAdminScheduleView";
import { theme } from "../../styles/theme";
import patientApi from "../../services/api/patient.api";
import doctorApi from "../../services/api/doctor.api";

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
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize["5xl"]};
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
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
      variant === "patients"
        ? theme.colors.primary.teal
        : variant === "doctors"
        ? "#8B5CF6"
        : variant === "appointments"
        ? "#F59E0B"
        : "#10B981"};
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
  width: 56px;
  height: 56px;
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ variant }) =>
    variant === "patients"
      ? `${theme.colors.primary.teal}15`
      : variant === "doctors"
      ? "#8B5CF615"
      : variant === "appointments"
      ? "#F59E0B15"
      : "#10B98115"};
  color: ${({ variant }) =>
    variant === "patients"
      ? theme.colors.primary.teal
      : variant === "doctors"
      ? "#8B5CF6"
      : variant === "appointments"
      ? "#F59E0B"
      : "#10B981"};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.h3`
  font-size: ${theme.typography.fontSize["3xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  line-height: 1;
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.colors.shadow.sm};
  overflow: hidden;
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 2px solid ${theme.colors.gray[200]};
  padding: 0 ${theme.spacing[6]};
  gap: ${theme.spacing[2]};

  @media (max-width: 768px) {
    overflow-x: auto;
    padding: 0 ${theme.spacing[4]};
  }
`;

const TabButton = styled(motion.button)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border: none;
  background: transparent;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.primary.teal : theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.primary.teal};
  }

  svg {
    width: 20px;
    height: 20px;
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 3px;
      background: ${theme.colors.primary.teal};
      border-radius: 3px 3px 0 0;
    }
  `}
`;

const TabContent = styled(motion.div)`
  padding: ${theme.spacing[6]};

  @media (max-width: 768px) {
    padding: ${theme.spacing[4]};
  }
`;

const ModernAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "patients" | "doctors" | "schedules"
  >("patients");

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [patientsData, doctorsData] = await Promise.all([
          patientApi.getAllPatients("", "", ""),
          doctorApi.getAllDoctors(),
        ]);

        const calculatedStats = {
          totalPatients: patientsData.length,
          totalDoctors: doctorsData.length,
        };

        setStats(calculatedStats);
      } catch (error) {
        // Failed to fetch dashboard stats
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const tabs = [
    { id: "patients" as const, label: "Patients", icon: Users },
    { id: "doctors" as const, label: "Doctors", icon: UserCog },
    { id: "schedules" as const, label: "Schedules", icon: Calendar },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Admin Dashboard</PageTitle>
        <PageSubtitle>
          Manage patients, doctors, and appointments from one place
        </PageSubtitle>
      </PageHeader>

      <StatsGrid>
        <StatCard variant="patients" whileHover={{ scale: 1.02 }}>
          <StatHeader>
            <StatIcon variant="patients">
              <Users size={28} />
            </StatIcon>
            <StatContent>
              <StatValue>{isLoading ? "..." : stats.totalPatients}</StatValue>
              <StatLabel>Total Patients</StatLabel>
            </StatContent>
          </StatHeader>
        </StatCard>

        <StatCard variant="doctors" whileHover={{ scale: 1.02 }}>
          <StatHeader>
            <StatIcon variant="doctors">
              <UserCog size={28} />
            </StatIcon>
            <StatContent>
              <StatValue>{isLoading ? "..." : stats.totalDoctors}</StatValue>
              <StatLabel>Total Doctors</StatLabel>
            </StatContent>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <TabsList>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              $isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon />
              {tab.label}
            </TabButton>
          ))}
        </TabsList>

        <TabContent
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "patients" && <ModernPatientManagement />}
          {activeTab === "doctors" && <ModernDoctorManagement />}
          {activeTab === "schedules" && <ModernAdminScheduleView />}
        </TabContent>
      </TabsContainer>
    </PageContainer>
  );
};

export default ModernAdminDashboard;
