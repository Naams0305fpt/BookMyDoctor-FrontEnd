import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import {
  User,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  UserCircle,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import patientApi from "../../services/api/patient.api";
import type { ProfileMeResponse } from "../../types";
import { theme } from "../../styles/theme";
import { Card } from "../../styles/components";

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
  padding-top: calc(80px + ${theme.spacing[8]});
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: ${theme.spacing[6]} ${theme.spacing[4]};
    padding-top: calc(70px + ${theme.spacing[6]});
  }
`;

const ProfileCard = styled(Card)`
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background: ${theme.colors.background.gradient.primary};
  padding: ${theme.spacing[10]} ${theme.spacing[8]};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle,
      ${theme.colors.accent.navy}20 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      ${theme.colors.primary.teal}15 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing[8]} ${theme.spacing[6]};
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background.gradient.cta};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.colors.shadow.xl};
  flex-shrink: 0;

  svg {
    width: 60px;
    height: 60px;
    color: white;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
  color: white;
`;

const UserName = styled.h1`
  font-size: ${theme.typography.fontSize["4xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0 0 ${theme.spacing[2]} 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: black;
`;

const UserRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  margin-right: ${theme.spacing[3]};
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing[3]};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: black;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  color: black;

  svg {
    animation: pulse 2s ease-in-out infinite;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const HeaderActions = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};

  @media (max-width: 768px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const EditButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: white;
  color: ${theme.colors.primary.teal};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${theme.colors.shadow.md};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    box-shadow: ${theme.colors.shadow.lg};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: ${theme.colors.background.gradient.cta};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  box-shadow: ${theme.colors.shadow.md};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    box-shadow: ${theme.colors.shadow.lg};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: white;
  color: ${theme.colors.text.secondary};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:hover:not(:disabled) {
    background: ${theme.colors.gray[100]};
    border-color: ${theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProfileContent = styled.div`
  padding: ${theme.spacing[8]};

  @media (max-width: 768px) {
    padding: ${theme.spacing[6]};
  }
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize["2xl"]};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  &::after {
    content: "";
    flex: 1;
    height: 2px;
    background: linear-gradient(
      to right,
      ${theme.colors.primary.teal}40,
      transparent
    );
  }
`;

const FieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  grid-column: ${(props) => (props.$fullWidth ? "1 / -1" : "auto")};
`;

const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    color: ${theme.colors.primary.teal};
    width: 18px;
    height: 18px;
  }
`;

const FieldValue = styled.div`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.background.secondary};
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  min-height: 48px;
  display: flex;
  align-items: center;
  font-weight: ${theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  transition: all ${theme.transitions.duration.fast}
    ${theme.transitions.easing.default};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.teal};
    box-shadow: 0 0 0 3px ${theme.colors.primary.teal}15;
  }

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }
`;

const Select = styled.select`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[12]};
  gap: ${theme.spacing[4]};
`;

const LoadingSpinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 4px solid ${theme.colors.gray[200]};
  border-top-color: ${theme.colors.primary.teal};
  border-radius: ${theme.borderRadius.full};
`;

const LoadingText = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.lg};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[12]};
  gap: ${theme.spacing[4]};
  color: ${theme.colors.error};
`;

const ModernAdminProfile: React.FC = () => {
  const { updateUser } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileMeResponse | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await patientApi.getProfileMe();
      setProfileData(data);

      setFormData({
        name: data.Name || "",
        email: data.Email || "",
        phone: data.Phone || "",
        gender: data.Gender || "",
        dateOfBirth: data.DateOfBirth || "",
        address: data.Address || "",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile data";
      showNotification("error", "Error", errorMessage, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await patientApi.updateProfileMe({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      });

      updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
      });

      showNotification(
        "success",
        "Profile Updated",
        "Your profile has been successfully updated.",
        3000
      );

      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.";
      showNotification("error", "Update Failed", errorMessage, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.Name || "",
        email: profileData.Email || "",
        phone: profileData.Phone || "",
        gender: profileData.Gender || "",
        dateOfBirth: profileData.DateOfBirth || "",
        address: profileData.Address || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <LoadingText>Loading profile...</LoadingText>
          </LoadingContainer>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  if (!profileData) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <ErrorContainer>
            <X size={48} />
            <p>Failed to load profile data</p>
          </ErrorContainer>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <HeaderContent>
            <Avatar
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <Shield />
            </Avatar>

            <HeaderInfo>
              <UserName>{profileData.Name}</UserName>
              <UserRole>
                <Shield size={16} />
                System Administrator
              </UserRole>
              <StatusBadge>
                <ShieldCheck size={16} />
                Administrator Access
              </StatusBadge>
            </HeaderInfo>

            <HeaderActions>
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <EditButton
                      onClick={() => setIsEditing(true)}
                      disabled={isSaving}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </EditButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save-cancel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ActionButtons>
                      <SaveButton
                        onClick={handleSave}
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save"}
                      </SaveButton>
                      <CancelButton
                        onClick={handleCancel}
                        disabled={isSaving}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={18} />
                        Cancel
                      </CancelButton>
                    </ActionButtons>
                  </motion.div>
                )}
              </AnimatePresence>
            </HeaderActions>
          </HeaderContent>
        </ProfileHeader>

        <ProfileContent>
          <SectionTitle>
            <User size={24} />
            Personal Information
          </SectionTitle>

          <FieldsGrid>
            <Field>
              <FieldLabel>
                <User size={16} />
                Username
              </FieldLabel>
              <FieldValue>{profileData.Username}</FieldValue>
            </Field>

            <Field>
              <FieldLabel>
                <User size={16} />
                Full Name
              </FieldLabel>
              {isEditing ? (
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <FieldValue>{formData.name}</FieldValue>
              )}
            </Field>

            <Field>
              <FieldLabel>
                <UserCircle size={16} />
                Gender
              </FieldLabel>
              {isEditing ? (
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              ) : (
                <FieldValue>{formData.gender || "Not specified"}</FieldValue>
              )}
            </Field>

            <Field>
              <FieldLabel>
                <Calendar size={16} />
                Date of Birth
              </FieldLabel>
              {isEditing ? (
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              ) : (
                <FieldValue>{formatDate(formData.dateOfBirth)}</FieldValue>
              )}
            </Field>

            <Field>
              <FieldLabel>
                <Mail size={16} />
                Email Address
              </FieldLabel>
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              ) : (
                <FieldValue>{formData.email}</FieldValue>
              )}
            </Field>

            <Field>
              <FieldLabel>
                <Phone size={16} />
                Phone Number
              </FieldLabel>
              {isEditing ? (
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+84 123 456 789"
                />
              ) : (
                <FieldValue>{formData.phone}</FieldValue>
              )}
            </Field>

            <Field $fullWidth>
              <FieldLabel>
                <MapPin size={16} />
                Address
              </FieldLabel>
              {isEditing ? (
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              ) : (
                <FieldValue>{formData.address || "Not provided"}</FieldValue>
              )}
            </Field>
          </FieldsGrid>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ModernAdminProfile;
