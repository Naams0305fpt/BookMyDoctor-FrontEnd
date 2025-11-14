import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Key,
  Mail,
  Shield,
  Loader,
  LogOut,
  Phone,
  Clock,
  Edit,
  Calendar,
  AlertTriangle,
  Bell,
  Settings as SettingsIcon,
  Globe,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { Navigate, useNavigate } from "react-router-dom";
import authApi from "../../services/api/auth.api";
import { theme } from "../../styles/theme";

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding-top: calc(80px + ${theme.spacing[8]});
  padding-bottom: ${theme.spacing[12]};
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.fontSize["4xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};

  svg {
    width: 40px;
    height: 40px;
    color: ${theme.colors.primary.teal};
  }
`;

const PageSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
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
  background: ${theme.colors.gray[50]};

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: ${({ $isActive }) =>
    $isActive ? "white" : theme.colors.gray[50]};
  border: none;
  cursor: pointer;
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${({ $isActive }) =>
    $isActive ? theme.colors.primary.teal : theme.colors.text.secondary};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};
  position: relative;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: white;
    color: ${theme.colors.primary.teal};
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
    }
  `}

  @media (max-width: 640px) {
    justify-content: flex-start;
  }
`;

const ContentCard = styled(motion.div)`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[8]};
  box-shadow: ${theme.colors.shadow.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};

  svg {
    width: 28px;
    height: 28px;
    color: ${theme.colors.primary.teal};
  }

  &.danger svg {
    color: #ef4444;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
`;

const InfoItem = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing[2]};
    text-transform: uppercase;
    letter-spacing: 0.5px;

    svg {
      width: 16px;
      height: 16px;
      color: ${theme.colors.primary.teal};
    }
  }
`;

const InfoValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Badge = styled.span<{ $variant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: capitalize;

  ${({ $variant }) => {
    switch ($variant) {
      case "admin":
        return `
          background: #8B5CF615;
          color: #8B5CF6;
        `;
      case "doctor":
        return `
          background: ${theme.colors.primary.teal}15;
          color: ${theme.colors.primary.teal};
        `;
      case "patient":
        return `
          background: #10B98115;
          color: #10B981;
        `;
      default:
        return `
          background: #10B98115;
          color: #10B981;
        `;
    }
  }}
`;

const InfoNote = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.primary.teal}10;
  border-radius: ${theme.borderRadius.lg};
  border-left: 4px solid ${theme.colors.primary.teal};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[8]};

  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.primary.teal};
    flex-shrink: 0;
  }
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary.teal};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;

  &:hover {
    color: ${theme.colors.primary.dark};
  }
`;

const SettingsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[5]};
  border: 2px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover {
    border-color: ${theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing[4]};
  }
`;

const SettingInfo = styled.div`
  flex: 1;

  h3 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing[1]};
  }

  p {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
  }
`;

const Button = styled(motion.button)<{ $variant?: "primary" | "secondary" | "danger" }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  ${({ $variant }) => {
    switch ($variant) {
      case "danger":
        return `
          background: #EF444415;
          color: #EF4444;
          &:hover:not(:disabled) {
            background: #EF4444;
            color: white;
          }
        `;
      case "secondary":
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[200]};
          }
        `;
      default:
        return `
          background: ${theme.colors.primary.teal};
          color: white;
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.dark};
            transform: translateY(-2px);
            box-shadow: ${theme.colors.shadow.md};
          }
        `;
    }
  }}
`;

const DangerZone = styled.div`
  padding: ${theme.spacing[5]};
  border: 2px solid #ef4444;
  border-radius: ${theme.borderRadius.lg};
  background: #fef2f2;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing[4]};
  }
`;

const SectionSubtitle = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[4]};
  margin-top: ${theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  svg {
    width: 24px;
    height: 24px;
    color: ${theme.colors.primary.teal};
  }
`;

const SelectInput = styled.select`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 56px;
  height: 32px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background: ${theme.colors.primary.teal};
    }

    &:checked + .slider:before {
      transform: translateX(24px);
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.gray[300]};
    border-radius: 32px;
    transition: all ${theme.transitions.duration.normal}
      ${theme.transitions.easing.default};

    &:before {
      content: "";
      position: absolute;
      height: 24px;
      width: 24px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: all ${theme.transitions.duration.normal}
        ${theme.transitions.easing.default};
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[6]};

  label {
    display: block;
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing[2]};

    .required {
      color: #ef4444;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;

  svg.input-icon {
    position: absolute;
    left: ${theme.spacing[4]};
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: ${theme.colors.text.secondary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[12]};
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

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  padding: 0;
  display: flex;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: ${theme.colors.primary.teal};
  }
`;

const InputHint = styled.span`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin-top: ${theme.spacing[2]};
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[4]};
  border: 1px solid #fcc;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

type TabId = "account" | "password" | "preferences";

const ModernSettings: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>("account");

  // Password change states
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI control states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");

  // Preferences states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!CurrentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePasswordAfterLogin({
        CurrentPassword: CurrentPassword,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });

      showNotification(
        "success",
        "Password Changed Successfully",
        "Your password has been updated. You will be redirected to the home page."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const error = err as Error & { response?: { data?: { field?: string; message?: string } | string } };
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === "object" && errorData.field && errorData.message) {
          setError(errorData.message);
        } else if (typeof errorData === "string") {
          setError(errorData);
        } else {
          setError(error.message || "Failed to change password.");
        }
      } else {
        setError(error.message || "Failed to change password.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    showNotification(
      "success",
      "Logged Out",
      "You have been logged out successfully."
    );
  };

  return (
    <PageContainer>
      <Container>
        <PageHeader>
          <PageTitle>
            <SettingsIcon />
            Settings
          </PageTitle>
          <PageSubtitle>
            Manage your account settings and preferences
          </PageSubtitle>
        </PageHeader>

        <TabsContainer>
          <TabsList>
            <TabButton
              $isActive={activeTab === "account"}
              onClick={() => setActiveTab("account")}
            >
              <User />
              Account Info
            </TabButton>
            <TabButton
              $isActive={activeTab === "preferences"}
              onClick={() => setActiveTab("preferences")}
            >
              <SettingsIcon />
              Preferences
            </TabButton>
            <TabButton
              $isActive={activeTab === "password"}
              onClick={() => {
                setActiveTab("password");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
              }}
            >
              <Lock />
              Change Password
            </TabButton>
          </TabsList>
        </TabsContainer>

        {/* Account Info Tab */}
        {activeTab === "account" && (
          <ContentCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SectionTitle>
              <User />
              Account Information
            </SectionTitle>

            <InfoGrid>
              <InfoItem>
                <label>
                  <Mail /> Email Address
                </label>
                <InfoValue>{user?.email || "N/A"}</InfoValue>
              </InfoItem>

              <InfoItem>
                <label>
                  <User /> Full Name
                </label>
                <InfoValue>{user?.name || "N/A"}</InfoValue>
              </InfoItem>

              <InfoItem>
                <label>
                  <Phone /> Phone Number
                </label>
                <InfoValue>{user?.phone || "Not set"}</InfoValue>
              </InfoItem>

              <InfoItem>
                <label>
                  <Shield /> Account Type
                </label>
                <InfoValue>
                  <Badge $variant={user?.userType || ""}>
                    {user?.userType
                      ? user.userType.charAt(0).toUpperCase() +
                        user.userType.slice(1)
                      : "N/A"}
                  </Badge>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <label>
                  <Clock /> Account Status
                </label>
                <InfoValue>
                  <Badge $variant="verified">
                    <CheckCircle style={{ width: "16px", height: "16px" }} />
                    Active
                  </Badge>
                </InfoValue>
              </InfoItem>

              <InfoItem>
                <label>
                  <Calendar /> Member Since
                </label>
                <InfoValue>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </InfoValue>
              </InfoItem>
            </InfoGrid>

            <InfoNote>
              <Edit />
              <span>
                Want to update your personal information?{" "}
                <LinkButton onClick={() => navigate("/profile")}>
                  Go to Full Profile
                </LinkButton>
              </span>
            </InfoNote>

            <SectionTitle>
              <LogOut />
              Account Actions
            </SectionTitle>
            <SettingsGroup>
              <SettingItem>
                <SettingInfo>
                  <h3>Edit Profile</h3>
                  <p>Update your personal information and preferences</p>
                </SettingInfo>
                <Button
                  $variant="secondary"
                  onClick={() => navigate("/profile")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit />
                  Edit Profile
                </Button>
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <h3>Logout</h3>
                  <p>Sign out of your account</p>
                </SettingInfo>
                <Button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut />
                  Logout
                </Button>
              </SettingItem>
            </SettingsGroup>

            <SectionTitle className="danger" style={{ marginTop: theme.spacing[8] }}>
              <AlertTriangle />
              Danger Zone
            </SectionTitle>
            <DangerZone>
              <SettingInfo>
                <h3>Delete Account</h3>
                <p>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </SettingInfo>
              <Button
                $variant="danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone!"
                    )
                  ) {
                    showNotification(
                      "info",
                      "Feature Not Available",
                      "Account deletion is not yet implemented. Please contact support."
                    );
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AlertTriangle />
                Delete Account
              </Button>
            </DangerZone>
          </ContentCard>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <ContentCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SectionTitle>
              <SettingsIcon />
              Preferences
            </SectionTitle>

            <SectionSubtitle>
              <Globe />
              Language & Region
            </SectionSubtitle>
            <SettingsGroup>
              <SettingItem>
                <SettingInfo>
                  <h3>Language</h3>
                  <p>Choose your preferred language</p>
                </SettingInfo>
                <SelectInput
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    const langName =
                      e.target.value === "en" ? "English" : "Tiếng Việt";
                    showNotification(
                      "success",
                      "🌐 Language Updated",
                      `Display language changed to ${langName}. Please refresh the page to see changes.`
                    );
                  }}
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </SelectInput>
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <h3>Timezone</h3>
                  <p>Set your local timezone for appointments</p>
                </SettingInfo>
                <SelectInput
                  value={timezone}
                  onChange={(e) => {
                    setTimezone(e.target.value);
                    const tzName =
                      e.target.options[e.target.selectedIndex].text;
                    showNotification(
                      "success",
                      "🕐 Timezone Updated",
                      `Your timezone is now set to ${tzName}. All appointment times will reflect this timezone.`
                    );
                  }}
                >
                  <option value="Asia/Ho_Chi_Minh">(GMT+7) Ho Chi Minh</option>
                  <option value="Asia/Bangkok">(GMT+7) Bangkok</option>
                  <option value="Asia/Singapore">(GMT+8) Singapore</option>
                  <option value="Asia/Tokyo">(GMT+9) Tokyo</option>
                  <option value="America/New_York">(GMT-5) New York</option>
                  <option value="America/Los_Angeles">
                    (GMT-8) Los Angeles
                  </option>
                  <option value="Europe/London">(GMT+0) London</option>
                </SelectInput>
              </SettingItem>
            </SettingsGroup>

            <SectionSubtitle>
              <Bell />
              Notifications
            </SectionSubtitle>
            <SettingsGroup>
              <SettingItem>
                <SettingInfo>
                  <h3>Email Notifications</h3>
                  <p>Receive updates and reminders via email</p>
                </SettingInfo>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => {
                      setEmailNotifications(e.target.checked);
                      showNotification(
                        "success",
                        e.target.checked
                          ? "✅ Email Notifications Enabled"
                          : "❌ Email Notifications Disabled",
                        e.target.checked
                          ? "You will receive appointment updates and reminders via email"
                          : "You will no longer receive email notifications"
                      );
                    }}
                  />
                  <span className="slider"></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <h3>SMS Notifications</h3>
                  <p>Get text messages for important updates</p>
                </SettingInfo>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => {
                      setSmsNotifications(e.target.checked);
                      showNotification(
                        "success",
                        e.target.checked
                          ? "📱 SMS Notifications Enabled"
                          : "📵 SMS Notifications Disabled",
                        e.target.checked
                          ? `Important updates will be sent to ${
                              user?.phone || "your phone"
                            }`
                          : "You will no longer receive SMS alerts"
                      );
                    }}
                  />
                  <span className="slider"></span>
                </ToggleSwitch>
              </SettingItem>

              <SettingItem>
                <SettingInfo>
                  <h3>Appointment Reminders</h3>
                  <p>Get reminded 24 hours before appointments</p>
                </SettingInfo>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={appointmentReminders}
                    onChange={(e) => {
                      setAppointmentReminders(e.target.checked);
                      showNotification(
                        "success",
                        e.target.checked
                          ? "🔔 Appointment Reminders Enabled"
                          : "🔕 Appointment Reminders Disabled",
                        e.target.checked
                          ? "You will be reminded 24 hours before your appointments"
                          : "You will not receive appointment reminders"
                      );
                    }}
                  />
                  <span className="slider"></span>
                </ToggleSwitch>
              </SettingItem>
            </SettingsGroup>
          </ContentCard>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <ContentCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SectionTitle>
              <Lock />
              Change Password
            </SectionTitle>

            {error && (
              <ErrorMessage>
                <AlertTriangle />
                {error}
              </ErrorMessage>
            )}

            <form onSubmit={handlePasswordChange}>
              <FormGroup>
                <label>
                  Current Password <span className="required">*</span>
                </label>
                <InputWrapper>
                  <Lock className="input-icon" />
                  <Input
                    type={showOld ? "text" : "password"}
                    value={CurrentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <EyeOff /> : <Eye />}
                  </TogglePasswordButton>
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <label>
                  New Password <span className="required">*</span>
                </label>
                <InputWrapper>
                  <Key className="input-icon" />
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff /> : <Eye />}
                  </TogglePasswordButton>
                </InputWrapper>
                <InputHint>
                  Min 8 characters, with uppercase, lowercase, number, and
                  special character
                </InputHint>
              </FormGroup>

              <FormGroup>
                <label>
                  Confirm New Password <span className="required">*</span>
                </label>
                <InputWrapper>
                  <Key className="input-icon" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <TogglePasswordButton
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff /> : <Eye />}
                  </TogglePasswordButton>
                </InputWrapper>
              </FormGroup>

              <Button
                type="submit"
                disabled={
                  isChangingPassword ||
                  !CurrentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                style={{ width: "100%" }}
                whileHover={{ scale: isChangingPassword ? 1 : 1.02 }}
                whileTap={{ scale: isChangingPassword ? 1 : 0.98 }}
              >
                {isChangingPassword ? (
                  <>
                    <Loader style={{ animation: "spin 1s linear infinite" }} />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Key />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </ContentCard>
        )}
      </Container>
    </PageContainer>
  );
};

export default ModernSettings;
