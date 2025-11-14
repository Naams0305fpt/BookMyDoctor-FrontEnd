import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { Calendar, Users } from "lucide-react";
import { theme } from "../../styles/theme";
import ModernDoctorScheduleView from "../doctor/ModernDoctorScheduleView";
import ModernAppointmentTable from "../doctor/ModernAppointmentTable";

type TabId = "schedule" | "appointments";

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

const Title = styled.h1`
  font-size: ${theme.typography.fontSize["3xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing[2]} 0;

  @media (max-width: 768px) {
    font-size: ${theme.typography.fontSize["2xl"]};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const TabsContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.colors.shadow.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing[6]};
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 2px solid ${theme.colors.gray[200]};
  padding: 0 ${theme.spacing[6]};
  gap: ${theme.spacing[2]};

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing[4]};
  }
`;

const TabButton = styled(motion.button)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.primary.teal : theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  transition: color ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    color: ${theme.colors.primary.teal};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.primary.teal};
    transform: scaleX(${({ $isActive }) => ($isActive ? 1 : 0)});
    transition: transform ${theme.transitions.duration.normal}
      ${theme.transitions.easing.default};
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    font-size: ${theme.typography.fontSize.sm};

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const TabContent = styled(motion.div)`
  padding: ${theme.spacing[6]};

  @media (max-width: 768px) {
    padding: ${theme.spacing[4]};
  }
`;

const ModernDoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("schedule");

  const tabs = [
    { id: "schedule" as const, label: "My Schedule", icon: Calendar },
    { id: "appointments" as const, label: "Appointments", icon: Users },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <Title>Doctor Dashboard</Title>
        <Subtitle>Manage your schedule and patient appointments</Subtitle>
      </PageHeader>

      <TabsContainer>
        <TabsList>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              $isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
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
          transition={{ duration: 0.2 }}
        >
          {activeTab === "schedule" ? (
            <ModernDoctorScheduleView />
          ) : (
            <ModernAppointmentTable />
          )}
        </TabContent>
      </TabsContainer>
    </PageContainer>
  );
};

export default ModernDoctorDashboard;
